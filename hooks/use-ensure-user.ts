"use client"

import { useEffect, useRef } from "react"
import { useConvexAuth, useMutation } from "convex/react"
import { useAuth } from "@workos-inc/authkit-nextjs/components"
import { api } from "@/convex/_generated/api"

/**
 * Auto-provisions the authenticated user's record in Convex on first sign-in.
 * Passes email/name from the WorkOS session since the JWT may not include them.
 *
 * Tracks the last-synced user ID so that switching accounts (without a full
 * page reload) correctly provisions the new user.
 */
export function useEnsureUser() {
  const { isAuthenticated, isLoading: convexLoading } = useConvexAuth()
  const { user, loading: authLoading } = useAuth()
  const getOrCreateMe = useMutation(api.users.getOrCreateMe)
  const lastSyncedUserId = useRef<string | null>(null)

  useEffect(() => {
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
