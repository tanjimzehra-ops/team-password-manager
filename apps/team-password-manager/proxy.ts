import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

/**
 * Simple middleware/proxy for the Team Password Manager app.
 * This app uses its own client-side authentication via AuthProvider,
 * so we just pass all requests through.
 */
export default function proxy(request: NextRequest) {
  return NextResponse.next()
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
}
