import { createClient } from '@supabase/supabase-js'

// Environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables')
}

// Create Supabase client
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
)

// Check if Supabase is properly configured
// TEMPORARY: Force false to test JSON data (Session 37)
export const isSupabaseConfigured = false // !!supabaseUrl && !!supabaseAnonKey

// =============================================================================
// Database Types - Based on actual Supabase schema
// =============================================================================

// Logic Systems table (5 systems imported including MERA)
export interface LogicSystem {
  id: string
  legacy_id: number | null
  name: string
  sector: string | null
  impact: string | null      // Purpose/Vision statement (red band)
  dimension: string | null   // Delivery culture statement (gray band)
  challenge: string | null   // System context statement (yellow band)
  created_at: string
  updated_at: string
}

// System Elements table (117 elements: outcomes, values, resources)
export interface SystemElement {
  id: string
  system_id: string
  element_type: 'outcome' | 'value' | 'resource'
  content: string
  description: string | null  // Long description (Session 32)
  order_index: number
  gradient_value: number | null  // 0-100, controls opacity/health display
  created_at: string
  updated_at: string
}

// Matrix Cells table (124 cells for contribution, convergence, development)
export interface MatrixCell {
  id: string
  system_id: string
  matrix_type: 'contribution' | 'convergence' | 'development'
  row_index: number
  col_index: number
  content: string | null
  created_at: string
  updated_at: string
}

// KPIs table (existing structure from Jigsaw 2.0 / Tanjim schema)
export interface KPI {
  id: string
  parent_id: string
  parent_type: 'value_chain' | 'objective' | 'resource'
  title: string
  description: string | null
  measurement_type: 'qualitative' | 'quantitative' | null
  unit: string | null
  target_value: string | null
  current_value: string | null
  status: 'not_started' | 'in_progress' | 'completed' | 'at_risk' | null
  last_updated: string
  created_at: string
}

// System KPIs table (Jigsaw 1 migration - linked by parent_type and parent_index)
export interface SystemKPI {
  id: string
  system_id: string
  parent_type: 'outcome' | 'value' | 'resource'
  parent_index: number
  content: string | null
  order_index: number
  created_at: string
  updated_at: string
}

// Capabilities table (for Development Pathways - current/necessary)
export interface Capability {
  id: string
  system_id: string
  capability_type: 'current' | 'necessary'
  resource_index: number
  content: string | null
  order_index: number
  created_at: string
  updated_at: string
}

// External Values table (for Convergence Map)
// Note: 'content' = title, 'description' = description (Session 32)
export interface ExternalValue {
  id: string
  system_id: string
  content: string | null      // Title (e.g., "Decarbonisation")
  description: string | null  // Description (e.g., "Bio-char alternative...")
  order_index: number
  created_at: string
  updated_at: string
}

// System Factors table (factors by value chain)
export interface SystemFactor {
  id: string
  system_id: string
  value_chain_index: number | null
  content: string | null
  order_index: number
  created_at: string
  updated_at: string
}

// =============================================================================
// Convenience Types for UI
// =============================================================================

// System with all its elements grouped
export interface SystemWithElements extends LogicSystem {
  outcomes: SystemElement[]
  valueChain: SystemElement[]
  resources: SystemElement[]
}

// Matrix data grouped by type
export interface MatrixData {
  contribution: MatrixCell[]
  convergence: MatrixCell[]
  development: MatrixCell[]
}

// Full system data for Logic Model views
export interface FullSystemData {
  system: LogicSystem
  outcomes: SystemElement[]
  valueChain: SystemElement[]
  resources: SystemElement[]
  matrices: MatrixData
  // Supporting data (Jigsaw 1 migration)
  kpis: SystemKPI[]
  capabilities: {
    current: Capability[]
    necessary: Capability[]
  }
  externalValues: ExternalValue[]
  factors: SystemFactor[]
}
