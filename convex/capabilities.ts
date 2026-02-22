import { query, mutation } from "./_generated/server"
import { v } from "convex/values"
import { requireAuth, requireWriteAccess } from "./lib/permissions"
import { logAudit } from "./auditLogs"

export const bySystem = query({
  args: { systemId: v.id("systems") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("capabilities")
      .withIndex("by_system_type", (q) => q.eq("systemId", args.systemId))
      .collect()
  },
})

export const bySystemAndType = query({
  args: {
    systemId: v.id("systems"),
    capabilityType: v.union(v.literal("current"), v.literal("necessary")),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("capabilities")
      .withIndex("by_system_type", (q) =>
        q
          .eq("systemId", args.systemId)
          .eq("capabilityType", args.capabilityType)
      )
      .collect()
  },
})

export const upsert = mutation({
  args: {
    systemId: v.id("systems"),
    resourceId: v.id("elements"),
    capabilityType: v.union(v.literal("current"), v.literal("necessary")),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await requireAuth(ctx)
    await requireWriteAccess(ctx, user._id, args.systemId)

    const existing = await ctx.db
      .query("capabilities")
      .withIndex("by_resource", (q) => q.eq("resourceId", args.resourceId))
      .filter((q) => q.eq(q.field("capabilityType"), args.capabilityType))
      .first()

    const system = await ctx.db.get(args.systemId)
    if (existing) {
      await ctx.db.patch(existing._id, { content: args.content })
      await logAudit(ctx, {
        userId: user._id,
        userEmail: user.email,
        action: "capability.update",
        resourceType: "capability",
        resourceId: existing._id,
        details: { capabilityType: args.capabilityType },
        orgId: system?.orgId,
      })
      return existing._id
    } else {
      const newId = await ctx.db.insert("capabilities", args)
      await logAudit(ctx, {
        userId: user._id,
        userEmail: user.email,
        action: "capability.create",
        resourceType: "capability",
        resourceId: newId,
        details: { capabilityType: args.capabilityType },
        orgId: system?.orgId,
      })
      return newId
    }
  },
})

export const remove = mutation({
  args: { id: v.id("capabilities") },
  handler: async (ctx, args) => {
    const user = await requireAuth(ctx)
    const cap = await ctx.db.get(args.id)
    if (!cap) throw new Error("Capability not found")
    await requireWriteAccess(ctx, user._id, cap.systemId)
    const system = await ctx.db.get(cap.systemId)
    await logAudit(ctx, {
      userId: user._id,
      userEmail: user.email,
      action: "capability.delete",
      resourceType: "capability",
      resourceId: args.id,
      details: { capabilityType: cap.capabilityType },
      orgId: system?.orgId,
    })
    await ctx.db.delete(args.id)
  },
})
