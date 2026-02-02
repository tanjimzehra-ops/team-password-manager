"use client"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
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
type ViewTab = "logic-model" | "contribution-map" | "development-pathways" | "convergence-map"

interface ViewControlsProps {
  showKpi: boolean
  onToggleKpi: (show: boolean) => void
  editMode?: EditMode
  onEditModeChange?: (mode: EditMode) => void
  activeTab?: ViewTab
  displayLogic?: boolean
  onDisplayLogicChange?: (show: boolean) => void
  onExport?: (format: "csv" | "excel" | "pdf") => void
}

export function ViewControls({ 
  showKpi, 
  onToggleKpi, 
  editMode = "view", 
  onEditModeChange,
  activeTab = "logic-model",
  displayLogic = false,
  onDisplayLogicChange,
  onExport,
}: ViewControlsProps) {
  // Determine which modes are available for the current view
  const availableModes: EditMode[] = 
    activeTab === "logic-model" || activeTab === "convergence-map"
      ? ["view", "edit", "colour", "order", "delete"]
      : ["view", "edit", "colour"]

  return (
    <div className="border-b border-border bg-background">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap items-center gap-4 py-4">
          {/* Display Logic checkbox - only for Logic Model */}
          {activeTab === "logic-model" && (
            <div className="flex items-center gap-2">
              <Checkbox 
                id="display-logic" 
                checked={displayLogic}
                onCheckedChange={(checked) => onDisplayLogicChange?.(checked === true)}
              />
              <Label htmlFor="display-logic" className="text-sm font-medium cursor-pointer text-foreground">
                Display Logic
              </Label>
            </div>
          )}

          <div className="flex items-center gap-2">
            <Label className="text-sm text-muted-foreground">Select Display:</Label>
            <Select defaultValue="stage">
              <SelectTrigger className="w-[110px] h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="stage">Stage</SelectItem>
                <SelectItem value="health">Health</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
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
                Show KPIs
              </Label>
              <Switch id="show-kpi" checked={showKpi} onCheckedChange={onToggleKpi} />
            </div>

            {onExport && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-9">
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
