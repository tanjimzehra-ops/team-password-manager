"use client"

import type { RowData } from "@/lib/types"
import { cn } from "@/lib/utils"

interface RowSidebarProps {
  rows: RowData[]
  activeRow: string | null
  onRowClick: (rowId: string) => void
  cultureTitle?: string
}

export function RowSidebar({ rows, activeRow, onRowClick, cultureTitle = "Delivery Culture" }: RowSidebarProps) {
  // Define the 6 rows for the Logic Model with precise height matching for LogicGrid.tsx
  const logicRows = [
    { id: "purpose", label: "PURPOSE", height: "h-[132px]" },
    { id: "outcomes", label: "OBJECTIVES", height: "h-[320px]" },
    { id: "value-chain", label: "VALUE CHAIN", height: "h-[220px]" },
    { id: "culture", label: "CULTURE", height: "h-[132px]" },
    { id: "resources", label: "RESOURCES", height: "h-[220px]" },
    { id: "context", label: "CONTEXT", height: "h-[132px]" },
  ]

  // Define section groups for the outer column (Brackets)
  const sections = [
    {
      id: "strategic-intent",
      label: "Strategic Intent",
      height: "h-[452px]", // 132 + 320
    },
    {
      id: "operations",
      label: "Operations",
      height: "h-[704px]", // 220 + 132 + 220 + 132
    },
  ]

  return (
    <div className="flex shrink-0 z-10 select-none h-fit mt-[96px] mb-24 rounded-2xl overflow-hidden border border-slate-300 dark:border-slate-800">
      {/* Outer Vertical Labels Column - Strategic Intent / Operations */}
      <div className="flex flex-col bg-slate-200/50 dark:bg-slate-900/50 border-r border-slate-300 dark:border-slate-800 h-full">
        {sections.map((section) => (
          <div
            key={section.id}
            className={cn(
              "w-14 flex items-center justify-center relative transition-all duration-300",
              "border-b border-slate-300/50 dark:border-slate-800/50 last:border-b-0",
              section.height
            )}
          >
            <span
              className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.3em] whitespace-nowrap z-10"
              style={{
                writingMode: "vertical-rl",
                transform: "rotate(180deg)",
              }}
            >
              {section.label}
            </span>
          </div>
        ))}
      </div>

      {/* Inner Row Labels Column - Purpose, Objectives, etc. */}
      <div className="flex flex-col bg-slate-100/40 dark:bg-slate-800/20 backdrop-blur-sm border-r border-slate-300 dark:border-slate-800 h-full">
        {logicRows.map((row) => (
          <button
            key={row.id}
            onClick={() => onRowClick(row.id)}
            className={cn(
              "w-36 flex flex-col transition-all duration-200",
              "border-b border-slate-300/30 dark:border-slate-700/50 last:border-b-0",
              "hover:bg-teal-500/10 dark:hover:bg-teal-500/5 group text-center",
              activeRow === row.id && "bg-teal-500/5 dark:bg-teal-500/10",
              row.height
            )}
          >
            {/* Header Spacer - matches grid header height (60px) */}
            <div className="h-[60px] shrink-0" />

            {/* Label Container - centers the label vertically in the content area */}
            <div className="flex-1 flex items-center justify-center px-4">
              <span className={cn(
                "text-xs font-black uppercase tracking-widest transition-colors duration-200",
                activeRow === row.id ? "text-teal-700 dark:text-teal-400 font-black" : "text-slate-400 dark:text-slate-500",
                "group-hover:text-teal-600 dark:group-hover:text-teal-400"
              )}>
                {row.label}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
