# ERIC Technical Brief

> **Status**: Draft v1.0  
> **Date**: 3 March 2026  
> **Prepared for**: MAST Migration Project  
> **Author**: Research Sub-agent  

---

## Executive Summary

ERIC (Enterprise Reporting Intelligence Connectivity) is an algorithm-based risk reporting system built on Microsoft Azure. It was originally designed by Martin Farley and Josh Geelan with IT expertise from Caedus Systems (circa 2019-2020). The system uses Excel-based data trees to define database structures, connect data to a central database, and generate reports through algorithm-driven reporting trees.

MAST (Marine and Safety Tasmania) currently uses ERIC for risk reporting. MAST staff fill individual input forms within ERIC (via small Excel variable files), then email CPF to request report generation. CPF (Martin) acts as intermediary — receiving the request, updating variable files, validating against data trees, and running the report.

The Phase 1 goal is to eliminate CPF as intermediary and give MAST full autonomy: self-service data input, risk register management, and report generation.

### MAST Data Model at a Glance

| Component | Count |
|-----------|-------|
| **Custom Tree Rows** | 92 |
| **Unique Entry IDs** | 287 (range: 491-3499) |
| **Total Formulas** | 2,415 |
| **Data Entry Fields** | 7,458 |
| **Risk Domains** | 19 |
| **Named Managers** | 5+ (Bill Batt, Lia Morris, Justin Foster, Peter Hopkins, Toby Greenlees) |
| **Report Themes** | 6 (custom) |
| **Report Frequency** | Every 6 months |

---

## 1. Technical Architecture

### 1.1 Core Platform

| Component | Technology | Notes |
|-----------|------------|-------|
| **Hosting** | Microsoft Azure | Currently hosted on Azure; potential migration target identified |
| **Domain** | EricSFM.com | Shared domain across all ERIC clients |
| **Authentication** | Azure AD B2C | Dedicated tenant for ERIC; supports Microsoft and Xero login |
| **Database** | Azure SQL PaaS | Transactional client data storage |
| **File Storage** | Azure Blob Container | File-based client data and document management |
| **CDN/Load Balancer** | Azure Front Door + WAF | Internet publication layer |
| **Email** | Azure SendGrid | Email alerts and notifications |
| **Monitoring** | Azure Application Insights, Log Analytics | Application and security monitoring |
| **Source Control** | Azure DevOps | Repository and CI/CD |

### 1.2 System Components

```
┌─────────────────────────────────────────────────────────────────┐
│                        ERIC ARCHITECTURE                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐     ┌──────────────┐     ┌──────────────┐     │
│  │   Data Tree  │────▶│    Azure     │────▶│    Report    │     │
│  │   (Excel)    │     │   Database   │     │   Engine     │     │
│  └──────────────┘     └──────────────┘     └──────────────┘     │
│         │                    │                    │              │
│         ▼                    ▼                    ▼              │
│  ┌──────────────┐     ┌──────────────┐     ┌──────────────┐     │
│  │  Input Forms │     │  Validations │     │  PDF/Excel   │     │
│  │  (Web UI)    │     │  & Alerts    │     │   Output     │     │
│  └──────────────┘     └──────────────┘     └──────────────┘     │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │              Data & Formulas File (Excel)                │    │
│  │     Entry IDs • Formulas • Validation Rules • Types      │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 1.3 Data Flow

```
Variable File (Excel) 
    ↓
Data Trees (Hierarchical structure: Category → Group → Label → Subgroup)
    ↓
Input Forms (Web interface for data entry)
    ↓
Azure SQL Database (Transactional storage)
    ↓
Report Generation (Algorithm-driven)
    ↓
Report Output (PDF/Excel with charts, tables, drill-downs)
```

---

## 2. Data Structure

### 2.1 Data Tree Architecture

Data trees are Excel files with multiple tabs that define the entire data structure, entry UI, and reporting configuration.

**Required Tabs:**

| Tab Name | Purpose |
|----------|---------|
| `TREExxxx` | Core data tree structure and report definitions |
| `<name> Report` | Custom report structure and ordering |
| `<name> Settings` | Configuration (frequency, labels, features) |
| `<name> Hide` | Hide/show logic for conditional fields |
| `<name> HideValues` | Default values for hidden fields |
| `Alerts` | Email alert triggers and recipients |

#### Data Tree Tab Structure (TREExxxx)

```
Column Structure:
├── Category        (top-level grouping)
├── Group           (sub-grouping)
├── Label           (field description)
├── Subgroup1EntryID (unique entry identifier)
├── Subgroup1Label  (sub-label)
├── Subgroup2EntryID
├── Subgroup2Label
└── ... (additional subgroups as needed)
```

**Key Rules:**
- Every label/sublabel MUST have a nominated EntryID
- Every EntryID must be unique (cannot be reused)
- Column headings must be exact: Category, Group, Label, Subgroup1EntryID, Subgroup1Label, etc.

### 2.2 Entry IDs and Data Types

Each data entry field has a unique Entry ID and an assigned data type:

| ID | Type | Description |
|----|------|-------------|
| 0 | One to Ten | Scale 1-10 |
| 1 | Percent | Percentage value |
| 2 | Currency | Monetary value |
| 3 | Decimal Number | Floating point |
| 4 | Integer Number | Whole number |
| 5 | Decimal Zero To Ten | Scale 0-10 |
| 6 | Zero To Ten | Integer scale 0-10 |
| 7 | Yes/NotYet/NM/NR | 9/5/2/1 scoring |
| 8 | Yes/No/Not Yet | 9/1/5 scoring |
| 9 | Proceed | Binary proceed |
| 10 | Agree/Disagree | 9/1/5 scoring |
| 11 | Integer Percent | Whole percentage |
| 12 | Intelligence Gathering → Direct Provision | Scale 9-2 |
| 13 | Support/Audit/Decline | 9/8/1 scoring |

### 2.3 Variable File

The variable file is a small Excel file containing:

- **Input data**: Raw values entered by users
- **Formulas**: Excel formulas that calculate derived values
- **Connections**: References to data tree Entry IDs
- **Period data**: Previous period, current period, targets

**Critical Characteristic**: Variable files use **cell references** rather than semantic labels. This is documented technical debt that blocks AI integration.

### 2.4 Formulas

Formulas are defined in the separate "Data and Formulas" file with:

| Attribute | Description |
|-----------|-------------|
| Formula ID | Unique identifier (e.g., F400) |
| Name | Human-readable name |
| Formula | Calculation expression |
| Calculation Order | Execution sequence (1, 2, 3...) |
| Display Type | Output formatting |

**Formula Syntax:**
- `{400}` = Entry ID 400
- `{F400}` = Formula 400
- `{P400}` = Entry ID 400 from previous period
- `{PF400}` = Formula 400 from previous period
- `{280:290}` = Range of Entry IDs 280-290
- Functions: `+`, `-`, `/`, `*`, `SUM`, `IF`, `AVGZERO`, `AVERAGE`, `COALESCE`

**Calculation Order**: All formulas must have a calculation order specified. Compound formulas that reference other formulas must have higher order numbers than their inputs.

### 2.5 Management Themes (MAST-Specific)

> **Correction**: MAST uses **6 custom themes** (NOT the standard 5 ERIC themes).

The Custom Tree analysis reveals MAST's report structure uses these 6 themes:

| # | Theme | Description |
|---|-------|-------------|
| 1 | **Stakeholders** | Stakeholder satisfaction, engagement metrics, survey results |
| 2 | **Service Delivery** | Service performance, incident metrics, compliance |
| 3 | **Management & Governance** | Governance, risk management, strategic oversight |
| 4 | **People & Culture** | HR metrics, staff demographics, culture surveys, workforce planning |
| 5 | **Financial Management** | Revenue, expenditure, variance analysis, fiscal management |
| 6 | **MAST Performance Framework Report** | Overall composite indices, performance dashboard |

This differs from the standard ERIC 5-theme structure. The "Clients" theme has been replaced with "Stakeholders" (more appropriate for MAST's maritime safety context), and a dedicated "MAST Performance Framework Report" theme has been added for executive reporting.

### 2.6 Report Frequency

**Confirmed**: Reports are generated **every 6 months** (bi-annually).

This was confirmed verbally by Martin during the week of 2 March 2026.

### 2.7 Report Types

Reports are defined in the data tree tab with specific prefixes:

| Prefix | Type | Description |
|--------|------|-------------|
| `LC:` | Line Chart | Time-series visualization |
| `BC:` | Bar Chart | Comparative visualization (past/current/benchmark) |
| `DDR:` | Drill Down Report | Cascading tables (max 3 fields across) |
| `RT:` | Report Table | Exportable data tables |
| `Comments:` | Commentary | Text/narrative in report tables only |

**Report Table Display Formats:**
- `D(x,y)` = Entry ID x, Display format y
- `F(x,y)` = Formula ID x, Display format y
- `C(x)` = Comment attached to Entry ID x

---

## 3. MAST-Specific Data Model Statistics

From analysis of `BDO Mast Custom Tree (1).xlsx`, `BDO Data and Formulas (2).xlsx`, and `Copy of MAST Risk Domains.xlsx`:

### 3.1 Data Volume

| Component | Count | Notes |
|-----------|-------|-------|
| Custom Tree Rows | 92 | Complete hierarchy rows |
| Total Entry IDs in Tree | 287 | IDs referenced in tree structure |
| Entry ID Range | 491 - 3,499 | Actual range in use |
| Registered Entry Fields | 7,458 | All possible entry fields |
| Total Formulas | 2,415 | Calculation formulas |
| Formula ID Range | 1 - 2,442 | With gaps |
| Entry Types | 11 | Data type definitions |
| Risk Domains | 19 | MAST risk categories |

### 3.2 Data Tree Categories

The 92 tree rows are organised into **6 categories**:

1. **Financial Performance** — Revenue, grants, fiscal management, opportunity & risk, solvency
2. **Human Resources** — Staff numbers, capacity, people & culture, payroll costs
3. **Stakeholders** — Stakeholder engagement, demographics
4. **Survey Results - Staff** — Internal staff survey metrics
5. **Survey Results – Stakeholders** — External stakeholder survey metrics
6. **Targets** — Performance targets and benchmarks

These break down into **18 groups** with **87 unique labels**.

### 3.3 Departments Tracked

Based on Entry ID labels in the Custom Tree:

- Board
- Senior Mngt/Executive
- Administrative
- Recreational Boating
- Commercial Boating
- Infrastructure
- Education
- Other
- Corporate/Admin
- Facilities
- Moorings
- Ports & Pilotage

### 3.4 Risk Domains and Managers

**19 Risk Domains** managed by **5+ named managers**:

| Manager | Domains |
|---------|---------|
| **Bill Batt** | Business continuity, Business Systems, Finance, Information Management, HR (shared) |
| **Lia Morris** | Corporate Governance, Legislative compliance, Professional conduct, Service delivery, WHS, Public Safety (shared), HR (shared) |
| **Justin Foster** | Asset Management, Public Safety (shared) |
| **Peter Hopkins** | Boating fleet (shared), Stakeholder Engagement (shared), Experimential craft (shared) |
| **Toby Greenlees** | Autonomous technology & AI, Boating fleet (shared), Experimential craft (shared), Stakeholder Engagement (shared) |

**Collective "All Managers"**: Compliance monitoring, Contract Management, Environment (3 domains)

---

## 4. Azure Infrastructure Details

### 3.1 Current Azure Components

ERIC is built on five core Azure components:

1. **Identity and Authentication**
   - Azure AD B2C Tenant (dedicated for ERIC)
   - Supports Microsoft and Xero login
   - Migration: Can be migrated to different Azure Tenant

2. **Containerized Web App**
   - Azure Web App Service (HTTPS endpoint)
   - Migration: Can be redeployed from DevOps to different tenant

3. **SQL Database**
   - Azure SQL PaaS Database
   - Hosts transactional client data
   - Migration: Can be backed up and restored to different tenant

4. **Cloud File Storage**
   - Azure Blob Container
   - Hosts file-based client data
   - Migration: Can be migrated to different tenant

5. **CDN and Load Balancer**
   - Azure Front Door + Web Application Firewall
   - Migration: Can be migrated to different tenant

### 3.2 Ancillary Services

| Service | Azure Component | Migration Path |
|---------|-----------------|----------------|
| Email | Azure SendGrid | Rebuild manually |
| Backup | Azure Blob + SQL Backup Service | Rebuild manually |
| Monitoring | Application Insights, Log Analytics | Rebuild manually |
| DNS | DNS Made Easy (external) | Migrate to different host |
| Security | Defender ATP, Security Monitor, Key Vault | Rebuild manually |
| DevOps | Azure DevOps Project | Migrate to different tenant |

### 3.3 Hosting Costs

Current hosting cost: **$2,420 AUD/month** (including GST), invoiced monthly from Caedus Systems.

### 3.4 Migration Complexity

Per the technical documentation: *"Migration to a different hosting platform will require a hybrid approach of migrating some services and rebuilding others. There will be downtime during this migration (e.g., a weekend of outage)."*

---

## 5. Current Workflow

### 4.1 Current State (MAST)

```
┌─────────────────────────────────────────────────────────────────┐
│                    CURRENT MAST WORKFLOW                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  MAST Staff              CPF (Martin)              ERIC/Azure   │
│  ───────────             ─────────────             ───────────  │
│                                                                  │
│  1. Fill individual      │                          │           │
│     input forms in ──────┼─────────────────────────▶│ Data      │
│     ERIC (small          │                          │ stored    │
│     Excel/variable       │                          │ in Azure  │
│     file)                │                          │           │
│                          │                          │           │
│  2. Email CPF to ────────▶                          │           │
│     request report       │                          │           │
│                          │                          │           │
│                          3. Receive email            │           │
│                          4. Update variable ────────▶│ Variable  │
│                             file                     │ File      │
│                          5. Validate against ◀───────│ Data      │
│                             data trees               │ Trees     │
│                          6. Run report ◀─────────────│ Report    │
│                                                      │ generated │
│                          7. Send report ─────────────▶           │
│                             to MAST                  │           │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 4.2 Step-by-Step Process

1. **Data Input**: MAST staff fill individual input forms within ERIC using small Excel variable files
2. **Report Request**: MAST emails CPF to request report generation
3. **CPF Processing**: Martin receives email, updates variable file, validates against data trees
4. **Report Generation**: Run report through ERIC algorithms
5. **Delivery**: Generated report returned to MAST

### 4.3 Stakeholder Roles

| Role | Current Responsibility |
|------|------------------------|
| MAST Staff | Fill input forms; email CPF for reports |
| Bill Batt | Liaise with CPF (proposed as Phase 1 administrator) |
| CPF (Martin) | Update variables; validate; run reports; manage risk register |
| Board Members | Receive reports via email from CPF |

---

## 6. Known Technical Issues and Debt

### 5.1 Critical: Cell References vs Labels

**Issue**: The current ERIC data structure uses **cell references rather than semantic labels**. Labels appear only in graphs, not in underlying data.

**Impact**:
- Any future AI integration requires a **semantic mapping layer**
- Data has no inherent meaning without the Excel context
- Cannot directly apply AI/ML to raw data

**Decision**: Keep cell references as-is for Phase 1. Rebuild with semantic labels in Phase 2 before AI integration.

### 5.2 AI Integration Challenge

Martin explicitly flagged: *"AI integration will require rebuilding the data layer with semantic labels before AI can be applied."*

**Phase 1**: No AI integration. Maintain current structure.
**Phase 2**: Rebuild data layer, then add AI-generated narratives and insights.

### 5.3 Azure Database Separation (Unresolved)

**Critical Question**: Is the MAST/ERIC Azure database separate from the Jigsaw Azure database?

Nicolas's understanding: Existing Azure DB export covers Jigsaw, not ERIC.
Martin's confirmation: This needs investigation.

**Blocker**: This gates the entire migration strategy. If databases are shared, migration approach changes completely.

**Action**: Pradeep to validate via T1 investigation (see Section 8).

### 5.4 Formula Export Integrity (Unvalidated)

**Question**: Can all ERIC formulas and calculations be exported from Azure without data loss?

**Risk**: If formulas cannot be cleanly exported, the migration approach must be reconsidered.

**Action**: Pradeep to validate via T2 investigation.

### 5.5 Documentation Fragmentation

**Issue**: ERIC documentation is fragmented:
- Source code on Martin's local machine
- DataTrees folders on Martin's local machine  
- User guide previously sent to team but not centralised
- No shared team access to full documentation

**Action Required**: Martin to share ERIC folders via shared drive (Action Item from Session 3).

---

## 7. Martin's Recent Communications (March 2026)

### 6.1 Key Messages from Team Sessions (3-4 March 2026)

**From March 4, 2026 Session 1 (Morning):**

1. **MAST Scope**: Phase 1 is "existing report working autonomously" — no redesign, replicate current report exactly.

2. **Bill Batt Role**: Bill Batt is the proposed administrator who will manage risk register and authorise report generation.

3. **User Management**: Must be implemented from the start of MAST build, not retrofitted at the end (lesson from Jigsaw).

4. **Database Investigation**: Martin confirmed that whether the existing Azure DB covers ERIC needs investigation — Nicolas's understanding is it covers Jigsaw only.

**From March 4, 2026 Session 2 (Deep Dive):**

1. **Workflow Document**: Martin to produce written step-by-step workflow document before dedicated MAST session.

2. **ERIC Documentation**: Martin holds ERIC folders (source code, DataTrees, user guide) — too large to email, will share via shared drive.

3. **Timeline**: MAST deadline ~13 March for analysis/action plan; actual production deployment timeline separate.

4. **Azure Access**: Tanjim and Pradeep already have access to MAST database (confirmed at 53:03 in session).

5. **Domain**: MAST will get own domain (not EricSFM.com, not Jigsaw domain).

**From March 4, 2026 Session 3 (Team AM-3):**

1. **MAST Analysis**: Martin to lead MAST analysis with Pradeep/Tanjim support; deadline ~13 March.

2. **ERIC Documentation Sharing**: Martin to compile and share via shared drive ASAP.

3. **Azure Database Export**: Nicolas stated understanding that existing Azure DB covers Jigsaw, not ERIC — needs separate ERIC export.

### 6.2 Martin's Commitments

| Commitment | Deadline | Status |
|------------|----------|--------|
| Written MAST workflow document | Before dedicated MAST session | Pending |
| Share ERIC documentation folders | ASAP / before next MAST session | Pending |
| Produce MAST analysis | ~13 March 2026 | In Progress |
| Set up shared drive | This week | Pending |

---

## 8. Phase 1 Requirements for MAST Autonomy

### 7.1 Core Objective

Eliminate CPF as intermediary. MAST manages their own risk data input, risk register maintenance, and report generation — fully autonomous.

### 7.2 Three-Tier Permission Model

#### Tier 1: Administrator (Bill Batt)

| Permission | Description |
|------------|-------------|
| Manage risk register | Add, remove, modify risks |
| Manage variable file | Update variable configurations and weights |
| Authorise report generation | Review data and trigger report creation |
| Manage users | Add/remove data contributors and board members |
| View all data | Full visibility across all input data |
| Configure settings | System-level configuration |

#### Tier 2: Data Contributors (MAST Staff)

| Permission | Description |
|------------|-------------|
| Input own data | Fill assigned input forms only |
| View own submissions | See history of own data entries |
| Cannot view others' data | Restricted to own scope |
| Cannot generate reports | No report generation access |
| Cannot modify risk register | No risk management access |

#### Tier 3: Board Members (Read-Only)

| Permission | Description |
|------------|-------------|
| View generated reports | Access to finalised reports only |
| Download reports | Export/print capabilities |
| No data input | Cannot modify any data |
| No system access | Cannot access administration or data entry |

### 7.3 Functional Requirements

| Feature | Requirement |
|---------|-------------|
| **Authentication** | Secure login with role-based access |
| **Data Input** | Web forms replacing Excel variable files |
| **Risk Management** | Self-service risk register (add/remove/modify) |
| **Report Generation** | Admin-triggered report generation (no CPF) |
| **Report Access** | Board members access reports via portal |
| **Hosting** | Australian servers (government requirement) |
| **Domain** | MAST-branded domain (not EricSFM.com) |
| **Report Format** | Exact replication of current ERIC output |

### 7.4 Non-Functional Requirements

| Requirement | Detail |
|-------------|--------|
| Data Sovereignty | All data on Australian servers |
| Availability | Web-accessible from any device |
| Security | Role-based access control |
| Audit Trail | Data changes tracked |

### 7.5 Constraints (Phase 1)

1. **No report redesign** — exact same report format
2. **No AI integration** — cell references remain as-is
3. **No Logic Model** — MAST does not use it
4. **No Contribution/Convergence Maps** — not in MAST workflow
5. **Same calculation engine** — baseline=100, weighted indices, alerts

---

## 9. Migration Path to Supabase

### 8.1 Rationale for Migration

| Factor | Azure Current | Supabase AU Target |
|--------|---------------|-------------------|
| Hosting Region | Unknown | Sydney, Australia (government compliant) |
| Cost | $2,420/month | To be assessed (T5) |
| Modern API | Limited | Full REST/GraphQL + Realtime |
| Authentication | Azure AD B2C | Built-in Auth + RLS |
| Team Familiarity | Limited | High (Jigsaw team uses Supabase) |

### 8.2 Migration Path Options

#### Option 1: Keep Azure
- **Pros**: No migration needed; known system
- **Cons**: Cost; Australian hosting unclear; government compliance risk

#### Option 2: Supabase AU
- **Pros**: Australian hosting; modern API; realtime; auth built-in; team familiarity
- **Cons**: Migration effort; formula integrity risk

#### Option 3: Hybrid
- **Pros**: Gradual migration; lower risk
- **Cons**: Complexity; two systems to maintain

**Status**: Blocked pending Pradeep's Azure validation (T1–T3).

### 8.3 Technical Investigations Required

| Investigation | Deliverable | Owner | Status |
|---------------|-------------|-------|--------|
| **T1**: Azure DB separation | Written confirmation: ERIC uses [X], Jigsaw uses [Y], they are [same/separate] | Pradeep | Pending |
| **T2**: Formula export integrity | Integrity assessment: "X of Y formulas export cleanly; N issues: [list]" | Pradeep | Pending |
| **T3**: Variable file mapping | Schema diagram showing all fields, types, formulas, connections | Pradeep | Blocked (needs Martin's docs) |
| **T4**: Data tree mapping | Data flow diagram: input → data trees → report | Pradeep | Blocked (needs Martin's docs) |
| **T5**: Supabase AU pricing/compliance | Cost comparison: Azure vs Supabase AU with compliance notes | Pradeep | Pending |
| **T6**: Cell-reference preservation | Test results: "Cell references [are/are not] preserved after migration" | Pradeep | Blocked (needs T1, T3) |

### 8.4 Migration Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Formula export failure | Medium | Critical | Complete T2 before architecture decision |
| Cell reference breakage | Medium | High | Complete T6 testing before production |
| Azure/Jigsaw DB shared | Unknown | Critical | Complete T1 immediately |
| Documentation not shared | High | High | Escalate to Martin; use screen-share if needed |

---

## 10. Prior Analysis and Recommendations

### 9.1 From Discovery Documents

**Technical Debt Register** (from `03_TECHNICAL_STACK.md`):

| Item | Impact | Phase |
|------|--------|-------|
| Cell references instead of labels | Blocks AI integration; no semantic meaning | Phase 2 |
| ERIC documentation not centralised | Knowledge only on Martin's machine | Resolve ASAP |
| Azure DB separation unknown | Could change entire migration approach | Resolve in investigation |
| No existing user management | Must build from scratch — do not retrofit | Phase 1 (first module) |

**Timeline Reality Check**:
- Target MAST deadline: ~13 March 2026
- Working days from 3 March: ~9 days
- **Achievable by 13 March**: Brief + PRD + architecture plan
- **Unlikely by 13 March**: Production deployment

### 9.2 From Team Session Analysis

**Critical Strategic Finding**:
> *"MAST immediate brief is 'existing report working autonomously' — The primary goal for MAST is to enable the client to manage the system autonomously: update risks, enter data, and run reports without going through CPF. This is the scope for the first build."*

**Architecture Decision**:
> *"Keep existing MAST report format for now — The current report design will be preserved for the initial migration. A Jigsaw-style redesign will be offered to the client at a later date as an upgrade path."*

**Methodology Decision**:
> *"BMAD methodology applied to MAST — Brief → PRD → Architecture → Epics/Sprints → Production. The PRD is the most critical document; every detail must be explicit before architecture begins."*

### 9.3 Open Decisions (from `03_TECHNICAL_STACK.md`)

| # | Decision | Status | Blocker |
|---|----------|--------|---------|
| 1 | Database: Azure vs Supabase AU | Blocked | Pradeep's T1–T3 |
| 2 | Standalone vs Jigsaw 1.6 tenant | Open | Deep-dive discussion |
| 3 | Frontend framework | Likely React | — |
| 4 | Authentication | Open | Decisions 1 & 2 |
| 5 | Cell references | **Decided**: Keep Phase 1 | — |
| 6 | Report generation | Open | Report format confirmation |
| 7 | Domain | Open | Martin's input |

---

## 11. Information Gaps (Requires Martin's Input)

Per `01_CURRENT_WORKFLOW.md` and `04_MARTIN_QUESTIONNAIRE.md`:

| # | Gap | Why It Matters |
|---|-----|----------------|
| 1 | Exact list of risks in MAST register | Defines data model scope |
| 2 | How many input forms and who fills each | Determines user count and permission design |
| 3 | Variable file structure (fields, formulas, connections) | Core of migration — must map exactly |
| 4 | Data tree structure (hierarchy, connections) | Determines database schema |
| 5 | Exact report format (need actual PDF) | Must replicate precisely in Phase 1 |
| 6 | Report frequency (monthly/quarterly/ad-hoc) | Affects scheduling features |
| 7 | Bill Batt's exact operational role | Defines administrator scope |
| 8 | What "authorise report generation" means in practice | Defines authorisation workflow |
| 9 | Input data validation rules | Determines validation logic to replicate |
| 10 | ERIC source code, DataTrees, user guide | Foundation for technical migration |
| 11 | Whether ERIC Azure DB is separate from Jigsaw | Critical architecture decision |

---

## 12. Next Steps

### Immediate (This Week)

1. **Martin**: Share ERIC documentation folders via shared drive
2. **Martin**: Complete MAST workflow document
3. **Pradeep**: Complete T1 (Azure DB separation validation)
4. **Pradeep**: Complete T2 (formula export integrity)
5. **Nicolas**: Schedule dedicated MAST deep-dive session

### Before Architecture Decision

1. Review all T1–T6 investigation results
2. Make database decision (Azure vs Supabase AU)
3. Decide standalone vs Jigsaw tenant
4. Confirm authentication approach
5. Validate report format with Martin

### Before Build

1. Write complete MAST brief (BMAD methodology)
2. Write PRD with all formulas, UI, and workflow details
3. Complete architecture design
4. Define epics and sprints

---

## Sources

1. `/Jigsaw_2.0_dev/OBS_notes/Jigsaw20/clients/mast/discovery/01_CURRENT_WORKFLOW.md`
2. `/Jigsaw_2.0_dev/OBS_notes/Jigsaw20/clients/mast/discovery/02_TARGET_WORKFLOW.md`
3. `/Jigsaw_2.0_dev/OBS_notes/Jigsaw20/clients/mast/discovery/03_TECHNICAL_STACK.md`
4. `/Jigsaw_2.0_dev/OBS_notes/Jigsaw20/clients/mast/discovery/04_MARTIN_QUESTIONNAIRE.md`
5. `/Jigsaw_2.0_dev/OBS_notes/Jigsaw20/clients/mast/discovery/05_PRADEEP_TECH_INVESTIGATION.md`
6. `/Jigsaw_2.0_dev/OBS_notes/Jigsaw20/clients/mast/discovery/06_DEEP_DIVE_AGENDA.md`
7. `/Jigsaw_2.0_dev/OBS_notes/Jigsaw20/clients/mast/_case/CASE_OVERVIEW.md`
8. `/Jigsaw_2.0_dev/OBS_notes/Jigsaw20/clients/mast/_case/CASE_STATUS.yaml`
9. `/Jigsaw_2.0_dev/OBS_notes/Jigsaw20/clients/mast/reference/ERIC_DOCUMENTATION_INDEX.md`
10. `/CHC/reference/eric/ERIC-User-Manual.md`
11. `/CHC/reference/mast/MAST-Dynamic-Risk-Management.md`
12. `/Jigsaw_2.0_dev/OBS_notes/Jigsaw20/team-sessions-march-2026/03-04/2026-03-04-CPF-team-am-1/ENHANCED.md`
13. `/Jigsaw_2.0_dev/OBS_notes/Jigsaw20/team-sessions-march-2026/03-04/2026-03-04-CPF-team-am-2/ENHANCED.md`
14. `/Jigsaw_2.0_dev/OBS_notes/Jigsaw20/team-sessions-march-2026/03-04/2026-03-04-CPF-team-am-3/ENHANCED.md`

---

*Document compiled: 3 March 2026*
*Version: 1.0*
