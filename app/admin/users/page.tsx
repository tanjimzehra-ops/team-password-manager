"use client"

import { useState } from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { MoreHorizontal, UserPlus, Trash2, Shield, ShieldCheck, Eye } from "lucide-react"

type Role = "super_admin" | "admin" | "viewer"

function roleColor(role: string): "default" | "secondary" | "outline" {
  switch (role) {
    case "super_admin": return "default"
    case "admin": return "secondary"
    default: return "outline"
  }
}

function roleLabel(role: string) {
  switch (role) {
    case "super_admin": return "Super Admin"
    case "admin": return "Admin"
    case "viewer": return "Viewer"
    default: return role
  }
}

function roleIcon(role: string) {
  switch (role) {
    case "super_admin": return ShieldCheck
    case "admin": return Shield
    default: return Eye
  }
}

export default function UsersPage() {
  const currentUser = useQuery(api.users.me)
  const users = useQuery(api.users.list)
  const organisations = useQuery(api.organisations.list)
  const createMembership = useMutation(api.memberships.create)
  const updateRole = useMutation(api.memberships.updateRole)
  const removeMembership = useMutation(api.memberships.remove)
  const removeUser = useMutation(api.users.remove)

  const [addMemberOpen, setAddMemberOpen] = useState(false)
  const [selectedUserId, setSelectedUserId] = useState<Id<"users"> | null>(null)
  const [selectedOrgId, setSelectedOrgId] = useState<string>("")
  const [selectedRole, setSelectedRole] = useState<Role>("viewer")
  const [saving, setSaving] = useState(false)
  const [expandedUser, setExpandedUser] = useState<Id<"users"> | null>(null)

  const isSuperAdmin = currentUser?.isSuperAdmin ?? false

  if (!users || !currentUser || !organisations) {
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

  function openAddMembership(userId: Id<"users">) {
    setSelectedUserId(userId)
    setSelectedOrgId("")
    setSelectedRole("viewer")
    setAddMemberOpen(true)
  }

  async function handleAddMembership() {
    if (!selectedUserId || !selectedOrgId) return
    setSaving(true)
    try {
      await createMembership({
        userId: selectedUserId,
        orgId: selectedOrgId as Id<"organisations">,
        role: selectedRole,
      })
      setAddMemberOpen(false)
    } catch (err) {
      console.error("Failed to add membership:", err)
    } finally {
      setSaving(false)
    }
  }

  async function handleRoleChange(membershipId: Id<"memberships">, role: Role) {
    try {
      await updateRole({ id: membershipId, role })
    } catch (err) {
      console.error("Failed to update role:", err)
    }
  }

  async function handleRemoveMembership(membershipId: Id<"memberships">) {
    try {
      await removeMembership({ id: membershipId })
    } catch (err) {
      console.error("Failed to remove membership:", err)
    }
  }

  async function handleDeleteUser(userId: Id<"users">) {
    if (!confirm("Soft-delete this user? They will lose access.")) return
    try {
      await removeUser({ id: userId })
    } catch (err) {
      console.error("Failed to delete user:", err)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Users</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage users and organisation memberships ({users.length} users)
        </p>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12" />
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Memberships</TableHead>
              <TableHead className="w-12" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No users found. Users appear here after signing in via WorkOS.
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => {
                const initials = user.name
                  ? user.name.split(" ").map((n: string) => n[0]).join("").toUpperCase()
                  : user.email[0]?.toUpperCase() ?? "?"
                const isExpanded = expandedUser === user._id
                return (
                  <UserRow
                    key={user._id}
                    user={user}
                    initials={initials}
                    isExpanded={isExpanded}
                    onToggleExpand={() =>
                      setExpandedUser(isExpanded ? null : user._id)
                    }
                    onAddMembership={() => openAddMembership(user._id)}
                    onRoleChange={handleRoleChange}
                    onRemoveMembership={handleRemoveMembership}
                    onDeleteUser={() => handleDeleteUser(user._id)}
                    organisations={organisations}
                  />
                )
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add Membership Dialog */}
      <Dialog open={addMemberOpen} onOpenChange={setAddMemberOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Add Organisation Membership</DialogTitle>
            <DialogDescription>
              Assign this user to an organisation with a specific role.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Organisation</Label>
              <Select value={selectedOrgId} onValueChange={setSelectedOrgId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select organisation" />
                </SelectTrigger>
                <SelectContent>
                  {organisations.map((org) => (
                    <SelectItem key={org._id} value={org._id}>
                      {org.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Select value={selectedRole} onValueChange={(v) => setSelectedRole(v as Role)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="viewer">Viewer</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="super_admin">Super Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddMemberOpen(false)}>Cancel</Button>
            <Button onClick={handleAddMembership} disabled={saving || !selectedOrgId}>
              {saving ? "Adding..." : "Add Membership"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Extracted row component for readability
function UserRow({
  user,
  initials,
  isExpanded,
  onToggleExpand,
  onAddMembership,
  onRoleChange,
  onRemoveMembership,
  onDeleteUser,
  organisations,
}: {
  user: { _id: Id<"users">; name?: string; email: string; workosId: string }
  initials: string
  isExpanded: boolean
  onToggleExpand: () => void
  onAddMembership: () => void
  onRoleChange: (id: Id<"memberships">, role: Role) => void
  onRemoveMembership: (id: Id<"memberships">) => void
  onDeleteUser: () => void
  organisations: { _id: Id<"organisations">; name: string }[]
}) {
  const memberships = useQuery(api.memberships.byUser, { userId: user._id })

  return (
    <>
      <TableRow className="cursor-pointer" onClick={onToggleExpand}>
        <TableCell>
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary/10 text-primary text-xs">
              {initials}
            </AvatarFallback>
          </Avatar>
        </TableCell>
        <TableCell className="font-medium">{user.name || "—"}</TableCell>
        <TableCell className="text-muted-foreground">{user.email}</TableCell>
        <TableCell>
          <div className="flex flex-wrap gap-1">
            {memberships?.map((m) => {
              const org = organisations.find((o) => o._id === m.orgId)
              const Icon = roleIcon(m.role)
              return (
                <Badge key={m._id} variant={roleColor(m.role)} className="text-xs gap-1">
                  <Icon className="h-3 w-3" />
                  {org?.name ?? "Unknown"}: {roleLabel(m.role)}
                </Badge>
              )
            }) ?? <span className="text-xs text-muted-foreground">Loading...</span>}
            {memberships?.length === 0 && (
              <span className="text-xs text-muted-foreground">No memberships</span>
            )}
          </div>
        </TableCell>
        <TableCell>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => e.stopPropagation()}>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onAddMembership() }}>
                <UserPlus className="mr-2 h-4 w-4" />
                Add Membership
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => { e.stopPropagation(); onDeleteUser() }}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete User
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>

      {/* Expanded: Membership details */}
      {isExpanded && memberships && memberships.length > 0 && (
        <TableRow>
          <TableCell colSpan={5} className="bg-muted/30 px-12 py-3">
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Memberships</p>
              {memberships.map((m) => {
                const org = organisations.find((o) => o._id === m.orgId)
                return (
                  <div key={m._id} className="flex items-center justify-between gap-4 rounded-md border bg-background px-3 py-2">
                    <span className="text-sm font-medium">{org?.name ?? "Unknown Org"}</span>
                    <div className="flex items-center gap-2">
                      <Select
                        value={m.role}
                        onValueChange={(v) => onRoleChange(m._id, v as Role)}
                      >
                        <SelectTrigger className="h-8 w-36 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="viewer">Viewer</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="super_admin">Super Admin</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => onRemoveMembership(m._id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          </TableCell>
        </TableRow>
      )}
    </>
  )
}
