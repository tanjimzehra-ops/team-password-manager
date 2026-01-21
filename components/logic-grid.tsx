"use client"
import type { RowData, NodeData } from "@/lib/types"
import { NodeCard } from "./node-card"
import { Button } from "@/components/ui/button"
import { Plus, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface LogicGridProps {
  rows: RowData[]
  showKpi: boolean
  onNodeClick: (node: NodeData) => void
  cultureBanner: { id: string; title: string; kpiValue: number; kpiStatus: "healthy" | "warning" | "critical" }
  bottomBanner: { id: string; title: string; kpiValue: number; kpiStatus: "healthy" | "warning" | "critical" }
  editMode?: boolean
}

export function LogicGrid({
  rows,
  showKpi,
  onNodeClick,
  cultureBanner,
  bottomBanner,
  editMode = false,
}: LogicGridProps) {
  return (
    <div className="flex-1 flex flex-col gap-0">
      {rows.map((row) => (
        <div key={row.id} id={row.id}>
          {/* Purpose Banner - Full width colored banner */}
          {row.category === "purpose" && (
            <div className="mt-2">
              <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                IMPACT / PURPOSE
              </h2>
              <div className="flex items-stretch gap-0 min-h-[56px]">
                <div className={cn("flex-1 rounded-lg p-3 flex items-center justify-center", "bg-teal-600")}>
                  <p className="text-white font-bold text-center text-sm md:text-base leading-tight">
                    {row.nodes[0]?.title}
                  </p>
                  {showKpi && editMode && (
                    <Input
                      type="number"
                      defaultValue={row.nodes[0]?.kpiValue}
                      className="w-16 h-5 text-center text-xs bg-background text-foreground ml-3"
                      onClick={(e) => e.stopPropagation()}
                    />
                  )}
                </div>
                {editMode && (
                  <div className="flex flex-col justify-center gap-1 pl-2">
                    <Button variant="outline" size="icon" className="h-5 w-5 bg-transparent" title="Add external link">
                      <ArrowRight className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Outcome Cards - 4 equal columns with descriptions */}
          {row.category === "outcomes" && (
            <div className="mt-4" id="outcomes">
              <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                STRATEGIC OUTCOMES
              </h2>
              <div className="flex items-stretch gap-0 min-h-[180px]">
                <div className="flex-1 grid grid-cols-2 lg:grid-cols-4 gap-2">
                  {row.nodes.map((node, index) => (
                    <NodeCard
                      key={node.id}
                      node={node}
                      showKpi={showKpi}
                      onClick={() => onNodeClick(node)}
                      isEditMode={editMode}
                      chipLabel={`Outcome ${index + 1}`}
                    />
                  ))}
                </div>
                {editMode && (
                  <div className="flex flex-col justify-center gap-1 pl-2">
                    <Button variant="outline" size="icon" className="h-5 w-5 bg-transparent" title="Add outcome">
                      <Plus className="h-3 w-3" />
                    </Button>
                    <Button variant="outline" size="icon" className="h-5 w-5 bg-transparent" title="Add external link">
                      <ArrowRight className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Value Chain - Compact row of text-only cards */}
          {row.category === "value-chain" && (
            <div className="mt-4" id="value-chain">
              <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                VALUE CHAIN ELEMENTS
              </h2>
              <div className="flex items-stretch gap-0 min-h-[140px]">
                <div className="flex-1 grid grid-cols-4 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-9 xl:grid-cols-13 gap-1">
                  {row.nodes.map((node, index) => (
                    <NodeCard
                      key={node.id}
                      node={node}
                      showKpi={showKpi}
                      onClick={() => onNodeClick(node)}
                      compact
                      isEditMode={editMode}
                      chipLabel={`VC ${index + 1}`}
                    />
                  ))}
                </div>
                {editMode && (
                  <div className="flex flex-col justify-center gap-1 pl-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-5 w-5 bg-transparent"
                      title="Add value chain item"
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                    <Button variant="outline" size="icon" className="h-5 w-5 bg-transparent" title="Add external link">
                      <ArrowRight className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Resources & Capability - Grid of text-only compact cards */}
          {row.category === "resources" && (
            <>
              {/* Culture Banner between Value Chain and Resources */}
              <div className="mt-4" id="culture">
                <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  DELIVERY CULTURE / DIMENSION
                </h2>
                <div className="flex items-stretch gap-0 min-h-[56px]">
                  <div className="flex-1 relative bg-slate-800 dark:bg-slate-700 rounded-lg p-2 flex items-center">
                    <Button variant="ghost" size="icon" className="text-white shrink-0 h-6 w-6">
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <p className="text-white font-medium text-center flex-1 text-xs px-2 leading-tight">
                      {cultureBanner.title}
                    </p>
                    <Button variant="ghost" size="icon" className="text-white shrink-0 h-6 w-6">
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                  {editMode && (
                    <div className="flex flex-col justify-center gap-1 pl-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-5 w-5 bg-transparent"
                        title="Add external link"
                      >
                        <ArrowRight className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Resources Cards */}
              <div className="mt-4" id="resources">
                <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  RESOURCES / CAPABILITIES
                </h2>
                <div className="flex items-stretch gap-0 min-h-[140px]">
                  <div className="flex-1 grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-9 gap-1">
                    {row.nodes.map((node, index) => (
                      <NodeCard
                        key={node.id}
                        node={node}
                        showKpi={showKpi}
                        onClick={() => onNodeClick(node)}
                        compact
                        isEditMode={editMode}
                        chipLabel={`Resource ${index + 1}`}
                      />
                    ))}
                  </div>
                  {editMode && (
                    <div className="flex flex-col justify-center gap-1 pl-2">
                      <Button variant="outline" size="icon" className="h-5 w-5 bg-transparent" title="Add resource">
                        <Plus className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-5 w-5 bg-transparent"
                        title="Add external link"
                      >
                        <ArrowRight className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Banner - Context statement */}
              <div className="mt-4" id="context">
                <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  SYSTEM CONTEXT / CHALLENGE
                </h2>
                <div className="flex items-stretch gap-0 min-h-[56px]">
                  <div className="flex-1 bg-amber-500 dark:bg-amber-600 rounded-lg p-2 flex items-center justify-center">
                    <p className="text-white font-medium text-center text-xs leading-tight">{bottomBanner.title}</p>
                  </div>
                  {editMode && (
                    <div className="flex flex-col justify-center gap-1 pl-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-5 w-5 bg-transparent"
                        title="Add external link"
                      >
                        <ArrowRight className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  )
}
