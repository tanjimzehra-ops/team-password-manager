"use client"

import { useState, useEffect } from "react"
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
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Search, Link2, Copy, X, Library } from "lucide-react"
import type { NodeData } from "@/lib/types"

interface LibraryItem {
  id: string
  sharedId?: string
  title: string
  description?: string
  systemName: string
  systemId: string
  color?: NodeData["color"]
  category: NodeData["category"]
}

interface LibraryPopupProps {
  isOpen: boolean
  onClose: () => void
  category: "outcomes" | "value-chain" | "resources"
  currentSystemId: string
  currentSystemName: string
  onConnect: (item: LibraryItem) => void
  onCopy: (item: LibraryItem) => void
  items: LibraryItem[]
}

const categoryLabels = {
  outcomes: "Strategic Objectives",
  "value-chain": "Value Chain",
  resources: "Resources, Capabilities / Levers",
}

const categoryColors = {
  outcomes: "bg-blue-500",
  "value-chain": "bg-emerald-500",
  resources: "bg-amber-500",
}

export function LibraryPopup({
  isOpen,
  onClose,
  category,
  currentSystemId,
  currentSystemName,
  onConnect,
  onCopy,
  items,
}: LibraryPopupProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedItem, setSelectedItem] = useState<LibraryItem | null>(null)

  useEffect(() => {
    if (!isOpen) {
      setSelectedItem(null)
      setSearchQuery("")
    }
  }, [isOpen])

  const filteredItems = items.filter((item) => {
    if (item.category !== category) return false
    const q = searchQuery.toLowerCase()
    return (
      item.title.toLowerCase().includes(q) ||
      item.systemName.toLowerCase().includes(q) ||
      (item.description?.toLowerCase().includes(q) ?? false)
    )
  })

  const groupedItems = filteredItems.reduce(
    (acc, item) => {
      if (!acc[item.systemName]) acc[item.systemName] = []
      acc[item.systemName].push(item)
      return acc
    },
    {} as Record<string, LibraryItem[]>
  )

  const handleConnect = () => {
    if (selectedItem) {
      onConnect(selectedItem)
      onClose()
    }
  }

  const handleCopy = () => {
    if (selectedItem) {
      onCopy(selectedItem)
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] flex flex-col overflow-hidden min-h-0">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Library className="h-5 w-5 text-primary" />
            {categoryLabels[category]} Library
          </DialogTitle>
        </DialogHeader>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search library..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        <ScrollArea className="flex-1 border rounded-lg min-h-0">
          {Object.keys(groupedItems).length === 0 ? (
            <div className="flex items-center justify-center h-full p-4">
              <p className="text-muted-foreground text-sm">No items found</p>
            </div>
          ) : (
            <div className="p-2 space-y-4">
              {Object.entries(groupedItems).map(([systemName, systemItems]) => (
                <div key={systemName}>
                  <div className="sticky top-0 bg-background px-2 py-1 mb-2 z-10">
                    <Badge variant="outline" className="text-xs">
                      {systemName}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    {systemItems.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setSelectedItem(item)}
                        className={cn(
                          "w-full text-left px-3 py-2 rounded-md transition-colors",
                          "hover:bg-muted/50",
                          selectedItem?.id === item.id
                            ? "bg-primary/10 border border-primary/30"
                            : "border border-transparent"
                        )}
                      >
                        <div className="flex items-start gap-2">
                          <div
                            className={cn(
                              "w-2 h-2 rounded-full mt-1.5 shrink-0",
                              categoryColors[category]
                            )}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{item.title}</p>
                            {item.description && (
                              <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                                {item.description}
                              </p>
                            )}
                          </div>
                          {item.systemId === currentSystemId && (
                            <Badge variant="secondary" className="text-[10px] shrink-0">
                              Current
                            </Badge>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        {selectedItem && (
          <div className="bg-muted/30 rounded-lg p-3 border">
            <p className="text-xs text-muted-foreground mb-1">Selected:</p>
            <p className="font-medium text-sm">{selectedItem.title}</p>
            <p className="text-xs text-muted-foreground">From: {selectedItem.systemName}</p>
          </div>
        )}

        <DialogFooter className="flex gap-2 sm:gap-2">
          <Button variant="outline" onClick={onClose} className="flex-1 sm:flex-none">
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button
            variant="outline"
            onClick={handleCopy}
            disabled={!selectedItem}
            className="flex-1 sm:flex-none"
          >
            <Copy className="h-4 w-4 mr-2" />
            Copy
          </Button>
          <Button onClick={handleConnect} disabled={!selectedItem} className="flex-1 sm:flex-none">
            <Link2 className="h-4 w-4 mr-2" />
            Connect
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
