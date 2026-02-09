import { query, mutation } from "./_generated/server"
import { v } from "convex/values"

export const bySystem = query({
  args: { systemId: v.id("systems") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("kpis")
      .withIndex("by_system", (q) => q.eq("systemId", args.systemId))
      .collect()
  },
})

export const byParent = query({
  args: { parentId: v.id("elements") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("kpis")
      .withIndex("by_parent", (q) => q.eq("parentId", args.parentId))
      .collect()
  },
})

export const create = mutation({
  args: {
    systemId: v.id("systems"),
    parentId: v.id("elements"),
    content: v.string(),
    orderIndex: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("kpis", args)
  },
})

export const update = mutation({
  args: {
    id: v.id("kpis"),
    content: v.optional(v.string()),
    orderIndex: v.optional(v.number()),
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
  args: { id: v.id("kpis") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id)
  },
})

export const replaceForParent = mutation({
  args: {
    systemId: v.id("systems"),
    parentId: v.id("elements"),
    kpis: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    // Delete all existing KPIs for this parent
    const existing = await ctx.db
      .query("kpis")
      .withIndex("by_parent", (q) => q.eq("parentId", args.parentId))
      .collect()
    for (const kpi of existing) {
      await ctx.db.delete(kpi._id)
    }
    // Create new KPIs
    for (let i = 0; i < args.kpis.length; i++) {
      await ctx.db.insert("kpis", {
        systemId: args.systemId,
        parentId: args.parentId,
        content: args.kpis[i],
        orderIndex: i,
      })
    }
  },
})
