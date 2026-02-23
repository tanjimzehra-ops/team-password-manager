# Architecture Validation Report — Jigsaw 1.6 RSA

**Validation Date:** 2026-02-23  
**Validator:** BMAD Validation Architect  
**Documents Reviewed:**
- `/Users/nicolaspt/Jigsaw-1.6-RSA/_bmad-output/planning-artifacts/architecture.md`
- `/Users/nicolaspt/Jigsaw-1.6-RSA/_bmad-output/planning-artifacts/prd.md`
- `/Users/nicolaspt/Jigsaw-1.6-RSA/_bmad-output/project-context.md`

---

## Executive Summary

The architecture document provides a comprehensive blueprint for Jigsaw 1.6 RSA's evolution from a three-tier to a four-tier role model, introduces channel partner support, and establishes critical patterns for shared mutation layers and export capabilities. Overall, the architecture is sound, internally consistent, and feasible within the stated constraints.

**Aggregate Rating:** 4.0/5.0  
**Final Gate Decision:** **PASS WITH WARNINGS**

---

## Dimensional Scoring

### 1. Completeness — Score: 4/5

**Strengths:**
- All 42 FRs (FR-001 through FR-042) have an architectural home mapped in Section 11
- Phase 1 and Phase 2 requirements (MVP + Growth) are comprehensively addressed
- Schema evolution from 12 to 14 tables is well-documented with additive-only changes
- Four-tier permission model is fully specified with clear access control matrix

**Gaps:**
- FR-040 (Undo), FR-041 (KPI in nodes), and FR-042 (Mode consolidation) are Phase 3/deferred items with minimal architectural detail—only placeholder mappings provided
- No explicit architecture for "undo" state history (FR-040)—requires additional design
- Email service integration (FEAT-016/Phase 2) mentioned as "Phase 1: No email service" but architectural support for future Resend/SendGrid integration not detailed

**Evidence:**
| FR | Status | Location |
|----|--------|----------|
| FR-001 to FR-039 | ✅ Covered | Architecture Section 11 (FR → Architecture Mapping) |
| FR-040 | ⚠️ Minimal | Listed as "Deferred — requires state history design" |
| FR-041 | ⚠️ Minimal | Listed as "Deferred — node component enhancement" |
| FR-042 | ⚠️ Minimal | Listed as "Mode controller refactor" without detail |

---

### 2. Consistency — Score: 4/5

**Strengths:**
- Technology stack constraints from project-context.md are fully respected (Next.js 16, `proxy.ts`, `OrgContext.Provider`, etc.)
- Four-tier role model is consistently applied across security architecture, access control matrix, and permission engine
- Shared mutation layer pattern (`withWriteAccess`) is consistently proposed for all CRUD operations
- Soft delete pattern (`deletedAt`) is applied universally

**Inconsistencies Found:**
- **MEDIUM:** Architecture Section 5.1 shows `logAudit()` calls in shared mutation layer, but Section 5.3's mutation categories table suggests "Direct + audit" for some categories—this creates ambiguity about whether shared layer is mandatory or optional
- **LOW:** Phase 3 features (FR-040 through FR-042) are marked "Deferred" but still appear in FR mapping table with component names—could confuse implementers

**Contradictions with project-context.md:**
- ✅ No contradictions found on critical constraints (middleware.ts, OrgContext, WorkOS auth patterns)
- ✅ Architecture correctly specifies `proxy.ts` (not middleware.ts)
- ✅ Architecture correctly notes `OrgContext.Provider` (not `<OrgContext>`)

---

### 3. Feasibility — Score: 4/5

**Strengths:**
- Technology choices align with existing stack (Convex, WorkOS, Next.js 16)
- Schema changes are additive and backward-compatible—can be deployed incrementally
- Client-side export approach (exceljs, html2canvas) avoids server infrastructure needs
- Migration strategy is phased and reversible

**Feasibility Concerns:**
- **MEDIUM:** Client-side Excel export for large systems (>100 nodes) may hit browser memory limits; no fallback architecture specified (Section 7.1 notes this as a trade-off but doesn't architect a solution)
- **MEDIUM:** Real-time sync across all models requires all mutations to adopt shared layer—this is a large refactoring effort of existing ~818 lines in `use-convex-mutations.ts`
- **LOW:** Channel partner visibility logic requires complex Convex queries with multiple `q.or()` conditions—need to verify Convex query complexity limits

**Resource Constraints:**
- Architecture acknowledges single-developer constraint (+ AI orchestration)
- Scope reduction to Logic Model only (ADR-006) is appropriate given resource limits

---

### 4. Security — Score: 4/5

**Strengths:**
- Four-tier permission model with clear boundaries
- Channel isolation explicitly designed (Channel Partners see only their channel's orgs)
- Permission resolution order is well-defined (Section 4.3)
- All mutations require auth gating
- Audit logging mandated for all mutations

**Security Concerns:**
- **MEDIUM:** Permission engine evolution (Section 4.3) shows `canAccessOrganisation()` function but doesn't specify how channel membership is stored—is it a new table or encoded in `memberships.role`? This ambiguity could lead to inconsistent implementations
- **MEDIUM:** Invitation token generation mentions "cryptographically random (32 bytes, base64url)" but doesn't reference a specific secure random source or token storage validation
- **LOW:** "Legacy systems (no orgId) accessible to all authenticated users during migration"—this is a temporary security relaxation that needs explicit sunset criteria

**Access Control Matrix:** ✅ Complete and internally consistent (Section 4.2)

---

### 5. Scalability — Score: 3/5

**Strengths:**
- Convex's real-time reactivity handles concurrent users well
- Schema indexes properly defined for common queries (by_slug, by_status, by_token, etc.)
- Soft delete pattern allows data recovery without data loss

**Scalability Limitations:**
- **HIGH:** Client-side export (Excel/PDF/Image) will not scale to large systems. ExcelJS in browser has memory constraints; html2canvas performance degrades with DOM complexity. No server-side fallback is architected.
- **MEDIUM:** `getAccessibleOrgIds()` returns all org IDs for a user—if a Channel Partner has 1000+ orgs, this could be a large payload. No pagination or cursor-based approach specified.
- **MEDIUM:** Channel-scoped query in Section 5.2 uses `q.or(...channelIds.map(...))` which could generate very large queries for partners with many channels

**Recommendation:** Architecture should include a note about export size limits or future server-side export service.

---

### 6. Maintainability — Score: 4/5

**Strengths:**
- Shared mutation layer (`withWriteAccess`) provides consistent pattern for all CRUD—prevents ADR-017 cross-model bugs
- ADRs (Section 10) clearly document decisions and rationale
- Component architecture is well-structured with clear file organization
- Schema evolution approach (additive-only) prevents migration headaches

**Maintainability Concerns:**
- **MEDIUM:** Shared mutation layer requires refactoring all existing mutations—this is a large change with regression risk. Architecture doesn't specify how to incrementally migrate existing mutations.
- **MEDIUM:** FR mapping table (Section 11) is dense and may become stale. Consider generating from source or using code comments to link FRs to implementations.
- **LOW:** No explicit testing architecture—project-context.md states "No test framework configured" and architecture doesn't address how to validate the shared mutation layer works correctly across all models.

**AI Agent Guidance:** ✅ Architecture provides clear patterns that agents can follow (Section 5.1 shared layer, Section 6 component patterns)

---

## Specific Findings

### HIGH Priority

| ID | Finding | Impact | Recommendation |
|----|---------|--------|----------------|
| HIGH-001 | Client-side export won't scale to large systems; no server fallback | Performance failures for large clients | Document export size limits; architect server-side export service for Phase 2+ |

### MEDIUM Priority

| ID | Finding | Impact | Recommendation |
|----|---------|--------|----------------|
| MED-001 | Channel partner membership storage not explicitly defined | Inconsistent implementation of channel checks | Specify whether channel membership is stored in `memberships` table with new role or separate `channelPartners` table |
| MED-002 | Shared mutation layer adoption strategy unclear | Risk of partial adoption, leading to continued cross-model bugs | Define incremental migration plan: start with elements.ts, then matrixCells.ts, etc. |
| MED-003 | Invitation token security implementation vague | Potential security weakness in token generation | Specify use of `crypto.randomBytes` or similar; define token validation logic |
| MED-004 | `getAccessibleOrgIds()` lacks pagination | Performance degradation for partners with many orgs | Add pagination support or cursor-based retrieval |

### LOW Priority

| ID | Finding | Impact | Recommendation |
|----|---------|--------|----------------|
| LOW-001 | Phase 3 FRs (040-042) have placeholder architecture | Future rework when these are implemented | Add brief architecture notes even for deferred features |
| LOW-002 | Audit logging shows inconsistent mandatory vs direct | Confusion about when to use shared layer | Clarify that all mutations should use shared layer; remove "Direct + audit" category |
| LOW-003 | Legacy system access during migration is permissive | Temporary security gap | Add explicit migration deadline/criteria for orgId assignment |
| LOW-004 | No testing strategy for shared mutation layer | Regressions in refactored mutations | Consider adding at least integration tests for the shared layer |

---

## Schema Validation

### New Tables

| Table | Purpose | Backward Compatible |
|-------|---------|---------------------|
| `channels` | Channel partner model | ✅ Yes—new table, no existing data |
| `invitations` | Token-based onboarding | ✅ Yes—new table, no existing data |

### Modified Tables

| Table | Change | Backward Compatible |
|-------|--------|---------------------|
| `organisations` | Add optional `channelId` field | ✅ Yes—optional field |
| Role validator | Add `channel_partner` literal | ⚠️ Check—role enum expansion |

**Note:** Role validator change from 3-tier to 4-tier needs verification that existing Convex validators handle enum expansion gracefully. Convex `v.union()` should handle this, but existing data with `"admin" | "viewer"` values will still validate.

---

## Permission Model Validation

### Channel Isolation Enforcement

| Check | Status | Evidence |
|-------|--------|----------|
| Channel Partners see only their channel's orgs | ✅ Defined | Architecture Section 4.3 |
| Org-level isolation for Admins/Viewers | ✅ Defined | Architecture Section 4.2 matrix |
| Super Admin global access | ✅ Defined | Architecture Section 4.3 |
| Enforcement at query level | ✅ Defined | Section 5.2 `getAccessibleOrgIds()` |

### Permission Resolution Order

```
1. Authenticated? → requireAuth()
2. Super Admin? → Global access
3. Channel Partner? → Check channelId match
4. Admin/Viewer in org? → Check memberships
5. Legacy system? → Authenticated only
```

✅ Order is logical and secure

---

## Template Variables Check

| Variable | Status | Location |
|----------|--------|----------|
| `{{project_name}}` | ✅ Filled | "Jigsaw 1.6 RSA" |
| `{{date}}` | ✅ Filled | "2026-02-24" |
| `{{author}}` | ✅ Filled | "Winston (BMAD Architect) + Claudia (Orchestrator)" |
| Technology versions | ✅ Filled | All versions specified (Next.js 16.0.10, etc.) |

**Result:** No unfilled template variables detected.

---

## Final Gate Decision

### PASS WITH WARNINGS

The architecture is **approved for implementation** with the following conditions:

1. **Address MED-001:** Explicitly define how channel partner membership is stored (new table vs. role enum expansion)
2. **Address MED-002:** Create incremental migration plan for shared mutation layer adoption
3. **Address MED-003:** Specify secure token generation and validation logic
4. **Address HIGH-001:** Document export size limits and plan for server-side export fallback

### Risk Summary

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Shared mutation layer not fully adopted | Medium | High (continued cross-model bugs) | Code review checklist requiring shared layer use |
| Client-side export fails for large systems | Medium | Medium (user frustration) | Document limits; implement server-side fallback in Phase 2 |
| Channel isolation implementation gaps | Low | High (data leakage) | Security review of permission engine changes |
| Phase 3 features require architecture rework | Medium | Low (deferred scope) | Add brief architecture notes for FR-040/041/042 |

---

## Conclusion

The Jigsaw 1.6 RSA architecture is a solid foundation for the project's evolution. It correctly identifies the root cause of existing bugs (inconsistent mutation patterns per ADR-017) and proposes appropriate solutions (shared mutation layer). The four-tier role model and channel partner support are well-architected, though implementation details around channel membership storage need clarification.

The primary concern is scalability of client-side exports, which should be addressed with documented limits and a plan for server-side fallback. With the warnings noted above addressed, this architecture will enable AI agents to implement consistently and correctly.

**Recommendation:** Proceed with implementation after addressing MEDIUM priority findings