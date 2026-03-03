import { useState, useCallback } from "react"
import type { NodeData } from "@/lib/types"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"

export interface UseLibraryReturn {
  libraryOpen: boolean
  libraryCategory: NodeData["category"] | null
  libraryItems: any[]
  openLibrary: (category: NodeData["category"]) => void
  closeLibrary: () => void
  isConnecting: boolean
  connect: (elementIds: Id<"elements">[]) => Promise<void>
  copy: (elementIds: Id<"elements">[]) => Promise<void>
}

export function useLibrary(
  currentSystemId: Id<"systems"> | null
): UseLibraryReturn {
  const [libraryOpen, setLibraryOpen] = useState(false)
  const [libraryCategory, setLibraryCategory] = useState<NodeData["category"] | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)

  const masterElements = useQuery(api.library.getLibraryElements) || []
  const connectMutation = useMutation(api.library.connectElements)
  const copyMutation = useMutation(api.library.copyElements)

  const openLibrary = useCallback((category: NodeData["category"]) => {
    setLibraryCategory(category)
    setLibraryOpen(true)
  }, [])

  const closeLibrary = useCallback(() => {
    setLibraryOpen(false)
    setLibraryCategory(null)
  }, [])

  const connect = useCallback(async (elementIds: Id<"elements">[]) => {
    if (!currentSystemId) return
    setIsConnecting(true)
    try {
      await connectMutation({ targetSystemId: currentSystemId, elementIds })
    } finally {
      setIsConnecting(false)
    }
  }, [currentSystemId, connectMutation])

  const copy = useCallback(async (elementIds: Id<"elements">[]) => {
    if (!currentSystemId) return
    setIsConnecting(true)
    try {
      await copyMutation({ targetSystemId: currentSystemId, elementIds })
    } finally {
      setIsConnecting(false)
    }
  }, [currentSystemId, copyMutation])

  return {
    libraryOpen,
    libraryCategory,
    libraryItems: masterElements,
    openLibrary,
    closeLibrary,
    isConnecting,
    connect,
    copy
  }
}
