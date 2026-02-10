"use client"

import type { NodeData } from "@/lib/types"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ExternalLink, BarChart3 } from "lucide-react"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Area, AreaChart, XAxis, YAxis } from "recharts"
import { getEricReportUrl, hasEricReport } from "@/lib/eric-config"
import { formatKpiValue, getHealthStatus } from "@/lib/kpi-utils"
import { cn } from "@/lib/utils"

interface PerformanceModalProps {
  node: NodeData | null
  isOpen: boolean
  onClose: () => void
  displayMode?: "stage" | "performance"
}

// Mock trend data - replace with real data when available
function getMockTrendData(kpiValue: number) {
  const base = Math.max(0, kpiValue - 15)
  return [
    { month: "Jan", value: base },
    { month: "Feb", value: base + 5 },
    { month: "Mar", value: base + 10 },
    { month: "Apr", value: base + 8 },
    { month: "May", value: kpiValue },
  ]
}

const chartConfig = {
  value: {
    label: "KPI",
    color: "hsl(var(--chart-1))",
  },
}

export function PerformanceModal({
  node,
  isOpen,
  onClose,
  displayMode = "stage",
}: PerformanceModalProps) {
  if (!node) return null

  const ericUrl = getEricReportUrl(node.id)
  const showEricLink = hasEricReport() && ericUrl
  const kpiValue = node.kpiValue ?? 0
  const status = getHealthStatus(kpiValue)
  const trendData = getMockTrendData(kpiValue)

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Performance
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <h3 className="font-semibold text-foreground mb-1">{node.title}</h3>
            {node.description && (
              <p className="text-sm text-muted-foreground line-clamp-2">{node.description}</p>
            )}
          </div>

          <div className="flex items-center justify-between gap-4 p-4 rounded-lg bg-muted/50">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Current KPI</p>
              <p className={cn(
                "text-2xl font-bold",
                status === "healthy" && "text-green-600 dark:text-green-400",
                status === "warning" && "text-amber-600 dark:text-amber-400",
                status === "critical" && "text-red-600 dark:text-red-400"
              )}>
                {formatKpiValue(kpiValue, "performance")}
              </p>
              <p className="text-xs text-muted-foreground capitalize">{status}</p>
            </div>
            <div className="h-16 w-24 flex-shrink-0">
              <ChartContainer config={chartConfig} className="h-full w-full">
                <AreaChart data={trendData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
                  <defs>
                    <linearGradient id="fillValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--color-value)" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="var(--color-value)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" hide />
                  <YAxis hide domain={[0, 100]} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="var(--color-value)"
                    fill="url(#fillValue)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ChartContainer>
            </div>
          </div>

          {showEricLink ? (
            <Button
              asChild
              variant="outline"
              className="w-full justify-center gap-2"
            >
              <a href={ericUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4" />
                View ERIC Report
              </a>
            </Button>
          ) : (
            <div className="flex items-center gap-2 p-3 rounded-lg border border-dashed border-muted-foreground/30 bg-muted/30">
              <ExternalLink className="h-4 w-4 text-muted-foreground shrink-0" />
              <p className="text-sm text-muted-foreground">
                ERIC report link will be available soon. Configure <code className="text-xs bg-muted px-1 rounded">NEXT_PUBLIC_ERIC_REPORT_URL</code> when ready.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
