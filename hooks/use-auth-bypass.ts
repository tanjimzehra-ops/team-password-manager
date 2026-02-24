"use client"

/**
 * Auth hook wrapper that supports dev bypass mode.
 *
 * When NEXT_PUBLIC_DEV_BYPASS_AUTH=true AND NODE_ENV=development:
 * - Returns a fake user object (always authenticated)
 * - No WorkOS dependency
 *
 * When disabled (or in production builds):
 * - Delegates to WorkOS useAuth() as normal
 *
 * Double-gated: even if the env var leaks, production builds
 * (NODE_ENV=production) will never activate the bypass.
 */

import { useAuth as useWorkOSAuth } from "@workos-inc/authkit-nextjs/components"
import { isDevBypassEnabled } from "@/lib/dev-bypass"

// Fake user for dev bypass (matches WorkOS user shape)
const FAKE_DEV_USER = {
  id: "dev-bypass-user",
  email: "dev@localhost",
  firstName: "Dev",
  lastName: "Bypass",
  profilePictureUrl: null,
  object: "user" as const,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  emailVerified: true,
}

export function useAuthBypass() {
  if (isDevBypassEnabled) {
    return {
      user: FAKE_DEV_USER,
      loading: false,
      signOut: async () => {},
    }
  }

  return useWorkOSAuth()
}
