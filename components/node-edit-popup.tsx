"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

interface NodeEditPopupProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  initialTitle?: string
  initialDescription?: string
  onSave: (data: { title: string; description: string }) => void
}

export function NodeEditPopup({
  isOpen,
  onClose,
  onSave,
  title = "Edit Node",
  initialTitle = "",
  initialDescription = "",
}: NodeEditPopupProps) {
  const [titleValue, setTitleValue] = useState(initialTitle)
  const [descriptionValue, setDescriptionValue] = useState(initialDescription)

  // Reset fields when popup opens
  useEffect(() => {
    if (isOpen) {
      setTitleValue(initialTitle)
      setDescriptionValue(initialDescription)
    }
  }, [isOpen, initialTitle, initialDescription])

  const handleSave = () => {
    onSave({
      title: titleValue.trim(),
      description: descriptionValue,
    })
    onClose()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      handleSave()
    }
    if (e.key === "Escape") {
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity"
        onClick={onClose}
      />

      {/* Small Centered Popup */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className={cn(
            "bg-background border border-border rounded-lg shadow-2xl",
            "w-full max-w-md",
            "transform transition-all duration-200 ease-out",
            "opacity-100 scale-100"
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h3 className="text-lg font-semibold text-foreground">{title}</h3>
            <Button variant="ghost" size="icon" onClick={onClose} className="h-6 w-6">
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="p-4 space-y-4">
            {/* Title Field */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-medium">
                Title
              </Label>
              <Textarea
                id="title"
                value={titleValue}
                onChange={(e) => setTitleValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Enter node title..."
                className="min-h-[60px] resize-none text-sm"
                autoFocus
              />
            </div>

            {/* Description Field */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium">
                Description
              </Label>
              <Textarea
                id="description"
                value={descriptionValue}
                onChange={(e) => setDescriptionValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Enter node description..."
                className="min-h-[100px] resize-y text-sm"
              />
            </div>

            <p className="text-xs text-muted-foreground">
              Press Ctrl+Enter to save, Esc to cancel
            </p>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2 p-4 border-t border-border">
            <Button variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleSave}>
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
