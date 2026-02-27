import { mutation } from "./_generated/server"

export const bootstrapDevAuth = mutation({
    args: {},
    handler: async (ctx) => {
        // 1. Create CPF Org
        let cpfOrg = await ctx.db
            .query("organisations")
            .filter((q) => q.eq(q.field("name"), "Creating Preferred Futures"))
            .first()

        if (!cpfOrg) {
            const orgId = await ctx.db.insert("organisations", {
                name: "Creating Preferred Futures",
                contactEmail: "martin@creatingpreferredfutures.com.au",
                status: "active",
            })
            cpfOrg = await ctx.db.get(orgId)
        }

        if (!cpfOrg) throw new Error("Failed to create/find CPF Org")

        // 2. Create User
        let user = await ctx.db
            .query("users")
            .withIndex("by_email", (q) => q.eq("email", "nicopt.au@gmail.com"))
            .first()

        if (!user) {
            const userId = await ctx.db.insert("users", {
                email: "nicopt.au@gmail.com",
                name: "Nicolas dev",
                workosId: "placeholder_workos_id",
            })
            user = await ctx.db.get(userId)
        }

        if (!user) throw new Error("Failed to create/find User")

        // 3. Create Membership
        const existingMembership = await ctx.db
            .query("memberships")
            .withIndex("by_user_org", (q) =>
                q.eq("userId", user!._id).eq("orgId", cpfOrg!._id)
            )
            .first()

        if (!existingMembership) {
            await ctx.db.insert("memberships", {
                userId: user._id,
                orgId: cpfOrg._id,
                role: "super_admin",
            })
        } else if (existingMembership.role !== "super_admin") {
            await ctx.db.patch(existingMembership._id, { role: "super_admin", deletedAt: undefined })
        }

        return { success: true, userId: user._id, orgId: cpfOrg._id }
    },
})
