# BMAD Cursor Handoff — Jigsaw 1.6 RSA

**Date:** 2026-02-25
**From:** Claudia (OpenClaw Orchestrator)
**To:** BMAD Dev Agent in Cursor
**Branch:** `sprint/full-pipeline` (30 commits ahead of main)

---

## Prompt for BMAD Dev Agent

Copy this into Cursor:

---

You are the BMAD Dev Agent working on Jigsaw 1.6 RSA. Load your persona from `_bmad/bmm/workflows/4-implementation/dev-story/workflow.yaml`.

### Current State

Branch `sprint/full-pipeline` has completed 38 stories (32 original + 6 remediation). The app runs locally on `localhost:3000` with a dev auth bypass (no WorkOS login needed).

**Dev bypass is active:**
- Frontend: `NEXT_PUBLIC_DEV_BYPASS_AUTH=true` in `.env.local`
- Backend: `CONVEX_DEV_BYPASS_AUTH=true` set on Convex deployment `hidden-fish-6`
- The bypass returns Nicolas's user (super_admin) — see `convex/lib/permissions.ts`

**Convex deployment:** `dev:hidden-fish-6` (push with `npx convex dev --once`)

### Known Issues to Fix

**ISSUE 1 — Systems not showing data (CRITICAL)**
When clicking on systems in the sidebar, some systems don't display their data (elements, KPIs, etc.) even though the data exists in Convex. MERA works but others may not.

Root cause investigation so far:
- `withReadAccess()` in `convex/lib/queries.ts` was added to all data queries (Story 8.1)
- Backend debug confirms: Nicolas has `canAccess: true` and `isSuper: true` for all systems
- The issue may be frontend-side: check how `app/page.tsx` fetches data when a system is selected
- Check the browser console for Convex query errors — `withReadAccess` throws on failure, which may cause the query to return undefined instead of data
- New systems created via "Add System" are empty by design — they need nodes added in Edit mode

**To debug:**
1. Run `pnpm dev` and open `localhost:3000`
2. Select different systems in the sidebar
3. Check browser console (F12) for any Convex errors
4. If queries throw, the fix is to make `withReadAccess` return empty array instead of throwing, OR catch errors in the frontend

**ISSUE 2 — Dynamic import error in systems.create (FIXED but check for more)**
Convex doesn't support `await import()`. One instance was fixed in `convex/systems.ts` (line 151). Search all convex/ files for any remaining dynamic imports:
```bash
grep -rn "await import" convex/
```

**ISSUE 3 — Header shows org name even when no system selected**
When the app loads with empty state ("Welcome to Jigsaw"), the header still shows "creating Preferred Futures: Relationships Australia – Tasmania". It should show just "Jigsaw" or be blank when no system is selected.

**ISSUE 4 — Systems list in sidebar doesn't show all systems**
The sidebar should show ALL systems the user has access to (as super_admin, that's all systems). Verify `convex/systems.ts` list query returns all systems and that the frontend renders them all.

**ISSUE 5 — Verify Edit mode "+" button and Order mode arrows**
- In Edit mode: "+" button should appear at the end of each row (Strategic Objectives, Value Chain, Resources) to add new nodes
- In Order mode: up/down arrow buttons should appear on each node to reorder
- These were implemented in Story 1.5 and 1.6 but not yet verified by the owner

### Key Files

**Backend (Convex):**
- `convex/lib/queries.ts` — withReadAccess (new, Story 8.1)
- `convex/lib/mutations.ts` — withWriteAccess (existing)
- `convex/lib/permissions.ts` — RBAC + dev bypass
- `convex/lib/crypto.ts` — SHA-256 for token hashing (new, Story 8.2)
- `convex/systems.ts` — system CRUD
- `convex/elements.ts`, `convex/kpis.ts`, `convex/capabilities.ts`, `convex/matrixCells.ts`, `convex/factors.ts`, `convex/externalValues.ts` — all data queries now use withReadAccess
- `convex/channels.ts` — channel CRUD (new)
- `convex/invitations.ts` — invitation system with hashed tokens (new)
- `convex/migrations.ts` — legacy system migration (new)
- `convex/debug.ts` — temporary debug queries (can be deleted after debugging)

**Frontend:**
- `app/page.tsx` — main page with empty state, system selection, mode switching
- `components/layout/nav-sidebar.tsx` — sidebar with system list + Add System
- `components/add-system-dialog.tsx` — Add System dialog (new)
- `components/logic-grid.tsx` — the main grid with mode-specific controls
- `components/node-card.tsx` — individual node rendering
- `components/view-controls.tsx` — mode buttons + Show Key Results toggle
- `hooks/use-auth-bypass.ts` — frontend auth bypass
- `hooks/use-convex-auth-bypass.ts` — Convex auth bypass

**BMAD Artifacts:**
- `_bmad-output/planning-artifacts/prd.md` — Full PRD (42 FRs)
- `_bmad-output/planning-artifacts/epics.md` — 8 epics, 38 stories
- `_bmad-output/planning-artifacts/remediation-plan.md` — 20 issues classified P0-P3
- `_bmad-output/planning-artifacts/code-review-report.md` — Full code review
- `_bmad-output/planning-artifacts/sprint-evaluation-report.md` — Sprint eval (82% B+)
- `_bmad-output/implementation-artifacts/sprint-status.yaml` — Story tracking

### What NOT to touch
- Do NOT merge to main
- Do NOT push to Convex production (`npx convex deploy`)
- Do NOT modify WorkOS configuration
- Do NOT delete any existing data
- Stay on `sprint/full-pipeline` branch

### Cleanup when done
- Delete `convex/debug.ts` (temporary debug queries)
- Run `npx convex dev --once` after any Convex changes
- Commit each fix separately with descriptive messages
- Update `_bmad-output/implementation-artifacts/sprint-status.yaml` if adding new stories

---
