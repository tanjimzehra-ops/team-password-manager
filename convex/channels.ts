import { query, mutation } from "./_generated/server"
import { v } from "convex/values"
import { requireAuth, isSuperAdmin } from "./lib/permissions"
import { logAudit } from "./auditLogs"

const channelStatusValidator = v.union(
  v.literal("active"),
  v.literal("inactive")
)

/**
 * List all channels (super admin only)
 * Returns all non-deleted channels with org count
 */
export const list = query({
  args: {},
  handler: async (ctx) => {
    const user = await requireAuth(ctx)
    if (!(await isSuperAdmin(ctx, user._id))) {
      throw new Error("Access denied: only super admins can list channels")
    }

    const channels = await ctx.db.query("channels").collect()
    const activeChannels = channels.filter((c) => !c.deletedAt)

    // Get org count per channel
    const orgs = await ctx.db.query("organisations").collect()
    return activeChannels.map((ch) => ({
      ...ch,
      orgCount: orgs.filter(
        (o) => !o.deletedAt && o.channelId === ch._id
      ).length,
    }))
  },
})

/**
 * Get a single channel by ID (super admin only)
 */
export const get = query({
  args: { id: v.id("channels") },
  handler: async (ctx, args) => {
    const user = await requireAuth(ctx)
    if (!(await isSuperAdmin(ctx, user._id))) {
      throw new Error("Access denied: only super admins can get channels")
    }

    const channel = await ctx.db.get(args.id)
    if (!channel || channel.deletedAt) return null
    return channel
  },
})

/**
 * Create a new channel — super admin only
 */
export const create = mutation({
  args: {
    name: v.string(),
    slug: v.string(),
    contactEmail: v.optional(v.string()),
    status: v.optional(channelStatusValidator),
  },
  handler: async (ctx, args) => {
    const user = await requireAuth(ctx)
    if (!(await isSuperAdmin(ctx, user._id))) {
      throw new Error("Access denied: only super admins can create channels")
    }

    const channelId = await ctx.db.insert("channels", {
      name: args.name,
      slug: args.slug,
      contactEmail: args.contactEmail,
      status: args.status ?? "active",
      createdBy: user._id,
    })

    await logAudit(ctx, {
      userId: user._id,
      userEmail: user.email,
      action: "channel.create",
      resourceType: "channel",
      resourceId: channelId,
      details: { name: args.name, slug: args.slug },
    })

    return channelId
  },
})

/**
 * Update channel — super admin only
 */
export const update = mutation({
  args: {
    id: v.id("channels"),
    name: v.optional(v.string()),
    slug: v.optional(v.string()),
    contactEmail: v.optional(v.string()),
    status: v.optional(channelStatusValidator),
  },
  handler: async (ctx, args) => {
    const user = await requireAuth(ctx)
    if (!(await isSuperAdmin(ctx, user._id))) {
      throw new Error("Access denied: only super admins can update channels")
    }

    const { id, ...fields } = args
    const updates: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(fields)) {
      if (value !== undefined) {
        updates[key] = value
      }
    }

    await ctx.db.patch(id, updates)
    await logAudit(ctx, {
      userId: user._id,
      userEmail: user.email,
      action: "channel.update",
      resourceType: "channel",
      resourceId: args.id,
      details: { updated: Object.keys(updates) },
    })
  },
})

/**
 * Soft delete channel — super admin only
 */
export const remove = mutation({
  args: { id: v.id("channels") },
  handler: async (ctx, args) => {
    const user = await requireAuth(ctx)
    if (!(await isSuperAdmin(ctx, user._id))) {
      throw new Error("Access denied: only super admins can delete channels")
    }

    const channel = await ctx.db.get(args.id)
    if (!channel) throw new Error("Channel not found")

    await ctx.db.patch(args.id, { deletedAt: Date.now() })
    await logAudit(ctx, {
      userId: user._id,
      userEmail: user.email,
      action: "channel.delete",
      resourceType: "channel",
      resourceId: args.id,
      details: { name: channel.name, slug: channel.slug },
    })
  },
})
