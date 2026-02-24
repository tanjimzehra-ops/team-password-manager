"use client"

import { useState } from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface AddSystemDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddSystemDialog({ open, onOpenChange }: AddSystemDialogProps) {
  const orgs = useQuery(api.organisations.list)
  const createSystem = useMutation(api.systems.create)
  const { toast } = useToast()

  const [name, setName] = useState("")
  const [sector, setSector] = useState("")
  const [orgId, setOrgId] = useState<string>("")
  const [saving, setSaving] = useState(false)

  function resetForm() {
    setName("")
    setSector("")
    setOrgId("")
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !orgId) return

    setSaving(true)
    try {
      await createSystem({
        name: name.trim(),
        sector: sector.trim() || undefined,
        impact: "",
        dimension: "",
        challenge: "",
        orgId: orgId as Id<"organisations">,
      })
      toast({ title: "System created", description: `"${name.trim()}" has been created.` })
      resetForm()
      onOpenChange(false)
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to create system"
      toast({ title: "Error", description: message, variant: "destructive" })
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) resetForm(); onOpenChange(v) }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add System</DialogTitle>
          <DialogDescription>
            Create a new strategic system within an organisation.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label htmlFor="system-name">System Name *</Label>
            <Input
              id="system-name"
              placeholder="e.g. MERA"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="system-sector">Sector</Label>
            <Input
              id="system-sector"
              placeholder="e.g. Clean Energy"
              value={sector}
              onChange={(e) => setSector(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="system-org">Organisation *</Label>
            <Select value={orgId} onValueChange={setOrgId}>
              <SelectTrigger id="system-org" className="w-full">
                <SelectValue placeholder={orgs === undefined ? "Loading..." : "Select organisation"} />
              </SelectTrigger>
              <SelectContent>
                {orgs?.map((org) => (
                  <SelectItem key={String(org._id)} value={String(org._id)}>
                    {org.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving || !name.trim() || !orgId}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
