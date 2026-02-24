/**
 * Data migrations — run via CLI:
 *   npx convex run migrations:assignLegacyOrgIds
 */

import { mutation } from "./_generated/server"

// System name → Organisation name (mirrors seed.ts SYSTEM_ORG_MAP)
const SYSTEM_ORG_MAP: Record<string, string> = {
  "MERA": "MERA Energy",
  "People globally routinely": "Creating Preferred Futures",
  "Central Highlands Council": "Central Highlands Council",
  "Central Highlands Council - Strategic Plan": "Central Highlands Council",
  "Relationships Australia - Tasmania": "Relationships Australia Tasmania",
  "Illawarra Energy Storage": "Illawarra Energy Storage",
}

const DEFAULT_ORG = "Creating Preferred Futures"

/**
 * Assign orgId to all legacy systems (those without an orgId).
 * Matches by system name first, falls back to the default org.
 * Idempotent — safe to run multiple times.
 */
export const assignLegacyOrgIds = mutation({
  args: {},
  handler: async (ctx) => {
    const allSystems = await ctx.db.query("systems").collect()
    const allOrgs = await ctx.db.query("organisations").collect()

    // Build org lookup by name
    const orgByName = new Map(allOrgs.map((o) => [o.name, o._id]))

    const defaultOrgId = orgByName.get(DEFAULT_ORG)
    if (!defaultOrgId) {
      throw new Error(`Default org "${DEFAULT_ORG}" not found — run seed:createOrganisations first`)
    }

    const results: { system: string; org: string; status: string }[] = []

    for (const system of allSystems) {
      if (system.deletedAt) continue

      if (system.orgId) {
        const orgName = allOrgs.find((o) => o._id === system.orgId)?.name ?? "(unknown)"
        results.push({ system: system.name, org: orgName, status: "already_assigned" })
        continue
      }

      // Try name mapping first
      const mappedOrgName = SYSTEM_ORG_MAP[system.name]
      const targetOrgId = mappedOrgName
        ? orgByName.get(mappedOrgName) ?? defaultOrgId
        : defaultOrgId
      const targetOrgName = mappedOrgName ?? DEFAULT_ORG

      await ctx.db.patch(system._id, { orgId: targetOrgId })
      results.push({
        system: system.name,
        org: targetOrgName,
        status: mappedOrgName ? "assigned_by_name" : "assigned_to_default",
      })
    }

    console.log("assignLegacyOrgIds:", JSON.stringify(results, null, 2))
    return results
  },
})
