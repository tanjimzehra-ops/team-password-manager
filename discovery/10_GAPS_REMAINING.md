# 10 — MAST: Remaining Gaps for PRD

> **Date**: 4 March 2026
> **Status**: Post-analysis — most questions answered from Martin's files
> **Previous state**: 15/24 unknown → now 7/24 unknown (and only 3 are true blockers)

---

## What We Now Know ✅

| Area | Status | Source |
|------|--------|--------|
| Complete workflow (6 steps) | ✅ | Martin email 3 Mar + follow-up 4 Mar |
| Data tree structure (6 categories, 18 groups, 92 rows) | ✅ | BDO Mast Custom Tree.xlsx |
| Entry IDs (287 unique, range 491-3499) | ✅ | Custom Tree + Data Entry Fields |
| Formulas (2,415 with calculation chains) | ✅ | BDO Data and Formulas.xlsx |
| Data entry fields (7,458) | ✅ | BDO Data and Formulas.xlsx |
| Entry types (11 types, IDs 0–10) | ✅ | BDO Data and Formulas.xlsx |
| Risk domains (19 with responsible managers) | ✅ | MAST Risk Domains.xlsx |
| Named managers (5: Batt, Morris, Foster, Hopkins, Greenlees) | ✅ | MAST Risk Domains.xlsx |
| Management themes (6 custom, NOT standard 5) | ✅ | Custom Tree + Report PDF |
| Report structure (11 line charts + 6 drill-downs) | ✅ | Report - ERIC.pdf |
| Report frequency | ✅ Every 6 months | Martin verbal confirmation |
| Drill-down NODE hierarchy | ✅ | Custom Tree (NODE1→NODE16+) |
| Phase 1 scope (5 points) | ✅ | Martin email 4 Mar |
| Variable file structure | ✅ | ERIC Technical Brief + Data and Formulas |
| Colour coding (Green/Yellow/Red at 100/95 thresholds) | ✅ | ERIC methodology |

---

## Genuine Remaining Gaps

### 🔴 Blocker — Cannot write PRD without this

#### Gap 1: Database Separation
- **What**: Does MAST have its own Azure SQL instance, or does it share a database with other ERIC clients (May Shaw, CatholicCare)?
- **From**: Martin or Caedus Systems
- **Why it blocks**: Determines the entire migration approach. Shared DB = extract MAST data without affecting others (complex). Separate DB = migrate whole instance (simpler).
- **Suggested approach**: Martin asks Caedus one question: "Is the MAST database a separate Azure SQL instance?"

### 🟡 Important — Affects design but workarounds exist

#### Gap 2: User Access Details
- **What**: How many people total access the system? Do they have individual Azure AD accounts or a shared login? What does Bill Batt actually do day-to-day?
- **From**: Bill Batt or Martin
- **Why it matters**: Defines RBAC design — how many user accounts to create, what permission levels. We know 5 named managers from Risk Domains but don't know if all of them log into ERIC directly.
- **Workaround**: Design for 3 roles (Admin=Bill Batt, Contributor=managers, Viewer=board) and adjust later.
- **Suggested approach**: Quick call with Bill Batt — 15 minutes would answer all user questions.

#### Gap 3: Board Member Count
- **What**: How many board/executive members need read-only report access?
- **From**: Bill Batt or Martin
- **Why it matters**: Affects licensing if using a paid auth service, and determines if we need a separate "Board" view.
- **Workaround**: Build generic "Viewer" role, add board members later.

#### Gap 4: Report Authorisation Workflow
- **What**: When Bill Batt "authorises" a report, is it a formal review/sign-off or just pressing a "run" button?
- **From**: Bill Batt or Martin
- **Why it matters**: Determines whether we need an approval workflow (review → approve → publish) or just a "generate report" button.
- **Workaround**: Martin's latest message says "upload and run instruction" — suggests it's a simple trigger, not formal governance. Build as trigger, add approval layer if needed.

### ⚪ Nice to Have — Can proceed without

#### Gap 5: ERIC Source Code Access
- **What**: Access to the ERIC codebase (Azure DevOps) to understand how the report engine works internally.
- **From**: Martin / Caedus Systems
- **Why it matters**: Understanding the exact report generation logic would ensure 100% replication fidelity.
- **Workaround**: We have the formulas, entry types, and output format. We can reverse-engineer the calculation engine from the Data and Formulas file (2,415 formulas with explicit syntax). Source code would be faster but isn't strictly required.

#### Gap 6: MAST MAP DEC22.xlsx
- **What**: This file appears to contain embedded chart/image data (1 sheet, 1 row, 1 col) — likely a screenshot or map visualization. Openpyxl can't extract the visual content.
- **Action**: Ask Martin what this file is, or ignore it — likely a geographic map of boat registrations.

#### Gap 7: Expanded Drill-Down Content
- **What**: The sample report PDF shows all 6 drill-down sections collapsed. We don't have a screenshot of the expanded tables.
- **From**: Martin (screenshot of an expanded drill-down) or Bill Batt
- **Why it matters**: We know the NODE structure from the Custom Tree, but seeing the actual rendered table would confirm column layout and formatting.
- **Workaround**: Build from NODE structure in Custom Tree — we have Ref, Title, FormulaID, Parent for each node.

---

## Summary: Can we write the PRD?

| Requirement | Status |
|-------------|--------|
| Data model | ✅ Complete |
| Formulas & calculations | ✅ Complete |
| Report structure | ✅ Complete (charts + drill-down themes) |
| User workflow | ✅ Complete |
| Phase 1 scope | ✅ Confirmed by Martin |
| User permissions | 🟡 Assumed (3 roles: Admin, Contributor, Viewer) |
| Database architecture | 🔴 Need DB separation answer |
| Report frequency | ✅ Every 6 months |

**Verdict**: We can start the PRD now with one assumption (DB separation). The PRD should flag DB separation as a decision point with two paths (shared vs separate). All other gaps have reasonable workarounds.

---

## Phase 2 Scope (Explicitly OUT of Phase 1)

From `MAST Dynamic Risk Management Improvement.docx`:

- ~200 risks with different focus levels (Board, Managers, Operations)
- Risk dynamics: escalation, de-escalation, new risk tracking
- Residual risk dynamics — high, escalating risks to Board/Exec
- Key strategic and operational risk combinations
- Graphical outcomes for risk reporting
- Standard structure: summary → graphs → drill-down → table
- Difficulty accessing, adding, and amending risks (Phase 1 addresses this partially)
- Nominated personnel can apply new risk assessments to domains (Phase 1 addresses this)
- Manager domain reports (Phase 2 — per-manager filtered views)

**Phase 2 trigger**: After Phase 1 is live and Bill Batt has operational autonomy, revisit Dynamic Risk requirements with semantic labels layer (replacing cell references).
