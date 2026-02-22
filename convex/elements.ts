import { query, mutation } from "./_generated/server"
import { v } from "convex/values"
import { requireAuth, requireWriteAccess } from "./lib/permissions"
import { logAudit } from "./auditLogs"

export const bySystem = query({
  args: { systemId: v.id("systems") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("elements")
      .withIndex("by_system", (q) => q.eq("systemId", args.systemId))
      .collect()
  },
})

export const bySystemAndType = query({
  args: {
    systemId: v.id("systems"),
    elementType: v.union(
      v.literal("outcome"),
      v.literal("value_chain"),
      v.literal("resource")
    ),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("elements")
      .withIndex("by_system_type", (q) =>
        q.eq("systemId", args.systemId).eq("elementType", args.elementType)
      )
      .collect()
  },
})

export const create = mutation({
  args: {
    systemId: v.id("systems"),
    elementType: v.union(
      v.literal("outcome"),
      v.literal("value_chain"),
      v.literal("resource")
    ),
    content: v.string(),
    description: v.optional(v.string()),
    orderIndex: v.number(),
    gradientValue: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const user = await requireAuth(ctx)
    await requireWriteAccess(ctx, user._id, args.systemId)
    const elementId = await ctx.db.insert("elements", args)
    const system = await ctx.db.get(args.systemId)
    await logAudit(ctx, {
      userId: user._id,
      userEmail: user.email,
      action: "element.create",
      resourceType: "element",
      resourceId: elementId,
      details: { elementType: args.elementType, content: args.content },
      orgId: system?.orgId,
    })
    return elementId
  },
})

export const update = mutation({
  args: {
    id: v.id("elements"),
    content: v.optional(v.string()),
    description: v.optional(v.string()),
    gradientValue: v.optional(v.number()),
    color: v.optional(v.union(v.literal("primary"), v.literal("secondary"), v.literal("accent"), v.literal("muted"))),
    orderIndex: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const user = await requireAuth(ctx)
    const element = await ctx.db.get(args.id)
    if (!element) throw new Error("Element not found")
    await requireWriteAccess(ctx, user._id, element.systemId)

    const { id, ...fields } = args
    const updates: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(fields)) {
      if (value !== undefined) {
        updates[key] = value
      }
    }
    await ctx.db.patch(id, updates)
    const system = await ctx.db.get(element.systemId)
    await logAudit(ctx, {
      userId: user._id,
      userEmail: user.email,
      action: "element.update",
      resourceType: "element",
      resourceId: args.id,
      details: { updated: Object.keys(updates) },
      orgId: system?.orgId,
    })
  },
})

export const reorder = mutation({
  args: {
    updates: v.array(
      v.object({
        id: v.id("elements"),
        orderIndex: v.number(),
      })
    ),
  },
  handler: async (ctx, args) => {
    const user = await requireAuth(ctx)
    // Check access on first element (all in same system)
    let element = null
    if (args.updates.length > 0) {
      element = await ctx.db.get(args.updates[0].id)
      if (element) await requireWriteAccess(ctx, user._id, element.systemId)
    }
    for (const { id, orderIndex } of args.updates) {
      await ctx.db.patch(id, { orderIndex })
    }
    if (element) {
      const system = await ctx.db.get(element.systemId)
      await logAudit(ctx, {
        userId: user._id,
        userEmail: user.email,
        action: "element.reorder",
        resourceType: "element",
        resourceId: args.updates[0]?.id ?? "batch",
        details: { count: args.updates.length },
        orgId: system?.orgId,
      })
    }
  },
})

export const remove = mutation({
  args: { id: v.id("elements") },
  handler: async (ctx, args) => {
    const user = await requireAuth(ctx)
    const element = await ctx.db.get(args.id)
    if (!element) throw new Error("Element not found")
    await requireWriteAccess(ctx, user._id, element.systemId)
    const system = await ctx.db.get(element.systemId)
    await logAudit(ctx, {
      userId: user._id,
      userEmail: user.email,
      action: "element.delete",
      resourceType: "element",
      resourceId: args.id,
      details: { content: element.content, elementType: element.elementType },
      orgId: system?.orgId,
    })
    await ctx.db.delete(args.id)
  },
})
