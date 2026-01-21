import { useMemo } from 'react'
import { useSystem } from './use-systems'
import { useElementsGrouped } from './use-elements'
import { useMatrixCellsGrouped } from './use-matrix-cells'
import { useSystemKPIs } from './use-kpis'
import { useCapabilities } from './use-capabilities'
import { useFactors, useExternalValues } from './use-factors'
import type { FullSystemData, SystemElement } from '@/lib/supabase'

/**
 * Hook that combines all system data into a single object
 * Use this for the main Logic Model view
 */
export function useFullSystem(systemId: string | null) {
  const {
    data: system,
    isLoading: systemLoading,
    error: systemError,
  } = useSystem(systemId)

  const {
    outcomes,
    valueChain,
    resources,
    isLoading: elementsLoading,
    error: elementsError,
  } = useElementsGrouped(systemId)

  const {
    data: matrices,
    isLoading: matricesLoading,
    error: matricesError,
  } = useMatrixCellsGrouped(systemId)

  // Supporting data (Jigsaw 1 migration)
  const {
    data: kpis,
    isLoading: kpisLoading,
    error: kpisError,
  } = useSystemKPIs(systemId)

  const {
    data: capabilities,
    isLoading: capsLoading,
    error: capsError,
  } = useCapabilities(systemId)

  const {
    data: factors,
    isLoading: factorsLoading,
    error: factorsError,
  } = useFactors(systemId)

  const {
    data: externalValues,
    isLoading: externalLoading,
    error: externalError,
  } = useExternalValues(systemId)

  const isLoading = systemLoading || elementsLoading || matricesLoading || 
    kpisLoading || capsLoading || factorsLoading || externalLoading
  const error = systemError || elementsError || matricesError || 
    kpisError || capsError || factorsError || externalError

  const data = useMemo<FullSystemData | null>(() => {
    if (!system) return null

    return {
      system,
      outcomes,
      valueChain,
      resources,
      matrices: matrices || {
        contribution: [],
        convergence: [],
        development: [],
      },
      // Supporting data
      kpis: kpis || [],
      capabilities: capabilities || { current: [], necessary: [] },
      externalValues: externalValues || [],
      factors: factors || [],
    }
  }, [system, outcomes, valueChain, resources, matrices, kpis, capabilities, externalValues, factors])

  return {
    data,
    system,
    outcomes,
    valueChain,
    resources,
    matrices,
    // Supporting data
    kpis,
    capabilities,
    factors,
    externalValues,
    isLoading,
    error,
  }
}

/**
 * Transform Supabase elements to the format expected by existing components
 * This adapter helps bridge the gap between database structure and UI components
 */
export function transformElementsForUI(elements: SystemElement[]) {
  return elements.map((element, index) => ({
    id: element.id,
    title: element.content,
    description: '', // Not in current schema, could be added
    order: element.order_index,
    gradientValue: element.gradient_value ?? 100, // From database, default 100
    
    // UI-only fields (computed)
    index,
    elementType: element.element_type,
    systemId: element.system_id,
  }))
}

/**
 * Get display name for element type
 */
export function getElementTypeDisplayName(type: 'outcome' | 'value' | 'resource'): string {
  switch (type) {
    case 'outcome':
      return 'Strategic Outcome'
    case 'value':
      return 'Value Chain'
    case 'resource':
      return 'Resource'
    default:
      return type
  }
}

/**
 * Get color scheme for element type (matching Jigsaw 1 colors)
 */
export function getElementTypeColors(type: 'outcome' | 'value' | 'resource') {
  switch (type) {
    case 'outcome':
      return {
        bg: 'bg-blue-100 dark:bg-blue-900/30',
        text: 'text-blue-900 dark:text-blue-100',
        border: 'border-blue-300 dark:border-blue-700',
        accent: '#3b82f6', // blue-500
      }
    case 'value':
      return {
        bg: 'bg-green-100 dark:bg-green-900/30',
        text: 'text-green-900 dark:text-green-100',
        border: 'border-green-300 dark:border-green-700',
        accent: '#22c55e', // green-500
      }
    case 'resource':
      return {
        bg: 'bg-amber-100 dark:bg-amber-900/30',
        text: 'text-amber-900 dark:text-amber-100',
        border: 'border-amber-300 dark:border-amber-700',
        accent: '#f59e0b', // amber-500
      }
    default:
      return {
        bg: 'bg-gray-100 dark:bg-gray-900/30',
        text: 'text-gray-900 dark:text-gray-100',
        border: 'border-gray-300 dark:border-gray-700',
        accent: '#6b7280', // gray-500
      }
  }
}

