# 06 — MAST Deep-Dive Session Agenda

> **Duration**: 90 minutes
> **Attendees**: Nicolas (facilitator), Martin (domain), Pradeep (backend), Tanjim (frontend)
> **Prerequisites**: Martin's workflow document (R02), Pradeep's Azure findings (T1–T2)
> **Goal**: Collect all remaining information needed to write the MAST brief and PRD

---

## Pre-Session Checklist

Before scheduling this session, confirm:

- [ ] Martin has completed his MAST workflow document (at least 24h before)
- [ ] Pradeep has completed T1 (Azure DB separation) and T2 (formula export assessment)
- [ ] Martin's questionnaire answers (04_MARTIN_QUESTIONNAIRE.md) are received (at minimum categories A and D)
- [ ] ERIC documentation folders are shared (or Martin can screen-share them live)
- [ ] All attendees have read: 01_CURRENT_WORKFLOW.md and 02_TARGET_WORKFLOW.md

**If Martin's workflow document is not ready 24 hours before the session, postpone the session.** (Per recommendation R02.)

---

## Agenda

### Block 1: Current State Walkthrough [15 min] — 0:00–0:15

**Lead**: Martin
**Objective**: Full end-to-end demonstration of the MAST reporting cycle.

**Martin to cover**:
- Walk through a complete MAST reporting cycle (trigger → input → validation → report)
- Show the variable file (live if possible)
- Show the data tree structure
- Show an actual generated report (PDF or live)
- Explain what validation steps happen before a report is approved

**Team actions**:
- Pradeep: take notes on data structure, formulas, and connections
- Tanjim: take notes on UI/UX elements and report visualisation format
- Nicolas: take notes on workflow gaps compared to 01_CURRENT_WORKFLOW.md

**Output**: Validated current-state workflow; gaps in 01_CURRENT_WORKFLOW.md filled.

---

### Block 2: Azure Investigation Findings [15 min] — 0:15–0:30

**Lead**: Pradeep
**Objective**: Present technical findings from investigations T1–T6.

**Pradeep to cover**:
- T1: Is the MAST/ERIC Azure DB separate from Jigsaw? (answer with evidence)
- T2: Can formulas be exported without data loss? (results and any issues)
- T3/T4: Variable file and data tree mapping progress (schema diagrams if ready)
- T5: Supabase AU pricing and compliance assessment
- T6: Cell-reference preservation test results (if available)

**Team actions**:
- Martin: validate Pradeep's findings against his domain knowledge
- Nicolas: note any architecture implications
- Tanjim: note any frontend implications

**Output**: Clear picture of migration feasibility and data integrity status.

---

### Block 3: Review ERIC Documentation [15 min] — 0:30–0:45

**Lead**: Martin
**Objective**: Walk through ERIC source code, DataTrees, and user guide.

**Martin to cover**:
- Overview of ERIC folder structure (source code, DataTrees, user guide)
- Identify which files are MAST-specific vs shared across clients
- Walk through the user guide's key sections
- Identify any documentation gaps

**Team actions**:
- Pradeep: identify technical components to replicate
- Tanjim: identify UI patterns and report templates
- Nicolas: ensure documentation index (`ERIC_DOCUMENTATION_INDEX.md`) is complete

**Output**: Complete inventory of ERIC documentation; reference index updated.

---

### Block 4: Confirm Target Workflow and Permissions [15 min] — 0:45–1:00

**Lead**: Nicolas
**Objective**: Validate the proposed target workflow and permission model.

**Review together**:
- Walk through 02_TARGET_WORKFLOW.md — confirm or adjust each element
- Validate the three-tier permission model (Administrator / Contributors / Board)
- Confirm Bill Batt as administrator — what exactly does he need to do?
- Discuss "authorise report generation" — what does the workflow look like?
- Identify any missing user stories or edge cases

**Questions to resolve**:
1. Does the proposed target workflow accurately reflect MAST's needs?
2. Are there any additional permissions or roles needed?
3. Should report history be maintained (all versions) or overwritten?
4. Does MAST need any notification system (e.g., "new report available")?

**Output**: Validated and corrected target workflow; confirmed permission model.

---

### Block 5: Architecture Decision Discussion [15 min] — 1:00–1:15

**Lead**: Nicolas (with Pradeep's input)
**Objective**: Make (or narrow) the 7 open technical decisions.

**Decisions to address** (from 03_TECHNICAL_STACK.md):

| # | Decision | Aim for This Session |
|---|----------|---------------------|
| 1 | Database: Azure vs Supabase AU | **Decide** (based on Pradeep's findings) |
| 2 | Standalone vs Jigsaw 1.6 tenant | **Decide** or narrow to 2 options |
| 3 | Frontend framework | **Confirm** React |
| 4 | Authentication system | **Narrow** to 2 options |
| 5 | Cell references | Already decided (keep for Phase 1) |
| 6 | Report generation method | **Decide** (based on Martin's report demo) |
| 7 | Domain | **Collect** Martin's preference |

**Output**: At least 4 of 7 decisions made; remaining 3 narrowed with clear criteria for final decision.

---

### Block 6: Task Assignment and Timeline [15 min] — 1:15–1:30

**Lead**: Nicolas
**Objective**: Assign pre-PRD tasks and set realistic timeline.

**Agenda items**:
1. Review 13 March deadline against realistic scope
2. Define what "done" means by 13 March (brief? PRD? architecture plan? production?)
3. Assign remaining tasks:
   - Who writes the brief?
   - Who writes the PRD?
   - What must happen before architecture begins?
4. Set dates for each milestone
5. Identify remaining blockers and assign owners

**Output**: Clear task assignments with dates; shared understanding of what 13 March delivers.

---

## Post-Session Actions

After the session, Nicolas will:

1. Update 01_CURRENT_WORKFLOW.md with validated information
2. Update 02_TARGET_WORKFLOW.md with any corrections
3. Update 03_TECHNICAL_STACK.md with decisions made
4. Begin writing the MAST brief (using BMAD methodology)
5. Update CASE_STATUS.yaml with new status

---

## Session Rules

- **No tangents**: If a topic emerges that's not MAST-related, note it and move on
- **Time-boxed**: Each block has 15 minutes — facilitator enforces
- **Decision-oriented**: Every block ends with a clear output or decision
- **Record**: Session should be recorded (Fathom) for reference
- **Documentation over memory**: Everything discussed must be captured in writing

---

## Fallback Plan

If key prerequisites are not met:

| Missing Prerequisite | Fallback |
|---------------------|----------|
| Martin's workflow doc not ready | Postpone session; Martin walks through verbally in a shorter call instead |
| Pradeep's Azure findings not ready | Skip Block 2; add 15 min to Block 1; schedule separate technical session |
| ERIC docs not shared | Martin screen-shares during Block 3; team takes screenshots |
| Attendee unavailable | Reschedule — all four team members are required |
