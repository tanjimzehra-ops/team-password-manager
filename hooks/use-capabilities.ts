import { useQuery } from '@tanstack/react-query'
import { supabase, Capability } from '@/lib/supabase'

/**
 * Fetch all capabilities for a system
 */
export function useCapabilities(systemId: string | null) {
  return useQuery({
    queryKey: ['capabilities', systemId],
    queryFn: async () => {
      if (!systemId) return { current: [], necessary: [] }

      const { data, error } = await supabase
        .from('capabilities')
        .select('*')
        .eq('system_id', systemId)
        .order('resource_index')
        .order('order_index')

      if (error) throw error

      const capabilities = data as Capability[]
      
      return {
        current: capabilities.filter(c => c.capability_type === 'current'),
        necessary: capabilities.filter(c => c.capability_type === 'necessary'),
      }
    },
    enabled: !!systemId,
  })
}

/**
 * Fetch capabilities by type (current or necessary)
 */
export function useCapabilitiesByType(
  systemId: string | null, 
  type: 'current' | 'necessary'
) {
  return useQuery({
    queryKey: ['capabilities', systemId, type],
    queryFn: async () => {
      if (!systemId) return []

      const { data, error } = await supabase
        .from('capabilities')
        .select('*')
        .eq('system_id', systemId)
        .eq('capability_type', type)
        .order('resource_index')
        .order('order_index')

      if (error) throw error
      return data as Capability[]
    },
    enabled: !!systemId,
  })
}

/**
 * Get capabilities grouped by resource
 */
export function useCapabilitiesByResource(systemId: string | null) {
  return useQuery({
    queryKey: ['capabilitiesByResource', systemId],
    queryFn: async () => {
      if (!systemId) return {}

      const { data, error } = await supabase
        .from('capabilities')
        .select('*')
        .eq('system_id', systemId)
        .order('order_index')

      if (error) throw error

      const capabilities = data as Capability[]
      
      // Group by resource_index
      const grouped: Record<number, { current: Capability[], necessary: Capability[] }> = {}

      for (const cap of capabilities) {
        if (!grouped[cap.resource_index]) {
          grouped[cap.resource_index] = { current: [], necessary: [] }
        }
        grouped[cap.resource_index][cap.capability_type].push(cap)
      }

      return grouped
    },
    enabled: !!systemId,
  })
}

