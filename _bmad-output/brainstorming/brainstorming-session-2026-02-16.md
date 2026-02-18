---
stepsCompleted: [1, 2, 3]
inputDocuments:
  - ~/Jigsaw_2.0_dev/sessions/2026-02-16-bmad-brainstorm/BMAD_BRAINSTORM_PROMPT.md
  - ~/Jigsaw_2.0_dev/jigsaw-1.6/FRONTEND_ROADMAP.md
  - ~/Jigsaw-1.6-RSA/sessions/SESSION-80-HANDOFF.md
  - ~/Jigsaw_2.0_dev/OBS_notes/Jigsaw20/team-sessions-february-2026/10-02/draft-plan-jigsaw-improvements.md
  - ~/Jigsaw_2.0_dev/OBS_notes/Jigsaw20/team-sessions-february-2026/10-02/2026-02-10-cpf-team-am/RECOMMENDATIONS.md
  - ~/Jigsaw_2.0_dev/OBS_notes/Jigsaw20/team-sessions-february-2026/10-02/2026-02-10-cpf-team-PM/RECOMMENDATIONS.md
  - Pradeep's branch: feature/backend-security-features/docs (7 files)
  - WorkOS CLI docs, Convex AuthKit docs, template repos
session_topic: 'Jigsaw 1.6 RSA — Next Phase Feature Planning (Sessions A+B)'
session_goals: 'Dashboard concept, Auth architecture, Multi-tenant data model, Admin console, Build order'
selected_approach: 'ai-recommended'
techniques_used: ['role-playing', 'question-storming', 'constraint-mapping']
ideas_generated: 56
context_file: '~/Jigsaw_2.0_dev/sessions/2026-02-16-bmad-brainstorm/BMAD_BRAINSTORM_PROMPT.md'
session_status: 'complete — Sessions A+B finished, ready for PRD'
technique_execution_complete: true
facilitation_notes: 'Session B pivoted from dashboard features to auth/deploy priorities. Research-driven brainstorming using 3 parallel agents for intelligence gathering. Nicolas decisive — answered 15 architecture questions rapidly. Permission Matrix screenshot from Blazor Jigsaw provided the role model.'
---

# Brainstorming Session Results — Session A: The Foundation

**Facilitator:** Nicolas
**Date:** 2026-02-16
**Status:** Phase 1 complete. Phases 2-3 continue in Session B (17 Feb 2026).

---

## Session Overview

**Topic:** Jigsaw 1.6 RSA — Next Phase Feature Planning (Sprints 2-4, Feb 17 - Mar 7, 2026)
**Goals:** Dashboard concept deep-dive, Client Portal vs Admin Portal architecture, Backend dependency chain

### Context Guidance

- Product is ~80% MVP-complete with 4 interactive visualisations, full CRUD via Convex, export, edit modes
- Auth decision: WorkOS (definitive)
- Tanjim's branches: reference only, implement fresh
- Pre-validated feature tiers locked by Nicolas (Tier 2/3/4)
- Session A covers foundation goals (2, 3, 4); Session B will cover features (1, 5, 6)

### Session Structure

- **Goal 2:** Dashboard concept — what users see when opening a system
- **Goal 3:** Client Portal vs Admin Portal — who sees what, data model implications
- **Goal 4:** Backend dependencies — what must be built first

### Approach

AI-Recommended progressive facilitation using Role Playing (personas) to explore the Dashboard concept from multiple user perspectives.

---

## Technique Selection

**Approach:** AI-Recommended Techniques
**Analysis Context:** Product architecture and feature planning for a strategic planning visualisation tool

**Recommended Techniques:**

- **Phase 1: Role Playing** — Explore Dashboard through 4 user personas (Martin demo, Sarah client, Nicolas consultant, non-expert user). Completed in Session A.
- **Phase 2: Question Storming** — Rapid-fire questions about Client Portal vs Admin Portal architecture. Pending for Session B.
- **Phase 3: Constraint Mapping** — Map backend dependencies: what must exist before each feature can work. Pending for Session B.

---

## Phase 1: Role Playing — Dashboard Concept (COMPLETE)

### Technique Execution Results

**Interactive Focus:** Dashboard concept explored through 4 personas — CEO demoing, client user, consultant/CPO, non-expert user
**Energy Level:** High throughout — Nicolas deeply engaged, provided vision-level insights beyond the original scope
**Key Breakthrough:** Dashboard isn't just a feature — it's the product's identity shift from "visualisation tool" to "strategy intelligence platform"

---

### All Ideas Generated (30 total)

#### Persona 1: Martin — The CEO Demo

**[Dashboard #1]**: The Strategy Health Scoreboard
_Concept_: When you open a system, the first thing you see is a high-level health dashboard — green/amber/red KPI indicators showing how the whole strategy is performing. It answers "how are we doing?" before "what are we doing?"
_Novelty_: Most strategy tools dump you into the model. This puts the result first — health and performance — then lets you explore why.

**[Dashboard #2]**: Node as Knowledge Centre
_Concept_: Each node (objective, resource, value chain element) isn't just a box on a grid — it's a living knowledge centre. Click it and it expands like a ClickUp task: KPIs, documents, notes, attachments, activity history. Single source of truth for that strategic element.
_Novelty_: Strategy tools show boxes and arrows. This treats each element as a manageable unit of work — like project management for strategy.

**[Dashboard #3]**: Dashboard as Aggregated Health View
_Concept_: If each node is a knowledge centre with its own KPIs and status, then the Dashboard is the aggregation — the "roll-up" of all nodes into a single health picture. Every green/red traces back to a specific node you can click into.
_Novelty_: The dashboard isn't a separate thing you design — it emerges from the data already living inside the nodes.

**[Dashboard #4]**: Executive Summary Narrative
_Concept_: The Dashboard includes a written narrative section — a paragraph that explains what's happening in plain language. Not just charts and numbers but interpretation: "MERA's strategy is performing well overall, with 8 of 12 Key Results on track."
_Novelty_: Strategy dashboards show data. This one explains the data. The difference between a blood test result and the doctor telling you what it means.

**[Dashboard #5]**: View Summaries — The "State of Affairs" per View
_Concept_: Each of the 4 views gets a narrative summary on the Dashboard — not a thumbnail image, but a status narrative. "Your Convergence Map shows strong alignment but two areas need attention." The Dashboard becomes a briefing document.
_Novelty_: You read the summaries first, then dive into whichever view needs your attention. The Dashboard directs your focus.

**[Dashboard #6]**: Development Pathways as the Action Trigger
_Concept_: Development Pathways gets special prominence on the Dashboard because it's where strategy becomes action. Its summary says: "According to your Development Pathways, you should be focusing on [specific capabilities]." It's the "what to do next" section.
_Novelty_: Elevates Dev Pathways from "one of four views" to "the operational engine" — the bridge between strategic thinking and daily work.

**[Dashboard #7]**: AI-Assisted Consulting-Grade Narratives
_Concept_: The system analyses KPI data, node statuses, and relationships across all 4 views, then generates a McKinsey/BCG-grade executive narrative. A consultant reviews and refines before the client sees it. Sharp, strategic, actionable language.
_Novelty_: Turns Jigsaw from a visualisation tool into a strategy intelligence platform. The AI doesn't just show data — it interprets it like a consulting partner.

**[Dashboard #8]**: Modular Interactive Dashboard
_Concept_: Rather than a fixed layout, the Dashboard is composed of modular blocks (health ring, KPI grid, view summaries, alerts, activity) that can be arranged or toggled. Different users or contexts show different modules.
_Novelty_: Future-proofs the Dashboard architecture. Build blocks once, compose them differently for different portals.

#### Persona 2: Sarah — The Client User

**[Dashboard #9]**: The "All Clear" Check — Peace of Mind Design
_Concept_: Sarah's primary need isn't to explore — it's to confirm. The Dashboard's #1 job is to answer "is everything OK?" in under 5 seconds. If all KPIs are green, the Health Ring glows green, the narrative says "Your strategy is on track — no action needed." Red flags only appear when something needs attention.
_Novelty_: Most dashboards show everything. This one shows nothing when nothing is wrong — and screams when something is. An early warning system, not an information overload panel.

**[Dashboard #10]**: AI Strategy Assistant
_Concept_: A help button or chat interface where an AI assistant knows your system's data and can answer questions ("Why is this KR red?"), give recommendations ("Based on your Development Pathways, prioritise hiring for capability X"), and coach strategy thinking. Not a generic chatbot — a consultant that has read all your data.
_Novelty_: The leap from "tool" to "advisor." Every strategy tool shows data. This one tells you what to do about it, grounded in YOUR specific data.

**[Dashboard #11]**: Seamless Edit Flow — Reduce the Steps
_Concept_: The current flow (view in app → export to Excel → edit → re-import) is too many steps. Dashboard and views should let you edit inline where possible, and when export IS needed, it should round-trip cleanly.
_Novelty_: If Jigsaw is the only strategy tool where you don't need to leave the app to work, that's a selling point.

**[Dashboard #12]**: Dual-Mode AI — Passive Narrator + Active Advisor
_Concept_: One AI engine powers both the automatic Dashboard narratives and an interactive assistant. Passively, it generates the McKinsey-grade summary. Actively, it answers questions and gives recommendations. Same data, same intelligence, two modes.
_Novelty_: This isn't two features — it's one feature with two faces. Build the AI engine once, surface it in two ways.

#### Persona 3: Nicolas — The CPO / Consultant

**[Dashboard #13]**: Portfolio Health Overview — The Consultant's Home Screen
_Concept_: Before clicking into any system, the consultant sees ALL their clients as a portfolio. Each client shows a health indicator, usage stats, and a status badge. "MERA is green, Kiraa is amber, Central Highlands has a red flag." You pick up the phone before the client even knows there's a problem.
_Novelty_: Flips the consulting relationship from reactive to proactive. Massive competitive advantage.

**[Dashboard #14]**: Strategy CRM — Performance + Recommendations per Client
_Concept_: Each client in the portfolio shows actionable intelligence: usage patterns, strategic recommendations, relationship management cues. A CRM built for strategy consultants, not salespeople.
_Novelty_: No CRM tracks the health of your client's strategy. This is a new category.

**[Dashboard #15]**: Three-Layer Information Architecture
_Concept_: All information is accessible at three depth levels:
- **Corporate Layer** — Big picture. Health rings, portfolio status, executive summaries. For C-suite and board.
- **Strategy Layer** — Medium depth. View summaries, KPI trends, cross-view insights. For senior managers.
- **Technical Layer** — Full detail. Individual nodes, KPI values, documents, edit history. For operational teams and consultants.
_Novelty_: One product, three audiences. Same data surfaces differently depending on who's looking.

**[Dashboard #16]**: Proactive Knock-on-the-Door Intelligence
_Concept_: The system generates per-client recommendations that a consultant can use to proactively reach out. "Central Highlands hasn't updated KPIs in 3 weeks — check in." "MERA's Dev Pathways suggest a new capability needed in Q3 — schedule a workshop."
_Novelty_: The tool doesn't just serve the client — it feeds the consultant with reasons to engage. A business model feature, not just a product feature.

#### Persona 4: The Non-Expert User

**[Dashboard #17]**: Plain Language Mode — "Explain Like I'm New"
_Concept_: A toggle that replaces strategy jargon with plain language. "Value Chain" becomes "The activities that deliver value." "Strategic Objectives" becomes "What we're trying to achieve." Data stays the same — only labels change.
_Novelty_: The tool adapts to the user, not the other way around.

**[Dashboard #18]**: Contextual Smart Tooltips — Strategy Tutor
_Concept_: Hover over any term and a tooltip shows a 1-2 sentence explanation PLUS a concrete example from their own data. Not "A value chain is a set of activities..." but "Your Value Chain includes 'Community Programs' and 'Client Services' — these are the activities MERA does to deliver its mission."
_Novelty_: The tooltip isn't generic — it uses YOUR data to explain the concept. Immediately concrete and understandable.

**[Dashboard #19]**: Guided Narrative Dashboard — The Story Version
_Concept_: The Dashboard presents strategy as a plain-language story: "MERA exists to support families in crisis (Purpose). They run 8 key programs (Value Chain). They measure success through 12 targets (Key Results). Right now, 9 are on track and 3 need attention."
_Novelty_: A board member reads this and understands the whole strategy without knowing what a "Convergence Map" is.

**[Dashboard #20]**: Progressive Disclosure — Learn as You Go
_Concept_: The app starts simple and reveals complexity as the user engages. First time: big labels with explanations. Second time: explanations shrink to tooltips. Third time: they disappear. Training wheels that come off gradually.
_Novelty_: The app IS the tutorial, and it gets out of the way as you learn.

**[Dashboard #21]**: Strategy Literacy Engine
_Concept_: Jigsaw doesn't just display strategy — it teaches it. Through plain language, contextual tooltips, AI narratives, and guided recommendations, every user becomes more strategy-literate. The tool elevates the organisation's strategic capability.
_Novelty_: The pitch to a CEO: "Jigsaw doesn't just track your strategy — it makes your whole team better at strategic thinking."

#### Vision-Level Ideas (Emerged from Discussion)

**[Dashboard #22]**: Guided Onboarding — Build Your Jigsaw Together
_Concept_: New clients don't face a blank canvas. An onboarding flow asks guided questions: "What's your organisation's purpose?" "What are your main activities?" Step by step, the system builds their Jigsaw from answers. Like TurboTax for strategy.
_Novelty_: Removes the "blank page" fear. The client doesn't need to understand the framework.

**[Dashboard #23]**: De-Martinify — Codify the Consultant's Brain
_Concept_: Martin IS the product right now. The AI-first future means encoding his logic — how he categorises complexity, maps value chains, decides what's an objective vs a resource — into an algorithm. The AI doesn't replace Martin; it scales him.
_Novelty_: Core business case for Jigsaw 2.0. Today it's a tool Martin uses. Tomorrow it's a tool that thinks like Martin.

**[Dashboard #24]**: Complexity Classification Algorithm
_Concept_: An AI algorithm analyses a client's strategic system and categorises its complexity level — simple, moderate, complex. Drives recommendations and helps consultants prioritise.
_Novelty_: No strategy tool tells you HOW complex your strategy is. A meta-layer of intelligence about the strategy itself.

**[Dashboard #25]**: Monte Carlo Strategy Simulator
_Concept_: "If we change this in our Value Chain, what's the impact?" A what-if simulator with probability-based scenarios. Change a resource, see ripple effects through objectives and KPIs with confidence ranges.
_Novelty_: Strategic Mirroring from Tanjim's roadmap, turbocharged with probability modelling. Tier 4/Jigsaw 2.0.

**[Dashboard #26]**: Raw Data Ingestion — Feed the Brain
_Concept_: Connect company data sources (financials, HR, project tools) and let AI map real operational data to strategic elements. "Your HR data shows 15% turnover in engineering — this affects Resource #3."
_Novelty_: Strategy stops being opinion and starts being data-driven.

**[Dashboard #27]**: Authentication — The #1 Blocker
_Concept_: Current Jigsaw 1 (Blazor) users don't use it because logging in is too hard. WorkOS integration with SSO, magic links, social login removes the biggest adoption barrier. Multi-layer: admin, client, guest access.
_Novelty_: Not a feature — a fix for the fundamental adoption problem.

**[Dashboard #28]**: Excel Export That Respects Formatting
_Concept_: Most clients' actual workflow: open Jigsaw, see map, download Excel with all 4 views. The Excel must be professional — proper formatting, colours, headers, 4 visuals in separate sheets. This is the #1 actual user action.
_Novelty_: Not glamorous, but it's what clients ACTUALLY DO. Making this excellent makes Jigsaw indispensable.

**[Dashboard #29]**: Dynamic Theming — Brand Your Strategy
_Concept_: Using shadcn's theming, clients change colours and fonts dynamically. MERA gets their brand colours, Central Highlands gets theirs. Same data, different visual identity. Feels like "their" tool.
_Novelty_: Low effort, high perceived value. Every client thinks the tool was built for them.

**[Dashboard #30]**: Print / Enhanced Export — Presentation-Ready Output
_Concept_: Beyond Excel — PDF, image, or slide-ready exports. A board member receives a beautiful PDF with strategy health, Logic Model visual, and AI narrative. Jigsaw reaches people who never open the app.
_Novelty_: Extends Jigsaw's reach beyond active users. The export IS the product for many stakeholders.

---

## Dashboard Architecture Summary

```
HOME SCREEN (Consultant / Admin Portal)
├── Portfolio Health Overview — all clients at a glance
├── Strategy CRM — usage, performance, recommendations per client
├── Proactive alerts — "knock on the door" intelligence
└── Click into any client → System Dashboard

SYSTEM DASHBOARD (Client Portal / Demo)
├── Strategy Health Ring — single score
├── KPI Traffic Lights — green/amber/red per Key Result
├── AI Executive Narrative — McKinsey-grade, plain language
├── View Summaries — "state of affairs" per view (narrative, not thumbnails)
├── Dev Pathways Actions — "what you should be doing"
├── Recent Activity — last modified, usage
├── Alerts — attention needed
└── Click into any view → Deep detail

NODE DETAIL (All Users)
├── Knowledge Centre — ClickUp model
├── Title, description, KPIs, documents, notes
├── Cross-view connections
└── Expandable, editable

THREE INFORMATION LAYERS:
  Corporate (C-suite) → Strategy (Senior Mgmt) → Technical (Operations)

AI ENGINE:
  Passive: Auto-generated consulting-grade narratives
  Active: Interactive strategy assistant (chat)
  Quality bar: McKinsey / BCG / KPMG grade
```

## Jigsaw 1.6 vs 2.0 Vision Map

| Dimension | Jigsaw 1.6 (Now — Transitional) | Jigsaw 2.0 (Future — AI-First) |
|---|---|---|
| **Intelligence** | Manual data, manual interpretation | AI narratives, recommendations, Monte Carlo |
| **Onboarding** | Blank canvas, Martin explains | Guided questions, AI builds with you |
| **Data Source** | Manual entry | Raw data ingestion from company systems |
| **Access** | WorkOS auth (fixing Blazor problem) | SSO, magic links, guest access, multi-layer |
| **Output** | View in app, basic Excel export | Professional Excel, PDF, slides, print-ready |
| **Scaling** | Martin IS the product | AI codifies Martin's brain |
| **Theming** | Light/Dark toggle | Dynamic brand colours + fonts per client |
| **Complexity** | One-size-fits-all | Complexity classification, plain language mode |

---

## Session B Handoff — Continue 17 Feb 2026

### What's Done
- **Phase 1 complete**: Dashboard concept fully explored through 4 personas
- **30 ideas generated** and documented
- **Dashboard architecture defined** (Home Screen → System Dashboard → Node Detail)
- **Three-layer information architecture** established (Corporate → Strategy → Technical)
- **AI engine concept** defined (dual-mode: passive narrator + active advisor)
- **Jigsaw 1.6 vs 2.0 vision** mapped

### What's Next (Session B)

**Phase 2: Question Storming — Client Portal vs Admin Portal**
- Who are the user types and what can each do?
- Data model for multiple Jigsaws per organisation
- How WorkOS maps to roles and permissions
- Minimal viable separation between portals
- Questions surfaced in Phase 1 to address:
  - Can one person be both client and consultant?
  - Can a client org have multiple Jigsaws?
  - Who sets KPI targets — client or consultant?
  - Client edit permissions — read-only, limited, or full?

**Phase 3: Constraint Mapping — Backend Dependencies**
- What must be built before each feature can work
- WorkOS → Roles → Portals → Dashboard dependency chain
- What Pradeep (BE) can work on in parallel with Tanjim (FE)
- Real vs imagined constraints

**Remaining Goals for Session B:**
- Goal 1: Validate Tanjim's frontend roadmap proposals against the architecture
- Goal 5: Galaxy View vision definition (Tier 4)
- Goal 6: Gap analysis — what's missing from all existing documents

### After Session B → PRD
Once both sessions are complete, the combined output becomes the **input brief for the PRD workflow**. All decisions made, all features tiered, all dependencies mapped.

---

### Creative Facilitation Narrative

Nicolas came exceptionally well-prepared with a structured brainstorming prompt covering 6 goals, pre-validated feature tiers, and clear constraints. The Role Playing technique worked brilliantly — by stepping into Martin's, Sarah's, and his own shoes, Nicolas moved from abstract "dashboard features" to a concrete product vision: Jigsaw as a Strategy Intelligence Platform.

The breakthrough moment was when Nicolas described the three information layers (Corporate → Strategy → Technical) and the Strategy CRM concept. This revealed that the Dashboard isn't just a feature — it's the architectural spine of the entire product. The AI engine concept (passive narrator + active advisor) emerged naturally from connecting the consulting-grade narratives with the AI assistant idea.

Nicolas's non-technical perspective was a strength, not a limitation. He thinks in user outcomes ("tell me everything is fine"), business value ("knock on the door before the client calls"), and quality standards ("McKinsey grade"), which produced ideas grounded in real user needs rather than technical possibilities.

**User Creative Strengths:** Vision-level thinking, strong analogy use (ClickUp, doctor/blood test), instinct for business model implications
**AI Facilitation Approach:** Persona-based exploration with progressive depth, building on each response
**Energy Flow:** Consistently high — Nicolas accelerated as the session progressed, ultimately sharing the full Jigsaw 2.0 vision unprompted

---

## Phase 2: Question Storming — Auth Architecture & Multi-Tenancy (COMPLETE)

### Technique Execution Results

**Interactive Focus:** Authentication architecture, multi-tenancy, roles, permissions, and build dependencies — explored through rapid Question Storming with intelligence-driven research
**Energy Level:** Extremely high — Nicolas answered 15 architecture questions decisively and provided screenshots from the old Blazor Jigsaw as reference
**Key Breakthrough:** The entire auth + multi-tenant + admin console architecture was designed and validated in a single session

### Intelligence Gathering (3 Parallel Research Agents)

Before brainstorming, three agents researched in parallel:
1. **WorkOS CLI & SDK** — Discovered `npx workos` (Jan 2026), first-class Convex integration via `@convex-dev/workos-authkit`, official template repo
2. **Pradeep's Backend Security Branch** — 51 files changed, 7 docs, substantial working code (auth middleware, RBAC helpers, audit logging, admin console, email alerts). Phase A complete, Phase B (org-scoped queries) incomplete.
3. **Current Convex Schema** — 8 tables, zero auth infrastructure, no userId/orgId fields, all data accessible to everyone

### All Ideas Generated (26 new, 56 total)

#### Cluster 1: Authentication Architecture (Ideas #31-35)

**[Auth #31]**: Fresh Start with Official Tools
_Concept_: Abandon Pradeep's manual WorkOS wiring. Use `npx workos` CLI (launched Jan 23, 2026) for Next.js scaffolding + `@convex-dev/workos-authkit` for Convex integration. Official path, minimal custom code.
_Novelty_: The tools didn't exist when Pradeep started. The CLI auto-generates what he manually coded.

**[Auth #32]**: Three-Layer Auth Architecture
_Concept_: Layer 1 (WorkOS AuthKit) handles login/logout/sessions. Layer 2 (`@convex-dev/workos-authkit`) validates JWTs in Convex. Layer 3 (Convex RBAC helpers) enforces business logic. Clean separation of concerns.
_Novelty_: Each layer is independent and replaceable. WorkOS handles identity; Convex handles authorization.

**[Auth #33]**: Nicolas's WorkOS Account as Foundation
_Concept_: Use Nicolas's existing WorkOS account (not Pradeep's). Fresh environment, fresh credentials. Nicolas is the super admin and account owner.
_Novelty_: Avoids credential confusion and gives the CPO direct control of the auth infrastructure.

**[Auth #34]**: Org Scoping via Simple Convex Field
_Concept_: Multi-tenancy through a simple `orgId` field on the `systems` table. No WorkOS Organisations dependency. All child tables already chain through `systemId`, so one checkpoint isolates all data.
_Novelty_: Simplest possible multi-tenant model — one field, one check, complete isolation.

**[Auth #35]**: CLI-Generated Standard Auth (Pradeep's Login as Visual Ref Only)
_Concept_: Use CLI-generated routes and middleware for auth flow. Pradeep's branded CPF login page serves as visual design reference, not code to adopt.
_Novelty_: Lets us benefit from official, maintained code while preserving the brand vision for later.

#### Cluster 2: Multi-Tenancy & Data Isolation (Ideas #36-40)

**[Tenant #36]**: Organisation Entity with Client Metadata
_Concept_: An `organisations` table with: name, contactEmail, contactNumber, abn, channel, createdBy, status. Matches the Blazor Jigsaw "Clients" entity but lives in Convex.
_Novelty_: Replicates proven data model from Jigsaw 1.0 into the new stack.

**[Tenant #37]**: Multi-Org Membership Bridge Table
_Concept_: A `memberships` table: userId + orgId + role. Users can belong to multiple orgs with different roles. Super admins identified by role on any membership.
_Novelty_: Supports the consulting model — Martin consults for multiple clients, each with its own data.

**[Tenant #38]**: Existing Systems as Real Clients
_Concept_: MERA, Central Highlands, etc. are real clients, not demos. Each gets an org record. MERA doubles as internal testing. Future: create dedicated demo org with dummy data.
_Novelty_: No data migration headache — just assign orgId to existing system records.

**[Tenant #39]**: Channel Tracking on Client Creation
_Concept_: When super admin creates a new client, they select a Channel (sales pipeline source — like "KPMG" in the Blazor app). Tracks where business comes from.
_Novelty_: Business intelligence baked into the data model from day one.

**[Tenant #40]**: Simple orgId Filter for MVP
_Concept_: Every query adds `where orgId = user's orgId`. No granular per-system permissions within an org. All systems in an org visible to all org members.
_Novelty_: Simplest viable isolation. Granular permissions are a future enhancement.

#### Cluster 3: Roles & Permissions (Ideas #41-46)

**[Roles #41]**: Three MVP Roles — Super Admin, Admin, Viewer
_Concept_: Ship with 3 roles now. Permission Matrix from Blazor shows 5 (Super Admin, Company Admin, Manager, Employee, Viewer). Store as string union in Convex — expandable to 5 without migration.
_Novelty_: Right-sized for current scale (~10 clients). Future roles are a schema expansion, not a rebuild.

**[Roles #42]**: Permission Matrix (MVP)
_Concept_: Super Admin = read/write/delete all orgs + manage users + cross-org access. Admin = read/write/delete own org + manage own users. Viewer = read own org only.
_Novelty_: Matches the Blazor permission matrix rows 1, 2, and 5 exactly.

**[Roles #43]**: Admin Can Configure Viewer Permissions (Future)
_Concept_: Admins can tick checkboxes per user to grant/restrict specific actions. MVP uses role-based presets; future adds granular toggles.
_Novelty_: Builds toward the Manager/Employee distinction without overengineering now.

**[Roles #44]**: Delete = Admin + Super Admin Only, Backup Required
_Concept_: Only Admin and Super Admin can delete. Since no backup/restore exists yet, soft delete with `deletedAt` field provides safety. Restore = clear the timestamp.
_Novelty_: Zero data loss possible. Every "delete" is reversible.

**[Roles #45]**: Roles in Convex, Not WorkOS
_Concept_: WorkOS handles identity (who you are). Convex handles authorization (what you can do). Roles live in the `memberships` table, managed through Jigsaw's admin console.
_Novelty_: Full control of the permission model without external dependency.

**[Roles #46]**: Four Hardcoded Super Admins (Seed Script)
_Concept_: Nicolas, Martin, Pradeep, Tanjim provisioned via seed mutation matched by email. Not dynamic — a deliberate choice for security.
_Novelty_: Super admin is a privileged status, not a self-service role.

#### Cluster 4: Onboarding & Admin Console (Ideas #47-52)

**[Admin #47]**: In-App Admin Console at /admin
_Concept_: Super admins manage everything inside Jigsaw — no Convex dashboard, no WorkOS dashboard. Pages: /admin/clients, /admin/users, /admin/audit.
_Novelty_: Single pane of glass. Martin never needs to learn Convex or WorkOS.

**[Admin #48]**: Create Client Form (Replicate Blazor)
_Concept_: Form with: Name, Contact Email, Number, ABN, Channel dropdown. "Start from Scratch" or copy from template. Directly replaces the Blazor /Client/Create flow.
_Novelty_: Familiar workflow for Martin. Zero retraining.

**[Admin #49]**: Invitation-Based Onboarding (WorkOS Handles Email)
_Concept_: Super admin creates org in Jigsaw → enters client admin email → WorkOS sends magic link/signup email → client signs up → webhook fires → Convex creates user + membership. No custom email system needed for MVP.
_Novelty_: Leverages WorkOS's built-in invite flow. Zero email infrastructure.

**[Admin #50]**: Client Admin Can Invite Their Team
_Concept_: After a client admin is onboarded, they can invite their own team members (viewers) through Jigsaw. Admin assigns role. Team members receive WorkOS invite.
_Novelty_: Self-service for the client org. Reduces consulting overhead.

**[Admin #51]**: Systems List per Client (Replicate Blazor)
_Concept_: Inside /admin/clients/[id], a table of systems with: System Name, Business Area, view toggles (Contribution Map, Dev Pathways, Convergence Map). Actions: Edit, Delete, View, History.
_Novelty_: Exact replica of Blazor's /Client/1/Systems page.

**[Admin #52]**: Audit Log Viewer
_Concept_: Timestamped table of all actions: who, what, when. Filterable by user, action type, date range. Accessible only to super admins.
_Novelty_: Accountability without complexity. Pradeep's `logAudit()` code is a reference.

#### Cluster 5: Build Order & Dependencies (Ideas #53-56)

**[Build #53]**: Seven-Block Dependency Chain
_Concept_: Block 0 (WorkOS setup, Nicolas, 30min) → Block 1 (Auth scaffolding, agent) → Block 2 (Schema migration, agent, parallel with 1) → Block 3 (RBAC + queries) → Block 4 (Admin console) → Block 5 (Data migration + seeding) → Block 6 (Deploy + verify) → Block 7 (Post-deploy enhancements).
_Novelty_: Parallelisation map shows 2 agents can work simultaneously, converging at deploy.

**[Build #54]**: Two-Agent Parallelisation
_Concept_: Agent 1 handles auth flow (Block 1→3: scaffolding, RBAC, queries). Agent 2 handles data structure (Block 2→4: schema, admin console). They merge at Block 5 (migration) and Block 6 (deploy).
_Novelty_: Halves the implementation time by exploiting independent work streams.

**[Build #55]**: Soft Delete as Backup Strategy
_Concept_: Never hard-delete. Add `deletedAt` timestamp to systems and elements. "Delete" = set timestamp. "Restore" = clear it. Combined with Convex's daily snapshots, this gives full recovery without building a custom backup system.
_Novelty_: Pragmatic for ~10 clients with light usage. Zero infrastructure cost.

**[Build #56]**: Pradeep's Code as Pattern Library
_Concept_: Don't adopt Pradeep's branch wholesale. Cherry-pick patterns: permission helpers structure, audit logging approach, email alerts via Resend, admin console UI layout. Rebuild using official tools + these proven patterns.
_Novelty_: Respects Pradeep's work while building on a cleaner foundation.

---

## Phase 3: Constraint Mapping — Backend Dependencies (COMPLETE)

### Build Order (Validated by Nicolas)

| Block | Task | Depends On | Owner | Duration |
|-------|------|------------|-------|----------|
| 0 | WorkOS Account Setup | Nothing | Nicolas | 30 min |
| 1 | Auth Scaffolding (npx workos + Convex auth) | Block 0 | Agent 1 | 15 min |
| 2 | Schema Migration (new tables + orgId) | Nothing | Agent 2 | 20 min |
| 3 | RBAC + Org-Scoped Queries | Block 1 + 2 | Agent 1 | 45 min |
| 4 | Admin Console UI | Block 2 + 3 | Agent 2 | 1 hour |
| 5 | Data Migration + Super Admin Seeding | Block 2 + 3 | Agent + Nicolas | 30 min |
| 6 | Deploy to Vercel + Verify | Block 1-5 | Nicolas + Agent | 30 min |
| 7 | Post-Deploy (soft delete, audit, export fixes) | Block 6 | Agents | Ongoing |

### Architecture Summary

```
AUTHENTICATION: WorkOS AuthKit → npx workos scaffolding → @convex-dev/workos-authkit
DATA MODEL: organisations + users + memberships + orgId on systems
ROLES: Super Admin | Admin | Viewer (expandable to 5)
ISOLATION: orgId filter on every query, permission check on every mutation
ADMIN: /admin console in Jigsaw (clients, users, audit)
ONBOARDING: Super admin creates org → WorkOS sends invite → client joins
BACKUP: Soft delete (deletedAt) + Convex daily snapshots
```

### Unblocking Requirements (Nicolas Must Provide)

1. WorkOS credentials (WORKOS_CLIENT_ID, WORKOS_API_KEY) from Nicolas's account
2. Convex production deployment URL (for webhook endpoint)
3. Org-to-system mapping (which existing systems belong to which client orgs)
4. Email addresses for the 4 super admins

---

## Jigsaw 1.6 vs 2.0 Vision Map (Updated)

| Dimension | Jigsaw 1.6 (Now — Transitional) | Jigsaw 2.0 (Future — AI-First) |
|---|---|---|
| **Authentication** | WorkOS AuthKit, 3 roles, invitation-based | SSO, magic links, 5 roles, self-service signup |
| **Multi-tenancy** | orgId on systems, simple filter | Full org isolation, per-system permissions |
| **Admin** | /admin console for super admins | Admin + Company Admin dashboards |
| **Intelligence** | Manual data, manual interpretation | AI narratives, recommendations, Monte Carlo |
| **Onboarding** | Super admin creates client, sends link | Guided questions, AI builds with you |
| **Data Source** | Manual entry | Raw data ingestion from company systems |
| **Output** | View in app, basic Excel export | Professional Excel, PDF, slides, print-ready |
| **Scaling** | Martin IS the product | AI codifies Martin's brain |
| **Theming** | Light/Dark toggle | Dynamic brand colours + fonts per client |
| **Backup** | Soft delete + Convex snapshots | Versioned history, point-in-time restore |

---

### Creative Facilitation Narrative — Session B

Session B represented a decisive pivot from Session A's exploratory vision work to Session B's execution-focused architecture design. Nicolas arrived with a clear mandate: ship authentication NOW. The brainstorming technique adapted accordingly — Question Storming replaced Role Playing, and Constraint Mapping replaced the planned Galaxy View exploration.

The breakthrough was the research-first approach: three parallel agents gathered intelligence on WorkOS CLI capabilities, Pradeep's existing code, and the current Convex schema. This meant the brainstorming operated on facts, not assumptions. When Nicolas was asked 15 architecture questions, he answered all 15 decisively because the options were grounded in real technical possibilities.

The Permission Matrix screenshot from the old Blazor Jigsaw was the key artifact — it showed that the role model Nicolas wanted already existed and had been battle-tested. The architecture proposal replicated proven patterns (the Blazor Clients form, the systems-per-client model) while upgrading the technology (WorkOS + Convex instead of Azure + Blazor).

**User Creative Strengths:** Decisive, business-focused, knows what the old system did and wants to replicate it better
**AI Facilitation Approach:** Research-driven intelligence brief → rapid question clusters → architecture synthesis → dependency mapping
**Energy Flow:** Started high, accelerated through architecture design, peaked at constraint mapping

---

### After Sessions A+B → PRD

The combined output of both sessions provides the complete input brief for the PRD workflow:
- **Session A:** Dashboard concept, three-layer information architecture, AI engine vision, Jigsaw 1.6 vs 2.0 map
- **Session B:** Auth architecture, data model, role system, admin console, build order, dependency chain

All decisions made. All features tiered. All dependencies mapped. Ready for PRD generation.
