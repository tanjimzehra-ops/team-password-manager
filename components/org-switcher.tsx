"use client"

import { Building2, ChevronsUpDown, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useOrg } from "@/hooks/use-org"
import { cn } from "@/lib/utils"

export function OrgSwitcher() {
  const { orgs, selectedOrgId, setSelectedOrgId, isLoading } = useOrg()

  if (isLoading || orgs.length === 0) return null

  const selectedOrg = orgs.find((o) => o.id === selectedOrgId)
  const displayName = selectedOrg?.name ?? "Select organisation"

  // Single org — show name without dropdown
  if (orgs.length === 1) {
    return (
      <div className="hidden md:flex items-center gap-2 px-3 py-1.5 text-sm text-muted-foreground">
        <Building2 className="h-4 w-4 shrink-0" />
        <span className="truncate max-w-[180px] font-medium">{orgs[0].name}</span>
      </div>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="hidden md:flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground max-w-[220px]"
        >
          <Building2 className="h-4 w-4 shrink-0" />
          <span className="truncate">{displayName}</span>
          <ChevronsUpDown className="h-3 w-3 shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[220px]">
        {orgs.map((org) => (
          <DropdownMenuItem
            key={org.id}
            onClick={() => setSelectedOrgId(org.id)}
            className="flex items-center gap-2"
          >
            <Check
              className={cn(
                "h-3 w-3 shrink-0",
                selectedOrgId === org.id ? "opacity-100" : "opacity-0"
              )}
            />
            <span className="truncate">{org.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
