import { query, mutation } from "./_generated/server"
import { v } from "convex/values"
import {
  getCurrentUser,
  requireAuth,
  isSuperAdmin,
  isChannelPartner,
  getOrgMembership,
  getPartnerChannelIds,
  requireRole,
  requireWriteAccess,
  getAccessibleOrgIds,
  canAccessSystem,
} from "./lib/permissions"
import { logAudit } from "./auditLogs"

/**
 * List systems visible to the current user.
 * - Authenticated: returns systems in user's accessible orgs
 * - Super admin: returns all non-deleted systems
 */
export const list = query({
  args: {},
  handler: async (ctx) => {
    const allSystems = await ctx.db.query("systems").collect()
    const activeSystems = allSystems.filter((s) => !s.deletedAt)

    const user = await requireAuth(ctx)

    const { orgIds, isSuperAdmin } = await getAccessibleOrgIds(ctx, user._id)

    // Join with orgs to get org name
    const orgs = await ctx.db.query("organisations").collect()
    const orgMap = new Map(orgs.map((o) => [o._id.toString(), o.name]))

    if (isSuperAdmin) {
      return activeSystems.map((s) => ({
        _id: s._id,
        name: s.name,
        sector: s.sector,
        orgId: s.orgId,
        orgName: s.orgId ? (orgMap.get(s.orgId.toString()) ?? "Unknown") : undefined,
      }))
    }

    // User sees systems in their accessible orgs.
    return activeSystems
      .filter((s) => !!s.orgId && orgIds.includes(s.orgId))
      .map((s) => ({
        _id: s._id,
        name: s.name,
        sector: s.sector,
        orgId: s.orgId,
        orgName: s.orgId ? (orgMap.get(s.orgId.toString()) ?? "Unknown") : undefined,
      }))
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
    if (!user) return null
    if (!(await canAccessSystem(ctx, user._id, args.id))) return null

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
 * Create a new system. Requires auth + super_admin/channel_partner role.
 * orgId is required to ensure data isolation for new systems.
 */
export const create = mutation({
  args: {
    name: v.string(),
    sector: v.optional(v.string()),
    impact: v.string(),
    dimension: v.string(),
    challenge: v.string(),
    orgId: v.id("organisations"),
  },
  handler: async (ctx, args) => {
    const user = await requireAuth(ctx)
    const targetOrg = await ctx.db.get(args.orgId)
    if (!targetOrg || targetOrg.deletedAt) {
      throw new Error("Organisation not found")
    }

    // Super admins can create systems in any org.
    if (!(await isSuperAdmin(ctx, user._id))) {
      // Non-super-admin callers must be channel partners scoped to the target org.
      if (!(await isChannelPartner(ctx, user._id))) {
        throw new Error("Access denied: only super admins or channel partners can create systems")
      }

      const directMembership = await getOrgMembership(ctx, user._id, args.orgId)
      const hasDirectPartnerMembership = directMembership?.role === "channel_partner"
      let hasChannelAccess = false

      if (targetOrg.channelId) {
        const partnerChannelIds = await getPartnerChannelIds(ctx, user._id)
        hasChannelAccess = partnerChannelIds.includes(targetOrg.channelId)
      }

      if (!hasDirectPartnerMembership && !hasChannelAccess) {
        throw new Error("Access denied: channel partner is not scoped to this organisation")
      }
    }

    const systemId = await ctx.db.insert("systems", args)
    await logAudit(ctx, {
      userId: user._id,
      userEmail: user.email,
      action: "system.create",
      resourceType: "system",
      resourceId: systemId,
      details: { name: args.name, ...(args.sector && { sector: args.sector }) },
      orgId: args.orgId,
    })
    return systemId
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

    const system = await ctx.db.get(args.id)
    const { id, ...fields } = args
    const updates: Record<string, string> = {}
    for (const [key, value] of Object.entries(fields)) {
      if (value !== undefined) {
        updates[key] = value
      }
    }
    await ctx.db.patch(id, updates)
    await logAudit(ctx, {
      userId: user._id,
      userEmail: user.email,
      action: "system.update",
      resourceType: "system",
      resourceId: id,
      details: { updated: Object.keys(updates) },
      orgId: system?.orgId,
    })
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

    const system = await ctx.db.get(args.id)
    // Soft delete instead of hard delete
    await ctx.db.patch(args.id, { deletedAt: Date.now() })
    await logAudit(ctx, {
      userId: user._id,
      userEmail: user.email,
      action: "system.delete",
      resourceType: "system",
      resourceId: args.id,
      details: { name: system?.name ?? "unknown" },
      orgId: system?.orgId,
    })
  },
})

/**
 * List soft-deleted systems — super admin only.
 */
export const listDeleted = query({
  args: {},
  handler: async (ctx) => {
    const user = await requireAuth(ctx)
    if (!(await isSuperAdmin(ctx, user._id))) {
      throw new Error("Access denied: only super admins can view deleted systems")
    }
    const allSystems = await ctx.db.query("systems").collect()
    return allSystems
      .filter((s) => !!s.deletedAt)
      .map((s) => ({
        _id: s._id,
        name: s.name,
        sector: s.sector,
        orgId: s.orgId,
        deletedAt: s.deletedAt!,
      }))
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
      await requireRole(ctx, user._id, system.orgId, ["admin", "super_admin"])
    }

    await ctx.db.patch(args.id, { deletedAt: undefined })
    await logAudit(ctx, {
      userId: user._id,
      userEmail: user.email,
      action: "system.restore",
      resourceType: "system",
      resourceId: args.id,
      details: { name: system.name },
      orgId: system.orgId,
    })
  },
})
