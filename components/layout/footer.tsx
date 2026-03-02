"use client"

import { Button } from "@/components/ui/button"
import { Download, Upload, RotateCcw, HelpCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface FooterProps {
  onExport?: () => void
  onImport?: () => void
  onReset?: () => void
  onRestartTour?: () => void
  isDashboard?: boolean
}

export function Footer({ onExport, onImport, onReset, onRestartTour, isDashboard = false }: FooterProps) {
  const handleExport = () => {
    onExport?.()
    // TODO: Implement JSON export
    console.log("Export JSON clicked")
  }

  const handleImport = () => {
    onImport?.()
    // TODO: Implement JSON import
    console.log("Import clicked")
  }

  const handleReset = () => {
    if (confirm("Are you sure you want to reset? This will clear all changes.")) {
      onReset?.()
      // TODO: Implement reset functionality
      console.log("Reset clicked")
    }
  }

  return (
    <footer className="border-t border-border mt-8 py-6">
      <div className="container mx-auto px-4 flex justify-between items-center">
        {!isDashboard && (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export JSON
            </Button>
            <Button variant="outline" size="sm" onClick={handleImport}>
              <Upload className="h-4 w-4 mr-2" />
              Import
            </Button>
            <Button variant="outline" size="sm" onClick={handleReset} className="text-red-500 hover:text-red-600 hover:border-red-500">
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>
        )}
        <div className={cn("flex items-center gap-3", isDashboard && "ml-auto")}>
          {onRestartTour && (
            <Button variant="ghost" size="sm" onClick={onRestartTour} className="text-muted-foreground hover:text-foreground">
              <HelpCircle className="h-4 w-4 mr-2" />
              Restart Tour
            </Button>
          )}
          <span className="text-sm text-muted-foreground">
            © 2025, Creating Preferred Futures - Website
          </span>
        </div>
      </div>
    </footer>
  )
}
