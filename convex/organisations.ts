import { query, mutation } from "./_generated/server"
import { v } from "convex/values"
import {
  requireAuth,
  isSuperAdmin,
  getOrgMembership,
  requireRole,
} from "./lib/permissions"

const orgStatusValidator = v.union(
  v.literal("active"),
  v.literal("inactive"),
  v.literal("trial")
)

/**
 * List organisations visible to the current user.
 * - Super admin: all active orgs
 * - Admin: only their own orgs
 * - Viewer: only their own orgs
 * - Unauthenticated: empty
 */
export const list = query({
  args: {},
  handler: async (ctx) => {
    const user = await requireAuth(ctx)
    const allOrgs = await ctx.db.query("organisations").collect()
    const activeOrgs = allOrgs.filter((o) => !o.deletedAt)

    if (await isSuperAdmin(ctx, user._id)) {
      return activeOrgs
    }

    // Non-super-admin: filter to orgs where user has membership
    const memberships = await ctx.db
      .query("memberships")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect()
    const orgIds = new Set(memberships.filter((m) => !m.deletedAt).map((m) => String(m.orgId)))
    return activeOrgs.filter((o) => orgIds.has(String(o._id)))
  },
})

// Get a single organisation by ID (with access check)
export const get = query({
  args: { id: v.id("organisations") },
  handler: async (ctx, args) => {
    const user = await requireAuth(ctx)
    const org = await ctx.db.get(args.id)
    if (!org || org.deletedAt) return null

    if (await isSuperAdmin(ctx, user._id)) return org

    const membership = await getOrgMembership(ctx, user._id, args.id)
    if (!membership) return null
    return org
  },
})

// Create a new organisation — super admin only
export const create = mutation({
  args: {
    name: v.string(),
    contactEmail: v.optional(v.string()),
    contactNumber: v.optional(v.string()),
    abn: v.optional(v.string()),
    channel: v.optional(v.string()),
    status: v.optional(orgStatusValidator),
  },
  handler: async (ctx, args) => {
    const user = await requireAuth(ctx)
    if (!(await isSuperAdmin(ctx, user._id))) {
      throw new Error("Access denied: only super admins can create organisations")
    }
    return await ctx.db.insert("organisations", {
      ...args,
      createdBy: user._id,
      status: args.status ?? "active",
    })
  },
})

// Update organisation — admin of that org or super admin
export const update = mutation({
  args: {
    id: v.id("organisations"),
    name: v.optional(v.string()),
    contactEmail: v.optional(v.string()),
    contactNumber: v.optional(v.string()),
    abn: v.optional(v.string()),
    channel: v.optional(v.string()),
    status: v.optional(orgStatusValidator),
  },
  handler: async (ctx, args) => {
    const user = await requireAuth(ctx)
    await requireRole(ctx, user._id, args.id, ["admin", "super_admin"])

    const { id, ...fields } = args
    const updates: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(fields)) {
      if (value !== undefined) {
        updates[key] = value
      }
    }
    await ctx.db.patch(id, updates)
  },
})

// Soft delete — super admin only
export const remove = mutation({
  args: { id: v.id("organisations") },
  handler: async (ctx, args) => {
    const user = await requireAuth(ctx)
    if (!(await isSuperAdmin(ctx, user._id))) {
      throw new Error("Access denied: only super admins can delete organisations")
    }
    await ctx.db.patch(args.id, { deletedAt: Date.now() })
  },
})

// Restore — super admin only
export const restore = mutation({
  args: { id: v.id("organisations") },
  handler: async (ctx, args) => {
    const user = await requireAuth(ctx)
    if (!(await isSuperAdmin(ctx, user._id))) {
      throw new Error("Access denied: only super admins can restore organisations")
    }
    await ctx.db.patch(args.id, { deletedAt: undefined })
  },
})
