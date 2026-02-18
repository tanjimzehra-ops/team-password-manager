import { query, mutation } from "./_generated/server"
import { v } from "convex/values"
import { requireAuth, requireWriteAccess } from "./lib/permissions"

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

    if (existing) {
      await ctx.db.patch(existing._id, { content: args.content })
      return existing._id
    } else {
      return await ctx.db.insert("matrixCells", args)
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
    await ctx.db.delete(args.id)
  },
})
