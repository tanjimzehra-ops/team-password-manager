"use client"

import { cn } from "@/lib/utils"
import type { DevelopmentPathwaysData, NodeData } from "@/lib/types"
import { Plus, Map } from "lucide-react"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/empty-state"

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

  if (resources.length === 0 && valueChain.length === 0) {
    return (
      <EmptyState
        icon={Map}
        title="No data yet"
        description="Development Pathways visualises element relationships. Add elements to your Logic Model first."
      />
    )
  }

  return (
    <div id="view-development-pathways" className="map-scroll-wrapper">
      <table className="min-w-[1300px] w-full border-collapse text-sm table-fixed">
        <thead>
          {/* Row 1: Resources/Capability header */}
          <tr>
            <th className="border border-border bg-muted/50 dark:bg-muted/30 p-3 w-16 sticky left-0 z-30"></th>
            <th className="border border-border bg-muted/50 dark:bg-muted/30 p-3 w-48 sticky left-16 z-30"></th>
            <th className="border border-border bg-muted/50 dark:bg-muted/30 p-3 w-40"></th>
            <th
              colSpan={resources.length}
              className="border border-border bg-amber-200 dark:bg-amber-900/50 p-3 text-center"
            >
              <span className="font-bold text-xs uppercase tracking-widest text-amber-900 dark:text-amber-200">
                RESOURCES, CAPABILITIES / LEVERS
              </span>
            </th>
            <th className="border border-border bg-muted/50 dark:bg-muted/30 p-3 w-48"></th>
          </tr>

          {/* Row 2: Individual resource headers */}
          <tr>
            <th className="border border-border bg-muted/50 dark:bg-muted/30 p-3 sticky left-0 z-30"></th>
            <th className="border border-border bg-muted/50 dark:bg-muted/30 p-3 sticky left-16 z-30"></th>
            <th className="border border-border bg-muted/50 dark:bg-muted/30 p-3"></th>
            {resources.map((resource, idx) => (
              <th
                key={resource.id}
                className="border border-border bg-amber-100 dark:bg-amber-900/30 p-3 text-center min-w-[120px] cursor-pointer hover:bg-amber-200 dark:hover:bg-amber-800/30 transition-colors"
                onClick={() => onElementClick?.(resource)}
              >
                <span className="text-[10px] text-amber-700 dark:text-amber-400 block mb-1 font-bold uppercase tracking-wider">
                  Resource {idx + 1}
                </span>
                <span className="text-sm font-semibold text-foreground line-clamp-2">{resource.title}</span>
              </th>
            ))}
            <th className="border border-border bg-emerald-200 dark:bg-emerald-900/50 p-3 text-center">
              <span className="font-bold text-xs uppercase tracking-widest text-emerald-900 dark:text-emerald-200">
                Key Results
              </span>
            </th>
          </tr>

          {/* Row 3: Current Capabilities horizontal row */}
          <tr className="h-24">
            <td className="border border-border bg-muted/50 dark:bg-muted/30 p-3 sticky left-0 z-30"></td>
            <td className="border border-border bg-muted/50 dark:bg-muted/30 p-3 sticky left-16 z-30"></td>
            <td className="border border-border bg-sky-200 dark:bg-sky-900/50 p-3 text-center align-top">
              <span className="font-bold text-xs uppercase tracking-widest text-sky-900 dark:text-sky-200 leading-tight block pt-2">
                Current Capabilities
              </span>
            </td>
            {resources.map((resource, idx) => {
              const content = getCurrentCapForResource(idx)
              return (
                <td
                  key={`cap-${resource.id}`}
                  className="border border-border bg-sky-50 dark:bg-sky-900/20 p-2 text-xs text-sky-900 dark:text-sky-200 cursor-pointer premium-hover hover:bg-sky-100 dark:hover:bg-sky-800/30 align-top"
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
                  <p className="leading-relaxed italic">{content || "—"}</p>
                </td>
              )
            })}
            <td className="border border-border bg-emerald-50 dark:bg-emerald-900/20 p-2"></td>
          </tr>
        </thead>

        <tbody>
          {/* Value Chain rows */}
          {valueChain.map((vc, vcIdx) => {
            const vcKpiList = getVcKpis(vc.id)
            const vcKpiText = vcKpiList.length > 0 ? vcKpiList.join(". ") : ""
            const currentCapVC = getCurrentCapForVC(vcIdx)

            return (
              <tr key={vc.id} className="h-28">
                {/* Column A: Value Chain vertical label (only on first row) */}
                {vcIdx === 0 && (
                  <td
                    rowSpan={valueChain.length + 2}
                    className="border border-border bg-muted/50 dark:bg-muted/30 p-2 w-16 align-middle sticky left-0 z-20"
                  >
                    <div
                      className="font-bold text-xs text-muted-foreground tracking-widest whitespace-nowrap"
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
                  className="border border-border bg-card dark:bg-card/80 p-3 min-w-[180px] cursor-pointer sticky left-16 z-20 premium-hover glass-card-hover align-top"
                  onClick={() => onElementClick?.(vc)}
                >
                  <span className="text-[10px] font-bold text-muted-foreground bg-muted dark:bg-muted/50 px-1.5 py-0.5 rounded mr-2 uppercase tracking-tighter">
                    VC {vcIdx + 1}
                  </span>
                  <span className="text-sm font-semibold text-foreground block mt-1 leading-snug">{vc.title}</span>
                </td>

                {/* Column C: Current Capabilities for this VC */}
                <td
                  className="border border-border bg-sky-50 dark:bg-sky-900/20 p-3 text-xs text-sky-900 dark:text-sky-200 min-w-[140px] cursor-pointer premium-hover hover:bg-sky-100 dark:hover:bg-sky-800/30 align-top"
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
                  <p className="leading-relaxed italic">{currentCapVC || "—"}</p>
                </td>

                {/* Columns D-L: Matrix cells (VC × Resource intersections) */}
                {resources.map((resource) => {
                  const content = getCellContent(vc.id, resource.id)

                  return (
                    <td
                      key={`${vc.id}-${resource.id}`}
                      className={cn(
                        "border border-border bg-card dark:bg-card/60 p-3 text-xs text-muted-foreground transition-colors cursor-pointer align-top",
                        "premium-hover glass-card-hover"
                      )}
                      onClick={() => onCellClick?.(vc.id, resource.id)}
                    >
                      {content ? (
                        <p className="leading-relaxed line-clamp-4">{content}</p>
                      ) : editMode === "edit" ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full h-full min-h-[40px] border border-dashed border-gray-400 text-gray-400 hover:bg-accent/10"
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          <span className="text-[10px] font-bold uppercase">Add</span>
                        </Button>
                      ) : (
                        <span>—</span>
                      )}
                    </td>
                  )
                })}

                {/* Column M: Key Results */}
                <td
                  className="border border-border bg-emerald-50 dark:bg-emerald-900/20 p-3 text-xs text-emerald-800 dark:text-emerald-300 cursor-pointer premium-hover hover:bg-emerald-100 dark:hover:bg-emerald-800/30 align-top"
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
                  <p className="leading-tight font-medium text-emerald-900 dark:text-emerald-100">{vcKpiText || (editMode === "edit" ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full h-full min-h-[40px] border border-dashed border-emerald-400/50 text-emerald-600 hover:bg-emerald-100/50"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      <span className="text-[10px] font-bold uppercase">Add</span>
                    </Button>
                  ) : "—")}</p>
                </td>
              </tr>
            )
          })}

          {/* Culture row - Delivery Culture/Dimension */}
          <tr className="h-20">
            <td
              colSpan={2}
              className="border border-border bg-primary/90 text-white p-4 text-center sticky left-16 z-20 backdrop-blur-sm shadow-inner"
            >
              <span className="text-[11px] text-white/70 uppercase tracking-[0.2em] block mb-1 font-black">
                CULTURE
              </span>
              <p className="font-semibold leading-snug">{dimension || "Delivery Culture"}</p>
            </td>
            {resources.map((resource) => (
              <td
                key={`culture-${resource.id}`}
                className="border border-border bg-primary/20 backdrop-blur-[2px] p-2"
              ></td>
            ))}
            <td className="border border-border bg-primary/20 backdrop-blur-[2px] p-2"></td>
          </tr>

          {/* Necessary Capabilities row */}
          <tr className="h-24">
            <td className="border border-border bg-orange-100 dark:bg-orange-900/30 p-2 sticky left-16 z-20"></td>
            <td className="border border-border bg-orange-600 dark:bg-orange-700 p-3 text-center align-top sticky left-16 z-20">
              <span className="font-black text-[10px] uppercase tracking-[0.2em] text-orange-100 leading-tight block pt-1">
                Necessary Capabilities
              </span>
            </td>
            {resources.map((resource, idx) => {
              const content = getNecessaryCapability(idx)
              return (
                <td
                  key={`nec-${resource.id}`}
                  className="border border-border bg-orange-50 dark:bg-orange-950/20 p-3 text-xs text-orange-950 dark:text-orange-100 cursor-pointer premium-hover hover:bg-orange-100 dark:hover:bg-orange-900/30 align-top"
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
                  <p className="leading-relaxed italic">{content || "—"}</p>
                </td>
              )
            })}
            <td className="border border-border bg-orange-50 dark:bg-orange-950/20 p-2"></td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
