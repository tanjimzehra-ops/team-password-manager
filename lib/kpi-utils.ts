/**
 * Utility functions for KPI and Health Index calculations
 *
 * Health mode: Shows composite index numbers (baseline 100)
 * Stage mode: Shows percentages (0-100)
 */

export function calculateHealthIndex(kpiValue: number): number {
  return Math.max(0, Math.min(200, kpiValue))
}

export function getHealthStatus(healthIndex: number): "healthy" | "warning" | "critical" {
  if (healthIndex >= 100) return "healthy"
  if (healthIndex >= 95) return "warning"
  return "critical"
}

export function formatKpiValue(kpiValue: number, displayMode: "stage" | "health" | "performance"): string {
  if (displayMode === "health" || displayMode === "performance") {
    const healthIndex = calculateHealthIndex(kpiValue)
    return healthIndex.toFixed(1)
  }
  return `${Math.round(kpiValue)}%`
}

export function getHealthBorderColor(healthIndex: number): string {
  if (healthIndex >= 100) return "border-green-500"
  if (healthIndex >= 95) return "border-yellow-500"
  return "border-red-500"
}
