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
      "/invite/:token",
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

function isPublicPath(pathname: string): boolean {
  if (publicPaths.includes(pathname)) return true
  return pathname.startsWith("/invite/")
}

export default async function proxy(request: NextRequest, event: NextFetchEvent) {
  // Next.js 16 strips the RSC header before it reaches the proxy, so we use
  // Sec-Fetch-Dest to detect programmatic fetch() requests (client-side navigation).
  // Browser navigations send Sec-Fetch-Dest: document and can follow cross-origin
  // redirects. fetch() requests send Sec-Fetch-Dest: empty and CANNOT follow
  // cross-origin redirects (causes CORS error when WorkOS redirect is returned).
  const secFetchDest = request.headers.get("sec-fetch-dest")
  const isFetchRequest = secFetchDest !== null && secFetchDest !== "document"

  if (isFetchRequest) {
    const hasSession = request.cookies.has("wos-session")
    if (!hasSession && !isPublicPath(request.nextUrl.pathname)) {
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
