"use client"
import { useState } from "react"
import type { RowData, NodeData } from "@/lib/types"
import { NodeCard } from "./node-card"
import { Button } from "@/components/ui/button"
import { Plus, ChevronLeft, ChevronRight, ArrowRight, Book, LayoutGrid } from "lucide-react"
import { EmptyState } from "@/components/empty-state"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export type EditMode = "view" | "edit" | "colour" | "order" | "delete"

interface LogicGridProps {
  rows: RowData[]
  showKpi: boolean
  onNodeClick: (node: NodeData) => void
  cultureBanner: { id: string; title: string; kpiValue: number; kpiStatus: "healthy" | "warning" | "critical" }
  bottomBanner: { id: string; title: string; kpiValue: number; kpiStatus: "healthy" | "warning" | "critical" }
  editMode?: EditMode
  displayMode?: "stage" | "performance"
  onColorChange?: (nodeId: string, color: NodeData["color"]) => void
  onReorder?: (category: string, fromIndex: number, toIndex: number) => void
  onAddNode?: (category: string) => void
  onDeleteNode?: (nodeId: string) => void
  onEditNode?: (node: NodeData) => void
}

export function LogicGrid({
  rows,
  showKpi,
  onNodeClick,
  cultureBanner,
  bottomBanner,
  editMode = "view",
  displayMode,
  onColorChange,
  onReorder,
  onAddNode,
  onDeleteNode,
  onEditNode,
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
          {/* Purpose Banner - Full width colored banner */}
          {row.category === "purpose" && (
            <div className="mt-2">
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                IMPACT / PURPOSE
              </h2>
              <div className="flex items-stretch gap-0 min-h-[56px]">
                <div
                  className={cn("flex-1 rounded-lg p-3 flex items-center justify-center cursor-pointer hover:bg-teal-900 transition-colors", "bg-teal-800")}
                  onClick={() => row.nodes[0] && handleNodeClick(row.nodes[0])}
                >
                  <p className="text-white font-bold text-center text-[22px] leading-tight">
                    {row.nodes[0]?.title}
                  </p>
                  {showKpi && editMode === "edit" && (
                    <Input
                      type="number"
                      defaultValue={row.nodes[0]?.kpiValue}
                      className="w-16 h-5 text-center text-xs bg-background text-foreground ml-3"
                      onClick={(e) => e.stopPropagation()}
                    />
                  )}
                </div>
                {editMode === "edit" && (
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
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                STRATEGIC OBJECTIVES
              </h2>
              <div className="flex items-stretch gap-0 min-h-[180px]">
                <div className="flex-1 flex flex-nowrap gap-2">
                  {row.nodes.map((node, index) => (
                    <div
                      key={node.id}
                      className={cn(
                        "flex-1 min-w-0",
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
                        displayMode={displayMode}
                        onColorChange={onColorChange ? (color) => onColorChange(node.id, color) : undefined}
                        onDeleteClick={onDeleteNode ? () => onDeleteNode(node.id) : undefined}
                        onEditClick={onEditNode ? () => onEditNode(node) : undefined}
                        draggable={editMode === "order"}
                        onDragStart={(e) => handleDragStart(e, node, index, row.category)}
                        onDragEnd={handleDragEnd}
                        chipLabel={`Objective ${index + 1}`}
                      />
                    </div>
                  ))}
                </div>
                {editMode === "edit" && (
                  <div className="flex flex-col justify-center gap-1 pl-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-5 w-5 bg-transparent"
                      title="Add outcome"
                      onClick={() => onAddNode?.(row.category)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-5 w-5 bg-transparent"
                      title="Open library"
                    >
                      <Book className="h-3 w-3" />
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
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                VALUE CHAIN ELEMENTS
              </h2>
              <div className="flex items-stretch gap-0 min-h-[140px]">
                <div className="flex-1 flex flex-nowrap gap-1">
                  {row.nodes.map((node, index) => (
                    <div
                      key={node.id}
                      className={cn(
                        "flex-1 min-w-0",
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
                        displayMode={displayMode}
                        onColorChange={onColorChange ? (color) => onColorChange(node.id, color) : undefined}
                        onDeleteClick={onDeleteNode ? () => onDeleteNode(node.id) : undefined}
                        onEditClick={onEditNode ? () => onEditNode(node) : undefined}
                        draggable={editMode === "order"}
                        onDragStart={(e) => handleDragStart(e, node, index, row.category)}
                        onDragEnd={handleDragEnd}
                        chipLabel={`VC ${index + 1}`}
                      />
                    </div>
                  ))}
                </div>
                {editMode === "edit" && (
                  <div className="flex flex-col justify-center gap-1 pl-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-5 w-5 bg-transparent"
                      title="Add value chain item"
                      onClick={() => onAddNode?.(row.category)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-5 w-5 bg-transparent"
                      title="Open library"
                    >
                      <Book className="h-3 w-3" />
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
                <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  DELIVERY CULTURE / DIMENSION
                </h2>
                <div className="flex items-stretch gap-0 min-h-[56px]">
                  <div
                    className="flex-1 relative bg-teal-700 rounded-lg p-2 flex items-center cursor-pointer hover:bg-teal-800 transition-colors"
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
                    <Button variant="ghost" size="icon" className="text-white shrink-0 h-6 w-6" onClick={(e) => e.stopPropagation()}>
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <p className="text-white font-medium text-center flex-1 text-lg px-2 leading-tight">
                      {cultureBanner.title}
                    </p>
                    <Button variant="ghost" size="icon" className="text-white shrink-0 h-6 w-6" onClick={(e) => e.stopPropagation()}>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                  {editMode === "edit" && (
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
                <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  RESOURCES, CAPABILITIES / LEVERS
                </h2>
                <div className="flex items-stretch gap-0 min-h-[140px]">
                  <div className="flex-1 flex flex-nowrap gap-1">
                    {row.nodes.map((node, index) => (
                      <div
                        key={node.id}
                        className={cn(
                          "flex-1 min-w-0",
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
                          displayMode={displayMode}
                          onColorChange={onColorChange ? (color) => onColorChange(node.id, color) : undefined}
                          onDeleteClick={onDeleteNode ? () => onDeleteNode(node.id) : undefined}
                          onEditClick={onEditNode ? () => onEditNode(node) : undefined}
                          draggable={editMode === "order"}
                          onDragStart={(e) => handleDragStart(e, node, index, row.category)}
                          onDragEnd={handleDragEnd}
                          chipLabel={`Resource ${index + 1}`}
                        />
                      </div>
                    ))}
                  </div>
                  {editMode === "edit" && (
                    <div className="flex flex-col justify-center gap-1 pl-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-5 w-5 bg-transparent"
                        title="Add resource"
                        onClick={() => onAddNode?.(row.category)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-5 w-5 bg-transparent"
                        title="Open library"
                      >
                        <Book className="h-3 w-3" />
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
                <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  SYSTEM CONTEXT / CHALLENGE
                </h2>
                <div className="flex items-stretch gap-0 min-h-[56px]">
                  <div
                    className="flex-1 bg-teal-600 rounded-lg p-2 flex items-center justify-center cursor-pointer hover:bg-teal-700 transition-colors"
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
                    <p className="text-white font-medium text-center text-lg leading-tight">{bottomBanner.title}</p>
                  </div>
                  {editMode === "edit" && (
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
