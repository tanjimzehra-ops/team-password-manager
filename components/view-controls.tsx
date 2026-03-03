"use client"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { BarChart3, Download } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import {
  getAvailableModesForRole,
  type EditMode,
  type ViewTab,
  type UserRole,
} from "@/lib/rbac"

interface ViewControlsProps {
  showKpi: boolean
  onToggleKpi: (show: boolean) => void
  editMode?: EditMode
  onEditModeChange?: (mode: EditMode) => void
  activeTab?: ViewTab
  onExport?: (format: "csv" | "excel" | "pdf") => void
  userRole?: UserRole
  isDashboard?: boolean
}

export function ViewControls({
  showKpi,
  onToggleKpi,
  editMode = "view",
  onEditModeChange,
  activeTab = "logic-model",
  onExport,
  userRole,
  isDashboard = false,
}: ViewControlsProps) {
  const availableModes = getAvailableModesForRole(activeTab, userRole ?? null)

  return (
    <div className="border-b border-border/50 bg-background/60 backdrop-blur-md sticky top-0 z-40 w-full">
      <div className="px-6">
        <div className="flex flex-wrap items-center gap-4 py-4">
          {!isDashboard && (
            <div data-tour="toolbar-modes" className="flex items-center gap-2">
              <Label className="text-base font-bold text-muted-foreground mr-1">Select Mode:</Label>
              <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
                {availableModes.map((mode) => (
                  <Button
                    key={mode}
                    size="sm"
                    variant="ghost"
                    onClick={() => onEditModeChange?.(mode)}
                    className={cn(
                      "h-9 px-4 capitalize text-base font-bold",
                      editMode === mode
                        ? "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    )}
                  >
                    {mode}
                  </Button>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center gap-4 ml-auto">
            {!isDashboard && (
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="show-kpi" className="text-base font-bold text-muted-foreground mr-1">
                  Show Key Results
                </Label>
                <Switch id="show-kpi" checked={showKpi} onCheckedChange={onToggleKpi} className="scale-110" />
              </div>
            )}

            {onExport && !isDashboard && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button data-tour="export-button" variant="outline" size="default" className="h-10 text-base font-bold px-4">
                    <Download className="h-5 w-5 mr-2" />
                    Export
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Export Format</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => onExport("csv")}>
                    CSV (.csv)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onExport("excel")}>
                    Excel (.xlsx)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onExport("pdf")}>
                    PDF (.pdf)
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
