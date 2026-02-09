"use client"

import { useState, useMemo, useCallback } from "react"

export interface Portfolio {
  id: string
  title: string
  description?: string
  date?: string
  progress: number
  status: string
  elementId: string
  orderIndex?: number
}

export interface UsePortfolioStateReturn {
  optimisticPortfolios: Portfolio[]
  addOptimistic: (portfolio: Portfolio) => void
  removeOptimistic: (id: string) => void
  clearOptimistic: () => void
  getMergedPortfolios: (
    elementId: string,
    serverPortfolios: Array<{ id: string; title: string; description?: string; date?: string; progress: number; status: string }>
  ) => Array<{ id: string; title: string; description?: string; date?: string; progress: number; status: string }>
}

export function usePortfolioState(): UsePortfolioStateReturn {
  const [optimisticPortfolios, setOptimisticPortfolios] = useState<Portfolio[]>([])

  const addOptimistic = useCallback((portfolio: Portfolio) => {
    setOptimisticPortfolios((prev) => [...prev, portfolio])
  }, [])

  const removeOptimistic = useCallback((id: string) => {
    setOptimisticPortfolios((prev) => prev.filter((p) => p.id !== id))
  }, [])

  const clearOptimistic = useCallback(() => {
    setOptimisticPortfolios([])
  }, [])

  /**
   * Merge server portfolios with optimistic ones for a given elementId.
   * Optimistic portfolios that already appear in server data are excluded
   * to avoid duplicates once the server catches up.
   */
  const getMergedPortfolios = useCallback(
    (
      elementId: string,
      serverPortfolios: Array<{ id: string; title: string; description?: string; date?: string; progress: number; status: string }>
    ) => {
      const optimisticForElement = optimisticPortfolios.filter(
        (p) => String(p.elementId) === String(elementId)
      )
      const serverIds = new Set(serverPortfolios.map((p) => p.id))
      const newOptimistic = optimisticForElement
        .filter((o) => !serverIds.has(o.id))
        .map((o) => ({
          id: o.id,
          title: o.title,
          description: o.description,
          date: o.date,
          progress: o.progress,
          status: o.status,
        }))
      return [...serverPortfolios, ...newOptimistic]
    },
    [optimisticPortfolios]
  )

  return {
    optimisticPortfolios,
    addOptimistic,
    removeOptimistic,
    clearOptimistic,
    getMergedPortfolios,
  }
}
