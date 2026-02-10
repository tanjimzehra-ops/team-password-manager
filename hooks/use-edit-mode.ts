"use client"

import { useState, useCallback } from "react"
import type { NodeData } from "@/lib/types"

export type EditMode = "view" | "edit" | "colour" | "order" | "delete"

export interface UseEditModeReturn {
  editMode: EditMode
  setEditMode: (mode: EditMode) => void
  nodeForEdit: NodeData | null
  editPopupOpen: boolean
  nodeToDelete: NodeData | null
  deleteDialogOpen: boolean
  startEdit: (node: NodeData) => void
  startDelete: (node: NodeData) => void
  closeEdit: () => void
  closeDelete: () => void
  resetEditMode: () => void
}

export function useEditMode(): UseEditModeReturn {
  const [editMode, setEditMode] = useState<EditMode>("view")
  const [nodeForEdit, setNodeForEdit] = useState<NodeData | null>(null)
  const [editPopupOpen, setEditPopupOpen] = useState(false)
  const [nodeToDelete, setNodeToDelete] = useState<NodeData | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const startEdit = useCallback((node: NodeData) => {
    setNodeForEdit(node)
    setEditPopupOpen(true)
  }, [])

  const startDelete = useCallback((node: NodeData) => {
    setNodeToDelete(node)
    setDeleteDialogOpen(true)
  }, [])

  const closeEdit = useCallback(() => {
    setEditPopupOpen(false)
    setNodeForEdit(null)
  }, [])

  const closeDelete = useCallback(() => {
    setDeleteDialogOpen(false)
    setNodeToDelete(null)
  }, [])

  const resetEditMode = useCallback(() => {
    setEditMode("view")
    setNodeForEdit(null)
    setEditPopupOpen(false)
    setNodeToDelete(null)
    setDeleteDialogOpen(false)
  }, [])

  return {
    editMode,
    setEditMode,
    nodeForEdit,
    editPopupOpen,
    nodeToDelete,
    deleteDialogOpen,
    startEdit,
    startDelete,
    closeEdit,
    closeDelete,
    resetEditMode,
  }
}
