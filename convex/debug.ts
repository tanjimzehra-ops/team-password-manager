import { query } from "./_generated/server"
import { v } from "convex/values"

export const checkMemberships = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db.query("users").withIndex("by_email", q => q.eq("email", args.email)).first()
    if (!user) return { error: "User not found" }
    const memberships = await ctx.db.query("memberships").withIndex("by_user", q => q.eq("userId", user._id)).collect()
    return { user: { id: user._id, email: user.email }, memberships: memberships.map(m => ({ orgId: m.orgId, role: m.role, deletedAt: m.deletedAt })) }
  }
})

import { getCurrentUser, canAccessSystem, isSuperAdmin } from "./lib/permissions"

export const testAccess = query({
  args: { systemId: v.id("systems") },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx)
    if (!user) return { error: "No user from getCurrentUser" }
    const isSuper = await isSuperAdmin(ctx, user._id)
    const canAccess = await canAccessSystem(ctx, user._id, args.systemId)
    return { user: user.email, isSuper, canAccess, systemId: args.systemId }
  }
})
