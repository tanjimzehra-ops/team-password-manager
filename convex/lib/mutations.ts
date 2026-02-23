/**
 * Shared mutation layer for consistent auth gating, error handling, and audit logging.
 *
 * All CRUD mutations should wrap their logic with withWriteAccess() to ensure:
 * - Authentication is verified
 * - Role-based write access is enforced
 * - Audit logs are created on both success and failure
 * - Errors include user-friendly messages
 */

import { MutationCtx } from "../_generated/server"
import { Id, Doc } from "../_generated/dataModel"
import { requireAuth, requireWriteAccess } from "./permissions"
import { logAudit } from "../auditLogs"

/**
 * Type for the callback function passed to withWriteAccess.
 * Receives the authenticated user and returns a Promise of type T.
 */
type MutationCallback<T> = (user: Doc<"users">) => Promise<T>

/**
 * Wrap a mutation with authentication, authorization, and audit logging.
 *
 * @param ctx - Convex mutation context
 * @param systemId - ID of the system being modified
 * @param action - The action being performed (e.g., "element.create")
 * @param resourceType - The type of resource (e.g., "element", "system")
 * @param fn - The mutation logic to execute
 * @returns The result of the mutation function
 * @throws Error with user-friendly message on auth failure or execution error
 *
 * @example
 * export const create = mutation({
 *   args: { systemId: v.id("systems"), content: v.string() },
 *   handler: async (ctx, args) => {
 *     return withWriteAccess(ctx, args.systemId, "element.create", "element", async (user) => {
 *       const elementId = await ctx.db.insert("elements", { 
 *         systemId: args.systemId, 
 *         content: args.content 
 *       });
 *       return elementId;
 *     });
 *   },
 * });
 */
export async function withWriteAccess<T>(
  ctx: MutationCtx,
  systemId: Id<"systems">,
  action: string,
  resourceType: string,
  fn: MutationCallback<T>
): Promise<T> {
  // Step 1: Verify user identity
  const user = await requireAuth(ctx)

  // Step 2: Verify write access to the system
  await requireWriteAccess(ctx, user._id, systemId)

  // Step 3: Get system for orgId (needed for audit logging)
  const system = await ctx.db.get(systemId)

  // Step 4: Execute mutation with error handling and audit logging
  try {
    const result = await fn(user)

    // Log successful action
    await logAudit(ctx, {
      userId: user._id,
      userEmail: user.email,
      action: action,
      resourceType: resourceType,
      resourceId: systemId,
      orgId: system?.orgId,
    })

    return result
  } catch (error) {
    // Log failed action with error details
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    
    await logAudit(ctx, {
      userId: user._id,
      userEmail: user.email,
      action: `${action}_FAILED`,
      resourceType: resourceType,
      resourceId: systemId,
      details: { error: errorMessage },
      orgId: system?.orgId,
    })

    // Re-throw with user-friendly message
    throw new Error(
      `Failed to ${action.split(".").pop()}: ${errorMessage}`
    )
  }
}
