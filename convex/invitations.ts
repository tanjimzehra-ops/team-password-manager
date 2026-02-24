import { query, mutation } from "./_generated/server"
import { v } from "convex/values"
import {
  requireAuth,
  requireRole,
  getOrgMembership,
} from "./lib/permissions"
import { logAudit } from "./auditLogs"
import { sha256, randomToken } from "./lib/crypto"
import { emailsMatch, normalizeEmail } from "./lib/email"

// Role validator for invitations: only admin and viewer
const invitationRoleValidator = v.union(
  v.literal("admin"),
  v.literal("viewer")
)

/**
 * Generate a secure random token for invitations.
 */
function generateToken(): string {
  return randomToken(32)
}

/**
 * List all invitations for an organisation
 * Requires auth and membership in the org
 */
export const listByOrg = query({
  args: {
    orgId: v.id("organisations"),
  },
  handler: async (ctx, args) => {
    const user = await requireAuth(ctx)
    
    // Check membership in org
    const membership = await getOrgMembership(ctx, user._id, args.orgId)
    if (!membership) {
      throw new Error("Access denied: not a member of this organisation")
    }

    // Get all invitations for the org
    const invitations = await ctx.db
      .query("invitations")
      .withIndex("by_org", (q) => q.eq("orgId", args.orgId))
      .collect()

    // Filter out soft-deleted and sort by creation time (_id is timestamp-based)
    const activeInvitations = invitations
      .filter((inv) => !inv.deletedAt)
      .sort((a, b) => (a._id > b._id ? 1 : -1))

    // Join with users table to get inviter's email
    const invitationsWithInviter = await Promise.all(
      activeInvitations.map(async (inv) => {
        const inviter = await ctx.db.get(inv.invitedBy)
        return {
          _id: inv._id,
          email: inv.email,
          orgId: inv.orgId,
          role: inv.role,
          status: inv.status,
          invitedBy: inv.invitedBy,
          inviterEmail: inviter?.email ?? "unknown",
          expiresAt: inv.expiresAt,
          acceptedAt: inv.acceptedAt,
          createdAt: inv._creationTime,
        }
      })
    )

    return invitationsWithInviter
  },
})

/**
 * Create a new invitation
 * Requires auth + admin or super_admin role in the org
 */
export const create = mutation({
  args: {
    email: v.string(),
    orgId: v.id("organisations"),
    role: invitationRoleValidator,
  },
  handler: async (ctx, args) => {
    const user = await requireAuth(ctx)
    const invitationEmail = normalizeEmail(args.email)

    // Require admin or super_admin role in the org
    await requireRole(ctx, user._id, args.orgId, ["admin", "super_admin"])

    // Generate secure token and hash before storage
    const rawToken = generateToken()
    const hashedToken = sha256(rawToken)

    // Set expiration to 7 days from now
    const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000

    // Create the invitation (store HASHED token only)
    const invitationId = await ctx.db.insert("invitations", {
      email: invitationEmail,
      orgId: args.orgId,
      role: args.role,
      token: hashedToken,
      status: "pending",
      invitedBy: user._id,
      expiresAt,
    })

    // Log audit
    await logAudit(ctx, {
      userId: user._id,
      userEmail: user.email,
      action: "invitation.create",
      resourceType: "invitation",
      resourceId: invitationId,
      details: {
        email: invitationEmail,
        role: args.role,
        orgId: args.orgId,
      },
      orgId: args.orgId,
    })

    // Return raw token (only time it's visible — not stored)
    return { token: rawToken }
  },
})

/**
 * Revoke (cancel) a pending invitation
 * Requires auth + admin role in the invitation's org
 */
export const revoke = mutation({
  args: {
    id: v.id("invitations"),
  },
  handler: async (ctx, args) => {
    const user = await requireAuth(ctx)

    // Get the invitation
    const invitation = await ctx.db.get(args.id)
    if (!invitation) {
      throw new Error("Invitation not found")
    }
    if (invitation.deletedAt) {
      throw new Error("Invitation has already been revoked")
    }

    // Require admin role in the invitation's org
    await requireRole(ctx, user._id, invitation.orgId, ["admin", "super_admin"])

    // Only revoke if status is pending
    if (invitation.status !== "pending") {
      throw new Error(`Cannot revoke invitation with status: ${invitation.status}`)
    }

    // Soft delete and set status to declined
    await ctx.db.patch(args.id, {
      status: "declined",
      deletedAt: Date.now(),
    })

    // Log audit
    await logAudit(ctx, {
      userId: user._id,
      userEmail: user.email,
      action: "invitation.revoke",
      resourceType: "invitation",
      resourceId: args.id,
      details: {
        email: invitation.email,
        orgId: invitation.orgId,
      },
      orgId: invitation.orgId,
    })

    return { success: true }
  },
})

/**
 * Accept an invitation
 * Called from invite page, requires user to be logged in
 */
export const accept = mutation({
  args: {
    token: v.string(),
  },
  handler: async (ctx, args) => {
    // Get the current user (must be logged in)
    const user = await requireAuth(ctx)

    // Hash the incoming token to match stored hash
    const hashedToken = sha256(args.token)

    // Look up invitation by hashed token
    const invitation = await ctx.db
      .query("invitations")
      .withIndex("by_token", (q) => q.eq("token", hashedToken))
      .first()

    if (!invitation) {
      throw new Error("Invitation not found")
    }
    if (invitation.deletedAt) {
      throw new Error("Invitation has been revoked")
    }

    // Check not expired
    if (invitation.expiresAt < Date.now()) {
      // Update status to expired if not already
      if (invitation.status !== "expired") {
        await ctx.db.patch(invitation._id, { status: "expired" })
      }
      throw new Error("Invitation has expired")
    }

    // Check status is pending
    if (invitation.status !== "pending") {
      throw new Error(`Invitation has already been ${invitation.status}`)
    }

    if (!emailsMatch(user.email, invitation.email)) {
      throw new Error("Access denied: invitation is not for this account")
    }

    // Check if user is already a member of this org
    const existingMembership = await getOrgMembership(ctx, user._id, invitation.orgId)
    if (existingMembership) {
      throw new Error("You are already a member of this organisation")
    }

    // Create membership for user in the org with the invited role
    const membershipId = await ctx.db.insert("memberships", {
      userId: user._id,
      orgId: invitation.orgId,
      role: invitation.role,
    })

    // Update invitation status and acceptedAt
    await ctx.db.patch(invitation._id, {
      status: "accepted",
      acceptedAt: Date.now(),
    })

    // Get org name for response
    const org = await ctx.db.get(invitation.orgId)

    // Log audit
    await logAudit(ctx, {
      userId: user._id,
      userEmail: user.email,
      action: "invitation.accept",
      resourceType: "invitation",
      resourceId: invitation._id,
      details: {
        email: invitation.email,
        role: invitation.role,
        orgId: invitation.orgId,
        membershipId,
      },
      orgId: invitation.orgId,
    })

    return {
      orgId: invitation.orgId,
      orgName: org?.name ?? "Unknown Organisation",
    }
  },
})

/**
 * Get invitation details by token
 * Public query - no auth required
 * Returns limited info for the accept page
 */
export const getByToken = query({
  args: {
    token: v.string(),
  },
  handler: async (ctx, args) => {
    // Hash the incoming token to match stored hash
    const hashedToken = sha256(args.token)

    // Look up invitation by hashed token
    const invitation = await ctx.db
      .query("invitations")
      .withIndex("by_token", (q) => q.eq("token", hashedToken))
      .first()

    if (!invitation) {
      return null
    }

    // Don't expose deleted invitations
    if (invitation.deletedAt) {
      return null
    }

    // Get org name
    const org = await ctx.db.get(invitation.orgId)
    if (!org || org.deletedAt) {
      return null
    }

    // Calculate if expired
    const isExpired = invitation.expiresAt < Date.now()

    // Return limited, non-sensitive fields only
    return {
      orgName: org.name,
      role: invitation.role,
      status: invitation.status,
      isExpired,
      expiresAt: invitation.expiresAt,
    }
  },
})
