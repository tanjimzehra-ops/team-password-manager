/**
 * Convex-based hooks barrel file
 * Re-exports all Convex hooks for convenient imports
 *
 * Usage:
 *   import { useConvexSystems, useConvexSystem, useConvexUpdateElement } from "@/hooks/convex"
 */

// Query hooks
export { useConvexSystems, type SystemInfo } from "./use-convex-systems"
export { useConvexSystem, type ConvexSystemData } from "./use-convex-system"

// Mutation hooks
export {
  // Elements
  useConvexUpdateElement,
  useConvexCreateElement,
  useConvexDeleteElement,
  useConvexUpdateElementColor,
  useConvexUpdateElementOrder,
  useConvexReorderElements,
  // Matrix cells
  useConvexUpdateMatrixCell,
  // System
  useConvexUpdateSystem,
  // Capabilities
  useConvexUpsertCapability,
  // KPIs
  useConvexCreateKpi,
  useConvexUpdateKpi,
  useConvexDeleteKpi,
  useConvexReplaceKpis,
  // Factors
  useConvexCreateFactor,
  useConvexUpdateFactor,
  useConvexDeleteFactor,
  // External values
  useConvexCreateExternalValue,
  useConvexUpdateExternalValue,
  useConvexDeleteExternalValue,
  // Portfolios
  useConvexCreatePortfolio,
  useConvexUpdatePortfolio,
  useConvexDeletePortfolio,
} from "./use-convex-mutations"
