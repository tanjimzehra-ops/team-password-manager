"use client"

import { useState } from "react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const CELL_COLORS = [
  { name: "Default", value: "default", class: "bg-card" },
  { name: "Primary", value: "primary", class: "bg-primary/20" },
  { name: "Green", value: "green", class: "bg-emerald-100 dark:bg-emerald-900/30" },
  { name: "Teal", value: "teal", class: "bg-teal-100 dark:bg-teal-900/30" },
  { name: "Blue", value: "blue", class: "bg-blue-100 dark:bg-blue-900/30" },
  { name: "Purple", value: "purple", class: "bg-purple-100 dark:bg-purple-900/30" },
  { name: "Pink", value: "pink", class: "bg-pink-100 dark:bg-pink-900/30" },
  { name: "Orange", value: "orange", class: "bg-orange-100 dark:bg-orange-900/30" },
  { name: "Yellow", value: "yellow", class: "bg-yellow-100 dark:bg-yellow-900/30" },
  { name: "Red", value: "red", class: "bg-red-100 dark:bg-red-900/30" },
]

const GRADIENT_LEVELS = [
  { name: "Light", value: 25, opacity: "opacity-25" },
  { name: "Medium-Light", value: 50, opacity: "opacity-50" },
  { name: "Medium", value: 75, opacity: "opacity-75" },
  { name: "Full", value: 100, opacity: "opacity-100" },
]

interface ColorPickerPopoverProps {
  children: React.ReactNode
  currentColor?: string
  currentGradient?: number
  onColorChange: (color: string, gradient?: number) => void
  showGradient?: boolean
}

export function ColorPickerPopover({
  children,
  currentColor = "default",
  currentGradient = 100,
  onColorChange,
  showGradient = true,
}: ColorPickerPopoverProps) {
  const [selectedColor, setSelectedColor] = useState(currentColor)
  const [selectedGradient, setSelectedGradient] = useState(currentGradient)
  const [isOpen, setIsOpen] = useState(false)

  const handleColorSelect = (color: string) => {
    setSelectedColor(color)
    onColorChange(color, selectedGradient)
  }

  const handleGradientSelect = (gradient: number) => {
    setSelectedGradient(gradient)
    onColorChange(selectedColor, gradient)
  }

  const handleApply = () => {
    onColorChange(selectedColor, selectedGradient)
    setIsOpen(false)
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="w-64 p-4" align="start">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Cell Color</label>
            <div className="grid grid-cols-5 gap-2">
              {CELL_COLORS.map((color) => (
                <button
                  key={color.value}
                  onClick={() => handleColorSelect(color.value)}
                  className={cn(
                    "w-8 h-8 rounded-md border-2 transition-all hover:scale-110",
                    color.class,
                    selectedColor === color.value ? "border-primary ring-2 ring-primary/30" : "border-border"
                  )}
                  title={color.name}
                />
              ))}
            </div>
          </div>
          {showGradient && (
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Intensity</label>
              <div className="flex gap-2">
                {GRADIENT_LEVELS.map((level) => (
                  <button
                    key={level.value}
                    onClick={() => handleGradientSelect(level.value)}
                    className={cn(
                      "flex-1 h-8 rounded-md border-2 transition-all bg-primary",
                      level.opacity,
                      selectedGradient === level.value ? "border-primary ring-2 ring-primary/30" : "border-border"
                    )}
                    title={level.name}
                  />
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {GRADIENT_LEVELS.find((l) => l.value === selectedGradient)?.name}
              </p>
            </div>
          )}
          <div className="flex justify-end gap-2 pt-2 border-t">
            <Button variant="outline" size="sm" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button size="sm" onClick={handleApply}>Apply</Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export function getCellColorClass(color: string, gradient = 100): string {
  const colorObj = CELL_COLORS.find((c) => c.value === color)
  const gradientObj = GRADIENT_LEVELS.find((g) => g.value === gradient)
  if (!colorObj) return "bg-card"
  return cn(colorObj.class, gradientObj?.opacity || "opacity-100")
}
