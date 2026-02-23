# BMAD Integration Brief

> **Source:** CPF Team AM Feature Register, 23 February 2026
> **Target Repo:** `~/Jigsaw-1.6-RSA/`
> **BMAD Commands:** `.claude/commands/` (67 workflows ready)
> **Generated:** 2026-02-23

---

## 1. Current BMAD State

| Artefact | Status | Detail |
|----------|--------|--------|
| `project-context.md` | Complete | 69 rules, last updated 22 Feb 2026 (Session 87) |
| Brainstorming output | Complete | 56 ideas across 2 sessions (16 Feb 2026), dashboard architecture + auth/multi-tenancy designed |
| Feature Register | First input created | 48 items (40 from 23 Feb CPF Team AM meeting + 8 authentication architecture items) |
| Planning artefacts (PRD) | Empty | `_bmad-output/planning-artifacts/` contains no files |
| Architecture document | Empty | No architecture artefact generated |
| Epics & Stories | Empty | No epics or stories generated |
| Sprint tracking | None | No `sprint-status.yaml` exists |
| Implementation artefacts | Empty | `_bmad-output/implementation-artifacts/` contains no files |

**Summary:** The project has strong context documentation and brainstorming output, but the entire BMAD planning pipeline (PRD, architecture, epics, stories, sprints) has not been started. The Feature Register is the first structured input that bridges meeting findings into the pipeline.

---

## 2. Why We Cannot Create the PRD Yet

The PRD requires a comprehensive feature map as its primary input. Creating it now would be premature for these reasons:

1. **Feature mapping is incomplete** -- The 23 Feb meeting is the first systematic feature audit. It captured 40 items, but these represent only what was discussed in a single 90-minute session. Known gaps include export capabilities (PDF, image, Excel), client-facing features (onboarding flow, client dashboard, branding), performance requirements, and mobile/responsive design.

2. **Screen-by-screen feature audit is pending** -- DOC-003 assigns Pradeep and Tanjim to screenshot every URL and document expected vs actual behaviour for every feature. This exercise will surface features not yet catalogued and is a prerequisite for the PRD.

3. **Additional meetings will produce more features** -- Upcoming team sessions (PM meetings, client prep, RA Tas debrief) will generate Feature Register v2, v3, etc. Each register adds items the PRD must account for.

4. **Export capabilities need proper scoping** -- Session 87 mentions "Enhanced Excel export" but the meeting identified PDF format issues, image export, and Excel formatting as unscoped gaps. These are core user workflows (brainstorming idea #28: "Excel export is the #1 actual user action") that need definition before the PRD.

5. **Architectural decisions from the brainstorming (16 Feb) need reconciliation** -- The brainstorming output proposes a three-layer information architecture, AI engine, and dashboard concept. The Feature Register reveals the current system cannot reliably save data. The PRD must bridge the gap between vision and current reality.

**When to trigger the PRD:** Once the screen-by-screen mapping (DOC-003) is complete and at least two Feature Registers have been accumulated, the inputs will be comprehensive enough for `/bmad prd Create`.

---

## 3. Immediate Priority: Critical Fix Triage

Before the full BMAD pipeline, these fixes unblock a running Jigsaw 1.6 for the Monday RA Tas demo. Each can be executed as a BMAD quick-dev story (`/bmad quick-dev`) without a full PRD.

### Group 1: Data Sync (blocks everything)

Data sync failures make the entire application unusable. No other work matters if edits do not persist.

| ID | Issue | Priority | Owner |
|----|-------|----------|-------|
| BUG-002 | Real-time sync failure -- Delivery Culture Dimension nodes (edits do not persist, data reverts) | Critical | Pradeep |
| BUG-003 | Real-time sync failure -- System Context & Challenge nodes (same as BUG-002, architectural) | Critical | Pradeep |
| BUG-008 | Stale data on node reopen (old data displayed before updating to current values) | High | Pradeep |
| INFRA-001 | Two-database investigation -- audit Convex data against Supabase export for integrity gaps | Critical | Pradeep, Nicolas |

### Group 2: Auth & Session

Authentication and session issues affect security and first-impression experience.

| ID | Issue | Priority | Owner |
|----|-------|----------|-------|
| BUG-001 | Homepage URL returns 404 when logged out (no landing page) | Critical | Pradeep |
| BUG-006 | Session persistence -- users remain logged in after closing browser (security concern) | High | Pradeep |
| BUG-010 | WorkOS auth rendering race condition (frontend renders before auth script completes) | Medium | Nicolas |
| FEAT-001 | Logged-out landing page (proper branded page for unauthenticated visitors) | Critical | Tanjim |
| FEAT-002 | Logout button (visible, accessible sign-out in the UI) | High | Tanjim |
| FEAT-003 | "Keep me logged in" toggle (session persistence choice) | High | Pradeep |

### Group 3: UI Breaks

Broken UI modes that will be visible during any client demo.

| ID | Issue | Priority | Owner |
|----|-------|----------|-------|
| BUG-004 | Colour mode completely non-functional (selecting produces no visible effect) | Critical | Tanjim |
| BUG-005 | Add System sidebar button broken (stopped working after weekend DB changes) | Critical | Tanjim |
| BUG-007 | No save-confirmation visual feedback (no colour change, success/failure indicator) | High | Tanjim |
| BUG-009 | Permission conflation -- org-level vs system-level access (Super Admin for one org grants it for all) | High | Nicolas |
| UI-005 | Systems dropdown rendering (may have issues after DB changes) | Medium | Tanjim |

### Group 4: Authentication Architecture (Channel Partner Model)

These items require architecture decisions BEFORE implementation:

| Register ID | Item | Priority |
|-------------|------|----------|
| ADR-009 | Four-tier role hierarchy | Critical |
| ADR-010 | Channel entity as first-class table | High |
| ADR-011 | Channel-scoped organisation visibility | Critical |
| ADR-012 | Invite-only viewer onboarding | High |
| FEAT-008 | Channel Partner role implementation | Critical |
| FEAT-009 | Channel management admin page | High |
| FEAT-010 | Invitation system for viewers | High |
| FEAT-011 | System-level role differentiation | Medium (future) |

**Note:** Group 4 items CANNOT be executed via quick-dev. They require formal architecture via `/bmad create-architecture` because they change the fundamental permission model.

---

## 4. BMAD Execution Sequence

### Step 0: Complete Feature Mapping (ongoing, across meetings)

- Accumulate Feature Registers from each team meeting
- Merge into a comprehensive feature map once DOC-003 (screen-by-screen audit) is complete
- **No BMAD command** -- this is a manual documentation exercise
- **Status:** In progress (Feature Register v1 created 23 Feb)

### Step 1: Critical Fix Triage (NOW)

- Execute Groups 1, 2, and 3 from Section 3 above
- **BMAD command:** `/bmad quick-dev` (file: `bmad-bmm-quick-dev.md`)
- Each fix becomes a quick-dev story with acceptance criteria
- No PRD required -- these are targeted bug fixes and missing baseline features
- **Target:** Today (23 Feb) for critical items; this week (28 Feb) for high items

> **Exception:** Authentication architecture items (Group 4) must go through Step 3 (Architecture) before implementation. These change the fundamental data model and cannot be treated as quick fixes. The BMAD create-architecture workflow should specifically address the four-tier role model as a primary architectural decision.

### Step 2: Create PRD

- **BMAD command:** `/bmad prd Create` (file: `bmad-bmm-create-prd.md`)
- **When:** Once feature map is comprehensive (DOC-003 complete + 2+ Feature Registers)
- **Inputs:**
  - All Feature Registers (merged) from `team-sessions-february-2026/`
  - Brainstorming output from `_bmad-output/brainstorming/brainstorming-session-2026-02-16.md`
  - Project context from `_bmad-output/project-context.md`
  - Session handoff files from `sessions/SESSION-*.md`
- **Output:** `_bmad-output/planning-artifacts/prd/`

### Step 3: Create Architecture

- **BMAD command:** `/bmad create-architecture` (file: `bmad-bmm-create-architecture.md`)
- **Inputs:** PRD from Step 2
- **Key decisions to address:**
  - Role architecture -- four-tier model: Super Admin / Channel Partner / Admin / Viewer (ADR-001, ADR-009, ADR-010, ADR-011, ADR-012)
  - Channel entity and channel-scoped organisation visibility (FEAT-008, FEAT-009, FEAT-010)
  - Data sync strategy (Convex real-time, resolve BUG-002/003 root cause)
  - Export pipeline (PDF, image, Excel -- known gap)
  - Org-vs-system permission separation (BUG-009, ADR-001, FEAT-011)
  - Feature branch pipeline (ADR-008, INFRA-003)
- **Output:** `_bmad-output/planning-artifacts/architecture/`

### Step 4: Create Epics & Stories

- **BMAD command:** `/bmad create-epics-and-stories` (file: `bmad-bmm-create-epics-and-stories.md`)
- **Inputs:** PRD + Architecture from Steps 2-3
- **Output:** `_bmad-output/planning-artifacts/epics/`

### Step 5: Sprint Planning

- **BMAD command:** `/bmad sprint-planning` (file: `bmad-bmm-sprint-planning.md`)
- Generates `sprint-status.yaml`
- Prioritisation based on register priorities (Critical > High > Medium > Low)
- **Output:** Sprint plan with stories assigned to sprints

### Step 6: Story Execution

- **BMAD command:** `/bmad dev-story` (file: `bmad-bmm-dev-story.md`)
- Execute stories per sprint plan
- Each story follows the full BMAD dev workflow with acceptance criteria verification
- **Additional support:** `/bmad code-review` (file: `bmad-bmm-code-review.md`) for PR reviews

---

## 5. Proposed Epic Structure (Preliminary)

These epics are derived from the Feature Register categories and will be refined when the PRD is created.

### Epic 1: Critical Bug Fixes -- Get Jigsaw 1.6 Running Reliably

Restore basic functionality so the application is demo-ready and edits persist.

| Register Items |
|----------------|
| BUG-001 (Homepage 404), BUG-002 (Delivery Culture sync), BUG-003 (System Context sync), BUG-004 (Colour mode broken), BUG-005 (Add System broken), BUG-006 (Session persistence), BUG-007 (No save feedback), BUG-008 (Stale data on reopen), BUG-009 (Permission conflation), BUG-010 (WorkOS race condition) |

### Epic 2: Authentication & Session Management

Deliver a secure, predictable authentication experience with proper session handling.

| Register Items |
|----------------|
| FEAT-001 (Landing page), FEAT-002 (Logout button), FEAT-003 ("Keep me logged in"), BUG-004 (Colour mode -- may be auth-related state issue), ADR-001 (Three-tier roles) |

### Epic 3: UI Polish & UX Improvements

Resolve visual inconsistencies and deliver a polished user experience across all modes.

| Register Items |
|----------------|
| UI-001 (Rename to "Strategic Management System"), UI-002 (KPI field redundancy in non-edit modes), UI-003 (Arrow buttons in wrong modes), UI-004 (Performance vs Stage redundancy), UI-005 (Systems dropdown rendering), FEAT-004 (Save confirmation feedback), FEAT-005 (Undo / go-back), FEAT-007 (Add System popup/modal) |

### Epic 4: Export Capabilities

Deliver professional-grade export for the primary user workflow (view in app, download formatted output).

| Register Items |
|----------------|
| Known gap -- PDF format, image export, Excel formatting (referenced in Section 9 of Feature Register and brainstorming idea #28 and #30) |

### Epic 5: Role & Permission Architecture

Implement the three-tier permission model with proper org-vs-system isolation.

| Register Items |
|----------------|
| ADR-001 (Three-tier roles), ADR-002 (No multi-system per client yet), ADR-006 (Focus on Logic Model only), ADR-007 (Invite-only access), BUG-009 (Permission conflation), FEAT-006 (Invite-only viewer access) |

### Epic 6: Documentation & Process

Establish the documentation foundation that unblocks all architecture and feature work.

| Register Items |
|----------------|
| DOC-001 (Build PRD), DOC-002 (Bug documentation with screenshots), DOC-003 (Screen-by-screen feature mapping), DOC-004 (Role architecture specification), DOC-005 (Review weekend commits) |

### Epic 7: Infrastructure & QA

Build the development and testing infrastructure to prevent regressions and protect demo-readiness.

| Register Items |
|----------------|
| INFRA-001 (Two-database investigation), INFRA-002 (Staging environment), INFRA-003 (Feature-branch pipeline), INFRA-004 (QA checklist for demo), INFRA-005 (End-to-end demo verification) |

### Epic 8: Authentication Architecture -- Four-Tier Role Model (CRITICAL)

Implement the channel partner authentication model that replaces the existing three-tier role hierarchy with a four-tier model, introducing the Channel Partner role and channel-scoped visibility.

**Phase 1: Channel entity + channel_partner role (schema + permissions)**
- ADR-009, ADR-010, ADR-011, FEAT-008
- Files: `convex/schema.ts`, `convex/lib/permissions.ts`, `convex/organisations.ts`, `convex/systems.ts`

**Phase 2: Invite-only viewer onboarding**
- ADR-012, FEAT-010
- Files: `convex/schema.ts` (invitations table), new `convex/invitations.ts`, frontend invite UI

**Phase 3: Channel management admin page**
- FEAT-009
- Files: `app/admin/channels/page.tsx` (new), `convex/channels.ts` (new)

**Phase 4: System-level roles (future)**
- FEAT-011, BUG-009
- Files: `convex/schema.ts` (systemMemberships), `convex/lib/permissions.ts`

### Future Epics (from upcoming meetings)

- Epic 9+: Items from Feature Register v2, v3
- Dashboard features (brainstorming ideas #1-#30)
- AI engine (passive narrator + active advisor)
- Client portal vs admin portal separation
- Advanced export (PDF, slides, print-ready)

---

## 6. Source Traceability

Every register item mapped to its proposed epic, BMAD workflow step, and current status.

### Critical Bugs

| Register ID | Priority | Proposed Epic | BMAD Workflow Step | Status |
|-------------|----------|---------------|-------------------|--------|
| BUG-001 | Critical | Epic 1 | Step 1: `/bmad quick-dev` | Can proceed now |
| BUG-002 | Critical | Epic 1 | Step 1: `/bmad quick-dev` | Can proceed now |
| BUG-003 | Critical | Epic 1 | Step 1: `/bmad quick-dev` | Can proceed now |
| BUG-004 | Critical | Epic 1 | Step 1: `/bmad quick-dev` | Can proceed now |
| BUG-005 | Critical | Epic 1 | Step 1: `/bmad quick-dev` | Can proceed now |
| BUG-006 | High | Epic 1 | Step 1: `/bmad quick-dev` | Can proceed now |
| BUG-007 | High | Epic 1 | Step 1: `/bmad quick-dev` | Can proceed now |
| BUG-008 | High | Epic 1 | Step 1: `/bmad quick-dev` | Can proceed now |
| BUG-009 | High | Epic 5 | Step 1: `/bmad quick-dev` (fix) + Step 3: architecture (design) | Fix can proceed now; full design blocked by PRD |
| BUG-010 | Medium | Epic 1 | Step 1: `/bmad quick-dev` | Can proceed now |

### Missing Features

| Register ID | Priority | Proposed Epic | BMAD Workflow Step | Status |
|-------------|----------|---------------|-------------------|--------|
| FEAT-001 | Critical | Epic 2 | Step 1: `/bmad quick-dev` | Can proceed now |
| FEAT-002 | High | Epic 2 | Step 1: `/bmad quick-dev` | Can proceed now |
| FEAT-003 | High | Epic 2 | Step 1: `/bmad quick-dev` | Can proceed now |
| FEAT-004 | High | Epic 3 | Step 1: `/bmad quick-dev` | Can proceed now |
| FEAT-005 | Low | Epic 3 | Step 4: `/bmad create-epics-and-stories` | Blocked by PRD (needs A-B testing decision) |
| FEAT-006 | High | Epic 5 | Step 3: `/bmad create-architecture` | Blocked by PRD (requires role architecture design) |
| FEAT-007 | Medium | Epic 3 | Step 1: `/bmad quick-dev` | Can proceed now (Tanjim has partial implementation) |

### UI/Visual Changes

| Register ID | Priority | Proposed Epic | BMAD Workflow Step | Status |
|-------------|----------|---------------|-------------------|--------|
| UI-001 | High | Epic 3 | Step 1: `/bmad quick-dev` | Can proceed now (simple text change) |
| UI-002 | Medium | Epic 3 | Step 2: `/bmad prd Create` | Blocked by PRD (needs mode-behaviour decision) |
| UI-003 | Medium | Epic 3 | Step 2: `/bmad prd Create` | Blocked by PRD (needs mode-behaviour decision) |
| UI-004 | High | Epic 3 | Step 2: `/bmad prd Create` | Blocked by PRD (needs Performance vs Stage resolution) |
| UI-005 | Medium | Epic 3 | Step 1: `/bmad quick-dev` | Can proceed now (may resolve with BUG-005) |

### Architectural Decisions

| Register ID | Priority | Proposed Epic | BMAD Workflow Step | Status |
|-------------|----------|---------------|-------------------|--------|
| ADR-001 | High | Epic 5 | Step 3: `/bmad create-architecture` | Blocked by PRD (documented in project-context.md but not implemented) |
| ADR-002 | Medium | Epic 5 | Step 3: `/bmad create-architecture` | Blocked by PRD (scope deferral -- no action needed now) |
| ADR-003 | Low | -- | None (scope removal) | Complete -- Agent Canvas removed from scope |
| ADR-004 | Medium | -- | None (scope deferral) | Complete -- portfolios deferred until core is stable |
| ADR-005 | Medium | Epic 7 | Step 1: `/bmad quick-dev` | Can proceed now (process change, no code) |
| ADR-006 | High | -- | None (scope constraint) | Active constraint -- focus on Logic Model view only |
| ADR-007 | High | Epic 5 | Step 3: `/bmad create-architecture` | Blocked by PRD (requires invitation flow design) |
| ADR-008 | Critical | Epic 7 | Step 1: `/bmad quick-dev` | Can proceed now (process enforcement) |

### Documentation & Process

| Register ID | Priority | Proposed Epic | BMAD Workflow Step | Status |
|-------------|----------|---------------|-------------------|--------|
| DOC-001 | Critical | Epic 6 | Step 2: `/bmad prd Create` | Blocked by feature mapping (DOC-002, DOC-003) |
| DOC-002 | High | Epic 6 | Step 0: manual | Can proceed now |
| DOC-003 | High | Epic 6 | Step 0: manual | Can proceed now |
| DOC-004 | High | Epic 6 | Step 3: `/bmad create-architecture` | Blocked by PRD |
| DOC-005 | Medium | Epic 6 | Step 0: manual | Can proceed now |

### Infrastructure & QA

| Register ID | Priority | Proposed Epic | BMAD Workflow Step | Status |
|-------------|----------|---------------|-------------------|--------|
| INFRA-001 | Critical | Epic 7 | Step 1: `/bmad quick-dev` | Can proceed now |
| INFRA-002 | High | Epic 7 | Step 1: `/bmad quick-dev` | Can proceed now |
| INFRA-003 | High | Epic 7 | Step 1: `/bmad quick-dev` | Can proceed now |
| INFRA-004 | Medium | Epic 7 | Step 0: manual | Can proceed now |
| INFRA-005 | Low | Epic 7 | Step 0: manual | Blocked by bug fixes (BUG-001 through BUG-005) |

### Authentication Architecture (Channel Partner Model)

| Register ID | Priority | Proposed Epic | BMAD Workflow Step | Status |
|-------------|----------|---------------|-------------------|--------|
| ADR-009 | Critical | Epic 8 | Step 3: `/bmad create-architecture` | Blocked by architecture |
| ADR-010 | High | Epic 8 | Step 3: `/bmad create-architecture` | Blocked by architecture |
| ADR-011 | Critical | Epic 8 | Step 3: `/bmad create-architecture` | Blocked by architecture |
| ADR-012 | High | Epic 8 | Step 3: `/bmad create-architecture` | Blocked by architecture |
| FEAT-008 | Critical | Epic 8 Phase 1 | Step 3: architecture → Step 4: epics | Blocked by architecture |
| FEAT-009 | High | Epic 8 Phase 3 | Step 4: `/bmad create-epics-and-stories` | Blocked by FEAT-008 |
| FEAT-010 | High | Epic 8 Phase 2 | Step 4: `/bmad create-epics-and-stories` | Blocked by architecture |
| FEAT-011 | Medium | Epic 8 Phase 4 | Step 4: epics (future) | Blocked by FEAT-008 |

### Traceability Summary

| Status | Count | Items |
|--------|-------|-------|
| Can proceed now | 26 | BUG-001--008, BUG-010, FEAT-001--004, FEAT-007, UI-001, UI-005, ADR-005, ADR-008, DOC-002, DOC-003, DOC-005, INFRA-001--004 |
| Blocked by PRD | 8 | BUG-009 (design), FEAT-005, FEAT-006, UI-002, UI-003, UI-004, DOC-001, DOC-004 |
| Blocked by architecture | 6 | ADR-009, ADR-010, ADR-011, ADR-012, FEAT-008, FEAT-010 |
| Blocked by FEAT-008 | 2 | FEAT-009, FEAT-011 |
| Blocked by bug fixes | 1 | INFRA-005 |
| Scope decisions (no action) | 3 | ADR-003, ADR-004, ADR-006 |
| Blocked by PRD (architecture) | 2 | ADR-001, ADR-002, ADR-007 |
| **Total** | **48** | |

---

## 7. BMAD Execution Target

| Parameter | Value |
|-----------|-------|
| **Repo** | `~/Jigsaw-1.6-RSA/` |
| **BMAD commands** | `.claude/commands/` (67 workflows) |
| **Output directory** | `_bmad-output/planning-artifacts/` |
| **Project context** | `_bmad-output/project-context.md` (69 rules, 22 Feb 2026) |
| **Brainstorming** | `_bmad-output/brainstorming/brainstorming-session-2026-02-16.md` (56 ideas) |
| **BMAD config** | `_bmad/bmm/config.yaml` |
| **Package manager** | `pnpm` (NEVER npm/yarn) |
| **Deploy** | Vercel (auto-deploy on push to `main`) |
| **Convex** | `npx convex dev --once` (separate from Vercel deploy) |
| **Production URL** | `https://jigsaw-1-6-rsa.vercel.app` |
| **Feature Register** | `~/Jigsaw_2.0_dev/OBS_notes/Jigsaw20/team-sessions-february-2026/23-02/2026-02-23-cpf-team-am/FEATURE_REGISTER.md` |
| **Session handoffs** | `~/Jigsaw-1.6-RSA/sessions/SESSION-*.md` (sessions 80-87+) |

### Key BMAD Command Files

| Workflow | Command File | Purpose |
|----------|-------------|---------|
| Quick dev fix | `bmad-bmm-quick-dev.md` | Bug fixes and small features without full PRD |
| Create PRD | `bmad-bmm-create-prd.md` | Generate Product Requirements Document |
| Create architecture | `bmad-bmm-create-architecture.md` | Generate architecture document from PRD |
| Create epics & stories | `bmad-bmm-create-epics-and-stories.md` | Generate epics and user stories from PRD + architecture |
| Sprint planning | `bmad-bmm-sprint-planning.md` | Generate sprint plan and `sprint-status.yaml` |
| Sprint status | `bmad-bmm-sprint-status.md` | Update and track sprint progress |
| Dev story | `bmad-bmm-dev-story.md` | Execute a single story with full BMAD workflow |
| Code review | `bmad-bmm-code-review.md` | Review code changes against story requirements |
| Implementation readiness | `bmad-bmm-check-implementation-readiness.md` | Verify all prerequisites before starting implementation |

---

## 8. Next Steps (Actionable)

### Today (23 Feb)

1. **Verify the 4 "needs verification" bugs against live app** -- BUG-001, BUG-002, BUG-003, BUG-004 were claimed resolved by Session 87 but demonstrated broken in the meeting. Test at `https://jigsaw-1-6-rsa.vercel.app` to confirm current state.

2. **Execute Group 1 critical fixes via `/bmad quick-dev`** -- Start with BUG-002 and BUG-003 (data sync) as they block everything. Each fix as a separate quick-dev story on a feature branch (ADR-008).

3. **Execute Group 3 UI fixes via `/bmad quick-dev`** -- BUG-004 (colour mode) and BUG-005 (Add System) are critical for demo-readiness. Tanjim's existing branch may have recoverable work for FEAT-007.

4. **DOC-005: All developers review weekend commits** -- Prerequisite for all bug fix work. Understand the auth debugging and database changes before touching code.

### This Week (by 28 Feb)

5. **Complete screen-by-screen feature mapping (DOC-003)** -- Pradeep and Tanjim screenshot every URL, document expected vs actual behaviour. This is the primary input for the PRD.

6. **Complete bug documentation with screenshots (DOC-002)** -- Each developer produces a document with URLs, reproduction steps, and screenshots for their assigned bugs.

7. **Process next meeting's findings into Feature Register v2** -- Apply the same register format to the PM meeting and any other sessions this week.

8. **Execute remaining high-priority fixes** -- BUG-006, BUG-007, FEAT-002, FEAT-004, UI-001 via `/bmad quick-dev`.

### When Feature Map Is Comprehensive

9. **Trigger `/bmad prd Create`** -- Feed all Feature Registers + brainstorming output + project-context.md into the PRD workflow. This unblocks the entire BMAD pipeline (architecture, epics, stories, sprints).

10. **Follow the BMAD execution sequence** -- Steps 3 through 6 in order: architecture, epics, sprint planning, story execution.

### Authentication Architecture (pre-requisite for Epic 8)

11. **Decide on four-tier authentication model formally** -- Architecture decision required before PRD. The shift from three-tier (Super Admin / Admin / Viewer) to four-tier (Super Admin / Channel Partner / Admin / Viewer) is a fundamental permission model change that must be resolved through `/bmad create-architecture`.

12. **Research best practices for channel/partner isolation in multi-tenant SaaS** -- Investigate patterns for scoped visibility (channel partners see only their assigned organisations), invitation flows, and role hierarchy in comparable platforms.

13. **Document channel partner use cases** -- Danny as first channel partner candidate. Define what a channel partner sees, what they can do, and how organisation assignment works in practice.

---

*Generated from BMAD Integration Brief workflow, 23 February 2026*
*Input: Feature Register v1 (40 items) + Authentication Architecture Register (8 items) + project-context.md (69 rules) + brainstorming output (56 ideas) + BMAD config*
