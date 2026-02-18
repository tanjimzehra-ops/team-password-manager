"use client"

import { ConvexProviderWithAuth, ConvexReactClient } from "convex/react"
import { AuthKitProvider, useAuth, useAccessToken } from "@workos-inc/authkit-nextjs/components"
import { type ReactNode, useCallback, useState } from "react"

export function ConvexClientProvider({
  expectAuth,
  children,
}: {
  expectAuth: boolean
  children: ReactNode
}) {
  const [convex] = useState(() => {
    return new ConvexReactClient(
      process.env.NEXT_PUBLIC_CONVEX_URL || "https://placeholder-not-configured.convex.cloud",
      { expectAuth }
    )
  })

  return (
    <AuthKitProvider>
      <ConvexProviderWithAuth client={convex} useAuth={useAuthFromAuthKit}>
        {children}
      </ConvexProviderWithAuth>
    </AuthKitProvider>
  )
}

function useAuthFromAuthKit() {
  const { user, loading: isLoading } = useAuth()
  const { getAccessToken, refresh } = useAccessToken()

  const isAuthenticated = !!user

  const fetchAccessToken = useCallback(
    async ({ forceRefreshToken }: { forceRefreshToken?: boolean } = {}): Promise<string | null> => {
      if (!user) {
        return null
      }

      try {
        if (forceRefreshToken) {
          return (await refresh()) ?? null
        }
        return (await getAccessToken()) ?? null
      } catch (error) {
        console.error("Failed to get access token:", error)
        return null
      }
    },
    [user, refresh, getAccessToken],
  )

  return {
    isLoading,
    isAuthenticated,
    fetchAccessToken,
  }
}
