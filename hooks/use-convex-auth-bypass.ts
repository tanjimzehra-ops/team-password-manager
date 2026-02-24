"use client"

/**
 * Wrapper around useConvexAuth that works in dev bypass mode.
 *
 * When NEXT_PUBLIC_DEV_BYPASS_AUTH=true AND NODE_ENV=development:
 * - Returns { isAuthenticated: true, isLoading: false } always
 * - Does NOT call useConvexAuth (which requires ConvexProviderWithAuth)
 *
 * When disabled (or in production builds):
 * - Delegates to useConvexAuth from convex/react
 *
 * Double-gated: even if the env var leaks, production builds
 * (NODE_ENV=production) will never activate the bypass.
 */

import { useConvexAuth } from "convex/react"
import { isDevBypassEnabled } from "@/lib/dev-bypass"

export function useConvexAuthBypass() {
  if (isDevBypassEnabled) {
    return { isAuthenticated: true, isLoading: false }
  }

  return useConvexAuth()
}
