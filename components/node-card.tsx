"use client"

import { useState } from "react"
import { motion } from "motion/react"
import type { NodeData } from "@/lib/types"
import type { EditMode } from "@/hooks/use-edit-mode"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ChevronDown, ChevronUp, GripVertical, Palette, Trash2 } from "lucide-react"
import { InlineColorPicker } from "@/components/inline-color-picker"
import { getHealthBorderColor, formatKpiValue, getHealthStatus } from "@/lib/kpi-utils"
import { HealthRing } from "@/components/ui/health-ring"
import { NodeKpiChart } from "@/components/node-kpi-chart"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { GlowingEffect } from "@/components/ui/glowing-effect"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"


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
  onKpiChange?: (value: number) => void
  draggable?: boolean
  onDragStart?: (e: React.DragEvent, node: NodeData) => void
  onDragEnd?: () => void
  onDrop?: (e: React.DragEvent, node: NodeData) => void
  showReorderArrows?: boolean
  onMoveUp?: () => void
  onMoveDown?: () => void
  disableMoveUp?: boolean
  disableMoveDown?: boolean
}

const editModeColorMap = {
  primary: "bg-red-700 border-red-800 text-white",
  secondary: "bg-sky-600 border-sky-700 text-white",
  accent: "bg-amber-500 border-amber-600 text-white",
  muted: "bg-emerald-500 border-emerald-600 text-white",
  none: "bg-card border-border text-card-foreground",
}

const viewModeColorMap = {
  primary: "bg-red-700/10 border-red-800 text-card-foreground",
  secondary: "bg-sky-600/10 border-sky-700 text-card-foreground",
  accent: "bg-amber-500/10 border-amber-600 text-card-foreground",
  muted: "bg-emerald-500/10 border-emerald-600 text-card-foreground",
  none: "bg-card border-border text-card-foreground",
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
  onKpiChange,
  draggable = false,
  onDragStart,
  onDragEnd,
  onDrop,
  showReorderArrows = false,
  onMoveUp,
  onMoveDown,
  disableMoveUp = false,
  disableMoveDown = false,
}: NodeCardProps) {
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

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
      setShowDeleteConfirm(true)
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
  const cardBody = (
    <div
      onClick={handleClick}
      draggable={draggable || editMode === "order"}
      onDragStart={handleDragStart}
      onDragEnd={onDragEnd}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={cn(
        "relative rounded-lg border flex flex-col h-full",
        "glass-card premium-hover",
        colors[node.color],
        "p-3 min-h-[110px]",
        editMode === "delete" && "hover:border-red-500 hover:bg-red-50/50 dark:hover:bg-red-950/30",
        editMode === "order" && "cursor-grab active:cursor-grabbing",
        isEmpty && editMode !== "colour" && "opacity-60 border-dashed",
      )}
    >
      <GlowingEffect
        spread={40}
        glow={true}
        disabled={isEditMode}
        proximity={64}
        inactiveZone={0.01}
        borderWidth={2}
      />

      {/* Floating Glow Orb - Moving unique object to fill space */}
      <motion.div
        className={cn(
          "absolute -z-10 w-32 h-32 rounded-full blur-[80px] opacity-30 pointer-events-none",
          node.color === "primary" ? "bg-red-500/40" :
            node.color === "secondary" ? "bg-sky-500/40" :
              node.color === "accent" ? "bg-amber-500/40" :
                "bg-teal-500/40"
        )}
        animate={{
          x: [Math.round(Math.random() * 20), Math.round(Math.random() * -20), Math.round(Math.random() * 20)],
          y: [Math.round(Math.random() * -20), Math.round(Math.random() * 20), Math.round(Math.random() * -20)],
          scale: [1, 1.2, 0.9, 1],
        }}
        transition={{
          duration: 8 + Math.random() * 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          left: "15%",
          top: "15%",
        }}
      />

      {/* Health Ring in top-right corner */}
      {showKpi && !isEditMode && (
        <div className="absolute top-2 right-2 z-10">
          <HealthRing value={node.kpiValue} size={28} strokeWidth={3} showValue />
        </div>
      )}

      {/* Delete Icon in top-right corner */}
      {editMode === "delete" && (
        <div className="absolute top-2 right-2 z-10 text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-950/50 rounded-full p-1.5 shadow-sm border border-red-200 dark:border-red-900/50 animate-in fade-in zoom-in-50 duration-200">
          <Trash2 className="w-4 h-4" />
        </div>
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
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.currentTarget.blur()
              }
            }}
            onBlur={(e) => {
              const val = parseInt(e.target.value, 10)
              if (!isNaN(val)) {
                onKpiChange?.(val)
              }
            }}
            className="h-6 text-center text-xs bg-background text-foreground border-border"
          />
        </div>
      )}
    </div>
  )

  return (
    <>
      {showKpi ? (
        <Tooltip>
          <TooltipTrigger asChild>
            {cardBody}
          </TooltipTrigger>
          <TooltipContent className="w-[320px] p-3 bg-card/95 backdrop-blur-md border-border/50 text-foreground shadow-xl">
            <NodeKpiChart kpiValue={node.kpiValue} title={node.title} />
          </TooltipContent>
        </Tooltip>
      ) : (
        cardBody
      )}

      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the card "{node.title || 'Untitled'}" and remove its data from the server.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                onDeleteClick?.(node)
                setShowDeleteConfirm(false)
              }}
              className="bg-red-600 hover:bg-red-700 text-white dark:hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
