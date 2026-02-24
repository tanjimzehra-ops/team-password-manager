import { describe, expect, it } from "vitest"
import { emailsMatch, normalizeEmail } from "./email"

describe("email helpers", () => {
  it("normalizes case and surrounding whitespace", () => {
    expect(normalizeEmail("  USER@Example.COM ")).toBe("user@example.com")
  })

  it("matches equivalent emails", () => {
    expect(emailsMatch("User@Example.com", " user@example.COM ")).toBe(true)
  })

  it("rejects different emails", () => {
    expect(emailsMatch("user+a@example.com", "user@example.com")).toBe(false)
  })
})

