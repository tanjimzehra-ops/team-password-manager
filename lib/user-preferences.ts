const PROFILE_KEY = "jigsaw-profile"
const SETTINGS_KEY = "jigsaw-settings"

export interface ProfileData {
  name: string
  organisation: string
}

export interface AppSettings {
  defaultDisplayMode: "stage" | "performance"
  defaultShowKpi: boolean
  defaultDisplayLogic: boolean
}

const defaultProfile: ProfileData = {
  name: "User",
  organisation: "",
}

const defaultSettings: AppSettings = {
  defaultDisplayMode: "stage",
  defaultShowKpi: false,
  defaultDisplayLogic: false,
}

export function getStoredProfile(): ProfileData {
  if (typeof window === "undefined") return defaultProfile
  try {
    const raw = localStorage.getItem(PROFILE_KEY)
    if (!raw) return defaultProfile
    const parsed = JSON.parse(raw) as Partial<ProfileData>
    return { ...defaultProfile, ...parsed }
  } catch {
    return defaultProfile
  }
}

export function setStoredProfile(data: Partial<ProfileData>) {
  if (typeof window === "undefined") return
  const current = getStoredProfile()
  const next = { ...current, ...data }
  localStorage.setItem(PROFILE_KEY, JSON.stringify(next))
}

export function getStoredSettings(): AppSettings {
  if (typeof window === "undefined") return defaultSettings
  try {
    const raw = localStorage.getItem(SETTINGS_KEY)
    if (!raw) return defaultSettings
    const parsed = JSON.parse(raw) as Partial<AppSettings>
    return { ...defaultSettings, ...parsed }
  } catch {
    return defaultSettings
  }
}

export function setStoredSettings(data: Partial<AppSettings>) {
  if (typeof window === "undefined") return
  const current = getStoredSettings()
  const next = { ...current, ...data }
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(next))
}
