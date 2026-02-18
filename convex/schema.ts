import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"

// Role union — 3 MVP roles, expandable to 5 (manager, employee) without migration
const roleValidator = v.union(
  v.literal("super_admin"),
  v.literal("admin"),
  v.literal("viewer")
)

// Organisation status
const orgStatusValidator = v.union(
  v.literal("active"),
  v.literal("inactive"),
  v.literal("trial")
)

export default defineSchema({
  // ─── Auth & Multi-Tenancy Tables ──────────────────────────────

  // Client organisations (replaces Blazor "Clients" entity)
  organisations: defineTable({
    name: v.string(),
    contactEmail: v.optional(v.string()),
    contactNumber: v.optional(v.string()),
    abn: v.optional(v.string()),          // Australian Business Number
    channel: v.optional(v.string()),      // Sales pipeline source (e.g. "KPMG")
    createdBy: v.optional(v.id("users")), // Super admin who created it
    status: orgStatusValidator,
    deletedAt: v.optional(v.number()),    // Soft delete timestamp (ms)
  }).index("by_status", ["status"]),

  // Users synced from WorkOS via webhooks
  users: defineTable({
    workosId: v.string(),                 // WorkOS user ID
    email: v.string(),
    name: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
    deletedAt: v.optional(v.number()),    // Soft delete timestamp (ms)
  }).index("by_workosId", ["workosId"])
    .index("by_email", ["email"]),

  // Multi-org membership bridge: user + org + role
  memberships: defineTable({
    userId: v.id("users"),
    orgId: v.id("organisations"),
    role: roleValidator,
    deletedAt: v.optional(v.number()),    // Soft delete timestamp (ms)
  }).index("by_user", ["userId"])
    .index("by_org", ["orgId"])
    .index("by_user_org", ["userId", "orgId"]),

  // ─── Core Data Tables ─────────────────────────────────────────

  // Core system table — orgId added for tenancy boundary
  systems: defineTable({
    name: v.string(),
    sector: v.optional(v.string()),
    impact: v.string(),      // Purpose/Vision statement
    dimension: v.string(),   // Delivery culture statement
    challenge: v.string(),   // System context statement
    orgId: v.optional(v.id("organisations")),  // Tenancy boundary (optional during migration)
    deletedAt: v.optional(v.number()),          // Soft delete timestamp (ms)
  }).index("by_org", ["orgId"]),

  // Elements: outcomes, value_chain, resources
  elements: defineTable({
    systemId: v.id("systems"),
    elementType: v.union(
      v.literal("outcome"),
      v.literal("value_chain"),
      v.literal("resource")
    ),
    content: v.string(),
    description: v.optional(v.string()),
    orderIndex: v.number(),
    gradientValue: v.optional(v.number()), // 0-100 KPI health
    color: v.optional(v.union(v.literal("primary"), v.literal("secondary"), v.literal("accent"), v.literal("muted"))),
  }).index("by_system", ["systemId"])
    .index("by_system_type", ["systemId", "elementType"]),

  // Matrix cells: contribution, development, convergence
  matrixCells: defineTable({
    systemId: v.id("systems"),
    matrixType: v.union(
      v.literal("contribution"),
      v.literal("development"),
      v.literal("convergence")
    ),
    rowElementId: v.id("elements"),  // Value Chain element
    colElementId: v.string(),        // Element ID or External Value ID (polymorphic)
    content: v.string(),
    color: v.optional(v.string()),
    gradient: v.optional(v.number()),
  }).index("by_system_type", ["systemId", "matrixType"])
    .index("by_row", ["systemId", "matrixType", "rowElementId"]),

  // KPIs linked to elements
  kpis: defineTable({
    systemId: v.id("systems"),
    parentId: v.id("elements"),
    content: v.string(),
    orderIndex: v.number(),
  }).index("by_parent", ["parentId"])
    .index("by_system", ["systemId"]),

  // Capabilities (current/necessary per resource)
  capabilities: defineTable({
    systemId: v.id("systems"),
    resourceId: v.id("elements"),
    capabilityType: v.union(v.literal("current"), v.literal("necessary")),
    content: v.string(),
  }).index("by_system_type", ["systemId", "capabilityType"])
    .index("by_resource", ["resourceId"]),

  // External values (for Convergence Map columns)
  externalValues: defineTable({
    systemId: v.id("systems"),
    content: v.string(),      // Title
    description: v.optional(v.string()),
    orderIndex: v.number(),
  }).index("by_system", ["systemId"]),

  // Factors per value chain element
  factors: defineTable({
    systemId: v.id("systems"),
    valueChainId: v.id("elements"),
    content: v.string(),
  }).index("by_system", ["systemId"])
    .index("by_value_chain", ["valueChainId"]),

  // Portfolios - linked to nodes (elements), associated with strategic initiatives
  portfolios: defineTable({
    systemId: v.id("systems"),
    elementId: v.id("elements"),
    title: v.string(),
    description: v.optional(v.string()),
    date: v.string(),
    progress: v.number(),
    status: v.union(
      v.literal("planning"),
      v.literal("active"),
      v.literal("completed")
    ),
    orderIndex: v.number(),
  })
    .index("by_system", ["systemId"])
    .index("by_element", ["elementId"]),
})
