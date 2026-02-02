import { query, mutation } from "./_generated/server"
import { v } from "convex/values"

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
    return await ctx.db.insert("elements", args)
  },
})

export const update = mutation({
  args: {
    id: v.id("elements"),
    content: v.optional(v.string()),
    description: v.optional(v.string()),
    gradientValue: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
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

export const remove = mutation({
  args: { id: v.id("elements") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id)
  },
})
