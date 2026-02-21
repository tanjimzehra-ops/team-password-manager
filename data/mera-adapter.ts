/**
 * MERA Data Adapter
 * Transforms mera.json (Azure format) to the UI format expected by components
 */

import meraJson from './mera.json'
import type {
  RowData,
  NodeData,
  ValueChainKPIs,
  OutcomeKPIs,
  ContributionCell,
  DevelopmentCell,
  CapabilityData,
  ExternalFactor,
  ConvergenceCell,
  ContributionMapData,
  DevelopmentPathwaysData,
  ConvergenceMapData
} from '../lib/types'

// =============================================================================
// Helper Functions
// =============================================================================

function toNodeData(
  item: { id: string; order: number; content: string; description?: string },
  category: NodeData['category'],
  color: NodeData['color'] = 'secondary'
): NodeData {
  return {
    id: item.id,
    title: item.content,
    description: item.description || '',
    kpiValue: 100,
    kpiStatus: 'healthy',
    category,
    color,
  }
}

// =============================================================================
// Logic Model Data (initialData)
// =============================================================================

export const initialData: RowData[] = [
  // Purpose Row
  {
    id: 'purpose',
    label: 'Purpose',
    category: 'purpose',
    color: 'bg-red-700 dark:bg-red-800',
    nodes: [
      {
        id: 'purpose-1',
        title: meraJson.logic_model.impact,
        description: 'The core purpose statement that drives the entire MERA project.',
        kpiValue: 100,
        kpiStatus: 'healthy',
        category: 'purpose',
        color: 'primary',
        notes: 'Source: Logic Model CSV (MERA_12_11_2025)',
        metadata: {
          'System ID': String(meraJson.system_id),
          'System': meraJson.name,
        },
      },
    ],
  },
  // Outcomes Row
  {
    id: 'outcomes',
    label: 'Outcomes',
    category: 'outcomes',
    color: 'bg-red-600 dark:bg-red-700',
    nodes: meraJson.logic_model.outcomes.map((o, idx) =>
      toNodeData(o, 'outcomes', idx % 2 === 0 ? 'secondary' : 'accent')
    ),
  },
  // Value Chain Row
  {
    id: 'value-chain',
    label: 'Value Chain',
    category: 'value-chain',
    color: 'bg-red-500 dark:bg-red-600',
    nodes: meraJson.logic_model.value_chain.map(v => toNodeData(v, 'value-chain', 'secondary')),
  },
  // Resources Row
  {
    id: 'resources',
    label: 'Resources & Capability',
    category: 'resources',
    color: 'bg-red-400 dark:bg-red-500',
    nodes: meraJson.logic_model.resources.map(r => toNodeData(r, 'resources', 'secondary')),
  },
]

// =============================================================================
// Banners
// =============================================================================

export const cultureBanner = {
  id: 'culture-banner',
  title: meraJson.logic_model.dimension,
  kpiValue: 100,
  kpiStatus: 'healthy' as const,
}

export const bottomBanner = {
  id: 'bottom-banner',
  title: meraJson.logic_model.challenge,
  kpiValue: 100,
  kpiStatus: 'healthy' as const,
}

// =============================================================================
// Contribution Map Data
// =============================================================================

// KPIs by Value Chain (vertical column)
export const valueChainKpis: ValueChainKPIs[] = meraJson.logic_model.value_chain.map(vc => {
  const kpisForVc = meraJson.kpis.by_value
    .filter(k => k.parent_id === vc.id && k.content !== '')
    .map(k => k.content)
  return {
    valueChainId: vc.id,
    kpis: kpisForVc,
  }
})

// KPIs by Outcome (horizontal row)
export const outcomeKpis: OutcomeKPIs[] = meraJson.logic_model.outcomes.map(o => {
  const kpisForOutcome = meraJson.kpis.by_outcome
    .filter(k => k.parent_id === o.id && k.content !== '')
    .map(k => k.content)
  return {
    outcomeId: o.id,
    kpis: kpisForOutcome,
  }
})

// Contribution Map cells (VC x Outcome) - Azure has empty contribution_map
export const contributionMapCells: ContributionCell[] = []
// Generate empty cells for all VC x Outcome combinations
meraJson.logic_model.value_chain.forEach(vc => {
  meraJson.logic_model.outcomes.forEach(o => {
    contributionMapCells.push({
      valueChainId: vc.id,
      outcomeId: o.id,
      content: '',
    })
  })
})

// Helper function
export function getContributionMapData(): ContributionMapData {
  const outcomesRow = initialData.find(row => row.category === 'outcomes')
  const valueChainRow = initialData.find(row => row.category === 'value-chain')

  return {
    outcomes: outcomesRow?.nodes || [],
    valueChain: valueChainRow?.nodes || [],
    valueChainKpis,
    outcomeKpis,
    cells: contributionMapCells,
  }
}

// =============================================================================
// Development Pathways Data
// =============================================================================

// Current Capabilities per Resource (horizontal row)
export const currentCapabilitiesPerResource: CapabilityData[] = meraJson.logic_model.resources.map(r => {
  const cap = meraJson.capabilities.current_by_resource.find(c => c.parent_id === r.id)
  return { content: cap?.content || '' }
})

// Current Capabilities per Value Chain (vertical column)
// Note: Azure doesn't have this data structure, generating empty
export const currentCapabilitiesPerVC: CapabilityData[] = meraJson.logic_model.value_chain.map(() => ({
  content: '',
}))

// Necessary Capabilities per Resource (bottom row)
export const necessaryCapabilities: CapabilityData[] = meraJson.logic_model.resources.map(r => {
  const cap = meraJson.capabilities.necessary_by_resource.find(c => c.parent_id === r.id)
  return { content: cap?.content || '' }
})

// Development Pathways cells from Azure delivery_pathways
export const developmentPathwaysCells: DevelopmentCell[] = []

// Map Azure delivery_pathways to DevelopmentCell format
// Azure uses row/col indices, we need to map to IDs
meraJson.matrices.delivery_pathways.forEach(cell => {
  const vcElement = meraJson.logic_model.value_chain[cell.order]
  const resourceElement = meraJson.logic_model.resources[cell.column]

  if (vcElement && resourceElement) {
    developmentPathwaysCells.push({
      valueChainId: vcElement.id,
      resourceId: resourceElement.id,
      content: cell.content,
    })
  }
})

// Fill in empty cells for complete grid
meraJson.logic_model.value_chain.forEach(vc => {
  meraJson.logic_model.resources.forEach(r => {
    const exists = developmentPathwaysCells.find(
      c => c.valueChainId === vc.id && c.resourceId === r.id
    )
    if (!exists) {
      developmentPathwaysCells.push({
        valueChainId: vc.id,
        resourceId: r.id,
        content: '',
      })
    }
  })
})

export const developmentPathwaysKpis: ValueChainKPIs[] = valueChainKpis

export function getDevelopmentPathwaysData(): DevelopmentPathwaysData {
  const resourcesRow = initialData.find(row => row.category === 'resources')
  const valueChainRow = initialData.find(row => row.category === 'value-chain')

  return {
    resources: resourcesRow?.nodes || [],
    valueChain: valueChainRow?.nodes || [],
    currentCapabilitiesPerResource,
    currentCapabilitiesPerVC,
    necessaryCapabilities,
    cells: developmentPathwaysCells,
    kpis: developmentPathwaysKpis,
  }
}

// =============================================================================
// Convergence Map Data
// =============================================================================

// External Factors from Azure (with descriptions from factors.by_external_value)
export const externalFactors: ExternalFactor[] = meraJson.external_values.map(ev => {
  const factor = meraJson.factors.by_external_value.find(f => f.parent_id === ev.id)
  return {
    id: ev.id,
    title: ev.content === '[Insert Label Here]' ? `External Factor ${ev.order + 1}` : ev.content,
    description: factor?.content || '',
  }
})

// Convergence Map cells (VC x External Factor)
export const convergenceMapCells: ConvergenceCell[] = []

// Map factors.by_value to cells
meraJson.factors.by_value.forEach(factor => {
  if (factor.content) {
    const vc = meraJson.logic_model.value_chain.find(v => v.id === factor.parent_id)
    if (vc && meraJson.external_values[0]) {
      convergenceMapCells.push({
        valueChainId: vc.id,
        externalFactorId: meraJson.external_values[0].id, // First external factor column
        content: factor.content,
      })
    }
  }
})

// Fill in empty cells
meraJson.logic_model.value_chain.forEach(vc => {
  meraJson.external_values.forEach(ef => {
    const exists = convergenceMapCells.find(
      c => c.valueChainId === vc.id && c.externalFactorId === ef.id
    )
    if (!exists) {
      convergenceMapCells.push({
        valueChainId: vc.id,
        externalFactorId: ef.id,
        content: '',
      })
    }
  })
})

export function getConvergenceMapData(): ConvergenceMapData {
  const valueChainRow = initialData.find(row => row.category === 'value-chain')

  return {
    externalFactors,
    valueChain: valueChainRow?.nodes || [],
    cells: convergenceMapCells,
    kpis: valueChainKpis,
    factorsPerVC: [],
  }
}
