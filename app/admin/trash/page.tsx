"use client"

import { useState } from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Shield, RotateCcw, Server, Users, Building2, Inbox } from "lucide-react"
import { cn } from "@/lib/utils"

type TabKey = "systems" | "users" | "organisations"

const TABS: { key: TabKey; label: string; icon: typeof Server }[] = [
  { key: "systems", label: "Systems", icon: Server },
  { key: "users", label: "Users", icon: Users },
  { key: "organisations", label: "Organisations", icon: Building2 },
]

function formatDeletedDate(ts: number): string {
  return new Date(ts).toLocaleString("en-AU", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function EmptyState({ resourceType }: { resourceType: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
      <Inbox className="h-10 w-10 mb-3 opacity-50" />
      <p className="text-sm">No deleted {resourceType} found.</p>
      <p className="text-xs mt-1">Items that are soft-deleted will appear here.</p>
    </div>
  )
}

export default function TrashPage() {
  const currentUser = useQuery(api.users.me)
  const [activeTab, setActiveTab] = useState<TabKey>("systems")

  const isSuperAdmin = currentUser?.isSuperAdmin ?? false

  if (!currentUser) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-64" />
      </div>
    )
  }

  if (!isSuperAdmin) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center space-y-4">
        <Shield className="h-12 w-12 text-muted-foreground" />
        <h2 className="text-xl font-semibold">Access Denied</h2>
        <p className="text-muted-foreground">Super admin access required.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Trash</h1>
        <p className="text-sm text-muted-foreground mt-1">
          View and restore soft-deleted items
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px",
              activeTab === tab.key
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
            )}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === "systems" && <DeletedSystemsTab />}
      {activeTab === "users" && <DeletedUsersTab />}
      {activeTab === "organisations" && <DeletedOrgsTab />}
    </div>
  )
}

// ─── Systems Tab ────────────────────────────────────────────────

function DeletedSystemsTab() {
  const deletedSystems = useQuery(api.systems.listDeleted)
  const restoreSystem = useMutation(api.systems.restore)
  const [restoreTarget, setRestoreTarget] = useState<{ id: Id<"systems">; name: string } | null>(null)
  const [restoring, setRestoring] = useState(false)

  async function handleRestore() {
    if (!restoreTarget) return
    setRestoring(true)
    try {
      await restoreSystem({ id: restoreTarget.id })
    } catch (err) {
      console.error("Failed to restore system:", err)
    } finally {
      setRestoring(false)
      setRestoreTarget(null)
    }
  }

  if (!deletedSystems) return <Skeleton className="h-48" />
  if (deletedSystems.length === 0) return <EmptyState resourceType="systems" />

  return (
    <>
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Sector</TableHead>
              <TableHead>Deleted</TableHead>
              <TableHead className="w-24" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {deletedSystems.map((system) => (
              <TableRow key={system._id}>
                <TableCell className="font-medium">{system.name}</TableCell>
                <TableCell className="text-muted-foreground">{system.sector ?? "—"}</TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {formatDeletedDate(system.deletedAt)}
                </TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setRestoreTarget({ id: system._id, name: system.name })}
                  >
                    <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
                    Restore
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <RestoreDialog
        open={!!restoreTarget}
        onOpenChange={(open) => { if (!open) setRestoreTarget(null) }}
        resourceType="system"
        resourceName={restoreTarget?.name ?? ""}
        onConfirm={handleRestore}
        restoring={restoring}
      />
    </>
  )
}

// ─── Users Tab ──────────────────────────────────────────────────

function DeletedUsersTab() {
  const deletedUsers = useQuery(api.users.listDeleted)
  const restoreUser = useMutation(api.users.restore)
  const [restoreTarget, setRestoreTarget] = useState<{ id: Id<"users">; name: string } | null>(null)
  const [restoring, setRestoring] = useState(false)

  async function handleRestore() {
    if (!restoreTarget) return
    setRestoring(true)
    try {
      await restoreUser({ id: restoreTarget.id })
    } catch (err) {
      console.error("Failed to restore user:", err)
    } finally {
      setRestoring(false)
      setRestoreTarget(null)
    }
  }

  if (!deletedUsers) return <Skeleton className="h-48" />
  if (deletedUsers.length === 0) return <EmptyState resourceType="users" />

  return (
    <>
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Deleted</TableHead>
              <TableHead className="w-24" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {deletedUsers.map((user) => (
              <TableRow key={user._id}>
                <TableCell className="font-medium">{user.name ?? "—"}</TableCell>
                <TableCell className="text-muted-foreground">{user.email}</TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {formatDeletedDate(user.deletedAt)}
                </TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setRestoreTarget({ id: user._id, name: user.name ?? user.email })}
                  >
                    <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
                    Restore
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <RestoreDialog
        open={!!restoreTarget}
        onOpenChange={(open) => { if (!open) setRestoreTarget(null) }}
        resourceType="user"
        resourceName={restoreTarget?.name ?? ""}
        onConfirm={handleRestore}
        restoring={restoring}
      />
    </>
  )
}

// ─── Organisations Tab ──────────────────────────────────────────

function DeletedOrgsTab() {
  const deletedOrgs = useQuery(api.organisations.listDeleted)
  const restoreOrg = useMutation(api.organisations.restore)
  const [restoreTarget, setRestoreTarget] = useState<{ id: Id<"organisations">; name: string } | null>(null)
  const [restoring, setRestoring] = useState(false)

  async function handleRestore() {
    if (!restoreTarget) return
    setRestoring(true)
    try {
      await restoreOrg({ id: restoreTarget.id })
    } catch (err) {
      console.error("Failed to restore organisation:", err)
    } finally {
      setRestoring(false)
      setRestoreTarget(null)
    }
  }

  if (!deletedOrgs) return <Skeleton className="h-48" />
  if (deletedOrgs.length === 0) return <EmptyState resourceType="organisations" />

  return (
    <>
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Deleted</TableHead>
              <TableHead className="w-24" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {deletedOrgs.map((org) => (
              <TableRow key={org._id}>
                <TableCell className="font-medium">{org.name}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-xs capitalize">{org.status}</Badge>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">{org.contactEmail ?? "—"}</TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {formatDeletedDate(org.deletedAt)}
                </TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setRestoreTarget({ id: org._id, name: org.name })}
                  >
                    <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
                    Restore
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <RestoreDialog
        open={!!restoreTarget}
        onOpenChange={(open) => { if (!open) setRestoreTarget(null) }}
        resourceType="organisation"
        resourceName={restoreTarget?.name ?? ""}
        onConfirm={handleRestore}
        restoring={restoring}
      />
    </>
  )
}

// ─── Shared Restore Confirmation Dialog ─────────────────────────

function RestoreDialog({
  open,
  onOpenChange,
  resourceType,
  resourceName,
  onConfirm,
  restoring,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  resourceType: string
  resourceName: string
  onConfirm: () => void
  restoring: boolean
}) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Restore {resourceType}?</AlertDialogTitle>
          <AlertDialogDescription>
            This will restore <span className="font-medium text-foreground">{resourceName}</span> and
            make it active again. The item will reappear in its original location.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={restoring}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} disabled={restoring}>
            {restoring ? "Restoring..." : "Restore"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
