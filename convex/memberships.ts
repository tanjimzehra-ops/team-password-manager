import { query, mutation } from "./_generated/server"
import { v } from "convex/values"
import {
  requireAuth,
  isSuperAdmin,
  requireRole,
} from "./lib/permissions"

const roleValidator = v.union(
  v.literal("super_admin"),
  v.literal("admin"),
  v.literal("viewer")
)

// Get all memberships for a user (multi-org support)
export const byUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    await requireAuth(ctx)
    const memberships = await ctx.db
      .query("memberships")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect()
    return memberships.filter((m) => !m.deletedAt)
  },
})

// Get all members of an organisation — admin/super_admin only
export const byOrg = query({
  args: { orgId: v.id("organisations") },
  handler: async (ctx, args) => {
    const user = await requireAuth(ctx)
    // Must be admin of the org or super admin to see members
    await requireRole(ctx, user._id, args.orgId, ["admin", "super_admin"])

    const memberships = await ctx.db
      .query("memberships")
      .withIndex("by_org", (q) => q.eq("orgId", args.orgId))
      .collect()
    return memberships.filter((m) => !m.deletedAt)
  },
})

// Get current user's membership in a specific org
export const getByUserOrg = query({
  args: {
    userId: v.id("users"),
    orgId: v.id("organisations"),
  },
  handler: async (ctx, args) => {
    await requireAuth(ctx)
    const membership = await ctx.db
      .query("memberships")
      .withIndex("by_user_org", (q) =>
        q.eq("userId", args.userId).eq("orgId", args.orgId)
      )
      .first()
    if (membership?.deletedAt) return null
    return membership
  },
})

// Get current authenticated user's memberships (convenience for frontend)
export const myMemberships = query({
  args: {},
  handler: async (ctx) => {
    const user = await requireAuth(ctx)
    const memberships = await ctx.db
      .query("memberships")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect()
    return memberships.filter((m) => !m.deletedAt)
  },
})

// Create a membership — admin of the org or super admin
export const create = mutation({
  args: {
    userId: v.id("users"),
    orgId: v.id("organisations"),
    role: roleValidator,
  },
  handler: async (ctx, args) => {
    const user = await requireAuth(ctx)
    await requireRole(ctx, user._id, args.orgId, ["admin", "super_admin"])

    // Prevent non-super-admins from assigning super_admin role
    if (args.role === "super_admin" && !(await isSuperAdmin(ctx, user._id))) {
      throw new Error("Access denied: only super admins can assign super_admin role")
    }

    // Check for existing membership (including soft-deleted)
    const existing = await ctx.db
      .query("memberships")
      .withIndex("by_user_org", (q) =>
        q.eq("userId", args.userId).eq("orgId", args.orgId)
      )
      .first()

    if (existing) {
      if (existing.deletedAt) {
        // Restore and update role
        await ctx.db.patch(existing._id, {
          role: args.role,
          deletedAt: undefined,
        })
        return existing._id
      }
      // Already exists and active — return existing
      return existing._id
    }

    return await ctx.db.insert("memberships", args)
  },
})

// Update role — admin of the org or super admin
export const updateRole = mutation({
  args: {
    id: v.id("memberships"),
    role: roleValidator,
  },
  handler: async (ctx, args) => {
    const user = await requireAuth(ctx)
    const membership = await ctx.db.get(args.id)
    if (!membership) throw new Error("Membership not found")

    await requireRole(ctx, user._id, membership.orgId, ["admin", "super_admin"])

    // Prevent non-super-admins from assigning super_admin role
    if (args.role === "super_admin" && !(await isSuperAdmin(ctx, user._id))) {
      throw new Error("Access denied: only super admins can assign super_admin role")
    }

    await ctx.db.patch(args.id, { role: args.role })
  },
})

// Soft delete membership — admin of the org or super admin
export const remove = mutation({
  args: { id: v.id("memberships") },
  handler: async (ctx, args) => {
    const user = await requireAuth(ctx)
    const membership = await ctx.db.get(args.id)
    if (!membership) throw new Error("Membership not found")

    await requireRole(ctx, user._id, membership.orgId, ["admin", "super_admin"])
    await ctx.db.patch(args.id, { deletedAt: Date.now() })
  },
})
