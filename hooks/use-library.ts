"use client"

import { useState, useMemo, useCallback } from "react"
import type { NodeData, RowData } from "@/lib/types"

export interface LibraryItem {
  id: string
  title: string
  description: string
  category: "outcomes" | "value-chain" | "resources"
  systemId: string
  systemName: string
}

export interface UseLibraryReturn {
  libraryOpen: boolean
  libraryCategory: NodeData["category"] | null
  libraryItems: LibraryItem[]
  openLibrary: (category: NodeData["category"]) => void
  closeLibrary: () => void
}

/**
 * Manages the element library overlay state and builds library items
 * from the logic grid data of all systems, excluding the current system.
 *
 * @param logicGridData - The rows of the current system's logic model
 * @param systems - All available systems (array of {id, name})
 * @param currentSystemId - The ID of the currently selected system
 */
export function useLibrary(
  logicGridData: RowData[],
  systems: Array<{ id: string; name: string }> | undefined,
  currentSystemId: string | null
): UseLibraryReturn {
  const [libraryOpen, setLibraryOpen] = useState(false)
  const [libraryCategory, setLibraryCategory] = useState<NodeData["category"] | null>(null)

  const openLibrary = useCallback((category: NodeData["category"]) => {
    setLibraryCategory(category)
    setLibraryOpen(true)
  }, [])

  const closeLibrary = useCallback(() => {
    setLibraryOpen(false)
    setLibraryCategory(null)
  }, [])

  /**
   * Build library items from the current system's logic grid data.
   * In a multi-system scenario, items from other systems would be added here
   * once a cross-system query endpoint is available.
   * For now, mirrors the Tanjim implementation: items from the current system.
   */
  const libraryItems = useMemo<LibraryItem[]>(() => {
    const items: LibraryItem[] = []
    if (!logicGridData.length || !systems?.length) return items

    const currentSystem = systems.find((s) => s.id === currentSystemId)
    const systemName = currentSystem?.name ?? "Current"
    const systemId = currentSystemId ?? ""

    for (const row of logicGridData) {
      if (
        row.category === "outcomes" ||
        row.category === "value-chain" ||
        row.category === "resources"
      ) {
        for (const node of row.nodes) {
          items.push({
            id: node.id,
            title: node.title,
            description: node.description ?? "",
            category: row.category,
            systemId,
            systemName,
          })
        }
      }
    }

    return items
  }, [logicGridData, systems, currentSystemId])

  return {
    libraryOpen,
    libraryCategory,
    libraryItems,
    openLibrary,
    closeLibrary,
  }
}
