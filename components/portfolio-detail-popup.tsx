"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Pencil, Trash2 } from "lucide-react"

export interface PortfolioDetail {
  id: string
  title: string
  description?: string
  date: string
  progress: number
  status: "planning" | "active" | "completed"
}

interface PortfolioDetailPopupProps {
  portfolio: PortfolioDetail | null
  isOpen: boolean
  onClose: () => void
  onUpdate?: (id: string, data: Partial<PortfolioDetail>) => void
  onDelete?: (id: string) => void
}

export function PortfolioDetailPopup({
  portfolio,
  isOpen,
  onClose,
  onUpdate,
  onDelete,
}: PortfolioDetailPopupProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [date, setDate] = useState("")
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState<"planning" | "active" | "completed">("planning")

  useEffect(() => {
    if (portfolio) {
      setTitle(portfolio.title)
      setDescription(portfolio.description ?? "")
      setDate(portfolio.date)
      setProgress(portfolio.progress)
      setStatus(portfolio.status)
      setIsEditing(false)
      setConfirmDelete(false)
    }
  }, [portfolio, isOpen])

  const handleSave = () => {
    if (!portfolio || !onUpdate) return
    onUpdate(portfolio.id, { title, description, date, progress, status })
    setIsEditing(false)
  }

  const handleDelete = () => {
    if (!portfolio || !onDelete) return
    if (!confirmDelete) {
      setConfirmDelete(true)
      return
    }
    onDelete(portfolio.id)
    onClose()
  }

  const handleCancelDelete = () => {
    setConfirmDelete(false)
  }

  if (!portfolio) return null

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) { setConfirmDelete(false); onClose() } }}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{portfolio.title}</span>
            <div className="flex gap-2">
              {!isEditing ? (
                <Button variant="ghost" size="icon" onClick={() => setIsEditing(true)} title="Edit">
                  <Pencil className="h-4 w-4" />
                </Button>
              ) : null}
              {onDelete && !confirmDelete && (
                <Button variant="ghost" size="icon" onClick={handleDelete} className="text-destructive hover:text-destructive" title="Delete">
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </DialogTitle>
        </DialogHeader>

        {confirmDelete ? (
          <div className="space-y-4 py-4">
            <p className="text-sm text-foreground">
              Are you sure you want to delete portfolio <strong>&ldquo;{portfolio.title}&rdquo;</strong>? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={handleCancelDelete}>
                Cancel
              </Button>
              <Button variant="destructive" size="sm" onClick={handleDelete}>
                Confirm Delete
              </Button>
            </div>
          </div>
        ) : isEditing ? (
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="pd-title">Title</Label>
              <Input id="pd-title" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="pd-desc">Description</Label>
              <Textarea id="pd-desc" value={description} onChange={(e) => setDescription(e.target.value)} className="min-h-[80px]" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="pd-date">Date</Label>
                <Input id="pd-date" value={date} onChange={(e) => setDate(e.target.value)} placeholder="e.g., Jan 2026" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="pd-progress">Progress (%)</Label>
                <Input
                  id="pd-progress"
                  type="number"
                  min={0}
                  max={100}
                  value={progress}
                  onChange={(e) => setProgress(Math.max(0, Math.min(100, parseInt(e.target.value) || 0)))}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Status</Label>
              <div className="flex gap-2">
                {(["planning", "active", "completed"] as const).map((s) => (
                  <Button
                    key={s}
                    type="button"
                    variant={status === s ? "default" : "outline"}
                    size="sm"
                    onClick={() => setStatus(s)}
                    className="capitalize"
                  >
                    {s}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            <div>
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Description</h4>
              <p className="text-sm text-foreground leading-relaxed">
                {portfolio.description || "No description added."}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Date</h4>
                <p className="text-sm font-medium">{portfolio.date}</p>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Status</h4>
                <Badge variant={portfolio.status === "active" ? "default" : "secondary"} className="capitalize">
                  {portfolio.status}
                </Badge>
              </div>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Progress</h4>
              <div className="flex items-center gap-3">
                <Progress value={Math.max(0, Math.min(100, portfolio.progress))} className="h-3 flex-1" />
                <span className="text-sm font-medium shrink-0">{portfolio.progress}%</span>
              </div>
            </div>
          </div>
        )}

        <DialogFooter>
          {isEditing && !confirmDelete ? (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
              <Button onClick={handleSave}>Save Changes</Button>
            </>
          ) : !confirmDelete ? (
            <Button variant="outline" onClick={onClose}>Close</Button>
          ) : null}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
