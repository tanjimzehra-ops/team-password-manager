import { useQuery } from '@tanstack/react-query'
import { supabase, isSupabaseConfigured, type LogicSystem } from '@/lib/supabase'

/**
 * Hook to fetch all available systems
 * Returns list of systems for the system selector dropdown
 */
export function useSystems() {
  return useQuery({
    queryKey: ['systems'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('logic_systems')
        .select('id, name, sector, legacy_id')
        .order('name')

      if (error) {
        console.error('Error fetching systems:', error)
        throw error
      }

      return data as Pick<LogicSystem, 'id' | 'name' | 'sector' | 'legacy_id'>[]
    },
    enabled: isSupabaseConfigured,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

/**
 * Hook to fetch a single system by ID
 */
export function useSystem(systemId: string | null) {
  return useQuery({
    queryKey: ['system', systemId],
    queryFn: async () => {
      if (!systemId) return null

      const { data, error } = await supabase
        .from('logic_systems')
        .select('*')
        .eq('id', systemId)
        .single()

      if (error) {
        console.error('Error fetching system:', error)
        throw error
      }

      return data as LogicSystem
    },
    enabled: isSupabaseConfigured && !!systemId,
    staleTime: 5 * 60 * 1000,
  })
}

/**
 * Hook to fetch system by legacy ID (for backwards compatibility)
 */
export function useSystemByLegacyId(legacyId: number | null) {
  return useQuery({
    queryKey: ['system', 'legacy', legacyId],
    queryFn: async () => {
      if (!legacyId) return null

      const { data, error } = await supabase
        .from('logic_systems')
        .select('*')
        .eq('legacy_id', legacyId)
        .single()

      if (error) {
        console.error('Error fetching system by legacy ID:', error)
        throw error
      }

      return data as LogicSystem
    },
    enabled: isSupabaseConfigured && !!legacyId,
    staleTime: 5 * 60 * 1000,
  })
}

