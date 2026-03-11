# MAST Session 01 Handoff — New Project Setup (Pre-BMAD)

**Date:** 2026-03-03
**Author:** Claude Opus (from Jigsaw 2.0 session)
**Target:** New Claude Code session in a new MAST project repo
**Objective:** Set up the MAST project repo from scratch so BMAD can be run on it

---

## What You're Building

**MAST** (Marine and Safety Tasmania) is a government business entity that currently uses a risk reporting system called **ERIC** (EricSFM.com), built on Azure and managed by CPF (Creating Preferred Futures). Today, CPF acts as intermediary for every report cycle — MAST staff email CPF to request reports, and CPF manually generates them.

**Phase 1 goal:** Build a standalone web application that replicates the current ERIC report exactly, but gives MAST full autonomy — an administrator manages risks, users input their own data via web forms, and reports are generated without CPF involvement.

This is NOT a redesign. It is a faithful replication of the existing system with self-service capabilities bolted on.

---

## Why This Session Exists

Before running BMAD (the CPF build methodology: Brief → PRD → Architecture → Epics → Production), we need a project repo with the right structure, tooling, and context documents in place. This session sets up that foundation.

The next session will run BMAD on this repo using the discovery documents as input.

---

## What the New Repo Should Contain

### 1. Project Structure

Create a new repo (e.g., `mast-reporting` or similar — Nicolas to confirm name) with:

```
mast-reporting/
├── CLAUDE.md                     ← Project instructions for Claude Code
├── README.md                     ← Project overview
├── .gitignore
├── _bmad/                        ← BMAD methodology workspace
│   └── docs/
│       ├── brief/                ← Brief will go here (after BMAD runs)
│       ├── prd/                  ← PRD will go here (after BMAD runs)
│       └── architecture/         ← Architecture docs will go here
├── discovery/                    ← Copy of pre-brief documents (from Jigsaw 2.0)
│   ├── 01_CURRENT_WORKFLOW.md
│   ├── 02_TARGET_WORKFLOW.md
│   ├── 03_TECHNICAL_STACK.md
│   ├── 04_MARTIN_QUESTIONNAIRE.md
│   ├── 05_PRADEEP_TECH_INVESTIGATION.md
│   └── 06_DEEP_DIVE_AGENDA.md
├── reference/                    ← Reference material
│   └── ERIC_DOCUMENTATION_INDEX.md
└── sessions/                     ← Session documentation
    └── SESSION_01_COMPLETE.md    ← This setup session's report
```

### 2. CLAUDE.md Content

The CLAUDE.md should include:

- **Project overview**: MAST reporting platform — Phase 1 autonomous risk reporting
- **Client context**: Government business entity, Tasmania, Australian hosting requirement
- **Build methodology**: BMAD (Brief → PRD → Architecture → Epics → Production)
- **Current phase**: Pre-BMAD setup — discovery documents loaded, awaiting brief
- **Team**: Nicolas (PM), Martin (domain expert/CEO), Pradeep (backend), Tanjim (frontend)
- **Key constraint**: Phase 1 replicates existing report exactly — no redesign
- **Spanish rule**: Same as global — no voseo argentino, Spanish neutro/chileno
- **Australian English** for code and English content

### 3. README.md Content

Brief project overview:
- What MAST is
- What ERIC is
- What Phase 1 delivers
- Current status (pre-BMAD)
- Link to discovery documents

---

## Discovery Documents to Copy

These 7 files were created in the Jigsaw 2.0 repo and contain all the pre-brief research. They should be copied into the new MAST repo's `discovery/` folder:

| File | Location in Jigsaw 2.0 | Content Summary |
|------|------------------------|-----------------|
| `01_CURRENT_WORKFLOW.md` | `OBS_notes/Jigsaw20/clients/mast/discovery/` | How MAST works today: workflow diagram, ERIC report structure (baseline=100, 4-level hierarchy, management themes), 11 information gaps |
| `02_TARGET_WORKFLOW.md` | Same | Proposed new workflow: self-service web app, 3-tier permission model (Admin/Contributors/Board), side-by-side comparison |
| `03_TECHNICAL_STACK.md` | Same | 7 open technical decisions with options analysis, timeline reality check |
| `04_MARTIN_QUESTIONNAIRE.md` | Same | 24 structured questions for Martin (domain expert) across 5 categories |
| `05_PRADEEP_TECH_INVESTIGATION.md` | Same | 6 technical investigation items for Pradeep (backend dev) with deliverables |
| `06_DEEP_DIVE_AGENDA.md` | Same | 90-minute structured agenda for the MAST deep-dive session |
| `ERIC_DOCUMENTATION_INDEX.md` | `OBS_notes/Jigsaw20/clients/mast/reference/` | Placeholder index for Martin's ERIC source code, DataTrees, and user guide |

**Source path:** `/Users/nicolaspt/Jigsaw_2.0_dev/OBS_notes/Jigsaw20/clients/mast/`

---

## Essential Context for the New Session

### The ERIC System

ERIC is an algorithm-based reporting platform using Excel data trees on Azure:

- **Data flow**: Variable File → Data Trees → Input Forms → Report
- **Report structure**: 4 levels — Dashboard (Logic Model colour-coded) → Management Themes (5 indices) → Individual Variables → Business Unit Drill-down
- **Baseline system**: Previous period = 100, current period = rate of change
- **Colour coding**: Green (>=100), Yellow (95-99), Red (<95)
- **Cell references**: Data uses cell references, NOT labels — labels only in graphs. This is technical debt but kept as-is for Phase 1.
- **Alerts**: Hardwired experience-based alerts when results exceed range parameters

### Current Workflow (What We're Replacing)

1. MAST staff fill individual input forms in ERIC (small Excel/variable file)
2. MAST emails CPF to request report
3. CPF (Martin) updates variable file, validates against data trees, runs report
4. Report delivered to MAST

### Target Workflow (What We're Building)

1. MAST staff log in to own portal (MAST-branded domain, Australian hosting)
2. Staff fill web forms (own data only)
3. Administrator (Bill Batt) reviews data, manages risks, authorises report generation
4. System generates report automatically
5. Board members access reports (read-only)
6. CPF provides maintenance and support only

### Three-Tier Permission Model

| Tier | Role | Permissions |
|------|------|-------------|
| Administrator | Bill Batt | Manage risks, variables, users; authorise reports; full data visibility |
| Data Contributors | MAST staff | Input own data only; view own submissions |
| Board Members | Executives | Read-only access to generated reports |

### Technical Decisions (Status as of 3 March 2026)

| Decision | Status | Notes |
|----------|--------|-------|
| Database | Blocked | Azure vs Supabase AU — waiting on Pradeep's Azure validation |
| Standalone vs Jigsaw tenant | Open | Discuss at deep-dive |
| Frontend | Likely React | Team competency |
| Authentication | Open | Supabase Auth / WorkOS / Custom |
| Cell references | **Decided** | Keep as-is for Phase 1 |
| Report generation | Open | Server-side PDF / client export / both |
| Domain | Open | Martin to decide |

### Infrastructure Requirements

- **Australian server hosting** — mandatory for government business entity
- **Own domain** — not EricSFM.com, not Jigsaw
- **Data sovereignty** — all data on Australian servers

---

## What This Session Should NOT Do

- Do NOT start writing the brief or PRD — that's BMAD's job in the next session
- Do NOT make final architecture decisions — several are blocked by investigations
- Do NOT scaffold application code — repo structure and docs only at this stage
- Do NOT set up CI/CD or deployment — too early

---

## What This Session SHOULD Do

1. Create the new repo with the structure above
2. Write `CLAUDE.md` with full project context
3. Write `README.md` with project overview
4. Copy discovery documents from Jigsaw 2.0 into the repo
5. Set up `_bmad/` directory structure ready for the BMAD workflow
6. Create `.gitignore` (standard Node/Python ignores + `.env*`)
7. Initial commit and push to GitHub (under `nicopt-io` org)
8. Produce `SESSION_01_COMPLETE.md` documenting what was set up

---

## Related Files in Other Repos

| File | Repo | Relevance |
|------|------|-----------|
| `OBS_notes/Jigsaw20/clients/mast/` | Jigsaw 2.0 | All discovery documents (primary source) |
| `_bmad/eric-1.5/docs/prd/PRD.md` | Jigsaw 2.0 | ERIC 1.5 PRD for CHC — reference template for MAST PRD |
| `backend/azure_to_supabase.py` | Jigsaw 2.0 | Existing Azure migration tooling (Jigsaw, not ERIC — but reference) |
| `OBS_notes/Jigsaw20/Eric reporting instructor.md` | Jigsaw 2.0 | Martin's ERIC methodology document |
| `CLAUDE.md` | Jigsaw-1.6-RSA | Example of a well-structured CLAUDE.md for a CPF project |

---

## BMAD Methodology Reference

The build process CPF uses (to be run AFTER this setup session):

```
Brief → PRD → Architecture → Epics & Sprints → Production
```

- **Brief**: High-level project definition — what, why, for whom, constraints
- **PRD**: Detailed product requirements — every feature, user story, validation rule, NFR
- **Architecture**: Technical design — database schema, API design, component structure
- **Epics & Sprints**: Work breakdown into deliverable chunks
- **Production**: Build, test, deploy

The PRD is "the heart of the entire process" — every requirement must be explicit before architecture begins.

---

## Timeline Context

| Date | Event |
|------|-------|
| 2026-03-03 | Pre-brief documents created (this handoff) |
| 2026-03-04 | Team sessions where MAST was discussed in depth |
| ~2026-03-07 | Target: Deep-dive session with full team |
| ~2026-03-13 | Deadline: Brief + PRD complete |
| TBD | Architecture + build begins after PRD approval |

**Reality check**: The 13 March deadline is aggressive. Realistic target is brief + PRD done by then, with production on a separate timeline.

---

## Blockers to Be Aware Of

These are NOT blockers for this setup session, but they block BMAD progress:

1. **Martin's workflow document** — not yet written; blocks PRD
2. **Pradeep's Azure validation** — not yet started; blocks architecture decision
3. **ERIC documentation** — only on Martin's local machine; blocks full technical assessment
4. **Jigsaw 1.6 deployment** — not yet complete; blocks dev team availability for MAST build
5. **Martin's questionnaire answers** — 24 questions pending; blocks detailed requirements

---

*Handoff prepared by Claude Opus — 3 March 2026*
*Source session: Jigsaw 2.0 repo, branch `chc-brief-v3`, commit `22e46e8`*
