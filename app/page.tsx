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

type EditMode = "view" | "edit" | "colour" | "order" | "delete"
type ViewTab = "logic-model" | "contribution-map" | "development-pathways" | "convergence-map" | "canvas"

export default function Page() {
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

  // Mutations
  const updateElement = useUpdateElement()
  const updateSystem = useUpdateSystem()

  // Auto-select first system when systems load
  useEffect(() => {
    if (systems?.length && !selectedSystemId) {
      // Try to find MERA first (legacy_id = 2492), otherwise use first system
      const meraSystem = systems.find(s => s.legacy_id === 2492)
      setSelectedSystemId(meraSystem?.id || systems[0].id)
    }
  }, [systems, selectedSystemId])

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

  // Get current system name for display
  const systemName = useMemo(() => {
    if (hasSupabaseData && system) {
      return system.name
    }
    if (isSupabaseConfigured && systems?.length) {
      return systems.find(s => s.id === selectedSystemId)?.name || "MERA"
    }
    // JSON mode: use adapter name
    return jsonAdapter.initialData[0]?.nodes[0]?.metadata?.['System'] || selectedJsonSystem.toUpperCase()
  }, [hasSupabaseData, system, isSupabaseConfigured, systems, selectedSystemId, jsonAdapter, selectedJsonSystem])

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
    if (isSupabaseConfigured) {
      // Supabase mode: use system ID
      setSelectedSystemId(systemId)
    } else {
      // JSON mode: use system name as key
      const systemKey = systemId.toLowerCase() as SystemName
      if (systemKey in availableSystems) {
        setSelectedJsonSystem(systemKey)
      }
    }
  }

  const handleContributionCellClick = (valueChainId: string, outcomeId: string) => {
    const vc = contributionMapData.valueChain.find(v => v.id === valueChainId)
    const outcome = contributionMapData.outcomes.find(o => o.id === outcomeId)
    const cell = contributionMapData.cells.find(
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
    const vc = developmentPathwaysData.valueChain.find(v => v.id === valueChainId)
    const resource = developmentPathwaysData.resources.find(r => r.id === resourceId)
    const cell = developmentPathwaysData.cells.find(
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
    const vc = convergenceMapData.valueChain.find(v => v.id === valueChainId)
    const factor = convergenceMapData.externalFactors.find(f => f.id === externalFactorId)
    const cell = convergenceMapData.cells.find(
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
    // Show loading while fetching Supabase data
    if (isSupabaseConfigured && (systemsLoading || (selectedSystemId && systemLoading))) {
      return renderLoading()
    }

    switch (activeTab) {
      case "logic-model":
        return (
          <LogicGrid
            rows={logicGridData}
            showKpi={showKpi}
            editMode={editMode === "edit" || editMode === "colour"}
            onNodeClick={handleNodeClick}
            cultureBanner={cultureBanner}
            bottomBanner={bottomBanner}
          />
        )
      case "contribution-map":
        return (
          <ContributionMap
            data={contributionMapData}
            editMode={editMode}
            onCellClick={handleContributionCellClick}
          />
        )
      case "development-pathways":
        return (
          <DevelopmentPathways
            data={developmentPathwaysData}
            editMode={editMode}
            onCellClick={handleDevelopmentPathwaysCellClick}
          />
        )
      case "convergence-map":
        return (
          <ConvergenceMap
            data={convergenceMapData}
            editMode={editMode}
            onCellClick={handleConvergenceMapCellClick}
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
      />

      {/* Data Source Indicator */}
      {!isSupabaseConfigured && (
        <div className="bg-yellow-500/10 border-b border-yellow-500/20 px-4 py-2 text-sm text-yellow-600 dark:text-yellow-400 text-center">
          Using static demo data. Configure Supabase to load real data.
        </div>
      )}

      <main className="w-full flex-1 flex flex-col min-h-0">
        <div className="flex gap-0 flex-1 min-h-0">
          {/* Navigation Sidebar - Supabase or JSON systems */}
          <NavSidebar
            isCollapsed={navSidebarCollapsed}
            onToggle={() => setNavSidebarCollapsed(!navSidebarCollapsed)}
            selectedSystem={isSupabaseConfigured ? (selectedSystemId || systemName) : selectedJsonSystem}
            onSystemSelect={handleSystemSelect}
            systems={isSupabaseConfigured ? systems?.map(s => ({ id: s.id, name: s.name, sector: s.sector })) : undefined}
            isLoading={isSupabaseConfigured ? systemsLoading : false}
            showCanvas={activeTab === "canvas"}
            onCanvasClick={() => setActiveTab("canvas")}
          />

          {/* Row Labels Sidebar - Only show for Logic Model */}
          {activeTab === "logic-model" && (
            <RowSidebar
              rows={logicGridData}
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
      <NodeDetailSidebar node={selectedNode} isOpen={detailSidebarOpen} onClose={handleCloseDetail} />
    </div>
  )
}
