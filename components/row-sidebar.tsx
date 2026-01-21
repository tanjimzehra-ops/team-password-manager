"use client"

import type { RowData } from "@/lib/types"
import { cn } from "@/lib/utils"

interface RowSidebarProps {
  rows: RowData[]
  isCollapsed?: boolean
  onToggle?: () => void
  activeRow: string | null
  onRowClick: (rowId: string) => void
}

export function RowSidebar({ rows, activeRow, onRowClick }: RowSidebarProps) {
  // Map row IDs to vertical label text
  const getVerticalLabel = (rowId: string) => {
    switch (rowId) {
      case "purpose":
        return "IMPACT"
      case "outcomes":
        return "STRATEGIC INTENT"
      case "value-chain":
        return "VALUE CHAIN"
      case "resources":
        return "OPERATIONS"
      default:
        return null
    }
  }

  // Get sublabel for each section
  const getSubLabel = (rowId: string) => {
    switch (rowId) {
      case "outcomes":
        return "OUTCOMES"
      case "resources":
        return "RESOURCES"
      default:
        return null
    }
  }

  return (
    <div className="sticky top-[200px] h-fit shrink-0 bg-slate-800 z-10 w-12">
      {/* Row Labels - Vertical (90 degrees rotated) */}
      <div className="flex flex-col">
        {rows.map((row) => {
          const verticalLabel = getVerticalLabel(row.id)
          const subLabel = getSubLabel(row.id)
          if (!verticalLabel) return null

          return (
            <button
              key={row.id}
              onClick={() => onRowClick(row.id)}
              className={cn(
                "relative px-1 py-4 border-b border-slate-700 last:border-b-0 transition-colors",
                "hover:bg-slate-700",
                activeRow === row.id && "bg-slate-700",
                "flex items-center justify-center",
              )}
              style={{ minHeight: row.id === "purpose" ? "60px" : "100px" }}
            >
              <div className="flex flex-col items-center gap-1">
                <span
                  className="text-[10px] font-bold text-white uppercase tracking-wider"
                  style={{
                    writingMode: "vertical-rl",
                    textOrientation: "mixed",
                    transform: "rotate(180deg)",
                    lineHeight: "1.2",
                  }}
                >
                  {verticalLabel}
                </span>
                {subLabel && (
                  <span
                    className="text-[9px] font-medium text-slate-400 uppercase tracking-wider"
                    style={{
                      writingMode: "vertical-rl",
                      textOrientation: "mixed",
                      transform: "rotate(180deg)",
                      lineHeight: "1.2",
                    }}
                  >
                    {subLabel}
                  </span>
                )}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
