# Session 87 Handoff — Bug Fixes (4 Known Issues + 2 Emergent)

**Date:** 2026-02-22
**Author:** Claude Opus (orchestrator)
**Previous:** Session 86 — Handoff doc after Session 85 (11 stories + 3 hotfixes)
**Status:** All bugs fixed. App tested and working in production.

---

## What Was Done in Session 87

11 commits on main (`693b792` → `06282e6`): 4 planned bug fixes + 2 emergent fixes + iterative commits for Bug A.

### Planned Bug Fixes

| Bug | Description | Key Commits | Status |
|-----|-------------|-------------|--------|
| A — RSC CORS redirect | Next.js 16 strips `RSC` header from proxy. Switched to `Sec-Fetch-Dest` detection | `9c95829` (final fix) | **Verified on production** |
| B — Audit log gaps | Wired `logAudit()` to 22 mutations across 8 Convex files | `0899bb3` | **Verified** |
| C — Auth gating | `requireAuth()` on all system queries (list/get/getFullSystem) | `b4cc44c`, `c0ab1ae` | **Verified** |
| D — Audit pagination | Cursor-based pagination with `usePaginatedQuery` + Load More | `4618250` | **Verified** |

### Emergent Fixes (discovered during deployment)

| Fix | Description | Commit | Status |
|-----|-------------|--------|--------|
| React #300 hooks order | Moved auth early return after all hooks in `page.tsx` | `f6b0abb` | **Verified** |
| Account switch provisioning | Track `lastSyncedUserId` instead of boolean `hasSynced` in `useEnsureUser` | `06282e6` | **Verified** |

### Documentation

| Change | Commit |
|--------|--------|
| `project-context.md` — 12 corrections/additions (69 rules) | `06282e6` |
| `SESSION-87-HANDOFF.md` — This file | `06282e6` |

---

## Key Discoveries

### Bug A — RSC Header Stripped by Next.js 16

**Root cause:** Next.js 16 (Turbopack) strips the `RSC` header before it reaches `proxy.ts`. The documented approach of checking `request.headers.get("RSC") === "1"` NEVER works — the header is always `null`.

**Solution:** Use `Sec-Fetch-Dest` header instead:
- `Sec-Fetch-Dest: empty` → programmatic `fetch()` (client-side navigation) → redirect to `/`
- `Sec-Fetch-Dest: document` → browser navigation → let WorkOS handle normally
- `null` (no header, e.g. curl) → let WorkOS handle normally

This is robust because `Sec-Fetch-Dest` is a standard browser header, not a framework-internal header.

### React #300 — Hooks Ordering Violation

**Root cause:** `app/page.tsx` had an early return (`if (!authLoading && !user) return <LandingPage />`) on line 82, BEFORE ~20 hooks (useState, useEditMode, useQuery, etc.). When auth state transitioned from `authLoading=true` (all hooks called) to unauthenticated (early return, hooks skipped), React detected fewer hooks.

**Fix:** Moved the early return to after all hooks (line ~600). All hooks now run unconditionally; queries that depend on auth use the `"skip"` pattern.

### Account Switch — User Provisioning

**Root cause:** `useEnsureUser` used a boolean `hasSynced` ref that stayed `true` after provisioning user A. When user B signed in (without a full page reload), the hook skipped provisioning.

**Fix:** Changed to `lastSyncedUserId` string ref that tracks the actual WorkOS user ID. Account switch correctly triggers re-provisioning.

### Convex Functions Require Separate Deployment

Convex backend functions are NOT deployed through Vercel git push. Must run `npx convex dev --once` (or `npx convex deploy` for production) separately to push Convex function changes.

---

## Current State

### All Working
- All 4 matrix views with 5 modes each (view/edit/colour/order/delete)
- Full CRUD via Convex in real-time
- WorkOS AuthKit sign-in/sign-out (staging keys)
- Account switching between different users
- Landing page for unauthenticated users
- Sign-out, user avatar, org switcher in header
- Global search in sidebar
- RSC CORS redirect prevention (Sec-Fetch-Dest)
- Audit logging — all mutations covered (35 action types)
- Authentication required for all system access
- Cursor-based pagination on audit logs (Load More)
- Onboarding tour (first-time)
- Enhanced Excel export
- Soft delete restore (/admin/trash)
- Dark/light mode
- Deployed to Vercel: https://jigsaw-1-6-rsa.vercel.app

### No Known Bugs

All bugs from Session 86 handoff have been resolved. App tested end-to-end on production.

---

## Files Modified in Session 87

### Bug A (proxy CORS)
- `proxy.ts` — `Sec-Fetch-Dest` detection instead of `RSC` header

### Bug B (audit logging — 8 Convex files)
- `convex/elements.ts` — 4 mutations: create, update, reorder, remove
- `convex/kpis.ts` — 4 mutations: create, update, remove, replaceForParent
- `convex/matrixCells.ts` — 2 mutations: upsert, remove
- `convex/capabilities.ts` — 2 mutations: upsert, remove
- `convex/externalValues.ts` — 3 mutations: create, update, remove
- `convex/factors.ts` — 2 mutations: upsert, remove
- `convex/portfolios.ts` — 3 mutations: create, update, remove
- `convex/organisations.ts` — 2 mutations: create, update
- `app/admin/audit/page.tsx` — 35 ACTION_LABELS + pagination UI

### Bug C (auth gating)
- `convex/systems.ts` — `requireAuth()` on list, null-check on get/getFullSystem
- `hooks/convex/use-convex-systems.ts` — `useConvexAuth()` guard with "skip"

### Bug D (pagination)
- `convex/auditLogs.ts` — `paginationOptsValidator` + `.paginate()`
- `app/admin/audit/page.tsx` — `usePaginatedQuery` + Load More button

### React #300 + Account Switch
- `app/page.tsx` — Moved auth early return after all hooks
- `hooks/use-ensure-user.ts` — `lastSyncedUserId` ref instead of boolean

### Documentation
- `_bmad-output/project-context.md` — 12 updates (69 rules total)

---

## Pending Work

### Before client onboarding
- [ ] Switch to production WorkOS keys (`sk_live_`)
- [ ] Decide Convex deployment strategy (dev `hidden-fish-6` vs prod `abundant-duck-746`)
- [ ] Onboard Martin/Pradeep/Tanjim (sign in + assign roles)
- [ ] Visual QA on production (all views, exports, admin pages)

### Tier 3 (post-revenue, Jigsaw 2.0)
- Dashboard / Health scoreboard
- AI Strategy Assistant
- Node as Knowledge Centre
- Portfolio Health Overview
- Galaxy View
- Strategic Mirroring / Sandbox
- Dynamic theming per client
- Enhanced PDF export (McKinsey-grade)
- Animated transitions

---

## Tech Stack Reference

Same as Session 86. Key additions:
- **Proxy detection:** `Sec-Fetch-Dest` header (NOT `RSC` header — stripped by Next.js 16)
- **Convex deploy:** `npx convex dev --once` for dev, `npx convex deploy` for prod
- **Hooks rule:** All hooks in `page.tsx` must run before any early returns
- **User provisioning:** `useEnsureUser` tracks user ID, not boolean flag

## Key Files (updated)
- `proxy.ts` — Auth middleware with Sec-Fetch-Dest CORS prevention
- `app/page.tsx` — Main orchestrator (hooks before early returns)
- `hooks/use-ensure-user.ts` — User auto-provisioning (tracks user ID)
- `hooks/convex/use-convex-systems.ts` — Auth-guarded system list
- `convex/auditLogs.ts` — Paginated audit log query + `logAudit()` helper
- `app/admin/audit/page.tsx` — Audit UI with 35 action labels + Load More
- `_bmad-output/project-context.md` — 69 rules for AI agents

---

*Handoff prepared by Claude Opus — 22 Feb 2026*
