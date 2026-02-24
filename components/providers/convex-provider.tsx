"use client"

import { ConvexProviderWithAuth, ConvexReactClient, ConvexProvider } from "convex/react"
import { AuthKitProvider, useAuth, useAccessToken } from "@workos-inc/authkit-nextjs/components"
import { type ReactNode, useCallback, useState } from "react"
import { useEnsureUser } from "@/hooks/use-ensure-user"

const DEV_BYPASS = process.env.NEXT_PUBLIC_DEV_BYPASS_AUTH === "true"

function UserProvisioner({ children }: { children: ReactNode }) {
  useEnsureUser()
  return <>{children}</>
}

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
      // When bypassing auth, don't expect auth tokens
      { expectAuth: DEV_BYPASS ? false : expectAuth }
    )
  })

  // Dev bypass: skip WorkOS entirely, use plain ConvexProvider (no auth)
  if (DEV_BYPASS) {
    return (
      <ConvexProvider client={convex}>
        {children}
      </ConvexProvider>
    )
  }

  return (
    <AuthKitProvider>
      <ConvexProviderWithAuth client={convex} useAuth={useAuthFromAuthKit}>
        <UserProvisioner>{children}</UserProvisioner>
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
