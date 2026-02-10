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
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

interface NodeEditDialogProps {
  isOpen: boolean
  onClose: () => void
  onSave: (content: string) => void
  initialContent?: string
  title?: string
  cellType?: "logic" | "contribution" | "development" | "convergence" | "kpi"
}

export function NodeEditDialog({
  isOpen,
  onClose,
  onSave,
  initialContent = "",
  title = "Edit Cell",
  cellType = "contribution",
}: NodeEditDialogProps) {
  const [content, setContent] = useState(initialContent)

  useEffect(() => {
    if (isOpen) setContent(initialContent)
  }, [isOpen, initialContent])

  const handleSave = () => {
    onSave(content)
    onClose()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) handleSave()
  }

  const getPlaceholder = () => {
    switch (cellType) {
      case "contribution": return "Describe how this Value Chain element contributes to this Outcome..."
      case "development": return "Describe the development pathway for this Value Chain and Resource..."
      case "convergence": return "Describe the relationship with this External Factor..."
      case "kpi": return "Enter KPI metric or indicator..."
      default: return "Enter content..."
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={getPlaceholder()}
              className="min-h-[120px] resize-y"
              autoFocus
            />
            <p className="text-xs text-muted-foreground">Press Ctrl+Enter to save</p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
