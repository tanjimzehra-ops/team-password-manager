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
import { Plus, MoreHorizontal, Pencil, Trash2 } from "lucide-react"

type ChannelStatus = "active" | "inactive"

interface ChannelForm {
  name: string
  slug: string
  contactEmail: string
  status: ChannelStatus
}

const EMPTY_FORM: ChannelForm = {
  name: "",
  slug: "",
  contactEmail: "",
  status: "active",
}

function statusColor(status: string) {
  switch (status) {
    case "active": return "default"
    case "inactive": return "outline"
    default: return "outline"
  }
}

export default function ChannelsPage() {
  const channels = useQuery(api.channels.list)
  const currentUser = useQuery(api.users.me)
  const createChannel = useMutation(api.channels.create)
  const updateChannel = useMutation(api.channels.update)
  const removeChannel = useMutation(api.channels.remove)

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<Id<"channels"> | null>(null)
  const [deleteId, setDeleteId] = useState<Id<"channels"> | null>(null)
  const [form, setForm] = useState<ChannelForm>(EMPTY_FORM)
  const [saving, setSaving] = useState(false)

  const isSuperAdmin = currentUser?.isSuperAdmin ?? false

  function openCreate() {
    setForm(EMPTY_FORM)
    setEditingId(null)
    setDialogOpen(true)
  }

  function openEdit(channel: { _id: Id<"channels"> } & Record<string, unknown>) {
    setForm({
      name: (channel.name as string) || "",
      slug: (channel.slug as string) || "",
      contactEmail: (channel.contactEmail as string) || "",
      status: (channel.status as ChannelStatus) || "active",
    })
    setEditingId(channel._id)
    setDialogOpen(true)
  }

  async function handleSave() {
    if (!form.name.trim() || !form.slug.trim()) return
    setSaving(true)
    try {
      if (editingId) {
        await updateChannel({
          id: editingId,
          name: form.name,
          slug: form.slug,
          contactEmail: form.contactEmail || undefined,
          status: form.status,
        })
      } else {
        await createChannel({
          name: form.name,
          slug: form.slug,
          contactEmail: form.contactEmail || undefined,
          status: form.status,
        })
      }
      setDialogOpen(false)
    } catch (err) {
      console.error("Failed to save channel:", err)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!deleteId) return
    setSaving(true)
    try {
      await removeChannel({ id: deleteId })
      setDeleteId(null)
    } catch (err) {
      console.error("Failed to delete channel:", err)
    } finally {
      setSaving(false)
    }
  }

  if (!channels || !currentUser) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-64" />
      </div>
    )
  }

  if (!isSuperAdmin) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold tracking-tight">Channels</h1>
        <p className="text-sm text-muted-foreground">Access denied. Only super admins can manage channels.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Channels</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage channel partners
          </p>
        </div>
        {isSuperAdmin && (
          <Button onClick={openCreate} size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add Channel
          </Button>
        )}
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Contact Email</TableHead>
              <TableHead>Orgs</TableHead>
              <TableHead>Status</TableHead>
              {isSuperAdmin && <TableHead className="w-12" />}
            </TableRow>
          </TableHeader>
          <TableBody>
            {channels.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No channels found. Create one to get started.
                </TableCell>
              </TableRow>
            ) : (
              channels.map((ch) => (
                <TableRow key={ch._id}>
                  <TableCell className="font-medium">{ch.name}</TableCell>
                  <TableCell className="text-muted-foreground">{ch.slug}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {(ch as Record<string, unknown>).contactEmail as string || "—"}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {(ch as Record<string, unknown>).orgCount as number ?? 0}
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusColor(ch.status)}>
                      {ch.status}
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
                          <DropdownMenuItem onClick={() => openEdit(ch as { _id: Id<"channels"> } & Record<string, unknown>)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setDeleteId(ch._id)}
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
            <DialogTitle>{editingId ? "Edit" : "Create"} Channel</DialogTitle>
            <DialogDescription>
              {editingId ? "Update the channel details." : "Add a new channel partner."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Channel partner name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Slug *</Label>
              <Input
                id="slug"
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                placeholder="channel-slug"
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
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={form.status}
                onValueChange={(v) => setForm({ ...form, status: v as ChannelStatus })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving || !form.name.trim() || !form.slug.trim()}>
              {saving ? "Saving..." : editingId ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Channel</DialogTitle>
            <DialogDescription>
              This will soft-delete the channel. It can be restored later.
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
