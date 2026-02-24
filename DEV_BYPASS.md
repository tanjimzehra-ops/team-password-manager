# Dev Auth Bypass

Local development convenience that skips WorkOS authentication so you can use
the app without signing in.

## What It Does

| Layer | Behaviour when active |
|---|---|
| **Convex backend** (`convex/lib/permissions.ts`) | `getCurrentUser()` returns the first super_admin user instead of reading JWT identity |
| **Frontend auth hook** (`hooks/use-auth-bypass.ts`) | `useAuthBypass()` returns a fake WorkOS user object |
| **Frontend Convex auth hook** (`hooks/use-convex-auth-bypass.ts`) | `useConvexAuthBypass()` returns `{ isAuthenticated: true }` |

## How to Enable

Set **both** of the following env vars:

```bash
# .env.local (Next.js frontend)
NEXT_PUBLIC_DEV_BYPASS_AUTH=true

# Convex dashboard → Settings → Environment Variables (or .env in convex/)
CONVEX_DEV_BYPASS_AUTH=true
```

## How to Disable

Remove or set to any value other than `"true"`:

```bash
NEXT_PUBLIC_DEV_BYPASS_AUTH=false   # or delete the line
CONVEX_DEV_BYPASS_AUTH=false        # or delete from Convex env vars
```

## Why It's Safe — Multi-Layer Guards

The bypass is **double-gated** at every layer so it cannot activate in
production even if an env var is accidentally set:

### Backend (Convex)

```
CONVEX_DEV_BYPASS_AUTH === "true"  AND  CONVEX_IS_PRODUCTION !== "true"
```

Set `CONVEX_IS_PRODUCTION=true` on your production Convex deployment. Even
without it, the bypass only fires when `CONVEX_DEV_BYPASS_AUTH` is explicitly
`"true"` — a value that should never be configured in production.

### Frontend (Next.js)

```
NEXT_PUBLIC_DEV_BYPASS_AUTH === "true"  AND  NODE_ENV === "development"
```

Vercel (and any `next build`) sets `NODE_ENV=production`, so the bypass is
dead code in production bundles regardless of env var values.

## How to Verify It's Not Active in Production

1. **Frontend**: Open DevTools → Console. Run:
   ```js
   // Should be "production" on Vercel
   console.log(process.env.NODE_ENV)
   ```
   If `NODE_ENV` is `"production"`, the frontend bypass cannot activate.

2. **Convex backend**: In the Convex dashboard, check Environment Variables.
   Confirm `CONVEX_DEV_BYPASS_AUTH` is **not set** (or not `"true"`), and
   `CONVEX_IS_PRODUCTION` is `"true"`.

3. **End-to-end**: Open the production URL in an incognito window. You should
   be redirected to the WorkOS sign-in page. If you see the app without
   signing in, the bypass is incorrectly active.
