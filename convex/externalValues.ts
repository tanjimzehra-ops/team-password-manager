import { query, mutation } from "./_generated/server"
import { v } from "convex/values"
import { requireAuth, requireWriteAccess } from "./lib/permissions"

export const bySystem = query({
  args: { systemId: v.id("systems") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("externalValues")
      .withIndex("by_system", (q) => q.eq("systemId", args.systemId))
      .collect()
  },
})

export const create = mutation({
  args: {
    systemId: v.id("systems"),
    content: v.string(),
    description: v.optional(v.string()),
    orderIndex: v.number(),
  },
  handler: async (ctx, args) => {
    const user = await requireAuth(ctx)
    await requireWriteAccess(ctx, user._id, args.systemId)
    return await ctx.db.insert("externalValues", args)
  },
})

export const update = mutation({
  args: {
    id: v.id("externalValues"),
    content: v.optional(v.string()),
    description: v.optional(v.string()),
    orderIndex: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const user = await requireAuth(ctx)
    const ev = await ctx.db.get(args.id)
    if (!ev) throw new Error("External value not found")
    await requireWriteAccess(ctx, user._id, ev.systemId)

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
  args: { id: v.id("externalValues") },
  handler: async (ctx, args) => {
    const user = await requireAuth(ctx)
    const ev = await ctx.db.get(args.id)
    if (!ev) throw new Error("External value not found")
    await requireWriteAccess(ctx, user._id, ev.systemId)
    await ctx.db.delete(args.id)
  },
})
