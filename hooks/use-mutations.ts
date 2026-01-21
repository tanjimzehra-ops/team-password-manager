import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useToast } from './use-toast'

/**
 * Mutation hook to update a system element (outcome, value, resource)
 */
export function useUpdateElement() {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  
  return useMutation({
    mutationFn: async ({ 
      id, 
      content, 
      gradientValue,
      description 
    }: { 
      id: string
      content?: string
      gradientValue?: number
      description?: string
    }) => {
      const updateData: any = {
        updated_at: new Date().toISOString()
      }
      
      if (content !== undefined) updateData.content = content
      if (gradientValue !== undefined) updateData.gradient_value = gradientValue
      if (description !== undefined) updateData.description = description

      const { data, error } = await supabase
        .from('system_elements')
        .update(updateData)
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    onMutate: async ({ id, content, gradientValue }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['elements'] })
      
      // Snapshot current value
      const previousElements = queryClient.getQueryData(['elements'])
      
      // Optimistically update
      queryClient.setQueryData(['elements'], (old: any) => {
        if (!old) return old
        return old.map((el: any) => 
          el.id === id 
            ? { 
                ...el, 
                content: content !== undefined ? content : el.content,
                gradient_value: gradientValue !== undefined ? gradientValue : el.gradient_value
              }
            : el
        )
      })
      
      return { previousElements }
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousElements) {
        queryClient.setQueryData(['elements'], context.previousElements)
      }
      toast({
        title: "Error saving changes",
        description: err instanceof Error ? err.message : "Unknown error occurred",
        variant: "destructive"
      })
    },
    onSuccess: (data) => {
      // Invalidate all related queries
      queryClient.invalidateQueries({ 
        queryKey: ['elements', data.system_id] 
      })
      queryClient.invalidateQueries({
        queryKey: ['full-system', data.system_id]
      })
      toast({
        title: "Changes saved",
        description: "Element updated successfully"
      })
    }
  })
}

/**
 * Mutation hook to update a matrix cell
 */
export function useUpdateMatrixCell() {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  
  return useMutation({
    mutationFn: async ({
      id,
      content
    }: {
      id: string
      content: string
    }) => {
      const { data, error } = await supabase
        .from('matrix_cells')
        .update({ 
          content,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    onMutate: async ({ id, content }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['matrix-cells'] })
      
      // Snapshot current value
      const previousCells = queryClient.getQueryData(['matrix-cells'])
      
      // Optimistically update
      queryClient.setQueryData(['matrix-cells'], (old: any) => {
        if (!old) return old
        return old.map((cell: any) => 
          cell.id === id ? { ...cell, content } : cell
        )
      })
      
      return { previousCells }
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousCells) {
        queryClient.setQueryData(['matrix-cells'], context.previousCells)
      }
      toast({
        title: "Error saving cell",
        description: err instanceof Error ? err.message : "Unknown error occurred",
        variant: "destructive"
      })
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['matrix-cells', data.system_id]
      })
      queryClient.invalidateQueries({
        queryKey: ['full-system', data.system_id]
      })
      toast({
        title: "Cell updated",
        description: "Matrix cell saved successfully"
      })
    }
  })
}

/**
 * Mutation hook to update system-level fields (purpose, culture, context)
 */
export function useUpdateSystem() {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  
  return useMutation({
    mutationFn: async ({
      id,
      impact,
      dimension,
      challenge
    }: {
      id: string
      impact?: string
      dimension?: string
      challenge?: string
    }) => {
      const updateData: any = {
        updated_at: new Date().toISOString()
      }
      
      if (impact !== undefined) updateData.impact = impact
      if (dimension !== undefined) updateData.dimension = dimension
      if (challenge !== undefined) updateData.challenge = challenge

      const { data, error } = await supabase
        .from('logic_systems')
        .update(updateData)
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    onError: (err) => {
      toast({
        title: "Error saving system",
        description: err instanceof Error ? err.message : "Unknown error occurred",
        variant: "destructive"
      })
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['system', data.id]
      })
      queryClient.invalidateQueries({
        queryKey: ['full-system', data.id]
      })
      toast({
        title: "System updated",
        description: "Changes saved successfully"
      })
    }
  })
}

