import { query, mutation, internalMutation } from "./_generated/server"
import { v } from "convex/values"
import { getCurrentUser, requireAuth, isSuperAdmin } from "./lib/permissions"

/**
 * Get the current authenticated user's record + role info.
 * This is the primary frontend query for "who am I?"
 */
export const me = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx)
    if (!user) return null

    const memberships = await ctx.db
      .query("memberships")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect()
    const activeMemberships = memberships.filter((m) => !m.deletedAt)

    return {
      ...user,
      memberships: activeMemberships,
      isSuperAdmin: activeMemberships.some((m) => m.role === "super_admin"),
    }
  },
})

// Get user by WorkOS ID (primary lookup for auth flow)
export const getByWorkosId = query({
  args: { workosId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_workosId", (q) => q.eq("workosId", args.workosId))
      .first()
  },
})

// Get user by email
export const getByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first()
  },
})

// Get user by Convex ID
export const get = query({
  args: { id: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id)
  },
})

// List all active users — super admin only
export const list = query({
  args: {},
  handler: async (ctx) => {
    const user = await requireAuth(ctx)
    if (!(await isSuperAdmin(ctx, user._id))) {
      throw new Error("Access denied: only super admins can list all users")
    }
    const users = await ctx.db.query("users").collect()
    return users.filter((u) => !u.deletedAt)
  },
})

// Upsert user from WorkOS webhook — creates or updates
export const upsertFromWorkos = internalMutation({
  args: {
    workosId: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("users")
      .withIndex("by_workosId", (q) => q.eq("workosId", args.workosId))
      .first()

    if (existing) {
      await ctx.db.patch(existing._id, {
        email: args.email,
        name: args.name,
        avatarUrl: args.avatarUrl,
      })
      return existing._id
    }

    return await ctx.db.insert("users", {
      workosId: args.workosId,
      email: args.email,
      name: args.name,
      avatarUrl: args.avatarUrl,
    })
  },
})

// Update user fields — super admin or self
export const update = mutation({
  args: {
    id: v.id("users"),
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await requireAuth(ctx)
    // Users can update themselves; super admins can update anyone
    if (String(user._id) !== String(args.id) && !(await isSuperAdmin(ctx, user._id))) {
      throw new Error("Access denied: can only update your own profile")
    }

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
  args: { id: v.id("users") },
  handler: async (ctx, args) => {
    const user = await requireAuth(ctx)
    if (!(await isSuperAdmin(ctx, user._id))) {
      throw new Error("Access denied: only super admins can delete users")
    }
    await ctx.db.patch(args.id, { deletedAt: Date.now() })
  },
})
