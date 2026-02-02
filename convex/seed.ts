/**
 * Seed Script - Migrate JSON data files into Convex
 *
 * Usage via Convex dashboard or CLI:
 *   npx convex run seed:seedSystem '{"jsonData": "{...}"}'
 */

import { internalMutation } from "./_generated/server"
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

export const seedSystem = internalMutation({
  args: { jsonData: v.string() },
  handler: async (ctx, { jsonData }) => {
    const data: SystemJSON = JSON.parse(jsonData)

    // 1. Create system
    const systemId = await ctx.db.insert("systems", {
      name: data.name,
      impact: data.logic_model.impact,
      dimension: data.logic_model.dimension,
      challenge: data.logic_model.challenge,
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
  },
})
