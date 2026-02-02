/**
 * Convex-based mutation hooks
 * Replaces the Supabase-based useUpdateElement, useUpdateMatrixCell, useUpdateSystem, etc.
 *
 * With Convex, mutations are automatically reactive - when a mutation completes,
 * any useQuery that depends on the mutated data will re-render automatically.
 * This means we do NOT need manual cache invalidation or optimistic updates
 * as we did with React Query + Supabase.
 */

import { useMutation } from "convex/react"
import { api } from "../../convex/_generated/api"
import type { Id } from "../../convex/_generated/dataModel"
import { useToast } from "../use-toast"

// ---------------------------------------------------------------------------
// Element mutations
// ---------------------------------------------------------------------------

/**
 * Update an element (outcome, value chain, or resource)
 */
export function useConvexUpdateElement() {
  const mutate = useMutation(api.elements.update)
  const { toast } = useToast()

  const updateElement = async ({
    id,
    content,
    gradientValue,
    description,
  }: {
    id: string
    content?: string
    gradientValue?: number
    description?: string
  }) => {
    try {
      await mutate({
        id: id as Id<"elements">,
        content,
        gradientValue,
        description,
      })
      toast({ title: "Changes saved", description: "Element updated successfully" })
    } catch (err) {
      toast({
        title: "Error saving changes",
        description: err instanceof Error ? err.message : "Unknown error occurred",
        variant: "destructive",
      })
      throw err
    }
  }

  return { mutate: updateElement, updateElement }
}

/**
 * Create a new element
 */
export function useConvexCreateElement() {
  const mutate = useMutation(api.elements.create)
  const { toast } = useToast()

  const createElement = async ({
    systemId,
    elementType,
    content,
    description,
    orderIndex,
    gradientValue,
  }: {
    systemId: string
    elementType: "outcome" | "value_chain" | "resource"
    content: string
    description?: string
    orderIndex: number
    gradientValue?: number
  }) => {
    try {
      const id = await mutate({
        systemId: systemId as Id<"systems">,
        elementType,
        content,
        description,
        orderIndex,
        gradientValue,
      })
      toast({ title: "Element created", description: `New ${elementType} added` })
      return id
    } catch (err) {
      toast({
        title: "Error creating element",
        description: err instanceof Error ? err.message : "Unknown error occurred",
        variant: "destructive",
      })
      throw err
    }
  }

  return { mutate: createElement, createElement }
}

/**
 * Delete an element
 */
export function useConvexDeleteElement() {
  const mutate = useMutation(api.elements.remove)
  const { toast } = useToast()

  const deleteElement = async ({ id }: { id: string }) => {
    try {
      await mutate({ id: id as Id<"elements"> })
      toast({ title: "Element deleted", description: "Element removed successfully" })
    } catch (err) {
      toast({
        title: "Error deleting element",
        description: err instanceof Error ? err.message : "Unknown error occurred",
        variant: "destructive",
      })
      throw err
    }
  }

  return { mutate: deleteElement, deleteElement }
}

// ---------------------------------------------------------------------------
// Matrix cell mutations
// ---------------------------------------------------------------------------

/**
 * Update a matrix cell
 */
export function useConvexUpdateMatrixCell() {
  const mutate = useMutation(api.matrixCells.upsert)
  const { toast } = useToast()

  const updateMatrixCell = async ({
    id,
    content,
  }: {
    id: string
    content: string
  }) => {
    try {
      await mutate({ id: id as Id<"matrixCells">, content })
      toast({ title: "Cell updated", description: "Matrix cell saved successfully" })
    } catch (err) {
      toast({
        title: "Error saving cell",
        description: err instanceof Error ? err.message : "Unknown error occurred",
        variant: "destructive",
      })
      throw err
    }
  }

  return { mutate: updateMatrixCell, updateMatrixCell }
}

// ---------------------------------------------------------------------------
// System mutations
// ---------------------------------------------------------------------------

/**
 * Update system-level fields (impact/purpose, dimension/culture, challenge/context)
 */
export function useConvexUpdateSystem() {
  const mutate = useMutation(api.systems.update)
  const { toast } = useToast()

  const updateSystem = async ({
    id,
    impact,
    dimension,
    challenge,
  }: {
    id: string
    impact?: string
    dimension?: string
    challenge?: string
  }) => {
    try {
      await mutate({
        id: id as Id<"systems">,
        impact,
        dimension,
        challenge,
      })
      toast({ title: "System updated", description: "Changes saved successfully" })
    } catch (err) {
      toast({
        title: "Error saving system",
        description: err instanceof Error ? err.message : "Unknown error occurred",
        variant: "destructive",
      })
      throw err
    }
  }

  return { mutate: updateSystem, updateSystem }
}

// ---------------------------------------------------------------------------
// Capability mutations
// ---------------------------------------------------------------------------

/**
 * Upsert a capability (create or update)
 */
export function useConvexUpsertCapability() {
  const mutate = useMutation(api.capabilities.upsert)
  const { toast } = useToast()

  const upsertCapability = async ({
    systemId,
    resourceId,
    capabilityType,
    content,
  }: {
    systemId: string
    resourceId: string
    capabilityType: "current" | "necessary"
    content: string
  }) => {
    try {
      await mutate({
        systemId: systemId as Id<"systems">,
        resourceId: resourceId as Id<"elements">,
        capabilityType,
        content,
      })
      toast({ title: "Capability saved", description: "Capability updated successfully" })
    } catch (err) {
      toast({
        title: "Error saving capability",
        description: err instanceof Error ? err.message : "Unknown error occurred",
        variant: "destructive",
      })
      throw err
    }
  }

  return { mutate: upsertCapability, upsertCapability }
}

// ---------------------------------------------------------------------------
// KPI mutations
// ---------------------------------------------------------------------------

/**
 * Create a KPI
 */
export function useConvexCreateKpi() {
  const mutate = useMutation(api.kpis.create)
  const { toast } = useToast()

  const createKpi = async ({
    systemId,
    parentId,
    content,
    orderIndex,
  }: {
    systemId: string
    parentId: string
    content: string
    orderIndex: number
  }) => {
    try {
      const id = await mutate({
        systemId: systemId as Id<"systems">,
        parentId: parentId as Id<"elements">,
        content,
        orderIndex,
      })
      toast({ title: "KPI created", description: "New KPI added" })
      return id
    } catch (err) {
      toast({
        title: "Error creating KPI",
        description: err instanceof Error ? err.message : "Unknown error occurred",
        variant: "destructive",
      })
      throw err
    }
  }

  return { mutate: createKpi, createKpi }
}

/**
 * Update a KPI
 */
export function useConvexUpdateKpi() {
  const mutate = useMutation(api.kpis.update)
  const { toast } = useToast()

  const updateKpi = async ({
    id,
    content,
  }: {
    id: string
    content: string
  }) => {
    try {
      await mutate({ id: id as Id<"kpis">, content })
      toast({ title: "KPI updated", description: "KPI saved successfully" })
    } catch (err) {
      toast({
        title: "Error updating KPI",
        description: err instanceof Error ? err.message : "Unknown error occurred",
        variant: "destructive",
      })
      throw err
    }
  }

  return { mutate: updateKpi, updateKpi }
}

/**
 * Delete a KPI
 */
export function useConvexDeleteKpi() {
  const mutate = useMutation(api.kpis.remove)
  const { toast } = useToast()

  const deleteKpi = async ({ id }: { id: string }) => {
    try {
      await mutate({ id: id as Id<"kpis"> })
      toast({ title: "KPI deleted", description: "KPI removed successfully" })
    } catch (err) {
      toast({
        title: "Error deleting KPI",
        description: err instanceof Error ? err.message : "Unknown error occurred",
        variant: "destructive",
      })
      throw err
    }
  }

  return { mutate: deleteKpi, deleteKpi }
}

// ---------------------------------------------------------------------------
// Factor mutations
// ---------------------------------------------------------------------------

/**
 * Create a factor
 */
export function useConvexCreateFactor() {
  const mutate = useMutation(api.factors.upsert)
  const { toast } = useToast()

  const createFactor = async ({
    systemId,
    valueChainId,
    content,
  }: {
    systemId: string
    valueChainId: string
    content: string
  }) => {
    try {
      const id = await mutate({
        systemId: systemId as Id<"systems">,
        valueChainId: valueChainId as Id<"elements">,
        content,
      })
      toast({ title: "Factor created", description: "New factor added" })
      return id
    } catch (err) {
      toast({
        title: "Error creating factor",
        description: err instanceof Error ? err.message : "Unknown error occurred",
        variant: "destructive",
      })
      throw err
    }
  }

  return { mutate: createFactor, createFactor }
}

/**
 * Update a factor
 */
export function useConvexUpdateFactor() {
  const mutate = useMutation(api.factors.upsert)
  const { toast } = useToast()

  const updateFactor = async ({
    id,
    content,
  }: {
    id: string
    content: string
  }) => {
    try {
      await mutate({ id: id as Id<"factors">, content })
      toast({ title: "Factor updated", description: "Factor saved successfully" })
    } catch (err) {
      toast({
        title: "Error updating factor",
        description: err instanceof Error ? err.message : "Unknown error occurred",
        variant: "destructive",
      })
      throw err
    }
  }

  return { mutate: updateFactor, updateFactor }
}

/**
 * Delete a factor
 */
export function useConvexDeleteFactor() {
  const mutate = useMutation(api.factors.remove)
  const { toast } = useToast()

  const deleteFactor = async ({ id }: { id: string }) => {
    try {
      await mutate({ id: id as Id<"factors"> })
      toast({ title: "Factor deleted", description: "Factor removed successfully" })
    } catch (err) {
      toast({
        title: "Error deleting factor",
        description: err instanceof Error ? err.message : "Unknown error occurred",
        variant: "destructive",
      })
      throw err
    }
  }

  return { mutate: deleteFactor, deleteFactor }
}

// ---------------------------------------------------------------------------
// External value mutations
// ---------------------------------------------------------------------------

/**
 * Create an external value
 */
export function useConvexCreateExternalValue() {
  const mutate = useMutation(api.externalValues.create)
  const { toast } = useToast()

  const createExternalValue = async ({
    systemId,
    content,
    description,
    orderIndex,
  }: {
    systemId: string
    content: string
    description?: string
    orderIndex: number
  }) => {
    try {
      const id = await mutate({
        systemId: systemId as Id<"systems">,
        content,
        description,
        orderIndex,
      })
      toast({ title: "External value created", description: "New external value added" })
      return id
    } catch (err) {
      toast({
        title: "Error creating external value",
        description: err instanceof Error ? err.message : "Unknown error occurred",
        variant: "destructive",
      })
      throw err
    }
  }

  return { mutate: createExternalValue, createExternalValue }
}

/**
 * Update an external value
 */
export function useConvexUpdateExternalValue() {
  const mutate = useMutation(api.externalValues.update)
  const { toast } = useToast()

  const updateExternalValue = async ({
    id,
    content,
    description,
  }: {
    id: string
    content?: string
    description?: string
  }) => {
    try {
      await mutate({
        id: id as Id<"externalValues">,
        content,
        description,
      })
      toast({ title: "External value updated", description: "Changes saved successfully" })
    } catch (err) {
      toast({
        title: "Error updating external value",
        description: err instanceof Error ? err.message : "Unknown error occurred",
        variant: "destructive",
      })
      throw err
    }
  }

  return { mutate: updateExternalValue, updateExternalValue }
}

/**
 * Delete an external value
 */
export function useConvexDeleteExternalValue() {
  const mutate = useMutation(api.externalValues.remove)
  const { toast } = useToast()

  const deleteExternalValue = async ({ id }: { id: string }) => {
    try {
      await mutate({ id: id as Id<"externalValues"> })
      toast({ title: "External value deleted", description: "External value removed successfully" })
    } catch (err) {
      toast({
        title: "Error deleting external value",
        description: err instanceof Error ? err.message : "Unknown error occurred",
        variant: "destructive",
      })
      throw err
    }
  }

  return { mutate: deleteExternalValue, deleteExternalValue }
}
