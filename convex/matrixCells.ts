import { query, mutation } from "./_generated/server"
import { v } from "convex/values"
import { requireAuth, requireWriteAccess } from "./lib/permissions"
import { logAudit } from "./auditLogs"

export const bySystemAndType = query({
  args: {
    systemId: v.id("systems"),
    matrixType: v.union(
      v.literal("contribution"),
      v.literal("development"),
      v.literal("convergence")
    ),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("matrixCells")
      .withIndex("by_system_type", (q) =>
        q.eq("systemId", args.systemId).eq("matrixType", args.matrixType)
      )
      .collect()
  },
})

export const upsert = mutation({
  args: {
    systemId: v.id("systems"),
    matrixType: v.union(
      v.literal("contribution"),
      v.literal("development"),
      v.literal("convergence")
    ),
    rowElementId: v.id("elements"),
    colElementId: v.string(),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await requireAuth(ctx)
    await requireWriteAccess(ctx, user._id, args.systemId)

    const existing = await ctx.db
      .query("matrixCells")
      .withIndex("by_row", (q) =>
        q
          .eq("systemId", args.systemId)
          .eq("matrixType", args.matrixType)
          .eq("rowElementId", args.rowElementId)
      )
      .filter((q) => q.eq(q.field("colElementId"), args.colElementId))
      .first()

    const system = await ctx.db.get(args.systemId)
    if (existing) {
      await ctx.db.patch(existing._id, { content: args.content })
      await logAudit(ctx, {
        userId: user._id,
        userEmail: user.email,
        action: "matrixCell.update",
        resourceType: "matrixCell",
        resourceId: existing._id,
        details: { matrixType: args.matrixType },
        orgId: system?.orgId,
      })
      return existing._id
    } else {
      const newId = await ctx.db.insert("matrixCells", args)
      await logAudit(ctx, {
        userId: user._id,
        userEmail: user.email,
        action: "matrixCell.create",
        resourceType: "matrixCell",
        resourceId: newId,
        details: { matrixType: args.matrixType },
        orgId: system?.orgId,
      })
      return newId
    }
  },
})

export const remove = mutation({
  args: { id: v.id("matrixCells") },
  handler: async (ctx, args) => {
    const user = await requireAuth(ctx)
    const cell = await ctx.db.get(args.id)
    if (!cell) throw new Error("Matrix cell not found")
    await requireWriteAccess(ctx, user._id, cell.systemId)
    const system = await ctx.db.get(cell.systemId)
    await logAudit(ctx, {
      userId: user._id,
      userEmail: user.email,
      action: "matrixCell.delete",
      resourceType: "matrixCell",
      resourceId: args.id,
      details: { matrixType: cell.matrixType },
      orgId: system?.orgId,
    })
    await ctx.db.delete(args.id)
  },
})
