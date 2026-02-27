"use client"

import { cn } from "@/lib/utils"
import type { ContributionMapData, NodeData } from "@/lib/types"
import { Plus, GitBranch } from "lucide-react"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/empty-state"

interface ContributionMapProps {
  data: ContributionMapData
  editMode?: "view" | "edit" | "colour" | "order" | "delete"
  onCellClick?: (valueChainId: string, outcomeId: string) => void
  onElementClick?: (node: NodeData) => void
}

export function ContributionMap({
  data,
  editMode = "view",
  onCellClick,
  onElementClick,
}: ContributionMapProps) {
  const { outcomes, valueChain, valueChainKpis, outcomeKpis, cells } = data

  // Get KPIs for a specific Value Chain row (vertical KPIs in column C)
  const getVcKpis = (valueChainId: string): string[] => {
    const vcKpi = valueChainKpis.find((k) => k.valueChainId === valueChainId)
    return vcKpi?.kpis || []
  }

  // Get KPIs for a specific Outcome (horizontal KPIs in row 3)
  const getOutcomeKpis = (outcomeId: string): string[] => {
    const oKpi = outcomeKpis?.find((k) => k.outcomeId === outcomeId)
    return oKpi?.kpis || []
  }

  // Get cell content for VC × Outcome intersection
  const getCellContent = (valueChainId: string, outcomeId: string): string => {
    const cell = cells.find(
      (c) => c.valueChainId === valueChainId && c.outcomeId === outcomeId
    )
    return cell?.content || ""
  }

  if (outcomes.length === 0 && valueChain.length === 0) {
    return (
      <EmptyState
        icon={GitBranch}
        title="No data yet"
        description="Your Contribution Map will appear once you have elements in your Logic Model."
      />
    )
  }

  const cultureBannerText =
    "Delivered in a transparent, respectful culture of local collaboration with a focus on sustainable operational outcomes, performance & societal benefits"

  return (
    <div id="view-contribution-map" className="map-scroll-wrapper">
      <table className="min-w-[1200px] w-full border-collapse border border-border rounded-lg overflow-hidden table-fixed">
        <thead>
          {/* Row 1: "Objectives" header spanning objective columns */}
          <tr>
            <th className="w-[60px] p-3 border border-border bg-muted/50 dark:bg-muted/30 sticky left-0 z-30"></th>
            <th className="w-[200px] p-3 border border-border bg-muted/50 dark:bg-muted/30 sticky left-[60px] z-30"></th>
            <th className="w-[200px] p-3 border border-border bg-muted/50 dark:bg-muted/30"></th>
            <th
              colSpan={outcomes.length}
              className="p-3 text-center border border-border bg-teal-100 dark:bg-teal-900/40"
            >
              <span className="font-bold text-xs text-teal-800 dark:text-teal-200 uppercase tracking-widest">
                Objectives
              </span>
            </th>
          </tr>

          {/* Row 2: Nested Objective titles */}
          <tr>
            <th className="p-3 border border-border bg-background sticky left-0 z-30"></th>
            <th className="p-3 border border-border bg-background sticky left-[60px] z-30"></th>
            <th className="p-3 border border-border bg-background"></th>
            {outcomes.map((outcome, idx) => (
              <th
                key={outcome.id}
                className="p-3 text-center border border-border bg-teal-50 dark:bg-teal-900/20 cursor-pointer hover:bg-teal-100 dark:hover:bg-teal-800/30 transition-colors"
                onClick={() => onElementClick?.(outcome)}
              >
                <span className="text-[10px] text-teal-600 dark:text-teal-400 mb-1 block font-bold uppercase tracking-wider">
                  Objective {idx + 1}
                </span>
                <span className="font-semibold text-sm text-foreground line-clamp-2">{outcome.title}</span>
              </th>
            ))}
          </tr>

          {/* Row 3: Horizontal Key Results for each Objective */}
          <tr className="h-24">
            <th className="p-3 border border-border bg-background sticky left-0 z-30"></th>
            <th className="p-3 border border-border bg-background sticky left-[60px] z-30"></th>
            <th className="bg-emerald-600 dark:bg-emerald-700 p-3 text-white text-center font-bold text-xs border border-border uppercase tracking-widest">
              Key Results
            </th>
            {outcomes.map((outcome) => {
              const kpis = getOutcomeKpis(outcome.id)
              const kpiText = kpis.length > 0 ? kpis.join("; ") : "—"

              return (
                <td
                  key={`kpi-${outcome.id}`}
                  className="bg-emerald-100 dark:bg-emerald-900/40 p-3 border border-border text-left cursor-pointer hover:bg-emerald-200 dark:hover:bg-emerald-800/40 transition-colors align-top"
                  onClick={() => onElementClick?.({
                    id: `outcome-kpi-${outcome.id}`,
                    title: `Key Results: ${outcome.title}`,
                    description: kpis.length > 0 ? kpis.join("\n") : "No Key Results defined.",
                    kpiValue: outcome.kpiValue,
                    kpiStatus: outcome.kpiStatus,
                    category: "outcomes",
                    color: "secondary",
                    notes: "Objective Key Results from Contribution Map",
                    metadata: {
                      "View": "Contribution Map",
                      "Objective": outcome.title,
                      "Key Results Count": String(kpis.length),
                    },
                  })}
                >
                  {kpis.length > 0 ? (
                    <span className="text-xs font-medium text-emerald-900 dark:text-emerald-100 leading-tight">{kpiText}</span>
                  ) : editMode === "edit" ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full h-full min-h-[32px] border border-dashed border-emerald-400/50 text-emerald-600 hover:bg-emerald-200/50"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      <span className="text-[10px] uppercase font-bold">Add</span>
                    </Button>
                  ) : (
                    <span className="text-sm text-emerald-800 dark:text-emerald-300">—</span>
                  )}
                </td>
              )
            })}
          </tr>
        </thead>

        <tbody>
          {/* Value Chain Rows */}
          {valueChain.map((vc, vcIdx) => {
            const vcKpiList = getVcKpis(vc.id)
            const vcKpiText = vcKpiList.length > 0 ? vcKpiList.join(". ") : ""

            return (
              <tr key={vc.id} className="h-28">
                {/* Column A: Value Chain vertical label - only on first row, spans all VC rows */}
                {vcIdx === 0 && (
                  <td
                    rowSpan={valueChain.length}
                    className="bg-muted/50 dark:bg-muted/30 border border-border text-center align-middle sticky left-0 z-20"
                  >
                    <span
                      className="text-xs font-bold text-muted-foreground uppercase tracking-widest whitespace-nowrap"
                      style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
                    >
                      Value Chain
                    </span>
                  </td>
                )}

                {/* Column B: VC Element Name */}
                <td
                  className="bg-card dark:bg-card/80 p-3 border border-border align-top cursor-pointer sticky left-[60px] z-20 premium-hover glass-card-hover"
                  onClick={() => onElementClick?.(vc)}
                >
                  <span className="text-[10px] font-bold text-muted-foreground bg-muted dark:bg-muted/50 px-1.5 py-0.5 rounded mr-2 uppercase tracking-tighter">
                    VC {vcIdx + 1}
                  </span>
                  <span className="text-sm font-semibold text-foreground block mt-1 leading-snug">{vc.title}</span>
                </td>

                {/* Column C: Key Results for this VC element (vertical) */}
                <td
                  className="bg-emerald-50 dark:bg-emerald-900/20 p-3 border border-border align-top cursor-pointer premium-hover hover:bg-emerald-100 dark:hover:bg-emerald-800/30"
                  onClick={() => onElementClick?.({
                    id: `vc-kpi-${vc.id}`,
                    title: `Key Results: ${vc.title}`,
                    description: vcKpiText || "No Key Results defined.",
                    kpiValue: vc.kpiValue,
                    kpiStatus: vc.kpiStatus,
                    category: "value-chain",
                    color: "secondary",
                    notes: "Value Chain Key Results from Contribution Map",
                    metadata: {
                      "View": "Contribution Map",
                      "Value Chain Element": vc.title,
                      "Key Results Count": String(vcKpiList.length),
                    },
                  })}
                >
                  {vcKpiText ? (
                    <span className="text-xs font-medium text-emerald-900 dark:text-emerald-100 leading-tight">{vcKpiText}</span>
                  ) : editMode === "edit" ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full h-full min-h-[32px] border border-dashed border-emerald-400/50 text-emerald-600 hover:bg-emerald-100/50"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      <span className="text-[10px] font-bold uppercase tracking-widest leading-none mt-0.5">Add</span>
                    </Button>
                  ) : (
                    <span className="text-sm text-emerald-800 dark:text-emerald-300">—</span>
                  )}
                </td>

                {/* Columns D+: Contribution Cells - one for each outcome */}
                {outcomes.map((outcome) => {
                  const content = getCellContent(vc.id, outcome.id)

                  return (
                    <td
                      key={`${vc.id}-${outcome.id}`}
                      className={cn(
                        "bg-card dark:bg-card/60 p-3 border border-border min-h-[60px] align-top",
                        "premium-hover glass-card-hover cursor-pointer"
                      )}
                      onClick={() => onCellClick?.(vc.id, outcome.id)}
                    >
                      {content ? (
                        <span className="text-xs text-muted-foreground leading-relaxed italic line-clamp-4">{content}</span>
                      ) : editMode === "edit" ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full h-full min-h-[32px] border border-dashed border-gray-400 text-gray-500 hover:bg-accent/20"
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          <span className="text-[10px] font-bold uppercase">Add</span>
                        </Button>
                      ) : (
                        <span className="text-sm text-muted-foreground">—</span>
                      )}
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>

        {/* Culture Row */}
        <tfoot>
          <tr>
            <td
              colSpan={3 + outcomes.length}
              className="bg-primary/90 backdrop-blur-sm text-primary-foreground p-5 border border-border shadow-inner"
            >
              <span className="text-[11px] text-white/70 uppercase tracking-[0.2em] block mb-2 font-black">
                DELIVERY CULTURE / DIMENSION
              </span>
              <p className="text-white text-md font-medium leading-relaxed max-w-4xl">{cultureBannerText}</p>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  )
}
