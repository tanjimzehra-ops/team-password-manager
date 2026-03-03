# 11 — Documentation Evaluation Report

> **Date**: 4 March 2026  
> **Evaluator**: Deep Eval Sub-agent  
> **Scope**: All discovery documents (01–10) cross-referenced against Excel source files

---

## 1. Summary

**Overall Documentation Quality: 7.5/10**

The documentation suite is comprehensive and well-structured. The core data model numbers (287 Entry IDs, 2,415 formulas, 7,458 entry fields, 19 risk domains) are **all verified correct** against the Excel source files. However, there are several inconsistencies between documents — particularly around entry type counts, management theme references, named manager counts, and line chart counts. These are detailed below and have been corrected.

---

## 2. Verified Statistics

| Metric | Docs Claim | Actual (from Excel) | Status |
|--------|-----------|---------------------|--------|
| Unique Entry IDs | 287 | **287** | ✅ Correct |
| Entry ID Range | 491–3499 | **491–3499** | ✅ Correct |
| Total Formulas | 2,415 | **2,415** | ✅ Correct |
| Formula ID Range | 1–2,442 | **1–2,442** | ✅ Correct |
| Data Entry Fields | 7,458 | **7,458** | ✅ Correct |
| Entry Types | Various (11/12/13/14) | **11** (IDs 0–10) | ❌ Inconsistent across docs |
| Risk Domains | 19 | **19** (excl. header row) | ✅ Correct |
| Named Managers | "9" (08) vs "5" (04,07) | **5** named individuals | ❌ Doc 08 exec summary wrong |
| Custom Tree Rows | 92 | **92** (non-empty data rows) | ✅ Correct |
| Categories | 6 | **6** | ✅ Correct |
| Groups | 18 | **18** | ✅ Correct |
| Labels | 87 | **87** | ✅ Correct |
| Line Charts (Custom Tree) | 11 (doc 09) | **13** in tree definition | ❌ Doc 09 undercounts |
| Drill-Down Reports | 6 | **6** | ✅ Correct |
| Report Themes | 6 custom | **6** (confirmed via DDR: prefixes) | ✅ Correct |
| Report prefixes in tree | DDR:, LC:, BC:, RT: (doc 07) | **Only DDR: and LC:** found | ⚠️ BC: and RT: not present in MAST tree |

---

## 3. Corrections Required

### 3.1 Entry Type Count Inconsistency

The Excel file `BDO Data and Formulas (2).xlsx` → `Entry Types` sheet contains **11 entry types** (IDs 0–10). The 12th row is the header "Id/Type". Documents disagree:

| Document | Claims | Correct? |
|----------|--------|----------|
| 07 (Section 2.2) | Lists types 0–13 (implies 14 types) | ❌ Types 11–13 don't exist in MAST data |
| 07 (Section 3.1) | "Entry Types: 11" | ✅ |
| 08 (Section 2.1) | Lists 12 (includes header row) | ❌ Should be 11 |
| 08 (Section 9) | "Entry Types: 12" | ❌ Should be 11 |
| 10 | "13 types" | ❌ Should be 11 |
| 04 (A8) | "13 types" | ❌ Should be 11 |

**Root cause**: Doc 07 section 2.2 lists generic ERIC entry types (0–13) from the ERIC User Manual, but MAST only uses types 0–10. Types 11 (Integer Percent), 12 (Intelligence Gathering → Direct Provision), and 13 (Support/Audit/Decline) exist in the ERIC platform but are NOT used by MAST.

**Fix**: All documents corrected to say "11 entry types (IDs 0–10)" for MAST-specific context. Doc 07 section 2.2 now notes that types 11–13 exist in ERIC but are not used by MAST.

### 3.2 Named Managers Count

| Document | Claims | Correct? |
|----------|--------|----------|
| 08 (exec summary) | "Named Managers: 9" | ❌ |
| 10 | "9 named managers" | ❌ |
| 04, 07 | "5 named managers" or "5+" | ✅ |

**Root cause**: The "9" comes from counting unique manager-assignment entries in the risk domains table (where shared assignments like "Peter Hopkins/Toby Greenlees" are counted as separate entries). The actual count is **5 named individuals** (Bill Batt, Lia Morris, Justin Foster, Peter Hopkins, Toby Greenlees) plus "All Managers" for 3 domains.

**Fix**: Corrected to "5" in doc 08 executive summary and doc 10.

### 3.3 Management Themes — Doc 01 Uses Wrong Themes

Doc 01 Section "Management Themes (Example Profile)" lists the **standard ERIC 5 themes**:
- Clients, Service Delivery, Management & Governance, People & Culture, Risk

But MAST uses **6 custom themes**:
- Stakeholders, Service Delivery, Management & Governance, People & Culture, Financial Management, MAST Performance Framework Report

Also: Doc 01 says "Suite of 5 critical management themes" in the 4-level hierarchy table.

**Fix**: Corrected doc 01 to reference MAST's 6 custom themes.

### 3.4 Line Chart Count — Doc 09 Says 11, Custom Tree Has 13

The Custom Tree defines **13 LC: entries**:
1. BOARDS EYE VIEW — Composite KPI Index results
2. Stakeholder Numbers
3. Boat average ages
4. Boat and license holder geographic dispersion
5. Schools Education Reach
6. Stakeholder engagement
7. Frequency rates
8. Financial Management
9. Solvency
10. **Complaints management** ← missing from doc 09
11. People & Culture — Profile
12. People & Culture — Utilisation
13. **People & Culture — Annual performance reviews** ← missing from doc 09

The Dec 2021 PDF report only shows 11 charts (missing #10 and #13). This means either: (a) these charts were added to the tree after Dec 2021, or (b) they're defined but conditionally hidden. Either way, the Custom Tree is the authoritative source.

**Fix**: Doc 09 updated to note 13 charts defined in tree (11 visible in Dec 2021 report sample).

### 3.5 Entry ID Range Error in Doc 08 Section 8

Doc 08 Section 8 says "Preserve 357-746+ range" — should be "491-3499".

**Fix**: Corrected.

### 3.6 BC: and RT: Prefixes Not in MAST Custom Tree

Doc 07 Section 2.7 lists BC: (Bar Chart), RT: (Report Table), and Comments: as report prefixes. However, the MAST Custom Tree only contains **LC: and DDR:** prefixes. BC: and RT: may exist in other ERIC clients but are not used by MAST.

**Fix**: Added note to doc 07 that these are generic ERIC prefixes; MAST only uses LC: and DDR:.

### 3.7 Doc 09 Chart 1 Says "5 Management Themes"

The Board's Eye View chart has 5 data series (Stakeholders, Service Delivery, Mngt & Governance, People & Culture, Financial Mngt). Doc 09 says "composite view of all 5 management themes" — technically correct for the chart (the 6th theme, MAST Performance Framework Report, is a drill-down, not a chart series), but could be confusing. Added clarification.

---

## 4. Inconsistencies Between Documents

| Issue | Documents | Resolution |
|-------|-----------|------------|
| Entry type count | 07 vs 08 vs 10 vs 04 | Standardised to 11 (IDs 0–10) |
| Named managers | 08 says 9, others say 5 | Corrected to 5 named individuals |
| Management themes in 01 | 01 uses standard 5, rest use custom 6 | Corrected 01 |
| Line chart count | 09 says 11, tree has 13 | Updated 09 with note |
| Entry ID range in 08 §8 | Says 357–746+, should be 491–3499 | Corrected |
| Report prefixes | 07 lists BC:/RT:, tree only has LC:/DDR: | Added MAST-specific note |

---

## 5. Missing Data

### 5.1 Custom Tree Report Structure Not Fully Documented

The Custom Tree columns 21–60 contain the complete report structure definitions (LC: charts with data series, DDR: drill-downs with NODE hierarchy). While the NODE hierarchy is mentioned in docs, the **specific chart data series mappings** (which Entry IDs feed which chart) are not documented. This data exists in columns 21+ of the Custom Tree.

### 5.2 Two Additional Charts Not Captured

"Complaints management" and "People & Culture — Annual performance reviews" charts are defined in the Custom Tree but not documented in 09_REPORT_STRUCTURE.md (because they don't appear in the Dec 2021 PDF sample).

### 5.3 Source Data Typos (From Excel — Preserve As-Is)

- "Experimential" (should be "Experiential") — in Risk Domains Excel and Custom Tree
- "Toby Greenelees" (extra 'e') — in Risk Domains Excel for one entry
- "Distributers" (should be "Distributors") — in ERIC UI sidebar

These are typos in the **source data/system**, not in our documentation. Documents correctly reproduce them. No correction needed — note for Phase 1 build.

### 5.4 Label Categories, Formula Display Types, Entry Requirements

The `BDO Data and Formulas (2).xlsx` file contains 3 additional sheets not thoroughly documented:
- **Label Categories** (4 rows) — category type definitions
- **Formula Display Type** (4 rows) — output formatting rules
- **Entry Requirements** (5 rows) — requirement type definitions

These are referenced in the data model but their contents aren't detailed in the docs.

---

## 6. Document Quality

| Check | Result |
|-------|--------|
| Broken markdown | ✅ None found |
| Placeholder text | ✅ "TBD" in 03 for domain (appropriate — genuinely unknown) |
| TODO items | ✅ None unresolved |
| Section numbering errors | ⚠️ Doc 07 uses "3.1" and "3.2" in Section 4 (Azure Infrastructure) — numbering reset |
| Contradictions | ❌ Several found and corrected (see §3) |

---

## 7. Recommendations Before PRD

1. **Entry types 11–13**: Confirm with Martin whether MAST will ever need these types, or if 0–10 is the permanent set
2. **Charts 12–13**: Confirm whether "Complaints management" and "People & Culture — Annual performance reviews" should be in Phase 1
3. **Chart data series mapping**: Extract the full LC: column data from the Custom Tree to document exactly which Entry IDs/Formulas feed each chart
4. **Label Categories / Display Types / Entry Requirements**: Document the contents of these 3 small sheets
5. **DB separation**: Still the #1 blocker — need answer from Caedus Systems

---

*Document generated: 4 March 2026*
