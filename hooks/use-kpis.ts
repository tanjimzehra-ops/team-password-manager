import { useQuery } from '@tanstack/react-query'
import { supabase, SystemKPI } from '@/lib/supabase'

/**
 * Fetch all KPIs for a system
 */
export function useSystemKPIs(systemId: string | null) {
  return useQuery({
    queryKey: ['systemKPIs', systemId],
    queryFn: async () => {
      if (!systemId) return []

      const { data, error } = await supabase
        .from('system_kpis')
        .select('*')
        .eq('system_id', systemId)
        .order('parent_type')
        .order('parent_index')
        .order('order_index')

      if (error) throw error
      return data as SystemKPI[]
    },
    enabled: !!systemId,
  })
}

/**
 * Fetch KPIs for a specific element type (outcome, value, resource)
 */
export function useElementKPIs(
  systemId: string | null, 
  parentType: 'outcome' | 'value' | 'resource',
  parentIndex?: number
) {
  return useQuery({
    queryKey: ['elementKPIs', systemId, parentType, parentIndex],
    queryFn: async () => {
      if (!systemId) return []

      let query = supabase
        .from('system_kpis')
        .select('*')
        .eq('system_id', systemId)
        .eq('parent_type', parentType)

      if (parentIndex !== undefined) {
        query = query.eq('parent_index', parentIndex)
      }

      const { data, error } = await query.order('order_index')

      if (error) throw error
      return data as SystemKPI[]
    },
    enabled: !!systemId,
  })
}

/**
 * Get KPIs grouped by parent element
 */
export function useKPIsByElement(systemId: string | null) {
  return useQuery({
    queryKey: ['kpisByElement', systemId],
    queryFn: async () => {
      if (!systemId) return { outcomes: {}, values: {}, resources: {} }

      const { data, error } = await supabase
        .from('system_kpis')
        .select('*')
        .eq('system_id', systemId)
        .order('order_index')

      if (error) throw error

      const kpis = data as SystemKPI[]
      
      // Group by parent_type and parent_index
      const grouped: {
        outcomes: Record<number, SystemKPI[]>
        values: Record<number, SystemKPI[]>
        resources: Record<number, SystemKPI[]>
      } = {
        outcomes: {},
        values: {},
        resources: {},
      }

      for (const kpi of kpis) {
        const key = kpi.parent_type === 'outcome' ? 'outcomes' 
          : kpi.parent_type === 'value' ? 'values' 
          : 'resources'
        
        if (!grouped[key][kpi.parent_index]) {
          grouped[key][kpi.parent_index] = []
        }
        grouped[key][kpi.parent_index].push(kpi)
      }

      return grouped
    },
    enabled: !!systemId,
  })
}

