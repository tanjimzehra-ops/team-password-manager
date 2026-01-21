export interface NodeData {
  id: string
  title: string
  description: string
  kpiValue: number
  kpiStatus: "healthy" | "warning" | "critical"
  category: "purpose" | "outcomes" | "value-chain" | "resources"
  color: "primary" | "secondary" | "accent" | "muted"
  relatedNodes?: string[]
  notes?: string
  metadata?: Record<string, string>
}

export interface RowData {
  id: string
  label: string
  category: "purpose" | "outcomes" | "value-chain" | "resources"
  color: string
  nodes: NodeData[]
}

// Contribution Map Types
export interface ContributionKPI {
  id: string
  title: string
  targetValue?: number
  currentValue?: number
  unit?: string
}

// KPIs column for each Value Chain row
export interface ValueChainKPIs {
  valueChainId: string
  kpis: string[] // List of KPI text for the KPIs column
}

// Cell content for VC × Outcome intersection
export interface ContributionCell {
  valueChainId: string
  outcomeId: string
  content: string // Descriptive text for this intersection
}

// KPIs row for each Outcome (horizontal row in Contribution Map)
export interface OutcomeKPIs {
  outcomeId: string
  kpis: string[] // KPI text for this outcome
}

// ContributionMapData - Following Jigsaw 1 software structure
export interface ContributionMapData {
  outcomes: NodeData[]
  valueChain: NodeData[]
  valueChainKpis: ValueChainKPIs[] // KPIs column (vertical, per Value Chain row)
  outcomeKpis: OutcomeKPIs[] // KPIs row (horizontal, per Outcome)
  cells: ContributionCell[] // Matrix cell content (VC × Outcome intersections)
}

// Development Pathways Types

// Capability data (can be for Resource column or Value Chain row)
export interface CapabilityData {
  id?: string
  content: string
}

export interface DevelopmentCell {
  valueChainId: string
  resourceId: string
  content: string
}

export interface DevelopmentPathwaysData {
  resources: NodeData[]
  valueChain: NodeData[]
  // Current Capabilities - split into two arrays for clarity:
  // - currentCapabilitiesPerResource: one per Resource (horizontal row under headers)
  // - currentCapabilitiesPerVC: one per Value Chain row (vertical column)
  currentCapabilitiesPerResource: CapabilityData[]
  currentCapabilitiesPerVC: CapabilityData[]
  // Necessary Capabilities - one per Resource (horizontal row at bottom)
  necessaryCapabilities: CapabilityData[]
  cells: DevelopmentCell[]
  kpis: ValueChainKPIs[]
  // Delivery Culture - the dimension/culture banner text
  dimension?: string
}

// Convergence Map Types
export interface ExternalFactor {
  id: string
  title: string
  description: string // "Factors" row content
}

export interface ConvergenceCell {
  valueChainId: string
  externalFactorId: string
  content: string
}

// Factor data for Value Chain (Column C in Convergence Map)
export interface FactorData {
  valueChainId: string
  content: string
}

export interface ConvergenceMapData {
  externalFactors: ExternalFactor[]
  valueChain: NodeData[]
  cells: ConvergenceCell[]
  kpis: ValueChainKPIs[] // Reutilizar existing type
  factorsPerVC: FactorData[] // Factors for each Value Chain element (Column C)
}
