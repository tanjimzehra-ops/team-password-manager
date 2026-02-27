/**
 * Generic System Data Adapter
 * Transforms any system JSON (Azure format) to the UI format expected by components
 *
 * Supports: MERA, Kiraa, Levur, and any future systems
 */

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
// JSON Schema Types (from Azure CellReferences.csv)
// =============================================================================

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
  // XAxis/YAxis are Reference IDs for matrix coordinates (from Azure)
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

export interface SystemJSON {
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

// =============================================================================
// Static Fallback Descriptions
// Used when JSON data has no separate description field
// =============================================================================

const staticDescriptions: Record<string, string> = {
  // Outcomes
  'Product/Service': 'Proven modular, scalable, solar powered production of green power, fuels, & biochar from municipal, agricultural & industrial waste using pyrolysis-gasification, partnered with efficient electricity & hydrogen storage and energy use efficiency uplift technology to create a carbon negative footprint',
  'Product/Market Fit': 'Optimising the match between community & industry waste stock & flows and market needs for green energy and critical inputs globally through modular investment in the scalable deployment of reliable, sustainable, productive and decentralised solar driven circular energy production, storage and efficient utilisation',
  'Socio-economic Value Delivered & Created': 'Rapid diversion of local solid waste streams to cut emissions, deliver renewable energy products, revenue streams & strong returns, converting waste management costs to rapidly achieved revenue stream and creating direct, local environmental benefits, flow-on production & employment opportunities to support sustainable futures',
  'SGC Group': 'SGC Group achieve target revenues and margins through value management, reputation & market positioning which achieves the scale, culture and productivity to sustain growth',
}

// =============================================================================
// System Data Class
// =============================================================================

export class SystemDataAdapter {
  private json: SystemJSON

  constructor(json: SystemJSON) {
    this.json = json
  }

  private getDeterministicKpi(id: string): number {
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
      hash = ((hash << 5) - hash) + id.charCodeAt(i);
      hash |= 0;
    }
    const pseudoRandom = Math.abs(hash) / 2147483648;
    return Math.floor(pseudoRandom * 51) + 50; // 50 to 100
  }

  // Helper function
  private toNodeData(
    item: LogicModelElement,
    category: NodeData['category'],
    color: NodeData['color'] = 'secondary'
  ): NodeData {
    // Use item.description if available, fallback to static descriptions
    const description = item.description || staticDescriptions[item.content] || ''
    const kpiValue = this.getDeterministicKpi(item.id);
    let kpiStatus: 'healthy' | 'warning' | 'critical' = 'healthy';
    if (kpiValue < 70) kpiStatus = 'critical';
    else if (kpiValue < 85) kpiStatus = 'warning';

    return {
      id: item.id,
      title: item.content,
      description,
      kpiValue,
      kpiStatus,
      category,
      color,
    }
  }

  // ==========================================================================
  // Logic Model Data
  // ==========================================================================

  get initialData(): RowData[] {
    return [
      // Purpose Row
      {
        id: 'purpose',
        label: 'Purpose',
        category: 'purpose',
        color: 'bg-red-700 dark:bg-red-800',
        nodes: [
          {
            id: 'purpose-1',
            title: this.json.logic_model.impact || `${this.json.name} Purpose`,
            description: `The core purpose statement for ${this.json.name}.`,
            kpiValue: this.getDeterministicKpi('purpose-1'),
            kpiStatus: (this.getDeterministicKpi('purpose-1') < 70 ? 'critical' : this.getDeterministicKpi('purpose-1') < 85 ? 'warning' : 'healthy') as "healthy" | "warning" | "critical",
            category: 'purpose',
            color: 'primary',
            metadata: {
              'System ID': String(this.json.system_id),
              'System': this.json.name,
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
        nodes: this.json.logic_model.outcomes.map((o, idx) =>
          this.toNodeData(o, 'outcomes', idx % 2 === 0 ? 'secondary' : 'accent')
        ),
      },
      // Value Chain Row
      {
        id: 'value-chain',
        label: 'Value Chain',
        category: 'value-chain',
        color: 'bg-red-500 dark:bg-red-600',
        nodes: this.json.logic_model.value_chain.map(v => this.toNodeData(v, 'value-chain', 'secondary')),
      },
      // Resources Row
      {
        id: 'resources',
        label: 'Resources & Capability',
        category: 'resources',
        color: 'bg-red-400 dark:bg-red-500',
        nodes: this.json.logic_model.resources.map(r => this.toNodeData(r, 'resources', 'secondary')),
      },
    ]
  }

  // ==========================================================================
  // Banners
  // ==========================================================================

  get cultureBanner() {
    const kpiValue = this.getDeterministicKpi('culture-banner');
    const kpiStatus: "healthy" | "warning" | "critical" = kpiValue < 70 ? "critical" : kpiValue < 85 ? "warning" : "healthy";
    return {
      id: 'culture-banner',
      title: this.json.logic_model.dimension || `${this.json.name} Culture`,
      kpiValue,
      kpiStatus,
    }
  }

  get bottomBanner() {
    const kpiValue = this.getDeterministicKpi('bottom-banner');
    const kpiStatus: "healthy" | "warning" | "critical" = kpiValue < 70 ? "critical" : kpiValue < 85 ? "warning" : "healthy";
    return {
      id: 'bottom-banner',
      title: this.json.logic_model.challenge || `${this.json.name} Challenge`,
      kpiValue,
      kpiStatus,
    }
  }

  // ==========================================================================
  // Contribution Map Data
  // ==========================================================================

  get valueChainKpis(): ValueChainKPIs[] {
    return this.json.logic_model.value_chain.map(vc => {
      const kpisForVc = this.json.kpis.by_value
        .filter(k => k.parent_id === vc.id && k.content !== '')
        .map(k => k.content)
      return {
        valueChainId: vc.id,
        kpis: kpisForVc,
      }
    })
  }

  get outcomeKpis(): OutcomeKPIs[] {
    return this.json.logic_model.outcomes.map(o => {
      const kpisForOutcome = this.json.kpis.by_outcome
        .filter(k => k.parent_id === o.id && k.content !== '')
        .map(k => k.content)
      return {
        outcomeId: o.id,
        kpis: kpisForOutcome,
      }
    })
  }

  get contributionMapCells(): ContributionCell[] {
    const cells: ContributionCell[] = []

    // Map Azure contribution_map data
    // Priority: Use xaxis/yaxis (Reference IDs) if available, fallback to order/column as indices
    this.json.matrices.contribution_map.forEach(cell => {
      let vcElement: LogicModelElement | undefined
      let outcomeElement: LogicModelElement | undefined

      // Check if xaxis/yaxis are valid Reference IDs (not "0" or empty)
      const hasValidAxis = cell.xaxis && cell.yaxis && cell.xaxis !== '0' && cell.yaxis !== '0'

      if (hasValidAxis) {
        // Use xaxis/yaxis as Reference IDs to find elements
        // For Contribution Map: xaxis = Outcome ID, yaxis = Value Chain ID
        outcomeElement = this.json.logic_model.outcomes.find(o => o.id === cell.xaxis)
        vcElement = this.json.logic_model.value_chain.find(v => v.id === cell.yaxis)
      } else {
        // Fallback: use order/column as array indices
        vcElement = this.json.logic_model.value_chain[cell.order]
        outcomeElement = this.json.logic_model.outcomes[cell.column]
      }

      if (vcElement && outcomeElement && cell.content) {
        cells.push({
          valueChainId: vcElement.id,
          outcomeId: outcomeElement.id,
          content: cell.content,
        })
      }
    })

    // Fill in empty cells for complete grid
    this.json.logic_model.value_chain.forEach(vc => {
      this.json.logic_model.outcomes.forEach(o => {
        const exists = cells.find(c => c.valueChainId === vc.id && c.outcomeId === o.id)
        if (!exists) {
          cells.push({
            valueChainId: vc.id,
            outcomeId: o.id,
            content: '',
          })
        }
      })
    })

    return cells
  }

  getContributionMapData(): ContributionMapData {
    const outcomesRow = this.initialData.find(row => row.category === 'outcomes')
    const valueChainRow = this.initialData.find(row => row.category === 'value-chain')

    return {
      outcomes: outcomesRow?.nodes || [],
      valueChain: valueChainRow?.nodes || [],
      valueChainKpis: this.valueChainKpis,
      outcomeKpis: this.outcomeKpis,
      cells: this.contributionMapCells,
    }
  }

  // ==========================================================================
  // Development Pathways Data
  // ==========================================================================

  get currentCapabilitiesPerResource(): CapabilityData[] {
    return this.json.logic_model.resources.map(r => {
      const cap = this.json.capabilities.current_by_resource.find(c => c.parent_id === r.id)
      return { content: cap?.content || '' }
    })
  }

  get currentCapabilitiesPerVC(): CapabilityData[] {
    // Use factors.by_value for the Value Chain column (Factors per VC)
    return this.json.logic_model.value_chain.map(vc => {
      const factor = this.json.factors.by_value.find(f => f.parent_id === vc.id)
      return { content: factor?.content || '' }
    })
  }

  get necessaryCapabilities(): CapabilityData[] {
    return this.json.logic_model.resources.map(r => {
      const cap = this.json.capabilities.necessary_by_resource.find(c => c.parent_id === r.id)
      return { content: cap?.content || '' }
    })
  }

  get developmentPathwaysCells(): DevelopmentCell[] {
    const cells: DevelopmentCell[] = []

    // Map Azure delivery_pathways to cells
    // Priority: Use xaxis/yaxis (Reference IDs) if available, fallback to order/column as indices
    this.json.matrices.delivery_pathways.forEach(cell => {
      let vcElement: LogicModelElement | undefined
      let resourceElement: LogicModelElement | undefined

      // Check if xaxis/yaxis are valid Reference IDs
      const hasValidAxis = cell.xaxis && cell.yaxis && cell.xaxis !== '0' && cell.yaxis !== '0'

      if (hasValidAxis) {
        // Use xaxis/yaxis as Reference IDs
        // For Delivery Pathways: xaxis = Resource ID, yaxis = Value Chain ID
        resourceElement = this.json.logic_model.resources.find(r => r.id === cell.xaxis)
        vcElement = this.json.logic_model.value_chain.find(v => v.id === cell.yaxis)
      } else {
        // Fallback: use order/column as array indices
        vcElement = this.json.logic_model.value_chain[cell.order]
        resourceElement = this.json.logic_model.resources[cell.column]
      }

      if (vcElement && resourceElement && cell.content) {
        cells.push({
          valueChainId: vcElement.id,
          resourceId: resourceElement.id,
          content: cell.content,
        })
      }
    })

    // Fill in empty cells
    this.json.logic_model.value_chain.forEach(vc => {
      this.json.logic_model.resources.forEach(r => {
        const exists = cells.find(c => c.valueChainId === vc.id && c.resourceId === r.id)
        if (!exists) {
          cells.push({
            valueChainId: vc.id,
            resourceId: r.id,
            content: '',
          })
        }
      })
    })

    return cells
  }

  getDevelopmentPathwaysData(): DevelopmentPathwaysData {
    const resourcesRow = this.initialData.find(row => row.category === 'resources')
    const valueChainRow = this.initialData.find(row => row.category === 'value-chain')

    return {
      resources: resourcesRow?.nodes || [],
      valueChain: valueChainRow?.nodes || [],
      currentCapabilitiesPerResource: this.currentCapabilitiesPerResource,
      currentCapabilitiesPerVC: this.currentCapabilitiesPerVC,
      necessaryCapabilities: this.necessaryCapabilities,
      cells: this.developmentPathwaysCells,
      kpis: this.valueChainKpis,
      dimension: this.json.logic_model.dimension,
    }
  }

  // ==========================================================================
  // Convergence Map Data
  // ==========================================================================

  get externalFactors(): ExternalFactor[] {
    return this.json.external_values.map(ev => {
      const factor = this.json.factors.by_external_value.find(f => f.parent_id === ev.id)
      return {
        id: ev.id,
        title: ev.content === '[Insert Label Here]' ? `External Factor ${ev.order + 1}` : ev.content,
        description: factor?.content || '',
      }
    })
  }

  // Factors for each Value Chain element (Column C in Convergence Map)
  get factorsPerVC(): { valueChainId: string; content: string }[] {
    return this.json.logic_model.value_chain.map(vc => {
      const factor = this.json.factors.by_value.find(f => f.parent_id === vc.id)
      return {
        valueChainId: vc.id,
        content: factor?.content || '',
      }
    })
  }

  get convergenceMapCells(): ConvergenceCell[] {
    const cells: ConvergenceCell[] = []

    // Map external_influences matrix
    // Priority: Use xaxis/yaxis (Reference IDs) if available, fallback to order/column as indices
    this.json.matrices.external_influences.forEach(cell => {
      let vcElement: LogicModelElement | undefined
      let externalElement: LogicModelElement | undefined

      // Check if xaxis/yaxis are valid Reference IDs
      const hasValidAxis = cell.xaxis && cell.yaxis && cell.xaxis !== '0' && cell.yaxis !== '0'

      if (hasValidAxis) {
        // Use xaxis/yaxis as Reference IDs
        // For External Influences: xaxis = External Factor ID, yaxis = Value Chain ID
        externalElement = this.json.external_values.find(e => e.id === cell.xaxis)
        vcElement = this.json.logic_model.value_chain.find(v => v.id === cell.yaxis)
      } else {
        // Fallback: use order/column as array indices
        vcElement = this.json.logic_model.value_chain[cell.order]
        externalElement = this.json.external_values[cell.column]
      }

      if (vcElement && externalElement && cell.content) {
        cells.push({
          valueChainId: vcElement.id,
          externalFactorId: externalElement.id,
          content: cell.content,
        })
      }
    })

    // Fill in empty cells
    this.json.logic_model.value_chain.forEach(vc => {
      this.json.external_values.forEach(ef => {
        const exists = cells.find(c => c.valueChainId === vc.id && c.externalFactorId === ef.id)
        if (!exists) {
          cells.push({
            valueChainId: vc.id,
            externalFactorId: ef.id,
            content: '',
          })
        }
      })
    })

    return cells
  }

  getConvergenceMapData(): ConvergenceMapData {
    const valueChainRow = this.initialData.find(row => row.category === 'value-chain')

    return {
      externalFactors: this.externalFactors,
      valueChain: valueChainRow?.nodes || [],
      cells: this.convergenceMapCells,
      kpis: this.valueChainKpis,
      factorsPerVC: this.factorsPerVC,
    }
  }
}

// =============================================================================
// System Loaders
// =============================================================================

import meraJson from './mera.json'
import kiraaJson from './kiraa.json'
import levurJson from './levur.json'
import cpfJigsawJson from './cpf_jigsaw.json'
import illawarraJson from './illawarra_energy_storage.json'
import centralHighlandsJson from './central_highlands_council.json'
import council2Json from './council_2.json'
import relationshipsAuJson from './relationships_australia_tas.json'

export const availableSystems = {
  mera: new SystemDataAdapter(meraJson as SystemJSON),
  kiraa: new SystemDataAdapter(kiraaJson as SystemJSON),
  levur: new SystemDataAdapter(levurJson as SystemJSON),
  cpf_jigsaw: new SystemDataAdapter(cpfJigsawJson as SystemJSON),
  illawarra: new SystemDataAdapter(illawarraJson as SystemJSON),
  central_highlands: new SystemDataAdapter(centralHighlandsJson as SystemJSON),
  council_2: new SystemDataAdapter(council2Json as SystemJSON),
  relationships_au_tas: new SystemDataAdapter(relationshipsAuJson as SystemJSON),
}

export type SystemName = keyof typeof availableSystems

export function getSystemAdapter(systemName: SystemName): SystemDataAdapter {
  return availableSystems[systemName]
}

// Default to MERA for backwards compatibility
export const defaultSystem = availableSystems.mera
