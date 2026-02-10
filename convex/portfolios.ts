import { query, mutation } from "./_generated/server"
import { v } from "convex/values"

export const byElement = query({
  args: { elementId: v.id("elements") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("portfolios")
      .withIndex("by_element", (q) => q.eq("elementId", args.elementId))
      .collect()
  },
})

export const bySystem = query({
  args: { systemId: v.id("systems") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("portfolios")
      .withIndex("by_system", (q) => q.eq("systemId", args.systemId))
      .collect()
  },
})

export const create = mutation({
  args: {
    systemId: v.id("systems"),
    elementId: v.id("elements"),
    title: v.string(),
    description: v.optional(v.string()),
    date: v.string(),
    progress: v.number(),
    status: v.union(
      v.literal("planning"),
      v.literal("active"),
      v.literal("completed")
    ),
    orderIndex: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("portfolios", args)
  },
})

export const update = mutation({
  args: {
    id: v.id("portfolios"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    date: v.optional(v.string()),
    progress: v.optional(v.number()),
    status: v.optional(
      v.union(
        v.literal("planning"),
        v.literal("active"),
        v.literal("completed")
      )
    ),
    orderIndex: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { id, ...fields } = args
    const updates: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(fields)) {
      if (value !== undefined) updates[key] = value
    }
    await ctx.db.patch(id, updates)
  },
})

export const remove = mutation({
  args: { id: v.id("portfolios") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id)
  },
})
