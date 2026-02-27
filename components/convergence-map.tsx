"use client"

import { cn } from "@/lib/utils"
import type { ConvergenceMapData, NodeData } from "@/lib/types"
import { Plus, Target, Trash2, Palette } from "lucide-react"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/empty-state"

interface ConvergenceMapProps {
  data: ConvergenceMapData
  editMode?: "view" | "edit" | "colour" | "order" | "delete"
  onCellClick?: (valueChainId: string, externalFactorId: string) => void
  onElementClick?: (node: NodeData) => void
}

export function ConvergenceMap({
  data,
  editMode = "view",
  onCellClick,
  onElementClick,
}: ConvergenceMapProps) {
  const { externalFactors, valueChain, cells, kpis, factorsPerVC } = data

  // Get factor content for a specific Value Chain by ID
  const getVcFactor = (valueChainId: string): string => {
    const factor = factorsPerVC?.find((f) => f.valueChainId === valueChainId)
    return factor?.content || ""
  }

  // Get KPIs for a specific Value Chain
  const getVcKpis = (valueChainId: string): string[] => {
    const vcKpi = kpis.find((k) => k.valueChainId === valueChainId)
    return vcKpi?.kpis || []
  }

  // Get cell content for VC × External Factor intersection
  const getCellContent = (valueChainId: string, externalFactorId: string): string => {
    const cell = cells.find(
      (c) => c.valueChainId === valueChainId && c.externalFactorId === externalFactorId
    )
    return cell?.content || ""
  }

  if (externalFactors.length === 0 && valueChain.length === 0) {
    return (
      <EmptyState
        icon={Target}
        title="No data yet"
        description="The Convergence Map shows strategic alignment. Build your system to see it here."
      />
    )
  }

  return (
    <div id="view-convergence-map" className="map-scroll-wrapper">
      <table className="min-w-[1000px] w-full border-collapse text-sm border border-border table-fixed">
        <thead>
          {/* Row 1: Section Headers */}
          <tr>
            <th className="border border-border bg-slate-100 dark:bg-slate-900/80 p-4 text-left font-black text-slate-800 dark:text-slate-100 uppercase tracking-widest text-xs w-[50%] sticky left-0 z-30 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
              Value Chain
            </th>
            <th
              colSpan={2}
              className="border border-border bg-emerald-700 p-3 text-center"
            >
              <span className="font-black text-xs text-emerald-100 uppercase tracking-[0.2em]">
                External Factors & Targets
              </span>
            </th>
          </tr>

          {/* Row 2: Titles */}
          <tr>
            <th className="border border-border bg-slate-50 dark:bg-slate-900/30 p-2 text-left sticky left-0 z-30 bg-slate-50 dark:bg-slate-900 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-2">Elements</span>
            </th>
            <th className="border border-border bg-slate-100 dark:bg-slate-800 p-3 text-center w-[15%]">
              <span className="font-bold text-xs uppercase tracking-tight text-slate-700 dark:text-slate-300">Factors</span>
            </th>
            <th className="border border-border bg-emerald-200 dark:bg-emerald-900/50 p-3 text-center w-[35%]">
              <span className="font-bold text-xs uppercase tracking-tight text-emerald-900 dark:text-emerald-200">KPIs</span>
            </th>
          </tr>

          {/* Row 3: Sub-labels */}
          <tr>
            <td className="border border-border bg-slate-50/5 p-2 sticky left-0 z-30 bg-background/50 backdrop-blur-sm shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]"></td>
            <td className="border border-border bg-slate-50/50 dark:bg-slate-900/20 p-2 text-center text-slate-400 italic text-[9px] font-bold uppercase tracking-widest">
              Influences
            </td>
            <td className="border border-border bg-emerald-50/30 dark:bg-emerald-900/10 p-2 text-center text-emerald-500/80 italic text-[9px] font-bold uppercase tracking-widest">
              Targets
            </td>
          </tr>
        </thead>

        <tbody>
          {/* Value Chain rows */}
          {valueChain.map((vc, vcIdx) => {
            const vcKpiList = getVcKpis(vc.id)
            const vcKpiText = vcKpiList.length > 0 ? vcKpiList.join(". ") : ""

            return (
              <tr key={vc.id} className="h-24">
                {/* Column A: VC Element name */}
                <td
                  className={cn(
                    "border border-border p-4 cursor-pointer align-top sticky left-0 z-20 bg-background",
                    "premium-hover glass-card-hover shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]",
                    editMode === "delete" ? "hover:bg-red-50/50 dark:hover:bg-red-950/20" :
                      editMode === "colour" ? "hover:bg-amber-50/50 dark:hover:bg-amber-950/20" : ""
                  )}
                  onClick={() => onElementClick?.(vc)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <span className="text-[10px] font-black text-muted-foreground bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded uppercase self-start mt-0.5 border border-border/50 tracking-tighter shadow-sm">
                        VC-{vcIdx + 1}
                      </span>
                      <span className="text-sm text-foreground font-semibold leading-relaxed line-clamp-2">{vc.title}</span>
                    </div>
                    {editMode === "delete" && (
                      <Trash2 className="h-4 w-4 text-red-500 mt-0.5 shrink-0 animate-in fade-in zoom-in duration-200" />
                    )}
                    {editMode === "colour" && (
                      <Palette className="h-4 w-4 text-amber-500 mt-0.5 shrink-0 animate-in fade-in zoom-in duration-200" />
                    )}
                  </div>
                </td>

                {/* Column B: Factors for this VC (Grey) */}
                <td
                  className="border border-border bg-slate-50/50 dark:bg-slate-900/30 p-3 text-xs text-slate-600 dark:text-slate-300 cursor-pointer premium-hover hover:bg-slate-100/50 align-top leading-tight"
                  onClick={() => {
                    const factorContent = getVcFactor(vc.id)
                    onElementClick?.({
                      id: `vc-factor-${vc.id}`,
                      title: `Factors: ${vc.title}`,
                      description: factorContent || "No factors defined for this value chain element.",
                      kpiValue: vc.kpiValue,
                      kpiStatus: vc.kpiStatus,
                      category: "value-chain",
                      color: "muted",
                      notes: "Value chain factors from Convergence Map",
                      metadata: {
                        "View": "Convergence Map",
                        "Value Chain Element": vc.title,
                        "Type": "VC Factors",
                      },
                    })
                  }}
                >
                  <p className="italic leading-relaxed">{getVcFactor(vc.id) || "—"}</p>
                </td>

                {/* Column C: KPIs (Emerald) */}
                <td
                  className="border border-border bg-emerald-50/40 dark:bg-emerald-900/20 p-3 text-xs text-emerald-800 dark:text-emerald-300 cursor-pointer premium-hover hover:bg-emerald-100/50 align-top leading-relaxed"
                  onClick={() => onElementClick?.({
                    id: `vc-kpi-${vc.id}`,
                    title: `KPIs: ${vc.title}`,
                    description: vcKpiText || "No KPIs defined.",
                    kpiValue: vc.kpiValue,
                    kpiStatus: vc.kpiStatus,
                    category: "value-chain",
                    color: "secondary",
                    notes: "Value Chain KPIs from Convergence Map",
                    metadata: {
                      "View": "Convergence Map",
                      "Value Chain Element": vc.title,
                      "KPIs Count": String(vcKpiList.length),
                    },
                  })}
                >
                  {vcKpiText ? (
                    <p className="font-medium text-emerald-950 dark:text-emerald-50 leading-tight">{vcKpiText}</p>
                  ) : editMode === "edit" ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full h-full min-h-[32px] border border-dashed border-emerald-300/50 text-emerald-600 hover:bg-emerald-100/40"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">Add</span>
                    </Button>
                  ) : (
                    <span className="text-sm opacity-50">—</span>
                  )}
                </td>
              </tr>
            )
          })}

          {/* Culture row */}
          <tr>
            <td
              colSpan={3}
              className="border border-border bg-primary/95 text-primary-foreground p-6 text-sm text-center shadow-inner backdrop-blur-md"
            >
              <span className="text-[11px] text-white/60 uppercase tracking-[0.3em] block mb-2 font-black">
                VALUES & CULTURE
              </span>
              <p className="font-medium text-md leading-relaxed max-w-5xl mx-auto italic">
                Delivered through partnerships in a transparent, respectful culture of local collaboration with a focus on sustainable operational outcomes, performance & societal benefits
              </p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
