# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

MAST (Marine and Safety Tasmania) is a government business entity that uses ERIC (EricSFM.com), a risk reporting system on Azure managed by CPF. This project builds a standalone web application that replicates the current ERIC report and gives MAST full autonomy — eliminating CPF as intermediary.

**Phase 1 scope:** Exact replication of the current report + self-service data input + three-tier permission model. No redesign.

**Current phase:** Pre-BMAD — discovery documents complete, awaiting brief. No application code exists yet.

## Build Methodology

CPF uses **BMAD**: Brief → PRD → Architecture → Epics & Sprints → Production.

The PRD is the heart of the process — every requirement must be explicit before architecture begins. Do not skip steps. Use the `/bmad-specialist` skill for BMAD workflow guidance.

## Repository Structure

- `discovery/` — Pre-brief research (6 numbered documents covering current workflow, target workflow, technical stack, Martin's questionnaire, Pradeep's tech investigation, deep-dive agenda)
- `reference/` — ERIC documentation index (placeholder — awaiting Martin's upload)
- `sessions/` — Session handoff notes and implementation reports
- `_bmad/docs/` — BMAD outputs (brief, PRD, architecture) — **not yet created**

## Domain Context

### ERIC System
- Algorithm-based reporting using Excel data trees on Azure
- **Data flow:** Variable File → Data Trees → Input Forms → Report
- **Report structure:** 4 levels — Dashboard → Management Themes → Variables → Business Unit Drill-down
- **Baseline system:** Previous period = 100, current period = rate of change
- **Colour coding:** Green (>=100), Yellow (95-99), Red (<95)
- **Cell references:** Data uses cell references NOT labels — labels only in graphs. Keep as-is for Phase 1.
- **Management themes:** Clients, Service Delivery, Management & Governance, People & Culture, Risk

### Three-Tier Permission Model
- **Administrator** (Bill Batt): manage risks, variables, users; authorise reports
- **Data Contributors** (MAST staff): input own data only
- **Board Members**: read-only access to reports

## Technical Decisions (Open)

| Decision | Status | Notes |
|----------|--------|-------|
| Database | Blocked | Azure vs Supabase AU — awaiting validation |
| Standalone vs tenant | Open | Discuss at deep-dive |
| Frontend | Likely React | Team competency |
| Authentication | Open | Supabase Auth / WorkOS / Custom |
| Cell references | **Decided** | Keep as-is (Phase 1) |
| Report generation | Open | Server-side PDF / client export |
| Domain | Open | Martin to decide |

## Infrastructure Requirements
- **Australian server hosting** — mandatory for government entity
- **Own domain** — not EricSFM.com, not Jigsaw
- **Data sovereignty** — all data on Australian servers

## Team
- **Nicolas** — Project Manager, PRD author
- **Martin** — Domain expert, CEO, holds all ERIC documentation
- **Pradeep** — Backend developer, Azure validation
- **Tanjim** — Frontend developer

## Key Blockers (Pre-BMAD)
1. Martin's MAST workflow document (not yet written)
2. Pradeep's Azure formula validation (not yet started)
3. ERIC documentation (only on Martin's machine)
4. Martin's questionnaire answers (24 questions pending)

## Related Repos
- **Jigsaw 2.0** (`nicopt-io/Jigsaw-2.0`): Client case files at `OBS_notes/Jigsaw20/clients/mast/`
- **ERIC 1.5 PRD**: Reference PRD at `_bmad/eric-1.5/docs/prd/PRD.md` in Jigsaw 2.0 repo

## Communication Preferences

- Spanish conversations: Respond in Spanish, technical terms in English
- English conversations: Respond fully in English
- Use Australian English spelling (colour, organisation, initialise)

### REGLA CRITICA: Español sin voseo argentino
**NUNCA usar voseo argentino.** Nicolas habla español neutro/chileno.
- **PROHIBIDO**: "necesitás", "tenés", "querés", "podés"
- **CORRECTO**: "necesitas", "tienes", "quieres", "puedes"
