# Audit Report — `sprint/full-pipeline` (vs `main`)

**Date:** 2026-02-24  
**Auditor:** Codex (second-opinion QA + security review)  
**Repository:** `/Users/nicolaspt/Jigsaw-1.6-RSA`  
**Scope:** Planned vs implemented verification + Convex DB/RBAC/multi-tenant review + key functional QA checks

---

## 1) Findings (sorted by severity)

### AUD-001 — Critical
- **Impact:** Cross-tenant data disclosure for portfolio data. `portfolios` read endpoints are missing auth/access checks.
- **Repro steps:**
1. Call `portfolios.bySystem` or `portfolios.byElement` with another tenant's IDs.
2. Observe returned records without `requireAuth`/`canAccessSystem`.
- **Affected files/lines:** `convex/portfolios.ts:6`, `convex/portfolios.ts:16`
- **Fix recommendation:** Add `withReadAccess` (or `requireAuth + canAccessSystem`) to both query handlers.

### AUD-002 — Critical
- **Impact:** Cross-tenant user/org enumeration. `users` lookup queries and membership lookups allow identity and role mapping disclosure.
- **Repro steps:**
1. Query `users.getByEmail` / `users.getByWorkosId` / `users.get`.
2. Query `memberships.byUser` or `memberships.getByUserOrg` for discovered IDs.
- **Affected files/lines:** `convex/users.ts:31`, `convex/users.ts:42`, `convex/users.ts:53`, `convex/memberships.ts:17`, `convex/memberships.ts:46`
- **Fix recommendation:** Require authenticated, caller-scoped authorization on these lookups (self-only, org-admin, or super-admin as appropriate).

### AUD-003 — Critical
- **Impact:** Global integrity risk. Migration endpoint can rewrite system org ownership without auth/role guard.
- **Repro steps:**
1. Invoke `migrations.assignLegacyOrgIds`.
2. Observe patches to `systems.orgId` without actor validation.
- **Affected files/lines:** `convex/migrations.ts:25`, `convex/migrations.ts:57`
- **Fix recommendation:** Convert to `internalMutation` (preferred) or require `super_admin` + one-time guard + audit logging.

### AUD-004 — High
- **Impact:** Invitation hijack risk. Any authenticated user with token can accept invite; invite is not bound to invited email.
- **Repro steps:**
1. Create invitation for email A.
2. Sign in as email B.
3. Call `invitations.accept(token)` and membership is created for B.
- **Affected files/lines:** `convex/invitations.ts:196`, `convex/invitations.ts:240`
- **Fix recommendation:** Enforce normalized `user.email === invitation.email` before membership insert.

### AUD-005 — High
- **Impact:** Legacy/no-org systems remain broadly accessible. Null `orgId` pathways allow broad read/write access.
- **Repro steps:**
1. Use a system with `orgId` unset.
2. Access/modify as an unrelated authenticated user.
- **Affected files/lines:** `convex/lib/permissions.ts:211`, `convex/lib/permissions.ts:246`, `convex/systems.ts:44`, `convex/schema.ts:97`
- **Fix recommendation:** Remove permissive null-org access; enforce strict fallback (super_admin-only remediation path).

### AUD-006 — High
- **Impact:** Dev bypass isolation is inconsistent and can break build/runtime auth boundary expectations.
- **Repro steps:**
1. With `.env.local` containing `NEXT_PUBLIC_DEV_BYPASS_AUTH=true`, run `pnpm build`.
2. Build fails with `useAuth must be used within an AuthKitProvider`.
- **Affected files/lines:** `components/providers/convex-provider.tsx:8`, `components/providers/convex-provider.tsx:31`, `app/layout.tsx:60`, `hooks/use-auth-bypass.ts:20`, `.env.local:18`
- **Fix recommendation:** Use one shared bypass predicate (`env && NODE_ENV==="development"`) across layout/provider/hooks and verify production build path always keeps AuthKitProvider wiring coherent.

### AUD-007 — Medium
- **Impact:** Super-admin “All clients” org-switch behavior is overridden by auto-select effect.
- **Repro steps:**
1. Select “All clients” in org switcher.
2. Observe app re-selecting first org due auto-select effect.
- **Affected files/lines:** `components/org-switcher.tsx:53`, `app/page.tsx:113`
- **Fix recommendation:** Only auto-select first org when user is not super_admin (or when no explicit selection exists).

### AUD-008 — Medium
- **Impact:** Story 8.4 acceptance is only partially implemented (role behavior mismatch; no auto-select on create).
- **Repro steps:**
1. Compare Story 8.4 acceptance criteria to current UI/backend behavior.
2. Add System button is not role-filtered in sidebar; backend allows admin/super_admin (not channel_partner); create flow does not auto-select new system.
- **Affected files/lines:** `_bmad-output/planning-artifacts/epics.md:980`, `_bmad-output/planning-artifacts/epics.md:998`, `components/layout/nav-sidebar.tsx:233`, `convex/systems.ts:152`, `components/add-system-dialog.tsx:24`
- **Fix recommendation:** Align UI/backend with specified role model and select newly created system immediately.

### AUD-009 — Medium
- **Impact:** Viewer restrictions from Story 1.6 are not fully enforced in page wiring.
- **Repro steps:**
1. Story requires viewer-only access to `view/colour/export`.
2. `ViewControls` supports role gating but page does not pass role.
- **Affected files/lines:** `_bmad-output/planning-artifacts/epics.md:188`, `components/view-controls.tsx:42`, `app/page.tsx:774`
- **Fix recommendation:** Resolve and pass effective role to controls; add client-side guard rails for edit/order/delete handlers.

### AUD-010 — Medium
- **Impact:** Invitation token entropy quality is weak (`Math.random`).
- **Repro steps:** Inspect `generateToken()` implementation.
- **Affected files/lines:** `convex/invitations.ts:29`
- **Fix recommendation:** Use cryptographically secure randomness from runtime-available API.

---

## 2) Planned vs Done matrix

| Story / requirement | Implementation evidence | Status | Risk |
|---|---|---|---|
| 8.1 Query-side access control for listed data queries | `convex/lib/queries.ts:33`; applied in `elements/kpis/capabilities/matrixCells/factors/externalValues` | **Done (for listed endpoints)** | Additional high-risk query surfaces remain unguarded (`portfolios`, `users`, `memberships`) |
| 8.2 Hash invitation tokens + restrict exposure | `convex/invitations.ts:104`, `convex/invitations.ts:289`, `convex/invitations.ts:68`, `convex/lib/crypto.ts:31` | **Partial** | Weak RNG; no clear invalidation/migration of existing plaintext historical tokens; accept flow not email-bound |
| 8.3 Isolate dev bypass from production | `convex/lib/permissions.ts:33`, `hooks/use-auth-bypass.ts:20`, `hooks/use-convex-auth-bypass.ts:20`, `DEV_BYPASS.md` | **Partial** | Inconsistent bypass predicates + build/runtime failure under bypass env |
| 8.4 Enable Add System (SA/CP only, auto-select) | `components/add-system-dialog.tsx`, `components/layout/nav-sidebar.tsx:233`, `convex/systems.ts:152` | **Partial** | Role/behavior divergence from acceptance criteria |
| 8.5 Empty state on app load + persistence | `app/page.tsx:98`, `app/page.tsx:155`, `app/page.tsx:622` | **Done** | Org-switch edge case can override user intent |
| 8.6 Hide indicator + migrate legacy systems | `app/page.tsx:784`, `convex/migrations.ts` | **Partial** | Indicator still appears for JSON fallback banner; migration endpoint unsafe |
| 1.5 Add-node in edit mode | `components/logic-grid.tsx:202`, `app/page.tsx:497` | **Done** | No automated regression tests |
| 1.6 Mode controls + viewer limits | `components/node-card.tsx:159`, `components/view-controls.tsx:42`, `app/page.tsx:774` | **Partial** | Viewer restrictions not fully wired in page |
| 1.7 New system isolation | `convex/systems.ts:146` | **Partial** | Legacy null-org exception weakens isolation model |

---

## 3) Testing gaps and residual risks

- `pnpm lint` cannot run because `eslint` is missing from installed deps/toolchain while lint script exists (`package.json:9`).
- `pnpm build` fails in current environment with auth-provider runtime error on `/` prerender when bypass is active.
- No automated integration/e2e security tests were found for tenant boundaries.
- Live Convex deployment env state (`CONVEX_DEV_BYPASS_AUTH`, `CONVEX_IS_PRODUCTION`) was not verified in dashboard during this audit.
- Live data validation for migration completion (all systems now have valid `orgId`) was not independently verified in this session.

### Explicit assumptions and unknowns
- Assumption: current code behavior reflects deployed branch logic.
- Unknown: production environment variable configuration at deploy target.
- Unknown: whether all legacy/no-org systems have already been remediated in persisted data.

---

## 4) Prioritized remediation backlog

### P0 (must-fix before merge/deploy)

1. **Close all remaining unscoped read surfaces**
- Targets: `portfolios.bySystem`, `portfolios.byElement`, `users.get*`, `memberships.byUser/getByUserOrg`.
- **Acceptance criteria:**
1. All tenant-sensitive queries require auth.
2. System-scoped reads enforce system access checks.
3. Unauthorized cross-tenant requests return deny/null consistently.
4. Add regression tests covering enumeration attempts.

2. **Secure migration endpoint**
- Target: `migrations.assignLegacyOrgIds`.
- **Acceptance criteria:**
1. Endpoint is internal-only or super-admin-only.
2. Every execution emits actor + summary audit.
3. Repeat runs are safe and require explicit operator intent.

3. **Bind invitation acceptance to invited identity + strong token generation**
- Target: `invitations.accept`, `invitations.generateToken`.
- **Acceptance criteria:**
1. Accept only when authenticated email matches invite email.
2. Token generation uses cryptographically secure randomness.
3. Replay and revoked/expired cases are rejected and tested.

4. **Remove permissive legacy null-org access**
- Targets: `canAccessSystem`, `requireWriteAccess`, list/read filters.
- **Acceptance criteria:**
1. Non-super-admin users cannot read/write null-org systems.
2. Null-org systems trigger explicit remediation flow.
3. Tenant isolation tests pass for legacy data cases.

### P1 (must-fix before client demo)

1. **Align Add System behavior with Story 8.4**
- **Acceptance criteria:**
1. UI visibility/gating matches intended roles.
2. Backend role rules match intended roles.
3. Newly created system is selected and rendered immediately.

2. **Fix org switching (“All clients”)**
- **Acceptance criteria:**
1. Super-admin “All clients” selection persists.
2. Auto-select effect does not override explicit user selection.
3. Sidebar + main panel stay in sync after org switch.

3. **Complete viewer mode restrictions**
- **Acceptance criteria:**
1. Viewer only sees allowed modes and export.
2. Edit/order/delete controls hidden and handlers blocked.
3. UI and backend permissions remain consistent.

### P2 (hardening)

1. **Restore QA gate reliability**
- **Acceptance criteria:**
1. Lint is executable in CI/local and passes.
2. Production build passes with bypass disabled.
3. Add focused RBAC/multi-tenant test suite for Convex endpoints.

2. **Performance cleanup for permission/org scans**
- **Acceptance criteria:**
1. Replace full-table `collect()` patterns where feasible.
2. Keep behavior identical with measurable query cost reduction.

---

## Non-mutating validation executed

- Branch and commit audit: `main..sprint/full-pipeline` (40 commits ahead).
- Diff and code inspection across planning artifacts, Convex backend, and key frontend flow files.
- `pnpm lint` attempted (failed: `eslint` missing).
- `pnpm build` attempted (failed: auth provider error during prerender).

