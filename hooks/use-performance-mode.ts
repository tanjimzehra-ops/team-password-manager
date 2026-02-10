"use client"

import { useState, useEffect, useCallback } from "react"
import { getStoredSettings } from "@/lib/user-preferences"
import type { NodeData } from "@/lib/types"

export interface UsePerformanceModeReturn {
  displayMode: "stage" | "performance"
  setDisplayMode: (mode: "stage" | "performance") => void
  performanceModalOpen: boolean
  performanceNode: NodeData | null
  openPerformanceModal: (node: NodeData) => void
  closePerformanceModal: () => void
}

export function usePerformanceMode(): UsePerformanceModeReturn {
  const [displayMode, setDisplayMode] = useState<"stage" | "performance">("stage")
  const [performanceModalOpen, setPerformanceModalOpen] = useState(false)
  const [performanceNode, setPerformanceNode] = useState<NodeData | null>(null)

  // Load default display mode from localStorage on mount
  useEffect(() => {
    const settings = getStoredSettings()
    setDisplayMode(settings.defaultDisplayMode)
  }, [])

  const openPerformanceModal = useCallback((node: NodeData) => {
    setPerformanceNode(node)
    setPerformanceModalOpen(true)
  }, [])

  const closePerformanceModal = useCallback(() => {
    setPerformanceModalOpen(false)
    setPerformanceNode(null)
  }, [])

  return {
    displayMode,
    setDisplayMode,
    performanceModalOpen,
    performanceNode,
    openPerformanceModal,
    closePerformanceModal,
  }
}
