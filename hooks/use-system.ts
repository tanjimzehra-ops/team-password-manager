import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

export interface SystemElement {
  id: string
  system_id: string
  element_type: 'outcome' | 'value_chain' | 'resource'
  title: string
  description: string
  order_index: number
  gradient_value: number
  created_at: string
  updated_at: string
}

export interface SystemKPI {
  id: string
  element_id: string
  title: string
  target_value: number
  current_value: number
  unit: string
}

export interface LogicSystem {
  id: string
  name: string
  sector: string
  impact: string
  delivery_culture: string
  system_context: string
  created_at: string
  updated_at: string
}

export interface SystemWithElements extends LogicSystem {
  system_elements: SystemElement[]
}

export function useSystem(systemId: string) {
  return useQuery({
    queryKey: ['system', systemId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('logic_systems')
        .select(`
          *,
          system_elements (*)
        `)
        .eq('id', systemId)
        .single()
      
      if (error) {
        // If Supabase is not configured, return null to use static data
        if (error.message.includes('Invalid API key') || error.message.includes('placeholder')) {
          console.warn('Supabase not configured, using static data')
          return null
        }
        throw error
      }
      
      return data as SystemWithElements
    },
    enabled: !!systemId && supabaseUrl !== 'https://placeholder.supabase.co',
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Helper to check if Supabase is configured
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
