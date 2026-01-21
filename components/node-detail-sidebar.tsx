"use client"

import type { NodeData } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, Link2, FileText, Info } from "lucide-react"
import { cn } from "@/lib/utils"

interface NodeDetailSidebarProps {
  node: NodeData | null
  isOpen: boolean
  onClose: () => void
}

const kpiStatusColors = {
  healthy: "bg-emerald-500 text-white",
  warning: "bg-amber-500 text-white",
  critical: "bg-red-500 text-white",
}

const kpiStatusLabels = {
  healthy: "Healthy",
  warning: "Needs Attention",
  critical: "Critical",
}

export function NodeDetailSidebar({ node, isOpen, onClose }: NodeDetailSidebarProps) {
  if (!node) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none",
        )}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div
        className={cn(
          "fixed right-0 top-0 h-full w-full max-w-md bg-background border-l border-border shadow-2xl z-50",
          "transform transition-transform duration-300 ease-out",
          isOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <h2 className="text-lg font-semibold text-foreground">Node Details</h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Title */}
            <div>
              <h3 className="text-xl font-bold text-foreground leading-tight">{node.title}</h3>
              <Badge variant="outline" className="mt-2 capitalize">
                {node.category.replace("-", " ")}
              </Badge>
            </div>

            {/* KPI Section */}
            <div className="bg-muted/50 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Info className="h-4 w-4" />
                KPI Status
              </div>
              <div className="flex items-center gap-4">
                <div className="text-4xl font-bold text-foreground">{node.kpiValue}</div>
                <Badge className={cn("text-sm", kpiStatusColors[node.kpiStatus])}>
                  {kpiStatusLabels[node.kpiStatus]}
                </Badge>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <FileText className="h-4 w-4" />
                Description
              </div>
              <p className="text-foreground leading-relaxed">{node.description}</p>
            </div>

            {/* Notes */}
            {node.notes && (
              <div className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground">Notes</div>
                <p className="text-foreground/80 text-sm leading-relaxed bg-muted/30 rounded-lg p-3">{node.notes}</p>
              </div>
            )}

            {/* Related Nodes */}
            {node.relatedNodes && node.relatedNodes.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Link2 className="h-4 w-4" />
                  Related Nodes
                </div>
                <div className="flex flex-wrap gap-2">
                  {node.relatedNodes.map((relatedId) => (
                    <Badge key={relatedId} variant="secondary" className="text-xs">
                      {relatedId}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Metadata */}
            {node.metadata && Object.keys(node.metadata).length > 0 && (
              <div className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground">Metadata</div>
                <div className="space-y-2">
                  {Object.entries(node.metadata).map(([key, value]) => (
                    <div key={key} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{key}</span>
                      <span className="text-foreground font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-border">
            <Button className="w-full bg-transparent" variant="outline">
              Edit Node
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
