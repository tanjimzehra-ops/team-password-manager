import { query, mutation } from "./_generated/server"
import { v } from "convex/values"
import { requireAuth, requireWriteAccess } from "./lib/permissions"

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
    return await ctx.db.insert("elements", args)
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
    if (args.updates.length > 0) {
      const element = await ctx.db.get(args.updates[0].id)
      if (element) await requireWriteAccess(ctx, user._id, element.systemId)
    }
    for (const { id, orderIndex } of args.updates) {
      await ctx.db.patch(id, { orderIndex })
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
    await ctx.db.delete(args.id)
  },
})
