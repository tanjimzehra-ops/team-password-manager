import { describe, expect, it, vi } from "vitest"

describe("isDevBypassEnabled", () => {
  it("is true only when bypass env is true in development", async () => {
    vi.resetModules()
    vi.stubEnv("NEXT_PUBLIC_DEV_BYPASS_AUTH", "true")
    vi.stubEnv("NODE_ENV", "development")
    const mod = await import("./dev-bypass")
    expect(mod.isDevBypassEnabled).toBe(true)
  })

  it("is false in production even when bypass env is true", async () => {
    vi.resetModules()
    vi.stubEnv("NEXT_PUBLIC_DEV_BYPASS_AUTH", "true")
    vi.stubEnv("NODE_ENV", "production")
    const mod = await import("./dev-bypass")
    expect(mod.isDevBypassEnabled).toBe(false)
  })
})
