export type UserRole = "super_admin" | "channel_partner" | "admin" | "viewer"
export type EditMode = "view" | "edit" | "colour" | "order" | "delete"
export type ViewTab = "logic-model" | "contribution-map" | "development-pathways" | "convergence-map" | "canvas"

export function canCreateSystemForRole(role: UserRole | null): boolean {
  return role === "super_admin" || role === "channel_partner"
}

export function canMutateForRole(role: UserRole | null): boolean {
  return role !== "viewer"
}

export function getAvailableModesForRole(activeTab: ViewTab, role: UserRole | null): EditMode[] {
  if (role === "viewer") {
    return ["view", "colour"]
  }

  if (activeTab === "logic-model" || activeTab === "convergence-map") {
    return ["view", "edit", "colour", "order", "delete"]
  }

  return ["view", "edit", "colour"]
}

