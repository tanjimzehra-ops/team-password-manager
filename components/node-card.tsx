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
  primary: "bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-800 text-red-900 dark:text-red-100",
  secondary: "bg-sky-50 dark:bg-sky-950/40 border-sky-200 dark:border-sky-800 text-sky-900 dark:text-sky-100",
  accent: "bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-100",
  muted: "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-100",
  none: "bg-white dark:bg-card border-border text-foreground",
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
        "relative rounded-xl border flex flex-col h-full transition-all duration-500 premium-hover overflow-hidden shadow-sm",
        colors[node.color],
        compact ? "p-3 min-h-[140px]" : "p-5 min-h-[180px]",
        showKpi ? [healthBorderColor, "border-2 opacity-100"] : "border-border/30",
        editMode === "delete" && "hover:border-red-500 hover:bg-red-50/50 dark:hover:bg-red-950/30",
        editMode === "order" && "cursor-grab active:cursor-grabbing",
        isEmpty && editMode !== "colour" && "opacity-60 border-dashed",
      )}
    >
      {/* Floating Glow Orb */}
      <motion.div
        className={cn(
          "absolute -z-10 w-40 h-40 rounded-full blur-[80px] opacity-20 pointer-events-none",
          node.color === "primary" ? "bg-red-500/30" :
            node.color === "secondary" ? "bg-sky-500/30" :
              node.color === "accent" ? "bg-amber-500/30" :
                "bg-teal-500/20"
        )}
        animate={{
          x: [Math.round(Math.random() * 30), Math.round(Math.random() * -30), Math.round(Math.random() * 30)],
          y: [Math.round(Math.random() * -30), Math.round(Math.random() * 30), Math.round(Math.random() * -30)],
          scale: [1, 1.2, 0.9, 1],
        }}
        transition={{
          duration: 10 + Math.random() * 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          left: "10%",
          top: "10%",
        }}
      />

      <div className="flex flex-col h-full gap-3 relative z-10">
        <div className="flex items-center justify-between">
          {chipLabel && (
            <Badge variant="outline" className="text-[11px] px-2.5 py-0.5 font-black uppercase tracking-[0.1em] bg-white/40 dark:bg-black/20 border-black/10 dark:border-white/10">
              {chipLabel}
            </Badge>
          )}
          {showKpi && !isEditMode && (
            <div className="ml-auto">
              <HealthRing value={node.kpiValue} size={32} strokeWidth={3.5} showValue />
            </div>
          )}
          {editMode === "delete" && (
            <div className="ml-auto text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-950/50 rounded-full p-2 shadow-sm border border-red-200 dark:border-red-900/50 animate-in fade-in zoom-in-50 duration-200">
              <Trash2 className="w-4 h-4" />
            </div>
          )}
        </div>

        <div className="flex-1 flex flex-col gap-2">
          <h3 className={cn(
            "font-black tracking-tight leading-[1.1] text-foreground",
            compact ? "text-lg" : "text-3xl"
          )}>
            {isEmpty ? (
              <span className="italic opacity-50">Empty — click to edit</span>
            ) : (
              node.title
            )}
          </h3>
          {!compact && node.description && (
            <p className="text-base font-medium text-muted-foreground/85 line-clamp-4 leading-relaxed">
              {node.description}
            </p>
          )}
        </div>

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
              className="h-8 text-center text-sm font-bold bg-background text-foreground border-border"
            />
          </div>
        )}
      </div>

      {/* Inline color picker overlay */}
      {editMode === "colour" && showColorPicker && (
        <div className="absolute inset-0 z-50 bg-background/95 backdrop-blur-sm p-4 rounded-xl shadow-2xl animate-in fade-in duration-200">
          <InlineColorPicker
            currentColor={node.color}
            onColorSelect={handleColorSelect}
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
