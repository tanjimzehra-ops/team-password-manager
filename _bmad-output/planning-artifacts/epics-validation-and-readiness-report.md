# Jigsaw 1.6 RSA — Epics Validation & Implementation Readiness Report

**Generated:** 2026-02-24  
**Validator:** BMAD Validation Architect  
**Artifacts Reviewed:**
- PRD: `/Users/nicolaspt/Jigsaw-1.6-RSA/_bmad-output/planning-artifacts/prd.md`
- Architecture: `/Users/nicolaspt/Jigsaw-1.6-RSA/_bmad-output/planning-artifacts/architecture.md`
- Epics: `/Users/nicolaspt/Jigsaw-1.6-RSA/_bmad-output/planning-artifacts/epics.md`

---

## Part 1: Epics Validation Scores

### 1.1 FR Coverage Analysis

| FR | Description | Coverage | Story ID(s) |
|----|-------------|----------|-------------|
| FR-001 | Logged-out landing page | ✅ Covered | 2.1 |
| FR-002 | Sign-out flow | ✅ Covered | 2.2 |
| FR-003 | "Keep me logged in" toggle | ✅ Covered | 2.3 |
| FR-004 | Four-tier role model | ✅ Covered | 3.1 |
| FR-005 | Super Admin channel management | ✅ Covered | 3.4 |
| FR-006 | Channel Partner org creation | ✅ Covered | 3.3, 3.4 |
| FR-007 | Channel-scoped visibility | ✅ Covered | 3.3 |
| FR-008 | Invitation system | ✅ Covered | 3.5 |
| FR-009 | Invitation email/token | ✅ Covered | 3.5, 3.6 |
| FR-010 | User role display | ✅ Covered | 7.3 (Sprint 3+) |
| FR-011 | Impact Purpose CRUD | ✅ Covered | 1.2 |
| FR-012 | Key Result CRUD | ✅ Covered | 1.2 |
| FR-013 | Value Chain CRUD | ✅ Covered | 1.2 |
| FR-014 | Resource CRUD | ✅ Covered | 1.2 |
| FR-015 | Delivery Culture CRUD | ✅ Covered | 1.2 |
| FR-016 | System Context CRUD | ✅ Covered | 1.2 |
| FR-017 | Add-node button | ✅ Covered | 1.5 |
| FR-018 | Delete nodes | ✅ Covered | 1.2, 1.3 |
| FR-019 | No stale data on reopen | ✅ Covered | 1.2 |
| FR-020 | Save confirmation feedback | ✅ Covered | 4.1 |
| FR-021 | Five-mode switching | ✅ Covered | 1.6 |
| FR-022 | Colour mode KPI health | ✅ Covered | 1.6 |
| FR-023 | Order mode arrows | ✅ Covered | 1.6 |
| FR-024 | Mode-specific controls | ✅ Covered | 1.6 |
| FR-025 | Add System modal | ✅ Covered | 3.7 |
| FR-026 | Empty system initialization | ✅ Covered | 1.7 |
| FR-027 | Systems dropdown | ✅ Covered | 3.7 |
| FR-028 | "Unknown" org fix | ✅ Covered | 3.7 |
| FR-029 | Excel export | ✅ Covered | 5.1 |
| FR-030 | PDF export | ✅ Covered | 5.2 |
| FR-031 | Image export | ✅ Covered | 5.3 |
| FR-032 | Placeholder guidance text | ✅ Covered | 4.2 |
| FR-033 | Empty vs filled node colour | ✅ Covered | 4.3 |
| FR-034 | Favicon/branding | ✅ Covered | 4.4 |
| FR-035 | Remove Convex indicator | ✅ Covered | 4.5 |
| FR-036 | Single sign-in button | ✅ Covered | 2.4 |
| FR-037 | BMAD pipeline QA | ✅ Covered | 6.3 |
| FR-038 | Feature branches | ✅ Covered | 6.1 |
| FR-039 | Shared mutation layer | ✅ Covered | 1.1, 1.2, 1.3, 1.4 |
| FR-040 | Undo/go-back (Phase 3) | ✅ Covered | 7.1 (deferred) |
| FR-041 | KPI numbers in nodes (Phase 3) | ✅ Covered | 7.2 (deferred) |
| FR-042 | Mode consolidation | ✅ Covered | 1.8 |

**FR Coverage Score: 42/42 (100%)**

**Completeness Score: 5/5** — All FRs are explicitly mapped to stories.

---

### 1.2 Story Acceptance Criteria Quality

| Story | Acceptance Criteria Format | Given/When/Then | Testable | Score |
|-------|---------------------------|-----------------|----------|-------|
| 1.1 | Structured | ✅ Yes | ✅ Yes | 5/5 |
| 1.2 | Structured | ✅ Yes | ✅ Yes | 5/5 |
| 1.3 | Structured | ✅ Yes | ✅ Yes | 5/5 |
| 1.4 | Structured | ✅ Yes | ✅ Yes | 5/5 |
| 1.5 | Structured | ✅ Yes | ✅ Yes | 5/5 |
| 1.6 | Structured | ✅ Yes | ✅ Yes | 5/5 |
| 1.7 | Structured | ✅ Yes | ✅ Yes | 5/5 |
| 1.8 | Structured | ✅ Yes | ✅ Yes | 5/5 |
| 2.1 | Structured | ✅ Yes | ✅ Yes | 5/5 |
| 2.2 | Structured | ✅ Yes | ✅ Yes | 5/5 |
| 2.3 | Structured | ✅ Yes | ✅ Yes | 5/5 |
| 2.4 | Structured | ✅ Yes | ✅ Yes | 5/5 |
| 2.5 | Structured | ✅ Yes | ✅ Yes | 5/5 |
| 3.1 | Structured | ✅ Yes | ✅ Yes | 5/5 |
| 3.2 | Structured | ✅ Yes | ✅ Yes | 5/5 |
| 3.3 | Structured | ✅ Yes | ✅ Yes | 5/5 |
| 3.4 | Structured | ✅ Yes | ✅ Yes | 5/5 |
| 3.5 | Structured | ✅ Yes | ✅ Yes | 5/5 |
| 3.6 | Structured | ✅ Yes | ✅ Yes | 5/5 |
| 3.7 | Structured | ✅ Yes | ✅ Yes | 5/5 |
| 4.1 | Structured | ✅ Yes | ✅ Yes | 5/5 |
| 4.2 | Structured | ✅ Yes | ✅ Yes | 5/5 |
| 4.3 | Structured | ✅ Yes | ✅ Yes | 5/5 |
| 4.4 | Structured | ✅ Yes | ✅ Yes | 5/5 |
| 4.5 | Structured | ✅ Yes | ✅ Yes | 5/5 |
| 5.1 | Structured | ✅ Yes | ✅ Yes | 5/5 |
| 5.2 | Structured | ✅ Yes | ✅ Yes | 5/5 |
| 5.3 | Structured | ✅ Yes | ✅ Yes | 5/5 |
| 5.4 | Structured | ✅ Yes | ✅ Yes | 5/5 |
| 6.1 | Structured | ✅ Yes | ✅ Yes | 5/5 |
| 6.2 | Structured | ✅ Yes | ✅ Yes | 5/5 |
| 6.3 | Structured | ✅ Yes | ✅ Yes | 5/5 |
| 7.1 | Structured | ✅ Yes | ✅ Deferred | 4/5 |
| 7.2 | Structured | ✅ Yes | ✅ Deferred | 4/5 |
| 7.3 | Structured | ✅ Yes | ✅ Yes | 5/5 |

**Quality Score: 5/5** — All 35 stories use proper Given/When/Then format. Stories 7.1 and 7.2 are intentionally deferred to Phase 3.

---

### 1.3 Epic Dependencies & Standalone Analysis

| Epic | Dependencies | Standalone? | Circular? |
|------|--------------|-------------|-----------|
| Epic 1: Core Stability | None (first) | ✅ Yes | ❌ No |
| Epic 2: Auth & Landing | None | ✅ Yes (parallel to Epic 1) | ❌ No |
| Epic 3: Roles & Invitations | Epic 1 (shared mutations) | ✅ Justified | ❌ No |
| Epic 4: UX Polish | Epic 1 (mutations) | ✅ Justified | ❌ No |
| Epic 5: Export Suite | Epic 1 (data) | ✅ Justified | ❌ No |
| Epic 6: Infrastructure | None | ✅ Yes | ❌ No |
| Epic 7: Future Enhancements | Epics 1-5 | ✅ Justified (deferred) | ❌ No |

**Dependency Graph:**
```
Epic 1 ─┬─> Epic 3 ─┬─> Epic 5
        │            │
Epic 2 ─┘            └─> Epic 4
        
Epic 6 (independent)

Epic 7 (depends on 1-5, deferred)
```

**Analysis:** No circular dependencies. Dependencies are forward-only and well-documented.

---

### 1.4 Story Sizing Assessment

| Story | Estimated Effort | Session-Friendly? | Notes |
|-------|-----------------|-------------------|-------|
| 1.1 | Medium | ✅ Yes | New file, clear scope |
| 1.2 | Large | ⚠️ Borderline | Multiple node types; consider splitting |
| 1.3 | Medium | ✅ Yes | Matrix cells only |
| 1.4 | Medium | ✅ Yes | Four files, same pattern |
| 1.5 | Small | ✅ Yes | Button fix |
| 1.6 | Medium | ✅ Yes | Component + logic |
| 1.7 | Small | ✅ Yes | Data fix |
| 1.8 | Medium | ✅ Yes | Mode consolidation |
| 2.1 | Medium | ✅ Yes | Page component |
| 2.2 | Small | ✅ Yes | Flow fix |
| 2.3 | Small | ✅ Yes | Toggle + config |
| 2.4 | Small | ✅ Yes | UI cleanup |
| 2.5 | Small | ✅ Yes | Race condition fix |
| 3.1 | Small | ✅ Yes | Schema change |
| 3.2 | Small | ✅ Yes | New table |
| 3.3 | Medium | ✅ Yes | Permission engine |
| 3.4 | Medium | ✅ Yes | Admin page |
| 3.5 | Medium | ✅ Yes | CRUD + tokens |
| 3.6 | Medium | ✅ Yes | Accept page |
| 3.7 | Medium | ✅ Yes | Dropdown fixes |
| 4.1 | Small | ✅ Yes | Toast system |
| 4.2 | Small | ✅ Yes | Placeholders |
| 4.3 | Small | ✅ Yes | CSS change |
| 4.4 | Small | ✅ Yes | Assets |
| 4.5 | Small | ✅ Yes | Remove component |
| 5.1 | Large | ⚠️ Borderline | Excel generation complex |
| 5.2 | Medium | ✅ Yes | PDF generation |
| 5.3 | Small | ✅ Yes | Image capture |
| 5.4 | Small | ✅ Yes | Menu component |
| 6.1 | Small | ✅ Yes | Documentation |
| 6.2 | Small | ✅ Yes | Config |
| 6.3 | Small | ✅ Yes | Process doc |
| 7.1 | TBD | N/A | Deferred |
| 7.2 | TBD | N/A | Deferred |
| 7.3 | Small | ✅ Yes | Header update |

**Feasibility Score: 4/5** — Stories 1.2 and 5.1 are borderline large. Consider:
- Splitting 1.2 into element types (Story 1.2a-d)
- Breaking 5.1 into Excel structure + Excel styling

---

### 1.5 Sprint Recommendations Assessment

| Sprint | Epics | Stories | Risk Level |
|--------|-------|---------|------------|
| Sprint 1 | Epic 1 + Epic 2 | 13 | MEDIUM |
| Sprint 2 | Epic 3 + Epic 4 | 12 | MEDIUM |
| Sprint 3 | Epic 5 + Epic 6 | 7 | LOW |
| Sprint 4+ | Epic 7 | 3 | LOW |

**Sprint 1 Analysis (13 stories):**
- Epic 1 is CRITICAL and blocks everything
- Epic 2 can run in parallel (different codebase areas)
- **Concern:** 13 stories may be aggressive for Sprint 1
- **Recommendation:** Move 2.5 (race condition) to Sprint 2, or defer 1.8 (mode consolidation)

**Sprint 2 Analysis (12 stories):**
- Epic 3 depends on Epic 1 complete
- Epic 4 depends on Epic 1 mutations working
- 12 stories is reasonable given shared patterns

**Sprint Feasibility Score: 4/5** — Sprint 1 is slightly overloaded. Consider reducing to 10-11 stories.

---

### 1.6 Traceability Analysis

Every story includes explicit traceability to FRs:

| Story | Traces to FR(s) | Architecture Section |
|-------|-----------------|---------------------|
| 1.1 | FR-039 | 5.1 |
| 1.2 | FR-011–016, FR-019 | 5.1, 3.2 |
| 1.3 | FR-039 | 5.1 |
| 1.4 | FR-039 | 5.1 |
| 1.5 | FR-017 | 6.2 |
| 1.6 | FR-021–024 | 6.2 |
| 1.7 | FR-026 | 3.1 |
| 1.8 | FR-042 | 10 (ADRs) |
| 2.1 | FR-001 | 6.1 |
| 2.2 | FR-002 | 6.1 |
| 2.3 | FR-003 | 6.1 |
| 2.4 | FR-036 | 6.1 |
| 2.5 | BUG-010 | 6.3 |
| 3.1 | FR-004 | 3.1, 4.3 |
| 3.2 | FR-008–009 | 3.1 |
| 3.3 | FR-007 | 4.3 |
| 3.4 | FR-005 | 6.1 |
| 3.5 | FR-008–009 | 8 |
| 3.6 | FR-009 | 8.1 |
| 3.7 | FR-025, FR-027–028 | 5.2, 6.1 |
| 4.1 | FR-020 | 6.2 |
| 4.2 | FR-032 | 6.2 |
| 4.3 | FR-033 | 6.2 |
| 4.4 | FR-034 | — |
| 4.5 | FR-035 | — |
| 5.1 | FR-029 | 7.1 |
| 5.2 | FR-030 | 7.2 |
| 5.3 | FR-031 | 7.3 |
| 5.4 | FR-029–031 | 7.4 |
| 6.1 | FR-038 | 9.2 |
| 6.2 | — | 9.1 |
| 6.3 | FR-037 | 9.2 |
| 7.1 | FR-040 | — |
| 7.2 | FR-041 | — |
| 7.3 | FR-010 | 6.2 |

**Traceability Score: 5/5** — Excellent traceability from stories to both FRs and Architecture sections.

---

## Part 2: Implementation Readiness Checklist

### 2.1 Document Completeness

| Check | Status | Notes |
|-------|--------|-------|
| PRD exists and has all required sections | ✅ PASS | All 11 sections present |
| Architecture exists and addresses all PRD requirements | ✅ PASS | All 42 FRs mapped |
| Epics exist and cover all FRs | ✅ PASS | 42/42 FRs covered |
| No contradictions between PRD, Architecture, and Epics | ✅ PASS | All aligned |

### 2.2 Technical Consistency

| Check | Status | Notes |
|-------|--------|-------|
| Technical constraints consistent across all documents | ✅ PASS | Stack documented in all three |
| All stories have acceptance criteria | ✅ PASS | 35/35 have Gherkin format |
| Sprint plan exists | ✅ PASS | 4 sprints defined |
| Dependencies between epics are documented | ✅ PASS | Clear dependency graph |

---

### 2.3 Architecture ↔ PRD Alignment Verification

| PRD Section | Architecture Section | Alignment Status |
|-------------|---------------------|------------------|
| 6.1 Auth & Session (FR-001–010) | 4.1 Four-Tier Model, 4.2 Access Matrix | ✅ Aligned |
| 6.2 Core Data (FR-011–020) | 5.1 Shared Mutation Layer, 3.1 Schema | ✅ Aligned |
| 6.3 Visualisation (FR-021–024) | 6.2 Mode Controller, Node Component | ✅ Aligned |
| 6.4 System Mgmt (FR-025–028) | 5.2 Query Patterns, 3.1 Schema | ✅ Aligned |
| 6.5 Export (FR-029–031) | 7.1–7.4 Export Architecture | ✅ Aligned |
| 6.6 UX (FR-032–036) | 6.2 Component Patterns | ✅ Aligned |
| 6.7 Infrastructure (FR-037–042) | 9.1–9.3 Deployment, 10 ADRs | ✅ Aligned |
| 7.1–7.4 NFRs | 4.3 Security, 3.3 Data Access | ✅ Aligned |

**Alignment Status: 100% — All PRD requirements have corresponding Architecture sections.**

---

### 2.4 NFR Coverage Check

| NFR | Description | Covered in Architecture? | Epic Coverage |
|-----|-------------|-------------------------|---------------|
| NFR-001 | Page load < 3s | ✅ Section 7 | Epic 1, 2 |
| NFR-002 | Real-time sync < 2s | ✅ Section 5 | Epic 1 |
| NFR-003 | Excel export < 5s | ✅ Section 7.1 | Epic 5 |
| NFR-004 | Auth gating | ✅ Section 4.3 | Epic 3 |
| NFR-005 | Channel isolation | ✅ Section 4.3 | Epic 3 |
| NFR-006 | WorkOS production keys | ✅ Section 9.3 | Epic 2 |
| NFR-007 | Audit logging | ✅ Section 5.1 | Epic 1 |
| NFR-008 | 99.5% uptime | ✅ Section 9 | Epic 6 |
| NFR-009 | Soft delete | ✅ Section 3.1 | Epic 1 |
| NFR-010 | Session persistence | ✅ Section 4.4 | Epic 2 |
| NFR-011 | WCAG 2.1 AA | ✅ Sections 6.2, 4.3 | Epic 4 |
| NFR-012 | Keyboard navigation | ✅ Section 6.2 | Epic 4 |
| NFR-013 | Browser compatibility | ✅ Section 6.2 | Epic 2, 4 |

**NFR Coverage: 13/13 (100%)**

---

### 2.5 ADR ↔ Story Traceability

| ADR | Description | Mapped Stories |
|-----|-------------|----------------|
| ADR-001 | Four-Tier Role Model | 3.1, 3.3, 3.4, 7.3 |
| ADR-002 | Shared Mutation Layer | 1.1, 1.2, 1.3, 1.4 |
| ADR-003 | Client-Side Export | 5.1, 5.2, 5.3 |
| ADR-004 | Token-Based Invitations | 3.2, 3.5, 3.6 |
| ADR-005 | Schema Evolution | 3.1, 3.2, 1.7 |
| ADR-006 | Focus on Logic Model | 1.6, 1.8 |
| ADR-007 | Performance/Stage Consolidation | 1.8 |

---

## Part 3: Risk Analysis

### 3.1 High-Risk Items

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Story 1.2 (Element CRUD) too large for single session | Medium | Medium | Split into 4 stories by element type |
| Story 5.1 (Excel export) complexity | Medium | High | Start with basic structure, iterate on styling |
| Epic 3 depends on Epic 1 — if Epic 1 slips, Epic 3 blocked | Medium | High | Consider parallel skeleton work on Epic 3 |
| Convex schema migration for existing data | Low | High | ADR-005 additive approach mitigates |

### 3.2 Medium-Risk Items

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Sprint 1 overload (13 stories) | Medium | Medium | Move 2.5 or 1.8 to later sprint |
| Invitation email delivery (Phase 1 manual) | Low | Low | Acceptable for MVP |
| Permission engine complexity | Medium | Medium | Thorough testing in Story 3.3 |

### 3.3 Low-Risk Items

- UI/UX stories (Epic 4) — clear scope, well-understood
- Infrastructure stories (Epic 6) — process documentation
- Deferred Phase 3 stories — explicitly out of scope for now

---

## Part 4: Validation Summary Scores

### 4.1 Epics Validation Scores

| Criterion | Score | Weight | Weighted |
|-----------|-------|--------|----------|
| Completeness (FR coverage) | 5/5 | 30% | 1.50 |
| Quality (Acceptance criteria) | 5/5 | 25% | 1.25 |
| Feasibility (Story sizing) | 4/5 | 20% | 0.80 |
| Traceability (FR→Story→Arch) | 5/5 | 15% | 0.75 |
| Sprint Recommendations | 4/5 | 10% | 0.40 |
| **TOTAL** | — | 100% | **4.70/5.00** |

### 4.2 Implementation Readiness Scorecard

| Checklist Item | Status | Weight | Score |
|----------------|--------|--------|-------|
| PRD exists with all sections | ✅ PASS | 10% | 0.10 |
| Architecture addresses all PRD requirements | ✅ PASS | 15% | 0.15 |
| Epics cover all FRs | ✅ PASS | 15% | 0.15 |
| No contradictions between documents | ✅ PASS | 10% | 0.10 |
| Technical constraints consistent | ✅ PASS | 10% | 0.10 |
| All stories have acceptance criteria | ✅ PASS | 15% | 0.15 |
| Sprint plan exists | ✅ PASS | 10% | 0.10 |
| Dependencies documented | ✅ PASS | 15% | 0.15 |
| **TOTAL** | — | 100% | **1.00/1.00** |

---

## Part 5: Overall Gate Decision

### 5.1 Decision Matrix

| Criteria | Threshold | Actual | Pass? |
|----------|-----------|--------|-------|
| FR Coverage | 100% | 42/42 (100%) | ✅ |
| Acceptance Criteria Quality | ≥90% proper format | 100% | ✅ |
| Architecture Alignment | All FRs mapped | 42/42 | ✅ |
| NFR Coverage | 100% | 13/13 | ✅ |
| Story Sizing | ≤20% oversized | ~6% (2/35) | ✅ |
| Documentation Complete | All sections present | Yes | ✅ |

### 5.2 Gate Decision: ✅ **PASS**

**Overall Score: 94% (PASS threshold: ≥80%)**

---

## Part 6: Recommendations

### 6.1 Before Sprint 1 Starts

1. **Split Story 1.2** — The element CRUD refactoring is large. Consider splitting:
   - 1.2a: Impact Purpose & Key Results
   - 1.2b: Value Chain & Resources  
   - 1.2c: Delivery Culture (regression test BUG-002)
   - 1.2d: System Context (regression test BUG-003)

2. **Reduce Sprint 1 Load** — Move Story 2.5 (auth race condition) to Sprint 2:
   - Sprint 1: 12 stories instead of 13
   - Sprint 2: 13 stories (still reasonable)

### 6.2 During Sprint 1

3. **Validate Shared Mutation Layer Early** — Story 1.1 is foundational. If it takes longer than expected, adjust Epic 1 timeline.

4. **Parallel Auth Work** — Epic 2 can run truly parallel to Epic 1 since they touch different code paths (auth vs data operations).

### 6.3 Before Sprint 2

5. **Review Phase 3 Deferrals** — Stories 7.1 and 7.2 are deferred. Confirm with stakeholders that undo and KPI-in-nodes can wait until after core stability.

6. **Excel Export Spike** — Story 5.1 is complex. Consider a brief spike in Sprint 2 to validate exceljs approach before Sprint 3 implementation.

---

## Part 7: Blocking Issues Summary

### 7.1 Current Blocking Issues: **NONE**

There are no blocking issues that prevent Sprint 1 from starting.

### 7.2 Watch List (Non-Blocking)

| Issue | Risk Level | Owner | Mitigation |
|-------|------------|-------|------------|
| Story 1.2 size | Medium | Tech Lead | Split if not 50% done by mid-Sprint 1 |
| Story 5.1 complexity | Medium | Tech Lead | Spike in Sprint 2 if needed |
| Sprint 1 velocity | Medium | PM | Move Story 2.5 to Sprint 2 if behind |

---

## Appendix A: Quick Reference

### FR → Epic Mapping

| Epic | FRs | Story Count | Priority |
|------|-----|-------------|----------|
| Epic 1 | FR-011–019, FR-021–024, FR-039, FR-042 | 8 | CRITICAL |
| Epic 2 | FR-001–003, FR-036 | 5 | CRITICAL |
| Epic 3 | FR-004–010, FR-025–028 | 7 | HIGH |
| Epic 4 | FR-020, FR-032–035 | 5 | HIGH |
| Epic 5 | FR-029–031 | 4 | HIGH |
| Epic 6 | FR-037–038 | 3 | MEDIUM |
| Epic 7 | FR-040–041, FR-010 | 3 | LOW (deferred) |

### Sprint Allocation

| Sprint | Stories | Focus |
|--------|---------|-------|
| Sprint 1 | 12-13 | Core Stability + Auth |
| Sprint 2 | 12-13 | Roles + UX Polish |
| Sprint 3 | 7 | Export + Infrastructure |
| Sprint 4+ | 3 | Future enhancements |

---

*Report generated by BMAD Validation Architect*  
*Status: FINAL — Ready for Sprint 1 kickoff*
