"use client"

import { cn } from "@/lib/utils"
import type { ConvergenceMapData, NodeData } from "@/lib/types"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

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

  return (
    <div id="view-convergence-map" className="w-full overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          {/* Row 1: External Value Chain header */}
          <tr>
            <th className="border border-border bg-muted/50 dark:bg-muted/30 p-3 w-16"></th>
            <th className="border border-border bg-muted/50 dark:bg-muted/30 p-3 w-48"></th>
            <th className="border border-border bg-muted/50 dark:bg-muted/30 p-3 w-40"></th>
            <th
              colSpan={externalFactors.length}
              className="border border-border bg-purple-200 dark:bg-purple-900/50 p-3 text-center font-semibold text-purple-900 dark:text-purple-200"
            >
              INFLUENCES
            </th>
            <th className="border border-border bg-muted/50 dark:bg-muted/30 p-3 w-48"></th>
          </tr>

          {/* Row 2: Individual external factor headers */}
          <tr>
            <th className="border border-border bg-muted/50 dark:bg-muted/30 p-3"></th>
            <th className="border border-border bg-muted/50 dark:bg-muted/30 p-3"></th>
            <th className="border border-border bg-muted/50 dark:bg-muted/30 p-3"></th>
            {externalFactors.map((factor, idx) => (
              <th
                key={factor.id}
                className="border border-border bg-purple-100 dark:bg-purple-900/30 p-3 text-center min-w-[120px] cursor-pointer hover:bg-purple-200 dark:hover:bg-purple-800/30 transition-colors"
                onClick={() => onElementClick?.({
                  id: factor.id,
                  title: factor.title,
                  description: factor.description || "No description.",
                  kpiValue: 0,
                  kpiStatus: "healthy",
                  category: "outcomes",
                  color: "muted",
                  notes: "External factor from Convergence Map",
                  metadata: {
                    "View": "Convergence Map",
                    "Type": "External Factor",
                  },
                })}
              >
                <span className="text-sm text-purple-700 dark:text-purple-400 block mb-1">
                  Factor {idx + 1}
                </span>
                <span className="text-sm font-medium text-foreground">{factor.title}</span>
              </th>
            ))}
            <th className="border border-border bg-emerald-200 dark:bg-emerald-900/50 p-3 text-center font-semibold text-emerald-900 dark:text-emerald-200">
              Key Results
            </th>
          </tr>

          {/* Row 3: Factors description row */}
          <tr>
            <td className="border border-border bg-muted/50 dark:bg-muted/30 p-3"></td>
            <td className="border border-border bg-muted/50 dark:bg-muted/30 p-3"></td>
            <td className="border border-border bg-violet-200 dark:bg-violet-900/50 p-3 text-center font-semibold text-violet-900 dark:text-violet-200">
              Factors
            </td>
            {externalFactors.map((factor) => (
              <td
                key={`desc-${factor.id}`}
                className="border border-border bg-violet-100 dark:bg-violet-900/30 p-2 text-sm text-violet-900 dark:text-violet-200 cursor-pointer hover:bg-violet-200 dark:hover:bg-violet-800/30 transition-colors"
                onClick={() => onElementClick?.({
                  id: `factor-desc-${factor.id}`,
                  title: `Factors: ${factor.title}`,
                  description: factor.description || "No factors defined.",
                  kpiValue: 0,
                  kpiStatus: "healthy",
                  category: "outcomes",
                  color: "muted",
                  notes: "Factor description from Convergence Map",
                  metadata: {
                    "View": "Convergence Map",
                    "External Factor": factor.title,
                    "Type": "Factor Description",
                  },
                })}
              >
                {factor.description || "—"}
              </td>
            ))}
            <td className="border border-border bg-emerald-100 dark:bg-emerald-900/30 p-2"></td>
          </tr>
        </thead>

        <tbody>
          {/* Value Chain rows */}
          {valueChain.map((vc, vcIdx) => {
            const vcKpiList = getVcKpis(vc.id)
            const vcKpiText = vcKpiList.length > 0 ? vcKpiList.join(". ") : ""

            return (
              <tr key={vc.id}>
                {/* Column A: Value Chain vertical label (only on first row) */}
                {vcIdx === 0 && (
                  <td
                    rowSpan={valueChain.length + 1}
                    className="border border-border bg-muted/50 dark:bg-muted/30 p-2 w-16 align-middle"
                  >
                    <div
                      className="font-semibold text-xs text-muted-foreground tracking-wider whitespace-nowrap"
                      style={{
                        writingMode: "vertical-rl",
                        transform: "rotate(180deg)",
                        textAlign: "center",
                      }}
                    >
                      VALUE CHAIN
                    </div>
                  </td>
                )}

                {/* Column B: VC Element name */}
                <td
                  className="border border-border bg-card dark:bg-card/80 p-2 min-w-[180px] cursor-pointer hover:bg-muted/50 dark:hover:bg-muted/20 transition-colors align-top"
                  onClick={() => onElementClick?.(vc)}
                >
                  <span className="text-sm text-muted-foreground bg-muted dark:bg-muted/50 px-1.5 py-0.5 rounded mr-2">
                    VC-{vcIdx + 1}
                  </span>
                  <span className="text-sm text-foreground">{vc.title}</span>
                </td>

                {/* Column C: Factors for this VC */}
                <td
                  className="border border-border bg-violet-100 dark:bg-violet-900/30 p-2 text-sm text-violet-900 dark:text-violet-200 min-w-[140px] cursor-pointer hover:bg-violet-200 dark:hover:bg-violet-800/30 transition-colors align-top"
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
                  {getVcFactor(vc.id) || "—"}
                </td>

                {/* Columns D-L: Matrix cells (VC × External Factor intersections) */}
                {externalFactors.map((factor) => {
                  const content = getCellContent(vc.id, factor.id)

                  return (
                    <td
                      key={`${vc.id}-${factor.id}`}
                      className={cn(
                        "border border-border bg-card dark:bg-card/60 p-2 text-sm text-foreground transition-colors cursor-pointer align-top",
                        "hover:bg-muted/50 dark:hover:bg-muted/20"
                      )}
                      onClick={() => onCellClick?.(vc.id, factor.id)}
                    >
                      {content ? (
                        <span>{content}</span>
                      ) : editMode === "edit" ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full h-full min-h-[40px] border border-dashed border-gray-400 text-gray-500"
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          <span className="text-xs">Add</span>
                        </Button>
                      ) : (
                        <span>—</span>
                      )}
                    </td>
                  )
                })}

                {/* Column M: Key Results */}
                <td
                  className="border border-border bg-emerald-100 dark:bg-emerald-900/30 p-2 text-sm text-emerald-800 dark:text-emerald-300 cursor-pointer hover:bg-emerald-200 dark:hover:bg-emerald-800/30 transition-colors align-top"
                  onClick={() => onElementClick?.({
                    id: `vc-kpi-${vc.id}`,
                    title: `Key Results: ${vc.title}`,
                    description: vcKpiText || "No Key Results defined.",
                    kpiValue: vc.kpiValue,
                    kpiStatus: vc.kpiStatus,
                    category: "value-chain",
                    color: "secondary",
                    notes: "Value Chain Key Results from Convergence Map",
                    metadata: {
                      "View": "Convergence Map",
                      "Value Chain Element": vc.title,
                      "Key Results Count": String(vcKpiList.length),
                    },
                  })}
                >
                  {vcKpiText || (editMode === "edit" ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full h-full min-h-[40px] border border-dashed border-gray-400 text-gray-500"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      <span className="text-xs">Add Key Result</span>
                    </Button>
                  ) : "—")}
                </td>
              </tr>
            )
          })}

          {/* Culture row */}
          <tr>
            <td
              colSpan={3}
              className="border border-border bg-teal-700 text-white p-3 text-sm text-center"
            >
              Delivered through partnerships in a transparent, respectful culture of local collaboration with a focus on sustainable operational outcomes, performance & societal benefits
            </td>
            {externalFactors.map((factor) => (
              <td
                key={`culture-${factor.id}`}
                className="border border-border bg-teal-600/50 p-2"
              ></td>
            ))}
            <td className="border border-border bg-teal-600/50 p-2"></td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
