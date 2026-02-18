import { query, mutation } from "./_generated/server"
import { v } from "convex/values"
import {
  getCurrentUser,
  requireAuth,
  requireWriteAccess,
  getAccessibleOrgIds,
  canAccessSystem,
} from "./lib/permissions"

/**
 * List systems visible to the current user.
 * - Unauthenticated: returns all non-deleted systems (legacy/migration support)
 * - Authenticated: returns systems in user's orgs + legacy systems (no orgId)
 * - Super admin: returns all non-deleted systems
 */
export const list = query({
  args: {},
  handler: async (ctx) => {
    const allSystems = await ctx.db.query("systems").collect()
    const activeSystems = allSystems.filter((s) => !s.deletedAt)

    const user = await getCurrentUser(ctx)
    if (!user) {
      // Unauthenticated: show legacy systems only (no orgId)
      return activeSystems
        .filter((s) => !s.orgId)
        .map((s) => ({ _id: s._id, name: s.name, sector: s.sector }))
    }

    const { orgIds, isSuperAdmin } = await getAccessibleOrgIds(ctx, user._id)

    if (isSuperAdmin) {
      return activeSystems.map((s) => ({
        _id: s._id,
        name: s.name,
        sector: s.sector,
        orgId: s.orgId,
      }))
    }

    // User sees: legacy systems (no orgId) + their org's systems
    return activeSystems
      .filter((s) => !s.orgId || orgIds.includes(s.orgId))
      .map((s) => ({ _id: s._id, name: s.name, sector: s.sector, orgId: s.orgId }))
  },
})

/**
 * Get a single system by ID (with access check).
 */
export const get = query({
  args: { id: v.id("systems") },
  handler: async (ctx, args) => {
    const system = await ctx.db.get(args.id)
    if (!system || system.deletedAt) return null

    const user = await getCurrentUser(ctx)
    // Legacy systems (no orgId) are readable without auth
    if (!system.orgId) return system
    // Org-scoped systems require auth
    if (!user) return null
    if (!(await canAccessSystem(ctx, user._id, args.id))) return null

    return system
  },
})

/**
 * Get full system with all related data (with access check).
 */
export const getFullSystem = query({
  args: { id: v.id("systems") },
  handler: async (ctx, args) => {
    const system = await ctx.db.get(args.id)
    if (!system || system.deletedAt) return null

    const user = await getCurrentUser(ctx)
    if (system.orgId) {
      if (!user) return null
      if (!(await canAccessSystem(ctx, user._id, args.id))) return null
    }

    const [elements, matrixCells, kpis, capabilities, externalValues, factors, portfolios] =
      await Promise.all([
        ctx.db
          .query("elements")
          .withIndex("by_system", (q) => q.eq("systemId", args.id))
          .collect(),
        ctx.db
          .query("matrixCells")
          .withIndex("by_system_type", (q) => q.eq("systemId", args.id))
          .collect(),
        ctx.db
          .query("kpis")
          .withIndex("by_system", (q) => q.eq("systemId", args.id))
          .collect(),
        ctx.db
          .query("capabilities")
          .withIndex("by_system_type", (q) => q.eq("systemId", args.id))
          .collect(),
        ctx.db
          .query("externalValues")
          .withIndex("by_system", (q) => q.eq("systemId", args.id))
          .collect(),
        ctx.db
          .query("factors")
          .withIndex("by_system", (q) => q.eq("systemId", args.id))
          .collect(),
        ctx.db
          .query("portfolios")
          .withIndex("by_system", (q) => q.eq("systemId", args.id))
          .collect(),
      ])

    return {
      ...system,
      elements,
      matrixCells,
      kpis,
      capabilities,
      externalValues,
      factors,
      portfolios,
    }
  },
})

/**
 * Create a new system. Requires auth + admin/super_admin role.
 * orgId is optional during migration but will be required post-Block 5.
 */
export const create = mutation({
  args: {
    name: v.string(),
    sector: v.optional(v.string()),
    impact: v.string(),
    dimension: v.string(),
    challenge: v.string(),
    orgId: v.optional(v.id("organisations")),
  },
  handler: async (ctx, args) => {
    const user = await requireAuth(ctx)

    // If orgId provided, verify admin/super_admin in that org
    if (args.orgId) {
      const { requireRole } = await import("./lib/permissions")
      await requireRole(ctx, user._id, args.orgId, ["admin", "super_admin"])
    }

    return await ctx.db.insert("systems", args)
  },
})

/**
 * Update a system. Requires auth + write access.
 */
export const update = mutation({
  args: {
    id: v.id("systems"),
    name: v.optional(v.string()),
    sector: v.optional(v.string()),
    impact: v.optional(v.string()),
    dimension: v.optional(v.string()),
    challenge: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await requireAuth(ctx)
    await requireWriteAccess(ctx, user._id, args.id)

    const { id, ...fields } = args
    const updates: Record<string, string> = {}
    for (const [key, value] of Object.entries(fields)) {
      if (value !== undefined) {
        updates[key] = value
      }
    }
    await ctx.db.patch(id, updates)
  },
})

/**
 * Soft delete a system. Requires auth + admin/super_admin.
 */
export const remove = mutation({
  args: { id: v.id("systems") },
  handler: async (ctx, args) => {
    const user = await requireAuth(ctx)
    await requireWriteAccess(ctx, user._id, args.id)

    // Soft delete instead of hard delete
    await ctx.db.patch(args.id, { deletedAt: Date.now() })
  },
})

/**
 * Restore a soft-deleted system. Requires auth + admin/super_admin.
 */
export const restore = mutation({
  args: { id: v.id("systems") },
  handler: async (ctx, args) => {
    const user = await requireAuth(ctx)
    const system = await ctx.db.get(args.id)
    if (!system) throw new Error("System not found")

    // Check org access if system has orgId
    if (system.orgId) {
      const { requireRole } = await import("./lib/permissions")
      await requireRole(ctx, user._id, system.orgId, ["admin", "super_admin"])
    }

    await ctx.db.patch(args.id, { deletedAt: undefined })
  },
})
