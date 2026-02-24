import { describe, expect, it } from "vitest"
import { randomToken } from "./crypto"

describe("randomToken", () => {
  it("returns a hex token with 2 chars per byte", () => {
    expect(randomToken(32)).toMatch(/^[a-f0-9]{64}$/)
    expect(randomToken(16)).toMatch(/^[a-f0-9]{32}$/)
  })

  it("produces non-repeating values across multiple calls", () => {
    const values = new Set(Array.from({ length: 8 }, () => randomToken(16)))
    expect(values.size).toBe(8)
  })
})

