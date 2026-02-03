"use client"

import { useState, useEffect } from "react"
import type { NodeData } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { X, Link2, FileText, Info, Pencil, Save } from "lucide-react"
import { cn } from "@/lib/utils"

interface NodeDetailSidebarProps {
  node: NodeData | null
  isOpen: boolean
  onClose: () => void
  onSave?: (updatedNode: NodeData) => Promise<void>
}

// Existing KPI status colours — UNTOUCHED
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

// Progress bar fill — same colours as status badges
const kpiStatusBarColors = {
  healthy: "bg-emerald-500",
  warning: "bg-amber-500",
  critical: "bg-red-500",
}

// Category configuration — text badges only, no icons
const categoryConfig = {
  purpose: { label: "Purpose", badgeClass: "bg-teal-100 text-teal-700 border-teal-200 dark:bg-teal-900/30 dark:text-teal-300 dark:border-teal-800" },
  outcomes: { label: "Outcomes", badgeClass: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800" },
  "value-chain": { label: "Value Chain", badgeClass: "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800" },
  resources: { label: "Resources", badgeClass: "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800" },
} as const

function isMatrixCell(node: NodeData): boolean {
  return !!node.metadata?.View
}

// ─── Category-specific Overview content ────────────────────────────────────────

function renderCategoryOverview(node: NodeData, isEditing: boolean, editDescription: string, setEditDescription: (v: string) => void) {
  const descriptionBlock = (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <FileText className="h-4 w-4" />
        Description
      </div>
      {isEditing ? (
        <Textarea
          value={editDescription}
          onChange={(e) => setEditDescription(e.target.value)}
          rows={4}
          className="text-sm"
        />
      ) : (
        <p className="text-foreground leading-relaxed">{node.description}</p>
      )}
    </div>
  )

  // Matrix cell — intersection context
  if (isMatrixCell(node)) {
    const metadataKeys = ["Value Chain Element", "Outcome", "Resource", "External Factor"]
    const intersectionEntries = metadataKeys
      .filter((key) => node.metadata?.[key])
      .map((key) => ({ key, value: node.metadata![key] }))

    return (
      <div className="space-y-4">
        {intersectionEntries.length > 0 && (
          <div className="space-y-2">
            <div className="text-sm font-medium text-muted-foreground">Intersection</div>
            <div className="bg-muted/30 rounded-lg p-3 space-y-2">
              {intersectionEntries.map(({ key, value }) => (
                <div key={key} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{key}</span>
                  <span className="text-foreground font-medium text-right max-w-[60%]">{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        <Separator />
        <div className="space-y-2">
          <div className="text-sm font-medium text-muted-foreground">Content</div>
          {isEditing ? (
            <Textarea
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              rows={4}
              className="text-sm"
            />
          ) : (
            <p className="text-foreground leading-relaxed">{node.description}</p>
          )}
        </div>
      </div>
    )
  }

  switch (node.category) {
    case "purpose":
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <FileText className="h-4 w-4" />
              Purpose Statement
            </div>
            {isEditing ? (
              <Textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                rows={4}
                className="text-sm"
              />
            ) : (
              <p className="text-foreground leading-relaxed text-base">{node.description}</p>
            )}
          </div>
          {node.metadata?.System && (
            <>
              <Separator />
              <div className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground">System Context</div>
                <p className="text-foreground/80 text-sm">{node.metadata.System}</p>
              </div>
            </>
          )}
        </div>
      )

    case "outcomes":
      return (
        <div className="space-y-4">
          {descriptionBlock}
          {node.metadata?.["Key Points"] && (
            <>
              <Separator />
              <div className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground">Key Points</div>
                <p className="text-foreground/80 text-sm bg-muted/30 rounded-lg p-3">
                  {node.metadata["Key Points"]}
                </p>
              </div>
            </>
          )}
        </div>
      )

    case "value-chain":
      return (
        <div className="space-y-4">
          <div className="bg-muted/30 rounded-lg p-4 space-y-2">
            <div className="text-sm font-medium text-muted-foreground">Progress</div>
            <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className={cn("h-full rounded-full transition-all duration-500", kpiStatusBarColors[node.kpiStatus])}
                style={{ width: `${Math.min(Math.max(node.kpiValue, 0), 100)}%` }}
              />
            </div>
            <div className="text-right text-sm font-medium text-foreground">{node.kpiValue}%</div>
          </div>
          {descriptionBlock}
        </div>
      )

    case "resources":
      return (
        <div className="space-y-4">
          <div className="bg-muted/30 rounded-lg p-4 space-y-2">
            <div className="text-sm font-medium text-muted-foreground">Utilisation</div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-foreground">{node.kpiValue}%</span>
              <Badge className={cn("text-xs", kpiStatusColors[node.kpiStatus])}>
                {kpiStatusLabels[node.kpiStatus]}
              </Badge>
            </div>
            <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className={cn("h-full rounded-full transition-all duration-500", kpiStatusBarColors[node.kpiStatus])}
                style={{ width: `${Math.min(Math.max(node.kpiValue, 0), 100)}%` }}
              />
            </div>
          </div>
          {descriptionBlock}
        </div>
      )

    default:
      return descriptionBlock
  }
}

// ─── Details tab content ───────────────────────────────────────────────────────

function renderDetailsTab(node: NodeData) {
  const hasNotes = !!node.notes
  const hasRelated = node.relatedNodes && node.relatedNodes.length > 0
  const metadataEntries = node.metadata
    ? Object.entries(node.metadata).filter(([key]) => key !== "View" && !key.startsWith("_"))
    : []
  const hasMetadata = metadataEntries.length > 0

  if (!hasNotes && !hasRelated && !hasMetadata) {
    return <p className="text-muted-foreground text-sm italic">No additional details available.</p>
  }

  return (
    <div className="space-y-4">
      {hasNotes && (
        <div className="space-y-2">
          <div className="text-sm font-medium text-muted-foreground">Notes</div>
          <p className="text-foreground/80 text-sm leading-relaxed bg-muted/30 rounded-lg p-3">{node.notes}</p>
        </div>
      )}

      {hasRelated && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Link2 className="h-4 w-4" />
            Related Elements
          </div>
          <div className="flex flex-wrap gap-2">
            {node.relatedNodes!.map((relatedId) => (
              <Badge key={relatedId} variant="secondary" className="text-xs cursor-pointer hover:bg-accent">
                {relatedId}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {hasMetadata && (
        <div className="space-y-2">
          <div className="text-sm font-medium text-muted-foreground">Metadata</div>
          <div className="space-y-2">
            {metadataEntries.map(([key, value]) => (
              <div key={key} className="flex justify-between text-sm">
                <span className="text-muted-foreground">{key}</span>
                <span className="text-foreground font-medium">{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Main Component ────────────────────────────────────────────────────────────

export function NodeDetailSidebar({ node, isOpen, onClose, onSave }: NodeDetailSidebarProps) {
  // Edit mode state
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState("")
  const [editDescription, setEditDescription] = useState("")
  const [editKpiValue, setEditKpiValue] = useState(0)
  const [isSaving, setIsSaving] = useState(false)

  // Reset edit state when node changes
  useEffect(() => {
    setIsEditing(false)
  }, [node?.id])

  if (!node) return null

  const config = categoryConfig[node.category]

  const startEdit = () => {
    setEditTitle(node.title)
    setEditDescription(node.description)
    setEditKpiValue(node.kpiValue)
    setIsEditing(true)
  }

  const handleSave = async () => {
    if (!onSave) return
    setIsSaving(true)
    try {
      await onSave({
        ...node,
        title: editTitle,
        description: editDescription,
        kpiValue: editKpiValue,
      })
      setIsEditing(false)
    } finally {
      setIsSaving(false)
    }
  }

  const cancelEdit = () => {
    setIsEditing(false)
  }

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
            {/* Title + Category Badge */}
            <div>
              {isEditing ? (
                <Input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="text-xl font-bold mb-2"
                />
              ) : (
                <h3 className="text-xl font-bold text-foreground leading-tight">{node.title}</h3>
              )}
              <Badge className={cn("mt-2 text-xs border", config.badgeClass)}>
                {isMatrixCell(node) ? node.metadata!.View : config.label}
              </Badge>
            </div>

            {/* KPI Section with Progress Bar */}
            <div className="bg-muted/50 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Info className="h-4 w-4" />
                KPI Status
              </div>
              <div className="flex items-center gap-4">
                {isEditing ? (
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    value={editKpiValue}
                    onChange={(e) => setEditKpiValue(Number(e.target.value))}
                    className="w-24 text-2xl font-bold"
                  />
                ) : (
                  <div className="text-4xl font-bold text-foreground">{node.kpiValue}</div>
                )}
                <Badge className={cn("text-sm", kpiStatusColors[node.kpiStatus])}>
                  {kpiStatusLabels[node.kpiStatus]}
                </Badge>
              </div>
              <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className={cn("h-full rounded-full transition-all duration-500", kpiStatusBarColors[node.kpiStatus])}
                  style={{ width: `${Math.min(Math.max(isEditing ? editKpiValue : node.kpiValue, 0), 100)}%` }}
                />
              </div>
              <div className="text-xs text-muted-foreground text-right">
                {isEditing ? editKpiValue : node.kpiValue}%
              </div>
            </div>

            {/* Tabs: Overview + Details */}
            <Tabs defaultValue="overview" className="flex-1">
              <TabsList className="w-full">
                <TabsTrigger value="overview" className="flex-1">Overview</TabsTrigger>
                <TabsTrigger value="details" className="flex-1">Details</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4 mt-4">
                {renderCategoryOverview(node, isEditing, editDescription, setEditDescription)}
              </TabsContent>

              <TabsContent value="details" className="space-y-4 mt-4">
                {renderDetailsTab(node)}
              </TabsContent>
            </Tabs>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-border">
            {isEditing ? (
              <div className="flex gap-2">
                <Button className="flex-1" onClick={handleSave} disabled={isSaving}>
                  <Save className="h-4 w-4 mr-2" />
                  {isSaving ? "Saving..." : "Save"}
                </Button>
                <Button variant="outline" onClick={cancelEdit} disabled={isSaving}>
                  Cancel
                </Button>
              </div>
            ) : (
              <Button className="w-full bg-transparent" variant="outline" onClick={startEdit} disabled={!onSave}>
                <Pencil className="h-4 w-4 mr-2" />
                Edit Node
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
