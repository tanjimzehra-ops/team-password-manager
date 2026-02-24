# Jigsaw 1.6 RSA — Remediation Plan (Post-Sprint Review)

**Date:** 25 February 2026  
**Author:** Claudia (BMAD Orchestrator)  
**Source:** Code Review Report + Manual QA + Owner Feedback  
**Status:** APPROVED FOR PLANNING — Blocking merge to main

---

## Context

The `sprint/full-pipeline` branch completed 32/35 stories across 6 epics. Post-sprint code review by automated agent and manual QA by the owner (Nicolas) identified critical security gaps, UX issues, and missing functionality that must be addressed before the branch can be merged to `main` and deployed to production.

This document serves as the formal BMAD remediation plan, establishing all issues as stories ready for execution.

---

## Issue Classification

### 🔴 P0 — Merge Blockers (Must fix before merge)

| ID | Issue | Source | Impact |
|----|-------|--------|--------|
| REM-001 | **Query-side access control missing** | Code Review | All 6 data query endpoints (elements, kpis, capabilities, matrixCells, factors, externalValues) have ZERO auth checks. Anyone with a systemId can read all data. **Data isolation failure.** |
| REM-002 | **Invitation tokens stored in plaintext** | Code Review | Schema claims SHA-256 hashing but tokens are stored raw. `listByOrg` exposes raw tokens to all org members. |
| REM-003 | **Dev auth bypass in production code** | Code Review | `CONVEX_DEV_BYPASS_AUTH` code path in `permissions.ts` bypasses all auth if env var is set. Must be isolated from production builds. |

### 🟡 P1 — Must fix before client demo

| ID | Issue | Source | Impact |
|----|-------|--------|--------|
| REM-004 | **"Add System" button is permanently disabled** | Owner QA | Button is hardcoded `disabled` with "Coming soon" tooltip. Users cannot create new systems from the UI. |
| REM-005 | **App opens with system pre-selected** | Owner QA | Should open to an empty state / system picker when no system is explicitly selected. First-time users see someone else's data. |
| REM-006 | **"Connected to Convex" indicator visible in dev** | Owner QA | Owner wants it hidden always, not just in production. Current: `NODE_ENV === "development"` check shows it in dev. |
| REM-007 | **Legacy systems show "Unknown" org name** | Owner QA | Systems without `orgId` (created before the sprint) display "Unknown" instead of the org name. Data migration needed. |
| REM-008 | **Add node "+" button functionality** | Owner QA | Needs verification that "+" adds new cells in Value Chain, Resources, etc. in Edit mode. Button exists in code but UX unclear. |
| REM-009 | **Order mode functionality** | Owner QA | Needs verification that nodes can be manually reordered via arrow buttons in Order mode. |

### 🟠 P2 — Should fix before production

| ID | Issue | Source | Impact |
|----|-------|--------|--------|
| REM-010 | **Audit log loses resource specificity** | Code Review | `withWriteAccess()` logs `systemId` as resourceId instead of the actual element/KPI ID. Audit trail loses granularity. |
| REM-011 | **Full table scans in permission queries** | Code Review | `getAccessibleOrgIds()` and `systems.list` use `.collect()` on entire tables. Fine for <1000 orgs, will degrade at scale. |
| REM-012 | **React hooks rules violation in bypass** | Code Review | `useAuthBypass` and `useConvexAuthBypass` conditionally call hooks based on env var. Works because env is static at build time, but violates React rules. |
| REM-013 | **Invitation token generation uses Math.random()** | Code Review | Not cryptographically secure. Should use crypto.getRandomValues() equivalent. |
| REM-014 | **Channel Partner UI incomplete** | Sprint Eval | Backend permissions exist but no dedicated CP portal for creating orgs or managing their channel. |
| REM-015 | **Email notifications for invitations** | Sprint Eval | Invitation system works but requires manual token sharing. No SMTP integration. |
| REM-016 | **elements.reorder unauthenticated db.get** | Code Review | `reorder` mutation fetches first element before `withWriteAccess` to get systemId. Minor but not ideal. |

### 🔵 P3 — Nice to have / Future

| ID | Issue | Source | Impact |
|----|-------|--------|--------|
| REM-017 | **Rate limiting on invitation endpoints** | Code Review | No rate limiting on create/accept. Low risk at current scale. |
| REM-018 | **Channel slug uniqueness** | Code Review | No unique index on channel slugs. Could cause conflicts. |
| REM-019 | **Cross-browser testing** | Sprint Eval | No explicit testing on Safari, Firefox, Edge. |
| REM-020 | **Mobile responsive testing** | Sprint Eval | No explicit testing on tablet/mobile viewports. |

---

## Remediation Stories (BMAD Format)

### REM-001: Implement Query-Side Access Control (`withReadAccess`)

**Priority:** 🔴 P0 — MERGE BLOCKER  
**Epic:** Core Stability  
**Estimated Effort:** Medium (2-3 hours)

**Description:**  
Create a `withReadAccess()` wrapper analogous to `withWriteAccess()` that verifies authentication and system access on every data query. Apply to all 6 data table query endpoints.

**Acceptance Criteria:**
1. New `withReadAccess(ctx, systemId)` function in `convex/lib/mutations.ts` (or a new `convex/lib/queries.ts`)
2. Calls `requireAuth()` + `canAccessSystem()` before returning data
3. Applied to ALL query endpoints:
   - `elements.bySystem`, `elements.bySystemAndType`
   - `kpis.bySystem`, `kpis.byParent`
   - `capabilities.bySystem`, `capabilities.bySystemAndType`
   - `matrixCells.bySystemAndType`
   - `factors.bySystem`
   - `externalValues.bySystem`
4. Unauthenticated requests return empty results or throw
5. Requests for systems outside the user's org/channel scope are blocked

**Technical Notes:**
- `kpis.byParent` needs special handling — it takes a `parentId` not a `systemId`. May need to resolve the parent's system first.
- Consider a `withReadAccess` that takes `systemId` directly (queries already receive it as an arg).
- Must work with the dev bypass (`CONVEX_DEV_BYPASS_AUTH`).

---

### REM-002: Hash Invitation Tokens + Restrict Exposure

**Priority:** 🔴 P0 — MERGE BLOCKER  
**Epic:** Auth & Security  
**Estimated Effort:** Small (1 hour)

**Description:**  
Hash invitation tokens before storage using a pure-JS SHA-256 implementation. Remove raw tokens from the `listByOrg` response.

**Acceptance Criteria:**
1. Tokens are hashed (SHA-256) before storing in Convex
2. `getByToken` hashes the incoming token before querying
3. `listByOrg` does NOT include the `token` field in results
4. A new `getInviteUrl(token)` helper generates the invite URL at creation time (returned only once)
5. Existing plaintext tokens in DB are migrated (or invalidated)

**Technical Notes:**
- Convex doesn't have Node.js `crypto`. Use a pure-JS SHA-256 lib (e.g., `js-sha256`) or the Web Crypto API if available in Convex runtime.
- Alternative: Use a longer random token (64+ chars) and accept plaintext storage as MVP-acceptable if hashing is impractical in Convex. Document the decision.

---

### REM-003: Isolate Dev Auth Bypass from Production

**Priority:** 🔴 P0 — MERGE BLOCKER  
**Epic:** Infrastructure  
**Estimated Effort:** Small (30 min)

**Description:**  
Ensure the dev auth bypass code cannot accidentally run in production.

**Acceptance Criteria:**
1. The `CONVEX_DEV_BYPASS_AUTH` code path in `permissions.ts` is removed from the production branch OR gated behind a compile-time check
2. Frontend bypass hooks (`use-auth-bypass.ts`, `use-convex-auth-bypass.ts`) are excluded from production builds or clearly gated
3. The Convex production deployment does NOT have `CONVEX_DEV_BYPASS_AUTH` set
4. Document the bypass mechanism in a `DEV_BYPASS.md` for future reference

**Technical Notes:**
- Option A: Remove bypass code before merge, re-add on feature branches only
- Option B: Keep bypass code but add a `CONVEX_ENVIRONMENT` check (Convex distinguishes dev/prod deployments)
- Option C: Use Convex's `isDevEnv()` helper if available

---

### REM-004: Enable "Add System" Button

**Priority:** 🟡 P1  
**Epic:** System Management  
**Estimated Effort:** Medium (1-2 hours)

**Description:**  
The "Add System" button in the nav sidebar is hardcoded as disabled. Enable it for Super Admins and Channel Partners with a creation dialog.

**Acceptance Criteria:**
1. "Add System" button is enabled for users with `super_admin` or `channel_partner` role
2. Clicking opens a modal/dialog with: System Name (required), Sector (optional), Organisation (dropdown of user's accessible orgs)
3. Creates system via `systems.create` mutation (which already requires `orgId`)
4. New system appears in sidebar immediately (Convex real-time)
5. Button remains disabled/hidden for `admin` and `viewer` roles

---

### REM-005: Empty State on App Load

**Priority:** 🟡 P1  
**Epic:** UX Polish  
**Estimated Effort:** Small (1 hour)

**Description:**  
App should not auto-select a system on load. Show an empty state / welcome screen prompting the user to select or create a system.

**Acceptance Criteria:**
1. On initial load, no system is selected (`selectedSystemId` defaults to `null`)
2. Main area shows a welcome/empty state: "Select a system from the sidebar to begin"
3. If user has no systems, show: "Create your first system" with a CTA button
4. System selection persists in URL or localStorage for return visits

---

### REM-006: Hide Convex Indicator Always

**Priority:** 🟡 P1  
**Epic:** UX Polish  
**Estimated Effort:** Tiny (5 min)

**Description:**  
Remove the "Connected to Convex (real-time)" indicator in all environments, not just production.

**Acceptance Criteria:**
1. Green Convex indicator bar is not visible in any environment
2. No regression in Convex real-time functionality

---

### REM-007: Migrate Legacy Systems to orgId

**Priority:** 🟡 P1  
**Epic:** Data Integrity  
**Estimated Effort:** Small (30 min)

**Description:**  
Systems created before the sprint don't have `orgId`, showing "Unknown" in the UI. Create a migration script to assign them to the correct organisations.

**Acceptance Criteria:**
1. All existing systems in Convex have a valid `orgId`
2. "Unknown" no longer appears in the UI
3. Migration is idempotent (safe to run multiple times)

---

### REM-008: Verify Add Node "+" Functionality

**Priority:** 🟡 P1  
**Epic:** Core Stability  
**Estimated Effort:** Verification only (15 min)

**Description:**  
Verify that the "+" button in Edit mode correctly adds new nodes to each row (Strategic Objectives, Value Chain Elements, Resources).

**Acceptance Criteria:**
1. In Edit mode, "+" button is visible at the end of each row
2. Clicking "+" creates a new empty node in the correct category
3. New node opens in edit popup immediately
4. Node persists after page refresh

---

### REM-009: Verify Order Mode Functionality

**Priority:** 🟡 P1  
**Epic:** Core Stability  
**Estimated Effort:** Verification only (15 min)

**Description:**  
Verify that Order mode allows reordering nodes via arrow buttons.

**Acceptance Criteria:**
1. In Order mode, up/down arrow buttons appear on each node
2. Clicking arrows moves the node in the correct direction
3. New order persists after page refresh
4. Arrow buttons are hidden in all other modes

---

## Execution Plan

### Phase 1: P0 Blockers (Before Merge)
1. **REM-001** — `withReadAccess` for all queries
2. **REM-002** — Token hashing (or documented plaintext decision)
3. **REM-003** — Isolate dev bypass

**Gate:** All P0 items PASS → merge to main approved

### Phase 2: P1 Client-Ready (Before Demo)
4. **REM-004** — Enable Add System
5. **REM-005** — Empty state on load
6. **REM-006** — Hide Convex indicator
7. **REM-007** — Legacy data migration
8. **REM-008** — Verify add node
9. **REM-009** — Verify order mode

**Gate:** All P1 items PASS → client demo approved

### Phase 3: P2 Production Hardening
10. REM-010 through REM-016

### Phase 4: P3 Future
11. REM-017 through REM-020

---

## Relationship to Original BMAD Pipeline

This remediation plan is an **addendum** to the original sprint. The 32 stories executed in the sprint established the architectural foundation (shared mutation layer, RBAC, schema evolution). This plan addresses the gaps discovered during post-sprint review.

The P0 items are **regression blockers** — they represent security assumptions that the original stories didn't fully implement. The P1 items are **UX refinements** identified during the first real user QA session.

---

*Generated by Claudia (BMAD Orchestrator) — 25 Feb 2026*
