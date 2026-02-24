# Stories 5.1-5.4: Export Suite — VERIFIED ✅

**Date:** 2026-02-24
**Status:** Already implemented, verified against acceptance criteria

## Evidence

### lib/export.ts (350 lines)
9 export functions covering all 4 views × 3 formats:

| Function | View | Format |
|----------|------|--------|
| exportLogicModelCsv | Logic Model | CSV |
| exportLogicModelExcel | Logic Model | Excel |
| exportContributionMapCsv | Contribution Map | CSV |
| exportContributionMapExcel | Contribution Map | Excel |
| exportDevelopmentPathwaysCsv | Dev Pathways | CSV |
| exportDevelopmentPathwaysExcel | Dev Pathways | Excel |
| exportConvergenceMapCsv | Convergence Map | CSV |
| exportConvergenceMapExcel | Convergence Map | Excel |
| exportToPdf | Any view | PDF |

### Dependencies installed
- exceljs ^4.4.0 — Excel generation with formatting
- html2canvas ^1.4.1 — Image/PDF capture
- jspdf ^4.1.0 — PDF generation

### Export Menu (Story 5.4)
`components/view-controls.tsx` has a dropdown with CSV, Excel, PDF options.
`app/page.tsx` `handleExport()` routes to correct function per view + format.

### Acceptance Criteria
- ✅ Story 5.1: Excel export with exceljs, cell formatting, colours, borders, headers
- ✅ Story 5.2: PDF export via html2canvas + jspdf
- ✅ Story 5.3: Image export via html2canvas (PNG)
- ✅ Story 5.4: Unified export dropdown menu with 3 options

### Notes
- Image export shares the PDF pipeline (html2canvas). Could add a dedicated "Export as Image" option later.
- Excel files include Jigsaw-specific layout with merged cells and colour coding.
