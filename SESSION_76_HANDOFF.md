# Session 76 Handoff - Jigsaw 1.6 RSA

**Date**: 2026-02-02
**Branch**: `session-76-node-details-crud` (created from main after commit)
**Main commit**: `3d97890` - feat: Add Relationships Australia system + Convex database integration

---

## What Was Completed

### 1. Relationships Australia - Tasmania (URGENT - Martin meeting tomorrow)
- Converted Excel (4 sheets) to JSON: `data/relationships_australia_tas.json`
- **4 outcomes**: Impact Driven Service Delivery, Growth with Purpose, Amplifying our Expertise, Sustainable Flourishing Organisation
- **11 value chain elements**: Situational Needs Analysis → Evaluation & Full System Development
- **12 resources**: Knowledge & Research, Revenue Streams, Team, Locations, Clinical Systems, etc.
- **6 contribution map cells** with content (rest of matrices mostly empty - normal for new system)
- Registered in `system-adapter.ts` and nav sidebar
- Set as **default system** when app opens
- Seeded into Convex cloud

### 2. Convex Database (Full Integration)
- Installed `convex 1.31.7`
- Created schema with 7 tables + indexes (`convex/schema.ts`)
- Created 7 server-side function files (queries + mutations)
- Created 4 React hooks (`hooks/convex/`) replacing Supabase
- Added `ConvexClientProvider` in layout
- Created seed script (`convex/seed.ts`)
- **All 8 systems seeded into Convex cloud** (hidden-fish-6.convex.cloud)

### 3. BMAD Installed
- Nicolas installed BMAD in the repo (details in `_bmad/`)

---

## Convex Database Status

**Dashboard**: https://dashboard.convex.dev/d/hidden-fish-6
**Deployment**: `dev:hidden-fish-6`
**URL**: `https://hidden-fish-6.convex.cloud`

| System | Elements | Matrix Cells | KPIs | Capabilities |
|--------|----------|-------------|------|-------------|
| Relationships Australia - Tas | 27 | 6 | 7 | 0 |
| MERA | 26 | 37 | 7 | 15 |
| Kiraa (shows as "Unknown") | 23 | 175 | 12 | 20 |
| LEVUR (shows as "Unknown") | 24 | 79 | 11 | 18 |
| CPF Jigsaw | 25 | 116 | 16 | 16 |
| Illawarra Energy Storage | 24 | 30 | 4 | 0 |
| Central Highlands Council | 19 | 0 | 18 | 0 |
| Central Highlands v2 | 25 | 125 | 14 | 11 |

**Known issues**:
- Kiraa and LEVUR system names show as "Unknown" in Convex (use `npx convex run systems:update` to fix)
- App still runs in JSON mode - need to wire page.tsx to use Convex hooks
- `colElementId` in matrixCells schema changed to `v.string()` to support polymorphic IDs (elements + externalValues)

---

## Pending Tasks (Session 77+)

### Task 4: Node Detail Views (HIGH - demo impact)
**Current state**: Only Logic Model nodes open the detail sidebar. Matrix cells (Contribution, Development, Convergence) only `console.log` on click.

**Recommended approach (Option A - simple)**:
- Reuse `NodeDetailSidebar` for matrix cells
- Show: "Value Chain X → Outcome Y" header, cell content, associated KPIs
- Wire `handleContributionCellClick`, `handleDevelopmentPathwaysCellClick`, `handleConvergenceMapCellClick` in `page.tsx` (lines 203-213)
- These currently only do `console.log`

**Key files**:
- `app/page.tsx` lines 203-213 (click handlers)
- `components/node-detail-sidebar.tsx` (existing sidebar - extend or create new)
- `components/contribution-map.tsx` line ~190 (`onCellClick`)
- `components/development-pathways.tsx` line ~210 (`onCellClick`)
- `components/convergence-map.tsx` line ~175 (`onCellClick`)

### Task 5: CRUD Editing (MEDIUM)
**Current state**: Edit mode UI exists (buttons, modes) but not wired to mutations.

**Approach**:
1. Switch `page.tsx` from JSON adapter to Convex hooks (`useConvexSystem`, `useConvexMutations`)
2. Wire "Edit Node" button in sidebar to `useConvexUpdateElement`
3. Wire matrix cell editing to `useConvexUpdateMatrixCell` (upsert)
4. Wire "Add" buttons to `useConvexCreateElement`
5. All Convex hooks are ready in `hooks/convex/`

**Key decision**: When to switch from JSON mode to Convex mode in `page.tsx`. Could do dual-mode (JSON fallback + Convex when available) or full switch.

### Task 6: Export (Excel/CSV/PDF) (LOW)
- Need library: `xlsx` for Excel, or generate CSV directly
- PDF: could use `html2canvas` + `jspdf` or server-side rendering
- Export current view data from the adapter/hooks

### Minor fixes
- Fix Kiraa/LEVUR system names in Convex
- Consider renaming repo from "Jigsaw-1.6-RSA" to "Jigsaw-1.6" or "Jigsaw" (cosmetic)

---

## Architecture Notes for Next Session

### Data Flow (Current - JSON mode)
```
page.tsx → getSystemAdapter(systemName) → SystemDataAdapter → Components
```

### Data Flow (Target - Convex mode)
```
page.tsx → useConvexSystem(systemId) → { initialData, contributionMapData, ... } → Components
```

The Convex hooks (`hooks/convex/use-convex-system.ts`) already transform data into the exact same types that `SystemDataAdapter` produces. The switch should be straightforward.

### Key Files Modified This Session
| File | Change |
|------|--------|
| `data/relationships_australia_tas.json` | New - RA Tasmania system |
| `data/system-adapter.ts` | Added RA import + registration |
| `components/layout/nav-sidebar.tsx` | Added RA to default systems list |
| `app/page.tsx` | Changed default system to RA |
| `app/layout.tsx` | Added ConvexClientProvider |
| `components/providers/convex-provider.tsx` | New - Convex React provider |
| `convex/schema.ts` | New - 7 table schema |
| `convex/systems.ts` | New - system CRUD + getFullSystem |
| `convex/elements.ts` | New - element queries/mutations |
| `convex/matrixCells.ts` | New - matrix cell upsert |
| `convex/kpis.ts` | New - KPI CRUD |
| `convex/capabilities.ts` | New - capability upsert |
| `convex/externalValues.ts` | New - external value CRUD |
| `convex/factors.ts` | New - factor upsert |
| `convex/seed.ts` | New - JSON to Convex migrator |
| `hooks/convex/*.ts` | New - 4 React hook files |
| `scripts/seed-convex.ts` | New - seed runner script |

---

## Quick Start Next Session

```bash
cd /Users/nicolaspt/Jigsaw-1.6-RSA
git checkout session-76-node-details-crud
pnpm dev
# App opens at http://localhost:3000 with Relationships Australia as default
```

To verify Convex:
```bash
npx convex dashboard  # Opens Convex dashboard in browser
```
