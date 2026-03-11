# MAST — Autonomous Risk Reporting Platform

**Client:** Marine and Safety Tasmania (MAST) — Government Business Entity
**Managed by:** CPF (Creating Preferred Futures)
**Phase:** Pre-BMAD setup

---

## What Is This?

MAST is a Tasmanian government business entity that uses **ERIC** (EricSFM.com), a risk reporting system built on Azure, currently managed by CPF. Today, CPF acts as intermediary for every report cycle — MAST staff email CPF to request reports, and CPF manually generates them.

## What Are We Building?

**Phase 1:** A standalone web application that replicates the current ERIC report exactly, but gives MAST full autonomy:

- **Administrator** (Bill Batt) manages risk register, users, variables, and authorises report generation
- **Data Contributors** (MAST staff) input their own data via web forms — no more Excel files and emails
- **Board Members** access generated reports (read-only)
- **CPF** provides maintenance and support only — no longer the intermediary

This is NOT a redesign. Phase 1 faithfully replicates the existing system with self-service capabilities.

## Current Status

| Milestone | Status |
|-----------|--------|
| Discovery documents | Done |
| Martin questionnaire | Pending |
| Pradeep Azure validation | Pending |
| Deep-dive session | Not yet scheduled |
| BMAD Brief | Not started |
| PRD | Not started |
| Architecture | Not started |
| Build | Not started |

## Build Methodology

CPF uses the **BMAD** methodology:

```
Brief → PRD → Architecture → Epics & Sprints → Production
```

## Repo Structure

```
MAST/
├── CLAUDE.md              ← Project instructions for Claude Code
├── README.md              ← This file
├── _bmad/docs/            ← BMAD outputs (brief, PRD, architecture)
├── discovery/             ← Pre-brief research documents
├── reference/             ← ERIC documentation index
└── sessions/              ← Session documentation
```

## Key Documents

| Document | Description |
|----------|-------------|
| `discovery/01_CURRENT_WORKFLOW.md` | How MAST works today (known + 11 gaps) |
| `discovery/02_TARGET_WORKFLOW.md` | Proposed new autonomous workflow |
| `discovery/03_TECHNICAL_STACK.md` | 7 open technical decisions |
| `discovery/04_MARTIN_QUESTIONNAIRE.md` | 24 questions for domain expert |
| `discovery/05_PRADEEP_TECH_INVESTIGATION.md` | 6 technical investigations |
| `discovery/06_DEEP_DIVE_AGENDA.md` | 90-minute session agenda |

## Team

| Name | Role |
|------|------|
| Nicolas | Project Manager |
| Martin | Domain Expert / CEO |
| Pradeep | Backend Developer |
| Tanjim | Frontend Developer |

## Constraints

- **Australian hosting** — mandatory for government business entity
- **Own domain** — not EricSFM.com, not Jigsaw
- **Phase 1: no redesign** — replicate current report format exactly
- **Cell references kept as-is** — semantic labels deferred to Phase 2
