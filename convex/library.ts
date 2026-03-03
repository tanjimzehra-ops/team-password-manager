import { v } from "convex/values";
import { mutation, query, internalMutation, internalQuery } from "./_generated/server";
import { Id } from "./_generated/dataModel";

/**
 * Fetches all elements from the platform library (all non-deleted systems).
 * Includes system name to help identify the source.
 */
export const getLibraryElements = query({
    args: {},
    handler: async (ctx) => {
        const systems = await ctx.db
            .query("systems")
            .filter((q) => q.and(
                q.eq(q.field("deletedAt"), undefined),
                q.eq(q.field("isPublicLibrary"), true)
            ))
            .collect();

        const results = [];
        for (const system of systems) {
            const elements = await ctx.db
                .query("elements")
                .withIndex("by_system", (q) => q.eq("systemId", system._id))
                .collect();

            results.push(...elements.map(el => ({
                ...el,
                systemName: system.libraryCategory ?? "Standard Templates"
            })));
        }
        return results;
    },
});

/**
 * Copies elements from the Master Library to a target system.
 * This is the "Copy" operation — simple duplication.
 */
export const copyElements = mutation({
    args: {
        targetSystemId: v.id("systems"),
        elementIds: v.array(v.id("elements")),
    },
    handler: async (ctx, args) => {
        const { targetSystemId, elementIds } = args;

        // Get target system's existing elements of each type to determine new orderIndex
        const elementsByType = await Promise.all(
            ["outcome", "value_chain", "resource"].map(type =>
                ctx.db.query("elements")
                    .withIndex("by_system_type", q => q.eq("systemId", targetSystemId).eq("elementType", type as any))
                    .collect()
            )
        );

        const maxIndices: Record<string, number> = {
            outcome: elementsByType[0].length,
            value_chain: elementsByType[1].length,
            resource: elementsByType[2].length,
        };

        for (const sourceId of elementIds) {
            const sourceEl = await ctx.db.get(sourceId);
            if (!sourceEl) continue;

            const type = sourceEl.elementType;
            await ctx.db.insert("elements", {
                systemId: targetSystemId,
                elementType: type,
                content: sourceEl.content,
                description: sourceEl.description,
                orderIndex: maxIndices[type]++,
                gradientValue: 100, // Default for new copies
                color: sourceEl.color ?? "none",
            });
        }
    },
});

/**
 * Connects elements from the Master Library into a target system.
 * This copies the elements and ALL their pre-defined relationships in the Master System.
 */
export const connectElements = mutation({
    args: {
        targetSystemId: v.id("systems"),
        elementIds: v.array(v.id("elements")),
    },
    handler: async (ctx, args) => {
        const { targetSystemId, elementIds } = args;

        // 1. Fetch current elements in the target system for reference mapping
        const existingElements = await ctx.db
            .query("elements")
            .withIndex("by_system", (q) => q.eq("systemId", targetSystemId))
            .collect();

        // Map content -> targetId so we can find existing nodes that match master content
        const contentMap = new Map<string, Id<"elements">>();
        existingElements.forEach(el => contentMap.set(el.content, el._id));

        // 2. Determine base order indices
        const maxIndices: Record<string, number> = {
            outcome: (await ctx.db.query("elements").withIndex("by_system_type", q => q.eq("systemId", targetSystemId).eq("elementType", "outcome")).collect()).length,
            value_chain: (await ctx.db.query("elements").withIndex("by_system_type", q => q.eq("systemId", targetSystemId).eq("elementType", "value_chain")).collect()).length,
            resource: (await ctx.db.query("elements").withIndex("by_system_type", q => q.eq("systemId", targetSystemId).eq("elementType", "resource")).collect()).length,
        };

        // 3. Import Selected Elements and Map IDs
        const masterToTargetMap = new Map<Id<"elements">, Id<"elements">>();

        for (const masterId of elementIds) {
            const masterEl = await ctx.db.get(masterId);
            if (!masterEl) continue;

            // Check if it already exists by content
            let targetId = contentMap.get(masterEl.content);

            if (!targetId) {
                // Create it
                const type = masterEl.elementType;
                targetId = await ctx.db.insert("elements", {
                    systemId: targetSystemId,
                    elementType: type,
                    content: masterEl.content,
                    description: masterEl.description,
                    orderIndex: maxIndices[type]++,
                    gradientValue: masterEl.gradientValue ?? 100,
                    color: masterEl.color ?? "none",
                });
            }
            masterToTargetMap.set(masterId, targetId);

            // Also copy metadata: KPIs, Factors, Capabilities
            await copyMetadata(ctx, masterId, targetId, targetSystemId);
        }

        // 4. Comprehensive Wiring: Import Matrix Cells
        // Group selected items by their source system so we can pull relevant matrix cells
        const sourceSystemIds = new Set<Id<"systems">>();
        for (const id of elementIds) {
            const el = await ctx.db.get(id);
            if (el) sourceSystemIds.add(el.systemId);
        }

        for (const masterSystemId of Array.from(sourceSystemIds)) {

            for (const type of ["contribution", "development", "convergence"] as const) {
                const masterCells = await ctx.db
                    .query("matrixCells")
                    .withIndex("by_system_type", q => q.eq("systemId", masterSystemId).eq("matrixType", type))
                    .collect();

                for (const cell of masterCells) {
                    // If row is in our map and col is in our map, connect them in the target
                    const targetRowId = masterToTargetMap.get(cell.rowElementId);

                    let targetColId: string | undefined;
                    // Col ID might be typed as string or Id<"elements">
                    // If it's an element ID from the master, we map it
                    if (type === "convergence") {
                        // In convergence, colElementId is likely an ExternalValue ID
                        // We'd need to map those too if we wanted full convergence parity
                        // For now, focus on logic grid connections (contribution/development)
                    } else {
                        targetColId = masterToTargetMap.get(cell.colElementId as Id<"elements">);
                    }

                    if (targetRowId && targetColId) {
                        // Check if link already exists in target
                        const existingCell = await ctx.db
                            .query("matrixCells")
                            .withIndex("by_row", q => q.eq("systemId", targetSystemId).eq("matrixType", type).eq("rowElementId", targetRowId))
                            .filter(q => q.eq(q.field("colElementId"), targetColId))
                            .first();

                        if (!existingCell) {
                            await ctx.db.insert("matrixCells", {
                                systemId: targetSystemId,
                                matrixType: type,
                                rowElementId: targetRowId,
                                colElementId: targetColId,
                                content: cell.content,
                                color: cell.color,
                                gradient: cell.gradient,
                            });
                        }
                    }
                }
            }
        }
    },
});

/**
 * Helper to copy KPIs, Factors and Capabilities for a node
 */
async function copyMetadata(ctx: any, sourceId: Id<"elements">, targetId: Id<"elements">, systemId: Id<"systems">) {
    // KPIs
    const kpis = await ctx.db.query("kpis").withIndex("by_parent", (q: any) => q.eq("parentId", sourceId)).collect();
    for (const k of kpis) {
        await ctx.db.insert("kpis", { systemId, parentId: targetId, content: k.content, orderIndex: k.orderIndex });
    }

    // Factors
    const factors = await ctx.db.query("factors").withIndex("by_value_chain", (q: any) => q.eq("valueChainId", sourceId)).collect();
    for (const f of factors) {
        await ctx.db.insert("factors", { systemId, valueChainId: targetId, content: f.content });
    }

    // Capabilities
    const caps = await ctx.db.query("capabilities").withIndex("by_resource", (q: any) => q.eq("resourceId", sourceId)).collect();
    for (const c of caps) {
        await ctx.db.insert("capabilities", { systemId, resourceId: targetId, capabilityType: c.capabilityType, content: c.content });
    }
}

/**
 * Seeds a "Standard Templates" system with placeholder cards.
 * Requested: 5 Outcomes, 10 Value Chain, 10 Resources.
 */
export const seedStandardTemplate = mutation({
    args: {},
    handler: async (ctx) => {
        // 0. Cleanup existing Standard Templates to avoid duplicates
        const existingSystems = await ctx.db
            .query("systems")
            .filter(q => q.or(
                q.eq(q.field("libraryCategory"), "Standard Templates"),
                q.eq(q.field("name"), "Standard Templates")
            ))
            .collect();

        for (const sys of existingSystems) {
            const elements = await ctx.db
                .query("elements")
                .withIndex("by_system", q => q.eq("systemId", sys._id))
                .collect();
            for (const el of elements) {
                await ctx.db.delete(el._id);
                // Also clean up associated metadata
                const kpis = await ctx.db.query("kpis").withIndex("by_parent", q => q.eq("parentId", el._id)).collect();
                for (const k of kpis) await ctx.db.delete(k._id);
                const factors = await ctx.db.query("factors").withIndex("by_value_chain", q => q.eq("valueChainId", el._id)).collect();
                for (const f of factors) await ctx.db.delete(f._id);
                const caps = await ctx.db.query("capabilities").withIndex("by_resource", q => q.eq("resourceId", el._id)).collect();
                for (const c of caps) await ctx.db.delete(c._id);
            }
            await ctx.db.delete(sys._id);
        }

        // 1. Create the system
        const systemId = await ctx.db.insert("systems", {
            name: "Standard Templates",
            impact: "A repository of common logic model elements to jumpstart your system design.",
            dimension: "Standardised framework",
            challenge: "Initial brainstorming and structure",
            isPublicLibrary: true,
            libraryCategory: "Standard Templates",
        });

        // 2. Add elements
        const elements = [
            // Outcomes (Strategic Objectives)
            ...[
                "Better health", "Financial stability", "Housing security", "Social connection",
                "Personal safety", "Life skills", "Employment", "Educational success",
                "Resilience", "Community involvement", "Legal rights", "Environmental health",
                "Family wellbeing", "Quality of life", "Self-determination", "Digital literacy",
                "Civic participation", "Cultural identity", "Personal fulfillment", "Freedom"
            ].map(content => ({
                elementType: "outcome" as const,
                content,
                description: "A standard strategic objective."
            })),
            // Value Chain Elements
            ...[
                "Community outreach", "Awareness campaigns", "Digital engagement", "Initial screening",
                "Triage & referral", "Comprehensive assessment", "Plan development", "Service navigation",
                "Clinical support", "Counseling", "Crisis intervention", "Resource allocation",
                "Skill-building", "Vocational training", "Job placement", "Peer support",
                "Advocacy", "Emergency aid", "Family mediation", "Progress monitoring",
                "Outcomes measurement", "Client feedback", "Quality assurance", "Transition planning",
                "Aftercare", "Alumni network", "Data analysis", "Process improvement"
            ].map(content => ({
                elementType: "value_chain" as const,
                content,
                description: "A standard operational process."
            })),
            // Resources, Capabilities / Levers
            ...[
                "Specialist staff", "Multidisciplinary teams", "Trained volunteers", "Lived experience mentors",
                "Operational funding", "Government grants", "Philanthropic donations", "Fee-for-service",
                "Corporate partnerships", "Service centers", "Community hubs", "Outreach vehicles",
                "IT infrastructure", "Case management software", "Client mobile apps", "Data analytics platform",
                "Proprietary methodologies", "Intellectual property", "Brand reputation", "Strategic alliances",
                "Referral networks", "Governance frameworks", "Quality certification", "R&D lab",
                "Equipment pool", "Relief stock", "Digital library", "Training curricula"
            ].map(content => ({
                elementType: "resource" as const,
                content,
                description: "A standard capability or resource."
            }))
        ];

        for (let i = 0; i < elements.length; i++) {
            const el = elements[i];
            await ctx.db.insert("elements", {
                systemId,
                elementType: el.elementType,
                content: el.content,
                description: el.description,
                orderIndex: i,
                gradientValue: 100,
                color: "none",
            });
        }

        return systemId;
    },
});
