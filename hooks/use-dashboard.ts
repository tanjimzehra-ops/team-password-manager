import { useState, useMemo, useEffect, useCallback } from "react"
import { useQuery } from "convex/react"
import { useAuthBypass as useAuth } from "@/hooks/use-auth-bypass"
import { api } from "@/convex/_generated/api"
import { useToast } from "@/hooks/use-toast"
import { useEditMode, type EditMode } from "@/hooks/use-edit-mode"
import { useLibrary } from "@/hooks/use-library"
import { usePortfolioState } from "@/hooks/use-portfolio-state"
import { useOnboardingTour } from "@/hooks/use-onboarding-tour"
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
import {
    getSystemAdapter,
    type SystemName,
} from "@/lib/data"
import {
    canCreateSystemForRole,
    canMutateForRole,
    getAvailableModesForRole,
    type UserRole,
    type ViewTab,
} from "@/lib/rbac"
import type { NodeData } from "@/lib/types"
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

const isConvexConfigured = !!process.env.NEXT_PUBLIC_CONVEX_URL

export function useDashboard() {
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
    const [selectedOrgId, setSelectedOrgIdState] = useState<string | null>(null)
    const [hasInitializedOrgSelection, setHasInitializedOrgSelection] = useState(false)
    const setSelectedOrgId = useCallback((id: string | null) => {
        setSelectedOrgIdState(id)
        setHasInitializedOrgSelection(true)
    }, [])

    const rawOrgs = useQuery(api.organisations.list, (isConvexConfigured && user) ? {} : "skip")
    const me = useQuery(api.users.me, (isConvexConfigured && user) ? {} : "skip")
    const orgsLoading = rawOrgs === undefined
    const orgs = useMemo(
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

    // Auto-select first org
    useEffect(() => {
        if (hasInitializedOrgSelection || orgs.length === 0 || !me) return
        if (me.isSuperAdmin) {
            setHasInitializedOrgSelection(true)
            return
        }
        setSelectedOrgIdState(orgs[0].id)
        setHasInitializedOrgSelection(true)
    }, [orgs, me, hasInitializedOrgSelection])

    // Convex data
    const { data: allConvexSystems, isLoading: convexSystemsLoading } = useConvexSystems()
    const convexSystems = useMemo(() => {
        if (!allConvexSystems) return []
        if (!selectedOrgId) return allConvexSystems
        return allConvexSystems.filter((s) => s.orgId === selectedOrgId)
    }, [allConvexSystems, selectedOrgId])
    const { data: convexSystemData, isLoading: convexSystemLoading } = useConvexSystem(
        isConvexConfigured ? selectedSystemId : null
    )

    // Mutations
    const convexUpdateElement = useConvexUpdateElement()
    const convexUpdateSystem = useConvexUpdateSystem()
    const convexUpdateMatrixCell = useConvexUpdateMatrixCell()
    const convexUpdateElementColor = useConvexUpdateElementColor()
    const convexUpdateElementOrder = useConvexUpdateElementOrder()
    const convexCreatePortfolio = useConvexCreatePortfolio()
    const convexUpdatePortfolio = useConvexUpdatePortfolio()
    const convexDeletePortfolio = useConvexDeletePortfolio()
    const convexCreateElement = useConvexCreateElement()

    const dataSource: "convex" | "json" = isConvexConfigured ? "convex" : "json"

    // System restoration
    useEffect(() => {
        if (dataSource !== "convex" || convexSystems.length === 0) return
        if (selectedSystemId && !convexSystems.find((s) => s.id === selectedSystemId)) {
            setSelectedSystemId(null)
            return
        }
        if (!selectedSystemId) {
            try {
                const saved = localStorage.getItem("jigsaw-selected-system")
                if (saved && convexSystems.find((s) => s.id === saved)) {
                    setSelectedSystemId(saved)
                }
            } catch { }
        }
    }, [dataSource, convexSystems, selectedSystemId])

    // Mode validation
    useEffect(() => {
        const allowedModes = getAvailableModesForRole(activeTab, effectiveRole)
        if (!allowedModes.includes(editMode)) {
            setEditMode("view")
        }
    }, [activeTab, editMode, effectiveRole, setEditMode])

    const handleEditModeChange = useCallback((mode: EditMode) => {
        const allowedModes = getAvailableModesForRole(activeTab, effectiveRole)
        if (!allowedModes.includes(mode)) {
            toast({ title: "Access denied", description: "Your role cannot use that mode.", variant: "destructive" })
            return
        }
        setEditMode(mode)
    }, [activeTab, effectiveRole, setEditMode, toast])

    const jsonAdapter = useMemo(() => getSystemAdapter(selectedJsonSystem), [selectedJsonSystem])

    const effectiveLogicGridData = dataSource === "convex" ? (convexSystemData?.initialData ?? []) : jsonAdapter.initialData
    const effectiveCultureBanner = dataSource === "convex"
        ? (convexSystemData?.cultureBanner ?? { id: "culture-banner", title: "", kpiValue: 100, kpiStatus: "healthy" as const })
        : jsonAdapter.cultureBanner
    const effectiveBottomBanner = dataSource === "convex"
        ? (convexSystemData?.bottomBanner ?? { id: "bottom-banner", title: "", kpiValue: 100, kpiStatus: "healthy" as const })
        : jsonAdapter.bottomBanner
    const effectiveContributionMapData = dataSource === "convex"
        ? (convexSystemData?.contributionMapData ?? { outcomes: [], valueChain: [], valueChainKpis: [], outcomeKpis: [], cells: [] })
        : jsonAdapter.getContributionMapData()
    const effectiveDevelopmentPathwaysData = dataSource === "convex"
        ? (convexSystemData?.developmentPathwaysData ?? { resources: [], valueChain: [], currentCapabilitiesPerResource: [], currentCapabilitiesPerVC: [], necessaryCapabilities: [], cells: [], kpis: [], dimension: "" })
        : jsonAdapter.getDevelopmentPathwaysData()
    const effectiveConvergenceMapData = dataSource === "convex"
        ? (convexSystemData?.convergenceMapData ?? { externalFactors: [], valueChain: [], cells: [], kpis: [], factorsPerVC: [] })
        : jsonAdapter.getConvergenceMapData()

    const { libraryOpen, libraryCategory, libraryItems, openLibrary, closeLibrary } = useLibrary(
        effectiveLogicGridData,
        dataSource === "convex" ? convexSystems.map(s => ({ id: s.id, name: s.name })) : undefined,
        selectedSystemId
    )

    const { addOptimistic, removeOptimistic } = usePortfolioState()
    const { run: tourRun, stepIndex: tourStepIndex, steps: tourSteps, handleCallback: tourCallback, restartTour } = useOnboardingTour()

    const systemName = useMemo(() => {
        if (dataSource === "convex") {
            if (!selectedSystemId) return null
            if (convexSystemData) return convexSystemData.system.name
            return convexSystems.find((s) => s.id === selectedSystemId)?.name ?? null
        }
        return jsonAdapter.initialData[0]?.nodes[0]?.metadata?.["System"] || selectedJsonSystem.toUpperCase()
    }, [dataSource, convexSystemData, convexSystems, jsonAdapter, selectedJsonSystem, selectedSystemId])

    // Handlers
    const handleNodeClick = useCallback((node: NodeData) => {
        setSelectedNode(node)
        setDetailSidebarOpen(true)
    }, [])

    const handleCloseDetail = useCallback(() => {
        setDetailSidebarOpen(false)
    }, [])

    const handleRowClick = useCallback((rowId: string) => {
        setActiveRow(activeRow === rowId ? null : rowId)
    }, [activeRow])

    const handleSystemSelect = useCallback((systemId: string) => {
        if (dataSource === "convex") {
            setSelectedSystemId(systemId)
            try {
                localStorage.setItem("jigsaw-selected-system", systemId)
            } catch { }
        } else {
            setSelectedJsonSystem(systemId as SystemName)
        }
    }, [dataSource])

    const handleNodeSave = useCallback(async (updatedNode: NodeData) => {
        if (dataSource !== "convex") return
        try {
            await convexUpdateElement.updateElement({
                id: updatedNode.id,
                content: updatedNode.title,
                description: updatedNode.description,
                gradientValue: updatedNode.kpiValue,
            })
            setSelectedNode(updatedNode)
        } catch (error) {
            // toast is handled in hook
        }
    }, [dataSource, convexUpdateElement])

    const handleExport = useCallback(async (format: "csv" | "excel" | "pdf") => {
        if (!systemName) return
        const filename = `${systemName.replace(/\s+/g, "_")}_Strategic_Plan`
        try {
            switch (activeTab) {
                case "logic-model":
                    if (format === "pdf") await exportToPdf("logic-grid", filename)
                    else if (format === "csv") exportLogicModelCsv(effectiveLogicGridData, filename)
                    else await exportLogicModelExcel(effectiveLogicGridData, filename)
                    break
                case "contribution-map":
                    if (format === "csv") exportContributionMapCsv(effectiveContributionMapData, filename)
                    else await exportContributionMapExcel(effectiveContributionMapData, filename)
                    break
                case "development-pathways":
                    if (format === "csv") exportDevelopmentPathwaysCsv(effectiveDevelopmentPathwaysData, filename)
                    else await exportDevelopmentPathwaysExcel(effectiveDevelopmentPathwaysData, filename)
                    break
                case "convergence-map":
                    if (format === "csv") exportConvergenceMapCsv(effectiveConvergenceMapData, filename)
                    else await exportConvergenceMapExcel(effectiveConvergenceMapData, filename)
                    break
            }
            toast({ title: "Export Started", description: `Your ${format.toUpperCase()} file is being generated.` })
        } catch (err) {
            toast({ title: "Export Failed", description: "Could not generate export file.", variant: "destructive" })
        }
    }, [systemName, activeTab, effectiveLogicGridData, effectiveContributionMapData, effectiveDevelopmentPathwaysData, effectiveConvergenceMapData, toast])

    const handleContributionCellClick = useCallback(async (valueChainId: string, outcomeId: string) => {
        if (dataSource !== "convex" || !canMutate || !selectedSystemId) return
        const existingCell = effectiveContributionMapData.cells.find(
            (c) => c.valueChainId === valueChainId && c.outcomeId === outcomeId
        )
        const content = window.prompt("Enter cell content:", existingCell?.content || "")
        if (content === null) return
        try {
            await convexUpdateMatrixCell.updateMatrixCell({
                systemId: selectedSystemId,
                matrixType: "contribution",
                rowElementId: valueChainId,
                colElementId: outcomeId,
                content,
            })
        } catch (err) { }
    }, [dataSource, canMutate, effectiveContributionMapData, selectedSystemId, convexUpdateMatrixCell])

    const handleDevelopmentPathwaysCellClick = useCallback(async (valueChainId: string, resourceId: string) => {
        if (dataSource !== "convex" || !canMutate || !selectedSystemId) return
        const existingCell = effectiveDevelopmentPathwaysData.cells.find(
            (c) => c.valueChainId === valueChainId && c.resourceId === resourceId
        )
        const content = window.prompt("Enter cell content:", existingCell?.content || "")
        if (content === null) return
        try {
            await convexUpdateMatrixCell.updateMatrixCell({
                systemId: selectedSystemId,
                matrixType: "development",
                rowElementId: valueChainId,
                colElementId: resourceId,
                content,
            })
        } catch (err) { }
    }, [dataSource, canMutate, effectiveDevelopmentPathwaysData, selectedSystemId, convexUpdateMatrixCell])

    const handleConvergenceMapCellClick = useCallback(async (valueChainId: string, externalFactorId: string) => {
        if (dataSource !== "convex" || !canMutate || !selectedSystemId) return
        const existingCell = effectiveConvergenceMapData.cells.find(
            (c) => c.valueChainId === valueChainId && c.externalFactorId === externalFactorId
        )
        const content = window.prompt("Enter cell content:", existingCell?.content || "")
        if (content === null) return
        try {
            await convexUpdateMatrixCell.updateMatrixCell({
                systemId: selectedSystemId,
                matrixType: "convergence",
                rowElementId: valueChainId,
                colElementId: externalFactorId,
                content,
            })
        } catch (err) { }
    }, [dataSource, canMutate, effectiveConvergenceMapData, selectedSystemId, convexUpdateMatrixCell])

    const handleColorChange = useCallback(async (nodeId: string, color: NodeData["color"]) => {
        if (dataSource !== "convex") return
        try {
            await convexUpdateElementColor.updateElementColor({ id: nodeId, color: color || "primary" })
        } catch (err) { }
    }, [dataSource, convexUpdateElementColor])

    const handleReorder = useCallback(async (_category: string, _fromIndex: number, _toIndex: number) => {
        // Basic reorder logic - in a real app this would move elements in Convex
        if (dataSource !== "convex") return
        // implement element-specific reorder if needed
    }, [dataSource])

    const handleAddNode = useCallback(async (category: string) => {
        if (dataSource !== "convex" || !selectedSystemId) return
        const content = window.prompt(`Enter new ${category} title:`)
        if (!content) return

        let elementType: "outcome" | "value_chain" | "resource" = "outcome"
        if (category === "value-chain") elementType = "value_chain"
        else if (category === "resources") elementType = "resource"

        try {
            await convexCreateElement.createElement({ systemId: selectedSystemId, elementType, content, orderIndex: 0 })
        } catch (err) { }
    }, [dataSource, selectedSystemId, convexCreateElement])

    const handleDeleteNode = useCallback(async (nodeId: string) => {
        if (dataSource !== "convex") return
        const node = effectiveLogicGridData.flatMap(r => r.nodes).find(n => n.id === nodeId)
        if (node) startDelete(node)
    }, [dataSource, effectiveLogicGridData, startDelete])

    const handleEditNode = useCallback((node: NodeData) => {
        startEdit(node)
    }, [startEdit])

    const handleEditPopupSave = useCallback(async (data: { title: string; description: string }) => {
        if (!nodeForEdit) return
        try {
            await convexUpdateElement.updateElement({ id: nodeForEdit.id, content: data.title, description: data.description })
            closeEdit()
        } catch (err) { }
    }, [nodeForEdit, convexUpdateElement, closeEdit])

    const handlePortfolioCreate = useCallback(async (data: any) => {
        if (dataSource !== "convex" || !selectedSystemId) return
        try {
            await convexCreatePortfolio.createPortfolio({ ...data, systemId: selectedSystemId, orderIndex: 0 })
        } catch (err) { }
    }, [dataSource, selectedSystemId, convexCreatePortfolio])

    const handlePortfolioUpdate = useCallback(async (id: string, data: any) => {
        if (dataSource !== "convex") return
        try {
            await convexUpdatePortfolio.updatePortfolio({ id, ...data })
        } catch (err) { }
    }, [dataSource, convexUpdatePortfolio])

    const handlePortfolioDelete = useCallback(async (id: string) => {
        if (dataSource !== "convex") return
        try {
            await convexDeletePortfolio.deletePortfolio({ id })
        } catch (err) { }
    }, [dataSource, convexDeletePortfolio])

    const handleLibraryConnect = useCallback(async (item: any) => {
        closeLibrary()
        toast({ title: "Connected", description: `Joined with ${item.title}` })
    }, [closeLibrary, toast])

    const handleLibraryCopy = useCallback(async (item: any) => {
        closeLibrary()
        toast({ title: "Copied", description: `Imported ${item.title}` })
    }, [closeLibrary, toast])

    return {
        user, authLoading, orgs, selectedOrgId, setSelectedOrgId, orgsLoading, effectiveRole,
        canMutate, canAddSystem, showKpi, setShowKpi, activeTab, setActiveTab,
        navSidebarCollapsed, setNavSidebarCollapsed, activeRow, setActiveRow,
        selectedNode, setSelectedNode, detailSidebarOpen, setDetailSidebarOpen,
        editMode, setEditMode, nodeForEdit, editPopupOpen, nodeToDelete, deleteDialogOpen,
        startEdit, startDelete, closeEdit, closeDelete, resetEditMode,
        selectedSystemId, setSelectedSystemId, convexSystems, convexSystemsLoading, convexSystemLoading, convexSystemData,
        dataSource, systemName, effectiveLogicGridData, effectiveCultureBanner, effectiveBottomBanner,
        effectiveContributionMapData, effectiveDevelopmentPathwaysData, effectiveConvergenceMapData,
        libraryOpen, libraryCategory, libraryItems, openLibrary, closeLibrary,
        tourRun, tourStepIndex, tourSteps, tourCallback, restartTour,
        handleEditModeChange, handleNodeClick, handleCloseDetail, handleRowClick, handleSystemSelect,
        handleNodeSave, handleExport, handleContributionCellClick, handleDevelopmentPathwaysCellClick,
        handleConvergenceMapCellClick, handleColorChange, handleReorder, handleAddNode, handleDeleteNode,
        handleEditNode, handleEditPopupSave, handlePortfolioCreate, handlePortfolioUpdate, handlePortfolioDelete,
        handleLibraryConnect, handleLibraryCopy,
    }
}
