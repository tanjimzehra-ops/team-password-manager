"use client"

import { ConvexProvider, ConvexReactClient } from "convex/react"
import type { ReactNode } from "react"

// When no URL is configured, use a placeholder that won't connect
// but keeps the provider mounted so hooks don't throw.
// useQuery will return undefined (loading) forever, which is fine
// since dataSource !== "convex" in that case.
const convex = new ConvexReactClient(
  process.env.NEXT_PUBLIC_CONVEX_URL || "https://placeholder-not-configured.convex.cloud"
)

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  return <ConvexProvider client={convex}>{children}</ConvexProvider>
}
