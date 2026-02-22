"use client"

import { useState, useMemo, useEffect } from "react"
import { useQuery } from "convex/react"
import { useAuth } from "@workos-inc/authkit-nextjs/components"
import { api } from "@/convex/_generated/api"
import { OrgContext, type OrgInfo } from "@/hooks/use-org"
import { LandingPage } from "@/components/landing-page"
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

// New components
import { NodeEditPopup } from "@/components/node-edit-popup"
import { PerformanceModal } from "@/components/performance-modal"
import { LibraryPopup } from "@/components/library-popup"
import { OnboardingTour } from "@/components/onboarding-tour"

// Convex hooks
import { useConvexSystems } from "@/hooks/convex/use-convex-systems"
import { useConvexSystem } from "@/hooks/convex/use-convex-system"
import {
  useConvexUpdateElement,
  useConvexUpdateSystem,
  useConvexUpdateMatrixCell,
  useConvexUpdateElementColor,
  useConvexUpdateElementOrder,
  useConvexCreatePortfolio,
  useConvexUpdatePortfolio,
  useConvexDeletePortfolio,
} from "@/hooks/convex/use-convex-mutations"

// Custom hooks
import { useEditMode } from "@/hooks/use-edit-mode"
import type { EditMode } from "@/hooks/use-edit-mode"
import { usePerformanceMode } from "@/hooks/use-performance-mode"
import { useLibrary } from "@/hooks/use-library"
import { usePortfolioState } from "@/hooks/use-portfolio-state"

// Fallback static data (used when Convex is not configured)
import {
  availableSystems,
  getSystemAdapter,
  type SystemName,
} from "@/lib/data"
import type { NodeData } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"
import { useOnboardingTour } from "@/hooks/use-onboarding-tour"

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

type ViewTab = "logic-model" | "contribution-map" | "development-pathways" | "convergence-map" | "canvas"

const isConvexConfigured = !!process.env.NEXT_PUBLIC_CONVEX_URL

export default function Page() {
  const { user, loading: authLoading } = useAuth()
  const { toast } = useToast()

  // UI State
  const [showKpi, setShowKpi] = useState(true)
  const [activeTab, setActiveTab] = useState<ViewTab>("logic-model")
  const [navSidebarCollapsed, setNavSidebarCollapsed] = useState(false)
  const [activeRow, setActiveRow] = useState<string | null>(null)
  const [selectedNode, setSelectedNode] = useState<NodeData | null>(null)
  const [detailSidebarOpen, setDetailSidebarOpen] = useState(false)

  // Custom hooks (replace inline useState for editMode and displayMode)
  const {
    editMode, setEditMode, nodeForEdit, editPopupOpen, nodeToDelete, deleteDialogOpen,
    startEdit, startDelete, closeEdit, closeDelete, resetEditMode,
  } = useEditMode()

  const {
    displayMode, setDisplayMode, performanceModalOpen, performanceNode,
    openPerformanceModal, closePerformanceModal,
  } = usePerformanceMode()

  // System selection
  const [selectedSystemId, setSelectedSystemId] = useState<string | null>(null)

  // JSON system adapter (used when Convex is not configured)
  const [selectedJsonSystem, setSelectedJsonSystem] = useState<SystemName>("relationships_au_tas")

  // Org selection (multi-tenant)
  const [selectedOrgId, setSelectedOrgId] = useState<string | null>(null)
  const rawOrgs = useQuery(api.organisations.list, (isConvexConfigured && user) ? {} : "skip")
  const orgsLoading = rawOrgs === undefined
  const orgs: OrgInfo[] = useMemo(
    () => (rawOrgs ?? []).map((o) => ({ id: o._id, name: o.name, status: o.status })),
    [rawOrgs]
  )

  // Auto-select first org when orgs load
  useEffect(() => {
    if (selectedOrgId || orgs.length === 0) return
    setSelectedOrgId(orgs[0].id)
  }, [orgs, selectedOrgId])

  // Convex data
  const { data: allConvexSystems, isLoading: convexSystemsLoading } = useConvexSystems()

  // Filter systems by selected org (show legacy systems + selected org's systems)
  const convexSystems = useMemo(() => {
    if (!selectedOrgId) return allConvexSystems
    return allConvexSystems.filter((s) => !s.orgId || s.orgId === selectedOrgId)
  }, [allConvexSystems, selectedOrgId])
  const { data: convexSystemData, isLoading: convexSystemLoading } = useConvexSystem(
    isConvexConfigured ? selectedSystemId : null
  )

  // Convex mutations
  const convexUpdateElement = useConvexUpdateElement()
  const convexUpdateSystem = useConvexUpdateSystem()
  const convexUpdateMatrixCell = useConvexUpdateMatrixCell()
  const convexUpdateElementColor = useConvexUpdateElementColor()
  const convexUpdateElementOrder = useConvexUpdateElementOrder()
  const convexCreatePortfolio = useConvexCreatePortfolio()
  const convexUpdatePortfolio = useConvexUpdatePortfolio()
  const convexDeletePortfolio = useConvexDeletePortfolio()

  // Determine active data source
  const dataSource: "convex" | "json" = isConvexConfigured ? "convex" : "json"

  // Auto-select first system when systems load or org changes
  useEffect(() => {
    if (dataSource === "convex" && convexSystems.length > 0) {
      // If current selection isn't in the filtered list, pick the first one
      if (!selectedSystemId || !convexSystems.find((s) => s.id === selectedSystemId)) {
        setSelectedSystemId(convexSystems[0].id)
      }
    }
  }, [dataSource, convexSystems, selectedSystemId])

  // Get current JSON adapter for static data
  const jsonAdapter = useMemo(() => {
    return getSystemAdapter(selectedJsonSystem)
  }, [selectedJsonSystem])

  // Data: Convex pre-transformed > JSON fallback
  const effectiveLogicGridData = convexSystemData?.initialData ?? jsonAdapter.initialData
  const effectiveCultureBanner = convexSystemData?.cultureBanner ?? jsonAdapter.cultureBanner
  const effectiveBottomBanner = convexSystemData?.bottomBanner ?? jsonAdapter.bottomBanner
  const effectiveContributionMapData = convexSystemData?.contributionMapData ?? jsonAdapter.getContributionMapData()
  const effectiveDevelopmentPathwaysData = convexSystemData?.developmentPathwaysData ?? jsonAdapter.getDevelopmentPathwaysData()
  const effectiveConvergenceMapData = convexSystemData?.convergenceMapData ?? jsonAdapter.getConvergenceMapData()

  // Library hook (depends on effectiveLogicGridData)
  const { libraryOpen, libraryCategory, libraryItems, openLibrary, closeLibrary } = useLibrary(
    effectiveLogicGridData,
    dataSource === "convex"
      ? convexSystems.map(s => ({ id: s.id, name: s.name }))
      : undefined,
    selectedSystemId
  )

  // Portfolio optimistic state
  const { addOptimistic, removeOptimistic, getMergedPortfolios } = usePortfolioState()

  // Onboarding tour
  const { run: tourRun, stepIndex: tourStepIndex, steps: tourSteps, handleCallback: tourCallback, restartTour } = useOnboardingTour()

  // Get current system name for display
  const systemName = useMemo(() => {
    if (dataSource === "convex" && convexSystemData) {
      return convexSystemData.system.name
    }
    // JSON mode: use adapter name
    return jsonAdapter.initialData[0]?.nodes[0]?.metadata?.['System'] || selectedJsonSystem.toUpperCase()
  }, [dataSource, convexSystemData, jsonAdapter, selectedJsonSystem])

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
    if (dataSource === "convex") {
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

    if (updatedNode.id.startsWith("cell-")) {
      // Matrix cell: use metadata keys for reliable ID extraction
      const view = updatedNode.metadata?.["View"]
      const rowElementId = updatedNode.metadata?.["_rowElementId"]
      const colElementId = updatedNode.metadata?.["_colElementId"]
      if (!rowElementId || !colElementId) return

      let matrixType: "contribution" | "development" | "convergence"
      if (view === "Contribution Map") {
        matrixType = "contribution"
      } else if (view === "Development Pathways") {
        matrixType = "development"
      } else if (view === "Convergence Map") {
        matrixType = "convergence"
      } else {
        return
      }

      await convexUpdateMatrixCell.updateMatrixCell({
        systemId: convexSystemData.system.id,
        matrixType,
        rowElementId,
        colElementId,
        content: updatedNode.description,
      })
    } else if (updatedNode.category === "purpose") {
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
            await exportLogicModelExcel(effectiveLogicGridData, baseName)
            break
          case "contribution-map":
            await exportContributionMapExcel(effectiveContributionMapData, baseName)
            break
          case "development-pathways":
            await exportDevelopmentPathwaysExcel(effectiveDevelopmentPathwaysData, baseName)
            break
          case "convergence-map":
            await exportConvergenceMapExcel(effectiveConvergenceMapData, baseName)
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
        "_rowElementId": valueChainId,
        "_colElementId": outcomeId,
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
        "_rowElementId": valueChainId,
        "_colElementId": resourceId,
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
        "_rowElementId": valueChainId,
        "_colElementId": externalFactorId,
      },
    }

    setSelectedNode(syntheticNode)
    setDetailSidebarOpen(true)
  }

  // Color change handler (Convex only)
  const handleColorChange = async (nodeId: string, color: NodeData["color"]) => {
    if (dataSource !== "convex") return
    await convexUpdateElementColor.updateElementColor({
      id: nodeId,
      color: color as "primary" | "secondary" | "accent" | "muted",
    })
  }

  // Reorder handler (Convex only)
  const handleReorder = async (category: string, fromIndex: number, toIndex: number) => {
    if (dataSource !== "convex" || !convexSystemData) return
    const row = effectiveLogicGridData.find(r => r.category === category)
    if (!row) return
    const nodes = [...row.nodes]
    const [moved] = nodes.splice(fromIndex, 1)
    nodes.splice(toIndex, 0, moved)
    // Update each element with its new order index
    for (let i = 0; i < nodes.length; i++) {
      await convexUpdateElementOrder.updateElementOrder({
        id: nodes[i].id,
        orderIndex: i,
      })
    }
  }

  // Add node handler (placeholder - opens library)
  const handleAddNode = (category: string) => {
    openLibrary(category as NodeData["category"])
  }

  // Delete node handler
  const handleDeleteNode = (nodeId: string) => {
    const node = effectiveLogicGridData.flatMap(r => r.nodes).find(n => n.id === nodeId)
    if (node) startDelete(node)
  }

  // Edit node handler
  const handleEditNode = (node: NodeData) => {
    startEdit(node)
  }

  // Edit popup save
  const handleEditPopupSave = async (data: { title: string; description: string }) => {
    if (!nodeForEdit || dataSource !== "convex") return
    await convexUpdateElement.updateElement({
      id: nodeForEdit.id,
      content: data.title,
      description: data.description,
    })
    closeEdit()
  }

  // Portfolio handlers
  const handlePortfolioCreate = async (data: { title: string; description: string; date: string; progress: number; status: string; elementId: string }) => {
    if (dataSource !== "convex" || !convexSystemData) return
    addOptimistic({
      id: `temp-${Date.now()}`,
      ...data,
    })
    await convexCreatePortfolio.createPortfolio({
      systemId: convexSystemData.system.id,
      elementId: data.elementId,
      title: data.title,
      description: data.description,
      date: data.date,
      progress: data.progress,
      status: data.status as "planning" | "active" | "completed",
      orderIndex: 0,
    })
  }

  const handlePortfolioUpdate = async (id: string, data: { title: string; description: string; date: string; progress: number; status: string }) => {
    if (dataSource !== "convex") return
    await convexUpdatePortfolio.updatePortfolio({
      id,
      title: data.title,
      description: data.description,
      date: data.date,
      progress: data.progress,
      status: data.status as "planning" | "active" | "completed",
    })
  }

  const handlePortfolioDelete = async (id: string) => {
    if (dataSource !== "convex") return
    removeOptimistic(id)
    await convexDeletePortfolio.deletePortfolio({ id })
  }

  // Library handlers
  const handleLibraryConnect = (item: { id: string; title: string }) => {
    toast({ title: "Connected", description: `Element "${item.title}" linked` })
    closeLibrary()
  }

  const handleLibraryCopy = (item: { id: string; title: string }) => {
    toast({ title: "Copied", description: `Element "${item.title}" copied` })
    closeLibrary()
  }

  // Render loading state
  const renderLoading = () => (
    <div className="flex-1 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Spinner className="w-8 h-8" />
        <p className="text-muted-foreground">
          {convexSystemsLoading ? "Loading systems..." : "Loading data..."}
        </p>
      </div>
    </div>
  )

  // Render main content based on active tab
  const renderMainContent = () => {
    // Show loading while fetching data
    if (dataSource === "convex" && (convexSystemsLoading || (selectedSystemId && convexSystemLoading))) {
      return renderLoading()
    }

    switch (activeTab) {
      case "logic-model":
        return (
          <LogicGrid
            rows={effectiveLogicGridData}
            showKpi={showKpi}
            editMode={editMode}
            displayMode={displayMode}
            onNodeClick={handleNodeClick}
            cultureBanner={effectiveCultureBanner}
            bottomBanner={effectiveBottomBanner}
            onColorChange={handleColorChange}
            onReorder={handleReorder}
            onAddNode={handleAddNode}
            onDeleteNode={handleDeleteNode}
            onEditNode={handleEditNode}
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

  const orgContextValue = useMemo(() => ({
    orgs,
    selectedOrgId,
    setSelectedOrgId,
    isLoading: orgsLoading,
  }), [orgs, selectedOrgId, orgsLoading])

  // Show landing page for unauthenticated users (must be after all hooks)
  if (!authLoading && !user) {
    return <LandingPage />
  }

  return (
    <OrgContext.Provider value={orgContextValue}>
    <div className="min-h-screen bg-background flex flex-col">
      <Header activeTab={activeTab} onTabChange={setActiveTab} systemName={systemName} />
      <ViewControls
        showKpi={showKpi}
        onToggleKpi={setShowKpi}
        editMode={editMode}
        onEditModeChange={setEditMode}
        activeTab={activeTab}
        displayMode={displayMode}
        onDisplayModeChange={setDisplayMode}
        onExport={activeTab !== "canvas" ? handleExport : undefined}
      />

      {/* Data Source Indicator */}
      {dataSource === "json" && (
        <div className="bg-yellow-500/10 border-b border-yellow-500/20 px-4 py-2 text-sm text-yellow-600 dark:text-yellow-400 text-center">
          Using static demo data. Configure Convex to enable real-time data.
        </div>
      )}
      {dataSource === "convex" && (
        <div className="bg-emerald-500/10 border-b border-emerald-500/20 px-4 py-2 text-sm text-emerald-600 dark:text-emerald-400 text-center">
          Connected to Convex (real-time)
        </div>
      )}

      <main className="w-full flex-1 flex flex-col min-h-0">
        <div className="flex gap-0 flex-1 min-h-0">
          {/* Navigation Sidebar */}
          <NavSidebar
            isCollapsed={navSidebarCollapsed}
            onToggle={() => setNavSidebarCollapsed(!navSidebarCollapsed)}
            selectedSystem={dataSource === "convex" ? (selectedSystemId || systemName) : selectedJsonSystem}
            onSystemSelect={handleSystemSelect}
            systems={
              dataSource === "convex"
                ? convexSystems.map(s => ({ id: s.id, name: s.name, sector: s.sector }))
                : undefined
            }
            isLoading={dataSource === "convex" ? convexSystemsLoading : false}
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
            {/* Edit mode controls - Convex auto-saves */}
            {editMode === "edit" && (
              <div className="mt-8 flex justify-center">
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => setEditMode("view")}
                >
                  Done Editing
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer onRestartTour={restartTour} />

      {/* Node Detail Sidebar */}
      <NodeDetailSidebar
        node={selectedNode}
        isOpen={detailSidebarOpen}
        onClose={handleCloseDetail}
        onSave={dataSource === "convex" ? handleNodeSave : undefined}
        portfolios={selectedNode && dataSource === "convex" ? [] : undefined}
        onPortfolioCreate={dataSource === "convex" ? handlePortfolioCreate : undefined}
        onPortfolioUpdate={dataSource === "convex" ? handlePortfolioUpdate : undefined}
        onPortfolioDelete={dataSource === "convex" ? handlePortfolioDelete : undefined}
      />

      {/* Edit Popup */}
      <NodeEditPopup
        isOpen={editPopupOpen}
        onClose={closeEdit}
        title={nodeForEdit ? `Edit ${nodeForEdit.title}` : "Edit Node"}
        initialTitle={nodeForEdit?.title ?? ""}
        initialDescription={nodeForEdit?.description ?? ""}
        onSave={handleEditPopupSave}
      />

      {/* Performance Modal */}
      <PerformanceModal
        isOpen={performanceModalOpen}
        onClose={closePerformanceModal}
        node={performanceNode}
        displayMode={displayMode}
      />

      {/* Library Popup */}
      <LibraryPopup
        isOpen={libraryOpen}
        onClose={closeLibrary}
        category={(libraryCategory ?? "outcomes") as "outcomes" | "value-chain" | "resources"}
        currentSystemId={selectedSystemId ?? ""}
        currentSystemName={systemName}
        onConnect={handleLibraryConnect}
        onCopy={handleLibraryCopy}
        items={libraryItems}
      />

      {/* Onboarding Tour */}
      <OnboardingTour
        run={tourRun}
        stepIndex={tourStepIndex}
        steps={tourSteps}
        onCallback={tourCallback}
      />
    </div>
    </OrgContext.Provider>
  )
}
