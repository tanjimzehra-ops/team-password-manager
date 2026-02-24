import { describe, expect, it } from "vitest"
import {
  canCreateSystemForRole,
  canMutateForRole,
  getAvailableModesForRole,
} from "./rbac"

describe("rbac helpers", () => {
  it("allows add-system only for super_admin and channel_partner", () => {
    expect(canCreateSystemForRole("super_admin")).toBe(true)
    expect(canCreateSystemForRole("channel_partner")).toBe(true)
    expect(canCreateSystemForRole("admin")).toBe(false)
    expect(canCreateSystemForRole("viewer")).toBe(false)
    expect(canCreateSystemForRole(null)).toBe(false)
  })

  it("blocks mutations for viewers", () => {
    expect(canMutateForRole("viewer")).toBe(false)
    expect(canMutateForRole("admin")).toBe(true)
    expect(canMutateForRole("channel_partner")).toBe(true)
    expect(canMutateForRole("super_admin")).toBe(true)
  })

  it("restricts viewer modes to view and colour", () => {
    expect(getAvailableModesForRole("logic-model", "viewer")).toEqual(["view", "colour"])
    expect(getAvailableModesForRole("convergence-map", "viewer")).toEqual(["view", "colour"])
  })

  it("returns full mode set for logic-model and convergence-map", () => {
    expect(getAvailableModesForRole("logic-model", "admin")).toEqual([
      "view",
      "edit",
      "colour",
      "order",
      "delete",
    ])
    expect(getAvailableModesForRole("convergence-map", "channel_partner")).toEqual([
      "view",
      "edit",
      "colour",
      "order",
      "delete",
    ])
  })
})

