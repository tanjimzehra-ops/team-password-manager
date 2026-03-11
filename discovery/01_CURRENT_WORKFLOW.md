# 01 — MAST Current Workflow: How MAST Works Today

> **Source**: CPF Team Sessions, 4 March 2026 (Sessions 2 & 3) + Martin's ERIC methodology document
> **Status**: Partial — 11 information gaps remain (requires Martin's input)

---

## System Overview

MAST uses the **ERIC** (EricSFM.com) reporting platform — an algorithm-based risk reporting system built on Azure, managed by CPF. ERIC uses an Excel-based data tree architecture to connect data to a database, and generates reports through reporting data trees and algorithms.

MAST does **not** use the Logic Model, Contribution Map, Convergence Map, or Development Pathways that other ERIC/Jigsaw clients use (unlike CHC). Their usage is limited to risk reporting.

MAST has **no awareness that Jigsaw exists** — they interact exclusively with ERIC.

---

## Current Workflow (Known)

```
┌─────────────────────────────────────────────────────────────┐
│                    CURRENT MAST WORKFLOW                     │
│                                                             │
│  MAST Staff              CPF (Martin)           ERIC/Azure  │
│  ──────────              ─────────────           ──────────  │
│                                                             │
│  1. Fill individual      │                      │           │
│     input forms in ──────┼──────────────────────►│ Data      │
│     ERIC (small          │                      │ stored    │
│     Excel/variable       │                      │ in Azure  │
│     file)                │                      │           │
│                          │                      │           │
│  2. Email CPF to ────────►                      │           │
│     request report       │                      │           │
│                          │                      │           │
│                          3. Receive email        │           │
│                          4. Update variable ─────► Variable  │
│                             file                │ File      │
│                          5. Validate against ◄───┤ Data      │
│                             data trees          │ Trees     │
│                          6. Run report ◄─────────┤ Report    │
│                                                 │ generated │
│                          7. Send report ─────────►           │
│                             to MAST             │           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Step-by-Step

1. **Data Input**: MAST staff have individual input forms within ERIC. Each person fills their data (risk components) via a small Excel file (the "variable file").

2. **Report Request**: When data is submitted, MAST emails CPF to request report generation.

3. **CPF Processing**: Martin receives the email, updates the variable file, validates against the data trees, and runs the report.

4. **Report Delivery**: The generated report is returned to MAST.

### Data Flow

```
Variable File → Data Trees → Input Forms → Report
```

- The **variable file** contains the raw input data and formulas
- **Data trees** define the hierarchical connections between data elements
- **Input forms** present data entry interfaces to MAST staff
- The **report** aggregates and presents the data

---

## ERIC Report Structure (Known)

Based on Martin's ERIC methodology document and the ERIC 1.5 PRD:

### 4-Level Hierarchy

| Level | Content | Detail |
|-------|---------|--------|
| 1. Dashboard | Logic Model overview | Colour-coded composite indices for each element |
| 2. Themes | Management theme indices | Suite of 6 custom management themes (MAST-specific) |
| 3. Variables | Individual metrics | Previous period, current period, benchmark/target |
| 4. Drill-down | Business unit breakdown | Actual results and rate of change by business unit |

### Baseline = 100 System

- Previous period is always set to **100** (the baseline)
- Current period represents the **average rate of change** in contributing variables (+ve or -ve)
- Variables can be **weighted** to reflect relative importance
- The Logic Model reflects **change**, not absolute values

### Colour Coding

| Colour | Meaning | Threshold |
|--------|---------|-----------|
| Green | Improvement | >= 100 |
| Yellow | Slight decline | 95–99 |
| Red | Significant decline | < 95 |

### Management Themes (MAST Custom)

MAST uses **6 custom themes** (NOT the standard 5 ERIC themes):

1. **Stakeholders** — Stakeholder satisfaction, engagement metrics
2. **Service Delivery** — Service performance, incident metrics
3. **Management & Governance** — Governance, compliance, risk management
4. **People & Culture** — HR metrics, staff demographics, culture surveys
5. **Financial Management** — Revenue, expenditure, variance analysis
6. **MAST Performance Framework Report** — Overall composite indices

Each theme is a **composite variable** — previous period = 100, current period pivots around this.

### Alerts and Narratives

- Each report component includes an **explanatory note** (narrative to support interpretation)
- Where results exceed range parameters, narratives include **alerts and response suggestions**
- Alerts are experience-based and **hardwired** into the system

---

## Technical Architecture (Known)

| Component | Detail |
|-----------|--------|
| Platform | Azure |
| Domain | EricSFM.com |
| Data structure | Cell references (NOT labels) — labels appear only in graphs |
| Data storage | Excel-based data tree connected to Azure database |
| Report generation | Algorithm-based, using reporting data trees |
| Formulas | Excel formulas within variable files |

### Cell Reference Limitation

The current ERIC data structure uses **cell references rather than labels**. This is critical technical debt:
- Labels appear only in the graphs, not in the underlying data
- Any future AI integration will require a **semantic mapping layer** to interpret cell values
- Phase 1 decision: **keep cell references as-is** (no change)
- Phase 2: rebuild data layer with semantic labels before AI is applied

---

## Reference Organisations

Three example ERIC clients demonstrate the reporting structure:

| Client | Sector | Notes |
|--------|--------|-------|
| May Shaw | Aged care | Example report available |
| CatholicCare | Community support | Example report available |
| Jan 24 | Building trades | Example report available |

While structures vary between clients, they all follow the same logic flow (big picture → operational dimensions → drill-down).

---

## 11 Information Gaps (Requires Martin's Input)

These must be filled before the PRD can be written. See `04_MARTIN_QUESTIONNAIRE.md` for structured questions.

| # | Gap | Why It Matters |
|---|-----|----------------|
| 1 | Exact list of risks in the MAST register | Defines data model scope |
| 2 | How many input forms exist and who fills each | Determines user count and permission design |
| 3 | Variable file structure (fields, formulas, connections) | Core of the migration — must be mapped exactly |
| 4 | Data tree structure (hierarchy, connections between elements) | Determines database schema |
| 5 | Exact report format (need actual PDF) | Must replicate precisely in Phase 1 |
| 6 | Report frequency (monthly / quarterly / ad-hoc) | Affects scheduling features |
| 7 | Bill Batt's exact operational role at MAST | Defines administrator scope |
| 8 | What "authorise report generation" means in practice | Defines the authorisation workflow |
| 9 | Input data validation rules | Determines what validation logic to replicate |
| 10 | ERIC source code, DataTrees, user guide (Martin's local folders) | Foundation for technical migration |
| 11 | Whether ERIC Azure DB is separate from Jigsaw Azure DB | Critical architecture decision — different migration path if shared |

---

## Dependencies

```
Martin: MAST workflow document
  └── BLOCKS → Deep-dive session quality
  └── BLOCKS → Nicolas: MAST PRD

Pradeep: Azure formula validation
  └── BLOCKS → Architecture decision (Azure vs Supabase)

Martin: ERIC documentation sharing
  └── BLOCKS → Pradeep: data tree mapping
  └── BLOCKS → Full technical assessment
```
