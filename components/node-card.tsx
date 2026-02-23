"use client"

import { useState } from "react"
import type { NodeData } from "@/lib/types"
import type { EditMode } from "@/hooks/use-edit-mode"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { GripVertical, Trash2, Palette } from "lucide-react"
import { InlineColorPicker } from "@/components/inline-color-picker"
import { getHealthBorderColor, formatKpiValue, getHealthStatus } from "@/lib/kpi-utils"

interface NodeCardProps {
  node: NodeData
  showKpi: boolean
  onClick: () => void
  compact?: boolean
  isEditMode?: boolean
  editMode?: EditMode
  chipLabel?: string
  onColorChange?: (color: NodeData["color"]) => void
  onEditClick?: (node: NodeData) => void
  onDeleteClick?: (node: NodeData) => void
  draggable?: boolean
  onDragStart?: (e: React.DragEvent, node: NodeData) => void
  onDragEnd?: () => void
  onDrop?: (e: React.DragEvent, node: NodeData) => void
}

const editModeColorMap = {
  primary: "bg-red-700 border-red-800 text-white",
  secondary: "bg-sky-600 border-sky-700 text-white",
  accent: "bg-amber-500 border-amber-600 text-white",
  muted: "bg-emerald-500 border-emerald-600 text-white",
}

const viewModeColorMap = {
  primary: "bg-card border-border text-card-foreground",
  secondary: "bg-card border-border text-card-foreground",
  accent: "bg-card border-border text-card-foreground",
  muted: "bg-card border-border text-card-foreground",
}

const healthBadgeColorMap: Record<"healthy" | "warning" | "critical", string> = {
  healthy: "bg-green-500 text-white",
  warning: "bg-yellow-500 text-black",
  critical: "bg-red-500 text-white",
}

export function NodeCard({
  node,
  showKpi,
  onClick,
  compact = false,
  isEditMode = false,
  editMode,
  chipLabel,
  onColorChange,
  onEditClick,
  onDeleteClick,
  draggable = false,
  onDragStart,
  onDragEnd,
  onDrop,
}: NodeCardProps) {
  const [showColorPicker, setShowColorPicker] = useState(false)

  // Detect empty nodes
  const isEmpty = !node.title || node.title.trim() === ""

  const colors = editMode === "colour" ? editModeColorMap : viewModeColorMap
  const healthBorderColor = showKpi ? getHealthBorderColor(node.kpiValue) : ""
  const healthStatus = getHealthStatus(node.kpiValue)

  // Determine the click handler based on edit mode
  const handleClick = () => {
    if (editMode === "colour") {
      setShowColorPicker((prev) => !prev)
      return
    }
    if (editMode === "edit" && onEditClick) {
      onEditClick(node)
      return
    }
    if (editMode === "delete" && onDeleteClick) {
      onDeleteClick(node)
      return
    }
    onClick()
  }

  const handleColorSelect = (color: NodeData["color"]) => {
    onColorChange?.(color)
    setShowColorPicker(false)
  }

  const handleDragStart = (e: React.DragEvent) => {
    onDragStart?.(e, node)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    onDrop?.(e, node)
  }

  return (
    <div
      onClick={handleClick}
      draggable={draggable || editMode === "order"}
      onDragStart={handleDragStart}
      onDragEnd={onDragEnd}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={cn(
        "relative cursor-pointer rounded-lg border-2 transition-all duration-200 flex flex-col h-full",
        "hover:shadow-lg hover:scale-[1.01] active:scale-[0.99]",
        "shadow-md",
        colors[node.color],
        // Apply health-based border color when showKpi is true
        healthBorderColor,
        "p-3 min-h-[110px]",
        editMode === "delete" && "hover:border-red-500 hover:bg-red-50 dark:hover:bg-red-950/30",
        editMode === "order" && "cursor-grab active:cursor-grabbing",
        // Empty node styling - muted appearance in view mode
        isEmpty && editMode !== "colour" && "opacity-60 border-dashed",
      )}
    >
      {/* Edit mode overlays */}

      {/* Colour mode: Palette icon indicator */}
      {editMode === "colour" && (
        <div className="absolute top-1 right-1 z-10">
          <Palette className="h-4 w-4 text-white/80" />
        </div>
      )}

      {/* Order mode: Drag grip icon */}
      {editMode === "order" && (
        <div className="absolute top-1 left-1 z-10">
          <GripVertical className="h-4 w-4 text-white/80" />
        </div>
      )}

      {/* Delete mode: Trash icon overlay */}
      {editMode === "delete" && (
        <div className="absolute top-1 right-1 z-10">
          <Trash2 className="h-4 w-4 text-red-400" />
        </div>
      )}

      {/* KPI badge in top-right corner - shown when showKpi is true and not in edit mode */}
      {showKpi && !isEditMode && (
        <Badge
          className={cn(
            "absolute top-1 right-1 z-10 text-sm px-1.5 py-0 border-none",
            healthBadgeColorMap[healthStatus],
          )}
        >
          {formatKpiValue(node.kpiValue)}
        </Badge>
      )}

      {/* Inline color picker overlay */}
      {editMode === "colour" && showColorPicker && (
        <InlineColorPicker
          currentColor={node.color}
          onColorSelect={handleColorSelect}
        />
      )}

      {chipLabel && (
        <span
          className={cn(
            "text-xs font-medium mb-1 self-start",
            isEditMode ? "text-white/70" : "text-muted-foreground",
          )}
        >
          {chipLabel}
        </span>
      )}

      <h3 className={cn("font-bold leading-tight text-center text-sm mb-2")}>
        {isEmpty ? (
          <span className="text-muted-foreground italic">Empty — click to edit</span>
        ) : (
          node.title
        )}
      </h3>

      {/* Description only for non-compact (Outcomes) cards */}
      {!compact && node.description && (
        <p
          className={cn(
            "text-sm leading-snug text-center flex-1 mt-1",
            isEditMode ? "opacity-90" : "text-muted-foreground",
          )}
        >
          {node.description}
        </p>
      )}

      {/* KPI input - only in edit mode */}
      {showKpi && editMode === "edit" && (
        <div className="mt-auto pt-2">
          <Input
            type="number"
            defaultValue={node.kpiValue}
            onClick={(e) => e.stopPropagation()}
            className="h-6 text-center text-xs bg-background text-foreground border-border"
          />
        </div>
      )}
    </div>
  )
}
