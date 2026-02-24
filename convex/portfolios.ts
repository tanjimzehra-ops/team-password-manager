import { query, mutation } from "./_generated/server"
import { v } from "convex/values"
import { requireAuth, requireWriteAccess } from "./lib/permissions"
import { withReadAccess } from "./lib/queries"
import { logAudit } from "./auditLogs"

export const byElement = query({
  args: { elementId: v.id("elements") },
  handler: async (ctx, args) => {
    const element = await ctx.db.get(args.elementId)
    if (!element) return []
    await withReadAccess(ctx, element.systemId)
    return await ctx.db
      .query("portfolios")
      .withIndex("by_element", (q) => q.eq("elementId", args.elementId))
      .collect()
  },
})

export const bySystem = query({
  args: { systemId: v.id("systems") },
  handler: async (ctx, args) => {
    await withReadAccess(ctx, args.systemId)
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
    const user = await requireAuth(ctx)
    await requireWriteAccess(ctx, user._id, args.systemId)
    const portfolioId = await ctx.db.insert("portfolios", args)
    const system = await ctx.db.get(args.systemId)
    await logAudit(ctx, {
      userId: user._id,
      userEmail: user.email,
      action: "portfolio.create",
      resourceType: "portfolio",
      resourceId: portfolioId,
      details: { title: args.title, status: args.status },
      orgId: system?.orgId,
    })
    return portfolioId
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
    const user = await requireAuth(ctx)
    const portfolio = await ctx.db.get(args.id)
    if (!portfolio) throw new Error("Portfolio not found")
    await requireWriteAccess(ctx, user._id, portfolio.systemId)

    const { id, ...fields } = args
    const updates: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(fields)) {
      if (value !== undefined) updates[key] = value
    }
    await ctx.db.patch(id, updates)
    const system = await ctx.db.get(portfolio.systemId)
    await logAudit(ctx, {
      userId: user._id,
      userEmail: user.email,
      action: "portfolio.update",
      resourceType: "portfolio",
      resourceId: args.id,
      details: { updated: Object.keys(updates) },
      orgId: system?.orgId,
    })
  },
})

export const remove = mutation({
  args: { id: v.id("portfolios") },
  handler: async (ctx, args) => {
    const user = await requireAuth(ctx)
    const portfolio = await ctx.db.get(args.id)
    if (!portfolio) throw new Error("Portfolio not found")
    await requireWriteAccess(ctx, user._id, portfolio.systemId)
    const system = await ctx.db.get(portfolio.systemId)
    await logAudit(ctx, {
      userId: user._id,
      userEmail: user.email,
      action: "portfolio.delete",
      resourceType: "portfolio",
      resourceId: args.id,
      details: { title: portfolio.title },
      orgId: system?.orgId,
    })
    await ctx.db.delete(args.id)
  },
})
