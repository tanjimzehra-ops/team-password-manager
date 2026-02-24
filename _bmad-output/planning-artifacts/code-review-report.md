# Code Review Report — Jigsaw 1.6 RSA Sprint

**Reviewer:** Claude (automated)  
**Date:** 2026-02-24  
**Branch:** `sprint/full-pipeline` vs `main`  
**Commits reviewed:** 19

## Summary
- **Files changed:** 45 (+2,555 / -465 lines)
- **Real code changes:** 12 stories
- **Documentation/verification only:** 6 stories (2.1, 2.2, 2.4, 5.1–5.4, 6.1–6.3)
- **🔴 Critical issues:** 3
- **⚠️ Warnings:** 5

---

## 🔴 Data Isolation Assessment (CRITICAL)

### Verdict: PARTIALLY IMPLEMENTED — Major Gaps Remain

**What works:**
- `systems.list` correctly filters by `orgId` via `getAccessibleOrgIds()` — users only see their org's systems
- `systems.create` now **requires** `orgId` (no more optional) — ✅ good
- `getFullSystem` checks `canAccessSystem()` before returning data — ✅ good
- All **mutations** go through `withWriteAccess()` which calls `requireWriteAccess()` → `canAccessSystem()` — ✅ good

**🔴 CRITICAL GAP: All data queries are UNPROTECTED**

The following query endpoints have **zero auth checks** — anyone with a valid `systemId` can read all data:

| File | Endpoint | Auth Check |
|------|----------|-----------|
| `convex/elements.ts` | `bySystem`, `bySystemAndType` | ❌ NONE |
| `convex/kpis.ts` | `bySystem`, `byParent` | ❌ NONE |
| `convex/capabilities.ts` | `bySystem`, `bySystemAndType` | ❌ NONE |
| `convex/matrixCells.ts` | `bySystemAndType` | ❌ NONE |
| `convex/factors.ts` | `bySystem` | ❌ NONE |
| `convex/externalValues.ts` | `bySystem` | ❌ NONE |

**Impact:** If Client A knows (or guesses) a `systemId` belonging to Client B, they can read ALL elements, KPIs, capabilities, matrix cells, factors, and external values. This is a **data isolation failure**.

**The app _appears_ isolated** because `systems.list` only shows your systems (so the UI never shows foreign systemIds). But the backend does NOT enforce this — it's security-by-obscurity via the frontend.

**Fix required:** Add `requireAuth()` + `canAccessSystem()` checks to every `bySystem` / `bySystemAndType` query, or create a shared `withReadAccess()` wrapper analogous to `withWriteAccess()`.

---

## Story-by-Story Review

### Story 1.1 — Shared Mutation Layer
- **Files:** `convex/lib/mutations.ts` (new, 97 lines)
- **Status:** ✅ PASS
- **Evidence:** Clean `withWriteAccess<T>()` generic that chains: `requireAuth()` → `requireWriteAccess()` → execute callback → `logAudit()`. Error path also audits with `_FAILED` suffix.
- **Quality:** Well-documented, good TypeScript generics, proper error re-throwing.
- **Minor:** Audit log always uses `systemId` as `resourceId` — loses the actual resource ID (e.g., the element or KPI that was created). The old code logged the specific resource ID.

### Story 1.2 — Refactor elements.ts
- **Files:** `convex/elements.ts`
- **Status:** ✅ PASS
- **Evidence:** All 5 mutations (`create`, `update`, `reorder`, `remove`, `bySystem`) refactored to use `withWriteAccess()`. Boilerplate audit logging removed. Logic preserved.
- **Issue:** ⚠️ `reorder` fetches first element for systemId lookup *before* `withWriteAccess` — the `db.get` call is unauthenticated but only reads the element to get its systemId. Acceptable but not ideal.

### Story 1.3 — Refactor matrixCells.ts
- **Files:** `convex/matrixCells.ts`
- **Status:** ✅ PASS
- **Evidence:** Same pattern applied. Clean refactor.

### Story 1.4 — Refactor kpis, capabilities, externalValues, factors
- **Files:** `convex/kpis.ts`, `convex/capabilities.ts`, `convex/externalValues.ts`, `convex/factors.ts`
- **Status:** ✅ PASS
- **Evidence:** All mutations wrapped with `withWriteAccess()`. Consistent pattern.

### Story 1.6 — Mode-Specific Visibility
- **Files:** `components/logic-grid.tsx`, `components/node-card.tsx`
- **Status:** ✅ PASS
- **Evidence:** KPI inputs now gated by `editMode === "edit"` (not just `isEditActive`). Add-node buttons similarly restricted. Previously `isEditActive` was true for edit/colour/order/delete modes — now only "edit" shows inputs.
- **Good catch:** This prevents accidental KPI value changes while in colour or reorder mode.

### Story 1.7 — orgId Requirement on System Create
- **Files:** `convex/systems.ts`
- **Status:** ✅ PASS
- **Evidence:** `orgId` changed from `v.optional(v.id("organisations"))` to `v.id("organisations")`. Role check always runs. `systems.list` now includes `orgName` via join.
- **⚠️ Warning:** `systems.list` does `ctx.db.query("organisations").collect()` — scans ALL orgs into memory to build a map. Fine for <1000 orgs, will need indexing later.

### Story 1.8 — Stage/Performance Consolidation
- **Files:** `app/page.tsx`, `components/view-controls.tsx`, `components/node-card.tsx`, `components/logic-grid.tsx`
- **Status:** ✅ PASS
- **Evidence:** `displayMode` prop removed everywhere. Stage/Performance dropdown removed from `ViewControls`. KPI badge now always uses health-based coloring when `showKpi` is true (the "Show Key Results" toggle). `PerformanceModal` removed from page. Clean removal — no dead code left.

### Story 2.3–2.5 — Auth Loading State
- **Files:** `app/page.tsx`, `hooks/use-auth-bypass.ts`, `hooks/use-convex-auth-bypass.ts`, `hooks/use-ensure-user.ts`, `components/providers/convex-provider.tsx`
- **Status:** ⚠️ PARTIAL
- **Evidence:** Auth loading spinner added before hooks. Dev bypass hooks added for local testing without WorkOS.
- **⚠️ Warning:** `useAuthBypass` conditionally calls `useWorkOSAuth()` based on an env var — this violates React's rules of hooks (hooks must not be called conditionally). Works in practice because the env var is static at build time, but linters will flag it. Same issue in `useConvexAuthBypass`.
- **⚠️ Warning:** The dev bypass in `convex/lib/permissions.ts` (`CONVEX_DEV_BYPASS_AUTH`) scans ALL memberships and ALL users with `.collect()` on every single query/mutation. Very expensive. Should at minimum be cached or use an index.

### Story 3.1–3.2 — Schema: Channels + Invitations
- **Files:** `convex/schema.ts`
- **Status:** ✅ PASS
- **Evidence:** `channels` table with `name`, `slug`, `contactEmail`, `status`, soft delete. `invitations` table with `email`, `orgId`, `role`, `token`, `status`, `invitedBy`, `expiresAt`. `organisations` gains `channelId`. `channel_partner` added to role validator.
- **Indexes:** Appropriate — `by_slug`, `by_status`, `by_token`, `by_email`, `by_org`, `by_channel`.

### Story 3.3 — Permission Engine: Channel Partner Scoping
- **Files:** `convex/lib/permissions.ts`
- **Status:** ✅ PASS (logic correct, performance concern)
- **Evidence:** `isChannelPartner()`, `getPartnerChannelIds()` added. `canAccessSystem()` now checks channel partner access. `getAccessibleOrgIds()` expanded to include all orgs in partner's channels.
- **⚠️ Warning:** `getAccessibleOrgIds` with channel partners does `ctx.db.query("organisations").collect()` — full table scan. Same concern as systems.list.

### Story 3.4 — Channel Management Admin Page
- **Files:** `convex/channels.ts` (new, 152 lines), `app/admin/channels/page.tsx` (new, 306 lines)
- **Status:** ✅ PASS
- **Evidence:** Full CRUD for channels. All mutations gated by `requireAuth()` + `isSuperAdmin()`. Soft delete. Audit logging. Frontend is a standard admin CRUD page.
- **Note:** Channels CRUD does NOT use `withWriteAccess()` — it uses direct `isSuperAdmin()` checks. This is acceptable since channels aren't scoped to a system.

### Story 3.5 — Invitation CRUD
- **Files:** `convex/invitations.ts` (new, 317 lines)
- **Status:** ⚠️ PARTIAL — security issues
- **Evidence:** Create, revoke, accept, getByToken. Auth gated properly — create/revoke require admin role in org. Accept requires authenticated user.
- **🔴 CRITICAL:** Schema comment says `token: v.string() // SHA-256 hashed token` but `generateToken()` generates plaintext and stores it directly — **tokens are NOT hashed**. If the DB is compromised, all invitation tokens are exposed.
- **🔴 CRITICAL:** `listByOrg` response **includes the raw token** (line 72: `token: inv.token`). Any org member can see all pending invitation tokens, meaning a viewer could share/use invitation links intended for specific people.
- **⚠️ Warning:** `generateToken()` uses `Math.random()` which is NOT cryptographically secure. The comment acknowledges Convex doesn't have Node crypto, but this is weak for security tokens.

### Story 3.6 — Invitation Accept Page
- **Files:** `app/invite/[token]/page.tsx` (new, 286 lines)
- **Status:** ✅ PASS
- **Evidence:** Token validation, expiry checking, accept flow with Convex mutation.

### Story 3.7 — Systems Dropdown Fix
- **Files:** `hooks/convex/use-convex-systems.ts`
- **Status:** ✅ PASS
- **Evidence:** Now shows `orgName` in dropdown. Uses auth bypass hook.

### Story 4.1–4.3 — Save Feedback, Placeholder Text, Empty Node Styling
- **Files:** `components/node-card.tsx`
- **Status:** ✅ PASS
- **Evidence:** Empty nodes (`!node.title`) get `opacity-60 border-dashed` styling and italic "Empty — click to edit" text. New `handleAddNode` in `page.tsx` creates empty elements directly (no library popup).

### Story 4.4–4.5 — Favicon + Hide Convex Indicator
- **Files:** `app/icon.svg` (new), `app/layout.tsx`, `app/page.tsx`
- **Status:** ✅ PASS
- **Evidence:** Convex indicator now wrapped in `process.env.NODE_ENV === "development"` check. New SVG favicon added.

### Stories 2.1, 2.2, 2.4 — Documentation Only
- **Status:** 📝 DOCS ONLY — verified as already implemented, no code changes

### Stories 5.1–5.4 — Export Suite
- **Status:** 📝 DOCS ONLY — verified as already implemented

### Stories 6.1–6.3 — Infrastructure
- **Status:** 📝 DOCS ONLY — verified as operational

---

## Security Findings

### 🔴 Critical

1. **Data queries have no access control** — All `bySystem`/`bySystemAndType` queries across 6 files return data without checking if the user is authenticated or has access to that system. Data isolation relies entirely on the frontend not exposing foreign systemIds. **This MUST be fixed before production with real client data.**

2. **Invitation tokens stored in plaintext** — Schema claims SHA-256 hashing but implementation stores raw tokens. Tokens also exposed to all org members via `listByOrg`.

3. **Dev auth bypass in production-deployed code** — `convex/lib/permissions.ts` contains a `CONVEX_DEV_BYPASS_AUTH` code path that returns the first super_admin without auth. While gated by env var, this code path should not exist in production builds. If the env var is accidentally set in production, ALL auth is bypassed.

### ⚠️ Warnings

4. **Full table scans** — `getAccessibleOrgIds()` and `systems.list` do `.collect()` on entire tables. Works at small scale, will degrade.

5. **React hooks rules violation** — Conditional hook calls in auth bypass wrappers.

6. **Audit log resource IDs** — `withWriteAccess()` logs `systemId` as the resourceId instead of the actual created/modified resource. Audit trail loses specificity.

---

## Recommendations

### Must Fix Before Merge

1. **Add auth + access checks to ALL data queries.** Create a `withReadAccess()` wrapper or add `requireAuth()` + `canAccessSystem()` to every `bySystem` query. This is the single most important fix.

2. **Hash invitation tokens** before storage (use Convex's built-in hashing or a pure-JS SHA-256). Remove raw tokens from `listByOrg` response.

3. **Remove or isolate dev auth bypass** — Move to a separate file that's excluded from production builds, or use Convex's built-in dev auth tooling.

### Should Fix

4. **Fix audit log resourceId** — Pass the actual created resource ID back to `withWriteAccess` for logging (could use a callback pattern or return value).

5. **Add index-based lookups** instead of `.collect()` for org/channel queries.

6. **Use `crypto.getRandomValues()` equivalent** for invitation tokens if possible in Convex runtime.

### Nice to Have

7. Add rate limiting on invitation creation and accept endpoints.
8. Add invitation email validation (format check).
9. Consider slug uniqueness enforcement on channels (currently no unique index).
