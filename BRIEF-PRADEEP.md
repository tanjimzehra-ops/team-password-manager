# MAST/ERIC — Development Brief for Pradeep
**Date:** 11 March 2026 | **Project:** ERIC Self-Service for Marine & Safety Tasmania

---

## Context

We're building a self-service version of ERIC (algorithmic reporting system) for Marine & Safety Tasmania (MAST). 

**Current state:** MAST emails CPF → CPF manually updates variables → CPF runs report → sends back to MAST.

**Target state:** Bill Batt (MAST admin) logs in, enters data, and generates reports himself. No CPF intermediary needed.

**You don't need Azure DB access.** All structural data has been extracted from Martin's Excel files. Work locally first — we migrate to production DB later.

---

## Source Files (already in this repo)

| File | Location | What's in it |
|------|----------|-------------|
| Entry types, fields, formulas | `reference/martin-originals/BDO Data and Formulas (2).xlsx` | 11 data types, 7,458 entry fields, 2,415 formulas |
| Data tree hierarchy | `reference/martin-originals/BDO Mast Custom Tree (1).xlsx` | 6 categories → 18 groups → 87 labels, 287 Entry IDs |
| Risk domains | `reference/martin-originals/Copy of MAST Risk Domains.xlsx` | 19 domains + 5 assigned managers |
| Full data analysis | `discovery/08_DATA_MODEL_ANALYSIS.md` | Complete breakdown of all the above — **read this first** |
| ERIC User Manual | Workspace: `projects/mast/docs/ERIC-User-Manual.md` | How the existing system works (1,156 lines) |

---

## Tasks — Go In Order

### ✅ TASK 1 — Database Schema (Local)

Design and implement the ERIC data model in **PostgreSQL** (or SQLite for speed). This is the foundation.

**Key numbers:**
- 287 Entry IDs (range 491–3499)
- 11 entry types (percent, currency, integer, decimal, zero-to-ten, yes/no, etc.)
- 6 categories → 18 groups → 87 labels (hierarchical tree)
- 19 risk domains, 5 named managers
- 3 roles: Admin, Contributor, Viewer
- Reporting: every 6 months (bi-annual periods)

**Tables to create:**

| Table | Purpose | Key columns |
|-------|---------|-------------|
| `entry_types` | 11 data types | id, name, validation_rules |
| `categories` | 6 top-level categories | id, name, sort_order |
| `groups` | 18 groups | id, name, category_id (FK), sort_order |
| `labels` | 87 field labels | id, name, group_id (FK), sort_order |
| `entry_fields` | 7,458 data fields | id, entry_id (unique ERIC ID 491-3499), entry_type_id (FK), label_id (FK) |
| `risk_domains` | 19 risk domains | id, name, manager_name |
| `users` | System users | id, name, email, role |
| `roles` | 3 access levels | id, name (admin/contributor/viewer) |
| `reporting_periods` | Semesters | id, name, start_date, end_date, status |
| `data_entries` | Actual values | id, entry_field_id (FK), period_id (FK), value, entered_by (FK), entered_at |
| `audit_log` | Change tracking | id, table_name, record_id, field_changed, old_value, new_value, changed_by, changed_at |

**Deliverable:** 
- SQL migration script that creates all tables with proper FKs and indexes
- Seed script that populates: entry types (11), categories (6), groups (18), labels (87), risk domains (19), roles (3)
- Seed the entry_fields table with the 287 Entry IDs mapped to their types and labels

**Done when:**
- [ ] All tables created with foreign keys and constraints
- [ ] Seed data loaded (entry types, hierarchy, risk domains, roles)
- [ ] Entry IDs (491–3499) mapped to correct types and labels
- [ ] You can query: "show me all entry fields for the Financial Performance category" and get correct results

**⛔ DO NOT proceed to Task 2 until Task 1 is validated.**

---

### ✅ TASK 2 — Data Entry Form Prototype (after Task 1 is done)

Basic UI for a risk manager to enter data for their domain.

**What it does:**
1. User selects a **reporting period** (which semester)
2. User selects a **risk domain** (from the 19 domains)
3. Form dynamically shows **only the entry fields** belonging to that domain
4. Each field validates according to its **entry type**:
   - Percent → 0–100, 1 decimal
   - Currency → 2 decimals, no negatives
   - Integer → whole numbers only
   - Zero to Ten → 0–10 scale
   - Yes/No variants → mapped radio buttons or dropdowns
   - Decimal → 2 decimal places
5. User saves → data persists to `data_entries` table
6. Audit log captures who entered what and when

**Stack:** Next.js or React + the local DB from Task 1. Your choice.

**Deliverable:**
- Working page: domain selector → dynamic form → save to DB
- Basic validation feedback (red borders, error messages)
- No auth needed yet — just a name selector for "who's entering"

**Done when:**
- [ ] Can select a domain and see its fields rendered as a form
- [ ] Validation works per entry type (try entering "abc" in a currency field — should reject)
- [ ] Data saves to `data_entries` with correct field/period/user references
- [ ] Audit log records each save

---

### 🔴 TASK 3 — Formula Engine (DO NOT START — design pending)

ERIC has **2,415 formulas** with dependency chains and custom syntax. We're designing this separately before assigning it. 

**For your awareness only** (so you understand why the schema matters):
- Formulas reference Entry IDs: `{505}` means "value of entry 505"
- Formulas reference other formulas: `{F590}` means "result of formula 590"  
- Period references exist: `P(6,596)` means "entry 596 from 6 periods ago"
- Execution order matters: 17 levels of dependency (order 1 runs first, then 2, etc.)
- Functions include: `AVGZERO`, compound arithmetic, conditional logic

This is the most complex part of the system. We'll provide the design when it's ready.

---

## Use This Prompt in Cursor

### Phase 1 — Schema (start here)

```
Read the file `discovery/08_DATA_MODEL_ANALYSIS.md` completely. This is the full analysis of the ERIC data model for MAST (Marine & Safety Tasmania).

Then read the Excel files in `reference/martin-originals/`:
- `BDO Data and Formulas (2).xlsx` — entry types and field definitions
- `BDO Mast Custom Tree (1).xlsx` — category/group/label hierarchy  
- `Copy of MAST Risk Domains.xlsx` — risk domains and managers

Based on this data, create:

1. A PostgreSQL schema with these tables:
   - entry_types (11 types from the Excel)
   - categories (6 categories from Custom Tree)
   - groups (18 groups, FK to categories)
   - labels (87 labels, FK to groups)
   - entry_fields (mapping Entry IDs 491-3499 to their type and label)
   - risk_domains (19 domains with manager names)
   - roles (3: admin, contributor, viewer)
   - users (id, name, email, role_id)
   - reporting_periods (id, name, start_date, end_date, status)
   - data_entries (entry_field_id, period_id, value, entered_by, entered_at)
   - audit_log (table_name, record_id, field, old_value, new_value, user, timestamp)

2. A seed script that populates:
   - All 11 entry types with their names
   - All 6 categories, 18 groups, 87 labels with correct parent relationships
   - All 287 Entry IDs mapped to their type and label
   - All 19 risk domains with manager assignments
   - The 3 roles

Put the migration in `db/migrations/001_initial_schema.sql` and seed in `db/seeds/001_seed_structure.sql`.

Important: preserve the original Entry ID numbers (491-3499) — these are used by the formula engine later. Do NOT renumber them.
```

### Phase 2 — Data Entry UI (only after Phase 1 is validated)

```
We have a PostgreSQL database with the ERIC schema (see `db/migrations/` and `db/seeds/`).

Build a Next.js page at `/data-entry` that:

1. Has a dropdown to select a reporting period
2. Has a dropdown to select one of the 19 risk domains
3. When both are selected, queries the DB for all entry_fields that belong to that domain's labels/groups
4. Renders a dynamic form with one input per entry field
5. Each input validates based on the field's entry_type:
   - type 1 (Percent): number input, 0-100, 1 decimal
   - type 2 (Currency): number input, 2 decimals, no negatives  
   - type 3 (Decimal): number input, 2 decimals
   - type 4 (Integer): whole numbers only
   - type 5 (Decimal Zero to Ten): 0.0-10.0
   - type 6 (Zero to Ten): 0-10 integer
   - type 0 (One to Ten): 1-10 integer
   - types 7, 8, 10: radio buttons or select with the appropriate options
   - type 9 (Proceed): checkbox
6. Submit saves all values to data_entries table
7. Each save creates an audit_log entry

Use Tailwind for styling. Keep it simple and functional — no auth needed yet, just a name selector for who's entering data.

Read `discovery/08_DATA_MODEL_ANALYSIS.md` for the full data type definitions and field structure.
```

---

## Questions?

Ask in the #mast channel. Claudia (👩‍🍳) has the full data analysis and can answer any questions about the data model, entry types, or hierarchy structure.

---

*Brief prepared by Claudia | Source: Martin's Excel files + ERIC Technical Manual + Discovery Analysis*
