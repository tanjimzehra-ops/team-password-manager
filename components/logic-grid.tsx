"use client"

import { useState } from "react"
import type { RowData, NodeData } from "@/lib/types"
import { NodeCard } from "./node-card"
import { Button } from "@/components/ui/button"
import { Plus, ChevronLeft, ChevronRight, ArrowRight, Book, LayoutGrid } from "lucide-react"
import { EmptyState } from "@/components/empty-state"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { HealthRing } from "./ui/health-ring"
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip"

export type EditMode = "view" | "edit" | "colour" | "order" | "delete"

interface LogicGridProps {
  rows: RowData[]
  showKpi: boolean
  onNodeClick: (node: NodeData) => void
  cultureBanner: { id: string; title: string; kpiValue: number; kpiStatus: "healthy" | "warning" | "critical" }
  bottomBanner: { id: string; title: string; kpiValue: number; kpiStatus: "healthy" | "warning" | "critical" }
  editMode?: EditMode
  onColorChange?: (nodeId: string, color: NodeData["color"]) => void
  onReorder?: (category: string, fromIndex: number, toIndex: number) => void
  onAddNode?: (category: string) => void
  onDeleteNode?: (nodeId: string) => void
  onEditNode?: (node: NodeData) => void
  onKpiChange?: (nodeId: string, value: number) => void
  onOpenLibrary?: (category: NodeData["category"]) => void
}

export function LogicGrid({
  rows,
  showKpi,
  onNodeClick,
  cultureBanner,
  bottomBanner,
  editMode = "view",
  onColorChange,
  onReorder,
  onAddNode,
  onDeleteNode,
  onEditNode,
  onKpiChange,
  onOpenLibrary,
}: LogicGridProps) {
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)
  const [dragCategory, setDragCategory] = useState<string | null>(null)

  const isEditActive = editMode !== "view"

  // Drag-and-drop handlers
  const handleDragStart = (e: React.DragEvent, node: NodeData, index: number, category: string) => {
    if (editMode !== "order") return
    e.dataTransfer.setData("text/plain", JSON.stringify({ nodeId: node.id, fromIndex: index, category }))
    e.dataTransfer.effectAllowed = "move"
    setDragCategory(category)
  }

  const handleDragOver = (e: React.DragEvent, index: number, category: string) => {
    if (editMode !== "order") return
    if (dragCategory && dragCategory !== category) return
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
    setDragOverIndex(index)
  }

  const handleDragLeave = () => {
    setDragOverIndex(null)
  }

  const handleDrop = (e: React.DragEvent, _node: NodeData, toIndex: number, category: string) => {
    if (editMode !== "order") return
    e.preventDefault()
    setDragOverIndex(null)
    setDragCategory(null)

    try {
      const data = JSON.parse(e.dataTransfer.getData("text/plain"))
      if (data.category === category && data.fromIndex !== toIndex) {
        onReorder?.(category, data.fromIndex, toIndex)
      }
    } catch {
      // Invalid drag data, ignore
    }
  }

  const handleDragEnd = () => {
    setDragOverIndex(null)
    setDragCategory(null)
  }

  const handleMoveNode = (
    category: string,
    fromIndex: number,
    direction: -1 | 1,
    nodeCount: number
  ) => {
    if (editMode !== "order") return
    const toIndex = fromIndex + direction
    if (toIndex < 0 || toIndex >= nodeCount) return
    onReorder?.(category, fromIndex, toIndex)
  }

  // Click handler for nodes - routes based on edit mode
  const handleNodeClick = (node: NodeData) => {
    if (editMode === "edit") {
      onEditNode?.(node)
    } else if (editMode === "delete") {
      onDeleteNode?.(node.id)
    } else {
      onNodeClick(node)
    }
  }

  if (rows.length === 0) {
    return (
      <EmptyState
        icon={LayoutGrid}
        title="No elements yet"
        description="Start building your Logic Model. Switch to Edit mode to add your first element."
      />
    )
  }

  return (
    <div id="view-logic-model" className="flex-1 flex flex-col gap-0">
      {rows.map((row) => (
        <div key={row.id} id={row.id}>
          {/* Purpose Banner - Fixed height 132px */}
          {row.category === "purpose" && (
            <div className="h-[132px] flex flex-col justify-start">
              <div className="h-[60px] flex flex-col justify-end pb-2">
                <h2 className="text-xs font-black text-slate-500/90 dark:text-slate-400 uppercase tracking-[0.25em] pl-1 whitespace-nowrap">
                  IMPACT / PURPOSE
                </h2>
              </div>
              <div className="flex items-stretch justify-start gap-0 min-h-[72px]">
                <div
                  className={cn(
                    "flex-1 rounded-xl p-4 flex items-center justify-center cursor-pointer",
                    "bg-teal-800 text-white premium-hover shadow-lg",
                    "relative overflow-hidden group-hover:bg-teal-700 transition-colors"
                  )}
                  onClick={() => row.nodes[0] && handleNodeClick(row.nodes[0])}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
                  {showKpi && row.nodes[0] && (
                    <div className="absolute top-3 right-4">
                      <HealthRing value={row.nodes[0].kpiValue} size={36} strokeWidth={4} className="text-white fill-white/10" />
                    </div>
                  )}
                  <p className="text-white font-black text-center text-2xl tracking-tight z-10 drop-shadow-sm">
                    {row.nodes[0]?.title}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Outcome Cards - Fixed height 320px */}
          {row.category === "outcomes" && (
            <div className="h-[320px] flex flex-col justify-start" id="outcomes">
              <div className="h-[60px] flex flex-col justify-end pb-2">
                <h2 className="text-xs font-black text-slate-500/90 dark:text-slate-400 uppercase tracking-[0.25em] pl-1 whitespace-nowrap">
                  STRATEGIC OBJECTIVES
                </h2>
              </div>
              <div className="flex items-stretch justify-start gap-0 min-h-[260px]">
                <div className="flex-1 flex overflow-x-auto justify-start gap-3 pb-3 -mb-3 scrollbar-thin">
                  {row.nodes.map((node, index) => (
                    <div
                      key={node.id}
                      className={cn(
                        "flex-1 min-w-[320px]",
                        editMode === "order" && dragOverIndex === index && dragCategory === row.category
                          ? "border-l-2 border-primary"
                          : "border-l-2 border-transparent",
                      )}
                      onDragOver={(e) => handleDragOver(e, index, row.category)}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDrop(e, node, index, row.category)}
                    >
                      <NodeCard
                        key={node.id}
                        node={node}
                        showKpi={showKpi}
                        onClick={() => handleNodeClick(node)}
                        isEditMode={isEditActive}
                        editMode={editMode}

                        onColorChange={onColorChange ? (color) => onColorChange(node.id, color) : undefined}
                        onDeleteClick={onDeleteNode ? () => onDeleteNode(node.id) : undefined}
                        onEditClick={onEditNode ? () => onEditNode(node) : undefined}
                        onKpiChange={onKpiChange ? (value) => onKpiChange(node.id, value) : undefined}
                        draggable={editMode === "order"}
                        onDragStart={(e) => handleDragStart(e, node, index, row.category)}
                        onDragEnd={handleDragEnd}
                        showReorderArrows={editMode === "order"}
                        onMoveUp={() => handleMoveNode(row.category, index, -1, row.nodes.length)}
                        onMoveDown={() => handleMoveNode(row.category, index, 1, row.nodes.length)}
                        disableMoveUp={index === 0}
                        disableMoveDown={index === row.nodes.length - 1}
                        chipLabel={`OBJECTIVE ${index + 1}`}
                      />
                    </div>
                  ))}
                </div>
                {editMode === "edit" && (
                  <div className="flex flex-col justify-center gap-1.5 pl-3">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7 bg-card/50 backdrop-blur-sm border-border/40 hover:bg-accent hover:text-white transition-all shadow-sm"
                      title="Add outcome"
                      onClick={() => onAddNode?.(row.category)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7 bg-card/50 backdrop-blur-sm border-border/40 hover:bg-accent hover:text-white transition-all shadow-sm"
                      title="Open library"
                      onClick={() => onOpenLibrary?.(row.category as NodeData["category"])}
                    >
                      <Book className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Value Chain - Fixed height 220px */}
          {row.category === "value-chain" && (
            <div className="h-[220px] flex flex-col justify-start" id="value-chain">
              <div className="h-[60px] flex flex-col justify-end pb-2">
                <h2 className="text-xs font-black text-slate-500/90 dark:text-slate-400 uppercase tracking-[0.25em] pl-1 whitespace-nowrap">
                  VALUE CHAIN ELEMENTS
                </h2>
              </div>
              <div className="flex items-stretch justify-start gap-0 min-h-[160px]">
                <div className="flex-1 flex overflow-x-auto justify-start gap-2 pb-3 -mb-3 scrollbar-thin">
                  {row.nodes.map((node, index) => (
                    <div
                      key={node.id}
                      className={cn(
                        "flex-1 min-w-[200px]",
                        editMode === "order" && dragOverIndex === index && dragCategory === row.category
                          ? "border-l-2 border-primary"
                          : "border-l-2 border-transparent",
                      )}
                      onDragOver={(e) => handleDragOver(e, index, row.category)}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDrop(e, node, index, row.category)}
                    >
                      <NodeCard
                        key={node.id}
                        node={node}
                        showKpi={showKpi}
                        onClick={() => handleNodeClick(node)}
                        compact
                        isEditMode={isEditActive}
                        editMode={editMode}

                        onColorChange={onColorChange ? (color) => onColorChange(node.id, color) : undefined}
                        onDeleteClick={onDeleteNode ? () => onDeleteNode(node.id) : undefined}
                        onEditClick={onEditNode ? () => onEditNode(node) : undefined}
                        onKpiChange={onKpiChange ? (value) => onKpiChange(node.id, value) : undefined}
                        draggable={editMode === "order"}
                        onDragStart={(e) => handleDragStart(e, node, index, row.category)}
                        onDragEnd={handleDragEnd}
                        showReorderArrows={editMode === "order"}
                        onMoveUp={() => handleMoveNode(row.category, index, -1, row.nodes.length)}
                        onMoveDown={() => handleMoveNode(row.category, index, 1, row.nodes.length)}
                        disableMoveUp={index === 0}
                        disableMoveDown={index === row.nodes.length - 1}
                        chipLabel={`VC ELEMENT ${index + 1}`}
                      />
                    </div>
                  ))}
                </div>
                {editMode === "edit" && (
                  <div className="flex flex-col justify-center gap-1.5 pl-3">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7 bg-card/50 backdrop-blur-sm border-border/40 hover:bg-accent hover:text-white transition-all shadow-sm"
                      title="Add value chain item"
                      onClick={() => onAddNode?.(row.category)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7 bg-card/50 backdrop-blur-sm border-border/40 hover:bg-accent hover:text-white transition-all shadow-sm"
                      title="Open library"
                      onClick={() => onOpenLibrary?.(row.category as NodeData["category"])}
                    >
                      <Book className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Resources & Capability - Fixed height 200px */}
          {row.category === "resources" && (
            <>
              {/* Culture Banner - Fixed height 132px */}
              <div className="h-[132px] flex flex-col justify-start" id="culture">
                <div className="h-[60px] flex flex-col justify-end pb-2">
                  <h2 className="text-xs font-black text-slate-500/90 dark:text-slate-400 uppercase tracking-[0.25em] pl-1 whitespace-nowrap">
                    DELIVERY CULTURE / DIMENSION
                  </h2>
                </div>
                <div className="flex items-stretch justify-start gap-0 min-h-[72px]">
                  <div
                    className="flex-1 relative bg-teal-800 rounded-xl p-3 flex items-center cursor-pointer premium-hover shadow-lg group-hover:bg-teal-700 transition-colors"
                    onClick={() => onNodeClick({
                      id: cultureBanner.id,
                      title: cultureBanner.title,
                      description: cultureBanner.title,
                      kpiValue: cultureBanner.kpiValue,
                      kpiStatus: cultureBanner.kpiStatus,
                      category: "value-chain",
                      color: "muted",
                      notes: "Delivery Culture / Dimension",
                      metadata: {
                        "Type": "Delivery Culture",
                        "View": "Logic Model",
                      },
                    })}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
                    <Button variant="ghost" size="icon" className="text-white shrink-0 h-6 w-6 hover:bg-white/10" onClick={(e) => e.stopPropagation()}>
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <p className="text-white font-bold text-center flex-1 text-xl px-2 leading-tight tracking-tight z-10">
                      {cultureBanner.title}
                    </p>
                    <Button variant="ghost" size="icon" className="text-white shrink-0 h-6 w-6 hover:bg-white/10" onClick={(e) => e.stopPropagation()}>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Resources Cards - Fixed height 220px */}
              <div className="h-[220px] flex flex-col justify-start" id="resources">
                <div className="h-[60px] flex flex-col justify-end pb-2">
                  <h2 className="text-xs font-black text-slate-500/90 dark:text-slate-400 uppercase tracking-[0.25em] pl-1 whitespace-nowrap">
                    RESOURCES, CAPABILITIES / LEVERS
                  </h2>
                </div>
                <div className="flex items-stretch justify-start gap-0 min-h-[160px]">
                  <div className="flex-1 flex overflow-x-auto justify-start gap-2 pb-3 -mb-3 scrollbar-thin">
                    {row.nodes.map((node, index) => (
                      <div
                        key={node.id}
                        className={cn(
                          "flex-1 min-w-[200px]",
                          editMode === "order" && dragOverIndex === index && dragCategory === row.category
                            ? "border-l-2 border-primary"
                            : "border-l-2 border-transparent",
                        )}
                        onDragOver={(e) => handleDragOver(e, index, row.category)}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(e, node, index, row.category)}
                      >
                        <NodeCard
                          key={node.id}
                          node={node}
                          showKpi={showKpi}
                          onClick={() => handleNodeClick(node)}
                          compact
                          isEditMode={isEditActive}
                          editMode={editMode}

                          onColorChange={onColorChange ? (color) => onColorChange(node.id, color) : undefined}
                          onDeleteClick={onDeleteNode ? () => onDeleteNode(node.id) : undefined}
                          onEditClick={onEditNode ? () => onEditNode(node) : undefined}
                          onKpiChange={onKpiChange ? (value) => onKpiChange(node.id, value) : undefined}
                          draggable={editMode === "order"}
                          onDragStart={(e) => handleDragStart(e, node, index, row.category)}
                          onDragEnd={handleDragEnd}
                          showReorderArrows={editMode === "order"}
                          onMoveUp={() => handleMoveNode(row.category, index, -1, row.nodes.length)}
                          onMoveDown={() => handleMoveNode(row.category, index, 1, row.nodes.length)}
                          disableMoveUp={index === 0}
                          disableMoveDown={index === row.nodes.length - 1}
                          chipLabel={`RESOURCE ${index + 1}`}
                        />
                      </div>
                    ))}
                  </div>
                  {editMode === "edit" && (
                    <div className="flex flex-col justify-center gap-1.5 pl-3">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7 bg-card/50 backdrop-blur-sm border-border/40 hover:bg-accent hover:text-white transition-all shadow-sm"
                        title="Add resource"
                        onClick={() => onAddNode?.(row.category)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7 bg-card/50 backdrop-blur-sm border-border/40 hover:bg-accent hover:text-white transition-all shadow-sm"
                        title="Open library"
                        onClick={() => onOpenLibrary?.(row.category as any)}
                      >
                        <Book className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Banner - Fixed height 132px */}
              <div className="h-[132px] flex flex-col justify-start" id="context">
                <div className="h-[60px] flex flex-col justify-end pb-2">
                  <h2 className="text-xs font-black text-slate-500/90 dark:text-slate-400 uppercase tracking-[0.25em] pl-1 whitespace-nowrap">
                    SYSTEM STEWARDSHIP / GOVERNANCE
                  </h2>
                </div>
                <div className="flex items-stretch justify-start gap-0 min-h-[72px]">
                  <div
                    className="flex-1 bg-teal-800 rounded-xl p-4 flex items-center justify-center cursor-pointer hover:bg-teal-700/90 transition-colors relative overflow-hidden"
                    onClick={() => onNodeClick({
                      id: bottomBanner.id,
                      title: bottomBanner.title,
                      description: bottomBanner.title,
                      kpiValue: bottomBanner.kpiValue,
                      kpiStatus: bottomBanner.kpiStatus,
                      category: "purpose",
                      color: "primary",
                      notes: "System Context / Challenge",
                      metadata: {
                        "Type": "System Context",
                        "View": "Logic Model",
                      },
                    })}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
                    <p className="text-white font-bold text-center text-xl leading-tight tracking-tight z-10">{bottomBanner.title}</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  )
}
