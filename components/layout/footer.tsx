"use client"

import { Button } from "@/components/ui/button"
import { Download, Upload, RotateCcw } from "lucide-react"

interface FooterProps {
  onExport?: () => void
  onImport?: () => void
  onReset?: () => void
}

export function Footer({ onExport, onImport, onReset }: FooterProps) {
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
        <span className="text-sm text-muted-foreground">
          © 2025, Creating Preferred Futures - Website
        </span>
      </div>
    </footer>
  )
}
