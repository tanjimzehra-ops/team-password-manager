---
stepsCompleted:
  - step-01-validate-prerequisites
  - step-02-design-epics
  - step-03-create-stories
  - step-04-final-validation
inputDocuments:
  - prd.md
  - architecture.md
  - project-context.md
  - BMAD_INTEGRATION_BRIEF_CLEAN.md
epicCount: 7
storyCount: 35
---

# Jigsaw 1.6 RSA — Epic & Story Breakdown

## Overview

This document provides the complete epic and story breakdown for Jigsaw 1.6 RSA, decomposing the PRD (42 FRs, 13 NFRs) and Architecture into implementable stories. Each epic is standalone and delivers user value independently.

## Requirements Inventory

### Functional Requirements (42)

FR-001 through FR-042 as defined in the PRD. See PRD Section 6 for full descriptions.

### Non-Functional Requirements (13)

NFR-001 through NFR-013 as defined in the PRD. See PRD Section 7 for full descriptions.

### FR Coverage Map

| Epic | FRs Covered | Primary Value |
|------|-------------|---------------|
| Epic 1 | FR-011–019, FR-021–024, FR-039, FR-042 | Core stability — app works reliably |
| Epic 2 | FR-001–003, FR-036 | Auth & session — users can sign in/out properly |
| Epic 3 | FR-004–010, FR-025–028 | Roles & permissions — four-tier model + invitations |
| Epic 4 | FR-020, FR-032–035 | UX polish — feedback, guidance, branding |
| Epic 5 | FR-029–031 | Export — Excel, PDF, image |
| Epic 6 | FR-037–038 | Infrastructure — pipeline, branches, staging |
| Epic 7 | FR-040–041 | Future (Phase 3) — undo, KPI in nodes |

**Coverage: 42/42 FRs mapped. Zero gaps.**

## Epic List

1. **Epic 1: Core Stability & Cross-Model CRUD** — Fix all data persistence, mode switching, and cross-model bugs
2. **Epic 2: Authentication & Landing Experience** — Landing page, sign-in/out flow, session management
3. **Epic 3: Four-Tier Roles & Invitation System** — Channel partner model, permissions, invitations
4. **Epic 4: UX Polish & Visual Feedback** — Save confirmation, placeholders, branding, indicators
5. **Epic 5: Export Suite** — Excel (Jigsaw layout), PDF, image export
6. **Epic 6: Infrastructure & QA** — Feature branches, staging, BMAD QA gates
7. **Epic 7: Future Enhancements (Phase 3)** — Undo, KPI in nodes, mode consolidation

---

## Epic 1: Core Stability & Cross-Model CRUD

**Goal:** Make the application reliably functional. Every CRUD operation works consistently across all models. Data persists, modes work, no stale data.

**Priority:** CRITICAL — blocks everything else
**Estimated Stories:** 8

**Dependencies:** None (first epic)
**FRs:** FR-011–019, FR-021–024, FR-039, FR-042

---

### Story 1.1: Implement Shared Mutation Layer

As a **developer (AI agent)**,
I want a shared mutation wrapper (`withWriteAccess`) in `convex/lib/mutations.ts`,
So that all CRUD operations have consistent auth gating, error handling, and audit logging.

**Acceptance Criteria:**

**Given** a new file `convex/lib/mutations.ts` does not exist
**When** the shared mutation layer is implemented
**Then** a `withWriteAccess()` function exists that:
- Calls `requireAuth()` to verify user identity
- Calls `requireWriteAccess()` to verify role-based access on the target system
- Wraps the mutation in try/catch with `logAudit()` on success AND failure
- Returns the mutation result on success
- Throws with a user-friendly error message on failure
**And** the function is exported and importable from any Convex mutation file
**And** TypeScript types are correct with no `any` types

**Trace:** FR-039, ADR-017, Architecture Section 5.1

---

### Story 1.2: Refactor Element CRUD to Shared Layer

As a **client admin (Sarah)**,
I want all element operations (create, update, delete) to work reliably with real-time persistence,
So that my strategic data is never lost or corrupted.

**Acceptance Criteria:**

**Given** the shared mutation layer exists (Story 1.1)
**When** elements.ts mutations (create, update, delete) are refactored
**Then** every mutation uses `withWriteAccess()` wrapper
**And** creating an element in edit mode persists immediately and appears in real-time for other users
**And** updating an element (Impact Purpose, Outcomes, Value Chain, Resources) persists within 2 seconds
**And** Delivery Culture Dimension nodes save correctly (BUG-002 regression fixed)
**And** System Context & Challenge nodes save correctly (BUG-003 regression fixed)
**And** reopening a node shows current data with no stale flash (BUG-008 fixed)
**And** audit log entries are created for every mutation

**Trace:** FR-011–016, FR-019, BUG-002, BUG-003, BUG-008

---

### Story 1.3: Refactor Matrix Cell CRUD to Shared Layer

As a **client admin (Sarah)**,
I want matrix cell operations across all matrix types to work consistently,
So that Contribution Map, Development Pathways, and Convergence Map data persists reliably.

**Acceptance Criteria:**

**Given** the shared mutation layer exists (Story 1.1)
**When** matrixCells.ts mutations are refactored
**Then** every mutation uses `withWriteAccess()` wrapper
**And** CRUD operations work for `contribution`, `development`, and `convergence` matrix types
**And** delete mode works across ALL matrix types (BUG-012 fixed)
**And** Development Pathways view/edit/colour/delete modes all function (BUG-018 fixed)
**And** audit log entries are created for every mutation

**Trace:** FR-039, BUG-012, BUG-018

---

### Story 1.4: Refactor Remaining CRUD to Shared Layer

As a **developer (AI agent)**,
I want KPIs, capabilities, externalValues, and factors mutations on the shared layer,
So that the entire data model has consistent auth and error handling.

**Acceptance Criteria:**

**Given** the shared mutation layer exists (Story 1.1)
**When** kpis.ts, capabilities.ts, externalValues.ts, and factors.ts are refactored
**Then** every mutation in these files uses `withWriteAccess()` wrapper
**And** all existing functionality preserved (no regressions)
**And** audit log entries created for every mutation

**Trace:** FR-039

---

### Story 1.5: Fix Add-Node Button in Edit Mode

As a **client admin (Sarah)**,
I want the plus button to add new nodes at any position in a row while in edit mode,
So that I can extend my strategic model without workarounds.

**Acceptance Criteria:**

**Given** the user is in Edit mode on any view
**When** they click the plus (+) button at the end of a row
**Then** a new empty node is created and appended to the row
**And** the node is immediately editable
**And** the new node persists to the database via the shared mutation layer
**And** the plus button works at ALL positions (not just the first)

**Trace:** FR-017, BUG-013

---

### Story 1.6: Implement Mode Controller Component

As a **user (any role)**,
I want to switch between View, Edit, Colour, Order, and Delete modes reliably,
So that each mode shows only its relevant controls.

**Acceptance Criteria:**

**Given** a `components/mode-controller.tsx` component is created
**When** the user switches between modes
**Then** View mode shows read-only content with no inputs or arrows
**And** Edit mode shows editable fields with save button
**And** Colour mode shows KPI health colours (red <70%, orange 70-100%, green 100%) with NO edit inputs or arrows
**And** Order mode shows arrow buttons with NO edit inputs
**And** Delete mode shows delete confirmation with NO edit inputs or arrows
**And** KPI value fields are hidden in non-edit modes
**And** Viewers cannot access Edit, Order, or Delete modes (only View, Colour, and Export)

**Trace:** FR-021, FR-022, FR-023, FR-024, BUG-004, ADR-013

---

### Story 1.7: Fix Data Isolation for New Systems

As a **super admin (Nicolas)**,
I want new systems to initialise with empty placeholder data,
So that creating a test system never exposes another client's data.

**Acceptance Criteria:**

**Given** an admin or super admin creates a new system
**When** the system is created via the Add System flow
**Then** the system has empty elements, no matrix cells, no KPIs
**And** no data from other organisations appears in the new system
**And** the system is correctly scoped to the creating user's organisation
**And** the `orgId` field is always set (no legacy null orgId for new systems)

**Trace:** FR-026, BUG-017

---

### Story 1.8: Performance vs Stage Mode Consolidation

As a **user (any role)**,
I want a single clear Performance mode instead of redundant Performance/Stage modes,
So that I'm not confused by two modes showing the same KPI data.

**Acceptance Criteria:**

**Given** the current redundancy between Performance mode and Stage "Show KPIs"
**When** the modes are consolidated
**Then** a single "Performance" mode exists that shows KPI numerical values inside node cells
**And** the separate "Show KPIs" toggle in Stage mode is removed
**And** the DisplayLogic button redundancy is resolved
**And** colour coding reflects KPI health thresholds (red/orange/green)

**Trace:** FR-042, UI-004, FEAT-015

---

## Epic 2: Authentication & Landing Experience

**Goal:** Users have a smooth authentication experience — professional landing page, working sign-in/out, proper session management.

**Priority:** CRITICAL — first impression for new users
**Estimated Stories:** 5

**Dependencies:** None (can run parallel to Epic 1)
**FRs:** FR-001–003, FR-036

---

### Story 2.1: Create Branded Landing Page

As an **unauthenticated visitor**,
I want to see a professional landing page when I visit Jigsaw,
So that I understand what the product is before signing in.

**Acceptance Criteria:**

**Given** a visitor navigates to the root URL while NOT logged in
**When** the page loads
**Then** a branded landing page displays with:
- "Strategic Management System" heading (UI-001)
- Brief value proposition
- Single prominent "Sign In" button
- Professional Jigsaw branding (not v0 placeholder)
**And** the page does NOT return a 404 error
**And** the page loads within 3 seconds

**Trace:** FR-001, BUG-001, FEAT-001, UI-001

---

### Story 2.2: Fix Sign-Out Flow

As an **authenticated user**,
I want a visible logout button that redirects me to the sign-in page,
So that I can securely end my session.

**Acceptance Criteria:**

**Given** the user is logged in
**When** they click the logout/sign-out button in the header
**Then** their session is terminated via WorkOS
**And** they are redirected to the sign-in page (NOT an error page)
**And** refreshing the page after logout does NOT restore the session
**And** the logout button is visible and accessible in the header at all times

**Trace:** FR-002, BUG-011, FEAT-002

---

### Story 2.3: Implement "Keep Me Logged In" Toggle

As a **user (any role)**,
I want to choose whether my session persists after closing the browser,
So that I control the balance between convenience and security.

**Acceptance Criteria:**

**Given** the sign-in page
**When** the user signs in with "Keep me logged in" checked
**Then** closing and reopening the browser maintains the session
**When** the user signs in WITHOUT "Keep me logged in"
**Then** closing the browser terminates the session
**And** the default is "Keep me logged in" = false (secure by default)

**Trace:** FR-003, BUG-006, FEAT-003

---

### Story 2.4: Consolidate Sign-In Buttons

As a **visitor**,
I want to see a single, clear sign-in button,
So that I'm not confused by duplicate login options.

**Acceptance Criteria:**

**Given** the landing page or any unauthenticated view
**When** the page renders
**Then** exactly ONE sign-in button is visible
**And** no duplicate sign-in buttons appear anywhere in the UI
**And** the button is prominently positioned (top-right or center CTA)

**Trace:** FR-036, BUG-015, UI-006

---

### Story 2.5: Fix WorkOS Auth Race Condition

As a **user (any role)**,
I want the page to render only after authentication is confirmed,
So that I don't see flickering or partial UI while auth loads.

**Acceptance Criteria:**

**Given** a user navigates to any authenticated page
**When** the page is loading
**Then** a loading state is shown until `useConvexAuth()` returns `isAuthenticated`
**And** no frontend components render with undefined user data
**And** no race condition between WorkOS JWT and Convex auth

**Trace:** BUG-010, Architecture Section 6.3

---

## Epic 3: Four-Tier Roles & Invitation System

**Goal:** Implement the channel partner model with proper permission isolation and invitation-only onboarding.

**Priority:** HIGH — enables scalable growth via channel partners
**Estimated Stories:** 7

**Dependencies:** Epic 1 (shared mutation layer for consistent auth)
**FRs:** FR-004–010, FR-025–028

---

### Story 3.1: Add Channels Table and Evolve Role Validator

As a **developer (AI agent)**,
I want the Convex schema to support channels and the channel_partner role,
So that the four-tier permission model has a data foundation.

**Acceptance Criteria:**

**Given** the current schema has 3 roles and no channels table
**When** schema changes are deployed
**Then** a `channels` table exists with: name, slug, contactEmail, status, createdBy, deletedAt
**And** the roleValidator includes `channel_partner` alongside super_admin, admin, viewer
**And** `organisations` table has a new optional `channelId` field (v.optional(v.id("channels")))
**And** a new index `by_channel` exists on organisations
**And** existing data is unaffected (all new fields are optional)
**And** `npx convex dev --once` runs without errors

**Trace:** FR-004, Architecture Section 3.1

---

### Story 3.2: Add Invitations Table

As a **developer (AI agent)**,
I want an invitations table for token-based user onboarding,
So that admins can invite viewers securely.

**Acceptance Criteria:**

**Given** no invitations table exists
**When** the schema is deployed
**Then** an `invitations` table exists with: email, orgId, role, token, status, invitedBy, expiresAt, acceptedAt, deletedAt
**And** indexes exist for: by_token, by_email, by_org, by_status
**And** status can be: pending, accepted, declined, expired

**Trace:** FR-008, FR-009, Architecture Section 3.1

---

### Story 3.3: Evolve Permission Engine for Channel Scoping

As a **channel partner (Danny)**,
I want to see only organisations in my channel,
So that I never access another partner's client data.

**Acceptance Criteria:**

**Given** the channels table and channel_partner role exist (Story 3.1)
**When** the permission engine is updated
**Then** `isChannelPartner()` correctly identifies channel partner users
**And** `getPartnerChannelIds()` returns the correct channel IDs for a partner
**And** `getAccessibleOrgIds()` returns channel-scoped org IDs for partners
**And** `canAccessOrganisation()` enforces channel boundary
**And** super_admins still see all organisations (unchanged)
**And** admins/viewers still see only their membership orgs (unchanged)
**And** legacy systems (no orgId) remain accessible during migration

**Trace:** FR-007, BUG-009, BUG-017, Architecture Section 4.3

---

### Story 3.4: Channel Management Admin Page

As a **super admin (Nicolas)**,
I want to create, edit, and manage channels in the admin console,
So that I can set up channel partners for scalable growth.

**Acceptance Criteria:**

**Given** the user is a super admin
**When** they navigate to `/admin/channels`
**Then** a table displays all channels with: name, status, org count, created date
**And** they can create a new channel (name, slug, contact email)
**And** they can edit an existing channel
**And** they can deactivate a channel (soft delete)
**And** only super admins can access this page (other roles see 403)

**Trace:** FR-005, FEAT-009, Architecture Section 6.1

---

### Story 3.5: Invitation CRUD and Token Flow

As an **admin (Sarah)**,
I want to invite new users to my organisation via email,
So that I can onboard my team without involving the super admin.

**Acceptance Criteria:**

**Given** an admin is logged in to their organisation
**When** they click "Invite User" and enter an email + role (admin or viewer)
**Then** a secure invitation is created with a cryptographic token (SHA-256 hashed for storage)
**And** the invitation appears in a "Pending Invitations" list
**And** the invitation link is displayed for the admin to copy/share (Phase 1: no email service)
**And** the invitation expires after 7 days
**And** the admin can revoke a pending invitation

**Trace:** FR-008, FR-009, Architecture Section 8

---

### Story 3.6: Invitation Accept Page

As an **invited viewer (Jennifer)**,
I want to accept my invitation via a link,
So that I can access my organisation's strategy in Jigsaw.

**Acceptance Criteria:**

**Given** a user clicks an invitation link (`/invite/[token]`)
**When** the page loads
**Then** it displays: organisation name, role being granted, accept/decline buttons
**And** clicking "Accept" creates/links the user account and membership
**And** the invitation status changes to "accepted"
**And** the user is redirected to sign in
**And** an expired or already-used token shows an appropriate error message
**And** subsequent visits to the same token URL show "Already accepted" or "Expired"

**Trace:** FR-009, FEAT-010, Architecture Section 8.1

---

### Story 3.7: Fix Systems Dropdown and "Unknown" Org Display

As a **user (any role)**,
I want the systems dropdown to show correct organisation names,
So that I can navigate to my systems without confusion.

**Acceptance Criteria:**

**Given** the user is authenticated
**When** the systems dropdown renders in the sidebar
**Then** all organisations show their correct name (not "Unknown")
**And** the dropdown is filtered by the user's accessible organisations
**And** channel partners see only their channel's organisations
**And** the Add System button opens a proper modal/dialog (not broken sidebar)

**Trace:** FR-025, FR-027, FR-028, BUG-005, BUG-014

---

## Epic 4: UX Polish & Visual Feedback

**Goal:** Deliver visual polish that makes Jigsaw feel professional and trustworthy — save feedback, guidance, branding.

**Priority:** HIGH — affects every user interaction
**Estimated Stories:** 5

**Dependencies:** Epic 1 (mutations must work before feedback makes sense)
**FRs:** FR-020, FR-032–035

---

### Story 4.1: Implement Save Confirmation Feedback

As a **user (any role editing)**,
I want clear visual feedback when I save data,
So that I know whether my edit persisted or failed.

**Acceptance Criteria:**

**Given** the user edits and saves a node
**When** the mutation completes
**Then** a success toast appears (green checkmark + "Saved") for 3 seconds
**When** the mutation fails
**Then** an error toast appears (red X + error message) until dismissed
**While** the mutation is in progress
**Then** a saving indicator is visible (spinner or "Saving...")
**And** the toast system uses sonner (shadcn's toast component)

**Trace:** FR-020, BUG-007, FEAT-004

---

### Story 4.2: Add Placeholder Guidance Text

As a **new user (first-time)**,
I want empty fields to show guidance text explaining what to enter,
So that I understand the strategic framework without external help.

**Acceptance Criteria:**

**Given** a node field is empty (no user content)
**When** the node renders in View or Edit mode
**Then** placeholder text appears in a muted style, e.g.:
- Impact Purpose: "Describe your organisation's core purpose and vision"
- Key Result: "Define a measurable outcome that indicates success"
- Value Chain: "Identify a key activity that delivers value"
- Resource: "List a resource needed to execute your value chain"
**And** placeholder text disappears when the user starts typing
**And** placeholder text is NOT saved to the database

**Trace:** FR-032, FEAT-018, UI-012

---

### Story 4.3: Empty vs Filled Node Colour Differentiation

As a **user (any role)**,
I want to see at a glance which nodes have data and which are empty,
So that I can quickly identify gaps in my strategic model.

**Acceptance Criteria:**

**Given** a view with mixed empty and filled nodes
**When** the view renders
**Then** empty nodes display a muted/grey background
**And** filled nodes display the standard theme colour
**And** the differentiation is visible in View mode
**And** the colour difference is accessible (meets WCAG contrast ratios)

**Trace:** FR-033, FEAT-019, UI-011

---

### Story 4.4: Update Favicon and Branding

As a **user (any role)**,
I want professional Jigsaw branding in the browser tab,
So that the product looks polished in my browser.

**Acceptance Criteria:**

**Given** the current favicon is a v0 placeholder
**When** the favicon is updated
**Then** a professional Jigsaw-branded favicon displays in the browser tab
**And** the favicon works in Chrome, Firefox, Safari, and Edge
**And** the Open Graph image is updated for social sharing

**Trace:** FR-034, BUG-019, UI-008

---

### Story 4.5: Remove Convex Real-Time Indicator

As a **user (any role)**,
I want the "Connected to Convex real-time" indicator removed from the main UI,
So that the interface looks clean and professional.

**Acceptance Criteria:**

**Given** the Convex indicator currently appears as a line in the middle of the UI
**When** the indicator is repositioned or removed
**Then** no visible Convex indicator appears in the main content area
**And** optionally, a small status dot appears in the footer or is removed entirely

**Trace:** FR-035, BUG-020, UI-010

---

## Epic 5: Export Suite

**Goal:** Deliver professional-grade export for the #1 user action — downloading formatted output.

**Priority:** HIGH — Excel export is the primary user workflow
**Estimated Stories:** 4

**Dependencies:** Epic 1 (data must be correct before exporting)
**FRs:** FR-029–031

---

### Story 5.1: Excel Export with Jigsaw Structural Layout

As a **user (Martin demoing, Sarah reporting)**,
I want to export my strategy to Excel in the Jigsaw visual layout,
So that I can share board-ready spreadsheets that mirror the on-screen view.

**Acceptance Criteria:**

**Given** the user is viewing a system in any view
**When** they click "Export as Excel"
**Then** an .xlsx file is generated client-side using exceljs
**And** the Excel file has:
- Sheet 1: System Overview (name, impact, dimension, challenge)
- Sheet 2: Logic Model grid preserving visual layout (merged cells, colours)
- Sheet 3: KPIs per element with health colours
**And** cell formatting includes: borders, background colours, header styles
**And** the file downloads within 5 seconds for systems with ≤100 nodes
**And** the filename includes system name and date

**Trace:** FR-029, FEAT-012, BUG-016

---

### Story 5.2: PDF Export

As a **board member (Jennifer)**,
I want to export the current view as a PDF,
So that I can include it in board papers.

**Acceptance Criteria:**

**Given** the user is viewing a system
**When** they click "Export as PDF"
**Then** a PDF is generated from the current view
**And** the PDF includes: system name, org name, export date in the header
**And** the layout preserves the visual structure of the view
**And** the PDF is formatted for A4 paper with proper margins

**Trace:** FR-030, FEAT-012

---

### Story 5.3: Image Export

As a **user (any role)**,
I want to export the current view as an image,
So that I can paste it into presentations or documents.

**Acceptance Criteria:**

**Given** the user is viewing a system
**When** they click "Export as Image"
**Then** a PNG file is generated using html2canvas at 2x resolution
**And** the image captures the full view content
**And** the image includes a title bar with system name

**Trace:** FR-031, FEAT-012

---

### Story 5.4: Export Menu Component

As a **user (any role)**,
I want a unified export dropdown menu,
So that I can choose my preferred format easily.

**Acceptance Criteria:**

**Given** the user is viewing a system
**When** the export dropdown is visible
**Then** it shows three options: "Export as Excel", "Export as PDF", "Export as Image"
**And** each option shows a loading state during generation
**And** the menu is accessible to all authenticated users (all roles)
**And** the previous broken JSON export/import buttons are removed or replaced

**Trace:** FR-029–031, BUG-016

---

## Epic 6: Infrastructure & QA

**Goal:** Establish development infrastructure that prevents regressions and supports the BMAD pipeline.

**Priority:** MEDIUM — process improvement
**Estimated Stories:** 3

**Dependencies:** None (process-level, can run anytime)
**FRs:** FR-037–038

---

### Story 6.1: Feature Branch Enforcement

As a **developer (AI agent)**,
I want a documented feature branch workflow,
So that production is never broken by untested changes.

**Acceptance Criteria:**

**Given** the team follows BMAD pipeline (ADR-008)
**When** a story is in development
**Then** all code is committed to a feature branch named `story/{epic}-{story}-{short-description}`
**And** the branch is pushed to GitHub
**And** a PR is created targeting main
**And** the PR description includes the story ID and acceptance criteria checklist
**And** merging to main triggers Vercel auto-deploy

**Trace:** FR-038, ADR-005, ADR-008, INFRA-003

---

### Story 6.2: Staging Environment Setup

As a **developer (AI agent)**,
I want a staging environment for pre-production testing,
So that bugs are caught before reaching production.

**Acceptance Criteria:**

**Given** Vercel supports preview deployments
**When** a PR is created
**Then** Vercel generates a preview URL for that branch
**And** the preview connects to a separate Convex dev deployment (not production)
**And** testing against the preview URL validates the changes before merge

**Trace:** INFRA-002, INFRA-004

---

### Story 6.3: QA Gate for BMAD Pipeline

As a **the orchestrator (Claudia)**,
I want a defined QA gate process for agent-generated code,
So that every code change is reviewed before deployment.

**Acceptance Criteria:**

**Given** the BMAD pipeline generates code changes
**When** the code review step completes
**Then** architectural changes (schema, permissions, new tables) require human approval
**And** all other changes require BMAD Code Review PASS (Pattern D — adversarial, ≥3 findings)
**And** the QA gate is documented in the project's CONTRIBUTING.md

**Trace:** FR-037, INFRA-006, ADR-008

---

## Epic 7: Future Enhancements (Phase 3)

**Goal:** Placeholder stories for deferred features. Not in Sprint 1.

**Priority:** LOW — deferred
**Estimated Stories:** 3

**Dependencies:** Epics 1–5 complete
**FRs:** FR-040, FR-041

---

### Story 7.1: Undo / Go-Back Functionality

As a **user (any editing role)**,
I want to undo my last edit,
So that I can recover from mistakes.

**Acceptance Criteria:**

**Given** Phase 3 scope
**When** implemented
**Then** per-node undo reverts to previous saved state
**And** implementation approach (per-node vs global) determined during Phase 3 architecture

**Trace:** FR-040, FEAT-005 — *DEFERRED*

---

### Story 7.2: KPI Numbers Embedded in Nodes

As a **user (any role)**,
I want KPI values displayed inside node cells in Performance mode,
So that I can see quantitative data at a glance without clicking into nodes.

**Acceptance Criteria:**

**Given** Phase 3 scope
**When** implemented
**Then** Performance mode renders KPI numerical values inside each node cell
**And** the design references the earlier Jigsaw version that had this feature

**Trace:** FR-041, FEAT-015 — *DEFERRED*

---

### Story 7.3: User Role Display in Header

As a **user (any role)**,
I want to see my current role displayed beneath my username,
So that I know what permissions I have.

**Acceptance Criteria:**

**Given** the user is authenticated
**When** the header renders
**Then** the user's role (Super Admin / Channel Partner / Admin / Viewer) is displayed beneath their name
**And** the role label updates when switching organisation context

**Trace:** FR-010, FEAT-017, UI-007

---

## Sprint Recommendation

### Sprint 1 (Recommended)
- **Epic 1** (all 8 stories) — Core stability is the #1 priority
- **Epic 2** (all 5 stories) — Auth experience can run in parallel
- **Total:** 13 stories

### Sprint 2
- **Epic 3** (all 7 stories) — Four-tier roles after core is stable
- **Epic 4** (all 5 stories) — UX polish
- **Total:** 12 stories

### Sprint 3
- **Epic 5** (all 4 stories) — Export suite
- **Epic 6** (all 3 stories) — Infrastructure
- **Total:** 7 stories

### Sprint 4+ (Phase 3)
- **Epic 7** (3 stories) — Future enhancements

---

*End of Epic & Story Breakdown*

---

## Epic 8: Post-Sprint Remediation (Security + UX)

**Goal:** Address all critical security gaps (query-side access control, token hashing, dev bypass isolation) and UX issues (Add System, empty state, Convex indicator) discovered during post-sprint code review and owner QA.

**Source:** `remediation-plan.md` + `code-review-report.md`

**Priority:** P0 stories MUST pass before merge to main. P1 stories MUST pass before client demo.

**FR Coverage:** FR-007 (data isolation), FR-008 (invitations security), FR-025 (Add System), FR-026 (new systems empty), FR-035 (Convex indicator)

---

### Story 8.1: Implement Query-Side Access Control (withReadAccess)

As a **system administrator**,
I want all data queries to verify authentication and system access,
So that clients cannot read other clients' data even if they know a systemId.

**Priority:** 🔴 P0 — MERGE BLOCKER

**Acceptance Criteria:**

**Given** a user is not authenticated
**When** they call any bySystem or bySystemAndType query
**Then** the query returns empty results or throws an auth error

**Given** a user is authenticated but does NOT have access to a system
**When** they call bySystem with that systemId
**Then** the query returns empty results or throws an access denied error

**Given** a user is authenticated and HAS access to a system
**When** they call bySystem with that systemId
**Then** the query returns the expected data

**Implementation Notes:**
- Create `withReadAccess(ctx, systemId)` in `convex/lib/queries.ts` (new file)
- Calls `getCurrentUser()` + `canAccessSystem()` before returning data
- Apply to ALL query endpoints: elements.bySystem, elements.bySystemAndType, kpis.bySystem, kpis.byParent, capabilities.bySystem, capabilities.bySystemAndType, matrixCells.bySystemAndType, factors.bySystem, externalValues.bySystem
- For kpis.byParent: resolve parent's systemId first, then check access
- Must work with dev bypass (CONVEX_DEV_BYPASS_AUTH)
- Do NOT change mutation logic (already protected by withWriteAccess)

**Files to modify:**
- `convex/lib/queries.ts` (NEW)
- `convex/elements.ts` (add withReadAccess to queries)
- `convex/kpis.ts` (add withReadAccess to queries)
- `convex/capabilities.ts` (add withReadAccess to queries)
- `convex/matrixCells.ts` (add withReadAccess to queries)
- `convex/factors.ts` (add withReadAccess to queries)
- `convex/externalValues.ts` (add withReadAccess to queries)

**Trace:** REM-001, FR-007, NFR-005

---

### Story 8.2: Hash Invitation Tokens + Restrict Exposure

As a **system administrator**,
I want invitation tokens to be hashed before storage and not exposed to org members,
So that compromised databases or curious org members cannot misuse invitation links.

**Priority:** 🔴 P0 — MERGE BLOCKER

**Acceptance Criteria:**

**Given** an invitation is created
**When** the token is stored in Convex
**Then** it is stored as a SHA-256 hash (not plaintext)

**Given** a user visits /invite/[token]
**When** getByToken is called
**Then** the incoming token is hashed before querying the database

**Given** an admin views pending invitations via listByOrg
**When** the response is returned
**Then** it does NOT include the raw token field

**Implementation Notes:**
- Use a pure-JS SHA-256 implementation (Convex doesn't have Node crypto)
- Add `js-sha256` package or implement minimal SHA-256 in `convex/lib/crypto.ts`
- Hash token in `invitations.create` before storage
- Hash incoming token in `invitations.getByToken` before DB lookup
- Remove `token` field from `invitations.listByOrg` response
- Return the raw invite URL only once at creation time (to the admin who created it)
- Existing plaintext tokens in DB should be invalidated (set status to "expired")

**Files to modify:**
- `convex/lib/crypto.ts` (NEW — SHA-256 helper)
- `convex/invitations.ts` (hash on create, hash on lookup, strip from list)
- `package.json` (add js-sha256 if using external lib)

**Trace:** REM-002, FR-009

---

### Story 8.3: Isolate Dev Auth Bypass from Production Code

As a **developer**,
I want the dev auth bypass to be impossible to accidentally enable in production,
So that a misconfigured environment variable cannot bypass all authentication.

**Priority:** 🔴 P0 — MERGE BLOCKER

**Acceptance Criteria:**

**Given** the application is deployed to production (Vercel)
**When** CONVEX_DEV_BYPASS_AUTH is accidentally set to "true"
**Then** the bypass code does NOT execute (additional guard prevents it)

**Given** the developer runs locally with CONVEX_DEV_BYPASS_AUTH=true
**When** permissions.ts getCurrentUser is called
**Then** the bypass works normally for local development

**Implementation Notes:**
- Add a secondary guard: check `process.env.CONVEX_IS_DEV_DEPLOYMENT` or equivalent Convex env
- OR: Remove bypass from permissions.ts entirely and use a separate `convex/lib/dev-auth.ts` that is only imported in dev
- Frontend bypass hooks should check `process.env.NODE_ENV === "development"` as additional guard
- Document the bypass mechanism in `DEV_BYPASS.md`
- Verify Convex production deployment does NOT have the env var set

**Files to modify:**
- `convex/lib/permissions.ts` (add production guard)
- `hooks/use-auth-bypass.ts` (add NODE_ENV guard)
- `hooks/use-convex-auth-bypass.ts` (add NODE_ENV guard)
- `DEV_BYPASS.md` (NEW — documentation)

**Trace:** REM-003

---

### Story 8.4: Enable Add System Button with Creation Dialog

As a **Super Admin or Channel Partner**,
I want to click "Add System" and create a new system through a dialog,
So that I can set up new client systems without developer intervention.

**Priority:** 🟡 P1

**Acceptance Criteria:**

**Given** I am a Super Admin or Channel Partner
**When** I click "Add System" in the sidebar
**Then** a modal/dialog opens with fields: System Name (required), Sector (optional), Organisation (dropdown of my accessible orgs)

**Given** I fill in the required fields and submit
**When** the system is created
**Then** it appears in the sidebar immediately and is auto-selected

**Given** I am a Viewer or Admin (not SA/CP)
**When** the sidebar renders
**Then** the "Add System" button is hidden or disabled

**Implementation Notes:**
- Remove `disabled` and `cursor-not-allowed` from the Add System button
- Add role check: show only for super_admin and channel_partner
- Create an AddSystemDialog component with shadcn Dialog
- Use `systems.create` mutation (already requires orgId)
- Organisation dropdown uses `organisations.list` filtered by user's accessible orgs
- After creation, auto-select the new system in the sidebar

**Files to modify:**
- `components/layout/nav-sidebar.tsx` (enable button, add dialog trigger)
- `components/add-system-dialog.tsx` (NEW — creation dialog)
- `convex/organisations.ts` (may need a listAccessible query)

**Trace:** REM-004, FR-025

---

### Story 8.5: Empty State on App Load

As a **user**,
I want the app to show a welcome screen when no system is selected,
So that I'm not confused by seeing another client's data on first load.

**Priority:** 🟡 P1

**Acceptance Criteria:**

**Given** I open the app for the first time (or after clearing state)
**When** no system is selected
**Then** the main area shows a welcome message: "Select a system from the sidebar to begin"

**Given** I have no systems available
**When** the app loads
**Then** the main area shows: "No systems available. Create your first system to get started." with a CTA button

**Given** I select a system
**When** I reload the page
**Then** my last selected system is remembered (via localStorage)

**Implementation Notes:**
- Change `selectedSystemId` default from auto-selecting first system to `null`
- Add empty state component in main area when `selectedSystemId` is null
- Persist selection in localStorage: `jigsaw-selected-system`
- On load, restore from localStorage if the system still exists

**Files to modify:**
- `app/page.tsx` (remove auto-select, add empty state, add localStorage persistence)

**Trace:** REM-005, FR-026

---

### Story 8.6: Hide Convex Indicator + Migrate Legacy Systems + Minor Fixes

As a **user**,
I want no technical indicators visible and all systems showing correct org names,
So that the app looks professional and data appears clean.

**Priority:** 🟡 P1

**Acceptance Criteria:**

**Given** the app is running in any environment
**When** the page renders
**Then** the "Connected to Convex (real-time)" indicator is NOT visible

**Given** legacy systems exist without orgId
**When** the migration script runs
**Then** all systems have a valid orgId and display correct org names

**Implementation Notes:**
- Remove or hide Convex indicator unconditionally (not just in production)
- Create a one-time migration function in `convex/migrations.ts` to assign orgId to legacy systems
- Run migration via `npx convex run migrations:assignLegacyOrgIds`

**Files to modify:**
- `app/page.tsx` (remove Convex indicator entirely)
- `convex/migrations.ts` (NEW — legacy system migration)

**Trace:** REM-006, REM-007, FR-028, FR-035

---
