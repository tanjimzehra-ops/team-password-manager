"use client"

import { useEffect, useRef } from "react"
import { useConvexAuth, useMutation } from "convex/react"
import { useAuth } from "@workos-inc/authkit-nextjs/components"
import { api } from "@/convex/_generated/api"

/**
 * Auto-provisions the authenticated user's record in Convex on first sign-in.
 * Passes email/name from the WorkOS session since the JWT may not include them.
 */
export function useEnsureUser() {
  const { isAuthenticated, isLoading: convexLoading } = useConvexAuth()
  const { user, loading: authLoading } = useAuth()
  const getOrCreateMe = useMutation(api.users.getOrCreateMe)
  const hasSynced = useRef(false)

  useEffect(() => {
    if (convexLoading || authLoading || !isAuthenticated || hasSynced.current) return

    hasSynced.current = true
    getOrCreateMe({
      email: user?.email ?? undefined,
      name: user ? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || undefined : undefined,
      avatarUrl: user?.profilePictureUrl ?? undefined,
    }).catch((err) => {
      console.error("[useEnsureUser] Failed to provision user:", err)
      hasSynced.current = false
    })
  }, [isAuthenticated, convexLoading, authLoading, user, getOrCreateMe])
}
