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

const DEV_BYPASS =
  process.env.NEXT_PUBLIC_DEV_BYPASS_AUTH === "true" &&
  process.env.NODE_ENV === "development"

export function useConvexAuthBypass() {
  if (DEV_BYPASS) {
    return { isAuthenticated: true, isLoading: false }
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useConvexAuth()
}
