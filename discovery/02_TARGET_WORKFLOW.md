# 02 — MAST Target Workflow: Proposed New System

> **Source**: CPF Team Sessions, 4 March 2026 (Sessions 2 & 3)
> **Status**: Proposed — to be validated at deep-dive session

---

## Core Objective

**Eliminate CPF as intermediary**. MAST manages their own risk data input, risk register maintenance, and report generation — fully autonomous.

---

## Target Workflow

```
┌─────────────────────────────────────────────────────────────┐
│                    TARGET MAST WORKFLOW                      │
│                                                             │
│  MAST Staff          Bill Batt (Admin)     System (New)     │
│  ──────────          ─────────────────     ─────────────    │
│                                                             │
│  1. Log in to        │                     │                │
│     MAST portal ─────┼─────────────────────► Authenticate   │
│     (own domain)     │                     │ (3-tier RBAC)  │
│                      │                     │                │
│  2. Fill web-based   │                     │                │
│     input forms ─────┼─────────────────────► Data stored    │
│     (own data only)  │                     │ (Australian    │
│                      │                     │  server)       │
│                      │                     │                │
│                      3. Review submitted   │                │
│                         data in admin  ◄───┤                │
│                         dashboard          │                │
│                      4. Add/remove risks ──► Risk register  │
│                         as needed          │ updated        │
│                      5. Manage variable ───► Variables       │
│                         configuration      │ updated        │
│                      6. Authorise report ──► Report          │
│                         generation         │ generated      │
│                                            │                │
│  Board Members       │                     │                │
│  ─────────────       │                     │                │
│  7. Access reports ──┼─────────────────────► Read-only      │
│     (read-only)      │                     │ portal         │
│                                                             │
│  CPF (Maintenance Only)                                     │
│  ──────────────────────                                     │
│  System updates, bug fixes, feature requests                │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Side-by-Side Comparison

| Aspect | Current (Today) | Target (Phase 1) |
|--------|----------------|-------------------|
| **Data input** | Excel variable file, emailed to CPF | Web forms, self-service |
| **Report request** | Email to CPF | Admin clicks "Generate Report" |
| **Report generation** | CPF manually validates and runs | System generates automatically |
| **Risk management** | CPF manages risk register | Admin (Bill Batt) manages |
| **User management** | None — CPF controls everything | Three-tier RBAC |
| **Domain** | EricSFM.com (shared) | Own MAST-branded domain |
| **Hosting** | Azure (unknown region) | Australian server (government requirement) |
| **CPF role** | Intermediary for every report | Maintenance and support only |
| **Report format** | ERIC format | Exact same format (no redesign) |
| **Data labels** | Cell references | Cell references (unchanged in Phase 1) |

---

## Three-Tier Permission Model

### Tier 1: Administrator (e.g., Bill Batt)

| Permission | Description |
|-----------|-------------|
| Manage risk register | Add, remove, and modify risks |
| Manage variable file | Update variable configurations and weights |
| Authorise report generation | Review data and trigger report creation |
| Manage users | Add/remove data contributors and board members |
| View all data | Full visibility across all input data |
| Configure settings | System-level configuration |

### Tier 2: Data Contributors (MAST Staff)

| Permission | Description |
|-----------|-------------|
| Input own data | Fill their assigned input forms only |
| View own submissions | See history of their own data entries |
| Cannot view others' data | Restricted to their own scope |
| Cannot generate reports | No report generation access |
| Cannot modify risk register | No access to risk management |

### Tier 3: Board Members (Read-Only)

| Permission | Description |
|-----------|-------------|
| View generated reports | Access to finalised reports only |
| Download reports | Export/print capabilities |
| No data input | Cannot modify any data |
| No system access | Cannot access administration or data entry |

---

## Infrastructure Requirements

| Requirement | Detail |
|-------------|--------|
| **Hosting** | Australian server — mandatory for government business entity |
| **Domain** | Own MAST-branded domain (not EricSFM.com, not Jigsaw) |
| **Authentication** | Secure user login with role-based access |
| **Data sovereignty** | All data stored on Australian servers |
| **Report output** | Same format as current ERIC reports |
| **Availability** | Web-accessible from any device |

---

## What Changes for Each Stakeholder

### MAST Staff (Data Contributors)
- **Before**: Fill Excel file → email CPF → wait for report
- **After**: Log in → fill web form → data saved automatically
- **Benefit**: Faster, no email dependency, can track own submissions

### Bill Batt (Administrator)
- **Before**: No direct system access — everything through CPF
- **After**: Full control — manage risks, users, variables, and report generation
- **Benefit**: Autonomy, faster turnaround, direct oversight

### Board Members
- **Before**: Receive reports via email from CPF
- **After**: Log in to portal, view/download latest reports
- **Benefit**: On-demand access, always up-to-date

### CPF
- **Before**: Manual intermediary for every report cycle
- **After**: System maintenance, support, and future upgrades
- **Benefit**: Reduced labour, recurring revenue from maintenance contract, upsell opportunity

---

## Phase 1 Constraints

1. **No report redesign** — exact same report format and structure
2. **No AI integration** — cell references remain as-is
3. **No Logic Model** — MAST does not use it
4. **No Contribution/Convergence Maps** — not in MAST's workflow
5. **Same calculation engine** — baseline=100, weighted composite indices, alerts

---

## Phase 2 Vision (Post Phase 1)

Once MAST is operating autonomously:

- Upgrade to Jigsaw-style reporting with enhanced visualisations
- Replace cell references with semantic labels
- Add AI-generated narratives and insights
- Introduce real-time dashboards
- Offer Logic Model, Contribution Map, and Development Pathways as optional modules

Martin flagged this explicitly: *"We come back with, okay, now... this is the way we can make it look for you."*

---

## Open Questions for Deep-Dive

1. Should MAST be a standalone application or a tenant within Jigsaw 1.6?
2. What authentication system best suits a government entity? (Supabase Auth / WorkOS / Custom)
3. What does "authorise report generation" mean in practice — approval workflow or simple button click?
4. How should report history be managed — keep all versions or overwrite?
