import { query, mutation } from "./_generated/server"
import { v } from "convex/values"
import { requireAuth, requireWriteAccess } from "./lib/permissions"
import { logAudit } from "./auditLogs"

export const bySystem = query({
  args: { systemId: v.id("systems") },
  handler: async (ctx, args) => {
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
    const user = await requireAuth(ctx)
    await requireWriteAccess(ctx, user._id, args.systemId)

    const existing = await ctx.db
      .query("factors")
      .withIndex("by_value_chain", (q) =>
        q.eq("valueChainId", args.valueChainId)
      )
      .first()

    const system = await ctx.db.get(args.systemId)
    if (existing) {
      await ctx.db.patch(existing._id, { content: args.content })
      await logAudit(ctx, {
        userId: user._id,
        userEmail: user.email,
        action: "factor.update",
        resourceType: "factor",
        resourceId: existing._id,
        details: { content: args.content },
        orgId: system?.orgId,
      })
      return existing._id
    } else {
      const newId = await ctx.db.insert("factors", args)
      await logAudit(ctx, {
        userId: user._id,
        userEmail: user.email,
        action: "factor.create",
        resourceType: "factor",
        resourceId: newId,
        details: { content: args.content },
        orgId: system?.orgId,
      })
      return newId
    }
  },
})

export const remove = mutation({
  args: { id: v.id("factors") },
  handler: async (ctx, args) => {
    const user = await requireAuth(ctx)
    const factor = await ctx.db.get(args.id)
    if (!factor) throw new Error("Factor not found")
    await requireWriteAccess(ctx, user._id, factor.systemId)
    const system = await ctx.db.get(factor.systemId)
    await logAudit(ctx, {
      userId: user._id,
      userEmail: user.email,
      action: "factor.delete",
      resourceType: "factor",
      resourceId: args.id,
      details: { content: factor.content },
      orgId: system?.orgId,
    })
    await ctx.db.delete(args.id)
  },
})
