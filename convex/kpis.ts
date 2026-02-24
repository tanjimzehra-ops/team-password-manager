import { query, mutation } from "./_generated/server"
import { v } from "convex/values"
import { withWriteAccess } from "./lib/mutations"
import { withReadAccess } from "./lib/queries"

export const bySystem = query({
  args: { systemId: v.id("systems") },
  handler: async (ctx, args) => {
    await withReadAccess(ctx, args.systemId)
    return await ctx.db
      .query("kpis")
      .withIndex("by_system", (q) => q.eq("systemId", args.systemId))
      .collect()
  },
})

export const byParent = query({
  args: { parentId: v.id("elements") },
  handler: async (ctx, args) => {
    // Resolve the parent element's systemId for access control
    const parent = await ctx.db.get(args.parentId)
    if (!parent) throw new Error("Parent element not found")
    await withReadAccess(ctx, parent.systemId)
    return await ctx.db
      .query("kpis")
      .withIndex("by_parent", (q) => q.eq("parentId", args.parentId))
      .collect()
  },
})

export const create = mutation({
  args: {
    systemId: v.id("systems"),
    parentId: v.id("elements"),
    content: v.string(),
    orderIndex: v.number(),
  },
  handler: async (ctx, args) => {
    return withWriteAccess(ctx, args.systemId, "kpi.create", "kpi", async () => {
      const kpiId = await ctx.db.insert("kpis", args)
      return kpiId
    })
  },
})

export const update = mutation({
  args: {
    id: v.id("kpis"),
    content: v.optional(v.string()),
    orderIndex: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const kpi = await ctx.db.get(args.id)
    if (!kpi) throw new Error("KPI not found")
    
    return withWriteAccess(ctx, kpi.systemId, "kpi.update", "kpi", async () => {
      const { id, ...fields } = args
      const updates: Record<string, unknown> = {}
      for (const [key, value] of Object.entries(fields)) {
        if (value !== undefined) {
          updates[key] = value
        }
      }
      await ctx.db.patch(id, updates)
    })
  },
})

export const remove = mutation({
  args: { id: v.id("kpis") },
  handler: async (ctx, args) => {
    const kpi = await ctx.db.get(args.id)
    if (!kpi) throw new Error("KPI not found")
    
    return withWriteAccess(ctx, kpi.systemId, "kpi.delete", "kpi", async () => {
      await ctx.db.delete(args.id)
    })
  },
})

export const replaceForParent = mutation({
  args: {
    systemId: v.id("systems"),
    parentId: v.id("elements"),
    kpis: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    return withWriteAccess(ctx, args.systemId, "kpi.bulkReplace", "kpi", async () => {
      // Delete all existing KPIs for this parent
      const existing = await ctx.db
        .query("kpis")
        .withIndex("by_parent", (q) => q.eq("parentId", args.parentId))
        .collect()
      for (const kpi of existing) {
        await ctx.db.delete(kpi._id)
      }
      // Create new KPIs
      for (let i = 0; i < args.kpis.length; i++) {
        await ctx.db.insert("kpis", {
          systemId: args.systemId,
          parentId: args.parentId,
          content: args.kpis[i],
          orderIndex: i,
        })
      }
    })
  },
})
