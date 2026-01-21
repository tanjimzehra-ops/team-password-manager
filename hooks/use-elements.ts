import { useQuery } from '@tanstack/react-query'
import { supabase, isSupabaseConfigured, type SystemElement } from '@/lib/supabase'

type ElementType = 'outcome' | 'value' | 'resource'

/**
 * Hook to fetch all elements for a system
 */
export function useAllElements(systemId: string | null) {
  return useQuery({
    queryKey: ['elements', systemId],
    queryFn: async () => {
      if (!systemId) return []

      const { data, error } = await supabase
        .from('system_elements')
        .select('*')
        .eq('system_id', systemId)
        .order('order_index')

      if (error) {
        console.error('Error fetching elements:', error)
        throw error
      }

      return data as SystemElement[]
    },
    enabled: isSupabaseConfigured && !!systemId,
    staleTime: 5 * 60 * 1000,
  })
}

/**
 * Hook to fetch elements by type
 */
export function useElements(systemId: string | null, elementType: ElementType) {
  return useQuery({
    queryKey: ['elements', systemId, elementType],
    queryFn: async () => {
      if (!systemId) return []

      const { data, error } = await supabase
        .from('system_elements')
        .select('*')
        .eq('system_id', systemId)
        .eq('element_type', elementType)
        .order('order_index')

      if (error) {
        console.error(`Error fetching ${elementType} elements:`, error)
        throw error
      }

      return data as SystemElement[]
    },
    enabled: isSupabaseConfigured && !!systemId,
    staleTime: 5 * 60 * 1000,
  })
}

/**
 * Convenience hook for outcomes (Strategic Outcomes)
 */
export function useOutcomes(systemId: string | null) {
  return useElements(systemId, 'outcome')
}

/**
 * Convenience hook for value chain elements
 */
export function useValueChain(systemId: string | null) {
  return useElements(systemId, 'value')
}

/**
 * Convenience hook for resources
 */
export function useResources(systemId: string | null) {
  return useElements(systemId, 'resource')
}

/**
 * Hook to get elements grouped by type
 */
export function useElementsGrouped(systemId: string | null) {
  const { data: allElements, isLoading, error } = useAllElements(systemId)

  if (!allElements) {
    return {
      outcomes: [],
      valueChain: [],
      resources: [],
      isLoading,
      error,
    }
  }

  return {
    outcomes: allElements.filter((e) => e.element_type === 'outcome'),
    valueChain: allElements.filter((e) => e.element_type === 'value'),
    resources: allElements.filter((e) => e.element_type === 'resource'),
    isLoading,
    error,
  }
}

