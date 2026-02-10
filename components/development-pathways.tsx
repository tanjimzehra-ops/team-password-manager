"use client"

import { cn } from "@/lib/utils"
import type { DevelopmentPathwaysData, NodeData } from "@/lib/types"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

interface DevelopmentPathwaysProps {
  data: DevelopmentPathwaysData
  editMode?: "view" | "edit" | "colour" | "order" | "delete"
  onCellClick?: (valueChainId: string, resourceId: string) => void
  onElementClick?: (node: NodeData) => void
}

export function DevelopmentPathways({
  data,
  editMode = "view",
  onCellClick,
  onElementClick,
}: DevelopmentPathwaysProps) {
  const {
    resources,
    valueChain,
    currentCapabilitiesPerResource,
    currentCapabilitiesPerVC,
    necessaryCapabilities,
    cells,
    kpis,
    dimension,
  } = data

  // Get KPIs for a specific Value Chain by ID
  const getVcKpis = (valueChainId: string): string[] => {
    const vcKpi = kpis.find((k) => k.valueChainId === valueChainId)
    return vcKpi?.kpis || []
  }

  // Get cell content for VC × Resource intersection
  const getCellContent = (valueChainId: string, resourceId: string): string => {
    const cell = cells.find(
      (c) => c.valueChainId === valueChainId && c.resourceId === resourceId
    )
    return cell?.content || ""
  }

  // Get current capability for Resource (horizontal row under headers)
  const getCurrentCapForResource = (resourceIndex: number): string => {
    const cap = currentCapabilitiesPerResource[resourceIndex]
    return cap?.content || ""
  }

  // Get current capability for Value Chain row (vertical column)
  const getCurrentCapForVC = (vcIndex: number): string => {
    const cap = currentCapabilitiesPerVC[vcIndex]
    return cap?.content || ""
  }

  // Get necessary capability for a Resource (horizontal row at bottom)
  const getNecessaryCapability = (resourceIndex: number): string => {
    const cap = necessaryCapabilities[resourceIndex]
    return cap?.content || ""
  }

  return (
    <div id="view-development-pathways" className="w-full overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          {/* Row 1: Resources/Capability header */}
          <tr>
            <th className="border border-border bg-muted/50 dark:bg-muted/30 p-3 w-16"></th>
            <th className="border border-border bg-muted/50 dark:bg-muted/30 p-3 w-48"></th>
            <th className="border border-border bg-muted/50 dark:bg-muted/30 p-3 w-40"></th>
            <th
              colSpan={resources.length}
              className="border border-border bg-amber-200 dark:bg-amber-900/50 p-3 text-center font-semibold text-amber-900 dark:text-amber-200"
            >
              RESOURCES, CAPABILITIES / LEVERS
            </th>
            <th className="border border-border bg-muted/50 dark:bg-muted/30 p-3 w-48"></th>
          </tr>

          {/* Row 2: Individual resource headers */}
          <tr>
            <th className="border border-border bg-muted/50 dark:bg-muted/30 p-3"></th>
            <th className="border border-border bg-muted/50 dark:bg-muted/30 p-3"></th>
            <th className="border border-border bg-muted/50 dark:bg-muted/30 p-3"></th>
            {resources.map((resource, idx) => (
              <th
                key={resource.id}
                className="border border-border bg-amber-100 dark:bg-amber-900/30 p-3 text-center min-w-[120px] cursor-pointer hover:bg-amber-200 dark:hover:bg-amber-800/30 transition-colors"
                onClick={() => onElementClick?.(resource)}
              >
                <span className="text-sm text-amber-700 dark:text-amber-400 block mb-1">
                  Resource {idx + 1}
                </span>
                <span className="text-sm font-medium text-foreground">{resource.title}</span>
              </th>
            ))}
            <th className="border border-border bg-emerald-200 dark:bg-emerald-900/50 p-3 text-center font-semibold text-emerald-900 dark:text-emerald-200">
              Key Results
            </th>
          </tr>

          {/* Row 3: Current Capabilities horizontal row */}
          <tr>
            <td className="border border-border bg-muted/50 dark:bg-muted/30 p-3"></td>
            <td className="border border-border bg-muted/50 dark:bg-muted/30 p-3"></td>
            <td className="border border-border bg-sky-200 dark:bg-sky-900/50 p-3 text-center font-semibold text-sky-900 dark:text-sky-200">
              Current Capabilities
            </td>
            {resources.map((resource, idx) => {
              const content = getCurrentCapForResource(idx)
              return (
                <td
                  key={`cap-${resource.id}`}
                  className="border border-border bg-sky-100 dark:bg-sky-900/30 p-2 text-sm text-sky-900 dark:text-sky-200 cursor-pointer hover:bg-sky-200 dark:hover:bg-sky-800/30 transition-colors"
                  onClick={() => onElementClick?.({
                    id: `curr-cap-res-${resource.id}`,
                    title: `Current Capability: ${resource.title}`,
                    description: content || "No current capability defined.",
                    kpiValue: resource.kpiValue,
                    kpiStatus: resource.kpiStatus,
                    category: "resources",
                    color: "accent",
                    notes: "Current capability for this resource",
                    metadata: {
                      "View": "Development Pathways",
                      "Resource": resource.title,
                      "Type": "Current Capability",
                    },
                  })}
                >
                  {content || "—"}
                </td>
              )
            })}
            <td className="border border-border bg-emerald-100 dark:bg-emerald-900/30 p-2"></td>
          </tr>
        </thead>

        <tbody>
          {/* Value Chain rows */}
          {valueChain.map((vc, vcIdx) => {
            const vcKpiList = getVcKpis(vc.id)
            const vcKpiText = vcKpiList.length > 0 ? vcKpiList.join(". ") : ""
            const currentCapVC = getCurrentCapForVC(vcIdx)

            return (
              <tr key={vc.id}>
                {/* Column A: Value Chain vertical label (only on first row) */}
                {vcIdx === 0 && (
                  <td
                    rowSpan={valueChain.length + 2}
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
                  className="border border-border bg-card dark:bg-card/80 p-2 min-w-[180px] cursor-pointer hover:bg-muted/50 dark:hover:bg-muted/20 transition-colors"
                  onClick={() => onElementClick?.(vc)}
                >
                  <span className="text-sm text-muted-foreground bg-muted dark:bg-muted/50 px-1.5 py-0.5 rounded mr-2">
                    VC {vcIdx + 1}
                  </span>
                  <span className="text-sm text-foreground">{vc.title}</span>
                </td>

                {/* Column C: Current Capabilities for this VC */}
                <td
                  className="border border-border bg-sky-100 dark:bg-sky-900/30 p-2 text-sm text-sky-900 dark:text-sky-200 min-w-[140px] cursor-pointer hover:bg-sky-200 dark:hover:bg-sky-800/30 transition-colors"
                  onClick={() => onElementClick?.({
                    id: `curr-cap-vc-${vc.id}`,
                    title: `Current Capability: ${vc.title}`,
                    description: currentCapVC || "No current capability defined.",
                    kpiValue: vc.kpiValue,
                    kpiStatus: vc.kpiStatus,
                    category: "value-chain",
                    color: "accent",
                    notes: "Current capability for this value chain element",
                    metadata: {
                      "View": "Development Pathways",
                      "Value Chain Element": vc.title,
                      "Type": "Current Capability",
                    },
                  })}
                >
                  {currentCapVC || "—"}
                </td>

                {/* Columns D-L: Matrix cells (VC × Resource intersections) */}
                {resources.map((resource) => {
                  const content = getCellContent(vc.id, resource.id)

                  return (
                    <td
                      key={`${vc.id}-${resource.id}`}
                      className={cn(
                        "border border-border bg-card dark:bg-card/60 p-2 text-sm text-foreground transition-colors cursor-pointer",
                        "hover:bg-muted/50 dark:hover:bg-muted/20"
                      )}
                      onClick={() => onCellClick?.(vc.id, resource.id)}
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
                  className="border border-border bg-emerald-100 dark:bg-emerald-900/30 p-2 text-sm text-emerald-800 dark:text-emerald-300 cursor-pointer hover:bg-emerald-200 dark:hover:bg-emerald-800/30 transition-colors"
                  onClick={() => onElementClick?.({
                    id: `vc-kpi-${vc.id}`,
                    title: `Key Results: ${vc.title}`,
                    description: vcKpiText || "No Key Results defined.",
                    kpiValue: vc.kpiValue,
                    kpiStatus: vc.kpiStatus,
                    category: "value-chain",
                    color: "secondary",
                    notes: "Value Chain Key Results from Development Pathways",
                    metadata: {
                      "View": "Development Pathways",
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

          {/* Necessary Capabilities row */}
          <tr>
            <td className="border border-border bg-orange-200 dark:bg-orange-900/50 p-3 text-center font-semibold text-orange-900 dark:text-orange-200 text-sm">
              Necessary Capabilities
            </td>
            <td className="border border-border bg-orange-100 dark:bg-orange-900/30 p-2"></td>
            {resources.map((resource, idx) => {
              const content = getNecessaryCapability(idx)
              return (
                <td
                  key={`nec-${resource.id}`}
                  className="border border-border bg-orange-100 dark:bg-orange-900/30 p-2 text-sm text-orange-900 dark:text-orange-200 cursor-pointer hover:bg-orange-200 dark:hover:bg-orange-800/30 transition-colors"
                  onClick={() => onElementClick?.({
                    id: `nec-cap-${resource.id}`,
                    title: `Necessary Capability: ${resource.title}`,
                    description: content || "No necessary capability defined.",
                    kpiValue: resource.kpiValue,
                    kpiStatus: resource.kpiStatus,
                    category: "resources",
                    color: "accent",
                    notes: "Necessary capability for this resource",
                    metadata: {
                      "View": "Development Pathways",
                      "Resource": resource.title,
                      "Type": "Necessary Capability",
                    },
                  })}
                >
                  {content || "—"}
                </td>
              )
            })}
            <td className="border border-border bg-orange-100 dark:bg-orange-900/30 p-2"></td>
          </tr>

          {/* Culture row - Delivery Culture/Dimension */}
          <tr>
            <td
              colSpan={2}
              className="border border-border bg-teal-700 text-white p-3 text-sm text-center"
            >
              {dimension || "Delivery Culture"}
            </td>
            {resources.map((resource) => (
              <td
                key={`culture-${resource.id}`}
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
