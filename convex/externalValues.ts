import { query, mutation } from "./_generated/server"
import { v } from "convex/values"
import { withWriteAccess } from "./lib/mutations"
import { withReadAccess } from "./lib/queries"

export const bySystem = query({
  args: { systemId: v.id("systems") },
  handler: async (ctx, args) => {
    await withReadAccess(ctx, args.systemId)
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
    return withWriteAccess(ctx, args.systemId, "externalValue.create", "externalValue", async () => {
      const evId = await ctx.db.insert("externalValues", args)
      return evId
    })
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
    const ev = await ctx.db.get(args.id)
    if (!ev) throw new Error("External value not found")
    
    return withWriteAccess(ctx, ev.systemId, "externalValue.update", "externalValue", async () => {
      const { id, ...fields } = args
      const updates: Record<string, unknown> = {}
      for (const [key, value] of Object.entries(fields)) {
        if (value !== undefined) {
          updates[key] = value
        }
      }
      await ctx.db.patch(id, updates)
    })
  },
})

export const remove = mutation({
  args: { id: v.id("externalValues") },
  handler: async (ctx, args) => {
    const ev = await ctx.db.get(args.id)
    if (!ev) throw new Error("External value not found")
    
    return withWriteAccess(ctx, ev.systemId, "externalValue.delete", "externalValue", async () => {
      await ctx.db.delete(args.id)
    })
  },
})
