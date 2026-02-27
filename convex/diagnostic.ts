import { query } from "./_generated/server";

export const listAllSystems = query({
    args: {},
    handler: async (ctx) => {
        const systems = await ctx.db.query("systems").collect();
        return {
            count: systems.length,
            names: systems.map(s => s.name),
            ids: systems.map(s => s._id)
        };
    },
});
