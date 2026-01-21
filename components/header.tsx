"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { LogOut } from 'lucide-react'
import { ThemeToggle } from "./theme-toggle"
import { cn } from "@/lib/utils"

type ViewTab = "logic-model" | "contribution-map" | "development-pathways" | "convergence-map"

interface HeaderProps {
  activeTab?: ViewTab
  onTabChange?: (tab: ViewTab) => void
  systemName?: string
}

export function Header({ activeTab = "logic-model", onTabChange, systemName = "MERA" }: HeaderProps) {
  return (
    <>
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-slate-900">
        <div className="px-4">
          <div className="flex h-14 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                J
              </div>
              <span className="font-semibold text-lg text-white">Jigsaw</span>
            </div>

            {/* Center Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              <Button variant="ghost" size="sm" className="text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800">
                Clients
              </Button>
              <Button variant="ghost" size="sm" className="text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800">
                Admin
              </Button>
            </nav>

            {/* Right side */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 text-sm">
                <span className="font-medium text-slate-300">Hello, User</span>
              </div>
              <ThemeToggle />
              <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white hover:bg-slate-800">
                <LogOut className="h-4 w-4 mr-2" />
                Log out
              </Button>
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
          <nav className="flex items-center gap-1 py-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onTabChange?.("logic-model")}
              className={cn(
                "text-sm font-medium rounded-md px-4 py-2",
                activeTab === "logic-model"
                  ? "bg-slate-800 text-white"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              Logic Model
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onTabChange?.("contribution-map")}
              className={cn(
                "text-sm font-medium rounded-md px-4 py-2",
                activeTab === "contribution-map"
                  ? "bg-slate-800 text-white"
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
                  ? "bg-slate-800 text-white"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              Development Pathways
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onTabChange?.("convergence-map")}
              className={cn(
                "text-sm font-medium rounded-md px-4 py-2",
                activeTab === "convergence-map"
                  ? "bg-slate-800 text-white"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              Convergence Map
            </Button>
          </nav>
        </div>
      </div>
    </>
  )
}
