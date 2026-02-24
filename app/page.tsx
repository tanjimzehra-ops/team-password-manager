"use client"

import { useState, useMemo, useEffect } from "react"
import { useQuery } from "convex/react"
import { useAuthBypass as useAuth } from "@/hooks/use-auth-bypass"
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
import { AlertTriangle, LayoutGrid, PlusCircle } from "lucide-react"

// New components
import { NodeEditPopup } from "@/components/node-edit-popup"
// PerformanceModal removed in Story 1.8 (Stage/Performance consolidation)
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
  useConvexCreateElement,
} from "@/hooks/convex/use-convex-mutations"

// Custom hooks
import { useEditMode } from "@/hooks/use-edit-mode"
import type { EditMode } from "@/hooks/use-edit-mode"
// usePerformanceMode removed in Story 1.8 (Stage/Performance consolidation)
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
  const [showKpi, setShowKpi] = useState(false)
  const [activeTab, setActiveTab] = useState<ViewTab>("logic-model")
  const [navSidebarCollapsed, setNavSidebarCollapsed] = useState(false)
  const [activeRow, setActiveRow] = useState<string | null>(null)
  const [selectedNode, setSelectedNode] = useState<NodeData | null>(null)
  const [detailSidebarOpen, setDetailSidebarOpen] = useState(false)

  // Custom hooks
  const {
    editMode, setEditMode, nodeForEdit, editPopupOpen, nodeToDelete, deleteDialogOpen,
    startEdit, startDelete, closeEdit, closeDelete, resetEditMode,
  } = useEditMode()

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

  // systems.list already enforces access control; use full accessible list as-is.
  const convexSystems = allConvexSystems
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
  const convexCreateElement = useConvexCreateElement()

  // Determine active data source
  const dataSource: "convex" | "json" = isConvexConfigured ? "convex" : "json"

  // Restore selected system from localStorage, or clear if current selection is invalid
  useEffect(() => {
    if (dataSource !== "convex" || convexSystems.length === 0) return

    // If current selection isn't in the filtered list (e.g. org switch), clear it
    if (selectedSystemId && !convexSystems.find((s) => s.id === selectedSystemId)) {
      setSelectedSystemId(null)
      return
    }

    // On initial load with no selection, try to restore from localStorage
    if (!selectedSystemId) {
      try {
        const saved = localStorage.getItem("jigsaw-selected-system")
        if (saved && convexSystems.find((s) => s.id === saved)) {
          setSelectedSystemId(saved)
        }
      } catch {
        // localStorage unavailable (SSR, privacy mode)
      }
    }
  }, [dataSource, convexSystems, selectedSystemId])

  // Get current JSON adapter for static data
  const jsonAdapter = useMemo(() => {
    return getSystemAdapter(selectedJsonSystem)
  }, [selectedJsonSystem])

  // Never fall back to JSON demo content when Convex mode is active.
  const effectiveLogicGridData = dataSource === "convex"
    ? (convexSystemData?.initialData ?? [])
    : jsonAdapter.initialData
  const effectiveCultureBanner = dataSource === "convex"
    ? (convexSystemData?.cultureBanner ?? { id: "culture-banner", title: "", kpiValue: 100, kpiStatus: "healthy" as const })
    : jsonAdapter.cultureBanner
  const effectiveBottomBanner = dataSource === "convex"
    ? (convexSystemData?.bottomBanner ?? { id: "bottom-banner", title: "", kpiValue: 100, kpiStatus: "healthy" as const })
    : jsonAdapter.bottomBanner
  const effectiveContributionMapData = dataSource === "convex"
    ? (convexSystemData?.contributionMapData ?? {
        outcomes: [],
        valueChain: [],
        valueChainKpis: [],
        outcomeKpis: [],
        cells: [],
      })
    : jsonAdapter.getContributionMapData()
  const effectiveDevelopmentPathwaysData = dataSource === "convex"
    ? (convexSystemData?.developmentPathwaysData ?? {
        resources: [],
        valueChain: [],
        currentCapabilitiesPerResource: [],
        currentCapabilitiesPerVC: [],
        necessaryCapabilities: [],
        cells: [],
        kpis: [],
        dimension: "",
      })
    : jsonAdapter.getDevelopmentPathwaysData()
  const effectiveConvergenceMapData = dataSource === "convex"
    ? (convexSystemData?.convergenceMapData ?? {
        externalFactors: [],
        valueChain: [],
        cells: [],
        kpis: [],
        factorsPerVC: [],
      })
    : jsonAdapter.getConvergenceMapData()

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
    if (dataSource === "convex") {
      if (!selectedSystemId) return null
      if (convexSystemData) return convexSystemData.system.name
      return convexSystems.find((s) => s.id === selectedSystemId)?.name ?? null
    }
    // JSON mode: use adapter name
    return jsonAdapter.initialData[0]?.nodes[0]?.metadata?.["System"] || selectedJsonSystem.toUpperCase()
  }, [dataSource, convexSystemData, convexSystems, jsonAdapter, selectedJsonSystem, selectedSystemId])

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
      try {
        localStorage.setItem("jigsaw-selected-system", systemId)
      } catch {
        // localStorage unavailable
      }
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
    const baseName = `${systemName ?? "jigsaw"}-${activeTab}`

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

  // Add node handler - creates new element directly
  const handleAddNode = async (category: string) => {
    if (dataSource !== "convex" || !convexSystemData) return

    // Map category to elementType
    const categoryToElementType: Record<string, "outcome" | "value_chain" | "resource"> = {
      outcomes: "outcome",
      "value-chain": "value_chain",
      resources: "resource",
    }

    const elementType = categoryToElementType[category]
    if (!elementType) return

    // Get current count of nodes in this category for orderIndex
    const row = effectiveLogicGridData.find((r) => r.category === category)
    const orderIndex = row?.nodes.length ?? 0

    try {
      const newElementId = await convexCreateElement.createElement({
        systemId: convexSystemData.system.id,
        elementType,
        content: "",
        description: "",
        orderIndex,
      })

      // Create a minimal NodeData for the new element and open edit popup
      const newNode: NodeData = {
        id: newElementId,
        title: "",
        description: "",
        kpiValue: 0,
        kpiStatus: "healthy",
        category: category as NodeData["category"],
        color: "primary",
      }

      startEdit(newNode)
    } catch {
      // Error handling is done within the hook
    }
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

  // Render empty state when no system is selected
  const renderEmptyState = () => {
    const hasSystems = dataSource === "convex" ? convexSystems.length > 0 : true

    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center max-w-md px-6">
          {hasSystems ? (
            <>
              <LayoutGrid className="w-12 h-12 text-muted-foreground/50" />
              <h2 className="text-xl font-semibold text-foreground">Welcome to Jigsaw</h2>
              <p className="text-muted-foreground">
                Select a system from the sidebar to begin viewing and editing your strategic plan.
              </p>
            </>
          ) : (
            <>
              <PlusCircle className="w-12 h-12 text-muted-foreground/50" />
              <h2 className="text-xl font-semibold text-foreground">No systems available</h2>
              <p className="text-muted-foreground">
                Create your first system to get started with strategic planning.
              </p>
            </>
          )}
        </div>
      </div>
    )
  }

  const renderSystemUnavailableState = () => (
    <div className="flex-1 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4 text-center max-w-md px-6">
        <AlertTriangle className="w-12 h-12 text-amber-500/70" />
        <h2 className="text-xl font-semibold text-foreground">System unavailable</h2>
        <p className="text-muted-foreground">
          The selected system could not be loaded. It may have been deleted, moved, or is no longer accessible.
        </p>
        <Button
          variant="outline"
          onClick={() => {
            setSelectedSystemId(null)
            try {
              localStorage.removeItem("jigsaw-selected-system")
            } catch {
              // localStorage unavailable
            }
          }}
        >
          Back to system list
        </Button>
      </div>
    </div>
  )

  // Render main content based on active tab
  const renderMainContent = () => {
    // Show loading while fetching data
    if (dataSource === "convex" && (convexSystemsLoading || (selectedSystemId && convexSystemLoading))) {
      return renderLoading()
    }

    // Show empty state when no system is selected
    if (dataSource === "convex" && !selectedSystemId) {
      return renderEmptyState()
    }

    // Selected system exists but did not resolve to data
    if (dataSource === "convex" && selectedSystemId && !convexSystemData) {
      return renderSystemUnavailableState()
    }

    switch (activeTab) {
      case "logic-model":
        return (
          <LogicGrid
            rows={effectiveLogicGridData}
            showKpi={showKpi}
            editMode={editMode}
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

  // Show loading spinner while auth state is being determined
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Spinner className="w-8 h-8" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

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
        onExport={activeTab !== "canvas" ? handleExport : undefined}
      />

      {/* Data Source Indicator — JSON fallback only */}
      {dataSource === "json" && (
        <div className="bg-yellow-500/10 border-b border-yellow-500/20 px-4 py-2 text-sm text-yellow-600 dark:text-yellow-400 text-center">
          Using static demo data. Configure Convex to enable real-time data.
        </div>
      )}

      <main className="w-full flex-1 flex flex-col min-h-0">
        <div className="flex gap-0 flex-1 min-h-0">
          {/* Navigation Sidebar */}
          <NavSidebar
            isCollapsed={navSidebarCollapsed}
            onToggle={() => setNavSidebarCollapsed(!navSidebarCollapsed)}
            selectedSystem={dataSource === "convex" ? (selectedSystemId ?? "") : selectedJsonSystem}
            onSystemSelect={handleSystemSelect}
            systems={
              dataSource === "convex"
                ? convexSystems.map((s) => ({ id: s.id, name: s.name, sector: s.sector, orgName: s.orgName }))
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

      {/* Library Popup */}
      <LibraryPopup
        isOpen={libraryOpen}
        onClose={closeLibrary}
        category={(libraryCategory ?? "outcomes") as "outcomes" | "value-chain" | "resources"}
        currentSystemId={selectedSystemId ?? ""}
        currentSystemName={systemName ?? "Jigsaw"}
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
