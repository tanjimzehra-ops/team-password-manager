/**
 * Permission helpers for RBAC + Org-Scoped access control.
 *
 * Security model:
 * - Auth boundary is at systems.list (entry point)
 * - All child queries chain through systemId
 * - Mutations always require auth + role check
 * - Systems without orgId (legacy) are super-admin only
 * - Super admins see everything across all orgs
 */

import { QueryCtx, MutationCtx } from "../_generated/server"
import { Id, Doc } from "../_generated/dataModel"

export type Role = "super_admin" | "channel_partner" | "admin" | "viewer"

// ─── Identity Resolution ─────────────────────────────────────────

/**
 * Get the authenticated user's Convex record from JWT identity.
 * Returns null if not authenticated or user not found in DB.
 *
 * DEV BYPASS: When CONVEX_DEV_BYPASS_AUTH env var is set to "true"
 * AND CONVEX_IS_PRODUCTION is NOT "true", returns the first super_admin
 * user without requiring JWT auth. Double-gated so the bypass cannot
 * activate in production even if the env var is accidentally set.
 */
export async function getCurrentUser(
  ctx: QueryCtx | MutationCtx
): Promise<Doc<"users"> | null> {
  // Dev bypass: skip JWT auth, return the primary super_admin user (Nicolas)
  // SECURITY: requires BOTH flags — bypass ON and production OFF
  const bypassEnabled = process.env.CONVEX_DEV_BYPASS_AUTH === "true"
  const isProduction = process.env.CONVEX_IS_PRODUCTION === "true"
  if (bypassEnabled && !isProduction) {
    // Try to find Nicolas's user by email
    const devUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", "nicopt.au@gmail.com"))
      .first()
    if (devUser && !devUser.deletedAt) return devUser

    // Fallback: find first user with super_admin membership
    const allMemberships = await ctx.db.query("memberships").collect()
    const superAdminMembership = allMemberships.find((m) => m.role === "super_admin" && !m.deletedAt)
    if (superAdminMembership) {
      const user = await ctx.db.get(superAdminMembership.userId)
      if (user && !user.deletedAt) return user
    }
    // Last fallback: first active user
    const users = await ctx.db.query("users").collect()
    return users.find((u) => !u.deletedAt) ?? null
  }

  const identity = await ctx.auth.getUserIdentity()
  if (!identity) return null

  // WorkOS JWT subject is the WorkOS user ID
  const user = await ctx.db
    .query("users")
    .withIndex("by_workosId", (q) => q.eq("workosId", identity.subject))
    .first()

  return user
}

/**
 * Require authentication. Throws if not logged in or user not in DB.
 */
export async function requireAuth(
  ctx: QueryCtx | MutationCtx
): Promise<Doc<"users">> {
  const user = await getCurrentUser(ctx)
  if (!user) {
    throw new Error("Authentication required")
  }
  if (user.deletedAt) {
    throw new Error("Account has been deactivated")
  }
  return user
}

// ─── Membership & Role Checks ────────────────────────────────────

/**
 * Get all active memberships for a user.
 */
export async function getUserMemberships(
  ctx: QueryCtx | MutationCtx,
  userId: Id<"users">
): Promise<Doc<"memberships">[]> {
  const memberships = await ctx.db
    .query("memberships")
    .withIndex("by_user", (q) => q.eq("userId", userId))
    .collect()
  return memberships.filter((m) => !m.deletedAt)
}

/**
 * Check if user is a super admin (has super_admin role in ANY org).
 */
export async function isSuperAdmin(
  ctx: QueryCtx | MutationCtx,
  userId: Id<"users">
): Promise<boolean> {
  const memberships = await getUserMemberships(ctx, userId)
  return memberships.some((m) => m.role === "super_admin")
}

/**
 * Check if user is a channel partner (has channel_partner role in ANY org).
 */
export async function isChannelPartner(
  ctx: QueryCtx | MutationCtx,
  userId: Id<"users">
): Promise<boolean> {
  const memberships = await getUserMemberships(ctx, userId)
  return memberships.some((m) => m.role === "channel_partner")
}

/**
 * Get all channel IDs where the user is a channel partner.
 */
export async function getPartnerChannelIds(
  ctx: QueryCtx | MutationCtx,
  userId: Id<"users">
): Promise<Id<"channels">[]> {
  const memberships = await getUserMemberships(ctx, userId)
  const partnerMemberships = memberships.filter((m) => m.role === "channel_partner")

  // Get the channelId from each org where user is channel_partner
  const channelIds: Id<"channels">[] = []
  for (const m of partnerMemberships) {
    const org = await ctx.db.get(m.orgId)
    if (org?.channelId && !channelIds.includes(org.channelId)) {
      channelIds.push(org.channelId)
    }
  }
  return channelIds
}

/**
 * Get user's membership in a specific org. Returns null if no membership.
 */
export async function getOrgMembership(
  ctx: QueryCtx | MutationCtx,
  userId: Id<"users">,
  orgId: Id<"organisations">
): Promise<Doc<"memberships"> | null> {
  const membership = await ctx.db
    .query("memberships")
    .withIndex("by_user_org", (q) =>
      q.eq("userId", userId).eq("orgId", orgId)
    )
    .first()
  if (membership?.deletedAt) return null
  return membership
}

/**
 * Require that the user has one of the allowed roles in the specified org.
 * Super admins always pass.
 */
export async function requireRole(
  ctx: QueryCtx | MutationCtx,
  userId: Id<"users">,
  orgId: Id<"organisations">,
  allowedRoles: Role[]
): Promise<Doc<"memberships">> {
  // Super admins bypass org-specific role checks
  if (await isSuperAdmin(ctx, userId)) {
    // Return their actual membership if it exists, or create a virtual one
    const membership = await getOrgMembership(ctx, userId, orgId)
    if (membership) return membership
    // Super admin without explicit membership in this org — still allowed
    // Return a synthetic membership-like response
    const allMemberships = await getUserMemberships(ctx, userId)
    const superMembership = allMemberships.find((m) => m.role === "super_admin")
    if (superMembership) return superMembership
  }

  const membership = await getOrgMembership(ctx, userId, orgId)
  if (!membership) {
    throw new Error("Access denied: not a member of this organisation")
  }
  if (!allowedRoles.includes(membership.role)) {
    throw new Error(
      `Access denied: requires one of [${allowedRoles.join(", ")}], you have [${membership.role}]`
    )
  }
  return membership
}

// ─── System Access Control ───────────────────────────────────────

/**
 * Check if a user can access a specific system.
 * - Systems without orgId (legacy) are super-admin only
 * - Systems with orgId require org membership
 * - Super admins can access everything
 * - Channel partners can access systems in their channel's orgs
 */
export async function canAccessSystem(
  ctx: QueryCtx | MutationCtx,
  userId: Id<"users">,
  systemId: Id<"systems">
): Promise<boolean> {
  const system = await ctx.db.get(systemId)
  if (!system || system.deletedAt) return false

  // Super admins access everything
  if (await isSuperAdmin(ctx, userId)) return true

  // Legacy systems (no orgId) are accessible only to super admins
  if (!system.orgId) return false

  // Channel partners can access systems in their channel's orgs
  if (system.orgId) {
    const channelIds = await getPartnerChannelIds(ctx, userId)
    if (channelIds.length > 0) {
      const org = await ctx.db.get(system.orgId)
      if (org?.channelId && channelIds.includes(org.channelId)) {
        return true
      }
    }
  }

  // Check org membership
  const membership = await getOrgMembership(ctx, userId, system.orgId)
  return !!membership
}

/**
 * Require write access to a system. Must be admin or super_admin in the system's org.
 * Legacy systems (no orgId) allow writes from super admins only.
 */
export async function requireWriteAccess(
  ctx: MutationCtx,
  userId: Id<"users">,
  systemId: Id<"systems">
): Promise<void> {
  const system = await ctx.db.get(systemId)
  if (!system) throw new Error("System not found")
  if (system.deletedAt) throw new Error("System has been deleted")

  // Legacy systems (no orgId) are writable only by super admins.
  if (!system.orgId) {
    if (!(await isSuperAdmin(ctx, userId))) {
      throw new Error("Access denied: legacy systems require super admin remediation")
    }
    return
  }

  // Require admin or super_admin role in the system's org
  await requireRole(ctx, userId, system.orgId, ["admin", "super_admin"])
}

/**
 * Get all system IDs accessible to a user.
 * Returns orgIds the user belongs to for efficient filtering.
 */
export async function getAccessibleOrgIds(
  ctx: QueryCtx | MutationCtx,
  userId: Id<"users">
): Promise<{ orgIds: Id<"organisations">[]; isSuperAdmin: boolean; isChannelPartner: boolean }> {
  const superAdmin = await isSuperAdmin(ctx, userId)
  if (superAdmin) {
    return { orgIds: [], isSuperAdmin: true, isChannelPartner: false }
  }

  const memberships = await getUserMemberships(ctx, userId)
  const directOrgIds = memberships.map((m) => m.orgId)

  // Check if user is a channel partner
  const partnerMemberships = memberships.filter((m) => m.role === "channel_partner")
  if (partnerMemberships.length > 0) {
    // Get all channel IDs from partner orgs
    const channelIds: Id<"channels">[] = []
    for (const m of partnerMemberships) {
      const org = await ctx.db.get(m.orgId)
      if (org?.channelId && !channelIds.includes(org.channelId)) {
        channelIds.push(org.channelId)
      }
    }

    // Get ALL orgs in those channels
    if (channelIds.length > 0) {
      const allOrgs = await ctx.db.query("organisations").collect()
      const channelOrgIds = allOrgs
        .filter((o) => !o.deletedAt && o.channelId && channelIds.includes(o.channelId))
        .map((o) => o._id)

      // Merge direct + channel org IDs (deduplicate)
      const allOrgIds = [...new Set([...directOrgIds, ...channelOrgIds])]
      return { orgIds: allOrgIds, isSuperAdmin: false, isChannelPartner: true }
    }
  }

  return {
    orgIds: directOrgIds,
    isSuperAdmin: false,
    isChannelPartner: false,
  }
}
