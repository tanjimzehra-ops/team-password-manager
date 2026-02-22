import { authkitMiddleware } from "@workos-inc/authkit-nextjs"
import type { NextFetchEvent, NextRequest } from "next/server"
import { NextResponse } from "next/server"

const workosAuth = authkitMiddleware({
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

// Paths that don't require authentication (must match unauthenticatedPaths above)
const publicPaths = ["/", "/sign-in", "/sign-up", "/callback"]

export default async function proxy(request: NextRequest, event: NextFetchEvent) {
  // RSC requests (client-side navigation) use fetch(), which cannot follow
  // cross-origin redirects. When authkitMiddleware redirects an unauthenticated
  // RSC request to WorkOS, the browser blocks it with a CORS error.
  // Pre-check: if RSC + no session cookie + protected path → redirect to /
  const isRSC = request.headers.get("RSC") === "1" || request.nextUrl.searchParams.has("_rsc")
  if (isRSC) {
    const hasSession = request.cookies.has("wos-session")
    const isPublicPath = publicPaths.some((p) => request.nextUrl.pathname === p)
    if (!hasSession && !isPublicPath) {
      return NextResponse.redirect(new URL("/", request.url))
    }
  }

  return workosAuth(request, event)
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
}
