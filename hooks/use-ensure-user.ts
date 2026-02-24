"use client"

import { useEffect, useRef } from "react"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useConvexAuthBypass } from "./use-convex-auth-bypass"
import { useAuthBypass as useAuth } from "./use-auth-bypass"

const DEV_BYPASS = process.env.NEXT_PUBLIC_DEV_BYPASS_AUTH === "true"

/**
 * Auto-provisions the authenticated user's record in Convex on first sign-in.
 * Passes email/name from the WorkOS session since the JWT may not include them.
 *
 * In dev bypass mode, provisioning is skipped (Convex bypass handles identity).
 */
export function useEnsureUser() {
  const { isAuthenticated, isLoading: convexLoading } = useConvexAuthBypass()
  const { user, loading: authLoading } = useAuth()
  const getOrCreateMe = useMutation(api.users.getOrCreateMe)
  const lastSyncedUserId = useRef<string | null>(null)

  useEffect(() => {
    // In dev bypass mode, skip user provisioning
    if (DEV_BYPASS) return
    if (convexLoading || authLoading || !isAuthenticated || !user) return

    // Skip if we already synced this exact user (by WorkOS user ID)
    if (lastSyncedUserId.current === user.id) return

    lastSyncedUserId.current = user.id
    getOrCreateMe({
      email: user.email ?? undefined,
      name: `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || undefined,
      avatarUrl: user.profilePictureUrl ?? undefined,
    }).catch((err) => {
      console.error("[useEnsureUser] Failed to provision user:", err)
      // Reset so the next render can retry
      lastSyncedUserId.current = null
    })
  }, [isAuthenticated, convexLoading, authLoading, user, getOrCreateMe])
}
