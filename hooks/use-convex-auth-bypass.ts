"use client"

/**
 * Wrapper around useConvexAuth that works in dev bypass mode.
 *
 * When NEXT_PUBLIC_DEV_BYPASS_AUTH=true:
 * - Returns { isAuthenticated: true, isLoading: false } always
 * - Does NOT call useConvexAuth (which requires ConvexProviderWithAuth)
 *
 * When disabled:
 * - Delegates to useConvexAuth from convex/react
 */

import { useConvexAuth } from "convex/react"

const DEV_BYPASS = process.env.NEXT_PUBLIC_DEV_BYPASS_AUTH === "true"

export function useConvexAuthBypass() {
  if (DEV_BYPASS) {
    return { isAuthenticated: true, isLoading: false }
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useConvexAuth()
}
