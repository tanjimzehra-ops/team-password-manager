"use client"

import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { LogIn } from "lucide-react"

export function LandingPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-white dark:bg-slate-900">
        <div className="px-4">
          <div className="flex h-14 items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                J
              </div>
              <span className="font-semibold text-lg text-foreground">Jigsaw</span>
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <Button asChild size="sm">
                <a href="/sign-in">Sign in</a>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="max-w-lg w-full text-center space-y-8">
          {/* Logo mark */}
          <div className="flex justify-center">
            <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center text-white font-bold text-3xl shadow-lg">
              J
            </div>
          </div>

          {/* Copy */}
          <div className="space-y-3">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Jigsaw
            </h1>
            <p className="text-lg text-muted-foreground">
              Strategic Planning System
            </p>
          </div>

          <p className="text-muted-foreground leading-relaxed">
            Visualise and manage your organisation&rsquo;s strategy through Logic Models,
            Contribution Maps, Development Pathways, and Convergence Maps.
          </p>

          {/* CTA */}
          <Button asChild size="lg" className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-md px-8">
            <a href="/sign-in">
              <LogIn className="h-4 w-4 mr-2" />
              Sign in to get started
            </a>
          </Button>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6 text-center text-sm text-muted-foreground">
        creating Preferred Futures
      </footer>
    </div>
  )
}
