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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import { Plus, MoreHorizontal, Pencil, Trash2, RotateCcw } from "lucide-react"

type OrgStatus = "active" | "inactive" | "trial"

interface OrgForm {
  name: string
  contactEmail: string
  contactNumber: string
  abn: string
  channel: string
  status: OrgStatus
}

const EMPTY_FORM: OrgForm = {
  name: "", contactEmail: "", contactNumber: "", abn: "", channel: "", status: "active",
}

function statusColor(status: string) {
  switch (status) {
    case "active": return "default"
    case "trial": return "secondary"
    case "inactive": return "outline"
    default: return "outline"
  }
}

export default function ClientsPage() {
  const orgs = useQuery(api.organisations.list)
  const currentUser = useQuery(api.users.me)
  const createOrg = useMutation(api.organisations.create)
  const updateOrg = useMutation(api.organisations.update)
  const removeOrg = useMutation(api.organisations.remove)
  const restoreOrg = useMutation(api.organisations.restore)

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<Id<"organisations"> | null>(null)
  const [deleteId, setDeleteId] = useState<Id<"organisations"> | null>(null)
  const [form, setForm] = useState<OrgForm>(EMPTY_FORM)
  const [saving, setSaving] = useState(false)

  const isSuperAdmin = currentUser?.isSuperAdmin ?? false

  function openCreate() {
    setForm(EMPTY_FORM)
    setEditingId(null)
    setDialogOpen(true)
  }

  function openEdit(org: { _id: Id<"organisations"> } & Record<string, unknown>) {
    setForm({
      name: (org.name as string) || "",
      contactEmail: (org.contactEmail as string) || "",
      contactNumber: (org.contactNumber as string) || "",
      abn: (org.abn as string) || "",
      channel: (org.channel as string) || "",
      status: (org.status as OrgStatus) || "active",
    })
    setEditingId(org._id)
    setDialogOpen(true)
  }

  async function handleSave() {
    if (!form.name.trim()) return
    setSaving(true)
    try {
      if (editingId) {
        await updateOrg({
          id: editingId,
          name: form.name,
          contactEmail: form.contactEmail || undefined,
          contactNumber: form.contactNumber || undefined,
          abn: form.abn || undefined,
          channel: form.channel || undefined,
          status: form.status,
        })
      } else {
        await createOrg({
          name: form.name,
          contactEmail: form.contactEmail || undefined,
          contactNumber: form.contactNumber || undefined,
          abn: form.abn || undefined,
          channel: form.channel || undefined,
          status: form.status,
        })
      }
      setDialogOpen(false)
    } catch (err) {
      console.error("Failed to save organisation:", err)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!deleteId) return
    setSaving(true)
    try {
      await removeOrg({ id: deleteId })
      setDeleteId(null)
    } catch (err) {
      console.error("Failed to delete organisation:", err)
    } finally {
      setSaving(false)
    }
  }

  if (!orgs || !currentUser) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-64" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Clients</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage client organisations
          </p>
        </div>
        {isSuperAdmin && (
          <Button onClick={openCreate} size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add Client
          </Button>
        )}
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Contact Email</TableHead>
              <TableHead>ABN</TableHead>
              <TableHead>Channel</TableHead>
              <TableHead>Status</TableHead>
              {isSuperAdmin && <TableHead className="w-12" />}
            </TableRow>
          </TableHeader>
          <TableBody>
            {orgs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No organisations found. Create one to get started.
                </TableCell>
              </TableRow>
            ) : (
              orgs.map((org) => (
                <TableRow key={org._id}>
                  <TableCell className="font-medium">{org.name}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {(org as Record<string, unknown>).contactEmail as string || "—"}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {(org as Record<string, unknown>).abn as string || "—"}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {(org as Record<string, unknown>).channel as string || "—"}
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusColor(org.status)}>
                      {org.status}
                    </Badge>
                  </TableCell>
                  {isSuperAdmin && (
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEdit(org as { _id: Id<"organisations"> } & Record<string, unknown>)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setDeleteId(org._id)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Create / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit" : "Create"} Organisation</DialogTitle>
            <DialogDescription>
              {editingId ? "Update the organisation details." : "Add a new client organisation."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Organisation name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactEmail">Contact Email</Label>
              <Input
                id="contactEmail"
                type="email"
                value={form.contactEmail}
                onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
                placeholder="contact@example.com"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contactNumber">Phone</Label>
                <Input
                  id="contactNumber"
                  value={form.contactNumber}
                  onChange={(e) => setForm({ ...form, contactNumber: e.target.value })}
                  placeholder="+61..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="abn">ABN</Label>
                <Input
                  id="abn"
                  value={form.abn}
                  onChange={(e) => setForm({ ...form, abn: e.target.value })}
                  placeholder="XX XXX XXX XXX"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="channel">Channel</Label>
                <Input
                  id="channel"
                  value={form.channel}
                  onChange={(e) => setForm({ ...form, channel: e.target.value })}
                  placeholder="e.g. KPMG, Direct"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={form.status}
                  onValueChange={(v) => setForm({ ...form, status: v as OrgStatus })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="trial">Trial</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving || !form.name.trim()}>
              {saving ? "Saving..." : editingId ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Organisation</DialogTitle>
            <DialogDescription>
              This will soft-delete the organisation. It can be restored later.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={saving}>
              {saving ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
