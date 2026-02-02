# Session 77 Handoff - Jigsaw 1.6 RSA

**Date**: 2026-02-02
**Branch**: `session-76-node-details-crud`
**Repo**: `/Users/nicolaspt/Jigsaw-1.6-RSA`

---

## What Was Completed

### All Elements Clickable Across All 4 Visualisations

Every element in the app now opens the NodeDetailSidebar when clicked. Two commits:

| Commit | Change |
|--------|--------|
| `7f531ea` | Matrix cells (Contribution, Development, Convergence) open sidebar with synthetic NodeData |
| `23516a5` | All remaining elements: headers, KPIs, capabilities, factors, banners — 18 new interactive elements |

### Architecture: Single `onElementClick` Prop Pattern

Each matrix component received one new prop:
```typescript
onElementClick?: (node: NodeData) => void
```

Components build synthetic `NodeData` internally. `page.tsx` passes existing `handleNodeClick` — 3 lines added.

For Logic Model banners (Purpose, Culture, System Context), click handlers were added directly with synthetic NodeData construction.

### Files Modified

| File | Change |
|------|--------|
| `app/page.tsx` | 3 matrix cell handlers (synthetic NodeData) + 3 `onElementClick` props wired |
| `components/contribution-map.tsx` | `onElementClick` prop + 4 click handlers (outcome headers, outcome KPIs, VC headers, VC KPIs) |
| `components/development-pathways.tsx` | `onElementClick` prop + 6 click handlers (resource headers, current caps/resource, VC headers, current caps/VC, VC KPIs, necessary caps) |
| `components/convergence-map.tsx` | `onElementClick` prop + 5 click handlers (factor headers, factor descriptions, VC headers, VC factors, VC KPIs) |
| `components/logic-grid.tsx` | 3 banners clickable (Purpose, Culture/Dimension, System Context) |

---

## Pending Tasks (Session 78+)

### Task 1: Enhance Node Detail Sidebar (HIGH - demo quality)
**Current state**: Sidebar opens for everything, but shows basic info. Need richer detail views.

**Reference**: Tanjim's work in commit `554d272` (Dec 2025) has:
- `ViewOutcomeModal.tsx` — Modal with KPI progress, key points, status badges
- `PerformanceModal.tsx` — Performance scores, progress bars, trend indicators
- `OutcomeCard.tsx`, `ValueChainCard.tsx`, `ResourceCard.tsx` — Dual mode (Stage/Performance)
- 80+ shadcn/ui components

**Approach**: Review Tanjim's components, extract patterns to enhance `NodeDetailSidebar`:
- Show KPI progress bars instead of just numbers
- Add key points / attributes section
- Show related elements with context
- Differentiate sidebar content by element type (outcome vs VC vs resource vs cell)

**Key files to review**:
- Tanjim's branch/commit: `554d272` — `logic-model-ui/` directory
- Current sidebar: `components/node-detail-sidebar.tsx`

### Task 2: CRUD Editing via Convex (MEDIUM)
**Current state**: Convex hooks ready in `hooks/convex/`, app runs in JSON mode.

**Steps**:
1. Switch `page.tsx` from JSON adapter to Convex hooks (`useConvexSystem`, `useConvexMutations`)
2. Wire "Edit Node" button in sidebar to `useConvexUpdateElement`
3. Wire matrix cell editing to `useConvexUpdateMatrixCell` (upsert)
4. Wire "Add" buttons to `useConvexCreateElement`

**Key decision**: Dual-mode (JSON fallback + Convex) or full Convex switch.

### Task 3: Export (Excel/CSV/PDF) (LOW)
- Need library: `xlsx` for Excel, or generate CSV directly
- PDF: `html2canvas` + `jspdf` or server-side rendering

### Minor fixes
- Fix Kiraa/LEVUR system names in Convex (`npx convex run systems:update`)

---

## Convex Database Status

**Dashboard**: https://dashboard.convex.dev/d/hidden-fish-6
**All 8 systems seeded** — app still runs in JSON mode, Convex ready for Task 2.

---

## Communication Note

Use standard Castilian Spanish (tu, not vos). Never Argentine voseo.

---

## Quick Start Next Session

```bash
cd /Users/nicolaspt/Jigsaw-1.6-RSA
git checkout session-76-node-details-crud
pnpm dev
# App opens at http://localhost:3000
# Click ANY element in ANY view — sidebar opens with details
```

## Recommended Session 78 Focus

1. Review Tanjim's `554d272` commit for sidebar enhancement patterns
2. Enhance `node-detail-sidebar.tsx` with richer content per element type
3. Then wire CRUD with Convex
