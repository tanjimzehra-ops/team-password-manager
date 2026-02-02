"use client"

import { useState, useMemo, useEffect } from "react"
import { Header } from "@/components/header"
import { ViewControls } from "@/components/view-controls"
import { NavSidebar } from "@/components/layout/nav-sidebar"
import { Footer } from "@/components/layout/footer"
import { RowSidebar } from "@/components/row-sidebar"
import { LogicGrid } from "@/components/logic-grid"
import { ContributionMap } from "@/components/contribution-map"
import { DevelopmentPathways } from "@/components/development-pathways"
import { ConvergenceMap } from "@/components/convergence-map"
import { NodeDetailSidebar } from "@/components/node-detail-sidebar"
import { AgentsCanvas } from "@/components/agents-canvas"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"

// Supabase hooks
import { useSystems } from "@/hooks/use-systems"
import { useFullSystem } from "@/hooks/use-full-system"
import { useUpdateElement, useUpdateSystem } from "@/hooks/use-mutations"
import { isSupabaseConfigured } from "@/lib/supabase"

// Convex hooks
import { useConvexSystems } from "@/hooks/convex/use-convex-systems"
import { useConvexSystem } from "@/hooks/convex/use-convex-system"
import { useConvexUpdateElement } from "@/hooks/convex/use-convex-mutations"
import { useConvexUpdateSystem } from "@/hooks/convex/use-convex-mutations"

// Data adapters
import {
  transformToLogicGridData,
  transformToContributionMapData,
  transformToDevelopmentPathwaysData,
  transformToConvergenceMapData,
  getCultureBanner,
  getContextBanner,
  isDataLoaded,
} from "@/lib/supabase-adapters"

// Fallback static data (used when Supabase is not configured)
import {
  availableSystems,
  getSystemAdapter,
  type SystemName,
} from "@/lib/data"
import type { NodeData } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"

// Export functions
import {
  exportToPdf,
  exportLogicModelCsv,
  exportLogicModelExcel,
  exportContributionMapCsv,
  exportContributionMapExcel,
  exportDevelopmentPathwaysCsv,
  exportDevelopmentPathwaysExcel,
  exportConvergenceMapCsv,
  exportConvergenceMapExcel,
} from "@/lib/export"

type EditMode = "view" | "edit" | "colour" | "order" | "delete"
type ViewTab = "logic-model" | "contribution-map" | "development-pathways" | "convergence-map" | "canvas"

const isConvexConfigured = !!process.env.NEXT_PUBLIC_CONVEX_URL

export default function Page() {
  const { toast } = useToast()

  // UI State
  const [showKpi, setShowKpi] = useState(true)
  const [editMode, setEditMode] = useState<EditMode>("view")
  const [activeTab, setActiveTab] = useState<ViewTab>("logic-model")
  const [displayLogic, setDisplayLogic] = useState(false)
  const [navSidebarCollapsed, setNavSidebarCollapsed] = useState(false)
  const [activeRow, setActiveRow] = useState<string | null>(null)
  const [selectedNode, setSelectedNode] = useState<NodeData | null>(null)
  const [detailSidebarOpen, setDetailSidebarOpen] = useState(false)

  // System selection (for both Supabase and JSON modes)
  const [selectedSystemId, setSelectedSystemId] = useState<string | null>(null)

  // JSON system adapter (used when Supabase is not configured)
  const [selectedJsonSystem, setSelectedJsonSystem] = useState<SystemName>("relationships_au_tas")

  // Supabase data
  const { data: systems, isLoading: systemsLoading } = useSystems()
  const { 
    system, 
    outcomes, 
    valueChain, 
    resources, 
    matrices,
    kpis,
    capabilities,
    factors,
    externalValues,
    isLoading: systemLoading 
  } = useFullSystem(selectedSystemId)

  // Supabase Mutations
  const updateElement = useUpdateElement()
  const updateSystem = useUpdateSystem()

  // Convex data
  const { data: convexSystems, isLoading: convexSystemsLoading } = useConvexSystems()
  const { data: convexSystemData, isLoading: convexSystemLoading } = useConvexSystem(
    isConvexConfigured ? selectedSystemId : null
  )

  // Convex mutations
  const convexUpdateElement = useConvexUpdateElement()
  const convexUpdateSystem = useConvexUpdateSystem()

  // Determine active data source
  const dataSource: "convex" | "supabase" | "json" = isConvexConfigured
    ? "convex"
    : isSupabaseConfigured
      ? "supabase"
      : "json"

  // Auto-select first system when systems load
  useEffect(() => {
    if (selectedSystemId) return
    if (dataSource === "convex" && convexSystems.length > 0) {
      setSelectedSystemId(convexSystems[0].id)
    } else if (systems?.length) {
      const meraSystem = systems.find(s => s.legacy_id === 2492)
      setSelectedSystemId(meraSystem?.id || systems[0].id)
    }
  }, [dataSource, convexSystems, systems, selectedSystemId])

  // Check if we have Supabase data loaded
  const hasSupabaseData = isSupabaseConfigured && isDataLoaded(system, outcomes, valueChain, resources)

  // Get current JSON adapter for static data
  const jsonAdapter = useMemo(() => {
    return getSystemAdapter(selectedJsonSystem)
  }, [selectedJsonSystem])

  // Transform Supabase data or use static data as fallback
  const logicGridData = useMemo(() => {
    if (hasSupabaseData && system && outcomes && valueChain && resources) {
      return transformToLogicGridData(system, outcomes, valueChain, resources)
    }
    return jsonAdapter.initialData
  }, [hasSupabaseData, system, outcomes, valueChain, resources, jsonAdapter])

  const cultureBanner = useMemo(() => {
    if (hasSupabaseData && system) {
      return getCultureBanner(system)
    }
    return jsonAdapter.cultureBanner
  }, [hasSupabaseData, system, jsonAdapter])

  const bottomBanner = useMemo(() => {
    if (hasSupabaseData && system) {
      return getContextBanner(system)
    }
    return jsonAdapter.bottomBanner
  }, [hasSupabaseData, system, jsonAdapter])

  const contributionMapData = useMemo(() => {
    if (hasSupabaseData && outcomes && valueChain && matrices) {
      return transformToContributionMapData(
        outcomes,
        valueChain,
        matrices.contribution,
        kpis
      )
    }
    return jsonAdapter.getContributionMapData()
  }, [hasSupabaseData, outcomes, valueChain, matrices, kpis, jsonAdapter])

  const developmentPathwaysData = useMemo(() => {
    if (hasSupabaseData && resources && valueChain && matrices) {
      return transformToDevelopmentPathwaysData(
        resources,
        valueChain,
        matrices.development,
        capabilities,
        kpis
      )
    }
    return jsonAdapter.getDevelopmentPathwaysData()
  }, [hasSupabaseData, resources, valueChain, matrices, capabilities, kpis, jsonAdapter])

  const convergenceMapData = useMemo(() => {
    if (hasSupabaseData && valueChain && matrices) {
      return transformToConvergenceMapData(
        valueChain,
        matrices.convergence,
        externalValues,
        factors,
        kpis
      )
    }
    return jsonAdapter.getConvergenceMapData()
  }, [hasSupabaseData, valueChain, matrices, externalValues, factors, kpis, jsonAdapter])

  // Effective data: Convex pre-transformed > Supabase useMemo > JSON fallback
  const effectiveLogicGridData = dataSource === "convex" && convexSystemData
    ? convexSystemData.initialData : logicGridData
  const effectiveCultureBanner = dataSource === "convex" && convexSystemData
    ? convexSystemData.cultureBanner : cultureBanner
  const effectiveBottomBanner = dataSource === "convex" && convexSystemData
    ? convexSystemData.bottomBanner : bottomBanner
  const effectiveContributionMapData = dataSource === "convex" && convexSystemData
    ? convexSystemData.contributionMapData : contributionMapData
  const effectiveDevelopmentPathwaysData = dataSource === "convex" && convexSystemData
    ? convexSystemData.developmentPathwaysData : developmentPathwaysData
  const effectiveConvergenceMapData = dataSource === "convex" && convexSystemData
    ? convexSystemData.convergenceMapData : convergenceMapData

  // Get current system name for display
  const systemName = useMemo(() => {
    if (dataSource === "convex" && convexSystemData) {
      return convexSystemData.system.name
    }
    if (hasSupabaseData && system) {
      return system.name
    }
    if (isSupabaseConfigured && systems?.length) {
      return systems.find(s => s.id === selectedSystemId)?.name || "MERA"
    }
    // JSON mode: use adapter name
    return jsonAdapter.initialData[0]?.nodes[0]?.metadata?.['System'] || selectedJsonSystem.toUpperCase()
  }, [dataSource, convexSystemData, hasSupabaseData, system, isSupabaseConfigured, systems, selectedSystemId, jsonAdapter, selectedJsonSystem])

  // Handler functions
  const handleNodeClick = (node: NodeData) => {
    setSelectedNode(node)
    setDetailSidebarOpen(true)
  }

  const handleCloseDetail = () => {
    setDetailSidebarOpen(false)
    setTimeout(() => setSelectedNode(null), 300)
  }

  const handleRowClick = (rowId: string) => {
    setActiveRow(rowId === activeRow ? null : rowId)
    const element = document.getElementById(rowId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  const handleSystemSelect = (systemId: string) => {
    if (dataSource === "convex" || dataSource === "supabase") {
      setSelectedSystemId(systemId)
    } else {
      // JSON mode: use system name as key
      const systemKey = systemId.toLowerCase() as SystemName
      if (systemKey in availableSystems) {
        setSelectedJsonSystem(systemKey)
      }
    }
  }

  // Save handler for NodeDetailSidebar (Convex only)
  const handleNodeSave = async (updatedNode: NodeData) => {
    if (dataSource !== "convex" || !convexSystemData) return

    // Matrix cells are not directly saveable yet
    if (updatedNode.id.startsWith("cell-")) return

    if (updatedNode.category === "purpose") {
      // Purpose maps to system-level fields
      await convexUpdateSystem.updateSystem({
        id: convexSystemData.system.id,
        impact: updatedNode.title,
      })
    } else {
      // outcomes, value-chain, resources map to elements
      await convexUpdateElement.updateElement({
        id: updatedNode.id,
        content: updatedNode.title,
        description: updatedNode.description,
        gradientValue: updatedNode.kpiValue,
      })
    }
  }

  // Export handler
  const handleExport = async (format: "csv" | "excel" | "pdf") => {
    const baseName = `${systemName}-${activeTab}`

    try {
      if (format === "pdf") {
        const containerMap: Record<string, string> = {
          "logic-model": "view-logic-model",
          "contribution-map": "view-contribution-map",
          "development-pathways": "view-development-pathways",
          "convergence-map": "view-convergence-map",
        }
        const containerId = containerMap[activeTab]
        if (containerId) {
          await exportToPdf(containerId, baseName)
        }
      } else if (format === "csv") {
        switch (activeTab) {
          case "logic-model":
            exportLogicModelCsv(effectiveLogicGridData, baseName)
            break
          case "contribution-map":
            exportContributionMapCsv(effectiveContributionMapData, baseName)
            break
          case "development-pathways":
            exportDevelopmentPathwaysCsv(effectiveDevelopmentPathwaysData, baseName)
            break
          case "convergence-map":
            exportConvergenceMapCsv(effectiveConvergenceMapData, baseName)
            break
        }
      } else if (format === "excel") {
        switch (activeTab) {
          case "logic-model":
            exportLogicModelExcel(effectiveLogicGridData, baseName)
            break
          case "contribution-map":
            exportContributionMapExcel(effectiveContributionMapData, baseName)
            break
          case "development-pathways":
            exportDevelopmentPathwaysExcel(effectiveDevelopmentPathwaysData, baseName)
            break
          case "convergence-map":
            exportConvergenceMapExcel(effectiveConvergenceMapData, baseName)
            break
        }
      }
      toast({ title: "Export complete", description: `${format.toUpperCase()} file downloaded` })
    } catch (err) {
      toast({
        title: "Export failed",
        description: err instanceof Error ? err.message : "Unknown error",
        variant: "destructive",
      })
    }
  }

  const handleContributionCellClick = (valueChainId: string, outcomeId: string) => {
    const vc = effectiveContributionMapData.valueChain.find(v => v.id === valueChainId)
    const outcome = effectiveContributionMapData.outcomes.find(o => o.id === outcomeId)
    const cell = effectiveContributionMapData.cells.find(
      c => c.valueChainId === valueChainId && c.outcomeId === outcomeId
    )

    const syntheticNode: NodeData = {
      id: `cell-${valueChainId}-${outcomeId}`,
      title: `${vc?.title ?? "Value Chain"} → ${outcome?.title ?? "Outcome"}`,
      description: cell?.content || "No contribution defined for this intersection.",
      kpiValue: vc?.kpiValue ?? 0,
      kpiStatus: vc?.kpiStatus ?? "healthy",
      category: "value-chain",
      color: "secondary",
      relatedNodes: [vc?.title, outcome?.title].filter(Boolean) as string[],
      notes: "Contribution Map intersection",
      metadata: {
        "View": "Contribution Map",
        "Value Chain Element": vc?.title ?? valueChainId,
        "Outcome": outcome?.title ?? outcomeId,
      },
    }

    setSelectedNode(syntheticNode)
    setDetailSidebarOpen(true)
  }

  const handleDevelopmentPathwaysCellClick = (valueChainId: string, resourceId: string) => {
    const vc = effectiveDevelopmentPathwaysData.valueChain.find(v => v.id === valueChainId)
    const resource = effectiveDevelopmentPathwaysData.resources.find(r => r.id === resourceId)
    const cell = effectiveDevelopmentPathwaysData.cells.find(
      c => c.valueChainId === valueChainId && c.resourceId === resourceId
    )

    const syntheticNode: NodeData = {
      id: `cell-${valueChainId}-${resourceId}`,
      title: `${vc?.title ?? "Value Chain"} → ${resource?.title ?? "Resource"}`,
      description: cell?.content || "No development pathway defined for this intersection.",
      kpiValue: vc?.kpiValue ?? 0,
      kpiStatus: vc?.kpiStatus ?? "healthy",
      category: "value-chain",
      color: "accent",
      relatedNodes: [vc?.title, resource?.title].filter(Boolean) as string[],
      notes: "Development Pathways intersection",
      metadata: {
        "View": "Development Pathways",
        "Value Chain Element": vc?.title ?? valueChainId,
        "Resource": resource?.title ?? resourceId,
      },
    }

    setSelectedNode(syntheticNode)
    setDetailSidebarOpen(true)
  }

  const handleConvergenceMapCellClick = (valueChainId: string, externalFactorId: string) => {
    const vc = effectiveConvergenceMapData.valueChain.find(v => v.id === valueChainId)
    const factor = effectiveConvergenceMapData.externalFactors.find(f => f.id === externalFactorId)
    const cell = effectiveConvergenceMapData.cells.find(
      c => c.valueChainId === valueChainId && c.externalFactorId === externalFactorId
    )

    const syntheticNode: NodeData = {
      id: `cell-${valueChainId}-${externalFactorId}`,
      title: `${vc?.title ?? "Value Chain"} → ${factor?.title ?? "External Factor"}`,
      description: cell?.content || "No convergence defined for this intersection.",
      kpiValue: vc?.kpiValue ?? 0,
      kpiStatus: vc?.kpiStatus ?? "healthy",
      category: "value-chain",
      color: "muted",
      relatedNodes: [vc?.title, factor?.title].filter(Boolean) as string[],
      notes: factor?.description
        ? `Factor: ${factor.description}`
        : "Convergence Map intersection",
      metadata: {
        "View": "Convergence Map",
        "Value Chain Element": vc?.title ?? valueChainId,
        "External Factor": factor?.title ?? externalFactorId,
      },
    }

    setSelectedNode(syntheticNode)
    setDetailSidebarOpen(true)
  }

  // Render loading state
  const renderLoading = () => (
    <div className="flex-1 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Spinner className="w-8 h-8" />
        <p className="text-muted-foreground">
          {systemsLoading ? "Loading systems..." : "Loading data..."}
        </p>
      </div>
    </div>
  )

  // Render main content based on active tab
  const renderMainContent = () => {
    // Show loading while fetching data
    if (
      (dataSource === "convex" && (convexSystemsLoading || (selectedSystemId && convexSystemLoading))) ||
      (dataSource === "supabase" && (systemsLoading || (selectedSystemId && systemLoading)))
    ) {
      return renderLoading()
    }

    switch (activeTab) {
      case "logic-model":
        return (
          <LogicGrid
            rows={effectiveLogicGridData}
            showKpi={showKpi}
            editMode={editMode === "edit" || editMode === "colour"}
            onNodeClick={handleNodeClick}
            cultureBanner={effectiveCultureBanner}
            bottomBanner={effectiveBottomBanner}
          />
        )
      case "contribution-map":
        return (
          <ContributionMap
            data={effectiveContributionMapData}
            editMode={editMode}
            onCellClick={handleContributionCellClick}
            onElementClick={handleNodeClick}
          />
        )
      case "development-pathways":
        return (
          <DevelopmentPathways
            data={effectiveDevelopmentPathwaysData}
            editMode={editMode}
            onCellClick={handleDevelopmentPathwaysCellClick}
            onElementClick={handleNodeClick}
          />
        )
      case "convergence-map":
        return (
          <ConvergenceMap
            data={effectiveConvergenceMapData}
            editMode={editMode}
            onCellClick={handleConvergenceMapCellClick}
            onElementClick={handleNodeClick}
          />
        )
      case "canvas":
        return (
          <AgentsCanvas className="h-full" />
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header activeTab={activeTab} onTabChange={setActiveTab} systemName={systemName} />
      <ViewControls 
        showKpi={showKpi} 
        onToggleKpi={setShowKpi} 
        editMode={editMode} 
        onEditModeChange={setEditMode}
        activeTab={activeTab}
        displayLogic={displayLogic}
        onDisplayLogicChange={setDisplayLogic}
        onExport={activeTab !== "canvas" ? handleExport : undefined}
      />

      {/* Data Source Indicator */}
      {dataSource === "json" && (
        <div className="bg-yellow-500/10 border-b border-yellow-500/20 px-4 py-2 text-sm text-yellow-600 dark:text-yellow-400 text-center">
          Using static demo data. Configure Convex or Supabase to load real data.
        </div>
      )}
      {dataSource === "convex" && (
        <div className="bg-emerald-500/10 border-b border-emerald-500/20 px-4 py-2 text-sm text-emerald-600 dark:text-emerald-400 text-center">
          Connected to Convex (real-time)
        </div>
      )}

      <main className="w-full flex-1 flex flex-col min-h-0">
        <div className="flex gap-0 flex-1 min-h-0">
          {/* Navigation Sidebar - Supabase or JSON systems */}
          <NavSidebar
            isCollapsed={navSidebarCollapsed}
            onToggle={() => setNavSidebarCollapsed(!navSidebarCollapsed)}
            selectedSystem={dataSource !== "json" ? (selectedSystemId || systemName) : selectedJsonSystem}
            onSystemSelect={handleSystemSelect}
            systems={
              dataSource === "convex"
                ? convexSystems.map(s => ({ id: s.id, name: s.name, sector: s.sector }))
                : dataSource === "supabase"
                  ? systems?.map(s => ({ id: s.id, name: s.name, sector: s.sector }))
                  : undefined
            }
            isLoading={
              dataSource === "convex" ? convexSystemsLoading :
              dataSource === "supabase" ? systemsLoading : false
            }
            showCanvas={activeTab === "canvas"}
            onCanvasClick={() => setActiveTab("canvas")}
          />

          {/* Row Labels Sidebar - Only show for Logic Model */}
          {activeTab === "logic-model" && (
            <RowSidebar
              rows={effectiveLogicGridData}
              activeRow={activeRow}
              onRowClick={handleRowClick}
            />
          )}

          {/* Main Content Area */}
          <div className="flex-1 min-w-0 px-6 py-6 overflow-x-auto overflow-y-auto">
            {renderMainContent()}
            {/* Save System Button - Only in Edit mode */}
            {editMode === "edit" && (
              <div className="mt-8 flex justify-center gap-4">
                <Button 
                  size="lg" 
                  className="px-8"
                  disabled={updateElement.isPending || updateSystem.isPending}
                >
                  {updateElement.isPending || updateSystem.isPending ? "Saving..." : "Save Changes"}
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={() => setEditMode("view")}
                >
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />

      {/* Node Detail Sidebar */}
      <NodeDetailSidebar
        node={selectedNode}
        isOpen={detailSidebarOpen}
        onClose={handleCloseDetail}
        onSave={dataSource === "convex" ? handleNodeSave : undefined}
      />
    </div>
  )
}
