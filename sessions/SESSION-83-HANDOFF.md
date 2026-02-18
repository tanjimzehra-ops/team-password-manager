# Session 83 Handoff — Auth Completion (Blocks 4-5) + Admin Console

**Date:** 2026-02-18
**Branch:** `session-82-auth-schema`
**Duration:** ~45 minutes
**Session Type:** Implementation (BMAD Dev Agent — Amelia)

## What Was Accomplished

### Block 5: Auto-Provisioning + Seed Migration (DONE)
- **`getOrCreateMe` mutation** — auto-creates user record on first sign-in from JWT identity + WorkOS session data (email/name/avatar)
- **`useEnsureUser` hook** — fires once per session when Convex auth is ready, passes WorkOS profile to mutation
- **`UserProvisioner` component** — wired into `ConvexProviderWithAuth` tree for automatic execution
- **3 seed functions** in `convex/seed.ts`:
  - `createOrganisations` — 7 client orgs (4 active, 3 trial)
  - `bootstrapSuperAdmins` — links users to CPF org with super_admin role (by email match)
  - `assignSystemOrgs` — maps existing Convex systems to orgs by name
- **Results:** 7 orgs created, 6 systems assigned, Nicolas bootstrapped as super_admin
- **Key discovery:** WorkOS JWTs do NOT include email/name claims — solved by passing from frontend `useAuth()` session

### Block 4: Admin Console UI (DONE)
- **`/admin` layout** — sidebar nav (Dashboard, Clients, Users), current user display, "Back to Jigsaw" link
- **`/admin` dashboard** — org count, membership count, role card, quick actions
- **`/admin/clients`** — full CRUD: data table, create/edit dialogs (name, email, phone, ABN, channel, status), soft delete with confirmation
- **`/admin/users`** — user table with expandable rows, membership badges, role dropdowns, add membership dialog, delete user
- **Admin link** added to main nav sidebar (`components/layout/nav-sidebar.tsx`)
- All pages use shadcn/ui components consistent with existing design system

## Files Changed (7 modified + 5 new = 12 total, +1186 lines)

### New Files
| File | Purpose |
|------|---------|
| `app/admin/layout.tsx` | Admin Console layout — sidebar nav + user info |
| `app/admin/page.tsx` | Dashboard — org count, role display, quick actions |
| `app/admin/clients/page.tsx` | Organisation CRUD — table + create/edit/delete dialogs |
| `app/admin/users/page.tsx` | User management — expandable rows, role dropdowns, membership CRUD |
| `hooks/use-ensure-user.ts` | Auto-provisioning hook using `useConvexAuth` + WorkOS `useAuth` |

### Modified Files
| File | Changes |
|------|---------|
| `convex/users.ts` | +`getOrCreateMe` mutation (accepts email/name/avatar from frontend) |
| `convex/seed.ts` | +3 auth seed functions (createOrganisations, bootstrapSuperAdmins, assignSystemOrgs) |
| `components/providers/convex-provider.tsx` | +`UserProvisioner` wrapper in provider tree |
| `components/layout/nav-sidebar.tsx` | +Admin Console link with Shield icon |
| `convex/_generated/api.d.ts` | Auto-generated types for new functions |

## Current Auth State

### Working
- Sign-in via WorkOS → auto-provision user record → Convex auth flow
- Super admin access: Nicolas (`nicopt.au@gmail.com`) confirmed working
- Admin Console: Dashboard, Clients CRUD, Users + role management — all functional
- Org-scoped system queries: super admin sees all, others see their org + legacy systems
- 7 organisations seeded, 6 systems assigned to orgs

### Seeded Data
| Organisation | Status | Systems |
|---|---|---|
| Creating Preferred Futures | active | People globally routinely (CPF Jigsaw) |
| MERA Energy | active | MERA |
| Central Highlands Council | active | Central Highlands Council, Central Highlands Council - Strategic Plan |
| Relationships Australia Tasmania | active | Relationships Australia - Tasmania |
| Kiraa | trial | (none — "Unknown" template) |
| Levur | trial | (none — "Unknown" template) |
| Illawarra Energy Storage | trial | Illawarra Energy Storage |

### Super Admin Users
| Email | Status |
|---|---|
| nicopt.au@gmail.com | Bootstrapped as super_admin in CPF org |
| martin@creatingpreferredfutures.com.au | Pending — needs to sign in first |
| sahanipradeep103@gmail.com | Pending — needs to sign in first |
| tanjimzehra@gmail.com | Pending — needs to sign in first |

## What's NOT Done Yet

| Block | Task | Status | Notes |
|-------|------|--------|-------|
| 6 | Deploy to Vercel + production auth | NOT STARTED | See details below |
| 7 | Post-deploy enhancements | NOT STARTED | Audit log, email alerts, etc. |
| — | Merge to main | NOT DONE | Branch `session-82-auth-schema` has 2 commits ahead of main |

### Block 6: Deploy Details

**Vercel Environment Variables Needed:**
```
WORKOS_CLIENT_ID=<from .env.local>
WORKOS_API_KEY=<from .env.local>
WORKOS_COOKIE_PASSWORD=<from .env.local>
NEXT_PUBLIC_WORKOS_REDIRECT_URI=https://<production-domain>/callback
```

**WorkOS Dashboard (Production Environment):**
- Add production redirect URI: `https://<production-domain>/callback`
- Optionally add preview redirect URI: `https://<vercel-branch-url>/callback`

**Convex Production:**
- `WORKOS_CLIENT_ID` already set on Convex deployment (`hidden-fish-6`)
- Verify `convex/auth.config.ts` JWKS URL works with production WorkOS environment

**Remaining Super Admins:**
- After Martin, Pradeep, and Tanjim sign in, run: `npx convex run seed:bootstrapSuperAdmins`
- Or assign roles via Admin Console (`/admin/users`)

## Git Status

- Branch: `session-82-auth-schema`
- 2 commits ahead of main:
  - `c87424d` feat: implement auth infrastructure (Blocks 1-3)
  - `fb5f95f` feat: complete auth implementation (Blocks 4-5)
- Pushed to remote

## Technical Notes

### WorkOS JWT Limitation
WorkOS AuthKit JWTs only contain `sub` (WorkOS user ID) and `iss` (issuer). Standard OIDC claims like `email` and `name` are **not included**. The solution: the frontend `useEnsureUser` hook reads user profile from WorkOS `useAuth()` session and passes it as arguments to the `getOrCreateMe` mutation.

### Auth Race Condition Fix
Initial implementation used WorkOS `useAuth()` to detect authentication, but this fires before the Convex auth token is established. Fixed by using `useConvexAuth()` from `convex/react`, which only reports `isAuthenticated: true` after the token handshake completes.

### Seed Execution Order
```
1. npx convex run seed:createOrganisations     # Create org records
2. Users sign in via WorkOS                      # Auto-provisions user records
3. npx convex run seed:bootstrapSuperAdmins     # Assign super_admin roles
4. npx convex run seed:assignSystemOrgs         # Map systems to orgs
```

---

## Session 84 Prompt

```markdown
# Session 84 — Deploy Auth to Production (Block 6)

## Context
Sessions 82-83 implemented the full auth stack on branch `session-82-auth-schema`:
- Block 1: WorkOS AuthKit scaffolding (proxy, routes, provider)
- Block 2: Schema migration (organisations, users, memberships tables)
- Block 3: RBAC + org-scoped queries (permission helpers, auth-gated mutations)
- Block 4: Admin Console UI (/admin dashboard, clients CRUD, users + role management)
- Block 5: Auto-provisioning (getOrCreateMe), seed script, super admin bootstrap

All code tested E2E locally. Nicolas is bootstrapped as super_admin. Build passes.

## Critical Files to Read First
1. `sessions/SESSION-83-HANDOFF.md` — This handoff document
2. `convex/users.ts` — getOrCreateMe mutation (auto-provisioning)
3. `hooks/use-ensure-user.ts` — Frontend auto-provisioning hook
4. `components/providers/convex-provider.tsx` — Auth provider tree with UserProvisioner
5. `proxy.ts` — Auth middleware config (redirect URI logic for Vercel environments)

## What Needs to Happen

### Priority 1: Merge to Main
1. Review the 2 commits on `session-82-auth-schema`
2. Merge to main (no conflicts expected — clean branch)
3. Verify build passes on main

### Priority 2: Set Vercel Environment Variables
1. Set in Vercel dashboard (production + preview):
   - `WORKOS_CLIENT_ID`
   - `WORKOS_API_KEY`
   - `WORKOS_COOKIE_PASSWORD`
   - `NEXT_PUBLIC_WORKOS_REDIRECT_URI` (production URL + /callback)
2. Nicolas will need to provide the production domain
3. The `proxy.ts` already handles preview/production redirect URIs dynamically

### Priority 3: Configure WorkOS Production Environment
1. In WorkOS dashboard, add production redirect URI
2. Verify the WorkOS environment (staging vs production) matches Vercel env
3. Note: Current credentials are `sk_test_` (staging) — may need production keys

### Priority 4: Deploy and Verify
1. Deploy to Vercel
2. Test sign-in flow on production
3. Verify Admin Console works
4. Have Martin/Pradeep/Tanjim sign in
5. Run `npx convex run seed:bootstrapSuperAdmins` to assign their roles

### Priority 5: Optional Enhancements (Block 7)
- Add user avatar display (WorkOS provides `profilePictureUrl`)
- Add audit logging for admin actions
- Add sign-out button to main app header
- Add org switcher for multi-org users
- Add email notifications for role changes

## Tech Stack Reminder
- Next.js 16 (App Router) + React 19 + TypeScript
- Convex (real-time backend) — deployment: `hidden-fish-6`
- pnpm (never npm/yarn)
- Tailwind CSS 4 + shadcn/ui (New York style)
- WorkOS AuthKit (@workos-inc/authkit-nextjs@2.14.0)

## Known Gotchas
- WorkOS JWTs do NOT include email/name — must pass from frontend useAuth() session
- Use `useConvexAuth()` (not WorkOS `useAuth()`) for Convex auth readiness detection
- `proxy.ts` is the Next.js 16 convention (NOT middleware.ts)
- Seed must run in order: createOrganisations → users sign in → bootstrapSuperAdmins → assignSystemOrgs
```
