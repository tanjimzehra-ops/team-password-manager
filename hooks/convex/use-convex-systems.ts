/**
 * Convex-based hook for fetching systems list
 * Replaces the Supabase-based useSystems hook
 *
 * Convex useQuery returns undefined while loading, then the actual data.
 * We normalise this to match the existing hook interface: { data, isLoading }
 */

import { useQuery } from "convex/react"
import { api } from "../../convex/_generated/api"

export interface SystemInfo {
  id: string
  name: string
  sector: string
  orgId?: string
}

/**
 * Hook to fetch all available systems from Convex
 * Returns list of systems for the system selector dropdown
 */
export function useConvexSystems() {
  const systems = useQuery(api.systems.list)

  const isLoading = systems === undefined

  const data: SystemInfo[] = isLoading
    ? []
    : systems.map((s) => ({
        id: s._id,
        name: s.name,
        sector: s.sector ?? "",
        orgId: s.orgId ?? undefined,
      }))

  return { data, isLoading }
}
