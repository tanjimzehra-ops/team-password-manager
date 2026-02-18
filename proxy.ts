import { authkitMiddleware } from "@workos-inc/authkit-nextjs"

export default authkitMiddleware({
  eagerAuth: true,
  middlewareAuth: {
    enabled: true,
    // Public paths — no auth required
    unauthenticatedPaths: [
      "/",           // Main app (reads are public for legacy systems)
      "/sign-in",
      "/sign-up",
    ],
    // Everything else (including /admin/*) requires authentication
  },
  // Handle Vercel preview/production redirect URIs
  redirectUri:
    process.env.VERCEL_ENV === "preview"
      ? `https://${process.env.VERCEL_BRANCH_URL}/callback`
      : process.env.VERCEL_ENV === "production"
        ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}/callback`
        : undefined,
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
}
