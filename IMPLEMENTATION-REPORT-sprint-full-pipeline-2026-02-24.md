# Implementation Report — `sprint/full-pipeline` Remediation

**Date:** 2026-02-24  
**Prepared by:** Codex  
**Repository:** `/Users/nicolaspt/Jigsaw-1.6-RSA`  
**Reference audit:** `AUDIT-REPORT-sprint-full-pipeline-2026-02-24.md`

---

## 1) Executive Summary

The planned remediation was implemented across backend authorization, invitation security, migration safeguards, role-based UI behavior, and quality gates.

Current outcome:
- All targeted **P0 security fixes** are implemented.
- Targeted **P1 behavior/story alignment** items are implemented (Add System SA/CP gating, auto-select on create, super-admin org-switch persistence, viewer guard rails).
- **P2 QA gates** are implemented (lint/test/build runnable and passing).
- **P2 performance cleanup** (query cost optimization of `collect()` scans) was **not** implemented in this pass.

Validation status in this environment:
- `pnpm lint`: pass
- `pnpm test`: pass (4 files, 11 tests)
- `pnpm build`: pass

---

## 2) Audit Finding Closure Matrix

| Audit ID | Severity | Status | Implementation |
|---|---|---|---|
| AUD-001 | Critical | Fixed | Added read access checks for `portfolios.byElement` / `portfolios.bySystem` in `convex/portfolios.ts` (lines 7, 20) using `withReadAccess`. |
| AUD-002 | Critical | Fixed | Added caller-scoped auth checks in `users.get*` and `memberships.byUser/getByUserOrg` (`convex/users.ts` lines 32, 48, 71; `convex/memberships.ts` lines 17, 50). |
| AUD-003 | Critical | Fixed | Secured migration with `requireAuth + isSuperAdmin + confirm token + dryRun + audit log` in `convex/migrations.ts` (line 28). |
| AUD-004 | High | Fixed | Enforced invite acceptance identity binding via normalized exact email match in `convex/invitations.ts` (line 187). |
| AUD-005 | High | Fixed | Removed permissive null-org access for non-super-admins in `canAccessSystem` and `requireWriteAccess` (`convex/lib/permissions.ts` lines 203, 237). |
| AUD-006 | High | Fixed | Unified dev bypass predicate to `env && NODE_ENV==="development"` across layout/provider/hooks (`lib/dev-bypass.ts`, `app/layout.tsx:61`, `components/providers/convex-provider.tsx`, bypass hooks). |
| AUD-007 | Medium | Fixed | Prevented super-admin “All clients” selection override by adding explicit org selection initialization logic in `app/page.tsx` (line 110 onward). |
| AUD-008 | Medium | Fixed (story-canonical) | Add System gated to SA/CP, backend create policy aligned to SA/CP scope, and auto-select on create (`nav-sidebar.tsx`, `add-system-dialog.tsx`, `app/page.tsx`, `convex/systems.ts`). |
| AUD-009 | Medium | Fixed | Viewer restrictions fully wired by passing effective role to `ViewControls` and adding handler-level mutation guard rails in `app/page.tsx`. |
| AUD-010 | Medium | Fixed | Replaced weak token generation with cryptographically secure randomness (`convex/lib/crypto.ts` line 129; used by invitations). |

---

## 3) Detailed Changes

### 3.1 Backend security and tenancy

1. Hardened query surfaces:
- `convex/portfolios.ts`:
  - `byElement` now resolves element and enforces read permission by system.
  - `bySystem` now enforces read permission before collection.
- `convex/users.ts`:
  - `getByWorkosId`: self-or-super-admin only.
  - `getByEmail`: self-or-super-admin only with normalized comparison.
  - `get`: self-or-super-admin only.
- `convex/memberships.ts`:
  - `byUser`: self-or-super-admin only (returns `[]` otherwise).
  - `getByUserOrg`: self-or-super-admin only (returns `null` otherwise).

2. Null-org isolation tightened:
- `convex/lib/permissions.ts`:
  - `canAccessSystem`: null-org systems are no longer readable by ordinary authenticated users.
  - `requireWriteAccess`: null-org writes require super-admin.
- `convex/systems.ts`:
  - Non-super-admin `list` now filters to systems with valid `orgId` in accessible orgs.
  - `get` and `getFullSystem` always route through `canAccessSystem`.

3. Migration endpoint secured:
- `convex/migrations.ts` `assignLegacyOrgIds` now requires:
  - authenticated super-admin caller,
  - explicit confirm token: `"ASSIGN_LEGACY_ORGS"`,
  - optional `dryRun`,
  - audit logging with summary metrics.

4. Invitation security hardening:
- `convex/invitations.ts`:
  - invitation emails normalized on create,
  - accept flow enforces exact normalized email match with authenticated user.
- `convex/lib/crypto.ts`:
  - added `randomToken()` using `crypto.getRandomValues`.
- `convex/lib/email.ts`:
  - added shared normalization/matching helpers.

5. Channel partner accessibility alignment:
- `convex/organisations.ts` `list` now uses `getAccessibleOrgIds` so channel-partner scoped org visibility is consistent with systems access.
- `convex/systems.ts` `create` policy:
  - super-admin can create anywhere,
  - channel partner can create only where directly partnered or via accessible channel scope.

### 3.2 Frontend role/UX behavior

1. Add System behavior (Story 8.4 alignment):
- `components/layout/nav-sidebar.tsx`:
  - `canAddSystem` prop gates visibility of Add System button.
  - `onSystemCreated` callback plumbed.
- `components/add-system-dialog.tsx`:
  - returns created system ID via callback.
- `app/page.tsx`:
  - uses `onSystemCreated={handleSystemSelect}` to auto-select newly created system.

2. Org switch behavior (super-admin “All clients”):
- `app/page.tsx`:
  - added explicit `hasInitializedOrgSelection` guard.
  - non-super-admins auto-select first org once.
  - super-admins preserve explicit `null` (“All clients”) selection.

3. Viewer restriction wiring (Story 1.6 completion):
- `lib/rbac.ts` introduced for centralized role/mode policy:
  - `canCreateSystemForRole`,
  - `canMutateForRole`,
  - `getAvailableModesForRole`.
- `components/view-controls.tsx` now derives available modes from shared policy.
- `app/page.tsx`:
  - computes effective role from `api.users.me` + org context,
  - passes role into `ViewControls`,
  - blocks disallowed mode switches,
  - blocks edit/reorder/delete and portfolio mutations for viewer role.

4. Dev bypass consistency:
- `lib/dev-bypass.ts` introduced.
- Unified usage in:
  - `app/layout.tsx`,
  - `components/providers/convex-provider.tsx`,
  - `hooks/use-auth-bypass.ts`,
  - `hooks/use-convex-auth-bypass.ts`.

---

## 4) QA and Tooling Enhancements

### Added test/lint infrastructure

1. Lint:
- Added `eslint` + flat config:
  - `eslint.config.mjs`
- `pnpm lint` now executes successfully.

2. Unit tests (Vitest):
- Added `vitest` and config:
  - `vitest.config.ts`
- Added tests:
  - `convex/lib/email.test.ts` (normalization + identity match behavior),
  - `convex/lib/crypto.test.ts` (token format + uniqueness smoke),
  - `lib/rbac.test.ts` (role-based mode and create-system gating),
  - `lib/dev-bypass.test.ts` (dev bypass predicate gating).

3. Scripts:
- `package.json` now includes:
  - `test`,
  - `test:watch`.

---

## 5) Validation Results

Executed in this workspace:

1. `pnpm lint`
- Result: **PASS**

2. `pnpm test`
- Result: **PASS**
- Summary: 4 test files, 11 tests passed.

3. `pnpm build`
- Result: **PASS**
- Notes:
  - Non-blocking warning about `baseline-browser-mapping` data age.
  - Non-blocking transitive warning regarding `rimraf` external package resolution from dependency tree.

---

## 6) Remaining / Follow-up Debugging Work

These are the main items still worth debugging/hardening:

1. Integration-level tenant tests
- Current tests are focused unit tests.
- Add Convex integration tests for cross-tenant denial on critical endpoints (`portfolios`, `users.get*`, `memberships.*`, `systems.getFullSystem`).

2. Migration operational playbook
- Add explicit runbook command examples for:
  - dry run,
  - confirm run,
  - expected audit log verification.

3. ESLint rule depth
- Current lint configuration is intentionally minimal to restore a passing gate quickly.
- Add stricter rules (including react hooks plugin and TypeScript strictness) once debugging bandwidth is available.

4. Performance optimization (deferred P2)
- Review and optimize permission helper paths that still rely on broad `collect()` patterns for large datasets.

---

## 7) Files Added

- `IMPLEMENTATION-REPORT-sprint-full-pipeline-2026-02-24.md` (this report)
- `convex/lib/email.ts`
- `convex/lib/email.test.ts`
- `convex/lib/crypto.test.ts`
- `lib/rbac.ts`
- `lib/rbac.test.ts`
- `lib/dev-bypass.ts`
- `lib/dev-bypass.test.ts`
- `eslint.config.mjs`
- `vitest.config.ts`

---

## 8) Files Modified (high-impact)

- `convex/portfolios.ts`
- `convex/users.ts`
- `convex/memberships.ts`
- `convex/lib/permissions.ts`
- `convex/migrations.ts`
- `convex/invitations.ts`
- `convex/lib/crypto.ts`
- `convex/organisations.ts`
- `convex/systems.ts`
- `app/page.tsx`
- `components/layout/nav-sidebar.tsx`
- `components/add-system-dialog.tsx`
- `components/view-controls.tsx`
- `components/providers/convex-provider.tsx`
- `app/layout.tsx`
- `hooks/use-auth-bypass.ts`
- `hooks/use-convex-auth-bypass.ts`
- `package.json`
- `pnpm-lock.yaml`

---

## 9) Notes

- Existing pre-change workspace files (`next-env.d.ts`, audit markdown file) were left in place.
- This report reflects the state validated on **2026-02-24** in this local environment.

