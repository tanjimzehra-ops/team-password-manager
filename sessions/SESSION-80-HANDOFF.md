# Session 80 Handoff — TIER 2 & TIER 3

**Previous Session**: 79 (2026-02-10)
**Branch**: `session-78-sidebar-crud-export`
**Repo**: `/Users/nicolaspt/Jigsaw-1.6-RSA/`
**Last Commit**: `a7b7388`

---

## What Was Done (Session 79)

TIER 1 (demo-critical) is COMPLETE:
- Terminology unified across all views
- Light theme default
- Flex layout for nodes (single row, squeeze, same height)
- Teal gradient bands, font bumps, visual consistency
- 14 files modified, 5 commits, build passes

## What Needs to Be Done

### TIER 2 — Post-demo polish
- [ ] Cherry-pick Tanjim's **Add System Dialog** from `origin/feature/full-functionality`
- [ ] **Intersection shadows** on matrix cells (subtle shadow where rows/columns meet)
- [ ] **View-specific accent colours** (each view tab gets its own accent)

### TIER 3 — Full integration
- [ ] **Full merge** of Tanjim's branch (`origin/feature/full-functionality`)
- [ ] Remaining visual polish and consistency pass
- [ ] Deploy final version to **Vercel**

## Critical Context

- Tanjim's branch: `origin/feature/full-functionality` — has Add System Dialog and other features
- Components from Tanjim may have **different prop interfaces** than expected — always READ actual files before wiring
- `ignoreBuildErrors: true` in next.config only skips TS errors, NOT module resolution errors
- pnpm sometimes doesn't link packages — run `pnpm install` if module resolution fails
- Martin had demo with Toby Dawson (RPS) — may have feedback to incorporate

## Key Files Reference

| File | What it does |
|------|-------------|
| `components/logic-grid.tsx` | Logic Model view — flex layout, teal bands |
| `components/node-card.tsx` | Node cards — h-full, flex-col, edit modes |
| `components/convergence-map.tsx` | Convergence Map matrix |
| `components/contribution-map.tsx` | Contribution Map matrix |
| `components/development-pathways.tsx` | Development Pathways matrix |
| `components/header.tsx` | Nav tabs, light theme |
| `components/layout/nav-sidebar.tsx` | System selector, DEMO_SYSTEMS filter |
| `app/page.tsx` | Main orchestrator (~810 lines) |

## Suggested Agent Strategy

Same pattern as Session 79 worked well:
- Parallel Opus agents with strict file ownership
- Orchestrator does post-agent sweep + build verification
- Always grep for missed terminology/patterns after agents complete
