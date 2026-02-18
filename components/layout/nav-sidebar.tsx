"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, LayoutDashboard, FileText, Settings, User, Wrench, Plus, Loader2, Network, Shield } from "lucide-react"
import { cn } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"

interface SystemInfo {
  id: string
  name: string
  sector?: string | null
}

interface NavSidebarProps {
  isCollapsed: boolean
  onToggle: () => void
  selectedSystem?: string
  onSystemSelect?: (systemId: string) => void
  systems?: SystemInfo[]
  isLoading?: boolean
  showCanvas?: boolean
  onCanvasClick?: () => void
}

// Default static systems for fallback
const defaultSystems: SystemInfo[] = [
  { id: "mera", name: "MERA", sector: "Clean Energy" },
  { id: "kiraa", name: "Kiraa", sector: "AI Tech" },
  { id: "levur", name: "LEVUR", sector: "Biotech" },
  { id: "cpf_jigsaw", name: "CPF Jigsaw", sector: "Strategic Planning" },
  { id: "illawarra", name: "Illawarra Energy", sector: "Energy Storage" },
  { id: "central_highlands", name: "Central Highlands Council", sector: "Local Government" },
  { id: "council_2", name: "Central Highlands Council v2", sector: "Local Government - Strategic Plan" },
  { id: "relationships_au_tas", name: "Relationships Australia - Tas", sector: "Community Services" },
]

export function NavSidebar({
  isCollapsed,
  onToggle,
  selectedSystem = "",
  onSystemSelect,
  systems,
  isLoading = false,
  showCanvas = false,
  onCanvasClick
}: NavSidebarProps) {
  const [systemsExpanded, setSystemsExpanded] = useState(true)

  // Use provided systems or fallback to defaults
  const displaySystems = systems?.length ? systems : defaultSystems

  const DEMO_SYSTEMS = ["MERA", "Central Highlands", "Blank"]
  const filteredSystems = displaySystems.filter(s =>
    DEMO_SYSTEMS.some(name => s.name.includes(name))
  )

  // Find if selected system matches by ID or name
  const isSystemSelected = (system: SystemInfo) => {
    return selectedSystem === system.id || selectedSystem === system.name
  }

  return (
    <div
      className={cn(
        "flex flex-col transition-all duration-300 shrink-0 border-r border-border bg-background z-10",
        isCollapsed ? "w-16" : "w-60"
      )}
    >
      <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm flex-1 flex flex-col">
        {/* Toggle Button */}
        <Button
          variant="ghost"
          size="sm"
          className="w-full h-10 rounded-none border-b border-border flex items-center justify-center"
          onClick={onToggle}
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>

        {/* Navigation Items */}
        <div className="flex flex-col py-2 flex-1 overflow-y-auto">
          {/* Dashboard */}
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start gap-3 h-10 px-3 rounded-none text-muted-foreground",
              "hover:bg-muted/50 cursor-not-allowed opacity-50"
            )}
            disabled
          >
            <LayoutDashboard className="h-4 w-4 shrink-0" />
            {!isCollapsed && <span className="text-sm">Dashboard</span>}
          </Button>

          {/* Reports */}
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start gap-3 h-10 px-3 rounded-none text-muted-foreground",
              "hover:bg-muted/50 cursor-not-allowed opacity-50"
            )}
            disabled
          >
            <FileText className="h-4 w-4 shrink-0" />
            {!isCollapsed && <span className="text-sm">Reports</span>}
          </Button>

          {/* Agents Canvas */}
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start gap-3 h-10 px-3 rounded-none",
              showCanvas
                ? "bg-primary/10 text-primary font-medium"
                : "text-muted-foreground hover:bg-muted/50"
            )}
            onClick={onCanvasClick}
          >
            <Network className="h-4 w-4 shrink-0" />
            {!isCollapsed && <span className="text-sm">Canvas</span>}
          </Button>

          <Separator className="my-2" />

          {/* Systems Section */}
          <div>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start gap-3 h-10 px-3 rounded-none",
                "hover:bg-muted/50"
              )}
              onClick={() => !isCollapsed && setSystemsExpanded(!systemsExpanded)}
            >
              <Wrench className="h-4 w-4 shrink-0" />
              {!isCollapsed && (
                <>
                  <span className="text-sm font-medium flex-1 text-left">Systems</span>
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : systemsExpanded ? (
                    <ChevronRight className="h-4 w-4 rotate-90 transition-transform" />
                  ) : (
                    <ChevronRight className="h-4 w-4 transition-transform" />
                  )}
                </>
              )}
            </Button>

            {/* Systems List */}
            {!isCollapsed && systemsExpanded && (
              <div className="pl-11 pr-3 pb-2 space-y-1">
                {isLoading ? (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <>
                    {filteredSystems.map((system) => (
                      <Button
                        key={system.id}
                        variant="ghost"
                        size="sm"
                        className={cn(
                          "w-full justify-start gap-2 h-auto min-h-8 px-2 text-xs py-1",
                          isSystemSelected(system)
                            ? "bg-primary/10 text-primary font-medium"
                            : "text-muted-foreground hover:bg-muted/50"
                        )}
                        onClick={() => onSystemSelect?.(system.id)}
                      >
                        <span className={cn(
                          "w-2 h-2 rounded-full shrink-0", 
                          isSystemSelected(system) ? "bg-primary" : "bg-muted-foreground/30"
                        )} />
                        <div className="flex flex-col items-start overflow-hidden">
                          <span className="truncate w-full">{system.name}</span>
                          {system.sector && (
                            <span className="text-[10px] text-muted-foreground/70 truncate w-full">
                              {system.sector}
                            </span>
                          )}
                        </div>
                      </Button>
                    ))}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start gap-2 h-8 px-2 text-xs text-muted-foreground hover:bg-muted/50 opacity-50 cursor-not-allowed"
                      disabled
                    >
                      <Plus className="h-3 w-3" />
                      Add System
                    </Button>
                  </>
                )}
              </div>
            )}
          </div>

          <Separator className="my-2" />

          {/* Admin Console */}
          <Link href="/admin">
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start gap-3 h-10 px-3 rounded-none text-muted-foreground",
                "hover:bg-muted/50"
              )}
            >
              <Shield className="h-4 w-4 shrink-0" />
              {!isCollapsed && <span className="text-sm">Admin</span>}
            </Button>
          </Link>

          {/* Settings */}
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start gap-3 h-10 px-3 rounded-none text-muted-foreground",
              "hover:bg-muted/50 cursor-not-allowed opacity-50"
            )}
            disabled
          >
            <Settings className="h-4 w-4 shrink-0" />
            {!isCollapsed && <span className="text-sm">Settings</span>}
          </Button>

          {/* Profile */}
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start gap-3 h-10 px-3 rounded-none text-muted-foreground",
              "hover:bg-muted/50 cursor-not-allowed opacity-50"
            )}
            disabled
          >
            <User className="h-4 w-4 shrink-0" />
            {!isCollapsed && <span className="text-sm">Profile</span>}
          </Button>
        </div>
      </div>
    </div>
  )
}
