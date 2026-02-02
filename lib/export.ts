import * as XLSX from "xlsx"
import jsPDF from "jspdf"
import html2canvas from "html2canvas"
import type {
  RowData,
  ContributionMapData,
  DevelopmentPathwaysData,
  ConvergenceMapData,
} from "./types"

// =============================================================================
// PDF Export (captures a DOM container)
// =============================================================================

export async function exportToPdf(containerId: string, filename: string): Promise<void> {
  const element = document.getElementById(containerId)
  if (!element) {
    throw new Error(`Container #${containerId} not found`)
  }

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false,
    backgroundColor: "#ffffff",
  })

  const imgData = canvas.toDataURL("image/png")
  const imgWidth = canvas.width
  const imgHeight = canvas.height

  const pdf = new jsPDF({
    orientation: imgWidth > imgHeight ? "landscape" : "portrait",
    unit: "px",
    format: [imgWidth, imgHeight],
  })

  pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight)
  pdf.save(`${filename}.pdf`)
}

// =============================================================================
// CSV helpers
// =============================================================================

function downloadCsv(csvContent: string, filename: string) {
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  const link = document.createElement("a")
  link.href = URL.createObjectURL(blob)
  link.download = `${filename}.csv`
  link.click()
  URL.revokeObjectURL(link.href)
}

function escapeCsv(value: string): string {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}

// =============================================================================
// Logic Model
// =============================================================================

export function exportLogicModelCsv(rows: RowData[], filename: string) {
  const lines = ["Category,Title,Description,KPI Value,KPI Status"]
  for (const row of rows) {
    for (const node of row.nodes) {
      lines.push([
        escapeCsv(row.label),
        escapeCsv(node.title),
        escapeCsv(node.description),
        String(node.kpiValue),
        node.kpiStatus,
      ].join(","))
    }
  }
  downloadCsv(lines.join("\n"), filename)
}

export function exportLogicModelExcel(rows: RowData[], filename: string) {
  const data: Record<string, string | number>[] = []
  for (const row of rows) {
    for (const node of row.nodes) {
      data.push({
        Category: row.label,
        Title: node.title,
        Description: node.description,
        "KPI Value": node.kpiValue,
        "KPI Status": node.kpiStatus,
      })
    }
  }
  const ws = XLSX.utils.json_to_sheet(data)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, "Logic Model")
  XLSX.writeFile(wb, `${filename}.xlsx`)
}

// =============================================================================
// Contribution Map
// =============================================================================

export function exportContributionMapCsv(data: ContributionMapData, filename: string) {
  const headerRow = ["Value Chain", ...data.outcomes.map(o => escapeCsv(o.title))]
  const lines = [headerRow.join(",")]

  for (const vc of data.valueChain) {
    const row = [escapeCsv(vc.title)]
    for (const outcome of data.outcomes) {
      const cell = data.cells.find(c => c.valueChainId === vc.id && c.outcomeId === outcome.id)
      row.push(escapeCsv(cell?.content ?? ""))
    }
    lines.push(row.join(","))
  }
  downloadCsv(lines.join("\n"), filename)
}

export function exportContributionMapExcel(data: ContributionMapData, filename: string) {
  const matrixRows: string[][] = [
    ["Value Chain", ...data.outcomes.map(o => o.title)],
  ]
  for (const vc of data.valueChain) {
    const row = [vc.title]
    for (const outcome of data.outcomes) {
      const cell = data.cells.find(c => c.valueChainId === vc.id && c.outcomeId === outcome.id)
      row.push(cell?.content ?? "")
    }
    matrixRows.push(row)
  }

  const ws = XLSX.utils.aoa_to_sheet(matrixRows)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, "Contribution Matrix")

  const elementsData = [
    ...data.outcomes.map(o => ({ Type: "Outcome", Title: o.title, KPI: o.kpiValue, Status: o.kpiStatus })),
    ...data.valueChain.map(v => ({ Type: "Value Chain", Title: v.title, KPI: v.kpiValue, Status: v.kpiStatus })),
  ]
  const ws2 = XLSX.utils.json_to_sheet(elementsData)
  XLSX.utils.book_append_sheet(wb, ws2, "Elements")

  XLSX.writeFile(wb, `${filename}.xlsx`)
}

// =============================================================================
// Development Pathways
// =============================================================================

export function exportDevelopmentPathwaysCsv(data: DevelopmentPathwaysData, filename: string) {
  const headerRow = ["Value Chain", ...data.resources.map(r => escapeCsv(r.title))]
  const lines = [headerRow.join(",")]

  for (const vc of data.valueChain) {
    const row = [escapeCsv(vc.title)]
    for (const resource of data.resources) {
      const cell = data.cells.find(c => c.valueChainId === vc.id && c.resourceId === resource.id)
      row.push(escapeCsv(cell?.content ?? ""))
    }
    lines.push(row.join(","))
  }
  downloadCsv(lines.join("\n"), filename)
}

export function exportDevelopmentPathwaysExcel(data: DevelopmentPathwaysData, filename: string) {
  const matrixRows: string[][] = [
    ["Value Chain", ...data.resources.map(r => r.title)],
  ]
  for (const vc of data.valueChain) {
    const row = [vc.title]
    for (const resource of data.resources) {
      const cell = data.cells.find(c => c.valueChainId === vc.id && c.resourceId === resource.id)
      row.push(cell?.content ?? "")
    }
    matrixRows.push(row)
  }

  const ws = XLSX.utils.aoa_to_sheet(matrixRows)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, "Development Matrix")

  const capData = data.resources.map((r, i) => ({
    Resource: r.title,
    "Current Capability": data.currentCapabilitiesPerResource[i]?.content ?? "",
    "Necessary Capability": data.necessaryCapabilities[i]?.content ?? "",
  }))
  const ws2 = XLSX.utils.json_to_sheet(capData)
  XLSX.utils.book_append_sheet(wb, ws2, "Capabilities")

  XLSX.writeFile(wb, `${filename}.xlsx`)
}

// =============================================================================
// Convergence Map
// =============================================================================

export function exportConvergenceMapCsv(data: ConvergenceMapData, filename: string) {
  const headerRow = ["Value Chain", ...data.externalFactors.map(f => escapeCsv(f.title))]
  const lines = [headerRow.join(",")]

  for (const vc of data.valueChain) {
    const row = [escapeCsv(vc.title)]
    for (const factor of data.externalFactors) {
      const cell = data.cells.find(c => c.valueChainId === vc.id && c.externalFactorId === factor.id)
      row.push(escapeCsv(cell?.content ?? ""))
    }
    lines.push(row.join(","))
  }
  downloadCsv(lines.join("\n"), filename)
}

export function exportConvergenceMapExcel(data: ConvergenceMapData, filename: string) {
  const matrixRows: string[][] = [
    ["Value Chain", ...data.externalFactors.map(f => f.title)],
  ]
  for (const vc of data.valueChain) {
    const row = [vc.title]
    for (const factor of data.externalFactors) {
      const cell = data.cells.find(c => c.valueChainId === vc.id && c.externalFactorId === factor.id)
      row.push(cell?.content ?? "")
    }
    matrixRows.push(row)
  }

  const ws = XLSX.utils.aoa_to_sheet(matrixRows)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, "Convergence Matrix")

  const factorData = data.externalFactors.map(f => ({
    Title: f.title,
    Description: f.description,
  }))
  const ws2 = XLSX.utils.json_to_sheet(factorData)
  XLSX.utils.book_append_sheet(wb, ws2, "External Factors")

  XLSX.writeFile(wb, `${filename}.xlsx`)
}
