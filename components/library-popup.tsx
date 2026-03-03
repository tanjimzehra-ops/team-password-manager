"use client"

import { useState, useEffect, useMemo } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import { Search, Loader2, Link2 } from "lucide-react"
import type { NodeData } from "@/lib/types"
import { Id } from "@/convex/_generated/dataModel"

interface LibraryPopupProps {
  isOpen: boolean
  onClose: () => void
  category: "outcomes" | "value-chain" | "resources" | null
  items: any[]
  isConnecting: boolean
  onConnect: (ids: Id<"elements">[]) => Promise<void>
  onCopy: (ids: Id<"elements">[]) => Promise<void>
}

const categoryLabels = {
  outcomes: "Strategic Objectives",
  "value-chain": "Value Chain",
  resources: "Resources, Capabilities / Levers",
  purpose: "Purpose",
}

export function LibraryPopup({
  isOpen,
  onClose,
  category,
  items,
  isConnecting,
  onConnect,
  onCopy,
}: LibraryPopupProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedIds, setSelectedIds] = useState<Set<Id<"elements">>>(new Set())

  useEffect(() => {
    if (!isOpen) {
      setSelectedIds(new Set())
      setSearchQuery("")
    }
  }, [isOpen])

  const filteredItems = useMemo(() => {
    if (!category) return []
    // Map internal category name to Convex record type
    const convexTypeMap: Record<string, string> = {
      outcomes: "outcome",
      "value-chain": "value_chain",
      resources: "resource",
    }
    const targetType = convexTypeMap[category]

    return items.filter((item) => {
      if (item.elementType !== targetType) return false
      const q = searchQuery.toLowerCase()
      return (
        item.content.toLowerCase().includes(q) ||
        (item.description?.toLowerCase().includes(q) ?? false) ||
        item.systemName.toLowerCase().includes(q)
      )
    })
  }, [items, category, searchQuery])

  const groupedItems = useMemo(() => {
    return filteredItems.reduce((acc, item) => {
      if (!acc[item.systemName]) acc[item.systemName] = []
      acc[item.systemName].push(item)
      return acc
    }, {} as Record<string, any[]>)
  }, [filteredItems])

  const toggleItem = (id: Id<"elements">) => {
    const next = new Set(selectedIds)
    if (next.has(id)) {
      next.delete(id)
    } else {
      next.add(id)
    }
    setSelectedIds(next)
  }

  const handleConnect = async () => {
    if (selectedIds.size > 0) {
      await onConnect(Array.from(selectedIds))
      onClose()
    }
  }

  const handleCopy = async () => {
    if (selectedIds.size > 0) {
      await onCopy(Array.from(selectedIds))
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] h-[85vh] flex flex-col p-0 overflow-hidden bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-2xl font-black tracking-tight flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10">
              <span className="text-primary">Master Library</span>
            </div>
            {category && categoryLabels[category]}
          </DialogTitle>
        </DialogHeader>

        <div className="px-6 py-4 flex flex-col gap-4 flex-1 overflow-hidden">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder={`Search ${category ? categoryLabels[category].toLowerCase() : 'library'}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-11 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-xl"
            />
          </div>

          <ScrollArea className="flex-1 min-h-0 border border-slate-200 dark:border-slate-800 rounded-2xl bg-white/50 dark:bg-slate-900/50">
            <div className="p-4 space-y-6">
              {Object.keys(groupedItems).length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                  <p className="text-sm font-medium">No results found</p>
                </div>
              ) : (
                (Object.entries(groupedItems) as [string, any[]][]).map(([systemName, systemItems]) => (
                  <div key={systemName} className="space-y-2">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-1">
                      {systemName}
                    </h3>
                    <div className="space-y-1">
                      {systemItems.map((item: any) => (
                        <div
                          key={item._id}
                          onClick={() => toggleItem(item._id)}
                          className={cn(
                            "flex items-start gap-4 p-4 rounded-xl cursor-pointer transition-all border outline-none select-none",
                            selectedIds.has(item._id)
                              ? "bg-primary/5 border-primary/20"
                              : "bg-transparent border-transparent hover:bg-slate-100 dark:hover:bg-slate-800/50"
                          )}
                        >
                          <Checkbox
                            checked={selectedIds.has(item._id)}
                            onCheckedChange={() => toggleItem(item._id)}
                            className="mt-1 rounded-sm border-slate-300 dark:border-slate-700"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm leading-tight">
                              {item.content}
                            </h4>
                            {item.description && (
                              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                                {item.description}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </div>

        <DialogFooter className="p-6 pt-2 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex-row justify-between items-center sm:justify-between">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-2">
            {selectedIds.size} {selectedIds.size === 1 ? 'item' : 'items'} selected
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="rounded-xl font-bold uppercase tracking-widest text-[11px] border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900/30 dark:text-red-400 dark:hover:bg-red-900/20"
            >
              Cancel
            </Button>

            <Button
              variant="default"
              onClick={handleCopy}
              disabled={selectedIds.size === 0 || isConnecting}
              className={cn(
                "rounded-xl font-bold uppercase tracking-widest text-[11px] h-10 px-6 transition-all duration-300",
                selectedIds.size > 0
                  ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/20 active:scale-95"
                  : "bg-slate-200 dark:bg-slate-800 text-slate-400 opacity-50 cursor-not-allowed"
              )}
            >
              {isConnecting ? <Loader2 className="h-3 w-3 animate-spin mr-2" /> : null}
              Copy
            </Button>

            <Button
              onClick={handleConnect}
              disabled={selectedIds.size === 0 || isConnecting}
              className={cn(
                "rounded-xl font-bold uppercase tracking-widest text-[11px] h-10 px-6 transition-all duration-300",
                selectedIds.size > 0
                  ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20 active:scale-95"
                  : "bg-slate-200 dark:bg-slate-800 text-slate-400 opacity-50 cursor-not-allowed"
              )}
            >
              {isConnecting ? <Loader2 className="h-3 w-3 animate-spin mr-2" /> : <Link2 className="h-3 w-3 mr-2" />}
              Connect
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
