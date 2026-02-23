# BMAD Integration Brief — Cleaned for PRD Pipeline

> **Source:** CPF Team AM + PM Feature Register (consolidated), 23 February 2026
> **Target Repo:** `~/Jigsaw-1.6-RSA/`
> **BMAD Commands:** `.claude/commands/` (67 workflows ready)
> **Generated:** 2026-02-23
> **Last Updated:** 2026-02-23 (v3 — cleaned for BMAD pipeline entry)
> **Owner:** Nicolas + Claudia (AI orchestrator)

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
| Orchestrator config | Ready | `_bmad-output/metrics/orchestrator-config.yaml` initialised |
| Pipeline state | Ready | `_bmad-output/metrics/pipeline-state.yaml` — Phase 2 (planning) |

**Summary:** The project has strong context documentation and brainstorming output. The Feature Register v2 (~96 items) is the comprehensive structured input ready for the PRD pipeline. All implementation is done by Nicolas + Claudia (AI orchestrator) — no external dev team dependency.

---

## 2. Pipeline Entry Decision

Feature Register v2 + brainstorming output + project-context.md are comprehensive enough to proceed directly to `/bmad prd Create`. No additional prerequisites needed.

**Rationale:**
- Feature Register captures ~96 items from a full-day systematic audit (AM + PM sessions)
- Brainstorming output provides strategic vision (56 ideas including dashboard architecture, AI engine, information architecture)
- project-context.md has 69 rules documenting the current system state
- Screenshot documentation (DOC-003) is deferred — available as visual reference but not required for PRD creation. Processing screenshots burns context on vision tokens for minimal additional signal.

**Pipeline sequence:** PRD → Architecture → Epics → Sprint Planning → Story Execution

---

## 3. Feature Register — All Items by Category

### Bugs (20 items)

| ID | Issue | Priority |
|----|-------|----------|
| BUG-001 | Homepage URL returns 404 when logged out (no landing page) | Critical |
| BUG-002 | Real-time sync failure — Delivery Culture Dimension nodes (edits do not persist, data reverts) | Critical |
| BUG-003 | Real-time sync failure — System Context & Challenge nodes (same root cause as BUG-002) | Critical |
| BUG-004 | Colour mode completely non-functional (selecting produces no visible effect) | Critical |
| BUG-005 | Add System sidebar button broken (stopped working after DB changes) | Critical |
| BUG-006 | Session persistence — users remain logged in after closing browser (security concern) | High |
| BUG-007 | No save-confirmation visual feedback (no colour change, success/failure indicator) | High |
| BUG-008 | Stale data on node reopen (old data displayed before updating to current values) | High |
| BUG-009 | Permission conflation — org-level vs system-level access (Super Admin for one org grants it for all) | High |
| BUG-010 | WorkOS auth rendering race condition (frontend renders before auth script completes) | Medium |
| BUG-011 | Sign-out redirects to Jigsaw error page instead of sign-in page | High |
| BUG-012 | Delete functionality broken across ALL models | Critical |
| BUG-013 | Add-node (plus) button broken in edit mode at end of row | High |
| BUG-014 | "Unknown" organisation display — RA Tas and CPF show as "unknown" in system dropdown | High |
| BUG-015 | Duplicate sign-in buttons visible in the UI simultaneously | Medium |
| BUG-016 | Export buttons non-functional — JSON export and input import buttons broken | High |
| BUG-017 | Data isolation bug — new system shows other clients' data | Critical |
| BUG-018 | Development Pathways — all modes broken (commercial blocker) | Critical |
| BUG-019 | Favicon shows v0 placeholder instead of Jigsaw branding | Low |
| BUG-020 | "Connected to Convex real-time" indicator displayed as line in middle of UI | Low |

### Features (21 items)

| ID | Feature | Priority |
|----|---------|----------|
| FEAT-001 | Logged-out landing page (proper branded page for unauthenticated visitors) | Critical |
| FEAT-002 | Logout button (visible, accessible sign-out in the UI) | High |
| FEAT-003 | "Keep me logged in" toggle (session persistence choice) | High |
| FEAT-004 | Save confirmation feedback (visual indicator for save success/failure) | High |
| FEAT-005 | Undo / go-back functionality | Low |
| FEAT-006 | Invite-only viewer access | High |
| FEAT-007 | Add System popup/modal (improved system creation UX) | Medium |
| FEAT-008 | Channel Partner role implementation (four-tier auth model) | Critical |
| FEAT-009 | Channel management admin page | High |
| FEAT-010 | Invitation system for viewers | High |
| FEAT-011 | System-level role differentiation | Medium (future) |
| FEAT-012 | Excel export — Jigsaw structural layout (not flat table) + PDF and image export | High |
| FEAT-013 | Dynamic theming (Brutalism, New York, Dark styles via shadcn) | Low |
| FEAT-014 | Font size dynamic editing per node (small/medium/large) | Low |
| FEAT-015 | Accessibility improvements | Medium |
| FEAT-016 | Email communication flow (welcome, credentials, download-ready, change notifications) | Medium |
| FEAT-017 | User role display beneath username | Medium |
| FEAT-018 | Placeholder guidance text for empty fields | Medium |
| FEAT-019 | Different node colour for empty vs filled fields | Medium |
| FEAT-020 | Proper Jigsaw logo with jigsaw piece shape | Medium |
| FEAT-021 | Notification/confirmation system (in-app notification infrastructure) | Medium |

### UI/Visual Changes (14 items)

| ID | Change | Priority |
|----|--------|----------|
| UI-001 | Rename to "Strategic Management System" | High |
| UI-002 | KPI field redundancy in non-edit modes | Medium |
| UI-003 | Arrow buttons in wrong modes | Medium |
| UI-004 | Performance vs Stage redundancy | High |
| UI-005 | Systems dropdown rendering issues | Medium |
| UI-006 | Consolidate two sign-in buttons into one | Medium |
| UI-007 | Show user role beneath username | Medium |
| UI-008 | Replace favicon with Jigsaw branding | Low |
| UI-009 | Create proper Jigsaw logo | Low |
| UI-010 | Remove/reposition Convex indicator | Low |
| UI-011 | Node colour for empty vs filled fields | Medium |
| UI-012 | Placeholder guidance text | Medium |
| UI-013 | Dynamic theming — multiple theme options | Low |
| UI-014 | Font size editing per node | Low |

### Architectural Decisions (18 items)

| ID | Decision | Priority | Status |
|----|----------|----------|--------|
| ADR-001 | Role hierarchy — evolving from three-tier to four-tier model | High | Requires architecture |
| ADR-002 | No multi-system per client yet (scope deferral) | Medium | Complete — deferred |
| ADR-003 | Agent Canvas removed from scope | Low | Complete — removed |
| ADR-004 | Portfolios deferred until core is stable | Medium | Complete — deferred |
| ADR-005 | Feature branch workflow enforcement | Medium | Process decision |
| ADR-006 | Focus on Logic Model view only (scope constraint) | High | Active constraint |
| ADR-007 | Invite-only access model | High | Requires architecture |
| ADR-008 | All changes through BMAD pipeline | Critical | Process established |
| ADR-009 | Four-tier role hierarchy (Super Admin / Channel Partner / Admin / Viewer) | Critical | Requires architecture |
| ADR-010 | Channel entity as first-class table | High | Requires architecture |
| ADR-011 | Channel-scoped organisation visibility | Critical | Requires architecture |
| ADR-012 | Invite-only viewer onboarding flow | High | Requires architecture |
| ADR-013 | Colour mode KPI health thresholds | High | Blocked by Martin's input |
| ADR-014 | All changes through BMAD pipeline | Critical | Complete — established |
| ADR-015 | QuickDev items can proceed without full PRD | High | Superseded — full pipeline chosen |
| ADR-016 | Two-step verification explicitly rejected | Medium | Complete — decided |
| ADR-017 | Cross-model breakage is architectural — root cause is lack of prior architecture, not a specific DB failure. App was built reactively without architectural design. | Critical | To be addressed by `/bmad create-architecture` |
| ADR-018 | No relevant code in other branches/repos to extract. All working implementation is in main branch of Jigsaw 1.6 RSA repo. | High | Complete — clarified |

### Documentation & Process (5 items)

| ID | Item | Priority | Status |
|----|------|----------|--------|
| DOC-001 | Build PRD | Critical | Next step — `/bmad prd Create` |
| DOC-002 | Bug documentation with screenshots | High | Reference available (Pradeep's PDF) |
| DOC-003 | Screen-by-screen feature mapping | High | Deferred — not prerequisite for PRD |
| DOC-004 | Role architecture specification | High | Will be generated by `/bmad create-architecture` |
| DOC-005 | Review weekend commits | Medium | Covered by project-context.md |

### Infrastructure & QA (6 items — cleaned)

| ID | Item | Priority |
|----|------|----------|
| INFRA-002 | Staging environment | High |
| INFRA-003 | Feature-branch pipeline | High |
| INFRA-004 | QA checklist for demo | Medium |
| INFRA-005 | End-to-end demo verification | Low |
| INFRA-006 | QA gate for BMAD pipeline output | Critical |
| INFRA-007 | Knowledge documentation (capture existing system knowledge) | Medium |

**Removed:** INFRA-001 (two-database investigation — Supabase is removed, only Convex), INFRA-008 (branch extraction — no relevant external branches)

---

## 4. BMAD Execution Sequence

### Step 1: Create PRD (NOW)

- **BMAD command:** `/bmad prd Create`
- **Inputs:**
  - Feature Register v2 (~96 items) — this document, Section 3
  - Brainstorming output from `_bmad-output/brainstorming/brainstorming-session-2026-02-16.md`
  - Project context from `_bmad-output/project-context.md`
  - Current Convex schema (`convex/schema.ts`) and permissions engine (`convex/lib/permissions.ts`) as existing system context
- **Output:** `_bmad-output/planning-artifacts/prd/`

### Step 2: Validate PRD

- **BMAD command:** `/bmad validate-prd`
- **Gate:** Pattern B (Scoring) — SMART ≥ 3.0, holistic ≥ 3, completeness ≥ 75%
- **Ideally:** different model than creator (or at minimum, fresh session)

### Step 3: Create Architecture

- **BMAD command:** `/bmad create-architecture`
- **Inputs:** PRD + project-context.md + current Convex schema/permissions
- **Key decisions to address:**
  - Four-tier role model: Super Admin / Channel Partner / Admin / Viewer (ADR-009, ADR-010, ADR-011, ADR-012)
  - Channel entity and channel-scoped organisation visibility (FEAT-008, FEAT-009, FEAT-010)
  - Cross-model data architecture — design proper patterns for multi-model CRUD (ADR-017)
  - Export pipeline: Excel (Jigsaw structural layout), PDF, image (FEAT-012)
  - Org-vs-system permission separation (BUG-009, FEAT-011)
  - Real-time sync patterns with Convex (BUG-002, BUG-003, BUG-008)
- **Output:** `_bmad-output/planning-artifacts/architecture/`

### Step 4: Validate Architecture

- **BMAD command:** `/bmad validate-architecture`
- **Gate:** Pattern B (Scoring)

### Step 5: Create Epics & Stories

- **BMAD command:** `/bmad create-epics-and-stories`
- **Inputs:** PRD + Architecture
- **Output:** `_bmad-output/planning-artifacts/epics/`

### Step 6: Validate Epics

- **BMAD command:** `/bmad validate-epics`
- **Gate:** Pattern B (Scoring)

### Step 7: Implementation Readiness Check

- **BMAD command:** `/bmad check-implementation-readiness`
- **Gate:** Pattern A (Checklist) — PRD + Architecture + Epics aligned

### Step 8: Sprint Planning

- **BMAD command:** `/bmad sprint-planning`
- **Output:** `sprint-status.yaml`
- **Prioritisation:** Critical > High > Medium > Low

### Step 9: Story Execution Loop

- **BMAD commands:** `/bmad create-story` → `/bmad validate-story` → `/bmad dev-story` → `/bmad code-review`
- Each story follows CS → VS → DS → CR cycle
- Code review MUST be separate session from dev story
- Max 3 CR iterations before human escalation

---

## 5. Proposed Epic Structure (Preliminary — to be refined by PRD)

### Epic 1: Core Stability & Bug Fixes (merged with permissions fixes)

Restore basic functionality: data persistence, CRUD operations, session handling, permission isolation.

| Register Items |
|----------------|
| BUG-001 through BUG-020 (all bugs), BUG-009 (permission conflation — tactical fix), ADR-017 (architectural root cause) |

### Epic 2: Authentication & Session Management

Secure, predictable authentication with proper session handling.

| Register Items |
|----------------|
| FEAT-001 (Landing page), FEAT-002 (Logout button), FEAT-003 ("Keep me logged in"), ADR-001 (role hierarchy) |

### Epic 3: UI Polish & UX Improvements

Visual consistency and polished user experience across all modes.

| Register Items |
|----------------|
| UI-001 through UI-014 (all UI items), FEAT-004 (Save feedback), FEAT-005 (Undo), FEAT-007 (Add System modal), FEAT-017 (Role display), FEAT-018 (Placeholder text), FEAT-019 (Node colour) |

### Epic 4: Export Capabilities

Professional-grade export: Excel (Jigsaw structural layout), PDF, image.

| Register Items |
|----------------|
| FEAT-012 (Full export suite), BUG-016 (Fix broken export buttons) |

### Epic 5: Authentication Architecture — Four-Tier Role Model (CRITICAL)

Channel partner model replacing three-tier hierarchy. Requires architecture phase completion first.

**Phase 1:** Channel entity + channel_partner role (schema + permissions) — ADR-009, ADR-010, ADR-011, FEAT-008
**Phase 2:** Invite-only viewer onboarding — ADR-012, FEAT-010
**Phase 3:** Channel management admin page — FEAT-009
**Phase 4:** System-level roles (future) — FEAT-011

| Register Items |
|----------------|
| ADR-001, ADR-007, ADR-009, ADR-010, ADR-011, ADR-012, FEAT-006, FEAT-008, FEAT-009, FEAT-010, FEAT-011 |

### Epic 6: Infrastructure & QA

Development infrastructure, testing, and regression prevention.

| Register Items |
|----------------|
| INFRA-002 (Staging), INFRA-003 (Feature branches), INFRA-004 (QA checklist), INFRA-005 (E2E verification), INFRA-006 (QA gate), ADR-005 (Branch workflow), ADR-008 (BMAD pipeline enforcement) |

### Epic 7: Email & Notification System

User communication and in-app notification delivery.

| Register Items |
|----------------|
| FEAT-016 (Email flows), FEAT-021 (Notification infrastructure), BUG-007 (Save feedback — proper solution) |

### Epic 8: Onboarding & Visual Guidance

New user experience, empty states, and guidance cues.

| Register Items |
|----------------|
| BUG-017 (Data isolation — proper empty state), FEAT-018 (Placeholder text), FEAT-019 (Node colour for empty/filled), UI-011, UI-012 |

### Epic 9: Theming & Branding

Premium visual identity and user-configurable theming.

| Register Items |
|----------------|
| FEAT-013 (Dynamic theming), FEAT-014 (Font size), FEAT-020 (Jigsaw logo), BUG-019 (Favicon), UI-008, UI-009, UI-013, UI-014 |

### Future Epics (from upcoming meetings)

- Dashboard features (brainstorming ideas #1-#30)
- AI engine (passive narrator + active advisor)
- Client portal vs admin portal separation

---

## 6. Existing System Context

### Current Tech Stack
- **Frontend:** Next.js 16 + React 19 + TypeScript
- **Backend:** Convex (real-time) — NO Supabase
- **Auth:** WorkOS AuthKit
- **Deployment:** Vercel (auto-deploy on push to main) + Convex cloud
- **Package manager:** pnpm (NEVER npm/yarn)

### Current Convex Schema (summary)
- `organisations` — client orgs with status, soft delete
- `users` — synced from WorkOS (workosId, email, name)
- `memberships` — user ↔ org bridge with role (super_admin/admin/viewer)
- `systems` — core strategic planning units with orgId tenancy
- `elements` — outcomes, value_chain, resources per system
- `matrixCells` — contribution, development, convergence matrices
- `kpis` — linked to elements
- `capabilities` — current/necessary per resource
- `externalValues` — convergence map columns
- `factors` — per value chain element
- `auditLogs` — compliance trail
- `portfolios` — linked to elements (deferred feature)

### Current Permission Model
- Three-tier: super_admin / admin / viewer
- Org-scoped via memberships table
- Super admin sees all orgs (global access)
- Legacy systems (no orgId) accessible to all authenticated users
- Write access requires admin or super_admin in system's org

### Active Clients
Central Highlands Council (Tasmania), Relationships Australia, Kiraa, MERA, Levur, Illawarra Energy Storage — 7 orgs seeded

### Production
- URL: https://jigsaw-1-6-rsa.vercel.app
- Convex deployment: hidden-fish-6

---

## 7. BMAD Execution Target

| Parameter | Value |
|-----------|-------|
| **Repo** | `~/Jigsaw-1.6-RSA/` |
| **BMAD commands** | `.claude/commands/` (67 workflows) |
| **Output directory** | `_bmad-output/planning-artifacts/` |
| **Project context** | `_bmad-output/project-context.md` (69 rules) |
| **Brainstorming** | `_bmad-output/brainstorming/brainstorming-session-2026-02-16.md` (56 ideas) |
| **BMAD config** | `_bmad/bmm/config.yaml` |
| **Orchestrator config** | `_bmad-output/metrics/orchestrator-config.yaml` |
| **Pipeline state** | `_bmad-output/metrics/pipeline-state.yaml` |
| **Feature Register** | `~/Jigsaw_2.0_dev/OBS_notes/Jigsaw20/team-sessions-february-2026/23-02/FEATURE_REGISTER.md` |
| **Package manager** | `pnpm` (NEVER npm/yarn) |
| **Deploy** | Vercel (auto-deploy on push to `main`) |
| **Convex** | `npx convex dev --once` (separate from Vercel deploy) |
| **Production URL** | `https://jigsaw-1-6-rsa.vercel.app` |

---

*Cleaned version of BMAD Integration Brief, 23 February 2026*
*Changes from v2: Removed Section 2 (PRD prerequisite contradiction), updated ownership to Nicolas + Claudia, removed INFRA-001/INFRA-008/ADR-018, merged Epic 1 + Epic 5 into consolidated Epic 1, added existing system context section, updated pipeline sequence to start with PRD immediately.*
