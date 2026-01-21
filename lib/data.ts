/**
 * Data Layer for Jigsaw Frontend
 *
 * Supports multiple systems from Azure: MERA, Kiraa, Levur
 * Each system JSON is generated from CellReferences.csv
 *
 * Usage:
 * - Import defaultSystem exports for backwards compatibility (MERA)
 * - Use getSystemAdapter('kiraa') to get a specific system
 * - Use availableSystems to list all available systems
 */

import {
  availableSystems,
  getSystemAdapter,
  defaultSystem,
  type SystemName,
  type SystemDataAdapter,
} from '@/data/system-adapter'

// =============================================================================
// Multi-System Exports
// =============================================================================

export { availableSystems, getSystemAdapter, type SystemName, type SystemDataAdapter }

// =============================================================================
// Default System Exports (MERA - backwards compatibility)
// =============================================================================

// Logic Model
export const initialData = defaultSystem.initialData
export const cultureBanner = defaultSystem.cultureBanner
export const bottomBanner = defaultSystem.bottomBanner

// Contribution Map
export const valueChainKpis = defaultSystem.valueChainKpis
export const outcomeKpis = defaultSystem.outcomeKpis
export const contributionMapCells = defaultSystem.contributionMapCells
export const getContributionMapData = () => defaultSystem.getContributionMapData()

// Development Pathways
export const currentCapabilitiesPerResource = defaultSystem.currentCapabilitiesPerResource
export const currentCapabilitiesPerVC = defaultSystem.currentCapabilitiesPerVC
export const necessaryCapabilities = defaultSystem.necessaryCapabilities
export const developmentPathwaysCells = defaultSystem.developmentPathwaysCells
export const developmentPathwaysKpis = defaultSystem.valueChainKpis
export const getDevelopmentPathwaysData = () => defaultSystem.getDevelopmentPathwaysData()

// Convergence Map
export const externalFactors = defaultSystem.externalFactors
export const convergenceMapCells = defaultSystem.convergenceMapCells
export const getConvergenceMapData = () => defaultSystem.getConvergenceMapData()
