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
    <div id="view-contribution-map" className="w-full overflow-x-auto">
      <table className="min-w-[1200px] w-full border-collapse border border-border rounded-lg overflow-hidden">
        <thead>
          {/* Row 1: "Objectives" header spanning objective columns */}
          <tr>
            <th className="w-[80px] p-3 border border-border bg-muted/50 dark:bg-muted/30"></th>
            <th className="w-[200px] p-3 border border-border bg-muted/50 dark:bg-muted/30"></th>
            <th className="w-[200px] p-3 border border-border bg-muted/50 dark:bg-muted/30"></th>
            <th
              colSpan={outcomes.length}
              className="p-3 text-center border border-border bg-teal-100 dark:bg-teal-900/40"
            >
              <span className="font-semibold text-sm text-teal-800 dark:text-teal-200 uppercase tracking-wider">
                Objectives
              </span>
            </th>
          </tr>

          {/* Row 2: Nested Objective titles */}
          <tr>
            <th className="p-3 border border-border bg-background"></th>
            <th className="p-3 border border-border bg-background"></th>
            <th className="p-3 border border-border bg-background"></th>
            {outcomes.map((outcome, idx) => (
              <th
                key={outcome.id}
                className="p-3 text-center border border-border bg-teal-50 dark:bg-teal-900/20 cursor-pointer hover:bg-teal-100 dark:hover:bg-teal-800/30 transition-colors"
                onClick={() => onElementClick?.(outcome)}
              >
                <span className="text-sm text-teal-600 dark:text-teal-400 mb-1 block font-normal">
                  Objective {idx + 1}
                </span>
                <span className="font-medium text-sm text-foreground">{outcome.title}</span>
              </th>
            ))}
          </tr>

          {/* Row 3: Horizontal Key Results for each Objective */}
          <tr>
            <th className="p-3 border border-border bg-background"></th>
            <th className="p-3 border border-border bg-background"></th>
            <th className="bg-emerald-600 dark:bg-emerald-700 p-3 text-white text-center font-semibold text-sm border border-border">
              Key Results
            </th>
            {outcomes.map((outcome) => {
              const kpis = getOutcomeKpis(outcome.id)
              const kpiText = kpis.length > 0 ? kpis.join("; ") : "—"

              return (
                <td
                  key={`kpi-${outcome.id}`}
                  className="bg-emerald-100 dark:bg-emerald-900/40 p-3 border border-border text-left cursor-pointer hover:bg-emerald-200 dark:hover:bg-emerald-800/40 transition-colors"
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
                    <span className="text-sm text-emerald-800 dark:text-emerald-300">{kpiText}</span>
                  ) : editMode === "edit" ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full h-full min-h-[32px] border border-dashed border-gray-400 text-gray-500"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      <span className="text-xs">Add Key Result</span>
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
              <tr key={vc.id}>
                {/* Column A: Value Chain vertical label - only on first row, spans all VC rows */}
                {vcIdx === 0 && (
                  <td
                    rowSpan={valueChain.length}
                    className="bg-muted/50 dark:bg-muted/30 border border-border text-center align-middle"
                  >
                    <span
                      className="text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap"
                      style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
                    >
                      Value Chain
                    </span>
                  </td>
                )}

                {/* Column B: VC Element Name */}
                <td
                  className="bg-card dark:bg-card/80 p-3 border border-border align-top cursor-pointer hover:bg-muted/50 dark:hover:bg-muted/20 transition-colors"
                  onClick={() => onElementClick?.(vc)}
                >
                  <span className="text-xs text-muted-foreground mb-1 block">VC {vcIdx + 1}</span>
                  <span className="text-sm text-foreground">{vc.title}</span>
                </td>

                {/* Column C: Key Results for this VC element (vertical) */}
                <td
                  className="bg-emerald-100 dark:bg-emerald-900/30 p-3 border border-border align-top cursor-pointer hover:bg-emerald-200 dark:hover:bg-emerald-800/30 transition-colors"
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
                    <span className="text-sm text-emerald-800 dark:text-emerald-300">{vcKpiText}</span>
                  ) : editMode === "edit" ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full h-full min-h-[32px] border border-dashed border-gray-400 text-gray-500"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      <span className="text-xs">Add Key Result</span>
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
                        "hover:bg-muted/50 dark:hover:bg-muted/20 transition-colors cursor-pointer"
                      )}
                      onClick={() => onCellClick?.(vc.id, outcome.id)}
                    >
                      {content ? (
                        <span className="text-sm text-muted-foreground">{content}</span>
                      ) : editMode === "edit" ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full h-full min-h-[32px] border border-dashed border-gray-400 text-gray-500"
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          <span className="text-xs">Add</span>
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
              className="bg-teal-700 text-white p-4 border border-border"
            >
              <span className="text-sm text-teal-200 uppercase tracking-wider block mb-1 font-semibold">
                DELIVERY CULTURE / DIMENSION
              </span>
              <p className="text-white text-sm">{cultureBannerText}</p>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  )
}
