# 09 — MAST ERIC Report Structure (Acceptance Criteria for Phase 1)

> **Source**: `Report - ERIC.pdf` — Sample report for December 2021 period
> **Date**: 4 March 2026
> **Purpose**: This document defines exactly what Phase 1 must replicate

---

## Report Metadata

| Field | Value |
|-------|-------|
| Client | Marine and Safety Tasmania (MAST) |
| Period | December 2021 |
| Platform | EricSFM.com |
| Format | Single long-page web app (1239 x 2491 pts) |
| Branding | CICA ("Critical Insights / Confident Action") header — dark maroon/burgundy |
| Auth | Azure AD B2C — "Hello Martin Farley [Administrators,Client]" |

---

## Navigation Sidebar (10 items)

| # | Item | Function |
|---|------|----------|
| 1 | Clients | Client management |
| 2 | Client Invites | Invitation management |
| 3 | Client Plans | Subscription/plan management |
| 4 | Agents | Agent management |
| 5 | Distributers | Distributor management (note: typo in original) |
| 6 | Sectors | Sector view (active in screenshot) |
| 7 | Xero Accounts | Financial integration |
| 8 | Validate Files | Data validation tools |
| 9 | Enter Data | Data entry interface |
| 10 | Reports | Report generation/viewing |

**Phase 1 relevance**: Items 8-10 (Validate Files, Enter Data, Reports) are the core user-facing functions. Items 1-7 are admin/platform features.

---

## Report Structure: Line Charts (13 defined in Custom Tree, 11 visible in Dec 2021 report)

Layout: 2-column grid, 6 rows (last row has 1 chart only).

All charts share the same X-axis: 12 time periods in 6-month increments (Current → 60 months previous = 5 years of history).

### Chart 1: BOARDS EYE VIEW — Composite KPI Index results (100 base score)
- **Type**: Line chart
- **Series**: Stakeholders, Service Delivery, Mngt & Governance, People & Culture, Financial Mngt
- **Y-axis**: 0–180
- **Significance**: This is the "dashboard" — composite view of 5 management themes (the 6th theme, MAST Performance Framework Report, is a drill-down only)
- **Data range**: Series cluster around 80–140, baseline at 100

### Chart 2: Stakeholder Numbers
- **Type**: Line chart
- **Series**: No. of license holders, No. of boats registered, No. of moorings registered
- **Y-axis**: 0–70,000
- **Data**: Boats ~60K, Licenses ~30-40K, Moorings ~5K

### Chart 3: Boat average ages
- **Type**: Line chart
- **Series**: All boats, Glass, Alloy, Other
- **Y-axis**: 0–20 years
- **Data**: Other ~18-20y, All/Glass ~16-18y, Alloy ~8-10y

### Chart 4: Boat and license holder geographic dispersion
- **Type**: Line chart
- **Series**: % Licenses/Boats in North, East, South, NW (8 series total)
- **Y-axis**: 0–30,000

### Chart 5: Schools Education Reach
- **Type**: Line chart
- **Series**: Total/Target No. schools visited, Total/Target No. students engaged
- **Y-axis**: 0–6,000

### Chart 6: Stakeholder engagement
- **Type**: Line chart
- **Series**: No. website visits, No. phone calls, No. social media followers
- **Y-axis**: 0–80,000

### Chart 7: Frequency rates
- **Type**: Line chart
- **Series**: Inspections per 1,000 boats, Incidents per 1,000 boats
- **Y-axis**: 0–1.0

### Chart 8: Financial Management
- **Type**: Line chart
- **Series**: Income variance analysis (% Var. budget), Expenditure variance (% Var. budget)
- **Y-axis**: -0.4 to 0.2

### Chart 9: Solvency
- **Type**: Line chart
- **Series**: Current ratio, MAST Min. comfort threshold
- **Y-axis**: 0–20

### Chart 10: People & Culture — Profile
- **Type**: Line chart
- **Series**: No. of FTE, Ave. age, Ave. tenure, No. WHS incidents
- **Y-axis**: 0–60

### Chart 11: People & Culture — Utilisation
- **Type**: Line chart
- **Series**: Planned (rostered/worked) as % of capacity, Worked as % of planned, OT & TOIL hours as % of planned
- **Y-axis**: 0–1.2

### Chart 12: Complaints management *(not visible in Dec 2021 PDF — defined in Custom Tree)*
- **Type**: Line chart
- **Series**: TBD — defined in Custom Tree row 130
- **Note**: May have been added after Dec 2021, or conditionally hidden

### Chart 13: People & Culture — Annual performance reviews *(not visible in Dec 2021 PDF — defined in Custom Tree)*
- **Type**: Line chart
- **Series**: TBD — defined in Custom Tree row 172
- **Note**: May have been added after Dec 2021, or conditionally hidden

---

## Report Structure: Drill Down Reports (6 sections)

All displayed as expandable/collapsible accordion sections with dark maroon/burgundy header bars.

| # | Theme | Corresponds to |
|---|-------|---------------|
| 1 | Stakeholders | Custom Tree NODE structure (14+ nodes) |
| 2 | Service Delivery | Custom Tree NODE structure |
| 3 | Management & Governance | Custom Tree NODE structure |
| 4 | People & Culture | Custom Tree NODE structure |
| 5 | Financial Management | Custom Tree NODE structure |
| 6 | MAST PERFORMANCE FRAMEWORK REPORT | Aggregate/composite view |

**Note**: All drill-downs are collapsed in the sample PDF. Internal structure follows the NODE hierarchy documented in `08_DATA_MODEL_ANALYSIS.md` — each drill-down cascades from NODE1 through NODE16+ with FormulaIDs and parent references.

Each drill-down table shows (based on ERIC system design):
- Rows: Variables within that theme
- Columns: Current period value, previous period(s), benchmark/target
- Colour coding: Green (≥100), Yellow (95-99), Red (<95)
- Expandable sub-rows for business unit breakdown

---

## UI Design Elements (for replication)

| Element | Style |
|---------|-------|
| Header | Dark maroon/burgundy bar, white text |
| Sidebar | Dark charcoal/navy, white icons + text |
| Active sidebar item | Red/maroon highlight |
| Chart grid | 2-column layout, white background, light gray gridlines |
| Chart legends | Below or beside each chart |
| Drill-down headers | Maroon accordion bars, white text, collapse/expand arrows |
| Footer | "© 2022 - Eric - Privacy" |
| Page background | White |

---

## Summary Statistics

| Metric | Count |
|--------|-------|
| Line Charts | 13 (11 in Dec 2021 report, 2 additional in Custom Tree) |
| Data series (total across all charts) | ~35 |
| Drill Down sections | 6 |
| Time periods per chart | 12 (5 years × 2/year) |
| Sidebar navigation items | 10 |
| Report frequency | Every 6 months |

---

## Phase 1 Acceptance Criteria

Phase 1 must produce a report that:
1. ✅ Shows all 11 line charts with correct data series and axes
2. ✅ Shows all 6 drill-down report sections with expandable tables
3. ✅ Uses baseline=100 scoring with Green/Yellow/Red colour coding
4. ✅ Displays 12 time periods (5 years of 6-month intervals)
5. ✅ Maintains the 2-column chart grid layout
6. ✅ Has equivalent navigation (Enter Data, Validate Files, Reports at minimum)
7. ✅ Supports Administrator and Client roles
8. ✅ Generates from the same Entry ID / Formula structure (287 IDs, 2415 formulas)
9. ❌ Does NOT need to replicate the exact CICA branding (MAST gets own brand)
10. ❌ Does NOT need Xero integration, Agents, Distributors, Sectors (admin features)
