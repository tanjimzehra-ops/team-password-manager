import { query, mutation } from "./_generated/server"
import { v } from "convex/values"

export const list = query({
  args: {},
  handler: async (ctx) => {
    const systems = await ctx.db.query("systems").collect()
    return systems.map((s) => ({
      _id: s._id,
      name: s.name,
      sector: s.sector,
    }))
  },
})

export const get = query({
  args: { id: v.id("systems") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id)
  },
})

export const getFullSystem = query({
  args: { id: v.id("systems") },
  handler: async (ctx, args) => {
    const system = await ctx.db.get(args.id)
    if (!system) return null

    const [elements, matrixCells, kpis, capabilities, externalValues, factors] =
      await Promise.all([
        ctx.db
          .query("elements")
          .withIndex("by_system", (q) => q.eq("systemId", args.id))
          .collect(),
        ctx.db
          .query("matrixCells")
          .withIndex("by_system_type", (q) => q.eq("systemId", args.id))
          .collect(),
        ctx.db
          .query("kpis")
          .withIndex("by_system", (q) => q.eq("systemId", args.id))
          .collect(),
        ctx.db
          .query("capabilities")
          .withIndex("by_system_type", (q) => q.eq("systemId", args.id))
          .collect(),
        ctx.db
          .query("externalValues")
          .withIndex("by_system", (q) => q.eq("systemId", args.id))
          .collect(),
        ctx.db
          .query("factors")
          .withIndex("by_system", (q) => q.eq("systemId", args.id))
          .collect(),
      ])

    return {
      ...system,
      elements,
      matrixCells,
      kpis,
      capabilities,
      externalValues,
      factors,
    }
  },
})

export const create = mutation({
  args: {
    name: v.string(),
    sector: v.optional(v.string()),
    impact: v.string(),
    dimension: v.string(),
    challenge: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("systems", args)
  },
})

export const update = mutation({
  args: {
    id: v.id("systems"),
    name: v.optional(v.string()),
    sector: v.optional(v.string()),
    impact: v.optional(v.string()),
    dimension: v.optional(v.string()),
    challenge: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...fields } = args
    const updates: Record<string, string> = {}
    for (const [key, value] of Object.entries(fields)) {
      if (value !== undefined) {
        updates[key] = value
      }
    }
    await ctx.db.patch(id, updates)
  },
})

export const remove = mutation({
  args: { id: v.id("systems") },
  handler: async (ctx, args) => {
    const [elements, matrixCells, kpis, capabilities, externalValues, factors] =
      await Promise.all([
        ctx.db
          .query("elements")
          .withIndex("by_system", (q) => q.eq("systemId", args.id))
          .collect(),
        ctx.db
          .query("matrixCells")
          .withIndex("by_system_type", (q) => q.eq("systemId", args.id))
          .collect(),
        ctx.db
          .query("kpis")
          .withIndex("by_system", (q) => q.eq("systemId", args.id))
          .collect(),
        ctx.db
          .query("capabilities")
          .withIndex("by_system_type", (q) => q.eq("systemId", args.id))
          .collect(),
        ctx.db
          .query("externalValues")
          .withIndex("by_system", (q) => q.eq("systemId", args.id))
          .collect(),
        ctx.db
          .query("factors")
          .withIndex("by_system", (q) => q.eq("systemId", args.id))
          .collect(),
      ])

    await Promise.all([
      ...elements.map((e) => ctx.db.delete(e._id)),
      ...matrixCells.map((c) => ctx.db.delete(c._id)),
      ...kpis.map((k) => ctx.db.delete(k._id)),
      ...capabilities.map((c) => ctx.db.delete(c._id)),
      ...externalValues.map((ev) => ctx.db.delete(ev._id)),
      ...factors.map((f) => ctx.db.delete(f._id)),
    ])

    await ctx.db.delete(args.id)
  },
})
