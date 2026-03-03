"use client"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { LogOut } from 'lucide-react'
import { useAuthBypass as useAuth } from "@/hooks/use-auth-bypass"
import { ThemeToggle } from "./theme-toggle"
import { OrgSwitcher } from "./org-switcher"
import { cn } from "@/lib/utils"

type ViewTab = "logic-model" | "contribution-map" | "development-pathways" | "convergence-map" | "canvas"

interface HeaderProps {
  activeTab?: ViewTab
  onTabChange?: (tab: ViewTab) => void
  systemName?: string | null
  isDashboard?: boolean
}

export function Header({
  activeTab = "logic-model",
  onTabChange,
  systemName = null,
  isDashboard = false
}: HeaderProps) {
  const auth = useAuth()
  const { user } = auth
  const signOut = "signOut" in auth ? auth.signOut : undefined

  return (
    <>
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-white dark:bg-slate-900">
        <div className="px-4">
          <div className="flex h-14 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-4">
              <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center text-white font-black text-lg shadow-md">
                J
              </div>
              <span className="font-black text-2xl text-foreground tracking-tighter">Jigsaw</span>
            </div>

            {/* Org Switcher */}
            {user && <OrgSwitcher />}

            {/* Right side */}
            <div className="flex items-center gap-3">
              {user && (
                <div className="hidden sm:flex items-center gap-3 text-base">
                  <Avatar className="h-9 w-9">
                    {user.profilePictureUrl && (
                      <AvatarImage src={user.profilePictureUrl} alt={user.firstName ?? user.email ?? ""} />
                    )}
                    <AvatarFallback className="text-sm font-bold bg-muted">
                      {(user.firstName?.[0] ?? "").toUpperCase()}{(user.lastName?.[0] ?? "").toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-semibold text-muted-foreground">
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
                  onClick={() => signOut?.({ returnTo: "/" })}
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
        <div className="px-5 py-4">
          <h1 className="text-xl font-medium text-foreground tracking-tight">
            {systemName ? (
              <>
                creating Preferred Futures: <span className="font-black text-primary">{systemName}</span>
              </>
            ) : (
              <span className="font-black">Jigsaw</span>
            )}
          </h1>
        </div>
      </div>

      {/* View Tabs */}
      {!isDashboard && (
        <div className="border-b border-border bg-background">
          <div className="px-4">
            <nav data-tour="view-tabs" className="flex items-center gap-1 py-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onTabChange?.("logic-model")}
                className={cn(
                  "text-base font-bold rounded-md px-5 py-2.5",
                  activeTab === "logic-model"
                    ? "bg-teal-700 text-white shadow-sm"
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
                  "text-base font-bold rounded-md px-5 py-2.5",
                  activeTab === "convergence-map"
                    ? "bg-teal-700 text-white shadow-sm"
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
                  "text-base font-bold rounded-md px-5 py-2.5",
                  activeTab === "contribution-map"
                    ? "bg-teal-700 text-white shadow-sm"
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
                  "text-base font-bold rounded-md px-5 py-2.5",
                  activeTab === "development-pathways"
                    ? "bg-teal-700 text-white shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                Development Pathways
              </Button>
            </nav>
          </div>
        </div>
      )}
    </>
  )
}
