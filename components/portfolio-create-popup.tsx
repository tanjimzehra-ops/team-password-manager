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
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { X, Plus, CheckCircle2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export interface Portfolio {
  id: string
  title: string
  description?: string
  date: string
  progress: number
  status: "active" | "planning" | "completed"
}

interface PortfolioCreatePopupProps {
  isOpen: boolean
  onClose: () => void
  onSave: (portfolio: Omit<Portfolio, "id">) => void
  existingPortfolios?: Portfolio[]
}

export function PortfolioCreatePopup({
  isOpen,
  onClose,
  onSave,
  existingPortfolios = [],
}: PortfolioCreatePopupProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [date, setDate] = useState("")
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState<"active" | "planning" | "completed">("planning")
  const [portfolios, setPortfolios] = useState<Portfolio[]>(existingPortfolios)
  const [showList, setShowList] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (isOpen) {
      setTitle("")
      setDescription("")
      setDate("")
      setProgress(0)
      setStatus("planning")
      setShowList(false)
      setPortfolios(existingPortfolios)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only reset when dialog opens; existingPortfolios changes every render and would clear typing
  }, [isOpen])

  const handleSave = () => {
    if (!title.trim()) {
      toast({
        title: "Validation error",
        description: "Please enter a portfolio title.",
        variant: "destructive",
      })
      return
    }

    const newPortfolio: Omit<Portfolio, "id"> = {
      title: title.trim(),
      description: description.trim() || undefined,
      date: date || new Date().toLocaleDateString("en-AU", { month: "short", year: "numeric" }),
      progress,
      status,
    }

    onSave(newPortfolio)

    const portfolioWithId: Portfolio = {
      ...newPortfolio,
      id: `portfolio-${Date.now()}`,
    }
    setPortfolios((prev) => [...prev, portfolioWithId])
    setShowList(true)

    setTitle("")
    setDescription("")
    setDate("")
    setProgress(0)
    setStatus("planning")
  }

  const handleCancel = () => {
    setShowList(false)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleCancel}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5 text-primary" />
            {showList ? "Portfolios" : "Create New Portfolio"}
          </DialogTitle>
        </DialogHeader>

        {showList ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {portfolios.length} portfolio{portfolios.length !== 1 ? "s" : ""} created
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowList(false)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Another
              </Button>
            </div>

            <ScrollArea className="h-[400px] border rounded-lg">
              {portfolios.length === 0 ? (
                <div className="flex items-center justify-center h-full p-8">
                  <p className="text-muted-foreground text-sm">No portfolios yet</p>
                </div>
              ) : (
                <div className="p-4 space-y-4">
                  {portfolios.map((portfolio) => (
                    <div key={portfolio.id} className="space-y-2 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-sm text-foreground">{portfolio.title}</p>
                          {portfolio.description && (
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                              {portfolio.description}
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground mt-1">{portfolio.date}</p>
                        </div>
                        <Badge
                          variant={portfolio.status === "active" ? "default" : "secondary"}
                          className="text-xs shrink-0 ml-2"
                        >
                          {portfolio.status}
                        </Badge>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">{portfolio.progress}% complete</span>
                        </div>
                        <Progress value={Math.max(0, Math.min(100, portfolio.progress))} className="h-2" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="portfolio-title">Title *</Label>
                <Input
                  id="portfolio-title"
                  placeholder="e.g., Solar Waste Q1 2026"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  autoFocus
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="portfolio-description">Description</Label>
                <Textarea
                  id="portfolio-description"
                  placeholder="Enter portfolio description..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="min-h-[100px] resize-y"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="portfolio-date">Date</Label>
                  <Input
                    id="portfolio-date"
                    type="text"
                    placeholder="e.g., Jan 2026"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="portfolio-progress">Progress (%)</Label>
                  <Input
                    id="portfolio-progress"
                    type="number"
                    min="0"
                    max="100"
                    placeholder="0"
                    value={progress}
                    onChange={(e) => setProgress(Math.max(0, Math.min(100, parseInt(e.target.value) || 0)))}
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="portfolio-status">Status</Label>
                <div className="flex gap-2">
                  {(["planning", "active", "completed"] as const).map((statusOption) => (
                    <Button
                      key={statusOption}
                      type="button"
                      variant={status === statusOption ? "default" : "outline"}
                      size="sm"
                      onClick={() => setStatus(statusOption)}
                      className="capitalize"
                    >
                      {statusOption}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        <DialogFooter className="flex gap-2">
          {showList ? (
            <Button variant="outline" onClick={handleCancel} className="flex-1">
              Close
            </Button>
          ) : (
            <>
              <Button variant="outline" onClick={handleCancel}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={handleSave}>
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Save Portfolio
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
