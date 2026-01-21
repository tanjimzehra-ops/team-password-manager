import { useQuery } from '@tanstack/react-query'
import { supabase, SystemFactor, ExternalValue } from '@/lib/supabase'

/**
 * Fetch all factors for a system
 */
export function useFactors(systemId: string | null) {
  return useQuery({
    queryKey: ['factors', systemId],
    queryFn: async () => {
      if (!systemId) return []

      const { data, error } = await supabase
        .from('system_factors')
        .select('*')
        .eq('system_id', systemId)
        .order('value_chain_index')
        .order('order_index')

      if (error) throw error
      return data as SystemFactor[]
    },
    enabled: !!systemId,
  })
}

/**
 * Get factors grouped by value chain element
 */
export function useFactorsByValueChain(systemId: string | null) {
  return useQuery({
    queryKey: ['factorsByValueChain', systemId],
    queryFn: async () => {
      if (!systemId) return {}

      const { data, error } = await supabase
        .from('system_factors')
        .select('*')
        .eq('system_id', systemId)
        .order('order_index')

      if (error) throw error

      const factors = data as SystemFactor[]
      
      // Group by value_chain_index
      const grouped: Record<number, SystemFactor[]> = {}

      for (const factor of factors) {
        const index = factor.value_chain_index ?? -1
        if (!grouped[index]) {
          grouped[index] = []
        }
        grouped[index].push(factor)
      }

      return grouped
    },
    enabled: !!systemId,
  })
}

/**
 * Fetch all external values for a system (for Convergence Map)
 */
export function useExternalValues(systemId: string | null) {
  return useQuery({
    queryKey: ['externalValues', systemId],
    queryFn: async () => {
      if (!systemId) return []

      const { data, error } = await supabase
        .from('external_values')
        .select('*')
        .eq('system_id', systemId)
        .order('order_index')

      if (error) throw error
      return data as ExternalValue[]
    },
    enabled: !!systemId,
  })
}

