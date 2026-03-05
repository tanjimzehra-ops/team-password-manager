# MAST Phase 1 — Product Requirements Document

> **Version**: 1.0
> **Date**: 5 March 2026
> **Deadline**: 13 March 2026 (final PRD)
> **Author**: PM-MAST (Claudia)
> **Methodology**: BMAD v6
> **Status**: Draft for stakeholder review

---

## 1. Executive Summary

### 1.1 Vision

MAST (Marine and Safety Tasmania) operates ERIC (Enterprise Reporting Intelligence Connectivity), an algorithm-based risk reporting system hosted on Microsoft Azure. ERIC processes 19 risk domains across 6 custom management themes, using 2,415 formulas and 7,458 entry fields to generate biannual risk reports for the MAST board and executive team.

Currently, all ERIC operations depend on CPF (Creating Preferred Futures / Martin Farley) as intermediary. MAST staff fill input forms, email CPF, and wait 24–48 hours for Martin to update variables, validate data, and generate reports. This creates a single-point-of-failure, delays reporting cycles, and prevents MAST from operating autonomously.

### 1.2 Phase 1 Goal

Eliminate CPF as intermediary. Give Bill Batt (MAST administrator) full autonomous control over data input, risk register management, and report generation. Migrate hosting from Azure ($2,420 AUD/month) to Supabase Sydney for AU data residency compliance and cost reduction.

### 1.3 Target Users

| Persona | Count | Phase 1 Role |
|---------|-------|--------------|
| Bill Batt (Admin) | 1 | Manages risk register, authorises report generation, manages users |
| MAST Risk Managers | 5 | Enter data for assigned risk domains |
| Board/Executive Members | ~10 | View and download generated reports |

### 1.4 Differentiator

Phase 1 delivers operational autonomy without system redesign. The existing ERIC calculation engine, formula library (2,415 formulas), and report format are preserved exactly. The change is workflow, not functionality: self-service replaces email-to-CPF dependency.

---

## 2. Success Criteria

All criteria are SMART: Specific, Measurable, Attainable, Relevant, Traceable.

| ID | Criterion | Target | Measurement Method | Timeline |
|----|-----------|--------|--------------------|----------|
| SC-01 | CPF intermediary emails per reporting cycle | 0 | Email audit (MAST inbox) | First reporting cycle post go-live |
| SC-02 | Time from data input completion to report generation | < 30 minutes | System log timestamps | Go-live + 1 cycle |
| SC-03 | Bill Batt generates report independently | Pass/Fail | Acceptance test: Bill triggers report without CPF assistance | Go-live |
| SC-04 | Report output matches CPF-generated baseline | 100% formula accuracy across all 2,415 formulas | Parallel run: both CPF and Bill generate same-period report, compare outputs cell-by-cell | Parallel run period (7–18 Apr) |
| SC-05 | All data remains in AU jurisdiction | 100% of compute, storage, and auth in Australian datacentres | Infrastructure audit (Supabase Sydney region verification) | Pre go-live |
| SC-06 | System downtime during migration | < 8 hours total | Deployment log with timestamps | Migration weekend |
| SC-07 | All 5 risk managers can enter data for their assigned domains | 5 of 5 managers complete data entry independently | Acceptance test per manager | Go-live + 2 weeks |
| SC-08 | Monthly hosting cost reduction | < $1,500 AUD/month (vs current $2,420) | Supabase invoice comparison | Go-live + 1 month |

---

## 3. Product Scope

### 3.1 Phase 1 — Autonomous Admin (This Build)

**Objective**: MAST operates ERIC independently. No CPF involvement in day-to-day reporting.

| ID | Capability | Priority | Traces To |
|----|-----------|----------|-----------|
| P1-01 | Admin role (Bill Batt) with full system permissions | P0 | SC-03 |
| P1-02 | Variable management UI replacing email-to-CPF workflow | P0 | SC-01, SC-02 |
| P1-03 | Data validation on input (type checking, range, required fields, formula dependencies) | P0 | SC-04 |
| P1-04 | Self-service report generation trigger for admin | P0 | SC-02, SC-03 |
| P1-05 | Report output in identical format to current ERIC (PDF/Excel) | P0 | SC-04 |
| P1-06 | Three-tier RBAC: Admin, Data Contributor, Board Member | P0 | SC-07 |
| P1-07 | Supabase Sydney migration (AU data residency) | P0 | SC-05, SC-08 |
| P1-08 | MAST-branded domain (not EricSFM.com) | P0 | — |
| P1-09 | Audit trail for all data changes (who, what, when) | P1 | GovTech compliance |
| P1-10 | Rollback capability (undo last variable update) | P1 | SC-04 |
| P1-11 | Email notifications on report generation | P2 | — |
| P1-12 | CSV data upload for admin bulk entry | P2 | — |

### 3.2 Phase 2 — Semantic Data Layer (Future)

| Capability | Rationale |
|-----------|-----------|
| Label-based data addressing (replace cell references) | Prerequisite for AI integration; current cell-reference system has no semantic meaning |
| AI-generated report narratives | Requires semantic mapping layer from Phase 2 |
| Jigsaw-style report redesign | Offered as upgrade path; Phase 1 preserves current format |
| Multi-client ERIC improvements | MAST-specific scope only in Phase 1 |

### 3.3 Phase 3 — Platform Evolution (Future)

| Capability | Rationale |
|-----------|-----------|
| Logic Model dashboard integration | MAST does not use Logic Model currently |
| Contribution/Convergence Map integration | Not in MAST workflow |
| Xero API financial data integration | Optional enrichment, not Phase 1 scope |
| Mobile-optimised UI | Desktop-first for admin workflows |

---

## 4. User Journeys

### 4.1 UJ-01: Bill Batt Updates Risk Register Variables

**Precondition**: Bill has admin credentials; reporting period is open.

```
1. Bill opens MAST ERIC portal (MAST-branded domain)
2. Bill authenticates via Supabase Auth (email + MFA)
3. System displays admin dashboard with status overview:
   - Current reporting period (e.g., "Jul–Dec 2025")
   - Data entry completion: X of 287 Entry IDs populated
   - Per-manager completion status (5 managers)
4. Bill selects "Manage Variables"
5. Bill selects risk domain (1 of 19 domains)
6. System displays entry form with:
   - Current values (pre-populated from database)
   - Previous period values (read-only reference)
   - Data type constraints per field (scale 1-10, percent, currency, etc.)
7. Bill modifies variable values
8. System validates in real-time:
   - Type check: value matches expected data type (13 types)
   - Range check: value within permitted bounds (e.g., 1-10 for scale)
   - Required field: every Entry ID has a value
9. Bill saves changes
10. System writes to Supabase, creates audit log entry
```

**Success**: Variables updated in < 5 minutes per domain. Zero emails to CPF.

### 4.2 UJ-02: Bill Batt Generates Biannual Report

**Precondition**: All 287 Entry IDs populated for current period; all 5 managers have completed their domains.

```
1. Bill opens admin dashboard
2. System shows "Report Ready" status (all data complete)
3. Bill clicks "Generate Report"
4. System validates formula dependency chain:
   - All 2,415 formulas have required inputs
   - Calculation order verified (compound formulas execute after inputs)
5. System executes formulas in calculation order:
   - Order 1 formulas first, then order 2, etc.
   - Custom syntax: {400} = Entry ID, {F400} = Formula, {P400} = previous period
   - Functions: SUM, IF, AVGZERO, AVERAGE, COALESCE, +, -, /, *
6. System generates report output:
   - 6 custom management themes (not standard 5)
   - Bar charts (previous | current | sector benchmark)
   - Line charts (time-series)
   - Drill-down reports (max 3 tiers)
   - Report tables (exportable)
   - Commentary sections
7. Report available as PDF and Excel download
8. [P2] Email notification sent to board members
9. Board members access report via read-only portal
```

**Success**: Report generated in < 30 minutes. Output matches CPF-generated baseline exactly.

### 4.3 UJ-03: Risk Manager Enters Domain Data

**Precondition**: Manager has Data Contributor role; assigned to specific risk domain(s).

```
1. Manager opens MAST ERIC portal
2. Manager authenticates (email + MFA)
3. System displays only their assigned categories/domains
4. Manager selects risk domain
5. System displays entry form:
   - Fields grouped by Category → Group → Label → Subgroup hierarchy
   - Data types enforced per field (13 types available)
   - Previous period values shown as read-only reference
   - Comments enabled at configured level (group or label)
6. Manager enters current period values
7. System validates on field change:
   - Type validation (integer, decimal, currency, yes/no variants, etc.)
   - Range validation where applicable
8. Manager submits completed category
9. System marks category as complete for this period
10. Bill Batt's dashboard updates completion percentage
```

**Success**: Manager completes data entry for assigned domain without admin assistance.

### 4.4 UJ-04: Board Member Views Report

**Precondition**: Report generated and published by admin.

```
1. Board member receives notification (email or portal alert)
2. Board member opens MAST ERIC portal
3. Board member authenticates (email + MFA)
4. System displays list of available reports (current + historical)
5. Board member selects report period
6. System renders report with:
   - Overview charts (composite indices)
   - Management theme bar charts (6 themes)
   - Key insights per theme
   - Drill-down tables by domain
7. Board member downloads PDF or Excel export
```

**Success**: Board member accesses report within 2 clicks of login. No data input or system configuration visible.

### 4.5 UJ-05: Bill Batt Manages Users

**Precondition**: Bill has admin role.

```
1. Bill opens User Management panel
2. System displays current users with roles:
   - Admin (Bill Batt)
   - Data Contributors (5 risk managers)
   - Board Members (~10)
3. Bill adds new user:
   - Enters email address
   - Assigns role (Data Contributor or Board Member)
   - [If Data Contributor] Assigns category access rights (which risk domains)
4. System sends invite email
5. New user creates account via invite link
6. Bill can edit rights, deactivate, or remove users
```

**Success**: Bill adds a new risk manager and assigns domain access in < 3 minutes without CPF involvement.

---

## 5. GovTech Domain Requirements

MAST is a Tasmanian Government entity. The following requirements are mandatory.

### 5.1 Data Residency

| Requirement | Specification |
|-------------|--------------|
| DR-01 | All data at rest stored in Australian datacentres (Supabase Sydney region: ap-southeast-2) |
| DR-02 | All data in transit encrypted (TLS 1.2+) within AU network boundaries |
| DR-03 | Authentication services hosted in AU jurisdiction |
| DR-04 | Backups stored in AU jurisdiction |
| DR-05 | No data replication to non-AU regions |

### 5.2 Accessibility

| Requirement | Specification |
|-------------|--------------|
| ACC-01 | Web portal meets WCAG 2.1 Level AA for all user-facing pages |
| ACC-02 | PDF reports generated with accessibility tags (headings, alt text for charts) |
| ACC-03 | Keyboard navigation supported for all admin and data entry workflows |

### 5.3 Security

| Requirement | Specification |
|-------------|--------------|
| SEC-01 | Multi-factor authentication (MFA) for all users |
| SEC-02 | Role-based access control (RBAC) with three tiers enforced at row level |
| SEC-03 | Session timeout after 30 minutes of inactivity |
| SEC-04 | All authentication events logged with timestamp, IP, and user ID |
| SEC-05 | Annual penetration test (continuing existing CyberCX engagement) |
| SEC-06 | Data encryption at rest (AES-256 or equivalent) |

### 5.4 Audit and Compliance

| Requirement | Specification |
|-------------|--------------|
| AUD-01 | Immutable audit log for all data modifications (user, timestamp, old value, new value) |
| AUD-02 | Audit logs retained for minimum 7 years |
| AUD-03 | Admin can export audit logs as CSV |
| AUD-04 | Compliance with Tasmanian Government ICT policy framework |

---

## 6. Functional Requirements

All FRs are capabilities, not implementation. Each is measurable and traceable.

### 6.1 Authentication and Authorisation

| ID | Requirement | Priority | Traces To |
|----|------------|----------|-----------|
| FR-AUTH-01 | Users authenticate via email + password with MFA | P0 | SEC-01, UJ-01 |
| FR-AUTH-02 | System enforces three permission tiers: Administrator, Data Contributor, Board Member | P0 | P1-06, UJ-05 |
| FR-AUTH-03 | Administrator can create, edit, deactivate, and delete user accounts | P0 | UJ-05 |
| FR-AUTH-04 | Administrator can assign Data Contributors to specific categories (risk domains) | P0 | UJ-03, UJ-05 |
| FR-AUTH-05 | Data Contributors see only their assigned categories in the entry UI | P0 | UJ-03 |
| FR-AUTH-06 | Board Members see only published reports; no access to data entry or admin functions | P0 | UJ-04 |
| FR-AUTH-07 | System sends email invites to new users with account creation link | P0 | UJ-05 |
| FR-AUTH-08 | Invite expires after 7 days; admin can resend | P1 | UJ-05 |

### 6.2 Data Entry

| ID | Requirement | Priority | Traces To |
|----|------------|----------|-----------|
| FR-DATA-01 | System renders data entry forms from data tree structure (Category → Group → Label → Subgroup hierarchy) | P0 | UJ-03 |
| FR-DATA-02 | Each of the 287 Entry IDs displays with its assigned data type constraint (13 types: scale 1-10, percent, currency, decimal, integer, yes/no variants, etc.) | P0 | UJ-03 |
| FR-DATA-03 | System validates input on field change: type check, range check, required field check | P0 | P1-03, UJ-01 |
| FR-DATA-04 | System displays previous period values as read-only reference alongside current entry fields | P0 | UJ-03 |
| FR-DATA-05 | Data entry categories support configurable comment fields at group or label level | P1 | ERIC Settings |
| FR-DATA-06 | Admin can lock a completed period (prevents further edits) | P0 | ERIC User Manual |
| FR-DATA-07 | Admin can unlock a locked period for corrections | P0 | ERIC User Manual |
| FR-DATA-08 | System tracks per-category completion status (complete/incomplete) per period | P0 | UJ-02 |
| FR-DATA-09 | Admin can upload data via CSV in the exact format exported by ERIC | P2 | P1-12 |
| FR-DATA-10 | System supports hide/show logic for conditional fields based on parent Entry ID values | P1 | ERIC Hide tab |
| FR-DATA-11 | Hidden fields receive default values as configured in HideValues rules | P1 | ERIC HideValues tab |

### 6.3 Variable and Risk Register Management

| ID | Requirement | Priority | Traces To |
|----|------------|----------|-----------|
| FR-VAR-01 | Admin can view and edit variable values for all 19 risk domains | P0 | UJ-01, P1-02 |
| FR-VAR-02 | System preserves the cell-reference addressing system (Entry IDs, not semantic labels) for Phase 1 | P0 | Technical constraint |
| FR-VAR-03 | Admin can view the full risk register across all 19 domains with current status | P0 | UJ-01 |
| FR-VAR-04 | Every data change creates an immutable audit log entry (user ID, timestamp, Entry ID, old value, new value) | P1 | P1-09, AUD-01 |
| FR-VAR-05 | Admin can rollback the last variable update for a specific Entry ID | P1 | P1-10 |

### 6.4 Formula Engine

| ID | Requirement | Priority | Traces To |
|----|------------|----------|-----------|
| FR-CALC-01 | System executes all 2,415 formulas in their defined calculation order (order 1 first, then 2, then 3, etc.) | P0 | UJ-02, SC-04 |
| FR-CALC-02 | System resolves formula syntax: `{ID}` = Entry ID, `{FID}` = Formula, `{PID}` = previous period Entry, `{PFID}` = previous period Formula, `{X:Y}` = range | P0 | ERIC Data & Formulas spec |
| FR-CALC-03 | System supports formula functions: `+`, `-`, `/`, `*`, `SUM`, `IF`, `AVGZERO`, `AVERAGE`, `COALESCE`, `==`, `&&`, `OR`, `<`, `>` | P0 | ERIC Data & Formulas spec |
| FR-CALC-04 | System uses baseline=100 index system: previous period = 100, current period = weighted average rate of change | P0 | ERIC methodology |
| FR-CALC-05 | Composite indices calculated as weighted sum of variable indices: `Σ(Variable_i × Weight_i) / Σ(Weight_i)` where `Variable_i = (current / previous) × 100` | P0 | ERIC Consolidated Brief |
| FR-CALC-06 | Formula validation: system rejects report generation if any formula input is missing or calculation order is violated | P0 | UJ-02 |

### 6.5 Report Generation

| ID | Requirement | Priority | Traces To |
|----|------------|----------|-----------|
| FR-RPT-01 | Admin triggers report generation via single UI action | P0 | UJ-02, P1-04 |
| FR-RPT-02 | System generates reports in the 6 custom management themes configured for MAST (not the standard 5) | P0 | SC-04, STATE.md |
| FR-RPT-03 | Reports include bar charts showing previous period, current period, and sector benchmark | P0 | ERIC report spec |
| FR-RPT-04 | Reports include line charts for time-series data with configurable recall functions: `P(x,y)`, `FY(x,y)`, `FYD(x,y)`, `Y(x,y)`, `YD(x,y)` | P0 | ERIC User Manual |
| FR-RPT-05 | Reports include drill-down reports with max 3 tiers across, showing current result, previous result, and movement | P0 | ERIC report spec |
| FR-RPT-06 | Reports include exportable report tables with display formats: `D(x,y)`, `F(x,y)`, `C(x)` | P0 | ERIC report spec |
| FR-RPT-07 | Reports include commentary sections within report tables | P0 | ERIC report spec |
| FR-RPT-08 | Report structure follows custom report tab ordering (Type + Value table: Heading, Chart, Text, Validation) | P0 | ERIC Custom Report tab |
| FR-RPT-09 | Report text sections support inline variable references: `{{ID[format]}}` for Entry IDs, Formulas, and previous period values | P1 | ERIC Custom Report tab |
| FR-RPT-10 | Reports support HIDEROW logic on report tables (conditional row visibility based on Entry ID/Formula values) | P1 | ERIC report tables spec |
| FR-RPT-11 | Generated reports available as PDF download | P0 | P1-05 |
| FR-RPT-12 | Generated reports available as Excel download | P0 | P1-05 |
| FR-RPT-13 | Report output is identical in content and format to current ERIC-generated reports | P0 | SC-04 |
| FR-RPT-14 | System retains all historical reports for viewing and download | P0 | UJ-04 |
| FR-RPT-15 | Email notification sent to configured recipients on report generation | P2 | P1-11 |

### 6.6 Validation and Alerts

| ID | Requirement | Priority | Traces To |
|----|------------|----------|-----------|
| FR-VAL-01 | System runs input validations on category submit, displaying configured warning/error messages | P0 | ERIC Validations spec |
| FR-VAL-02 | Validation rules support IF, &&, =, <, > conditions on Entry ID values | P0 | ERIC Validations spec |
| FR-VAL-03 | Validation warnings display as pop-up with text, supporting embedded video links and hyperlinks | P1 | ERIC Validations spec |
| FR-VAL-04 | Email alerts trigger when configured conditions are met, sent to designated recipient groups | P1 | ERIC Alerts tab |

### 6.7 Data Tree Management

| ID | Requirement | Priority | Traces To |
|----|------------|----------|-----------|
| FR-TREE-01 | System reads and applies data tree configuration from Excel files (TREE tab, Settings tab, Hide tab, HideValues tab, Alerts tab, Custom Report tab) | P0 | ERIC Data Trees |
| FR-TREE-02 | Data tree configuration changes take effect on next import without requiring client recreation | P1 | ERIC User Manual |
| FR-TREE-03 | System supports configurable settings: EntryPeriodRequirement (6 months for MAST), SectorLabel, AllowCopyPeriod, IncludeValidationReport, ShowComments, FullRow, ShowSearchOnTables | P1 | ERIC Settings tab |

---

## 7. Non-Functional Requirements

All NFRs include measurable targets and measurement methods.

### 7.1 Performance

| ID | Requirement | Measurement |
|----|------------|-------------|
| NFR-PERF-01 | Data entry form loads in < 3 seconds for categories with < 100 fields | Browser performance timing API |
| NFR-PERF-02 | Report generation completes in < 5 minutes for all 2,415 formulas | Server-side execution timer |
| NFR-PERF-03 | PDF/Excel export generates in < 60 seconds | Server-side timer |
| NFR-PERF-04 | Admin dashboard loads in < 2 seconds | Browser performance timing |
| NFR-PERF-05 | Hide/show logic evaluates in < 500ms per category (< 1,000 conditions) | Client-side measurement |

### 7.2 Availability

| ID | Requirement | Measurement |
|----|------------|-------------|
| NFR-AVAIL-01 | 99.5% uptime during MAST business hours (Mon-Fri 8:00-18:00 AEST) | Supabase uptime monitoring |
| NFR-AVAIL-02 | Scheduled maintenance windows: weekends only, with 48h advance notice | Maintenance log |
| NFR-AVAIL-03 | Database backups: daily automated, retained 30 days, stored in AU | Supabase backup configuration |

### 7.3 Scalability

| ID | Requirement | Measurement |
|----|------------|-------------|
| NFR-SCALE-01 | System supports up to 20 concurrent users (16 expected: 1 admin + 5 managers + ~10 board) | Load test with 20 simultaneous sessions |
| NFR-SCALE-02 | Database supports 10 years of biannual reporting data (20 periods × 7,458 fields = ~149,160 records) | Storage capacity verification |

### 7.4 Security

| ID | Requirement | Measurement |
|----|------------|-------------|
| NFR-SEC-01 | All data encrypted at rest (AES-256) | Supabase encryption audit |
| NFR-SEC-02 | All data in transit encrypted (TLS 1.2+) | SSL certificate verification |
| NFR-SEC-03 | Row-Level Security (RLS) enforced: users access only authorised data | Penetration test verification |
| NFR-SEC-04 | Password policy: minimum 12 characters, complexity requirements | Auth configuration audit |
| NFR-SEC-05 | Failed login lockout after 5 attempts for 15 minutes | Security test |

### 7.5 Data Integrity

| ID | Requirement | Measurement |
|----|------------|-------------|
| NFR-INT-01 | Formula calculations produce results identical to current ERIC engine (tolerance: 0.00) | Parallel run comparison across all 2,415 formulas |
| NFR-INT-02 | Entry IDs remain globally unique across all data trees | Database constraint enforcement |
| NFR-INT-03 | Period locking prevents data modification (enforced at database level, not just UI) | Attempted direct API modification test |

### 7.6 Compliance

| ID | Requirement | Measurement |
|----|------------|-------------|
| NFR-COMP-01 | All infrastructure components hosted in Supabase Sydney (ap-southeast-2) | Infrastructure audit |
| NFR-COMP-02 | System meets Tasmanian Government ICT policy requirements | Policy checklist verification |
| NFR-COMP-03 | Annual penetration testing by accredited provider | Test report |
| NFR-COMP-04 | Privacy Impact Assessment (PIA) completed pre go-live | PIA document |

---

## 8. Architecture Approach

### 8.1 Migration Strategy: Azure → Supabase Sydney

**Decision**: Migrate from Azure ($2,420/mo) to Supabase Sydney (AU data residency, modern API, team familiarity).

| Azure Component | Supabase Equivalent | Migration Path |
|----------------|--------------------|--------------------|
| Azure SQL PaaS | Supabase PostgreSQL (Sydney) | Schema migration + data export/import |
| Azure AD B2C | Supabase Auth + RLS | Rebuild auth with role-based policies |
| Azure Blob Storage | Supabase Storage | File migration |
| Azure Web App Service | Supabase Edge Functions + hosted frontend | Rebuild application layer |
| Azure Front Door + WAF | Supabase built-in + Cloudflare | Configure DNS and CDN |
| Azure SendGrid | Supabase + Resend/SendGrid | Rebuild email triggers |
| Azure DevOps | GitHub (existing team workflow) | Migrate repo |

### 8.2 Application Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    MAST ERIC Phase 1                      │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  ┌──────────────┐     ┌──────────────┐                   │
│  │   Frontend    │────▶│  Supabase    │                   │
│  │  (React/Next) │     │  Auth + RLS  │                   │
│  └──────────────┘     └──────────────┘                   │
│         │                    │                            │
│         ▼                    ▼                            │
│  ┌──────────────┐     ┌──────────────┐                   │
│  │ Admin Panel   │     │  PostgreSQL  │                   │
│  │ Data Entry UI │     │  (Sydney)    │                   │
│  │ Report Viewer │     │  + RLS       │                   │
│  └──────────────┘     └──────────────┘                   │
│         │                    │                            │
│         ▼                    ▼                            │
│  ┌──────────────┐     ┌──────────────┐                   │
│  │   Formula     │     │   Supabase   │                   │
│  │   Engine      │     │   Storage    │                   │
│  │  (serverside) │     │ (Reports/DT) │                   │
│  └──────────────┘     └──────────────┘                   │
│         │                                                 │
│         ▼                                                 │
│  ┌──────────────┐                                        │
│  │  PDF/Excel    │                                        │
│  │  Generator    │                                        │
│  └──────────────┘                                        │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

### 8.3 Key Architectural Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Database | Supabase PostgreSQL (Sydney) | AU data residency, RLS built-in, team familiarity, cost reduction |
| Auth | Supabase Auth | Built-in RBAC, MFA support, RLS integration |
| Formula engine | Server-side (Edge Functions or backend service) | 2,415 formulas with dependency chain require controlled execution |
| Report generation | Server-side PDF/Excel generation | Complex chart rendering, exact format replication |
| Cell references | Preserved as-is | Phase 1 constraint; semantic labels deferred to Phase 2 |
| Data tree import | Excel file upload → parser → database | Existing Excel-based data tree format maintained |
| Domain | MAST-branded (new domain, not EricSFM.com) | Client identity, separation from shared ERIC domain |

### 8.4 Migration Prerequisites

| ID | Investigation | Deliverable | Owner | Status |
|----|--------------|-------------|-------|--------|
| T1 | Azure DB separation verification | Written confirmation: ERIC DB is separate from Jigsaw DB | Pradeep | Pending |
| T2 | Formula export integrity | Integrity report: "X of 2,415 formulas export cleanly" | Pradeep | Pending |
| T3 | Variable file mapping | Complete schema: all 287 Entry IDs, 13 types, connections | Pradeep | Blocked (needs Martin's docs) |
| T4 | Data tree mapping | Data flow diagram: input → tree → report | Pradeep | Blocked (needs Martin's docs) |
| T5 | Supabase AU pricing | Cost comparison: Azure ($2,420) vs Supabase Sydney | Pradeep | Pending |

---

## 9. MAST-Specific Data Model

### 9.1 Risk Structure

| Attribute | Value |
|-----------|-------|
| Risk domains | 19 |
| Risk managers | 5 |
| Management themes | 6 (custom, not standard 5) |
| Entry IDs | 287 |
| Entry fields | 7,458 |
| Formulas | 2,415 |
| Data types | 13 |
| Reporting frequency | Every 6 months (biannual) |
| Report types | Line Chart, Bar Chart, Drill Down, Report Table, Commentary |

### 9.2 Formula Syntax Reference

| Syntax | Meaning |
|--------|---------|
| `{400}` | Entry ID 400 (current period) |
| `{F400}` | Formula 400 result |
| `{P400}` | Entry ID 400 (previous period) |
| `{PF400}` | Formula 400 (previous period) |
| `{280:290}` | Range: Entry IDs 280 through 290 |
| `SUM({280:290})` | Sum of range |
| `IF({F2378}>0&&{F2378}<100,9,1)` | Conditional |
| `AVGZERO({280:290})` | Average excluding zeros |
| `COALESCE({400},{F400},0)` | First non-error value |

### 9.3 Data Type Reference

| Type ID | Type Name | Input Constraint |
|---------|-----------|------------------|
| 0 | One to Ten | Scale 1-10 |
| 1 | Percent | 0-100% |
| 2 | Currency | Monetary value |
| 3 | Decimal Number | Float |
| 4 | Integer Number | Whole number |
| 5 | Decimal Zero to Ten | Scale 0.0-10.0 |
| 6 | Zero to Ten | Integer 0-10 |
| 7 | Yes/NotYet/NM/NR | Values: 9/5/2/1 |
| 8 | Yes/No/Not Yet | Values: 9/1/5 |
| 9 | Proceed | Binary |
| 10 | Agree/Disagree | Values: 9/1/5 |
| 11 | Integer Percent | Whole percentage |
| 12 | Intelligence Gathering scale | Values: 9/8/7/6/5/4/2 |
| 13 | Support/Audit/Decline | Values: 9/8/1 |

### 9.4 Three-Tier Permission Model

#### Tier 1: Administrator (Bill Batt)

| Permission | Scope |
|-----------|-------|
| Manage risk register | All 19 domains |
| Manage variable values | All 287 Entry IDs |
| Trigger report generation | All reports |
| Manage users | Add/remove/edit all tiers |
| View all data | Full visibility |
| Lock/unlock periods | All periods |
| Configure settings | System-level |
| Export audit logs | All logs |

#### Tier 2: Data Contributor (5 Risk Managers)

| Permission | Scope |
|-----------|-------|
| Enter data | Assigned categories only |
| View own submissions | Own data history |
| Add comments | Configured level (group/label) |
| Cannot view other managers' data | Restricted to own scope |
| Cannot generate reports | No report access |
| Cannot modify risk register | No risk management |

#### Tier 3: Board Member (Read-Only)

| Permission | Scope |
|-----------|-------|
| View published reports | All finalised reports |
| Download PDF/Excel | Export capabilities |
| No data input | No modification access |
| No admin access | No system configuration |

---

## 10. Risks and Mitigations

| ID | Risk | Impact | Likelihood | Mitigation |
|----|------|--------|------------|------------|
| R-01 | Formula calculation results differ from current ERIC engine | Critical | High | Parallel run period (7–18 Apr): both CPF and Bill generate same report, compare cell-by-cell. Zero tolerance for discrepancy. |
| R-02 | Cell-reference fragility: variable file structure changes break calculations | High | High | Freeze variable file structure for Phase 1. No structural changes until Phase 2 mapping layer. |
| R-03 | Azure DB shared with Jigsaw (migration approach changes) | Critical | Unknown | T1 investigation (Pradeep) must complete before migration begins. If shared, isolate MAST data first. |
| R-04 | Formula export from Azure loses data or fidelity | Critical | Medium | T2 investigation validates all 2,415 formulas export cleanly before migration commitment. |
| R-05 | Bill Batt adoption failure (cannot/will not use new system) | High | Medium | Training session (2h hands-on) + parallel run with CPF backup + written runbook. |
| R-06 | Martin documentation delays (shared drive not provided) | High | High | Proceed with existing analysed materials (6 Excel files already processed). Escalate to Nico if blocked > 2 days. |
| R-07 | AU data residency non-compliance | Critical | Low | Supabase Sydney region verified pre-migration. Infrastructure audit in SC-05. |
| R-08 | Migration downtime exceeds 8 hours | Medium | Low | Weekend migration window. Rollback plan: revert to Azure if Supabase migration fails. |
| R-09 | Report format differs from current output | High | Medium | Pixel-level comparison of PDF output vs current ERIC reports. Acceptance criteria: visually identical. |
| R-10 | Hide/show logic complexity causes performance degradation | Medium | Medium | Limit to < 1,000 hide/show conditions per category (per ERIC documentation). Performance test pre go-live. |

---

## 11. Timeline

| Phase | Dates | Deliverable | Dependencies |
|-------|-------|-------------|--------------|
| Discovery + PRD | 3–13 Mar | This document (final v2) | Deep-dive session, Azure access |
| Deep-dive session | 5–7 Mar | Architecture decision confirmed, scope locked | Nico + Martin + Bill availability |
| Azure analysis | Before 13 Mar | T1–T5 investigation results | Pradeep + Martin shared drive |
| Architecture design | 13–17 Mar | Technical architecture document | PRD approved, T1–T5 complete |
| Sprint 1: Foundation | 17–24 Mar | Auth + RBAC + database schema + data tree import | Architecture approved |
| Sprint 2: Core | 24–31 Mar | Data entry UI + variable management + formula engine | Sprint 1 complete |
| Sprint 3: Reports | 31 Mar – 7 Apr | Report generation + PDF/Excel export + admin dashboard | Sprint 2 complete |
| Parallel run | 7–18 Apr | Bill + CPF both generate reports, compare outputs | Sprint 3 complete |
| Bug fixes + polish | 14–18 Apr | All SC-04 discrepancies resolved | Parallel run feedback |
| Go-live | ~21 Apr | CPF removed from operational loop | All success criteria met |
| Post go-live support | 21 Apr – 5 May | Bill supported through first independent cycle | Go-live complete |

### Critical Path

```
PRD (13 Mar) → Architecture (17 Mar) → Sprint 1 (24 Mar) → Sprint 2 (31 Mar)
    → Sprint 3 (7 Apr) → Parallel Run (18 Apr) → Go-Live (~21 Apr)
```

**Total development: ~4 weeks. Total project: ~7 weeks.**

---

## 12. Open Questions

> To be resolved in deep-dive session and T1–T5 investigations.

| # | Question | Impact | Owner | Due |
|---|----------|--------|-------|-----|
| Q1 | Is the ERIC Azure DB separate from the Jigsaw Azure DB? | Gates migration strategy | Pradeep (T1) | 10 Mar |
| Q2 | Can all 2,415 formulas be exported from Azure without data loss? | Gates migration commitment | Pradeep (T2) | 10 Mar |
| Q3 | What are the exact 6 custom management themes for MAST? | Report structure definition | Martin | 7 Mar |
| Q4 | What is Supabase Sydney pricing for MAST's data volume? | Budget approval | Pradeep (T5) | 10 Mar |
| Q5 | Does Caedus retain any IP or access rights over ERIC code? | Legal/licensing | Martin/Nico | 7 Mar |
| Q6 | What is Bill Batt's current technical proficiency with ERIC? | Training plan scope | Martin | Deep-dive |
| Q7 | Are all validation rules in the data tree Excel, or are some hardcoded in ERIC source? | Migration completeness | Pradeep (T3) | 10 Mar |
| Q8 | What is MAST's budget ceiling for Phase 1? | Scope constraint | Nico | 7 Mar |

---

## 13. Constraints

| Constraint | Detail |
|-----------|--------|
| No report redesign | Phase 1 outputs identical report format. Jigsaw-style redesign = Phase 2+. |
| No AI integration | Cell references remain as-is. Semantic mapping layer = Phase 2. |
| No Logic Model | MAST does not use Logic Model component of ERIC. |
| No Contribution/Convergence Maps | Not in MAST workflow. |
| Same calculation engine | Baseline=100, weighted indices, same formula syntax and functions. |
| Same reporting frequency | Biannual (every 6 months). No change. |
| Cell references preserved | Variable files use cell positions, not semantic labels. Phase 1 maintains this. |
| MAST-only | No multi-client improvements in Phase 1. |

---

## Appendices

### A. Glossary

| Term | Definition |
|------|------------|
| ERIC | Enterprise Reporting Intelligence Connectivity — algorithmic risk reporting system |
| MAST | Marine and Safety Tasmania — government entity, ERIC client |
| CPF | Creating Preferred Futures — Martin Farley's consultancy, current ERIC intermediary |
| Data Tree | Excel file defining database structure, entry UI, report configuration, and validations |
| Variable File | Excel file containing input data, formulas, and cell references |
| Entry ID | Unique numeric identifier for each data entry field (287 total for MAST) |
| Formula ID | Unique identifier for calculated values (2,415 total for MAST) |
| Calculation Order | Execution sequence for formulas (compound formulas must execute after their inputs) |
| Baseline=100 | Index system where previous period = 100, current = rate of change |
| RLS | Row-Level Security — database-enforced access control |
| Caedus Systems | Original ERIC IT development partner (Patrick Cranney) |

### B. Reference Documents

| Document | Location |
|----------|----------|
| PRD Skeleton v1 | `projects/mast/docs/mast-prd-skeleton-v1.md` |
| ERIC Technical Brief v1 | `projects/mast/docs/eric-technical-brief-v1.md` |
| ERIC User Manual | `projects/mast/docs/ERIC-User-Manual.md` |
| ERIC Consolidated Brief | `projects/mast/docs/ERIC_CONSOLIDATED_BRIEF.md` |
| ERIC Workplan | `projects/mast/docs/ERIC_WORKPLAN_2026-01-13.md` |
| MAST Dynamic Risk Management | `projects/mast/docs/MAST-Dynamic-Risk-Management.md` |
| MAST Project State | `projects/mast/STATE.md` |

### C. Traceability Matrix

```
Vision (§1.2) → SC-01 through SC-08 (§2)
SC-01 (zero CPF emails) → P1-02, FR-VAR-01, UJ-01
SC-02 (< 30 min report) → P1-04, FR-RPT-01, UJ-02
SC-03 (Bill independent) → P1-01, FR-AUTH-02, UJ-02
SC-04 (100% accuracy) → P1-05, FR-CALC-01 through FR-CALC-06, FR-RPT-13, NFR-INT-01
SC-05 (AU residency) → P1-07, DR-01 through DR-05, NFR-COMP-01
SC-06 (< 8h downtime) → Migration plan (§8)
SC-07 (5 managers enter) → P1-06, FR-AUTH-04, FR-AUTH-05, UJ-03
SC-08 (< $1,500/mo) → P1-07, Supabase migration (§8)
```

---

*Document version: 1.0 | Generated: 5 March 2026 | Methodology: BMAD v6*
*Next: Stakeholder review → Deep-dive session → PRD v2 final (13 Mar)*
