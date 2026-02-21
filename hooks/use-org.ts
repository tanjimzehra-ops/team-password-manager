"use client"

import { createContext, useContext } from "react"

export interface OrgInfo {
  id: string
  name: string
  status: string
}

interface OrgContextValue {
  orgs: OrgInfo[]
  selectedOrgId: string | null
  setSelectedOrgId: (id: string | null) => void
  isLoading: boolean
}

export const OrgContext = createContext<OrgContextValue>({
  orgs: [],
  selectedOrgId: null,
  setSelectedOrgId: () => {},
  isLoading: true,
})

export function useOrg() {
  return useContext(OrgContext)
}
