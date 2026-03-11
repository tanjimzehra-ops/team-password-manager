# MAST/ERIC — Development Brief for Tanjim
**Date:** 11 March 2026 | **Project:** ERIC Self-Service for Marine & Safety Tasmania

---

## Context

We're rebuilding ERIC — an algorithmic reporting system for MAST (Marine & Safety Tasmania). The system takes raw data from 287 entry fields, runs 2,415 formulas, and produces a Board Report with line charts + drill-down tables.

**Your focus:** The report viewer — the pages that display charts and drill-down data.

**Important:** Your HTML_DRAFT branch had good UI work, but the data was mostly AI-generated/hallucinated. This brief gives you the **exact real structure** so you can rebuild it accurately. The components (SVG charts, layout) were good — the data layer needs to match ERIC exactly.

---

## Git Workflow (IMPORTANT — read this first)

**Do NOT push to `main` directly.** The new workflow is:

```bash
# Start fresh from main
git fetch origin
git checkout main
git pull origin main

# Create your feature branch
git checkout -b feature/report-viewer

# Work here, commit often
git add .
git commit -m "feat: description of what you did"

# Push your branch
git push origin feature/report-viewer

# Then open a Pull Request on GitHub for review
```

**Do NOT include Jigsaw code, password managers, or other projects in the MAST repo.** Only MAST/ERIC files belong here.

---

## Source Files (already in this repo)

| File | Location | What's in it |
|------|----------|-------------|
| **Report structure** | `discovery/09_REPORT_STRUCTURE.md` | Exact chart specs, drill-down structure, UI design — **READ THIS FIRST** |
| **Data model** | `discovery/08_DATA_MODEL_ANALYSIS.md` | 287 Entry IDs, 6 categories, 18 groups, 87 labels |
| **ERIC User Manual** | Workspace: `projects/mast/docs/ERIC-User-Manual.md` | Full system documentation (1,156 lines) |
| **Original ERIC PDF** | `reference/martin-originals/Report - ERIC.pdf` | The actual report we're replicating |
| **Data tree hierarchy** | `reference/martin-originals/BDO Mast Custom Tree (1).xlsx` | NODE hierarchy for drill-downs |

---

## What You Got Right (keep these)

- ✅ SVG `MultiLineChart` component — well built, reusable
- ✅ 2-column grid layout for charts
- ✅ Route structure: `/mast/reports/board` → `/mast/reports/drilldown/[theme]`
- ✅ The 6 theme names (Stakeholders, Service Delivery, Mngt & Governance, People & Culture, Financial Mngt, MAST Performance Framework Report)
- ✅ 11 chart titles match the real ERIC report

## What Needs Fixing

| Issue | What you had | What ERIC actually has |
|-------|-------------|----------------------|
| **X-axis periods** | 5 periods | **12 periods** (5 years × 2/year, every 6 months) |
| **Y-axis scales** | Generic/wrong | Each chart has specific ranges (see table below) |
| **Data values** | Hardcoded, invented | Must come from DB (Entry IDs + formulas) |
| **Drill-down structure** | Generic "domains/capabilities/risks" | **NODE hierarchy** from Custom Tree (NODE1→NODE16+) |
| **Colour coding** | Not implemented | **Green** (≥100), **Yellow** (95-99), **Red** (<95) — baseline 100 |
| **Branding** | Blue gradient | **Dark maroon/burgundy** header, dark charcoal sidebar |
| **Capabilities section** | Maturity gauges | **Does not exist in ERIC** — remove entirely |
| **Risk Matrix scatter plot** | SVG scatter | **Does not exist in ERIC** — remove entirely |

---

## Tasks — Go In Order

### ✅ TASK 1 — Fix the Board Report Page (charts)

Rebuild `board/page.tsx` with the correct chart specifications. For now, keep using hardcoded data BUT use **realistic placeholder values** that match the correct scales. We'll connect to the real DB later.

**The 11 charts with correct specs:**

| # | Chart Title | Series | Y-axis Range |
|---|------------|--------|-------------|
| 1 | BOARDS EYE VIEW — Composite KPI Index (100 base) | Stakeholders, Service Delivery, Mngt & Governance, People & Culture, Financial Mngt | 0–180 |
| 2 | Stakeholder Numbers | No. of license holders, No. of boats registered, No. of moorings registered | 0–70,000 |
| 3 | Boat average ages | All boats, Glass, Alloy, Other | 0–20 years |
| 4 | Boat and license holder geographic dispersion | % Licenses/Boats in North, East, South, NW (8 series) | 0–30,000 |
| 5 | Schools Education Reach | Total/Target No. schools visited, Total/Target No. students engaged | 0–6,000 |
| 6 | Stakeholder engagement | No. website visits, No. phone calls, No. social media followers | 0–80,000 |
| 7 | Frequency rates | Inspections per 1,000 boats, Incidents per 1,000 boats | 0–1.0 |
| 8 | Financial Management | Income variance (% Var. budget), Expenditure variance (% Var. budget) | -0.4 to 0.2 |
| 9 | Solvency | Current ratio, MAST Min. comfort threshold | 0–20 |
| 10 | People & Culture — Profile | No. of FTE, Ave. age, Ave. tenure, No. WHS incidents | 0–60 |
| 11 | People & Culture — Utilisation | Planned as % of capacity, Worked as % of planned, OT & TOIL as % of planned | 0–1.2 |

**X-axis for ALL charts:** 12 data points, labeled by period (e.g., "Dec 21", "Jun 21", "Dec 20", ... going back 5 years).

**Branding:**
- Header bar: dark maroon/burgundy (`#5a2d3e` or similar), white text
- Sidebar: dark charcoal/navy, white icons
- Footer: "© 2022 - Eric - Privacy"
- Page background: white

**Drill-down section at bottom:**
- 6 maroon accordion bars (NOT links to separate pages)
- Expandable/collapsible (collapsed by default)
- White text on maroon background
- Each section header: Stakeholders | Service Delivery | Management & Governance | People & Culture | Financial Management | MAST PERFORMANCE FRAMEWORK REPORT

**Deliverable:** Updated `board/page.tsx` with correct scales, 12 periods, proper branding, accordion drill-downs.

**Done when:**
- [ ] All 11 charts have correct Y-axis ranges per table above
- [ ] X-axis shows 12 periods (not 5)
- [ ] Chart series match exactly (correct number of lines per chart)
- [ ] Header is maroon/burgundy, not blue
- [ ] Drill-down section uses accordion (expand/collapse), not navigation links
- [ ] No "capabilities" or "risk matrix" sections exist

**⛔ DO NOT proceed to Task 2 until Task 1 is reviewed.**

---

### ✅ TASK 2 — Rebuild Drill-Down Tables (after Task 1 reviewed)

The drill-down content inside each accordion section should show **tables**, not the domain/capability cards you had before.

**Structure per theme:**
- Rows = variables within that theme (from the Custom Tree NODE hierarchy)
- Columns = Current period | Previous period(s) | Benchmark/Target
- Colour coding per cell: **Green** (value ≥ 100), **Yellow** (95-99), **Red** (< 95)
- Sub-rows expandable for business unit breakdown

**The NODE hierarchy** is defined in `reference/martin-originals/BDO Mast Custom Tree (1).xlsx`. Read the "NODE" columns — they define parent-child relationships for the drill-down tree.

**For now:** Use placeholder data in the correct structure. The key is getting the **layout and hierarchy right**, not the numbers.

**Deliverable:** Each of the 6 accordion sections expands to show a table with the correct column structure and colour coding.

**Done when:**
- [ ] Each theme section expands to show a data table
- [ ] Columns: Variable name | Current | Previous | Benchmark
- [ ] Cells colour-coded: Green/Yellow/Red based on value vs 100 baseline
- [ ] At least 5 placeholder rows per theme showing the correct hierarchy pattern
- [ ] Sub-rows can expand/collapse for business unit detail

---

### 🔴 TASK 3 — Connect to Real Database (WAIT — depends on Pradeep's schema)

Once the schema is built (Pradeep's Task 1), we'll connect the charts and tables to real data via API. Don't start this until both Task 1 and Pradeep's schema are done.

---

## Summary

| # | Task | Depends on | Can start now? |
|---|------|-----------|----------------|
| T1 | Fix Board Report (charts + branding + accordion) | Nothing — use `09_REPORT_STRUCTURE.md` | ✅ Yes |
| T2 | Rebuild drill-down tables | T1 reviewed | ⏳ After T1 |
| T3 | Connect to real DB | Pradeep's schema + T2 | ❌ Wait |

---

## Use This Prompt in Cursor

### Phase 1 — Fix Board Report (start here)

```
Read `discovery/09_REPORT_STRUCTURE.md` completely. This defines the exact ERIC report we need to replicate for MAST.

Also look at the PDF `reference/martin-originals/Report - ERIC.pdf` for the visual reference.

Now rebuild the Board Report page. I already have a version but the data scales and structure need fixing.

Requirements:
1. Layout: 2-column grid of line charts, white background
2. Header: dark maroon/burgundy bar (not blue), white text, "ERIC | REPORTS"
3. 11 SVG line charts with these EXACT specs:
   - Chart 1: "BOARDS EYE VIEW — Composite KPI Index (100 base)" — 5 series, Y: 0-180
   - Chart 2: "Stakeholder Numbers" — 3 series (license holders, boats, moorings), Y: 0-70000
   - Chart 3: "Boat average ages" — 4 series (All, Glass, Alloy, Other), Y: 0-20
   - Chart 4: "Geographic dispersion" — 8 series (% Licenses/Boats × N/E/S/NW), Y: 0-30000
   - Chart 5: "Schools Education Reach" — 4 series (actual/target × schools/students), Y: 0-6000
   - Chart 6: "Stakeholder engagement" — 3 series (web/phone/social), Y: 0-80000
   - Chart 7: "Frequency rates" — 2 series (inspections/incidents per 1000 boats), Y: 0-1.0
   - Chart 8: "Financial Management" — 2 series (income/expenditure variance %), Y: -0.4 to 0.2
   - Chart 9: "Solvency" — 2 series (current ratio, min threshold), Y: 0-20
   - Chart 10: "People & Culture Profile" — 4 series (FTE/age/tenure/WHS), Y: 0-60
   - Chart 11: "People & Culture Utilisation" — 3 series (planned/worked/OT %), Y: 0-1.2
4. X-axis: 12 data points (Dec 21, Jun 21, Dec 20, Jun 20, ... back 5 years)
5. Use realistic placeholder data that respects the Y-axis scales
6. Below charts: 6 accordion sections (expandable/collapsible, collapsed by default)
   - Dark maroon bars with white text
   - Themes: Stakeholders, Service Delivery, Management & Governance, People & Culture, Financial Management, MAST PERFORMANCE FRAMEWORK REPORT
   - Content: placeholder text "Drill-down data table coming in Phase 2"
7. Footer: "© 2022 - Eric - Privacy"

DO NOT add: capabilities sections, maturity gauges, risk matrix scatter plots, or any features not described in 09_REPORT_STRUCTURE.md.

Use hardcoded data for now — we connect to the database in a later phase.
Put the file at `app/mast/reports/board/page.tsx`.
```

### Phase 2 — Drill-Down Tables (only after Phase 1 is reviewed)

```
Read `discovery/08_DATA_MODEL_ANALYSIS.md` for the full data hierarchy.
Read `reference/martin-originals/BDO Mast Custom Tree (1).xlsx` for the NODE structure.

Now build the drill-down table content for each of the 6 accordion sections in the Board Report.

Each section should expand to show a table with:
- Column headers: Variable | Current | Previous | Benchmark | Change
- Rows from the MAST data tree hierarchy (categories → groups → labels)
- Cell colour coding: Green (≥100), Yellow (95-99), Red (<95) based on 100 baseline
- Expandable sub-rows for business unit breakdown
- Use realistic placeholder data

For the "Stakeholders" theme, use these real variable groups:
- Recreational Boating (boating fleet age, geographic dispersion, moorings, derelict vessels)
- Safety & Compliance (compliance activity, outcomes, boating incidents, marine debris, public awareness)
- License Partner Compliance
- Navigation aids
- Stakeholder engagement (engagement, RTI & complaints, schools education)
- MAST Infrastructure

These come from the Custom Tree — each has specific Entry IDs and sub-variables.

Repeat the same pattern for the other 5 themes using groups from `08_DATA_MODEL_ANALYSIS.md`.
```

---

## Questions?

Ask in the #mast channel. Claudia (👩‍🍳) has the full data analysis and can answer any questions about chart specs, NODE hierarchy, or data structure.

**Key reference:** `discovery/09_REPORT_STRUCTURE.md` is your bible for this task. Everything in the report must match that document.

---

*Brief prepared by Claudia | Source: ERIC PDF analysis, Custom Tree analysis, Data Model Analysis*
