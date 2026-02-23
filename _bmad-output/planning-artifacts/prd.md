---
stepsCompleted:
  - step-01-init
  - step-02-discovery
  - step-03-success
  - step-04-journeys
  - step-05-domain
  - step-06-innovation
  - step-07-project-type
  - step-08-scoping
  - step-09-functional
  - step-10-nonfunctional
  - step-11-polish
  - step-12-complete
inputDocuments:
  - BMAD_INTEGRATION_BRIEF_CLEAN.md
  - FEATURE_REGISTER.md
  - brainstorming-session-2026-02-16.md
  - project-context.md
  - schema.ts
  - permissions.ts
classification:
  projectType: SaaS B2B Strategic Planning Platform
  domain: Enterprise Strategy Management
  complexity: High
  projectContext: Brownfield
---

# Product Requirements Document - Jigsaw 1.6 RSA

**Author:** Nicolas (CPF) + BMAD AI Orchestrator  
**Date:** 2026-02-23  
**Version:** 1.0  
**Status:** Final

---

## 1. Executive Summary

### 1.1 Elevator Pitch

Jigsaw 1.6 RSA is a **Strategic Management System** that transforms how organisations plan, execute, and communicate their strategy. Unlike static strategy documents or generic project management tools, Jigsaw renders interactive visualisation views that make complex strategic systems comprehensible to everyone—from C-suite executives to operational staff.

**The Problem:** Organisations spend thousands on strategic consulting, only to have the resulting strategy sit in static PowerPoints and Excel files that nobody reads, understands, or uses. Strategy becomes shelfware instead of a living, operational framework.

**The Solution:** Jigsaw makes strategy tangible and actionable. Each strategic element becomes a "knowledge centre"—a living unit of work with KPIs, documents, and activity history. The system connects objectives, value chains, resources, and external factors into an interactive visual language that anyone can understand and contribute to.

**The Shift:** Jigsaw is evolving from a "visualisation tool" to a "strategy intelligence platform"—a system that doesn't just display strategic data but interprets it, guides users, and helps organisations become more strategy-literate over time.

### 1.2 Current State Assessment

Jigsaw 1.6 RSA exists in production but has significant architectural debt. The application was built reactively without prior architecture, which is the root cause of most current bugs. Key issues include:

- **Cross-model CRUD failures:** Delete, edit, colour, and real-time sync broken across ALL models (BUG-012, BUG-018, ADR-017)
- **Permission conflation:** Adding a user as Super Admin for one organisation grants the same role across ALL organisations (BUG-009)
- **Data isolation issues:** New systems show other clients' data instead of empty placeholders (BUG-017)
- **Missing critical features:** No landing page, broken export, no invitation system, no notification infrastructure
- **Session and auth issues:** Users remain logged in after closing browser, sign-out redirects to error page

### 1.3 Product Vision

**Jigsaw 1.6 (Now — Transitional):**
- Focus on Logic Model view only (other views deferred per ADR-006)
- Fix core stability and data integrity issues
- Implement four-tier role model (Super Admin → Channel Partner → Admin → Viewer)
- Deliver professional Excel export capability
- Establish invitation-only access model

**Jigsaw 2.0 (Future — AI-First):**
- Strategy Health Dashboard with AI-generated executive narratives
- AI Strategy Assistant (passive narrator + active advisor)
- Monte Carlo strategy simulator for "what-if" analysis
- Raw data ingestion from company systems
- Guided onboarding that builds the Jigsaw from user answers

### 1.4 Business Context

This product MUST generate revenue. Everything else waits. Current active commercial engagements include Relationships Australia (Tasmania), Central Highlands Council, Kiraa, MERA, Levur, and Illawarra Energy Storage.

**Critical Success Factor:** Excel export is the #1 actual user action. Making this excellent makes Jigsaw indispensable.

**Resource Constraint:** The product is built and operated by ONE person (Nicolas) + AI orchestration. Cash is tight—development must be ultra-efficient.

---

## 2. User Personas

### 2.1 Martin — The CEO/Demonstrator

**Role:** Chief Executive Officer of CPF (the consultancy behind Jigsaw)  
**Technical Comfort:** Moderate—uses technology but doesn't build it  
**Primary Goal:** Win new consulting engagements by demonstrating Jigsaw's value to prospective clients

**Narrative:**

Martin wakes up on Monday with a critical meeting scheduled: Relationships Australia Tasmania wants to see if Jigsaw can help them manage their organisational strategy. This is a make-or-break moment—RA Tasmania represents a significant commercial opportunity, and Martin needs the demo to go flawlessly.

He opens Jigsaw and navigates to the MERA Energy system—a showcase example he's prepared. He needs to demonstrate how the Logic Model connects Impact Purpose to Key Results, how Development Pathways show capability gaps, how KPIs track progress, and how to export to Excel for board reporting.

But he notices problems. Development Pathways is broken. Colour mode doesn't work. The Add System button does nothing. The tool that was supposed to demonstrate CPF's strategic expertise instead shows technical incompetence.

**Pain Points:**
- Can't rely on the product to work during client demos
- Export functionality broken when clients need board-ready deliverables
- No professional landing page to send prospects to
- Development Pathways broken—critical for operational clients

**Success Looks Like:**
- Every demo feature works reliably
- Can generate professional Excel exports on-demand
- Has confidence the product represents CPF's quality standards
- Can invite clients to view their strategy systems

---

### 2.2 Sarah — The Client Administrator

**Role:** Strategy or Operations Manager at a client organisation  
**Technical Comfort:** High—comfortable with business software, not a developer  
**Primary Goal:** Manage her organisation's strategic system, keep data current, engage her team

**Narrative:**

Sarah was hired to help Relationships Australia Tasmania become more strategic. She logs into Jigsaw to update KPIs for the board meeting. She clicks on a Key Result node, enters new values, hits save... but did it work? No confirmation message. She closes and reopens the node—old data flashes before updating. She's not sure if her edit saved.

She wants to invite her program managers, but there's no invitation flow. She emails Martin, who adds them manually. This creates a bottleneck—she can't be self-sufficient.

Colour mode would be perfect for the board presentation, but it doesn't work at all. She has to create a separate PowerPoint.

**Pain Points:**
- No confirmation that edits are saved
- Can't invite her own team members
- Colour mode broken—can't visualise KPI health
- Development Pathways broken

**Success Looks Like:**
- Clear feedback on every save action
- Self-service user invitation for her organisation
- KPI health visualisation for board presentations
- Can confidently use Jigsaw as the single source of truth

---

### 2.3 Danny — The Channel Partner

**Role:** Partner at KPMG (or similar consultancy), manages portfolio of client strategies  
**Technical Comfort:** High—uses multiple SaaS tools daily  
**Primary Goal:** Oversee strategy implementation across multiple client organisations without seeing other partners' clients

**Narrative:**

Danny is a partner at KPMG specialising in non-profit strategy. Martin approaches him about Jigsaw's Channel Partner model. The pitch is compelling: Danny would see all his client organisations with health indicators, spot problems before clients call, and proactively offer support—but only HIS clients, not other channels'.

He logs in and immediately sees organisations he shouldn't see—entries labelled "unknown." The permission isolation isn't working. If he can see other channels' clients, they can see his. This is a deal-breaker for client confidentiality.

He also needs to onboard clients without bothering Martin. But there's no Channel Partner role, no channel-scoped visibility, and no channel management page.

**Pain Points:**
- Can see other channels' clients (data isolation failure)
- No self-service organisation creation
- No channel-scoped visibility

**Success Looks Like:**
- Sees ONLY his assigned channel's organisations
- Can create new client organisations independently
- Has a portfolio dashboard showing all his clients' health

---

### 2.4 Viewer — The Board Member/External Stakeholder

**Role:** Board member, funder, or external stakeholder who needs read-only access  
**Technical Comfort:** Variable—may be tech-savvy or struggle with new software  
**Primary Goal:** Understand organisational strategy and track progress without editing

**Narrative:**

Jennifer is a board member at MERA Energy. She receives an invitation email with a link to join Jigsaw. She clicks it... and gets a 404 error. No landing page explaining what Jigsaw is. She feels confused.

She eventually finds the sign-in page, but there are two sign-in buttons visible. Which one does she use?

Once inside, she sees MERA's Logic Model. It's visually impressive, but she doesn't understand the framework. What's a "Value Chain"? The tool assumes she knows strategy terminology.

She wants to export to PDF for her board papers, but the export button doesn't work.

**Pain Points:**
- No landing page for invitation context
- Confusing sign-in with duplicate buttons
- No guidance on strategy terminology
- Export functionality broken

**Success Looks Like:**
- Professional landing page explaining Jigsaw
- Single, clear sign-in button
- Contextual tooltips for strategy concepts
- One-click export to PDF/Excel

---


## 3. User Journeys

### 3.1 Journey 1: Martin's Demo-to-Win Flow (Critical Path)

**Goal:** Demonstrate Jigsaw to a prospective client and win a consulting engagement

**Opening Scene:**
Martin arrives at Relationships Australia Tasmania's office with 45 minutes to convince them that CPF's approach—powered by Jigsaw—is worth the investment.

**Rising Action:**
1. Martin opens Jigsaw and signs in smoothly
2. He selects the "Demo Template" system
3. **Logic Model View:** Shows Impact Purpose flowing to Key Results
4. **Development Pathways View:** Shows capability planning
5. **Colour Mode:** Activates KPI health visualisation (green/amber/red)
6. **Export:** Demonstrates Excel export with professional formatting
7. Invites RA Tasmania staff to view the system live

**Climax:**
The CEO leans forward: "This is exactly what we've been missing. Can we have this?"

**Resolution:**
CPF wins the engagement. The demo went flawlessly.

**Journey Requirements:**
- Landing page must NOT return 404 for logged-out visitors (BUG-001, FEAT-001)
- Development Pathways ALL modes must work (BUG-018)
- Colour mode must visualise KPI health correctly (BUG-004, ADR-013)
- Excel export must work (FEAT-012, BUG-016)
- Sign-out must redirect to sign-in page (BUG-011)

---

### 3.2 Journey 2: Sarah's Strategy Management Flow (Primary User)

**Goal:** Update strategic data and invite team members

**Opening Scene:**
Sarah needs to update all KPIs for the board meeting and onboard two new program managers.

**Rising Action:**
1. Sarah logs into Jigsaw
2. She updates KPIs in Logic Model view—each save shows clear confirmation
3. She switches to Development Pathways to update capability assessments
4. She invites two program managers as Viewers
5. They receive invitation emails with clear instructions

**Climax:**
Sarah finishes with time to spare, confident in her data accuracy.

**Resolution:**
The board meeting goes smoothly. Her team logs in successfully.

**Journey Requirements:**
- Real-time sync must work for all node types (BUG-002, BUG-003)
- Save confirmation feedback must be visible (BUG-007, FEAT-004)
- No stale data on node reopen (BUG-008)
- Add-node button must work in edit mode (BUG-013)
- Invitation system must function (FEAT-010)
- User role display for clarity (FEAT-017, UI-007)

---

### 3.3 Journey 3: Danny's Channel Partner Onboarding (New Capability)

**Goal:** Set up as Channel Partner and onboard first client independently

**Opening Scene:**
Danny has been approved as a Channel Partner but is skeptical after initial data isolation issues.

**Rising Action:**
1. Danny logs into Jigsaw and sees ONLY his channel's organisations
2. He navigates to the Channel Management page
3. He creates a new client organisation
4. The system sends an invitation to the client admin
5. He invites the client's strategy manager as Admin

**Climax:**
Danny successfully onboarded a new client without involving Martin.

**Resolution:**
"This works. I'm ready to move my entire portfolio to Jigsaw."

**Journey Requirements:**
- Four-tier role model implemented (FEAT-008, ADR-009)
- Channel-scoped organisation visibility (ADR-011)
- Channel management admin page (FEAT-009)
- Permission conflation fixed (BUG-009)
- Data isolation enforced (BUG-017)

---

### 3.4 Journey 4: Viewer's First-Time Access (Friction Reduction)

**Goal:** Access Jigsaw as an invited viewer with minimal friction

**Opening Scene:**
Jennifer receives an invitation email to view MERA Energy's strategy.

**Rising Action:**
1. Jennifer clicks the invitation link
2. She lands on a professional page explaining Jigsaw and her access level
3. She clicks "Access Strategy" and sees a single sign-in button
4. She signs in with her email (magic link or password)
5. She's taken directly to MERA's Logic Model view
6. She hovers over "Value Chain" and sees a contextual tooltip explaining the concept
7. She clicks "Export" and downloads a PDF for her board papers

**Climax:**
Jennifer has everything she needs for the board meeting without asking for help.

**Resolution:**
She tells the CEO: "This is brilliant. Finally, a strategy tool I can actually understand and use."

**Journey Requirements:**
- Logged-out landing page (FEAT-001, BUG-001)
- Consolidated single sign-in button (UI-006, BUG-015)
- Contextual guidance/tooltips (FEAT-018, UI-012)
- Export to PDF/Excel working (FEAT-012, BUG-016)
- "Strategic Management System" branding (UI-001)

---


## 4. Success Criteria

### 4.1 User Success

**Primary Success Metrics:**

| Metric | Target | Measurement Method |
|--------|--------|-------------------|
| Demo completion rate | 100% | All demo features work during client presentations |
| Save confirmation visibility | 100% | Users see clear feedback on every save action |
| Export success rate | >95% | Excel/PDF exports generate successfully |
| First-time viewer access | <3 clicks | From invitation email to viewing strategy |
| Data persistence | 100% | No data loss or revert after successful save |

**User Experience Goals:**
- Users can complete core tasks (edit, save, invite, export) without assistance
- New viewers understand strategy concepts through in-app guidance
- Board members can generate board-ready exports independently
- Client admins are self-sufficient for routine user management

### 4.2 Business Success

**Revenue-Critical Metrics:**

| Metric | 3-Month Target | 12-Month Target |
|--------|---------------|-----------------|
| Active commercial engagements | 7 (current) | 15+ |
| Channel Partners onboarded | 0 (current) | 3+ |
| Client retention rate | 100% | 90%+ |
| Demo-to-close conversion | N/A | 50%+ |

**Operational Goals:**
- Zero critical bugs in demo scenarios
- RA Tasmania engagement successfully delivered
- Channel Partner model enables scalable growth
- Professional exports become a competitive differentiator

### 4.3 Technical Success

**System Reliability:**

| Metric | Target |
|--------|--------|
| Uptime | 99.5%+ |
| Real-time sync latency | <2 seconds |
| Page load time | <3 seconds |
| Cross-model data consistency | 100% |

**Code Quality:**
- All mutations have proper auth gates (requireAuth/requireRole)
- Cross-model CRUD operations work consistently
- Permission isolation enforced at database level
- All Feature Register items (BUG-001 through FEAT-021) resolved or scoped

---

## 5. Product Scope

### 5.1 MVP - Minimum Viable Product (v1.6.0)

**In Scope - Critical Bug Fixes:**
- BUG-001: Homepage URL returns 404 when logged out
- BUG-002: Real-time sync failure for Delivery Culture Dimension nodes
- BUG-003: Real-time sync failure for System Context & Challenge nodes
- BUG-004: Colour mode completely non-functional
- BUG-005: Add System sidebar button broken
- BUG-009: Permission conflation (org-level vs system-level)
- BUG-011: Sign-out redirects to error page
- BUG-012: Delete functionality broken across ALL models
- BUG-013: Add-node button broken in edit mode
- BUG-017: Data isolation bug in onboarding
- BUG-018: Development Pathways all modes broken

**In Scope - Critical Features:**
- FEAT-001: Logged-out landing page
- FEAT-002: Logout button
- FEAT-004: Save confirmation feedback
- FEAT-008: Channel Partner role (four-tier auth model)
- FEAT-009: Channel management admin page
- FEAT-010: Invitation system for viewers
- FEAT-012: Excel export (Jigsaw structural layout)

**In Scope - UI/UX:**
- UI-001: Rename to "Strategic Management System"
- UI-006: Consolidate two sign-in buttons

### 5.2 Phase 2 - Growth Features (v1.6.1-v1.6.3)

**Features:**
- FEAT-003: "Keep me logged in" toggle
- FEAT-006: Invite-only viewer access (full implementation)
- FEAT-007: Add System popup/modal
- FEAT-016: Email communication flow
- FEAT-017: User role display beneath username
- FEAT-018: Placeholder guidance text
- FEAT-019: Different node colour for empty vs filled fields
- FEAT-021: Notification/confirmation system

**UI/UX:**
- UI-002 through UI-005: Various UI improvements
- UI-007: Show user role beneath username
- UI-011: Node colour for empty vs filled fields
- UI-012: Placeholder guidance text

### 5.3 Phase 3 - Vision/Future (v1.7.0+)

**Deferred Views:**
- Contribution Map (ADR-006)
- Convergence Map (ADR-006)
- Development Pathways enhancement (beyond bug fixes)
- Agents Canvas (ADR-003 - removed from scope)

**Future Features:**
- FEAT-005: Undo/go-back functionality
- FEAT-011: System-level role differentiation
- FEAT-013: Dynamic theming
- FEAT-014: Font size dynamic editing per node
- FEAT-015: KPI numbers embedded inside nodes
- FEAT-020: Proper Jigsaw logo with jigsaw piece shape

**UI/UX:**
- UI-008 through UI-010: Favicon, logo, Convex indicator
- UI-013: Dynamic theming
- UI-014: Font size editing per node

---


## 6. Functional Requirements

### 6.1 Authentication & Session Management

**FR-001:** Unauthenticated visitors can view a professional landing page at the root URL that explains Jigsaw's value proposition.  
*Trace: BUG-001, FEAT-001*

**FR-002:** Authenticated users can sign out through a visible, accessible logout button that redirects to the sign-in page.  
*Trace: FEAT-002, BUG-011*

**FR-003:** Users can select "Keep me logged in" at sign-in to maintain their session after closing the browser.  
*Trace: FEAT-003, BUG-006*

**FR-004:** The system supports four distinct roles: Super Admin, Channel Partner, Admin, and Viewer.  
*Trace: FEAT-008, ADR-009*

**FR-005:** Super Admins can create, edit, and deactivate Channel Partner accounts through the admin console. The admin console displays a Channel Partners page listing all partners with their assigned organisation count, status (active/inactive), and creation date.  
*Trace: FEAT-008, FEAT-009*

**FR-006:** Channel Partners can create new client organisations assigned to their channel.  
*Trace: FEAT-008, FEAT-009*

**FR-007:** Channel Partners can view ONLY organisations assigned to their channel.  
*Trace: ADR-011, BUG-009, BUG-017*

**FR-008:** Admins can invite viewers to their organisation via email-based invitation flow.  
*Trace: FEAT-006, FEAT-010, ADR-007, ADR-012*

**FR-009:** Invited viewers receive an email with a tokenized accept/decline link.  
*Trace: FEAT-010, ADR-012*

**FR-010:** The system displays the user's current role beneath their username in the UI.  
*Trace: FEAT-017, UI-007*

---

### 6.2 Core Data Operations (Logic Model View)

**FR-011:** Users can create, read, update, and delete Impact Purpose nodes with real-time persistence.  
*Trace: BUG-002, BUG-003, ADR-017*

**FR-012:** Users can create, read, update, and delete Key Result nodes with real-time persistence.  
*Trace: BUG-002, BUG-003, ADR-017*

**FR-013:** Users can create, read, update, and delete Value Chain nodes with real-time persistence.  
*Trace: BUG-002, BUG-003, ADR-017*

**FR-014:** Users can create, read, update, and delete Resource nodes with real-time persistence.  
*Trace: BUG-002, BUG-003, ADR-017*

**FR-015:** Users can create, read, update, and delete Delivery Culture Dimension nodes with real-time persistence.  
*Trace: BUG-002, ADR-017*

**FR-016:** Users can create, read, update, and delete System Context & Challenge nodes with real-time persistence.  
*Trace: BUG-003, ADR-017*

**FR-017:** Users can add new nodes using the plus button in edit mode at any position in a row.  
*Trace: BUG-013*

**FR-018:** Users can delete nodes in delete mode with immediate visual feedback and data removal.  
*Trace: BUG-012, ADR-017*

**FR-019:** Closing and reopening a node displays the current data without showing stale information first.  
*Trace: BUG-008*

**FR-020:** The system provides visual confirmation (colour change, checkmark, or toast) when a save operation succeeds or fails.  
*Trace: BUG-007, FEAT-004, FEAT-021*

---

### 6.3 Visualisation Modes

**FR-021:** Users can switch between five modes per view: View, Edit, Colour, Order, and Delete.  
*Trace: BUG-004, BUG-012, BUG-018*

**FR-022:** In Colour mode, nodes display colours based on KPI health thresholds: red (<70%), orange (70-100%), green (100%).  
*Trace: BUG-004, ADR-013*

**FR-023:** In Order mode, users can reorder nodes using up/down arrow buttons. Arrow buttons are visible ONLY in Order mode and hidden in all other modes (View, Edit, Colour, Delete).  
*Trace: UI-003*

**FR-024:** Each mode displays ONLY its relevant controls: View mode shows read-only content with no inputs; Edit mode shows editable fields and save button; Colour mode shows KPI health colours with no edit inputs or arrow buttons; Order mode shows arrow buttons with no edit inputs; Delete mode shows delete confirmation with no edit inputs or arrows. KPI value fields are hidden in non-edit modes unless explicitly set to read-only display.  
*Trace: UI-002, UI-003*

---

### 6.4 System Management

**FR-025:** Super Admins and Channel Partners can create new systems through an Add System modal/dialog.  
*Trace: BUG-005, FEAT-007*

**FR-026:** New systems initialise with empty placeholder data, not data from other clients.  
*Trace: BUG-017*

**FR-027:** The systems dropdown displays all organisations the user has permission to view with correct names.  
*Trace: BUG-014, UI-005*

**FR-028:** "Unknown" organisation entries are resolved and display proper names.  
*Trace: BUG-014*

---

### 6.5 Export Capabilities

**FR-029:** Users can export the current view to Excel with Jigsaw structural layout (not flat table).  
*Trace: FEAT-012, BUG-016*

**FR-030:** Users can export the current view to PDF for board reporting.  
*Trace: FEAT-012*

**FR-031:** Users can export the current view as an image.  
*Trace: FEAT-012*

---

### 6.6 User Experience & Guidance

**FR-032:** Empty fields display placeholder guidance text explaining the field's purpose.  
*Trace: FEAT-018, UI-012*

**FR-033:** Empty nodes (no user content entered) display a muted/grey background colour, while nodes with content display the standard theme colour. This visual differentiation is visible in View mode and provides an at-a-glance data completeness indicator.  
*Trace: FEAT-019, UI-011*

**FR-034:** The application displays a professional favicon with Jigsaw branding (not v0 placeholder).  
*Trace: BUG-019, UI-008, FEAT-020*

**FR-035:** The "Connected to Convex real-time" indicator is repositioned to a discreet corner or removed.  
*Trace: BUG-020, UI-010*

**FR-036:** The application displays a single, consolidated sign-in button (not duplicate buttons).  
*Trace: BUG-015, UI-006*

---

### 6.7 Infrastructure & Development

**FR-037:** All code changes flow through the BMAD pipeline: each change originates as a story, passes through Create Story → Dev Story → Code Review gates, and merges to main only after Code Review PASS. A human review step is required for all architectural changes (schema modifications, permission logic changes, new Convex tables).  
*Trace: ADR-008, INFRA-006*

**FR-038:** Feature branches are mandatory; no direct commits to main.  
*Trace: ADR-005, INFRA-003*

**FR-040:** Users can undo the last edit action on a per-node basis, reverting to the previous saved state. Implementation approach (per-node vs global undo) to be determined during architecture phase.  
*Trace: FEAT-005 — Deferred to Phase 3; requires A-B testing decision*

**FR-041:** In Performance view, KPI numerical values are displayed embedded inside the node cells (not as separate overlays), providing an at-a-glance quantitative view of strategy performance.  
*Trace: FEAT-015 — Deferred to Phase 3; design reference from earlier Jigsaw version needed*

**FR-042:** The Performance display mode and Stage "Show KPIs" mode are consolidated or clearly differentiated — if they show the same KPI data, one is removed; if they serve different purposes, the distinction is documented and visually clear to users.  
*Trace: UI-004 — Requires design decision during architecture phase*

**FR-039:** Cross-model CRUD operations (create, read, update, delete across Logic Model, Development Pathways, Contribution Map, Convergence Map) use a shared mutation layer with: (a) consistent auth gating via requireRole(), (b) consistent optimistic UI update pattern, (c) shared error handling with user-visible error messages, and (d) shared audit logging via logAudit(). Each model's mutations follow the same code structure to prevent the per-model divergence that caused ADR-017.  
*Trace: ADR-017, BUG-012, BUG-018*

---

## 7. Non-Functional Requirements

### 7.1 Performance

**NFR-001:** Page initial load time must not exceed 3 seconds on standard broadband connections.  
*Rationale: Board members and executives have limited patience for slow-loading tools.*

**NFR-002:** Real-time data sync must complete within 2 seconds of a mutation.  
*Rationale: Users need confidence that their edits are persisted immediately.*

**NFR-003:** Excel export generation must complete within 5 seconds for systems with up to 100 nodes.  
*Rationale: Export is a frequent operation; delays impact user workflow.*

### 7.2 Security

**NFR-004:** All data access must be gated by authentication and role-based authorization.  
*Rationale: Client strategy data is confidential; unauthorised access is a deal-breaker.*

**NFR-005:** Channel Partners must have zero visibility into other channels' organisations or data.  
*Rationale: Professional services firms require strict client confidentiality.*

**NFR-006:** WorkOS production keys must be used for all client-facing authentication.  
*Rationale: Staging keys are for development only; production requires production-grade security.*

**NFR-007:** All mutations must be logged in the audit trail with user ID, timestamp, and action details.  
*Rationale: Compliance and accountability for strategic decisions.*

### 7.3 Reliability

**NFR-008:** System uptime must be 99.5% or higher (excluding planned maintenance).  
*Rationale: Clients depend on Jigsaw for board meetings and strategic planning sessions.*

**NFR-009:** No data loss can occur during normal operations; soft delete must be implemented for all entities.  
*Rationale: Strategic data is valuable and irreplaceable.*

**NFR-010:** Session management must respect user preferences for persistence.  
*Rationale: Security-conscious users want sessions to terminate; convenience-focused users want persistence.*

### 7.4 Accessibility

**NFR-011:** The application must meet WCAG 2.1 Level AA standards for accessibility. Specifically: all images have alt text, colour contrast ratios meet 4.5:1 for normal text and 3:1 for large text, all form inputs have associated labels, and focus indicators are visible on all interactive elements. Compliance is verified using axe-core automated scanning with zero critical violations.  
*Rationale: Government and non-profit clients have accessibility requirements.*

**NFR-012:** All interactive elements must be keyboard navigable.  
*Rationale: Some users cannot or prefer not to use a mouse.*

### 7.5 Browser Compatibility

**NFR-013:** The application must function correctly on latest versions of Chrome, Firefox, Safari, and Edge.  
*Rationale: Corporate environments use varied browser configurations.*

---


## 8. Technical Constraints

### 8.1 Technology Stack (Fixed)

The following technology choices are fixed and cannot be changed:

| Layer | Technology | Version | Constraint |
|-------|------------|---------|------------|
| Framework | Next.js (App Router) | 16.0.10 | Must use `proxy.ts`, NOT `middleware.ts` |
| UI Library | React | 19.2.0 | Server Components enabled; use `OrgContext.Provider` not `<OrgContext>` |
| Language | TypeScript | ^5 | `strict: true`, `bundler` moduleResolution |
| Styling | Tailwind CSS 4 | ^4.1.9 | OKLCH colour vars, `@tailwindcss/postcss` |
| Components | shadcn/ui (New York) | 57 components | Add via shadcn CLI, not manually |
| Backend/DB | Convex | ^1.31.7 | Real-time, separate deployment from Vercel |
| Auth | WorkOS AuthKit | ^2.14.0 | JWT; staging keys currently, must migrate to live |
| Package Manager | pnpm | 9.15.0 | NEVER use npm or yarn |
| Deploy | Vercel | — | Auto-deploy on push to main |

### 8.2 Critical Implementation Rules

**Never Do These:**
- NEVER use `middleware.ts` — Next.js 16 uses `proxy.ts`
- NEVER use `<OrgContext>` as JSX — use `OrgContext.Provider` (React 19)
- NEVER use WorkOS `useAuth()` to check Convex auth readiness — use `useConvexAuth()`
- NEVER add manual cache invalidation for Convex mutations — reactivity is automatic
- NEVER use npm or yarn — only pnpm
- NEVER assume WorkOS JWT contains email/name — it only has `subject` (user ID)
- NEVER modify `components/ui/` files manually — use shadcn CLI
- NEVER check `RSC` header in proxy.ts — use `Sec-Fetch-Dest` instead
- NEVER place early returns before hook calls in `page.tsx` — violates React 19 rules

### 8.3 Architectural Decisions Already Made

The following ADRs are binding and cannot be changed without explicit approval:

- **ADR-006:** Focus on Logic Model view only (other views deferred)
- **ADR-008:** All changes through BMAD pipeline
- **ADR-009:** Four-tier role model (Super Admin / Channel Partner / Admin / Viewer)
- **ADR-017:** Cross-model breakage is architectural — needs proper architecture, not individual fixes
- **ADR-003:** Agent Canvas removed from scope
- **ADR-004:** Portfolios deferred until core is stable

### 8.4 Database Schema Constraints

**Current Schema (Cannot Break Existing Data):**
- `organisations` — client orgs with status, soft delete
- `users` — synced from WorkOS (workosId, email, name)
- `memberships` — user ↔ org bridge with role (3-tier currently, evolving to 4-tier)
- `systems` — core strategic planning units with orgId tenancy
- `elements` — outcomes, value_chain, resources per system
- `matrixCells` — contribution, development, convergence matrices
- `kpis` — linked to elements
- `capabilities` — current/necessary per resource
- `externalValues` — convergence map columns
- `factors` — per value chain element
- `auditLogs` — compliance trail

**Migration Requirements:**
- Existing systems without orgId must remain accessible during migration
- Soft delete pattern (`deletedAt` timestamp) must be used, never hard delete
- Role enum must support expansion from 3 to 4 tiers without breaking existing data

### 8.5 Security Boundary

- Security boundary is at `systems.list` (entry point)
- All child queries chain through `systemId`
- All mutations must call `requireAuth()` or `requireRole()` before data access
- Never expose `WORKOS_API_KEY` or `WORKOS_COOKIE_PASSWORD` to client
- Convex deployment is separate from Vercel: `npx convex dev --once`

### 8.6 Development Workflow Constraints

- Main branch: `main`
- Feature branches mandatory — never commit directly to main (ADR-005)
- All changes through BMAD pipeline (ADR-008)
- QA gate required for all BMAD pipeline output (INFRA-006)
- Use `printf` not `echo` when piping to `vercel env add`

---

## 9. Domain-Specific Considerations

### 9.1 Enterprise Strategy Management Domain

**Complexity Level:** High

**Domain Characteristics:**
- **Long sales cycles:** Enterprise clients take 3-6 months to decide
- **High touch:** Strategy consulting requires significant human interaction
- **Relationship-driven:** Trust between consultant and client is paramount
- **Outcome-oriented:** Clients buy results, not features
- **Regulatory awareness:** Government and non-profit clients have compliance requirements

**Strategic Implications:**
- The tool must enhance, not replace, the consultant-client relationship
- Demo reliability is critical—one failed demo can kill a six-month sales process
- Exports must be board-ready; stakeholders judge professionalism
- Data isolation isn't just technical—it's a business model requirement for Channel Partners

### 9.2 GovTech / Non-Profit Considerations

**Compliance Requirements:**
- Accessibility standards (WCAG 2.1 Level AA) for government clients
- Data sovereignty preferences (Australian clients may prefer Australian-hosted data)
- Audit trails for grant-funded organisations
- Transparency requirements for public-sector strategy

**Procurement Patterns:**
- Government clients require formal procurement processes
- Non-profits have limited budgets but high engagement needs
- Both sectors value "social proof"—case studies from similar organisations

**User Diversity:**
- Board members may be volunteers with limited tech comfort
- Operational staff may have high domain expertise but low strategy training
- Executives need high-level summaries, not detailed nodes

### 9.3 Professional Services / Channel Partner Model

**Business Model Implications:**
- Channel Partners are essentially resellers/consultants using Jigsaw as a platform
- They need portfolio visibility without seeing competitors' clients
- Self-service client onboarding reduces CPF's operational overhead
- The model enables scalability beyond Nicolas's personal capacity

**Competitive Intelligence:**
- Partners must NEVER see other partners' clients, revenue, or strategy details
- Channel-scoped visibility is a competitive differentiator against generic strategy tools
- Audit trails must track partner actions for compliance

### 9.4 Australian Market Context

**Localisation Needs:**
- ABN (Australian Business Number) field already in schema
- Date formats (DD/MM/YYYY) may be expected
- Spelling preferences ("organisation" not "organization")
- Time zone handling for real-time collaboration

**Market Positioning:**
- CPF is an Australian consultancy with Australian clients
- Jigsaw is positioned as a premium tool for serious strategy work
- Reference clients (MERA, Central Highlands) provide credibility in market

---

## 10. Feature Register Mapping

### 10.1 Bug Fixes Required (All mapped to FRs)

| ID | Issue | Mapped FR |
|----|-------|-----------|
| BUG-001 | Homepage 404 when logged out | FR-001 |
| BUG-002 | Real-time sync failure (Delivery Culture) | FR-015 |
| BUG-003 | Real-time sync failure (System Context) | FR-016 |
| BUG-004 | Colour mode non-functional | FR-021, FR-022 |
| BUG-005 | Add System sidebar button broken | FR-025 |
| BUG-006 | Session persistence (security) | FR-003, NFR-010 |
| BUG-007 | No save confirmation feedback | FR-020 |
| BUG-008 | Stale data on node reopen | FR-019 |
| BUG-009 | Permission conflation | FR-004, FR-007, NFR-005 |
| BUG-010 | WorkOS auth race condition | Architecture fix |
| BUG-011 | Sign-out redirects to error | FR-002 |
| BUG-012 | Delete broken across ALL models | FR-018, FR-021 |
| BUG-013 | Add-node button broken | FR-017 |
| BUG-014 | "Unknown" organisation display | FR-028 |
| BUG-015 | Duplicate sign-in buttons | FR-036 |
| BUG-016 | Export buttons non-functional | FR-029, FR-030, FR-031 |
| BUG-017 | Data isolation bug | FR-026, FR-007, NFR-005 |
| BUG-018 | Development Pathways all modes broken | FR-021 |
| BUG-019 | Favicon shows v0 placeholder | FR-034 |
| BUG-020 | Convex indicator visible line | FR-035 |

### 10.2 Features Required (All mapped to FRs)

| ID | Feature | Mapped FR |
|----|---------|-----------|
| FEAT-001 | Logged-out landing page | FR-001 |
| FEAT-002 | Logout button | FR-002 |
| FEAT-003 | "Keep me logged in" toggle | FR-003, NFR-010 |
| FEAT-004 | Save confirmation feedback | FR-020 |
| FEAT-005 | Undo/go-back | FR-040 (Phase 3) |
| FEAT-006 | Invite-only viewer access | FR-008 |
| FEAT-007 | Add System popup/modal | FR-025 |
| FEAT-008 | Channel Partner role | FR-004, FR-005, FR-006 |
| FEAT-009 | Channel management admin page | FR-005, FR-006 |
| FEAT-010 | Invitation system | FR-008, FR-009 |
| FEAT-011 | System-level role differentiation | Phase 3 |
| FEAT-012 | Excel/PDF/image export | FR-029, FR-030, FR-031 |
| FEAT-013 | Dynamic theming | Phase 3 |
| FEAT-014 | Font size per node | Phase 3 |
| FEAT-015 | KPI numbers in nodes | FR-041 (Phase 3) |
| FEAT-016 | Email communication flow | Phase 2 |
| FEAT-017 | User role display | FR-010 |
| FEAT-018 | Placeholder guidance text | FR-032 |
| FEAT-019 | Node colour empty vs filled | FR-033 |
| FEAT-020 | Proper Jigsaw logo | FR-034 |
| FEAT-021 | Notification system | FR-020, Phase 2 |

### 10.3 UI/Visual Changes (All mapped to FRs)

| ID | Change | Mapped FR |
|----|--------|-----------|
| UI-001 | Rename to "Strategic Management System" | In journey text |
| UI-002 | KPI field redundancy in non-edit modes | FR-024 |
| UI-003 | Arrow buttons in wrong modes | FR-023, FR-024 |
| UI-004 | Performance vs Stage redundancy | FR-042 (Architecture phase) |
| UI-005 | Systems dropdown rendering | FR-027 |
| UI-006 | Consolidate sign-in buttons | FR-036 |
| UI-007 | Show user role beneath username | FR-010 |
| UI-008 | Replace favicon | FR-034 |
| UI-009 | Create proper logo | Phase 3 |
| UI-010 | Reposition Convex indicator | FR-035 |
| UI-011 | Node colour empty vs filled | FR-033 |
| UI-012 | Placeholder guidance text | FR-032 |
| UI-013 | Dynamic theming | Phase 3 |
| UI-014 | Font size per node | Phase 3 |

---

## 11. Appendix

### 11.1 Active Clients

- Central Highlands Council (Tasmania)
- Relationships Australia (Tasmania)
- Kiraa
- MERA
- Levur
- Illawarra Energy Storage

### 11.2 Production Environment

- **URL:** https://jigsaw-1-6-rsa.vercel.app
- **Convex Deployment:** hidden-fish-6
- **Auth:** WorkOS AuthKit (staging keys currently)

### 11.3 Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-02-23 | BMAD AI Orchestrator | Initial PRD creation from Feature Register v2 |

---

*End of Product Requirements Document*
