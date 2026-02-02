/**
 * Convex-based hook for fetching a full system with all related data
 * Replaces the Supabase-based useFullSystem + SystemDataAdapter for Convex mode
 *
 * This is the KEY hook - it transforms Convex data into the UI types
 * (RowData[], ContributionMapData, DevelopmentPathwaysData, ConvergenceMapData)
 * so that components receive the exact same shape and do not need to change.
 */

import { useQuery } from "convex/react"
import { api } from "../../convex/_generated/api"
import type { Id } from "../../convex/_generated/dataModel"
import type {
  RowData,
  NodeData,
  ContributionMapData,
  ContributionCell,
  ValueChainKPIs,
  OutcomeKPIs,
  DevelopmentPathwaysData,
  DevelopmentCell,
  CapabilityData,
  ConvergenceMapData,
  ConvergenceCell,
  ExternalFactor,
  FactorData,
} from "../../lib/types"

// ---------------------------------------------------------------------------
// Internal types for the raw Convex query response
// ---------------------------------------------------------------------------

interface ConvexElement {
  _id: Id<"elements">
  systemId: Id<"systems">
  elementType: "outcome" | "value_chain" | "resource"
  content: string
  description?: string
  orderIndex: number
  gradientValue?: number
}

interface ConvexMatrixCell {
  _id: Id<"matrixCells">
  systemId: Id<"systems">
  matrixType: "contribution" | "development" | "convergence"
  rowElementId: Id<"elements">
  colElementId: Id<"elements">
  content: string
}

interface ConvexKPI {
  _id: Id<"kpis">
  systemId: Id<"systems">
  parentId: Id<"elements">
  content: string
  orderIndex: number
}

interface ConvexCapability {
  _id: Id<"capabilities">
  systemId: Id<"systems">
  resourceId: Id<"elements">
  capabilityType: "current" | "necessary"
  content: string
}

interface ConvexExternalValue {
  _id: Id<"externalValues">
  systemId: Id<"systems">
  content: string
  description?: string
  orderIndex: number
}

interface ConvexFactor {
  _id: Id<"factors">
  systemId: Id<"systems">
  valueChainId: Id<"elements">
  content: string
}

interface ConvexSystem {
  _id: Id<"systems">
  name: string
  sector?: string
  impact: string
  dimension: string
  challenge: string
}

interface FullSystemPayload {
  system: ConvexSystem
  elements: ConvexElement[]
  matrixCells: ConvexMatrixCell[]
  kpis: ConvexKPI[]
  capabilities: ConvexCapability[]
  externalValues: ConvexExternalValue[]
  factors: ConvexFactor[]
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function toNodeData(
  el: ConvexElement,
  category: NodeData["category"],
  color: NodeData["color"] = "secondary"
): NodeData {
  return {
    id: el._id,
    title: el.content,
    description: el.description ?? "",
    kpiValue: el.gradientValue ?? 100,
    kpiStatus: gradientToStatus(el.gradientValue ?? 100),
    category,
    color,
  }
}

function gradientToStatus(
  value: number
): "healthy" | "warning" | "critical" {
  if (value >= 70) return "healthy"
  if (value >= 40) return "warning"
  return "critical"
}

function elementsByType(
  elements: ConvexElement[],
  type: ConvexElement["elementType"]
): ConvexElement[] {
  return elements
    .filter((e) => e.elementType === type)
    .sort((a, b) => a.orderIndex - b.orderIndex)
}

// ---------------------------------------------------------------------------
// Transform functions
// ---------------------------------------------------------------------------

function buildInitialData(payload: FullSystemPayload): RowData[] {
  const { system, elements } = payload
  const outcomes = elementsByType(elements, "outcome")
  const valueChain = elementsByType(elements, "value_chain")
  const resources = elementsByType(elements, "resource")

  return [
    {
      id: "purpose",
      label: "Purpose",
      category: "purpose",
      color: "bg-red-700 dark:bg-red-800",
      nodes: [
        {
          id: "purpose-1",
          title: system.impact || `${system.name} Purpose`,
          description: `The core purpose statement for ${system.name}.`,
          kpiValue: 100,
          kpiStatus: "healthy",
          category: "purpose",
          color: "primary",
          metadata: {
            "System ID": system._id,
            System: system.name,
          },
        },
      ],
    },
    {
      id: "outcomes",
      label: "Outcomes",
      category: "outcomes",
      color: "bg-red-600 dark:bg-red-700",
      nodes: outcomes.map((o, idx) =>
        toNodeData(o, "outcomes", idx % 2 === 0 ? "secondary" : "accent")
      ),
    },
    {
      id: "value-chain",
      label: "Value Chain",
      category: "value-chain",
      color: "bg-red-500 dark:bg-red-600",
      nodes: valueChain.map((v) => toNodeData(v, "value-chain", "secondary")),
    },
    {
      id: "resources",
      label: "Resources & Capability",
      category: "resources",
      color: "bg-red-400 dark:bg-red-500",
      nodes: resources.map((r) => toNodeData(r, "resources", "secondary")),
    },
  ]
}

function buildContributionMapData(
  payload: FullSystemPayload
): ContributionMapData {
  const outcomes = elementsByType(payload.elements, "outcome")
  const valueChain = elementsByType(payload.elements, "value_chain")

  const outcomeNodes = outcomes.map((o, idx) =>
    toNodeData(o, "outcomes", idx % 2 === 0 ? "secondary" : "accent")
  )
  const vcNodes = valueChain.map((v) =>
    toNodeData(v, "value-chain", "secondary")
  )

  // KPIs per value chain element
  const valueChainKpis: ValueChainKPIs[] = valueChain.map((vc) => ({
    valueChainId: vc._id,
    kpis: payload.kpis
      .filter((k) => k.parentId === vc._id && k.content !== "")
      .sort((a, b) => a.orderIndex - b.orderIndex)
      .map((k) => k.content),
  }))

  // KPIs per outcome
  const outcomeKpis: OutcomeKPIs[] = outcomes.map((o) => ({
    outcomeId: o._id,
    kpis: payload.kpis
      .filter((k) => k.parentId === o._id && k.content !== "")
      .sort((a, b) => a.orderIndex - b.orderIndex)
      .map((k) => k.content),
  }))

  // Contribution cells (VC x Outcome)
  const contributionCells = payload.matrixCells.filter(
    (c) => c.matrixType === "contribution"
  )

  const cells: ContributionCell[] = []
  for (const vc of valueChain) {
    for (const o of outcomes) {
      const existing = contributionCells.find(
        (c) => c.rowElementId === vc._id && c.colElementId === o._id
      )
      cells.push({
        valueChainId: vc._id,
        outcomeId: o._id,
        content: existing?.content ?? "",
      })
    }
  }

  return {
    outcomes: outcomeNodes,
    valueChain: vcNodes,
    valueChainKpis,
    outcomeKpis,
    cells,
  }
}

function buildDevelopmentPathwaysData(
  payload: FullSystemPayload
): DevelopmentPathwaysData {
  const valueChain = elementsByType(payload.elements, "value_chain")
  const resources = elementsByType(payload.elements, "resource")

  const vcNodes = valueChain.map((v) =>
    toNodeData(v, "value-chain", "secondary")
  )
  const resourceNodes = resources.map((r) =>
    toNodeData(r, "resources", "secondary")
  )

  // Current capabilities per resource
  const currentCapabilitiesPerResource: CapabilityData[] = resources.map(
    (r) => {
      const cap = payload.capabilities.find(
        (c) => c.resourceId === r._id && c.capabilityType === "current"
      )
      return { id: cap?._id, content: cap?.content ?? "" }
    }
  )

  // Current capabilities per value chain (mapped from factors)
  const currentCapabilitiesPerVC: CapabilityData[] = valueChain.map((vc) => {
    const factor = payload.factors.find((f) => f.valueChainId === vc._id)
    return { id: factor?._id, content: factor?.content ?? "" }
  })

  // Necessary capabilities per resource
  const necessaryCapabilities: CapabilityData[] = resources.map((r) => {
    const cap = payload.capabilities.find(
      (c) => c.resourceId === r._id && c.capabilityType === "necessary"
    )
    return { id: cap?._id, content: cap?.content ?? "" }
  })

  // Development cells (VC x Resource)
  const devCells = payload.matrixCells.filter(
    (c) => c.matrixType === "development"
  )

  const cells: DevelopmentCell[] = []
  for (const vc of valueChain) {
    for (const r of resources) {
      const existing = devCells.find(
        (c) => c.rowElementId === vc._id && c.colElementId === r._id
      )
      cells.push({
        valueChainId: vc._id,
        resourceId: r._id,
        content: existing?.content ?? "",
      })
    }
  }

  // KPIs per value chain
  const kpis: ValueChainKPIs[] = valueChain.map((vc) => ({
    valueChainId: vc._id,
    kpis: payload.kpis
      .filter((k) => k.parentId === vc._id && k.content !== "")
      .sort((a, b) => a.orderIndex - b.orderIndex)
      .map((k) => k.content),
  }))

  return {
    resources: resourceNodes,
    valueChain: vcNodes,
    currentCapabilitiesPerResource,
    currentCapabilitiesPerVC,
    necessaryCapabilities,
    cells,
    kpis,
    dimension: payload.system.dimension,
  }
}

function buildConvergenceMapData(
  payload: FullSystemPayload
): ConvergenceMapData {
  const valueChain = elementsByType(payload.elements, "value_chain")

  const vcNodes = valueChain.map((v) =>
    toNodeData(v, "value-chain", "secondary")
  )

  // External factors
  const externalFactors: ExternalFactor[] = payload.externalValues
    .sort((a, b) => a.orderIndex - b.orderIndex)
    .map((ev) => ({
      id: ev._id,
      title: ev.content,
      description: ev.description ?? "",
    }))

  // Convergence cells (VC x External Factor)
  const convCells = payload.matrixCells.filter(
    (c) => c.matrixType === "convergence"
  )

  const cells: ConvergenceCell[] = []
  for (const vc of valueChain) {
    for (const ef of payload.externalValues) {
      const existing = convCells.find(
        (c) => c.rowElementId === vc._id && c.colElementId === (ef._id as unknown as Id<"elements">)
      )
      cells.push({
        valueChainId: vc._id,
        externalFactorId: ef._id,
        content: existing?.content ?? "",
      })
    }
  }

  // KPIs per value chain
  const kpis: ValueChainKPIs[] = valueChain.map((vc) => ({
    valueChainId: vc._id,
    kpis: payload.kpis
      .filter((k) => k.parentId === vc._id && k.content !== "")
      .sort((a, b) => a.orderIndex - b.orderIndex)
      .map((k) => k.content),
  }))

  // Factors per value chain element
  const factorsPerVC: FactorData[] = valueChain.map((vc) => {
    const factor = payload.factors.find((f) => f.valueChainId === vc._id)
    return {
      valueChainId: vc._id,
      content: factor?.content ?? "",
    }
  })

  return {
    externalFactors,
    valueChain: vcNodes,
    cells,
    kpis,
    factorsPerVC,
  }
}

// ---------------------------------------------------------------------------
// Public hook
// ---------------------------------------------------------------------------

export interface ConvexSystemData {
  system: {
    id: string
    name: string
    sector: string
    impact: string
    dimension: string
    challenge: string
  }
  initialData: RowData[]
  cultureBanner: { id: string; title: string; kpiValue: number; kpiStatus: "healthy" }
  bottomBanner: { id: string; title: string; kpiValue: number; kpiStatus: "healthy" }
  contributionMapData: ContributionMapData
  developmentPathwaysData: DevelopmentPathwaysData
  convergenceMapData: ConvergenceMapData
}

/**
 * Hook to fetch a full system by ID from Convex
 * Returns all system data transformed to match the UI types from lib/types.ts
 *
 * The Convex backend function `api.systems.getFullSystem` is expected to return
 * the complete payload: system + elements + matrixCells + kpis + capabilities +
 * externalValues + factors in a single reactive query.
 */
export function useConvexSystem(systemId: string | null) {
  const raw = useQuery(
    api.systems.getFullSystem,
    systemId ? { id: systemId as Id<"systems"> } : "skip"
  )

  const isLoading = raw === undefined

  if (isLoading || !raw) {
    return { data: null, isLoading }
  }

  const payload = raw as unknown as FullSystemPayload

  const data: ConvexSystemData = {
    system: {
      id: payload.system._id,
      name: payload.system.name,
      sector: payload.system.sector ?? "",
      impact: payload.system.impact,
      dimension: payload.system.dimension,
      challenge: payload.system.challenge,
    },
    initialData: buildInitialData(payload),
    cultureBanner: {
      id: "culture-banner",
      title: payload.system.dimension || `${payload.system.name} Culture`,
      kpiValue: 100,
      kpiStatus: "healthy",
    },
    bottomBanner: {
      id: "bottom-banner",
      title: payload.system.challenge || `${payload.system.name} Challenge`,
      kpiValue: 100,
      kpiStatus: "healthy",
    },
    contributionMapData: buildContributionMapData(payload),
    developmentPathwaysData: buildDevelopmentPathwaysData(payload),
    convergenceMapData: buildConvergenceMapData(payload),
  }

  return { data, isLoading }
}
