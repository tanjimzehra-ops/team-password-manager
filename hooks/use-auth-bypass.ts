"use client"

/**
 * Auth hook wrapper that supports dev bypass mode.
 *
 * When NEXT_PUBLIC_DEV_BYPASS_AUTH=true:
 * - Returns a fake user object (always authenticated)
 * - No WorkOS dependency
 *
 * When disabled:
 * - Delegates to WorkOS useAuth() as normal
 *
 * This file is safe in production — the env var is never set there.
 */

import { useAuth as useWorkOSAuth } from "@workos-inc/authkit-nextjs/components"

const DEV_BYPASS = process.env.NEXT_PUBLIC_DEV_BYPASS_AUTH === "true"

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
  if (DEV_BYPASS) {
    return {
      user: FAKE_DEV_USER,
      loading: false,
    }
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useWorkOSAuth()
}
