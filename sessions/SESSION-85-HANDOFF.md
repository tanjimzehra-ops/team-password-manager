# Session 85 Handoff — Jigsaw 1.6 Frontend/Backend Completion

**Date:** 2026-02-21
**Author:** Claudia (orchestrator)
**Next:** Execute Tier 1 + Tier 2 via Claude Code (tmux, --dangerously-skip-permissions)

---

## Context

Jigsaw 1.6 RSA has 4 complete views, auth (Blocks 1-6), CRUD, exports, and is deployed to Vercel. Gap analysis completed today comparing PRD + BMAD Brainstorming + actual code. The goal is to finish what's needed for real client use.

**Full gap analysis:** `/Users/nicolaspt/.openclaw/workspace/design-system/JIGSAW_16_GAP_ANALYSIS.md`

---

## Tier 1 — Must-have for clients (execute first)

| # | Story | Complexity | Details |
|---|-------|-----------|---------|
| 1.1 | **Sign-out button in header** | Low | Add sign-out to `components/header.tsx`. WorkOS AuthKit provides `signOut()`. Show when user is authenticated. |
| 1.2 | **Login UX improvement** | Medium | Martin couldn't find sign-in. Need: clear sign-in button on landing page when not auth'd, redirect to `/sign-in` from protected routes, friendly first-time experience. |
| 1.3 | **User avatar in header** | Low | WorkOS provides `profilePictureUrl` via session. Display in header next to sign-out. Fallback to initials. |
| 1.4 | **Empty states for views** | Low | When a system has no elements, show helpful message + illustration instead of blank screen. Each view needs its own empty state. |
| 1.5 | **Fix TypeScript strict mode** | Medium | Run `pnpm build` without `ignoreBuildErrors: true`. Fix all type errors. Remove the flag from `next.config.mjs`. |

## Tier 2 — Significant product improvement (execute after Tier 1)

| # | Story | Complexity | Details |
|---|-------|-----------|---------|
| 2.1 | **Global search** | Medium | Search bar in sidebar or header. Search systems by name, elements by content. Use Convex search indexes. |
| 2.2 | **Org switcher** | Medium | For multi-org users (consultants). Dropdown in header showing orgs user belongs to. Filters systems by selected org. Uses `memberships` table. |
| 2.3 | **Enhanced Excel export** | Medium | Professional formatting: colours, headers, 4 views in separate sheets, logo placeholder. Replace current basic export. |
| 2.4 | **Onboarding tour** | Medium | First-time guided tooltips explaining Logic Model, views, modes. Use react-joyride or similar. Store "seen" flag in localStorage. |
| 2.5 | **Audit logging** | Medium | New `auditLogs` table in Convex schema. Log mutations (create/update/delete). Viewer at `/admin/audit`. Super admin only. |
| 2.6 | **Soft delete restore UI** | Low | Backend has `deletedAt` on systems/users/orgs. Add "Trash" section in admin with restore button. |

---

## Tech Stack Reminders

- **pnpm** (never npm/yarn)
- Next.js 16 + React 19 + TypeScript
- Convex (`hidden-fish-6`) — `npx convex dev` for local
- WorkOS AuthKit (`@workos-inc/authkit-nextjs@2.14.0`)
- Tailwind CSS 4 + shadcn/ui (New York style)
- Key files: `app/page.tsx` (orchestrator), `proxy.ts` (auth middleware), `convex/schema.ts`, `convex/lib/permissions.ts`

## Execution Strategy

1. Claudia writes stories with acceptance criteria
2. Claude Code executes via tmux (`--dangerously-skip-permissions`)
3. Stories executed sequentially: 1.1 → 1.2 → 1.3 → 1.4 → 1.5 → 2.1 → ...
4. After each story: verify build, test in browser, commit
5. Push after each tier complete

---

## Other Pending (NOT this session)

- Production WorkOS keys (needs WorkOS dashboard — Nicolas)
- Team onboarding (Martin/Pradeep/Tanjim sign-in)
- CHC proposal design pass (Typst template needs iteration)
- Martin PPT review + HTML presentation
- Cortexia V2 Product Brief
