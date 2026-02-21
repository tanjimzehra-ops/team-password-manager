import { query } from "./_generated/server"
import { v } from "convex/values"
import { requireAuth, isSuperAdmin } from "./lib/permissions"
import type { MutationCtx } from "./_generated/server"

/**
 * Helper to insert an audit log entry from within any mutation.
 * Call this directly — it's not an exposed mutation.
 */
export async function logAudit(
  ctx: MutationCtx,
  entry: {
    userId: string
    userEmail: string
    action: string
    resourceType: string
    resourceId: string
    details?: Record<string, unknown>
    orgId?: string
  }
) {
  await ctx.db.insert("auditLogs", {
    ...entry,
    timestamp: Date.now(),
  })
}

/**
 * List recent audit logs — super admin only.
 * Returns last 100 entries, optionally filtered by orgId.
 */
export const list = query({
  args: {
    orgId: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const user = await requireAuth(ctx)
    if (!(await isSuperAdmin(ctx, user._id))) {
      throw new Error("Access denied: only super admins can view audit logs")
    }

    const limit = args.limit ?? 100

    if (args.orgId) {
      const logs = await ctx.db
        .query("auditLogs")
        .withIndex("by_orgId", (q) => q.eq("orgId", args.orgId))
        .order("desc")
        .take(limit)
      return logs
    }

    const logs = await ctx.db
      .query("auditLogs")
      .withIndex("by_timestamp")
      .order("desc")
      .take(limit)
    return logs
  },
})
