"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { NodeData } from "@/lib/types"

interface InlineColorPickerProps {
  currentColor: NodeData["color"]
  onColorSelect: (color: NodeData["color"]) => void
}

const colorOptions: { value: NodeData["color"]; label: string; class: string }[] = [
  { value: "none", label: "Default", class: "bg-muted text-muted-foreground hover:bg-muted/80 border" },
  { value: "primary", label: "Primary", class: "bg-teal-500 hover:bg-teal-600 border-transparent text-white" },
  { value: "secondary", label: "Secondary", class: "bg-blue-500 hover:bg-blue-600 border-transparent text-white" },
  { value: "accent", label: "Accent", class: "bg-orange-500 hover:bg-orange-600 border-transparent text-white" },
  { value: "muted", label: "Muted", class: "bg-green-500 hover:bg-green-600 border-transparent text-white" },
]
export function InlineColorPicker({ currentColor, onColorSelect }: InlineColorPickerProps) {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm rounded-lg">
      <div
        className="bg-background border border-border rounded-lg shadow-2xl p-4 space-y-3"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-sm font-medium text-foreground text-center mb-2">Select Color</p>
        <div className="grid grid-cols-2 gap-2">
          {colorOptions.map((color) => (
            <Button
              key={color.value}
              variant="outline"
              size="sm"
              onClick={() => onColorSelect(color.value)}
              className={cn(
                "h-10 text-sm font-medium w-full px-2",
                color.class,
                currentColor === color.value && "ring-2 ring-foreground ring-offset-2 ring-offset-background"
              )}
            >
              {color.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}
