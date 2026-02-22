# Session 87 Handoff — Bug Fixes (4 Known Issues)

**Date:** 2026-02-22
**Author:** Claude Opus (orchestrator)
**Previous:** Session 86 — Handoff doc after Session 85 (11 stories + 3 hotfixes)

---

## What Was Done in Session 87

10 commits on main (`693b792` → `f6b0abb`): 4 bug fixes + 6 iterative fix commits for Bug A.

### Bug Fixes (4 planned)

| Bug | Description | Commits | Status |
|-----|-------------|---------|--------|
| A — RSC CORS redirect | Next.js 16 strips `RSC` header from proxy. Switched to `Sec-Fetch-Dest` detection | `693b792`, `355cd40`, `b6f397a`, `9c95829` | **Verified on production** |
| B — Audit log gaps | Wired `logAudit()` to 22 mutations across 8 Convex files | `0899bb3` | **Deployed** |
| C — Auth gating | `requireAuth()` on all system queries (list/get/getFullSystem) | `b4cc44c`, `c0ab1ae` | **Deployed** |
| D — Audit pagination | Cursor-based pagination with `usePaginatedQuery` + Load More | `4618250` | **Deployed** |

### Additional Fix (discovered during deployment)

| Fix | Description | Commit | Status |
|-----|-------------|--------|--------|
| React #300 hooks order | Moved auth early return after all hooks in `page.tsx` | `f6b0abb` | **Deployed, partial fix** |

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

**Partial fix:** Moved the early return to after all hooks (line ~600). First sign-in works, but error recurs on subsequent sign-ins with different accounts. **This needs further investigation** — likely another conditional hook call or a component that conditionally calls hooks.

### Convex Functions Require Separate Deployment

Convex backend functions are NOT deployed through Vercel git push. Must run `npx convex dev --once` (or `npx convex deploy` for production) separately to push Convex function changes.

---

## Current State

### Working
- All 4 matrix views with 5 modes each
- Full CRUD via Convex in real-time
- WorkOS AuthKit (staging keys)
- Landing page for unauthenticated users
- Sign-out, user avatar, org switcher in header
- RSC CORS redirect prevention (Sec-Fetch-Dest)
- Audit logging (all mutations now covered)
- Authentication required for all system access
- Cursor-based pagination on audit logs
- First sign-in flow works correctly

### Known Bug — React #300 on Account Switch
- **Symptom:** React error #300 ("Rendered fewer hooks than expected") when switching between accounts
- **Location:** Likely `app/page.tsx` or a component that conditionally calls hooks based on user state
- **First sign-in works fine**, error occurs on subsequent sign-ins
- **Needs investigation:** Run dev server, sign in with one account, sign out, sign in with another — reproduce and check console for component-level error

---

## Files Modified in Session 87

### Bug A (proxy CORS)
- `proxy.ts` — `Sec-Fetch-Dest` detection instead of `RSC` header

### Bug B (audit logging)
- `convex/elements.ts` — 4 mutations: create, update, reorder, remove
- `convex/kpis.ts` — 4 mutations: create, update, remove, replaceForParent
- `convex/matrixCells.ts` — 2 mutations: upsert, remove
- `convex/capabilities.ts` — 2 mutations: upsert, remove
- `convex/externalValues.ts` — 3 mutations: create, update, remove
- `convex/factors.ts` — 2 mutations: upsert, remove
- `convex/portfolios.ts` — 3 mutations: create, update, remove
- `convex/organisations.ts` — 2 mutations: create, update
- `app/admin/audit/page.tsx` — 35 ACTION_LABELS

### Bug C (auth gating)
- `convex/systems.ts` — `requireAuth()` on list, null-check on get/getFullSystem
- `hooks/convex/use-convex-systems.ts` — `useConvexAuth()` guard with "skip"

### Bug D (pagination)
- `convex/auditLogs.ts` — `paginationOptsValidator` + `.paginate()`
- `app/admin/audit/page.tsx` — `usePaginatedQuery` + Load More button

### React #300
- `app/page.tsx` — Moved auth early return after all hooks

---

## Pending Work

### Immediate (this session, not yet done)
- [ ] **Fix React #300 on account switch** — investigate conditional hooks in page.tsx and child components
- [ ] Update `_bmad-output/project-context.md` with Session 87 discoveries

### Before client onboarding
- [ ] Switch to production WorkOS keys (`sk_live_`)
- [ ] Decide Convex deployment strategy (dev vs prod)
- [ ] Onboard Martin/Pradeep/Tanjim
- [ ] Visual QA on production

---

## Tech Stack Reference

Same as Session 86. Key addition:
- **Proxy detection:** `Sec-Fetch-Dest` header (NOT `RSC` header — stripped by Next.js 16)
- **Convex deploy:** `npx convex dev --once` for dev, `npx convex deploy` for prod

---

*Handoff prepared by Claude Opus — 22 Feb 2026*
