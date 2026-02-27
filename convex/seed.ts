/**
 * Seed Script - Migrate JSON data files into Convex
 *
 * Usage via Convex dashboard or CLI:
 *   npx convex run seed:seedSystem '{"jsonData": "{...}"}'
 */

import { internalMutation, mutation, type MutationCtx } from "./_generated/server"
import { v } from "convex/values"
import { Id } from "./_generated/dataModel"

interface LogicModelElement {
  id: string
  order: number
  content: string
  description?: string
}

interface MatrixCell {
  content: string
  order: number
  column: number
  xaxis?: string
  yaxis?: string
}

interface KPIEntry {
  content: string
  parent_id: string
  parent_order: number
}

interface CapabilityEntry {
  content: string
  parent_id: string
  parent_order: number
}

interface FactorEntry {
  content: string
  parent_id: string
  parent_order: number
}

interface SystemJSON {
  system_id: number
  name: string
  logic_model: {
    impact: string
    dimension: string
    challenge: string
    outcomes: LogicModelElement[]
    value_chain: LogicModelElement[]
    resources: LogicModelElement[]
  }
  matrices: {
    contribution_map: MatrixCell[]
    delivery_pathways: MatrixCell[]
    external_influences: MatrixCell[]
  }
  external_values: LogicModelElement[]
  kpis: {
    by_value: KPIEntry[]
    by_outcome: KPIEntry[]
    by_dimension: KPIEntry[]
  }
  capabilities: {
    current_by_resource: CapabilityEntry[]
    necessary_by_resource: CapabilityEntry[]
  }
  factors: {
    by_value: FactorEntry[]
    by_external_value: FactorEntry[]
  }
}

const seedSystemHandler = async (
  ctx: MutationCtx,
  { jsonData }: { jsonData: string }
) => {
  const data: SystemJSON = JSON.parse(jsonData)

  // 1. Create system
  const systemId = await ctx.db.insert("systems", {
    name: data.name,
    impact: data.logic_model.impact,
    dimension: data.logic_model.dimension,
    challenge: data.logic_model.challenge,
    impactHealth: Math.floor(Math.random() * 51) + 50,
    dimensionHealth: Math.floor(Math.random() * 51) + 50,
    challengeHealth: Math.floor(Math.random() * 51) + 50,
  })
  console.log(`Created system: "${data.name}" -> ${systemId}`)

  // 2. Create elements with ID mapping (old string ID -> Convex ID)
  const idMap = new Map<string, Id<"elements">>()

  async function insertElements(
    elements: LogicModelElement[],
    elementType: "outcome" | "value_chain" | "resource"
  ) {
    for (const el of elements) {
      const convexId = await ctx.db.insert("elements", {
        systemId,
        elementType,
        content: el.content,
        description: el.description || undefined,
        orderIndex: el.order,
        gradientValue: Math.floor(Math.random() * 51) + 50, // Random 50-100
      })
      idMap.set(el.id, convexId)
    }
  }

  await insertElements(data.logic_model.outcomes, "outcome")
  await insertElements(data.logic_model.value_chain, "value_chain")
  await insertElements(data.logic_model.resources, "resource")
  console.log(`Created ${idMap.size} elements`)

  // 3. Create external values
  const externalIdMap = new Map<string, Id<"externalValues">>()
  for (const ev of data.external_values) {
    const convexId = await ctx.db.insert("externalValues", {
      systemId,
      content: ev.content,
      description: ev.description || undefined,
      orderIndex: ev.order,
    })
    externalIdMap.set(ev.id, convexId)
  }
  console.log(`Created ${externalIdMap.size} external values`)

  // 4. Create matrix cells
  // Contribution Map: xaxis = Outcome ID, yaxis = Value Chain ID
  let contributionCount = 0
  for (const cell of data.matrices.contribution_map) {
    if (!cell.content) continue
    let rowId: Id<"elements"> | undefined
    let colId: Id<"elements"> | undefined
    const hasValidAxis = cell.xaxis && cell.yaxis && cell.xaxis !== "0" && cell.yaxis !== "0"
    if (hasValidAxis) {
      colId = idMap.get(cell.xaxis!)
      rowId = idMap.get(cell.yaxis!)
    } else {
      const vcEl = data.logic_model.value_chain[cell.order]
      const outEl = data.logic_model.outcomes[cell.column]
      if (vcEl) rowId = idMap.get(vcEl.id)
      if (outEl) colId = idMap.get(outEl.id)
    }
    if (rowId && colId) {
      await ctx.db.insert("matrixCells", {
        systemId, matrixType: "contribution", rowElementId: rowId, colElementId: colId, content: cell.content,
      })
      contributionCount++
    }
  }

  // Delivery Pathways: xaxis = Resource ID, yaxis = Value Chain ID
  let developmentCount = 0
  for (const cell of data.matrices.delivery_pathways) {
    if (!cell.content) continue
    let rowId: Id<"elements"> | undefined
    let colId: Id<"elements"> | undefined
    const hasValidAxis = cell.xaxis && cell.yaxis && cell.xaxis !== "0" && cell.yaxis !== "0"
    if (hasValidAxis) {
      colId = idMap.get(cell.xaxis!)
      rowId = idMap.get(cell.yaxis!)
    } else {
      const vcEl = data.logic_model.value_chain[cell.order]
      const resEl = data.logic_model.resources[cell.column]
      if (vcEl) rowId = idMap.get(vcEl.id)
      if (resEl) colId = idMap.get(resEl.id)
    }
    if (rowId && colId) {
      await ctx.db.insert("matrixCells", {
        systemId, matrixType: "development", rowElementId: rowId, colElementId: colId, content: cell.content,
      })
      developmentCount++
    }
  }

  // Convergence: xaxis = External Value ID, yaxis = Value Chain ID
  let convergenceCount = 0
  for (const cell of data.matrices.external_influences) {
    if (!cell.content) continue
    let rowId: Id<"elements"> | undefined
    let colId: string | undefined
    const hasValidAxis = cell.xaxis && cell.yaxis && cell.xaxis !== "0" && cell.yaxis !== "0"
    if (hasValidAxis) {
      const extId = externalIdMap.get(cell.xaxis!)
      colId = extId ? String(extId) : undefined
      rowId = idMap.get(cell.yaxis!)
    } else {
      const vcEl = data.logic_model.value_chain[cell.order]
      const extEl = data.external_values[cell.column]
      if (vcEl) rowId = idMap.get(vcEl.id)
      if (extEl) {
        const extId = externalIdMap.get(extEl.id)
        colId = extId ? String(extId) : undefined
      }
    }
    if (rowId && colId) {
      await ctx.db.insert("matrixCells", {
        systemId, matrixType: "convergence", rowElementId: rowId, colElementId: colId, content: cell.content,
      })
      convergenceCount++
    }
  }

  console.log(`Matrix cells: ${contributionCount} contribution, ${developmentCount} development, ${convergenceCount} convergence`)

  // 5. Create KPIs
  let kpiCount = 0
  async function insertKPIs(kpis: KPIEntry[]) {
    for (const kpi of kpis) {
      if (!kpi.content) continue
      const parentId = idMap.get(kpi.parent_id)
      if (!parentId) continue
      await ctx.db.insert("kpis", { systemId, parentId, content: kpi.content, orderIndex: kpi.parent_order })
      kpiCount++
    }
  }
  await insertKPIs(data.kpis.by_value)
  await insertKPIs(data.kpis.by_outcome)
  await insertKPIs(data.kpis.by_dimension)
  console.log(`Created ${kpiCount} KPIs`)

  // 6. Create capabilities
  let capCount = 0
  async function insertCaps(caps: CapabilityEntry[], type: "current" | "necessary") {
    for (const cap of caps) {
      if (!cap.content) continue
      const resourceId = idMap.get(cap.parent_id)
      if (!resourceId) continue
      await ctx.db.insert("capabilities", { systemId, resourceId, capabilityType: type, content: cap.content })
      capCount++
    }
  }
  await insertCaps(data.capabilities.current_by_resource, "current")
  await insertCaps(data.capabilities.necessary_by_resource, "necessary")
  console.log(`Created ${capCount} capabilities`)

  // 7. Create factors
  let factorCount = 0
  for (const factor of data.factors.by_value) {
    if (!factor.content) continue
    const valueChainId = idMap.get(factor.parent_id)
    if (!valueChainId) continue
    await ctx.db.insert("factors", { systemId, valueChainId, content: factor.content })
    factorCount++
  }
  console.log(`Created ${factorCount} factors`)

  console.log(`\n=== Seed complete: "${data.name}" ===`)
  return { systemId, elements: idMap.size, externalValues: externalIdMap.size, matrixCells: contributionCount + developmentCount + convergenceCount, kpis: kpiCount, capabilities: capCount, factors: factorCount }
}

export const seedSystem = internalMutation({
  args: { jsonData: v.string() },
  handler: seedSystemHandler,
})

/** Public wrapper for seedSystem */
export const seedSystemPublic = mutation({
  args: { jsonData: v.string() },
  handler: seedSystemHandler,
})

// =============================================================================
// Auth Seed Functions — Bootstrap organisations, super admins, system mapping
//
// Execution order:
//   1. npx convex run seed:createOrganisations
//   2. (Users sign in via WorkOS — getOrCreateMe auto-provisions their records)
//   3. npx convex run seed:bootstrapSuperAdmins
//   4. npx convex run seed:assignSystemOrgs
// =============================================================================

const AUTH_ORGANISATIONS = [
  { name: "Creating Preferred Futures", contactEmail: "martin@creatingpreferredfutures.com.au", status: "active" as const },
  { name: "MERA Energy", contactEmail: "nicolas@meraenergy.com.au", status: "active" as const },
  { name: "Central Highlands Council", status: "active" as const },
  { name: "Relationships Australia Tasmania", status: "active" as const },
  { name: "Kiraa", status: "trial" as const },
  { name: "Levur", status: "trial" as const },
  { name: "Illawarra Energy Storage", status: "trial" as const },
]

const SUPER_ADMIN_EMAILS = [
  "nicopt.au@gmail.com",
  "nicolas@meraenergy.com.au",
  "martin@creatingpreferredfutures.com.au",
  "sahanipradeep103@gmail.com",
  "tanjimzehra@gmail.com",
]

// System name (in Convex DB) → Organisation name
const SYSTEM_ORG_MAP: Record<string, string> = {
  "MERA": "MERA Energy",
  "People globally routinely": "Creating Preferred Futures",
  "Central Highlands Council": "Central Highlands Council",
  "Central Highlands Council - Strategic Plan": "Central Highlands Council",
  "Relationships Australia - Tasmania": "Relationships Australia Tasmania",
  "Illawarra Energy Storage": "Illawarra Energy Storage",
}

/** Step 1: Create organisations */
export const createOrganisations = internalMutation({
  args: {},
  handler: async (ctx) => {
    const results: { name: string; status: string }[] = []

    for (const org of AUTH_ORGANISATIONS) {
      const existing = await ctx.db
        .query("organisations")
        .filter((q) => q.eq(q.field("name"), org.name))
        .first()

      if (existing) {
        results.push({ name: org.name, status: "already_exists" })
        continue
      }

      await ctx.db.insert("organisations", org)
      results.push({ name: org.name, status: "created" })
    }

    console.log("createOrganisations:", JSON.stringify(results, null, 2))
    return results
  },
})

/** Step 2: Bootstrap super admins — run AFTER users have signed in */
export const bootstrapSuperAdmins = internalMutation({
  args: {},
  handler: async (ctx) => {
    const cpfOrg = await ctx.db
      .query("organisations")
      .filter((q) => q.eq(q.field("name"), "Creating Preferred Futures"))
      .first()

    if (!cpfOrg) throw new Error("CPF org not found — run createOrganisations first")

    const results: { email: string; status: string }[] = []

    for (const email of SUPER_ADMIN_EMAILS) {
      const user = await ctx.db
        .query("users")
        .withIndex("by_email", (q) => q.eq("email", email))
        .first()

      if (!user) {
        results.push({ email, status: "user_not_found — must sign in first" })
        continue
      }
      if (user.deletedAt) {
        results.push({ email, status: "user_soft_deleted — skipped" })
        continue
      }

      const existing = await ctx.db
        .query("memberships")
        .withIndex("by_user_org", (q) =>
          q.eq("userId", user._id).eq("orgId", cpfOrg._id)
        )
        .first()

      if (existing && !existing.deletedAt) {
        if (existing.role !== "super_admin") {
          await ctx.db.patch(existing._id, { role: "super_admin" })
          results.push({ email, status: "upgraded_to_super_admin" })
        } else {
          results.push({ email, status: "already_super_admin" })
        }
      } else if (existing?.deletedAt) {
        await ctx.db.patch(existing._id, { role: "super_admin", deletedAt: undefined })
        results.push({ email, status: "restored_as_super_admin" })
      } else {
        await ctx.db.insert("memberships", {
          userId: user._id,
          orgId: cpfOrg._id,
          role: "super_admin",
        })
        results.push({ email, status: "created_as_super_admin" })
      }
    }

    console.log("bootstrapSuperAdmins:", JSON.stringify(results, null, 2))
    return results
  },
})

/** Step 3: Assign orgIds to existing systems by name match */
export const assignSystemOrgs = internalMutation({
  args: {},
  handler: async (ctx) => {
    const allSystems = await ctx.db.query("systems").collect()
    const results: { system: string; org: string; status: string }[] = []

    for (const system of allSystems) {
      if (system.deletedAt) continue
      if (system.orgId) {
        results.push({ system: system.name, org: "(already assigned)", status: "skipped" })
        continue
      }

      const orgName = SYSTEM_ORG_MAP[system.name]
      if (!orgName) {
        results.push({ system: system.name, org: "(no mapping)", status: "skipped_no_mapping" })
        continue
      }

      const org = await ctx.db
        .query("organisations")
        .filter((q) => q.eq(q.field("name"), orgName))
        .first()

      if (!org) {
        results.push({ system: system.name, org: orgName, status: "org_not_found" })
        continue
      }

      await ctx.db.patch(system._id, { orgId: org._id })
      results.push({ system: system.name, org: orgName, status: "assigned" })
    }

    console.log("assignSystemOrgs:", JSON.stringify(results, null, 2))
    return results
  },
})
