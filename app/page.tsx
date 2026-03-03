"use client"

import { useState, useMemo, useEffect, useCallback } from "react"
import { useQuery } from "convex/react"
import { useAuthBypass as useAuth } from "@/hooks/use-auth-bypass"
import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"
import { cn } from "@/lib/utils"
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
import { AlertTriangle, LayoutGrid, PlusCircle, CheckSquare } from "lucide-react"

// New components
import { NodeEditPopup } from "@/components/node-edit-popup"
import { DashboardOverview } from "@/components/dashboard/dashboard-overview"
import ShaderBackground from "@/components/ui/shader-background"
import { TooltipProvider } from "@/components/ui/tooltip"
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
  useConvexDeleteElement,
  useConvexDeleteSystem,
  useConvexUpsertCapability,
  useConvexReplaceKpis,
  useConvexUpdateFactor,
  useConvexUpdateExternalValue,
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
import {
  canCreateSystemForRole,
  canMutateForRole,
  getAvailableModesForRole,
  type UserRole,
  type ViewTab,
} from "@/lib/rbac"

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
  const [showLogicSidebar, setShowLogicSidebar] = useState(true)

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
  const [selectedOrgId, setSelectedOrgIdState] = useState<string | null>(null)
  const [hasInitializedOrgSelection, setHasInitializedOrgSelection] = useState(false)
  const setSelectedOrgId = useCallback((id: string | null) => {
    setSelectedOrgIdState(id)
    setHasInitializedOrgSelection(true)
  }, [])
  const rawOrgs = useQuery(api.organisations.list, (isConvexConfigured && user) ? {} : "skip")
  const me = useQuery(api.users.me, (isConvexConfigured && user) ? {} : "skip")
  const orgsLoading = rawOrgs === undefined
  const orgs: OrgInfo[] = useMemo(
    () => (rawOrgs ?? []).map((o) => ({ id: o._id, name: o.name, status: o.status })),
    [rawOrgs]
  )

  const effectiveRole = useMemo<UserRole | null>(() => {
    if (!isConvexConfigured) return "super_admin"
    if (!me) return null
    if (me.isSuperAdmin) return "super_admin"
    if (me.memberships.some((m) => m.role === "channel_partner")) return "channel_partner"

    if (selectedOrgId) {
      const selectedMembership = me.memberships.find((m) => String(m.orgId) === selectedOrgId)
      if (selectedMembership) return selectedMembership.role as UserRole
    }

    const hasAdmin = me.memberships.some((m) => m.role === "admin")
    return hasAdmin ? "admin" : "viewer"
  }, [me, selectedOrgId])

  const canMutate = canMutateForRole(effectiveRole)
  const canAddSystem = canCreateSystemForRole(effectiveRole)

  // Auto-select first org for non-super-admin users when orgs load.
  useEffect(() => {
    if (hasInitializedOrgSelection || orgs.length === 0 || !me) return

    if (me.isSuperAdmin) {
      // Preserve explicit "All clients" (null) for super admins.
      setHasInitializedOrgSelection(true)
      return
    }

    setSelectedOrgIdState(orgs[0].id)
    setHasInitializedOrgSelection(true)
  }, [orgs, me, hasInitializedOrgSelection])

  // Convex data
  const { data: allConvexSystems, isLoading: convexSystemsLoading } = useConvexSystems()

  // Scope systems to the selected client/org. If no org is selected, show all accessible systems.
  const convexSystems = useMemo(() => {
    if (!selectedOrgId) return allConvexSystems
    return allConvexSystems.filter((s) => s.orgId === selectedOrgId)
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
  const convexCreateElement = useConvexCreateElement()
  const convexDeleteElement = useConvexDeleteElement()
  const convexDeleteSystem = useConvexDeleteSystem()
  const convexUpsertCapability = useConvexUpsertCapability()
  const convexReplaceKpis = useConvexReplaceKpis()
  const convexUpdateFactor = useConvexUpdateFactor()
  const convexUpdateExternalValue = useConvexUpdateExternalValue()

  // Determine active data source
  const dataSource: "convex" | "json" = isConvexConfigured ? "convex" : "json"

  // Restore visual state from localStorage
  useEffect(() => {
    try {
      const savedKpi = localStorage.getItem("jigsaw-show-kpi")
      if (savedKpi !== null) {
        setShowKpi(savedKpi === "true")
      }
    } catch { }
  }, [])

  // Save visual state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("jigsaw-show-kpi", String(showKpi))
    } catch { }
  }, [showKpi])

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

  useEffect(() => {
    const allowedModes = getAvailableModesForRole(activeTab, effectiveRole)
    if (!allowedModes.includes(editMode)) {
      setEditMode("view")
    }
  }, [activeTab, editMode, effectiveRole, setEditMode])

  const handleEditModeChange = useCallback((mode: EditMode) => {
    const allowedModes = getAvailableModesForRole(activeTab, effectiveRole)
    if (!allowedModes.includes(mode)) {
      toast({
        title: "Access denied",
        description: "Your role cannot use that mode.",
        variant: "destructive",
      })
      return
    }
    setEditMode(mode)
  }, [activeTab, effectiveRole, setEditMode, toast])

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
  const {
    libraryOpen,
    libraryCategory,
    libraryItems,
    openLibrary,
    closeLibrary,
    isConnecting,
    connect,
    copy
  } = useLibrary(selectedSystemId as Id<"systems">)

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

  const handleDashboardClick = useCallback(() => {
    setSelectedSystemId(null)
    try {
      localStorage.removeItem("jigsaw-selected-system")
    } catch { }
  }, [])

  // Save handler for NodeDetailSidebar (Convex only)
  const handleNodeSave = async (updatedNode: NodeData) => {
    if (!canMutate || dataSource !== "convex" || !convexSystemData) return

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
    } else if (updatedNode.id.startsWith("outcome-kpi-") || updatedNode.id.startsWith("vc-kpi-")) {
      // KPI list: split description by newlines to get individual KPI strings
      const parentId = updatedNode.id.replace("outcome-kpi-", "").replace("vc-kpi-", "") as Id<"elements">
      const kpis = updatedNode.description
        .split("\n")
        .map((s) => s.trim())
        .filter((s) => s.length > 0)

      await convexReplaceKpis.replaceKpis({
        systemId: convexSystemData.system.id,
        parentId,
        kpis,
      })
    } else if (updatedNode.id.startsWith("curr-cap-res-") || updatedNode.id.startsWith("nec-cap-") || updatedNode.id.startsWith("curr-cap-vc-")) {
      // Capabilities
      const resourceId = updatedNode.id
        .replace("curr-cap-res-", "")
        .replace("nec-cap-", "")
        .replace("curr-cap-vc-", "") as Id<"elements">

      const capabilityType = updatedNode.id.startsWith("nec-cap-") ? "necessary" : "current"

      await convexUpsertCapability.upsertCapability({
        systemId: convexSystemData.system.id,
        resourceId,
        capabilityType,
        content: updatedNode.description,
      })
    } else if (updatedNode.id.startsWith("vc-factor-")) {
      // VC Factors
      const valueChainId = updatedNode.id.replace("vc-factor-", "") as Id<"elements">
      await convexUpdateFactor.updateFactor({
        systemId: convexSystemData.system.id,
        valueChainId,
        content: updatedNode.description,
      })
    } else if (updatedNode.id.startsWith("factor-desc-") || updatedNode.metadata?.["Type"] === "External Factor") {
      // External Factor description or title (External Values)
      const id = (updatedNode.id.startsWith("factor-desc-")
        ? updatedNode.id.replace("factor-desc-", "")
        : updatedNode.id) as Id<"externalValues">

      await convexUpdateExternalValue.updateExternalValue({
        id,
        content: updatedNode.title,
        description: updatedNode.description,
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
    if (!canMutate || dataSource !== "convex") return
    await convexUpdateElementColor.updateElementColor({
      id: nodeId,
      color: color as "primary" | "secondary" | "accent" | "muted",
    })
  }

  // KPI change handler (Convex only)
  const handleKpiChange = async (nodeId: string, value: number) => {
    if (!canMutate || dataSource !== "convex") return

    if (nodeId === "purpose-1") {
      if (!selectedSystemId) return
      await convexUpdateSystem.updateSystem({
        id: selectedSystemId as Id<"systems">,
        impactHealth: value,
      })
    } else if (nodeId === "culture-banner") {
      if (!selectedSystemId) return
      await convexUpdateSystem.updateSystem({
        id: selectedSystemId as Id<"systems">,
        dimensionHealth: value,
      })
    } else if (nodeId === "bottom-banner") {
      if (!selectedSystemId) return
      await convexUpdateSystem.updateSystem({
        id: selectedSystemId as Id<"systems">,
        challengeHealth: value,
      })
    } else {
      await convexUpdateElement.updateElement({
        id: nodeId as Id<"elements">,
        gradientValue: value,
      })
    }
  }


  // Reorder handler (Convex only)
  const handleReorder = async (category: string, fromIndex: number, toIndex: number) => {
    if (!canMutate || dataSource !== "convex" || !convexSystemData) return
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
    if (!canMutate || dataSource !== "convex" || !convexSystemData) return

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
  const handleDeleteNode = async (nodeId: string) => {
    if (!canMutate || dataSource !== "convex") return
    const node = effectiveLogicGridData.flatMap(r => r.nodes).find(n => n.id === nodeId)
    if (node) {
      try {
        await convexDeleteElement.deleteElement({ id: node.id })
      } catch (err) {
        toast({ title: "Error", description: "Failed to delete node.", variant: "destructive" })
      }
    }
  }

  // Delete system handler
  const handleDeleteSystem = async (systemId: string) => {
    if (!canMutate || dataSource !== "convex") return
    try {
      await convexDeleteSystem.deleteSystem({ id: systemId })
      if (selectedSystemId === systemId) {
        setSelectedSystemId(null)
        localStorage.removeItem("jigsaw-selected-system")
      }
    } catch (err) {
      // toast is handled in the hook
    }
  }

  // Edit node handler
  const handleEditNode = (node: NodeData) => {
    if (!canMutate) return
    startEdit(node)
  }

  // Edit popup save
  const handleEditPopupSave = async (data: { title: string; description: string }) => {
    if (!canMutate || !nodeForEdit || dataSource !== "convex") return
    await convexUpdateElement.updateElement({
      id: nodeForEdit.id,
      content: data.title,
      description: data.description,
    })
    closeEdit()
  }

  // Portfolio handlers
  const handlePortfolioCreate = async (data: { title: string; description: string; date: string; progress: number; status: string; elementId: string }) => {
    if (!canMutate || dataSource !== "convex" || !convexSystemData) return
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
    if (!canMutate || dataSource !== "convex") return
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
    if (!canMutate || dataSource !== "convex") return
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
    return (
      <DashboardOverview
        systemCount={convexSystems.length}
        orgName={orgs.find(o => o.id === selectedOrgId)?.name}
      />
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
            onKpiChange={handleKpiChange}
            onOpenLibrary={openLibrary}
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
      <TooltipProvider>
        <div className="min-h-screen bg-background flex flex-col">
          <Header activeTab={activeTab} onTabChange={setActiveTab} systemName={systemName} isDashboard={!selectedSystemId} />

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
                onSystemCreated={handleSystemSelect}
                onDashboardClick={handleDashboardClick}
                systems={
                  dataSource === "convex"
                    ? convexSystems.map((s) => ({ id: s.id, name: s.name, sector: s.sector, orgName: s.orgName }))
                    : undefined
                }
                isLoading={dataSource === "convex" ? convexSystemsLoading : false}
                showCanvas={activeTab === "canvas"}
                onCanvasClick={() => setActiveTab("canvas")}
                canAddSystem={dataSource === "convex" && canAddSystem}
                onSystemDelete={handleDeleteSystem}
                canDeleteSystem={dataSource === "convex" && canMutate}
              />

              <div className="flex-1 min-w-0 flex flex-col min-h-0 bg-background">
                {/* View Controls within the content area for alignment */}
                <ViewControls
                  showKpi={showKpi}
                  onToggleKpi={setShowKpi}
                  editMode={editMode}
                  onEditModeChange={handleEditModeChange}
                  activeTab={activeTab}
                  onExport={activeTab !== "canvas" ? handleExport : undefined}
                  userRole={effectiveRole ?? undefined}
                  isDashboard={!selectedSystemId}
                />

                {/* Main Content Scroll Area */}
                <div className="flex-1 min-w-0 flex overflow-y-auto">
                  {activeTab === "logic-model" && showLogicSidebar && selectedSystemId && (
                    <RowSidebar
                      rows={effectiveLogicGridData}
                      activeRow={activeRow}
                      onRowClick={handleRowClick}
                    />
                  )}
                  <div className="flex-1 min-w-0 px-6 py-6 overflow-x-auto">
                    {activeTab === "logic-model" && selectedSystemId && (
                      <div className="flex items-center gap-4 h-12 mb-6 px-2 w-fit">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id="display-logic"
                            checked={showLogicSidebar}
                            onChange={(e) => setShowLogicSidebar(e.target.checked)}
                            className="h-4 w-4 rounded border-slate-300 bg-background text-teal-600 focus:ring-teal-500 cursor-pointer"
                          />
                          <label htmlFor="display-logic" className="text-sm font-black uppercase tracking-[0.25em] text-slate-600 dark:text-slate-400 cursor-pointer select-none">
                            Display Logic
                          </label>
                        </div>
                      </div>
                    )}
                    {renderMainContent()}
                    {/* Edit mode controls - Convex auto-saves */}
                    {editMode === "edit" && (
                      <div className="mt-8 flex justify-center">
                        <Button
                          size="lg"
                          variant="outline"
                          onClick={() => handleEditModeChange("view")}
                        >
                          Done Editing
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </main>

          <Footer onRestartTour={restartTour} isDashboard={!selectedSystemId} />

          {/* Node Detail Sidebar */}
          <NodeDetailSidebar
            node={selectedNode}
            isOpen={detailSidebarOpen}
            onClose={handleCloseDetail}
            onSave={dataSource === "convex" && canMutate ? handleNodeSave : undefined}
            portfolios={selectedNode && dataSource === "convex" ? [] : undefined}
            onPortfolioCreate={dataSource === "convex" && canMutate ? handlePortfolioCreate : undefined}
            onPortfolioUpdate={dataSource === "convex" && canMutate ? handlePortfolioUpdate : undefined}
            onPortfolioDelete={dataSource === "convex" && canMutate ? handlePortfolioDelete : undefined}
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
            category={libraryCategory as any}
            items={libraryItems}
            isConnecting={isConnecting}
            onConnect={connect}
            onCopy={copy}
          />

          {/* Onboarding Tour */}
          <OnboardingTour
            run={tourRun}
            stepIndex={tourStepIndex}
            steps={tourSteps}
            onCallback={tourCallback}
          />
        </div>
      </TooltipProvider>
    </OrgContext.Provider>
  )
}
