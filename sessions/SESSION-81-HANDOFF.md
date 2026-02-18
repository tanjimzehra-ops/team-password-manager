# Session 81 Handoff — Brainstorming Session B: Auth Architecture

**Date:** 2026-02-17
**Branch:** main (no code changes this session — brainstorming only)
**Duration:** ~2 hours
**Session Type:** BMAD Brainstorming (Session B of 2)

## What Was Accomplished

### Brainstorming Session B: Auth + Multi-Tenant Architecture
- Completed Phase 2 (Question Storming) and Phase 3 (Constraint Mapping) from the brainstorming workflow
- 26 new ideas generated (56 total across Sessions A+B)
- Full architecture designed and validated by Nicolas

### Research Conducted (3 Parallel Agents)
1. **WorkOS CLI** — `npx workos` (Jan 2026) auto-scaffolds Next.js auth. First-class Convex integration via `@convex-dev/workos-authkit`.
2. **Pradeep's Branch** (`feature/backend-security-features`) — 51 files, 7 docs. Phase A (auth + RBAC) coded, Phase B (org-scoped queries) not. Reference only — we start fresh.
3. **Current Convex Schema** — 8 tables, zero auth. All data accessible to everyone.

### Key Architecture Decisions

| Decision | Choice |
|---|---|
| Auth provider | WorkOS AuthKit (Nicolas's account) |
| CLI setup | `npx workos` for Next.js + `@convex-dev/workos-authkit` for Convex |
| Multi-tenancy | `orgId` field on `systems` table in Convex |
| Roles (MVP) | Super Admin, Admin, Viewer |
| Role storage | Convex `memberships` table (not WorkOS) |
| Admin management | In-app `/admin` console |
| Onboarding | Super admin creates org → WorkOS sends invite → client joins |
| Backup | Soft delete (`deletedAt`) + Convex daily snapshots |
| Pradeep's code | Reference/patterns only — rebuild fresh on official tools |
| Super admins | Nicolas, Martin, Pradeep, Tanjim (seeded by email) |

### Data Model (New Tables)

```
organisations: name, contactEmail, contactNumber, abn, channel, createdBy, status
users: workosId, email, name (synced from WorkOS webhooks)
memberships: userId, orgId, role (multi-org bridge)
systems: + orgId field (tenancy boundary)
```

### Build Order (7 Blocks)

| Block | Task | Depends On | Owner | Est. Time |
|-------|------|------------|-------|-----------|
| 0 | WorkOS Account Setup | Nothing | Nicolas | 30 min |
| 1 | Auth Scaffolding | Block 0 | Agent 1 | 15 min |
| 2 | Schema Migration | Nothing | Agent 2 (parallel) | 20 min |
| 3 | RBAC + Org-Scoped Queries | Block 1+2 | Agent 1 | 45 min |
| 4 | Admin Console UI | Block 2+3 | Agent 2 | 1 hour |
| 5 | Data Migration + Seeding | Block 2+3 | Agent + Nicolas | 30 min |
| 6 | Deploy + Verify | All above | Nicolas + Agent | 30 min |
| 7 | Post-Deploy Enhancements | Block 6 | Agents | Ongoing |

## Unblocking Requirements (Nicolas Must Provide)

1. **WorkOS credentials** — `WORKOS_CLIENT_ID` and `WORKOS_API_KEY` from Nicolas's account
2. **Convex production deployment URL** — for webhook endpoint configuration
3. **Org-to-system mapping** — which existing systems belong to which client orgs
4. **Super admin emails** — for the 4 team members

## Key Reference Files

- Brainstorming output: `_bmad-output/brainstorming/brainstorming-session-2026-02-16.md`
- Pradeep's docs (reference): `https://github.com/nicopt-io/Jigsaw-1.6-RSA/tree/feature/backend-security-features/docs`
- Screenshots: `sessions/screenshots-ref/` (5 images from Blazor Jigsaw — clients list, create form, systems list, permission matrix)
- Convex schema: `convex/schema.ts`
- Current provider: `components/providers/convex-provider.tsx`

## What's Next (Session 82+)

### Option A: Start Implementation
If Nicolas provides WorkOS credentials, implementation can begin immediately following the 7-block build order.

### Option B: Generate PRD First
Run the BMAD PRD workflow using the combined brainstorming output (Sessions A+B) as the input brief. This would generate formal epics, stories, and acceptance criteria.

### Deferred to Later Sprints
- Dashboard concept (Session A, ideas #1-30)
- Galaxy View vision (Goal 5 — not covered)
- AI narratives and strategy assistant
- Manager/Employee roles (expand from 3 to 5)
- Granular per-user permissions (admin tick boxes)
- Demo org with dummy data
- Dynamic theming per client
- Custom email templates for invitations

## Git Status
No code changes. Brainstorming session only. Main branch unchanged.
