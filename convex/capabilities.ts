import { query, mutation } from "./_generated/server"
import { v } from "convex/values"

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
    const existing = await ctx.db
      .query("capabilities")
      .withIndex("by_resource", (q) => q.eq("resourceId", args.resourceId))
      .filter((q) => q.eq(q.field("capabilityType"), args.capabilityType))
      .first()

    if (existing) {
      await ctx.db.patch(existing._id, { content: args.content })
      return existing._id
    } else {
      return await ctx.db.insert("capabilities", args)
    }
  },
})

export const remove = mutation({
  args: { id: v.id("capabilities") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id)
  },
})
