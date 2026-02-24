/**
 * Shared query layer for consistent read-access gating.
 *
 * All data queries should wrap their logic with withReadAccess() to ensure:
 * - Authentication is verified
 * - The user has access to the requested system (org membership, super admin, or channel partner)
 * - Dev bypass is respected for local development
 */

import { QueryCtx } from "../_generated/server"
import { Id, Doc } from "../_generated/dataModel"
import { getCurrentUser, canAccessSystem } from "./permissions"

/**
 * Verify read access to a system and return the authenticated user.
 *
 * @param ctx - Convex query context
 * @param systemId - ID of the system being read
 * @returns The authenticated user document
 * @throws Error if not authenticated or not authorised to access the system
 *
 * @example
 * export const bySystem = query({
 *   args: { systemId: v.id("systems") },
 *   handler: async (ctx, args) => {
 *     await withReadAccess(ctx, args.systemId);
 *     return await ctx.db.query("elements")
 *       .withIndex("by_system", (q) => q.eq("systemId", args.systemId))
 *       .collect();
 *   },
 * });
 */
export async function withReadAccess(
  ctx: QueryCtx,
  systemId: Id<"systems">
): Promise<Doc<"users">> {
  const user = await getCurrentUser(ctx)
  if (!user) {
    throw new Error("Authentication required")
  }
  if (user.deletedAt) {
    throw new Error("Account has been deactivated")
  }

  const hasAccess = await canAccessSystem(ctx, user._id, systemId)
  if (!hasAccess) {
    throw new Error("Access denied")
  }

  return user
}
