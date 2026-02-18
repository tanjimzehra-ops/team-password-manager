# Session 82 Handoff — Authentication Implementation (Blocks 1-3)

**Date:** 2026-02-18
**Branch:** `session-82-auth-schema`
**Duration:** ~1.5 hours
**Session Type:** Implementation (BMAD Dev Agent)

## What Was Accomplished

### Block 2: Schema Migration (DONE)
- **3 new Convex tables:** `organisations`, `users`, `memberships`
- **`systems` table updated:** added `orgId` (optional, for tenancy) + `deletedAt` (soft delete)
- **Role validator:** `"super_admin" | "admin" | "viewer"` — expandable to 5 without migration
- **Indexes:** `by_org`, `by_workosId`, `by_email`, `by_user`, `by_user_org`, `by_status`
- **CRUD functions:** Full create/read/update/soft-delete for all 3 new tables
- All existing data untouched — new fields are `v.optional()`

### Block 1: Auth Scaffolding (DONE)
- **Package installed:** `@workos-inc/authkit-nextjs@2.14.0`
- **Convex JWT config:** `convex/auth.config.ts` — validates WorkOS RS256 tokens via JWKS
- **Auth middleware:** `proxy.ts` (Next.js 16 convention) — eagerAuth + route protection
- **Auth routes:** `/callback`, `/sign-in`, `/sign-up`
- **Provider updated:** `ConvexProviderWithAuth` + `AuthKitProvider` wrapping
- **Layout updated:** Server-side `withAuth()` check, passes `expectAuth` to provider
- **Convex env:** `WORKOS_CLIENT_ID` set on deployment
- **WorkOS Dashboard:** Redirect URI `http://localhost:3000/callback` configured by Nicolas

### Block 3: RBAC + Org-Scoped Queries (DONE)
- **Permission helpers:** `convex/lib/permissions.ts` — 9 functions covering auth, roles, org access
- **All 7 mutation files auth-gated:** `requireAuth()` + `requireWriteAccess()` on every mutation
- **Org-scoped system queries:** `systems.list` filters by user's orgs; super admins see all
- **Admin tables protected:** organisations/memberships/users queries require auth + role checks
- **`users.me` query added:** Returns current user + memberships + isSuperAdmin flag
- **Middleware enforced:** `/admin/*` requires auth; `/` remains public
- **Soft delete:** `systems.remove` now sets `deletedAt` instead of hard delete

## Files Changed (16 modified + 10 new)

### New Files
| File | Purpose |
|------|---------|
| `convex/auth.config.ts` | JWT validation config (WorkOS RS256/JWKS) |
| `convex/lib/permissions.ts` | RBAC permission helpers (9 functions) |
| `convex/organisations.ts` | Organisations CRUD (auth-gated) |
| `convex/users.ts` | Users CRUD + `me` query (auth-gated) |
| `convex/memberships.ts` | Memberships CRUD + `myMemberships` (auth-gated) |
| `proxy.ts` | Auth middleware (Next.js 16 proxy convention) |
| `app/callback/route.ts` | WorkOS OAuth callback handler |
| `app/sign-in/route.ts` | Redirect to WorkOS sign-in |
| `app/sign-up/route.ts` | Redirect to WorkOS sign-up |

### Modified Files
| File | Changes |
|------|---------|
| `convex/schema.ts` | +3 tables, +orgId/deletedAt on systems, role validators |
| `convex/systems.ts` | Org-scoped queries, auth-gated mutations, soft delete |
| `convex/elements.ts` | Auth-gated mutations |
| `convex/kpis.ts` | Auth-gated mutations |
| `convex/matrixCells.ts` | Auth-gated mutations |
| `convex/capabilities.ts` | Auth-gated mutations |
| `convex/externalValues.ts` | Auth-gated mutations |
| `convex/factors.ts` | Auth-gated mutations |
| `convex/portfolios.ts` | Auth-gated mutations |
| `components/providers/convex-provider.tsx` | ConvexProviderWithAuth + AuthKitProvider |
| `app/layout.tsx` | Server-side withAuth(), async layout |
| `.env.example` | WorkOS env var template |
| `package.json` | +@workos-inc/authkit-nextjs |

## Security Model

```
UNAUTHENTICATED:
  - Can view legacy systems (orgId = null) — read-only
  - Cannot execute any mutation
  - Cannot access /admin/*

AUTHENTICATED (viewer):
  - Can view legacy systems + own org's systems
  - Cannot execute mutations (viewers are read-only in current model)

AUTHENTICATED (admin):
  - Can view/edit own org's systems
  - Can manage users within own org
  - Cannot create/delete organisations

AUTHENTICATED (super_admin):
  - Full access to everything across all orgs
  - Can create/delete organisations
  - Can assign any role including super_admin

LEGACY TRANSITION:
  - Systems without orgId are visible to all (auth or not)
  - Systems without orgId allow writes from any authenticated user
  - Once Block 5 assigns orgIds, proper isolation kicks in
```

## Environment Variables

### Already Set
- `.env.local`: WORKOS_CLIENT_ID, WORKOS_API_KEY, WORKOS_COOKIE_PASSWORD, NEXT_PUBLIC_WORKOS_REDIRECT_URI
- Convex deployment: WORKOS_CLIENT_ID
- WorkOS Dashboard: Redirect URI `http://localhost:3000/callback`

### Still Needed (for production)
- Vercel env vars: WORKOS_CLIENT_ID, WORKOS_API_KEY, WORKOS_COOKIE_PASSWORD
- WorkOS Dashboard (production environment): production redirect URI
- Vercel env: NEXT_PUBLIC_WORKOS_REDIRECT_URI for production

## What's NOT Done Yet

| Block | Task | Status | Notes |
|-------|------|--------|-------|
| 4 | Admin Console UI (`/admin`) | NOT STARTED | Depends on Block 3 (done) |
| 5 | Data Migration + Super Admin Seeding | NOT STARTED | Seed script for orgs + super admins |
| 6 | Deploy + Verify | NOT STARTED | Depends on 4+5 |
| 7 | Post-Deploy Enhancements | NOT STARTED | Audit log, email alerts, etc. |

## Known Issues / Risks

1. **Auth not tested end-to-end yet** — Build passes but no live login test. Need `pnpm dev` + Convex dev to verify the full flow.
2. **No users in DB yet** — The `users` table is empty. Until Block 5 seeds super admins and a user signs in via WorkOS, `getCurrentUser()` will return null for everyone. This means mutations will fail for now (by design — they require auth).
3. **Legacy system visibility** — Unauthenticated users can still see legacy systems (no orgId). This is intentional for the transition period.
4. **Convex `npx convex dev` not run** — The schema changes haven't been pushed to the Convex deployment yet. Need to run `npx convex dev` to sync.

## Git Status

- Branch: `session-82-auth-schema` (not merged to main)
- All changes committed
- Not pushed to remote yet

---

## Session 83 Prompt

```markdown
# Session 83 — Auth Completion (Blocks 4-6)

## Context
Session 82 implemented Blocks 1-3 of the auth build order:
- Block 1: WorkOS AuthKit scaffolding (proxy, routes, provider)
- Block 2: Schema migration (organisations, users, memberships tables)
- Block 3: RBAC + org-scoped queries (permission helpers, auth-gated mutations)

All code is on branch `session-82-auth-schema`. Build passes. Auth NOT tested live yet.

## Critical Files to Read First
1. `sessions/SESSION-82-HANDOFF.md` — This handoff document
2. `convex/lib/permissions.ts` — Permission helpers (the RBAC engine)
3. `convex/schema.ts` — Full schema with auth tables
4. `convex/systems.ts` — Org-scoped queries pattern
5. `proxy.ts` — Auth middleware config
6. `components/providers/convex-provider.tsx` — Auth provider setup

## What Needs to Happen

### Priority 1: Test Auth End-to-End
1. Run `npx convex dev` to push schema changes to Convex
2. Run `pnpm dev` to start the app
3. Navigate to `/sign-in` — should redirect to WorkOS
4. Sign in with Nicolas's email
5. Verify `users.me` query returns the authenticated user
6. Debug any issues

### Priority 2: Block 5 — Data Migration + Super Admin Seeding
1. Create a seed script that:
   - Creates org records for existing clients (MERA, Central Highlands, etc.)
   - Creates user records for the 4 super admins (Nicolas, Martin, Pradeep, Tanjim)
   - Creates memberships linking super admins to orgs
   - Assigns orgId to existing systems
2. Run the seed script
3. Verify org-scoped queries work (super admin sees all, others see their org)

### Priority 3: Block 4 — Admin Console UI
1. Create `/admin` layout with sidebar navigation
2. `/admin/clients` — List organisations, create new, edit, soft delete
3. `/admin/users` — List users, manage memberships, assign roles
4. Use shadcn/ui components (already installed)
5. Reference screenshots in `sessions/screenshots-ref/` for Blazor Jigsaw layout

### Priority 4: Block 6 — Deploy + Verify
1. Set WorkOS env vars in Vercel (production + preview)
2. Add production redirect URI in WorkOS dashboard
3. Deploy and verify auth flow works in production

## Super Admin Emails (for seeding)
- Nicolas: [ask Nicolas for his email]
- Martin: [ask Nicolas]
- Pradeep: [ask Nicolas]
- Tanjim: [ask Nicolas]

## Existing Systems to Map to Orgs
- MERA → [ask Nicolas which org]
- Kiraa → [ask Nicolas]
- Levur → [ask Nicolas]
- Central Highlands → [ask Nicolas]

## Tech Stack Reminder
- Next.js 16 (App Router) + React 19 + TypeScript
- Convex (real-time backend)
- pnpm (never npm/yarn)
- Tailwind CSS 4 + shadcn/ui (New York style)
- WorkOS AuthKit (@workos-inc/authkit-nextjs@2.14.0)
```
