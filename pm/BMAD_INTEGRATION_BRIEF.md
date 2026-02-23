# BMAD Integration Brief

> **Source:** CPF Team AM + PM Feature Register (consolidated), 23 February 2026
> **Target Repo:** `~/Jigsaw-1.6-RSA/`
> **BMAD Commands:** `.claude/commands/` (67 workflows ready)
> **Generated:** 2026-02-23
> **Last Updated:** 2026-02-23 (v2 — consolidated AM + PM)

---

## 1. Current BMAD State

| Artefact | Status | Detail |
|----------|--------|--------|
| `project-context.md` | Complete | 69 rules, last updated 22 Feb 2026 (Session 87) |
| Brainstorming output | Complete | 56 ideas across 2 sessions (16 Feb 2026), dashboard architecture + auth/multi-tenancy designed |
| Feature Register | v2 consolidated | ~96 items across 7 categories (20 bugs, 21 features, 14 UI, 18 ADRs, 5 docs, 8 infra, 10 risks) — consolidated from AM + PM sessions on 23 Feb 2026. Located at `~/Jigsaw_2.0_dev/OBS_notes/Jigsaw20/team-sessions-february-2026/23-02/FEATURE_REGISTER.md` |
| Planning artefacts (PRD) | Empty | `_bmad-output/planning-artifacts/` contains no files |
| Architecture document | Empty | No architecture artefact generated |
| Epics & Stories | Empty | No epics or stories generated |
| Sprint tracking | None | No `sprint-status.yaml` exists |
| Implementation artefacts | Empty | `_bmad-output/implementation-artifacts/` contains no files |

**Summary:** The project has strong context documentation and brainstorming output, but the entire BMAD planning pipeline (PRD, architecture, epics, stories, sprints) has not been started. The Feature Register v2 is the consolidated structured input (from both AM and PM sessions) that bridges meeting findings into the pipeline.

---

## 2. Why We Cannot Create the PRD Yet

The PRD requires a comprehensive feature map as its primary input. Creating it now would be premature for these reasons:

1. **Feature mapping is incomplete** -- The 23 Feb meeting is the first systematic feature audit. The consolidated register captured ~96 items across AM and PM sessions, but these represent only what was discussed in a single day. Known gaps include performance requirements, mobile/responsive design, and full client-facing features (onboarding flow, client dashboard, branding).

2. **Screen-by-screen feature audit is pending** -- DOC-003 assigns Pradeep and Tanjim to screenshot every URL and document expected vs actual behaviour for every feature. This exercise will surface features not yet catalogued and is a prerequisite for the PRD.

3. **Additional meetings will produce more features** -- Upcoming team sessions (client prep, RA Tas debrief) will generate Feature Register v3, etc. Each register adds items the PRD must account for.

4. **Export capabilities need proper scoping** -- Session 87 mentions "Enhanced Excel export" but the meeting identified PDF format issues, image export, and Excel formatting as unscoped gaps. FEAT-012 now defines Excel as "Jigsaw structural layout, not flat table" plus PDF and image export. These are core user workflows (brainstorming idea #28: "Excel export is the #1 actual user action") that need definition before the PRD.

5. **Architectural decisions from the brainstorming (16 Feb) need reconciliation** -- The brainstorming output proposes a three-layer information architecture, AI engine, and dashboard concept. The Feature Register reveals the current system cannot reliably save data. The PRD must bridge the gap between vision and current reality.

6. **PM session confirmed architectural root cause (ADR-017)** -- Cross-model breakage (delete, edit, colour, real-time sync) stems from a shared database layer failure, not individual bugs. This architectural insight must inform the PRD's technical approach.

**When to trigger the PRD:** Once the screen-by-screen mapping (DOC-003) is complete and the architectural root cause (ADR-017) has been investigated, the inputs will be comprehensive enough for `/bmad prd Create`.

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
| BUG-013 | Add-node (plus) button broken in edit mode at end of row | High | BMAD pipeline |
| BUG-014 | "Unknown" organisation display -- RA Tas and CPF show as "unknown" in system dropdown | High | BMAD pipeline |
| BUG-016 | Export buttons non-functional -- JSON export and input import buttons broken | High | BMAD pipeline |
| INFRA-001 | Two-database investigation -- audit Convex data against Supabase export for integrity gaps | Critical | Pradeep, Nicolas |

### Group 2: Auth & Session

Authentication and session issues affect security and first-impression experience.

| ID | Issue | Priority | Owner |
|----|-------|----------|-------|
| BUG-001 | Homepage URL returns 404 when logged out (no landing page) | Critical | Pradeep |
| BUG-006 | Session persistence -- users remain logged in after closing browser (security concern) | High | Pradeep |
| BUG-010 | WorkOS auth rendering race condition (frontend renders before auth script completes) | Medium | Nicolas |
| BUG-011 | Sign-out redirects to Jigsaw error page instead of sign-in page | High | BMAD pipeline |
| BUG-015 | Duplicate sign-in buttons visible in the UI simultaneously | Medium | BMAD pipeline |
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
| BUG-019 | Favicon shows v0 placeholder instead of Jigsaw branding | Low | BMAD pipeline |
| BUG-020 | "Connected to Convex real-time" indicator displayed as line in middle of UI | Low | BMAD pipeline |
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

### Group 5: Cross-Model Architecture (blocks Groups 1-3 partially)

The PM session identified that many bugs across Groups 1-3 share a common architectural root cause. These items address the systemic failure rather than individual symptoms.

| ID | Issue | Priority |
|----|-------|----------|
| BUG-012 | Delete functionality broken across ALL models | Critical |
| BUG-017 | Data isolation bug -- new system shows other clients' data | Critical |
| BUG-018 | Development Pathways -- all modes broken (RA Tas commercial blocker) | Critical |
| ADR-017 | Cross-model breakage is architectural (shared DB layer failure) | Critical |
| ADR-018 | Tanjim's branch as reference implementation | High |
| INFRA-008 | Extract Tanjim's working branch code | Critical |

**Note:** Group 5 should be investigated BEFORE executing QuickDev on Groups 1-3, as many items may share a root cause. The PM session confirmed that delete, edit, colour, and real-time sync failures across ALL models point to a shared database layer failure (ADR-017), not individual bugs.

---

## 4. BMAD Execution Sequence

### Step 0: Complete Feature Mapping (ongoing, across meetings)

- Accumulate Feature Registers from each team meeting
- Merge into a comprehensive feature map once DOC-003 (screen-by-screen audit) is complete
- **No BMAD command** -- this is a manual documentation exercise
- **Status:** In progress (Feature Register v2 created 23 Feb — consolidated AM + PM, ~96 items)

### Step 1: Critical Fix Triage (NOW)

- Execute Groups 1, 2, and 3 from Section 3 above
- **Important:** Investigate Group 5 (cross-model architecture) BEFORE running QuickDev on Groups 1-3
- **BMAD command:** `/bmad quick-dev` (file: `bmad-bmm-quick-dev.md`)
- Each fix becomes a quick-dev story with acceptance criteria
- No PRD required -- these are targeted bug fixes and missing baseline features
- **Target:** Today (23 Feb) for critical items; this week (28 Feb) for high items

> **Exception:** Authentication architecture items (Group 4) must go through Step 3 (Architecture) before implementation. These change the fundamental data model and cannot be treated as quick fixes. The BMAD create-architecture workflow should specifically address the four-tier role model as a primary architectural decision.

### Step 2: Create PRD

- **BMAD command:** `/bmad prd Create` (file: `bmad-bmm-create-prd.md`)
- **When:** Once feature map is comprehensive (DOC-003 complete + architectural root cause investigated)
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
  - Cross-model database layer architecture (ADR-017, BUG-012, BUG-018)
  - Export pipeline (PDF, image, Excel -- FEAT-012)
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
| BUG-001 (Homepage 404), BUG-002 (Delivery Culture sync), BUG-003 (System Context sync), BUG-004 (Colour mode broken), BUG-005 (Add System broken), BUG-006 (Session persistence), BUG-007 (No save feedback), BUG-008 (Stale data on reopen), BUG-009 (Permission conflation), BUG-010 (WorkOS race condition), BUG-011 (Sign-out redirect to error page), BUG-012 (Delete broken across ALL models), BUG-013 (Add-node broken), BUG-014 (Unknown org display), BUG-015 (Duplicate sign-in buttons), BUG-016 (Export buttons broken), BUG-017 (Data isolation — new system shows other clients' data), BUG-018 (Dev Pathways — all modes broken), BUG-019 (Favicon placeholder), BUG-020 (Convex indicator line in UI) |

### Epic 2: Authentication & Session Management

Deliver a secure, predictable authentication experience with proper session handling.

| Register Items |
|----------------|
| FEAT-001 (Landing page), FEAT-002 (Logout button), FEAT-003 ("Keep me logged in"), BUG-004 (Colour mode -- may be auth-related state issue), ADR-001 (Three-tier roles) |

### Epic 3: UI Polish & UX Improvements

Resolve visual inconsistencies and deliver a polished user experience across all modes.

| Register Items |
|----------------|
| UI-001 (Rename to "Strategic Management System"), UI-002 (KPI field redundancy in non-edit modes), UI-003 (Arrow buttons in wrong modes), UI-004 (Performance vs Stage redundancy), UI-005 (Systems dropdown rendering), UI-006 (Consolidate two sign-in buttons), UI-007 (Show user role beneath username), UI-008 (Replace favicon with Jigsaw branding), UI-009 (Create proper Jigsaw logo), UI-010 (Remove/reposition Convex indicator), UI-011 (Node colour for empty vs filled fields), UI-012 (Placeholder guidance text), UI-013 (Dynamic theming), UI-014 (Font size editing per node), FEAT-004 (Save confirmation feedback), FEAT-005 (Undo / go-back), FEAT-007 (Add System popup/modal), FEAT-017 (User role display beneath username), FEAT-018 (Placeholder guidance text for empty fields), FEAT-019 (Different node colour for empty vs filled) |

### Epic 4: Export Capabilities

Deliver professional-grade export for the primary user workflow (view in app, download formatted output).

| Register Items |
|----------------|
| FEAT-012 (Excel export — Jigsaw structural layout, not flat table — plus PDF and image export), BUG-016 (Export buttons non-functional — JSON export and import broken) |

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
| INFRA-001 (Two-database investigation), INFRA-002 (Staging environment), INFRA-003 (Feature-branch pipeline), INFRA-004 (QA checklist for demo), INFRA-005 (End-to-end demo verification), INFRA-006 (QA gate for BMAD pipeline output), INFRA-007 (Knowledge transfer — Pradeep and Tanjim), INFRA-008 (Tanjim's branch extraction) |

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

### Epic 9: Email Communication & Notification System

Build the infrastructure for user communication and in-app notification delivery.

| Register Items |
|----------------|
| FEAT-016 (Email communication flow — welcome, credentials, download-ready, change notifications), FEAT-021 (Notification/confirmation system — in-app notification infrastructure for save confirmations and system events), BUG-007 (No save-confirmation visual feedback — related as the immediate symptom that the notification system addresses) |

### Epic 10: Onboarding & Visual Guidance

Ensure new users and new systems display correctly and provide guidance cues during first use.

| Register Items |
|----------------|
| BUG-017 (Data isolation — new system shows other clients' data instead of empty placeholders), FEAT-018 (Placeholder guidance text for empty fields), FEAT-019 (Different node colour for empty vs filled fields), UI-011 (Node colour for empty vs filled — visual onboarding cue), UI-012 (Placeholder guidance text — contextual hints for onboarding) |

### Epic 11: Theming & Branding

Deliver premium visual identity and user-configurable theming.

| Register Items |
|----------------|
| FEAT-013 (Dynamic theming — Brutalism, New York, Dark styles via shadcn), FEAT-014 (Font size dynamic editing per node — small/medium/large), FEAT-020 (Proper Jigsaw logo with jigsaw piece shape), BUG-019 (Favicon shows v0 placeholder), UI-008 (Replace favicon with Jigsaw branding), UI-009 (Create proper Jigsaw logo), UI-013 (Dynamic theming — multiple theme options), UI-014 (Font size editing per node) |

### Future Epics (from upcoming meetings)

- Dashboard features (brainstorming ideas #1-#30)
- AI engine (passive narrator + active advisor)
- Client portal vs admin portal separation

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
| BUG-007 | High | Epic 1, Epic 9 | Step 1: `/bmad quick-dev` | Can proceed now |
| BUG-008 | High | Epic 1 | Step 1: `/bmad quick-dev` | Can proceed now |
| BUG-009 | High | Epic 5 | Step 1: `/bmad quick-dev` (fix) + Step 3: architecture (design) | Fix can proceed now; full design blocked by PRD |
| BUG-010 | Medium | Epic 1 | Step 1: `/bmad quick-dev` | Can proceed now |
| BUG-011 | High | Epic 1 | Step 1: `/bmad quick-dev` | Can proceed now |
| BUG-012 | Critical | Epic 1 | Step 1: `/bmad quick-dev` | Blocked by architectural investigation (ADR-017) |
| BUG-013 | High | Epic 1 | Step 1: `/bmad quick-dev` | Can proceed now |
| BUG-014 | High | Epic 1 | Step 1: `/bmad quick-dev` | Can proceed now |
| BUG-015 | Medium | Epic 1 | Step 1: `/bmad quick-dev` | Can proceed now |
| BUG-016 | High | Epic 1, Epic 4 | Step 1: `/bmad quick-dev` | Can proceed now |
| BUG-017 | Critical | Epic 1, Epic 10 | Step 1: `/bmad quick-dev` | Blocked by architectural investigation (ADR-017) |
| BUG-018 | Critical | Epic 1 | Step 1: `/bmad quick-dev` | Blocked by architectural investigation (ADR-017) |
| BUG-019 | Low | Epic 1, Epic 11 | Step 1: `/bmad quick-dev` | Can proceed now |
| BUG-020 | Low | Epic 1 | Step 1: `/bmad quick-dev` | Can proceed now |

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
| FEAT-008 | Critical | Epic 8 Phase 1 | Step 3: architecture → Step 4: epics | Blocked by architecture |
| FEAT-009 | High | Epic 8 Phase 3 | Step 4: `/bmad create-epics-and-stories` | Blocked by FEAT-008 |
| FEAT-010 | High | Epic 8 Phase 2 | Step 4: `/bmad create-epics-and-stories` | Blocked by architecture |
| FEAT-011 | Medium | Epic 8 Phase 4 | Step 4: epics (future) | Blocked by FEAT-008 |
| FEAT-012 | High | Epic 4 | Step 2: `/bmad prd Create` | Blocked by PRD |
| FEAT-013 | Low | Epic 11 | Step 2: `/bmad prd Create` | Blocked by PRD |
| FEAT-014 | Low | Epic 11 | Step 2: `/bmad prd Create` | Blocked by PRD |
| FEAT-015 | Medium | Epic 3 | Step 2: `/bmad prd Create` | Blocked by PRD |
| FEAT-016 | Medium | Epic 9 | Step 2: `/bmad prd Create` | Blocked by PRD |
| FEAT-017 | Medium | Epic 3 | Step 1: `/bmad quick-dev` | Can proceed now |
| FEAT-018 | Medium | Epic 3, Epic 10 | Step 1: `/bmad quick-dev` | Can proceed now |
| FEAT-019 | Medium | Epic 3, Epic 10 | Step 2: `/bmad prd Create` | Blocked by PRD |
| FEAT-020 | Medium | Epic 11 | Step 2: design | Blocked by design |
| FEAT-021 | Medium | Epic 9 | Step 2: `/bmad prd Create` | Blocked by PRD |

### UI/Visual Changes

| Register ID | Priority | Proposed Epic | BMAD Workflow Step | Status |
|-------------|----------|---------------|-------------------|--------|
| UI-001 | High | Epic 3 | Step 1: `/bmad quick-dev` | Can proceed now (simple text change) |
| UI-002 | Medium | Epic 3 | Step 2: `/bmad prd Create` | Blocked by PRD (needs mode-behaviour decision) |
| UI-003 | Medium | Epic 3 | Step 2: `/bmad prd Create` | Blocked by PRD (needs mode-behaviour decision) |
| UI-004 | High | Epic 3 | Step 2: `/bmad prd Create` | Blocked by PRD (needs Performance vs Stage resolution) |
| UI-005 | Medium | Epic 3 | Step 1: `/bmad quick-dev` | Can proceed now (may resolve with BUG-005) |
| UI-006 | Medium | Epic 3 | Step 1: `/bmad quick-dev` | Can proceed now (cross-ref: BUG-015) |
| UI-007 | Medium | Epic 3 | Step 1: `/bmad quick-dev` | Can proceed now (cross-ref: FEAT-017) |
| UI-008 | Low | Epic 11 | Step 1: `/bmad quick-dev` | Can proceed now (cross-ref: BUG-019) |
| UI-009 | Low | Epic 11 | Step 2: design | Blocked by design (cross-ref: FEAT-020) |
| UI-010 | Low | Epic 3 | Step 1: `/bmad quick-dev` | Can proceed now (cross-ref: BUG-020) |
| UI-011 | Medium | Epic 10 | Step 1: `/bmad quick-dev` | Can proceed now (cross-ref: FEAT-019) |
| UI-012 | Medium | Epic 10 | Step 1: `/bmad quick-dev` | Can proceed now (cross-ref: FEAT-018) |
| UI-013 | Low | Epic 11 | Step 2: `/bmad prd Create` | Blocked by PRD (cross-ref: FEAT-013) |
| UI-014 | Low | Epic 11 | Step 2: `/bmad prd Create` | Blocked by PRD (cross-ref: FEAT-014) |

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
| ADR-009 | Critical | Epic 8 | Step 3: `/bmad create-architecture` | Blocked by architecture |
| ADR-010 | High | Epic 8 | Step 3: `/bmad create-architecture` | Blocked by architecture |
| ADR-011 | Critical | Epic 8 | Step 3: `/bmad create-architecture` | Blocked by architecture |
| ADR-012 | High | Epic 8 | Step 3: `/bmad create-architecture` | Blocked by architecture |
| ADR-013 | High | Epic 3 | Step 1: `/bmad quick-dev` | Blocked by Martin's input (colour mode KPI health thresholds need confirmation) |
| ADR-014 | Critical | -- | None (process decision) | Complete -- process established (all changes through BMAD pipeline) |
| ADR-015 | High | -- | None (process decision) | Complete -- process established (20 QuickDev items can proceed without full PRD) |
| ADR-016 | Medium | -- | None (design decision) | Complete -- decision made (two-step verification explicitly rejected) |
| ADR-017 | Critical | Epic 1 | Step 1: investigation | Investigation needed (cross-model breakage is architectural — shared DB layer failure) |
| ADR-018 | High | Epic 7 | Step 1: branch extraction | Requires branch extraction (Tanjim's branch as reference implementation) |

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
| INFRA-006 | Critical | Epic 7 | Step 0: manual | Can proceed now (requires Martin's input on review process) |
| INFRA-007 | Critical | Epic 7 | Step 0: manual | Can proceed now (urgent — internship ending) |
| INFRA-008 | Critical | Epic 7 | Step 1: branch extraction | Requires branch extraction (Tanjim's working cross-model code) |

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
| Can proceed now | ~35 | BUG-001--008, BUG-010, BUG-011, BUG-013--016, BUG-019--020, FEAT-001--004, FEAT-007, FEAT-017, FEAT-018, UI-001, UI-005--008, UI-010--012, ADR-005, ADR-008, DOC-002, DOC-003, DOC-005, INFRA-001--004, INFRA-006, INFRA-007 |
| Blocked by PRD | ~14 | BUG-009 (design), FEAT-005, FEAT-006, FEAT-012, FEAT-013, FEAT-014, FEAT-015, FEAT-016, FEAT-019, FEAT-021, UI-002, UI-003, UI-004, UI-013, UI-014, DOC-001, DOC-004 |
| Blocked by architecture | ~9 | ADR-009, ADR-010, ADR-011, ADR-012, FEAT-008, FEAT-010, BUG-012, BUG-017, BUG-018 |
| Blocked by FEAT-008 | 2 | FEAT-009, FEAT-011 |
| Blocked by Martin's input | 1 | ADR-013 |
| Blocked by design | 2 | FEAT-020, UI-009 |
| Blocked by bug fixes | 1 | INFRA-005 |
| Investigation needed | 1 | ADR-017 |
| Requires branch extraction | 2 | ADR-018, INFRA-008 |
| Complete -- process established | 2 | ADR-014, ADR-015 |
| Complete -- decision made | 1 | ADR-016 |
| Scope decisions (no action) | 3 | ADR-003, ADR-004, ADR-006 |
| **Total mapped** | **~86** | (excludes RISK items which are tracked separately in the Feature Register) |

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
| **Feature Register** | `~/Jigsaw_2.0_dev/OBS_notes/Jigsaw20/team-sessions-february-2026/23-02/FEATURE_REGISTER.md` |
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
| Dev story | `bmad-bmm-dev-story.md` | Execute a single story with full BMAD dev workflow |
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

7. **Process next meeting's findings into Feature Register v2** -- Apply the same register format to any additional sessions this week.

8. **Execute remaining high-priority fixes** -- BUG-006, BUG-007, FEAT-002, FEAT-004, UI-001 via `/bmad quick-dev`.

9. **Resolve architectural root cause (ADR-017) before full QuickDev execution** -- PM session confirmed that delete, edit, colour, and real-time sync failures across ALL models share a database layer root cause. Execute BMAD architectural investigation before running QuickDev on BUG-012, BUG-017, BUG-018. Use Tanjim's branch (INFRA-008) as reference implementation.

10. **Knowledge transfer from Pradeep and Tanjim (INFRA-007)** -- Internship ending imminently. Extract institutional knowledge on WorkOS integration (Pradeep) and cross-model frontend patterns (Tanjim) before they leave. Complete branch extraction (INFRA-008) and documentation (DOC-002, DOC-003) as the primary transfer vehicles.

### When Feature Map Is Comprehensive

11. **Trigger `/bmad prd Create`** -- Feed all Feature Registers + brainstorming output + project-context.md into the PRD workflow. This unblocks the entire BMAD pipeline (architecture, epics, stories, sprints).

12. **Follow the BMAD execution sequence** -- Steps 3 through 6 in order: architecture, epics, sprint planning, story execution.

### Authentication Architecture (pre-requisite for Epic 8)

13. **Decide on four-tier authentication model formally** -- Architecture decision required before PRD. The shift from three-tier (Super Admin / Admin / Viewer) to four-tier (Super Admin / Channel Partner / Admin / Viewer) is a fundamental permission model change that must be resolved through `/bmad create-architecture`.

14. **Research best practices for channel/partner isolation in multi-tenant SaaS** -- Investigate patterns for scoped visibility (channel partners see only their assigned organisations), invitation flows, and role hierarchy in comparable platforms.

15. **Document channel partner use cases** -- Danny as first channel partner candidate. Define what a channel partner sees, what they can do, and how organisation assignment works in practice.

---

*Generated from BMAD Integration Brief workflow, 23 February 2026*
*Input: Feature Register v2 (~96 items, consolidated AM + PM) + Authentication Architecture Register (8 items) + project-context.md (69 rules) + brainstorming output (56 ideas) + BMAD config*
*Last updated: 23 February 2026 — v2 reflecting consolidated Feature Register*
