"use client"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { LogOut } from 'lucide-react'
import { useAuth } from "@workos-inc/authkit-nextjs/components"
import { ThemeToggle } from "./theme-toggle"
import { OrgSwitcher } from "./org-switcher"
import { cn } from "@/lib/utils"

type ViewTab = "logic-model" | "contribution-map" | "development-pathways" | "convergence-map" | "canvas"

interface HeaderProps {
  activeTab?: ViewTab
  onTabChange?: (tab: ViewTab) => void
  systemName?: string
}

export function Header({ activeTab = "logic-model", onTabChange, systemName = "MERA" }: HeaderProps) {
  const { user, signOut, loading } = useAuth()

  return (
    <>
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-white dark:bg-slate-900">
        <div className="px-4">
          <div className="flex h-14 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                J
              </div>
              <span className="font-semibold text-lg text-foreground">Jigsaw</span>
            </div>

            {/* Org Switcher */}
            {user && <OrgSwitcher />}

            {/* Right side */}
            <div className="flex items-center gap-3">
              {user && (
                <div className="hidden sm:flex items-center gap-2 text-sm">
                  <Avatar className="h-7 w-7">
                    {user.profilePictureUrl && (
                      <AvatarImage src={user.profilePictureUrl} alt={user.firstName ?? user.email ?? ""} />
                    )}
                    <AvatarFallback className="text-xs bg-muted">
                      {(user.firstName?.[0] ?? "").toUpperCase()}{(user.lastName?.[0] ?? "").toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium text-muted-foreground">
                    {user.firstName ? `Hello, ${user.firstName}` : `Hello, ${user.email}`}
                  </span>
                </div>
              )}
              <ThemeToggle />
              {user && (
                <Button
                  data-tour="sign-out"
                  variant="ghost"
                  size="sm"
                  onClick={() => signOut({ returnTo: "/" })}
                  className="text-muted-foreground hover:text-foreground hover:bg-muted"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Sign out</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Project Title Bar */}
      <div className="border-b border-border bg-muted/30">
        <div className="px-4 py-3">
          <h1 className="text-lg font-medium text-foreground">
            creating Preferred Futures: <span className="font-bold">{systemName}</span>
          </h1>
        </div>
      </div>

      {/* View Tabs */}
      <div className="border-b border-border bg-background">
        <div className="px-4">
          <nav data-tour="view-tabs" className="flex items-center gap-1 py-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onTabChange?.("logic-model")}
              className={cn(
                "text-sm font-medium rounded-md px-4 py-2",
                activeTab === "logic-model"
                  ? "bg-teal-700 text-white"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              Logic Model
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onTabChange?.("convergence-map")}
              className={cn(
                "text-sm font-medium rounded-md px-4 py-2",
                activeTab === "convergence-map"
                  ? "bg-teal-700 text-white"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              Convergence Map
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onTabChange?.("contribution-map")}
              className={cn(
                "text-sm font-medium rounded-md px-4 py-2",
                activeTab === "contribution-map"
                  ? "bg-teal-700 text-white"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              Contribution Map
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onTabChange?.("development-pathways")}
              className={cn(
                "text-sm font-medium rounded-md px-4 py-2",
                activeTab === "development-pathways"
                  ? "bg-teal-700 text-white"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              Development Pathways
            </Button>
          </nav>
        </div>
      </div>
    </>
  )
}
