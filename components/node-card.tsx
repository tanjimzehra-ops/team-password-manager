"use client"

import type { NodeData } from "@/lib/types"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"

interface NodeCardProps {
  node: NodeData
  showKpi: boolean
  onClick: () => void
  compact?: boolean
  isEditMode?: boolean
  chipLabel?: string // Added chipLabel prop for numbered chips
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

export function NodeCard({ node, showKpi, onClick, compact = false, isEditMode = false, chipLabel }: NodeCardProps) {
  const colors = isEditMode ? editModeColorMap : viewModeColorMap

  return (
    <div
      onClick={onClick}
      className={cn(
        "relative cursor-pointer rounded-lg border-2 transition-all duration-200 flex flex-col",
        "hover:shadow-lg hover:scale-[1.01] active:scale-[0.99]",
        "shadow-md",
        colors[node.color],
        compact ? "p-2 min-h-[70px]" : "p-3 min-h-[160px]",
      )}
    >
      {chipLabel && (
        <span
          className={cn(
            "text-[9px] font-medium mb-1 self-start",
            isEditMode ? "text-white/70" : "text-muted-foreground",
          )}
        >
          {chipLabel}
        </span>
      )}

      <h3 className={cn("font-bold leading-tight text-center", compact ? "text-[11px]" : "text-sm mb-2")}>
        {node.title}
      </h3>

      {/* Description only for non-compact (Outcomes) cards */}
      {!compact && node.description && (
        <p
          className={cn(
            "text-xs leading-snug text-center flex-1 mt-1",
            isEditMode ? "opacity-90" : "text-muted-foreground",
          )}
        >
          {node.description}
        </p>
      )}

      {/* KPI input - only in edit mode */}
      {showKpi && isEditMode && (
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
