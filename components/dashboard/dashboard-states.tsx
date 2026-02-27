import { Spinner } from "@/components/ui/spinner"
import { AlertTriangle, LayoutGrid, PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface DashboardLoadingProps {
    isLoadingSystems?: boolean
}

export function DashboardLoading({ isLoadingSystems }: DashboardLoadingProps) {
    return (
        <div className="flex-1 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <Spinner className="w-8 h-8" />
                <p className="text-muted-foreground">
                    {isLoadingSystems ? "Loading systems..." : "Loading data..."}
                </p>
            </div>
        </div>
    )
}

interface DashboardEmptyStateProps {
    hasSystems: boolean
}

export function DashboardEmptyState({ hasSystems }: DashboardEmptyStateProps) {
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

interface DashboardUnavailableProps {
    onBack: () => void
}

export function DashboardUnavailable({ onBack }: DashboardUnavailableProps) {
    return (
        <div className="flex-1 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4 text-center max-w-md px-6">
                <AlertTriangle className="w-12 h-12 text-amber-500/70" />
                <h2 className="text-xl font-semibold text-foreground">System unavailable</h2>
                <p className="text-muted-foreground">
                    The selected system could not be loaded. It may have been deleted, moved, or is no longer accessible.
                </p>
                <Button variant="outline" onClick={onBack}>
                    Back to system list
                </Button>
            </div>
        </div>
    )
}
