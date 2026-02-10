# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm install          # Install dependencies (must use pnpm, not npm/yarn)
pnpm dev              # Start dev server on port 3000
pnpm build            # Production build
pnpm lint             # Run ESLint
pnpm start            # Start production server
```

No test framework is configured. TypeScript build errors are intentionally ignored in `next.config.mjs` (`ignoreBuildErrors: true`).

## Architecture

**Jigsaw 1.6** is a strategic planning visualization tool built with Next.js 16 (App Router) + React 19 + TypeScript. It renders interactive Logic Model and Matrix views for organizational strategy systems.

### Dual Data Layer

The app supports two data modes that switch automatically:

1. **JSON mode (default):** Static JSON files in `data/` are loaded via `SystemDataAdapter` class (`data/system-adapter.ts`). Each system (MERA, Kiraa, Levur, etc.) has a JSON file following the `SystemJSON` interface. The adapter transforms raw data into UI types (`RowData`, `ContributionMapData`, `DevelopmentPathwaysData`, `ConvergenceMapData`).

2. **Supabase mode:** When `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set, data is fetched via React Query hooks in `hooks/`. The `use-full-system.ts` hook aggregates all queries (system, elements, matrices, KPIs, capabilities, factors) into a single `FullSystemData` object. Supabase data is transformed to UI format via `lib/supabase-adapters.ts`.

### Key Patterns

- **Main orchestrator:** `app/page.tsx` manages all UI state (active tab, selected system, edit mode, sidebars) and renders the appropriate view.
- **System selector:** Users switch between demo systems via `components/layout/nav-sidebar.tsx`. Available systems are defined in `data/system-adapter.ts` (`availableSystems` map).
- **Matrix cell resolution:** All three matrix adapters (Contribution, Development Pathways, Convergence) use a dual lookup strategy: first try `xaxis`/`yaxis` Reference IDs from Azure, then fall back to `order`/`column` as array indices.
- **Component library:** Uses shadcn/ui (New York style) with 59+ components in `components/ui/`. Config in `components.json`. Add new components with the shadcn CLI.
- **Styling:** Tailwind CSS 4 with OKLCH color variables defined in `app/globals.css`. Uses `cn()` helper from `lib/utils.ts` (clsx + tailwind-merge).
- **Flow canvas:** `components/agents-canvas/` uses `@xyflow/react` for interactive agent/command/orchestrator node visualization.

### Core Types (`lib/types.ts`)

- `NodeData` — Individual element in any view (outcomes, value chain items, resources)
- `RowData` — A row in the Logic Model grid (purpose, outcomes, value-chain, resources)
- `ContributionMapData` — Outcomes x Value Chain matrix with KPIs and cells
- `DevelopmentPathwaysData` — Resources x Value Chain matrix with capabilities
- `ConvergenceMapData` — Value Chain x External Factors matrix

### Adding a New Demo System

1. Create a JSON file in `data/` following the `SystemJSON` interface
2. Import and register it in `data/system-adapter.ts` (`availableSystems`)
3. The system will appear in the navigation sidebar automatically

## Configuration Notes

- **Package manager:** pnpm 9.15.0 is required. The `pnpm-lock.yaml` resolves known hoisting issues with `@swc/helpers` and `scheduler`.
- **Path alias:** `@/*` maps to the project root (configured in `tsconfig.json`).
- **Deployment:** Vercel with config in `vercel.json`. Build uses `pnpm build`.
- **Fonts:** Plus Jakarta Sans (sans), Lora (serif), IBM Plex Mono (mono) — loaded in `app/layout.tsx`.
