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
  // Heights calculated from: margin-top + h2 height/margin + content height
  const logicRows = [
    { id: "purpose", label: "PURPOSE", height: "h-[132px]", textOffset: "pt-[86px]" },      // mt-8(32) + h2(20) + mb-2(8) + banner-center(36) = 96. pt-86(text~20)
    { id: "outcomes", label: "OBJECTIVES", height: "h-[300px]", textOffset: "pt-[170px]" },   // mt-8(32) + h2(20) + mb-2(8) + card-center(120) = 180. pt-170
    { id: "value-chain", label: "VALUE CHAIN", height: "h-[200px]", textOffset: "pt-[120px]" }, // mt-8(32) + h2(20) + mb-2(8) + card-center(70) = 130. pt-120
    { id: "culture", label: "CULTURE", height: "h-[132px]", textOffset: "pt-[86px]" },  // same as purpose
    { id: "resources", label: "RESOURCES", height: "h-[200px]", textOffset: "pt-[120px]" }, // same as value-chain
    { id: "context", label: "CONTEXT", height: "h-[132px]", textOffset: "pt-[86px]" },    // same as context
  ]

  // Define section groups for the outer column (Brackets)
  const sections = [
    {
      id: "strategic-intent",
      label: "Strategic Intent",
      height: "h-[432px]", // 132 + 300
    },
    {
      id: "operations",
      label: "Operations",
      height: "h-[664px]", // 200 + 132 + 200 + 132
    },
  ]

  return (
    <div className="flex shrink-0 z-10 select-none">
      {/* Outer Vertical Labels Column */}
      <div className="flex flex-col bg-slate-200/50 dark:bg-slate-900/50 backdrop-blur-md border-r border-slate-300 dark:border-slate-800">
        {sections.map((section) => (
          <div
            key={section.id}
            className={cn(
              "w-14 flex items-center justify-center relative transition-all duration-300",
              "border-b border-slate-300 dark:border-slate-800 last:border-b-0",
              section.height
            )}
          >
            {/* Elegant Bracket Line */}
            <div className="absolute left-2 top-8 bottom-8 w-[2px] bg-slate-400 dark:bg-slate-600 rounded-full" />
            <div className="absolute left-2 top-8 w-4 h-[2px] bg-slate-400 dark:bg-slate-600 rounded-full" />
            <div className="absolute left-2 bottom-8 w-4 h-[2px] bg-slate-400 dark:bg-slate-600 rounded-full" />

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

      {/* Inner Row Labels Column */}
      <div className="flex flex-col bg-slate-100/40 dark:bg-slate-800/20 backdrop-blur-sm border-r border-slate-300 dark:border-slate-800">
        {logicRows.map((row) => (
          <button
            key={row.id}
            onClick={() => onRowClick(row.id)}
            className={cn(
              "w-36 px-4 flex flex-col items-center transition-all duration-200",
              "border-b border-slate-300/30 dark:border-slate-700/50 last:border-b-0",
              "hover:bg-teal-500/10 dark:hover:bg-teal-500/5 group text-center",
              activeRow === row.id && "bg-teal-500/5 dark:bg-teal-500/10",
              row.height,
              row.textOffset
            )}
          >
            <span className={cn(
              "text-xs font-black uppercase tracking-widest transition-colors duration-200",
              activeRow === row.id ? "text-teal-700 dark:text-teal-400 font-black" : "text-slate-400 dark:text-slate-500",
              "group-hover:text-teal-600 dark:group-hover:text-teal-400"
            )}>
              {row.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
