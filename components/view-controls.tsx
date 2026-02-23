"use client"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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

type EditMode = "view" | "edit" | "colour" | "order" | "delete"
type ViewTab = "logic-model" | "contribution-map" | "development-pathways" | "convergence-map" | "canvas"
type UserRole = "super_admin" | "admin" | "viewer" | "channel_partner"

interface ViewControlsProps {
  showKpi: boolean
  onToggleKpi: (show: boolean) => void
  editMode?: EditMode
  onEditModeChange?: (mode: EditMode) => void
  activeTab?: ViewTab
  displayMode?: "stage" | "performance"
  onDisplayModeChange?: (mode: "stage" | "performance") => void
  onExport?: (format: "csv" | "excel" | "pdf") => void
  userRole?: UserRole
}

export function ViewControls({
  showKpi,
  onToggleKpi,
  editMode = "view",
  onEditModeChange,
  activeTab = "logic-model",
  displayMode,
  onDisplayModeChange,
  onExport,
  userRole,
}: ViewControlsProps) {
  // Determine which modes are available for the current view and user role
  const getAvailableModes = (): EditMode[] => {
    // Viewers can only access view and colour modes
    if (userRole === "viewer") {
      return ["view", "colour"]
    }

    // Admin users get full access based on the active tab
    if (activeTab === "logic-model" || activeTab === "convergence-map") {
      return ["view", "edit", "colour", "order", "delete"]
    }
    return ["view", "edit", "colour"]
  }

  const availableModes = getAvailableModes()

  return (
    <div className="border-b border-border bg-background">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap items-center gap-4 py-4">
          <div className="flex items-center gap-2">
            <Label className="text-sm text-muted-foreground">Select Display:</Label>
            <Select
              value={displayMode || "stage"}
              onValueChange={(val) => onDisplayModeChange?.(val as "stage" | "performance")}
            >
              <SelectTrigger className="w-[130px] h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="stage">Stage</SelectItem>
                <SelectItem value="performance">Performance</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div data-tour="toolbar-modes" className="flex items-center gap-2">
            <Label className="text-sm text-muted-foreground">Select Mode:</Label>
            <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
              {availableModes.map((mode) => (
                <Button
                  key={mode}
                  size="sm"
                  variant="ghost"
                  onClick={() => onEditModeChange?.(mode)}
                  className={cn(
                    "h-7 capitalize",
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

          <div className="flex items-center gap-4 ml-auto">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
              <Label htmlFor="show-kpi" className="text-sm text-muted-foreground">
                Show Key Results
              </Label>
              <Switch id="show-kpi" checked={showKpi} onCheckedChange={onToggleKpi} />
            </div>

            {onExport && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button data-tour="export-button" variant="outline" size="sm" className="h-9">
                    <Download className="h-4 w-4 mr-2" />
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
