export const isDevBypassEnabled =
  process.env.NEXT_PUBLIC_DEV_BYPASS_AUTH === "true" &&
  process.env.NODE_ENV === "development"

