import ExcelJS from "exceljs"
import jsPDF from "jspdf"
import html2canvas from "html2canvas"
import type {
  RowData,
  ContributionMapData,
  DevelopmentPathwaysData,
  ConvergenceMapData,
} from "./types"

// =============================================================================
// Shared ExcelJS helpers
// =============================================================================

const TEAL: ExcelJS.FillPattern = {
  type: "pattern",
  pattern: "solid",
  fgColor: { argb: "FF0D9488" },
}

const TEAL_LIGHT: ExcelJS.FillPattern = {
  type: "pattern",
  pattern: "solid",
  fgColor: { argb: "FFCCFBF1" },
}

const HEADER_FONT: Partial<ExcelJS.Font> = {
  bold: true,
  color: { argb: "FFFFFFFF" },
  size: 11,
}

const TITLE_FONT: Partial<ExcelJS.Font> = {
  bold: true,
  size: 14,
  color: { argb: "FF0D9488" },
}

const THIN_BORDER: Partial<ExcelJS.Borders> = {
  top: { style: "thin", color: { argb: "FFD1D5DB" } },
  left: { style: "thin", color: { argb: "FFD1D5DB" } },
  bottom: { style: "thin", color: { argb: "FFD1D5DB" } },
  right: { style: "thin", color: { argb: "FFD1D5DB" } },
}

function autoWidth(ws: ExcelJS.Worksheet) {
  ws.columns.forEach((col) => {
    let max = 10
    col.eachCell?.({ includeEmpty: false }, (cell) => {
      const len = String(cell.value ?? "").length
      if (len > max) max = len
    })
    col.width = Math.min(max + 4, 50)
  })
}

function applyBorders(ws: ExcelJS.Worksheet) {
  ws.eachRow((row) => {
    row.eachCell((cell) => {
      cell.border = THIN_BORDER
    })
  })
}

function addTitleRow(ws: ExcelJS.Worksheet, title: string, colCount: number) {
  const row = ws.addRow([title])
  ws.mergeCells(row.number, 1, row.number, Math.max(colCount, 1))
  const cell = row.getCell(1)
  cell.font = TITLE_FONT
  cell.alignment = { vertical: "middle" }
  row.height = 28
  ws.addRow([]) // blank spacer
}

function styleHeaderRow(row: ExcelJS.Row) {
  row.eachCell((cell) => {
    cell.font = HEADER_FONT
    cell.fill = TEAL
    cell.alignment = { vertical: "middle", wrapText: true }
  })
  row.height = 22
}

function styleRowLabelCell(cell: ExcelJS.Cell) {
  cell.font = { bold: true, size: 11 }
  cell.fill = TEAL_LIGHT
}

async function downloadWorkbook(wb: ExcelJS.Workbook, filename: string) {
  const buffer = await wb.xlsx.writeBuffer()
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  })
  const link = document.createElement("a")
  link.href = URL.createObjectURL(blob)
  link.download = `${filename}.xlsx`
  link.click()
  URL.revokeObjectURL(link.href)
}

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

export async function exportLogicModelExcel(rows: RowData[], filename: string) {
  const wb = new ExcelJS.Workbook()
  const ws = wb.addWorksheet("Logic Model")

  addTitleRow(ws, filename.replace(/-/g, " "), 5)

  const headerRow = ws.addRow(["Category", "Title", "Description", "KPI Value", "KPI Status"])
  styleHeaderRow(headerRow)

  for (const row of rows) {
    for (const node of row.nodes) {
      const r = ws.addRow([row.label, node.title, node.description, node.kpiValue, node.kpiStatus])
      styleRowLabelCell(r.getCell(1))
    }
  }

  ws.views = [{ state: "frozen", ySplit: 3 }]
  applyBorders(ws)
  autoWidth(ws)
  await downloadWorkbook(wb, filename)
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

export async function exportContributionMapExcel(data: ContributionMapData, filename: string) {
  const wb = new ExcelJS.Workbook()
  const ws = wb.addWorksheet("Contribution Map")
  const colCount = data.outcomes.length + 1

  addTitleRow(ws, filename.replace(/-/g, " "), colCount)

  const headerRow = ws.addRow(["Value Chain", ...data.outcomes.map(o => o.title)])
  styleHeaderRow(headerRow)

  for (const vc of data.valueChain) {
    const values = [vc.title]
    for (const outcome of data.outcomes) {
      const cell = data.cells.find(c => c.valueChainId === vc.id && c.outcomeId === outcome.id)
      values.push(cell?.content ?? "")
    }
    const r = ws.addRow(values)
    styleRowLabelCell(r.getCell(1))
    r.eachCell((cell) => {
      cell.alignment = { wrapText: true, vertical: "top" }
    })
  }

  ws.views = [{ state: "frozen", ySplit: 3 }]
  applyBorders(ws)
  autoWidth(ws)
  await downloadWorkbook(wb, filename)
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

export async function exportDevelopmentPathwaysExcel(data: DevelopmentPathwaysData, filename: string) {
  const wb = new ExcelJS.Workbook()
  const ws = wb.addWorksheet("Development Pathways")
  const colCount = data.resources.length + 1

  addTitleRow(ws, filename.replace(/-/g, " "), colCount)

  const headerRow = ws.addRow(["Value Chain", ...data.resources.map(r => r.title)])
  styleHeaderRow(headerRow)

  for (const vc of data.valueChain) {
    const values = [vc.title]
    for (const resource of data.resources) {
      const cell = data.cells.find(c => c.valueChainId === vc.id && c.resourceId === resource.id)
      values.push(cell?.content ?? "")
    }
    const r = ws.addRow(values)
    styleRowLabelCell(r.getCell(1))
    r.eachCell((cell) => {
      cell.alignment = { wrapText: true, vertical: "top" }
    })
  }

  // Capabilities section
  ws.addRow([])
  const capHeader = ws.addRow(["Resource", "Current Capability", "Necessary Capability"])
  styleHeaderRow(capHeader)

  for (let i = 0; i < data.resources.length; i++) {
    const r = ws.addRow([
      data.resources[i].title,
      data.currentCapabilitiesPerResource[i]?.content ?? "",
      data.necessaryCapabilities[i]?.content ?? "",
    ])
    styleRowLabelCell(r.getCell(1))
  }

  ws.views = [{ state: "frozen", ySplit: 3 }]
  applyBorders(ws)
  autoWidth(ws)
  await downloadWorkbook(wb, filename)
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

export async function exportConvergenceMapExcel(data: ConvergenceMapData, filename: string) {
  const wb = new ExcelJS.Workbook()
  const ws = wb.addWorksheet("Convergence Map")
  const colCount = data.externalFactors.length + 1

  addTitleRow(ws, filename.replace(/-/g, " "), colCount)

  const headerRow = ws.addRow(["Value Chain", ...data.externalFactors.map(f => f.title)])
  styleHeaderRow(headerRow)

  for (const vc of data.valueChain) {
    const values = [vc.title]
    for (const factor of data.externalFactors) {
      const cell = data.cells.find(c => c.valueChainId === vc.id && c.externalFactorId === factor.id)
      values.push(cell?.content ?? "")
    }
    const r = ws.addRow(values)
    styleRowLabelCell(r.getCell(1))
    r.eachCell((cell) => {
      cell.alignment = { wrapText: true, vertical: "top" }
    })
  }

  ws.views = [{ state: "frozen", ySplit: 3 }]
  applyBorders(ws)
  autoWidth(ws)
  await downloadWorkbook(wb, filename)
}
