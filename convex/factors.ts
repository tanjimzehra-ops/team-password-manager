import { query, mutation } from "./_generated/server"
import { v } from "convex/values"
import { withWriteAccess } from "./lib/mutations"
import { withReadAccess } from "./lib/queries"

export const bySystem = query({
  args: { systemId: v.id("systems") },
  handler: async (ctx, args) => {
    await withReadAccess(ctx, args.systemId)
    return await ctx.db
      .query("factors")
      .withIndex("by_system", (q) => q.eq("systemId", args.systemId))
      .collect()
  },
})

export const upsert = mutation({
  args: {
    systemId: v.id("systems"),
    valueChainId: v.id("elements"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    return withWriteAccess(ctx, args.systemId, "factor.upsert", "factor", async () => {
      const existing = await ctx.db
        .query("factors")
        .withIndex("by_value_chain", (q) =>
          q.eq("valueChainId", args.valueChainId)
        )
        .first()

      if (existing) {
        await ctx.db.patch(existing._id, { content: args.content })
        return existing._id
      } else {
        const newId = await ctx.db.insert("factors", args)
        return newId
      }
    })
  },
})

export const remove = mutation({
  args: { id: v.id("factors") },
  handler: async (ctx, args) => {
    const factor = await ctx.db.get(args.id)
    if (!factor) throw new Error("Factor not found")
    
    return withWriteAccess(ctx, factor.systemId, "factor.delete", "factor", async () => {
      await ctx.db.delete(args.id)
    })
  },
})
