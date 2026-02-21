"use client"

import { useState } from "react"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Shield } from "lucide-react"

const ACTION_LABELS: Record<string, string> = {
  "system.create": "System Created",
  "system.update": "System Updated",
  "system.delete": "System Deleted",
  "membership.create": "Membership Added",
  "membership.restore": "Membership Restored",
  "membership.remove": "Membership Removed",
  "user.roleChange": "Role Changed",
}

function actionBadgeVariant(action: string): "default" | "secondary" | "outline" | "destructive" {
  if (action.includes("delete") || action.includes("remove")) return "destructive"
  if (action.includes("create") || action.includes("restore")) return "default"
  if (action.includes("roleChange")) return "secondary"
  return "outline"
}

function formatTimestamp(ts: number): string {
  return new Date(ts).toLocaleString("en-AU", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  })
}

function truncateId(id: string): string {
  if (id.length <= 16) return id
  return `${id.slice(0, 8)}...${id.slice(-6)}`
}

export default function AuditLogPage() {
  const currentUser = useQuery(api.users.me)
  const logs = useQuery(api.auditLogs.list, {})
  const [actionFilter, setActionFilter] = useState<string>("all")

  const isSuperAdmin = currentUser?.isSuperAdmin ?? false

  if (!currentUser || logs === undefined) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-40" />
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

  // Get unique actions for filter
  const uniqueActions = Array.from(new Set(logs.map((l) => l.action))).sort()

  const filteredLogs = actionFilter === "all"
    ? logs
    : logs.filter((l) => l.action === actionFilter)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Audit Log</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Compliance trail of administrative actions ({filteredLogs.length} entries)
        </p>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-3">
        <Select value={actionFilter} onValueChange={setActionFilter}>
          <SelectTrigger className="w-[220px]">
            <SelectValue placeholder="Filter by action" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Actions</SelectItem>
            {uniqueActions.map((action) => (
              <SelectItem key={action} value={action}>
                {ACTION_LABELS[action] ?? action}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[180px]">Timestamp</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Resource Type</TableHead>
              <TableHead>Resource ID</TableHead>
              <TableHead>Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLogs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No audit log entries found.
                </TableCell>
              </TableRow>
            ) : (
              filteredLogs.map((log) => (
                <TableRow key={log._id}>
                  <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                    {formatTimestamp(log.timestamp)}
                  </TableCell>
                  <TableCell className="text-sm">{log.userEmail}</TableCell>
                  <TableCell>
                    <Badge variant={actionBadgeVariant(log.action)} className="text-xs">
                      {ACTION_LABELS[log.action] ?? log.action}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm capitalize">{log.resourceType}</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground" title={log.resourceId}>
                    {truncateId(log.resourceId)}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground max-w-[200px] truncate">
                    {log.details ? JSON.stringify(log.details) : "—"}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
