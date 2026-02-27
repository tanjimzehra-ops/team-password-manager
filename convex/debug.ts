import { query } from "./_generated/server"

export const inspect = query({
    args: {},
    handler: async (ctx) => {
        const systems = await ctx.db.query("systems").collect()
        const elements = await ctx.db.query("elements").collect()
        return {
            systemsCount: systems.length,
            elementsCount: elements.length,
            systems: systems.map(s => ({ id: s._id, name: s.name })),
        }
    },
})
