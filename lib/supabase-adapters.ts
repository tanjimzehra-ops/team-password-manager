/**
 * Adapters to transform Supabase data to the format expected by UI components
 * This bridges the gap between database schema and existing component types
 */

import type { 
  LogicSystem, 
  SystemElement, 
  MatrixCell,
  MatrixData,
  SystemKPI,
  Capability,
  SystemFactor,
  ExternalValue
} from './supabase'

import type { 
  RowData, 
  NodeData, 
  ContributionMapData, 
  ContributionCell,
  ValueChainKPIs,
  OutcomeKPIs,
  DevelopmentPathwaysData,
  CapabilityData,
  DevelopmentCell,
  ConvergenceMapData,
  ExternalFactor,
  ConvergenceCell
} from './types'

// =============================================================================
// Logic Model Adapters
// =============================================================================

/**
 * Static fallback descriptions for elements (used when Supabase data has no description)
 */
const staticDescriptions: Record<string, string> = {
  // Outcomes
  'Product/Service': 'Proven modular, scalable, solar powered production of green power, fuels, & biochar from municipal, agricultural & industrial waste using pyrolysis-gasification, partnered with efficient electricity & hydrogen storage and energy use efficiency uplift technology to create a carbon negative footprint',
  'Product/Market Fit': 'Optimising the match between community & industry waste stock & flows and market needs for green energy and critical inputs globally through modular investment in the scalable deployment of reliable, sustainable, productive and decentralised solar driven circular energy production, storage and efficient utilisation',
  'Socio-economic Value Delivered & Created': 'Rapid diversion of local solid waste streams to cut emissions, deliver renewable energy products, revenue streams & strong returns, converting waste management costs to rapidly achieved revenue stream and creating direct, local environmental benefits, flow-on production & employment opportunities to support sustainable futures',
  'SGC Group': 'SGC Group achieve target revenues and margins through value management, reputation & market positioning which achieves the scale, culture and productivity to sustain growth',
}

/**
 * Convert a Supabase SystemElement to UI NodeData
 */
function elementToNode(
  element: SystemElement,
  category: NodeData['category'],
  colorScheme: NodeData['color'] = 'secondary'
): NodeData {
  // Use Supabase description first, fallback to static if not available
  const description = element.description || staticDescriptions[element.content] || ''

  return {
    id: element.id,
    title: element.content,
    description,
    kpiValue: element.gradient_value ?? 100, // Use gradient_value if available
    kpiStatus: 'healthy',
    category,
    color: colorScheme,
    notes: '',
    metadata: {},
  }
}

/**
 * Transform Supabase system data to RowData[] for LogicGrid
 */
export function transformToLogicGridData(
  system: LogicSystem,
  outcomes: SystemElement[],
  valueChain: SystemElement[],
  resources: SystemElement[]
): RowData[] {
  return [
    // Purpose Row (from system.impact)
    {
      id: 'purpose',
      label: 'Purpose',
      category: 'purpose',
      color: 'bg-red-700 dark:bg-red-800',
      nodes: [
        {
          id: `purpose-${system.id}`,
          title: system.impact || 'No purpose statement defined',
          description: 'The core purpose statement that drives the entire project.',
          kpiValue: 100,
          kpiStatus: 'healthy',
          category: 'purpose',
          color: 'primary',
          notes: '',
          metadata: {
            'System': system.name,
            'Sector': system.sector || 'N/A',
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
      nodes: outcomes.map((o, idx) => 
        elementToNode(o, 'outcomes', idx % 2 === 0 ? 'secondary' : 'accent')
      ),
    },
    // Value Chain Row
    {
      id: 'value-chain',
      label: 'Value Chain',
      category: 'value-chain',
      color: 'bg-red-500 dark:bg-red-600',
      nodes: valueChain.map((v) => elementToNode(v, 'value-chain', 'secondary')),
    },
    // Resources Row
    {
      id: 'resources',
      label: 'Resources',
      category: 'resources',
      color: 'bg-amber-600 dark:bg-amber-700',
      nodes: resources.map((r) => elementToNode(r, 'resources', 'secondary')),
    },
  ]
}

// Banner type expected by LogicGrid component
interface BannerData {
  id: string
  title: string
  kpiValue: number
  kpiStatus: 'healthy' | 'warning' | 'critical'
}

/**
 * Get culture banner data from system
 */
export function getCultureBanner(system: LogicSystem): BannerData {
  return {
    id: `culture-banner-${system.id}`,
    title: system.dimension || 'No culture statement defined',
    kpiValue: 100,
    kpiStatus: 'healthy',
  }
}

/**
 * Get context banner data from system
 */
export function getContextBanner(system: LogicSystem): BannerData {
  return {
    id: `context-banner-${system.id}`,
    title: system.challenge || 'No context statement defined',
    kpiValue: 100,
    kpiStatus: 'healthy',
  }
}

// =============================================================================
// Contribution Map Adapters
// =============================================================================

/**
 * Transform data for ContributionMap component
 */
export function transformToContributionMapData(
  outcomes: SystemElement[],
  valueChain: SystemElement[],
  matrixCells: MatrixCell[],
  kpis?: SystemKPI[]
): ContributionMapData {
  // Filter only contribution type cells
  const contributionCells = matrixCells.filter(c => c.matrix_type === 'contribution')
  
  return {
    outcomes: outcomes.map(o => elementToNode(o, 'outcomes')),
    valueChain: valueChain.map(v => elementToNode(v, 'value-chain')),
    // KPIs verticales (columna) - por cada Value Chain row
    // Use order_index (not array index) to match with KPI parent_index
    valueChainKpis: valueChain.map((v) => ({
      valueChainId: v.id,
      kpis: kpis
        ? kpis
            .filter(k => k.parent_type === 'value' && k.parent_index === v.order_index)
            .map(k => k.content || '')
            .filter(k => k !== '')
        : [],
    })),
    // KPIs horizontales (fila) - por cada Outcome
    // Use order_index (not array index) to match with KPI parent_index
    outcomeKpis: outcomes.map((o) => ({
      outcomeId: o.id,
      kpis: kpis
        ? kpis
            .filter(k => k.parent_type === 'outcome' && k.parent_index === o.order_index)
            .map(k => k.content || '')
            .filter(k => k !== '')
        : [],
    })),
    cells: contributionCells.map(cell => ({
      valueChainId: valueChain[cell.row_index]?.id || `vc-${cell.row_index}`,
      outcomeId: outcomes[cell.col_index]?.id || `outcome-${cell.col_index}`,
      content: cell.content || '',
    })),
  }
}

// =============================================================================
// Development Pathways Adapters
// =============================================================================

/**
 * Transform data for DevelopmentPathways component
 * 
 * Development Pathways Structure (from Jigsaw 1.6 reference):
 * 
 * |        |              | Current Cap  | Resource1    | Resource2    | ... | KPIs |
 * |        |              | (col header) | (header)     | (header)     |     |      |
 * |--------|--------------|--------------|--------------|--------------|-----|------|
 * |        | CC label     | corner       | CC-for-Res1  | CC-for-Res2  | ... |      | ← Horizontal CC row
 * |--------|--------------|--------------|--------------|--------------|-----|------|
 * | VALUE  | VC Name 1    | CC-for-VC1   | Cell         | Cell         | ... | KPIs | ← VC rows with
 * | CHAIN  | VC Name 2    | CC-for-VC2   | Cell         | Cell         | ... | KPIs |   vertical CC column
 * |        | ...          | ...          | ...          | ...          | ... | ...  |
 * |--------|--------------|--------------|--------------|--------------|-----|------|
 * | Culture Banner (spanning)                                                       |
 * |--------|--------------|--------------|--------------|--------------|-----|------|
 * |        | NC label     |              | NC-for-Res1  | NC-for-Res2  | ... |      | ← Horizontal NC row
 * 
 * Data structure:
 * - currentCapabilitiesPerResource: one per Resource (horizontal row under headers)
 * - currentCapabilitiesPerVC: one per Value Chain row (vertical column)
 * - necessaryCapabilities: one per Resource (horizontal row at bottom)
 */
export function transformToDevelopmentPathwaysData(
  resources: SystemElement[],
  valueChain: SystemElement[],
  matrixCells: MatrixCell[],
  capabilities?: { current: Capability[], necessary: Capability[] },
  kpis?: SystemKPI[]
): DevelopmentPathwaysData {
  // Filter only development type cells
  const developmentCells = matrixCells.filter(c => c.matrix_type === 'development')
  
  // Get capabilities from database
  const currentCaps = capabilities?.current || []
  const necessaryCaps = capabilities?.necessary || []
  
  // Sort capabilities by order_index for consistent ordering
  const sortedCurrentCaps = [...currentCaps].sort((a, b) => a.order_index - b.order_index)
  const sortedNecessaryCaps = [...necessaryCaps].sort((a, b) => a.order_index - b.order_index)
  
  // Current Capabilities are split into two groups:
  // 1. First N items (N = resources.length): Current Capability per RESOURCE (horizontal row)
  // 2. Next M items (M = valueChain.length): Current Capability per VALUE CHAIN row (vertical column)
  // 
  // Note: Due to migration issues, data may not be perfectly aligned.
  // We use order_index to determine the mapping.
  
  const resourceCount = resources.length
  
  // Map Current Capabilities per Resource (horizontal row)
  const ccPerResource: CapabilityData[] = resources.map((_, idx) => {
    // Try to find capability with resource_index matching this resource
    const cap = sortedCurrentCaps.find(c => c.resource_index === idx)
    // Fallback: use by position in array (first N items)
    const fallbackCap = sortedCurrentCaps[idx]
    return {
      id: cap?.id || fallbackCap?.id,
      content: cap?.content || fallbackCap?.content || '',
    }
  })
  
  // Map Current Capabilities per Value Chain row (vertical column)
  const ccPerVC: CapabilityData[] = valueChain.map((_, idx) => {
    // Capabilities for VC rows come after resource capabilities
    // Try to find by index offset
    const cap = sortedCurrentCaps[resourceCount + idx]
    return {
      id: cap?.id,
      content: cap?.content || '',
    }
  })
  
  // Map Necessary Capabilities per Resource (horizontal row at bottom)
  const ncPerResource: CapabilityData[] = resources.map((_, idx) => {
    const cap = sortedNecessaryCaps.find(c => c.resource_index === idx)
    const fallbackCap = sortedNecessaryCaps[idx]
    return {
      id: cap?.id || fallbackCap?.id,
      content: cap?.content || fallbackCap?.content || '',
    }
  })
  
  return {
    resources: resources.map(r => elementToNode(r, 'resources')),
    valueChain: valueChain.map(v => elementToNode(v, 'value-chain')),
    currentCapabilitiesPerResource: ccPerResource,
    currentCapabilitiesPerVC: ccPerVC,
    necessaryCapabilities: ncPerResource,
    cells: developmentCells.map(cell => ({
      valueChainId: valueChain[cell.col_index]?.id || `vc-${cell.col_index}`,
      resourceId: resources[cell.row_index]?.id || `resource-${cell.row_index}`,
      content: cell.content || '',
    })),
    kpis: valueChain.map((v) => ({
      valueChainId: v.id,
      kpis: kpis
        ? kpis
            .filter(k => k.parent_type === 'value' && k.parent_index === v.order_index)
            .map(k => k.content || '')
            .filter(k => k !== '')
        : [],
    })),
  }
}

// =============================================================================
// Convergence Map Adapters
// =============================================================================

/**
 * Transform data for ConvergenceMap component
 * Note: External factors data would come from external_values table
 */
export function transformToConvergenceMapData(
  valueChain: SystemElement[],
  matrixCells: MatrixCell[],
  externalValues?: ExternalValue[],
  factors?: SystemFactor[],
  kpis?: SystemKPI[]
): ConvergenceMapData {
  // Import static data as fallback
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { externalFactors: staticExternalFactors } = require('@/lib/data')

  // Filter only convergence type cells
  const convergenceCells = matrixCells.filter(c => c.matrix_type === 'convergence')

  // Use real external values if available, otherwise use static data as fallback
  // Session 32: external_values now has 'content' (title) and 'description' fields
  const externalFactors: ExternalFactor[] = externalValues && externalValues.length > 0
    ? externalValues.map((ev) => ({
        id: ev.id,
        title: ev.content || '',
        description: ev.description || '',  // Now from Supabase directly
      }))
    : staticExternalFactors || []
  
  // Use static cells as fallback if no cells in Supabase
  const { convergenceMapCells: staticCells, valueChainKpis: staticKpis } = require('@/lib/data')

  const cells = convergenceCells.length > 0
    ? convergenceCells.map(cell => ({
        valueChainId: valueChain[cell.col_index]?.id || `vc-${cell.col_index}`,
        externalFactorId: externalValues && externalValues[cell.row_index]
          ? externalValues[cell.row_index].id
          : externalFactors[cell.row_index]?.id || `ef-${cell.row_index + 1}`,
        content: cell.content || '',
      }))
    : staticCells || []

  const vcKpis = valueChain.length > 0
    ? valueChain.map((v) => ({
        valueChainId: v.id,
        kpis: kpis
          ? kpis
              .filter(k => k.parent_type === 'value' && k.parent_index === v.order_index)
              .map(k => k.content || '')
              .filter(k => k !== '')
          : [],
      }))
    : staticKpis || []

  return {
    externalFactors,
    valueChain: valueChain.map(v => elementToNode(v, 'value-chain')),
    cells,
    kpis: vcKpis,
  }
}

// =============================================================================
// Utility Functions
// =============================================================================

/**
 * Check if data is loaded and valid
 */
export function isDataLoaded(
  system: LogicSystem | null | undefined,
  outcomes?: SystemElement[] | undefined,
  valueChain?: SystemElement[] | undefined,
  resources?: SystemElement[] | undefined
): boolean {
  return !!(system && outcomes?.length && valueChain?.length && resources?.length)
}

/**
 * Get loading message based on what's missing
 */
export function getLoadingMessage(
  systemLoading: boolean,
  elementsLoading: boolean
): string {
  if (systemLoading) return 'Loading system...'
  if (elementsLoading) return 'Loading elements...'
  return 'Loading...'
}

