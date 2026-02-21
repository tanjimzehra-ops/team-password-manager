"use client"

import { createContext, useContext } from "react"

export interface OrgInfo {
  id: string
  name: string
  status: string
}

export interface OrgContextValue {
  orgs: OrgInfo[]
  selectedOrgId: string | null
  setSelectedOrgId: (id: string | null) => void
  isLoading: boolean
}

export const OrgContext = createContext<OrgContextValue | null>(null)

export function useOrg() {
  const context = useContext(OrgContext)
  if (!context) {
    throw new Error("useOrg must be used within an OrgProvider")
  }
  return context
}
