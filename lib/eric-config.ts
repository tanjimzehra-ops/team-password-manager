/**
 * ERIC Report configuration
 * Set NEXT_PUBLIC_ERIC_REPORT_URL in .env.local when the link is ready
 */
export const ERIC_REPORT_BASE_URL =
  (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_ERIC_REPORT_URL) || ""

export function getEricReportUrl(elementId: string): string {
  if (!ERIC_REPORT_BASE_URL) return ""
  return `${ERIC_REPORT_BASE_URL}?elementId=${elementId}`
}

export const hasEricReport = (): boolean => !!ERIC_REPORT_BASE_URL
