---
project_name: 'Jigsaw-1.6-RSA'
user_name: 'Nicolas'
date: '2026-02-22'
sections_completed: ['technology_stack', 'language_rules', 'framework_rules', 'testing_rules', 'quality_rules', 'workflow_rules', 'anti_patterns']
status: 'complete'
rule_count: 62
optimized_for_llm: true
---

# Project Context for AI Agents

_This file contains critical rules and patterns that AI agents must follow when implementing code in this project. Focus on unobvious details that agents might otherwise miss._

---

## Technology Stack & Versions

| Layer | Technology | Version | Notes |
|---|---|---|---|
| Framework | Next.js (App Router) | 16.0.10 | Uses `proxy.ts`, NOT `middleware.ts` |
| UI Library | React | 19.2.0 | Server Components enabled |
| Language | TypeScript | ^5 | `strict: true`, `bundler` moduleResolution |
| Styling | Tailwind CSS 4 | ^4.1.9 | OKLCH colour vars, `@tailwindcss/postcss` |
| Components | shadcn/ui (New York) | 57 components | Lucide icons, `cn()` helper |
| Backend/DB | Convex | ^1.31.7 | Real-time, schema in `convex/schema.ts` |
| Auth | WorkOS AuthKit | ^2.14.0 | JWT, staging keys (`sk_test_`) |
| Flow Canvas | @xyflow/react | ^12.10.0 | Agent/command node visualisation |
| Charts | Recharts | 2.15.4 | — |
| Forms | react-hook-form + zod | ^7.60.0 / 3.25.76 | — |
| Package Manager | pnpm | 9.15.0 | Required — not npm/yarn |
| Deploy | Vercel | — | `vercel.json`, auto-deploy |

## Application Overview

**Jigsaw 1.6** is a strategic planning visualisation tool that renders interactive views for organisational strategy systems.

**5 Interactive Views:**
1. **Logic Model** — Grid of purpose → outcomes → value chain → resources (`components/logic-grid.tsx`)
2. **Contribution Map** — Outcomes x Value Chain matrix with KPIs (`components/contribution-map.tsx`)
3. **Development Pathways** — Resources x Value Chain matrix with capabilities (`components/development-pathways.tsx`)
4. **Convergence Map** — Value Chain x External Factors matrix (`components/convergence-map.tsx`)
5. **Agents Canvas** — Interactive flow canvas for agent/command/orchestrator nodes (`components/agents-canvas/`)

**Admin Console** (`app/admin/`):
- `/admin/clients` — Organisation CRUD (table + dialogs)
- `/admin/users` — User management + role assignment
- `/admin/audit` — Audit log viewer (compliance trail)
- `/admin/trash` — Soft-deleted records recovery
- Protected by auth — requires `super_admin` or `admin` role

**Convex Schema (10 tables):**
`organisations`, `users`, `memberships`, `systems`, `elements`, `matrixCells`, `kpis`, `capabilities`, `externalValues`, `factors`, `auditLogs`, `portfolios`

**Organisation Statuses:** `active | inactive | trial`

**Portfolios:** First-class entity linked to elements — tracks strategic initiatives with `planning | active | completed` status

**Session History:** Feature development is documented in `sessions/SESSION-*.md` handoff files (sessions 80–86+). Read these for full context on past decisions and implementation details.

**Build Constraints:**
- `ignoreBuildErrors: true` — TS errors skipped at build (only skips TS, NOT module resolution)
- `images.unoptimized: true` — no Next.js image optimisation
- Path alias `@/*` maps to project root
- No ESLint config file (uses Next.js defaults)
- No Prettier config

## Critical Implementation Rules

### Language-Specific Rules (TypeScript)

**Configuration:**
- `strict: true` — do not use `any` loosely or skip null checks
- `isolatedModules: true` — no `const enum`, no cross-file type-only re-exports

**Import Conventions:**
- Use `@/*` path alias for all project imports (e.g., `@/lib/types`, `@/components/ui/button`)
- Convex internal imports use relative paths: `../../convex/_generated/api`
- Use `import type` for type-only imports: `import type { Metadata } from "next"`
- Convex types: `Id<"systems">`, `Doc<"users">` from `convex/_generated/dataModel`

**Type Patterns:**
- Core UI types in `lib/types.ts`: `NodeData`, `RowData`, `ContributionMapData`, `DevelopmentPathwaysData`, `ConvergenceMapData`
- Convex validators use `v.` prefix from `convex/values` (e.g., `v.string()`, `v.id("users")`)
- Role type: `"super_admin" | "admin" | "viewer"` (union literal)
- Soft deletes: `deletedAt: v.optional(v.number())` — timestamp in ms, not boolean

**Error Handling:**
- No global error boundary
- Convex mutations throw on auth failures via `requireAuth()` / `requireRole()`
- No test framework — errors caught at build time only

### Framework-Specific Rules

**Next.js 16:**
- Auth middleware lives in `proxy.ts` (Next.js 16 convention) — NEVER use `middleware.ts` (deprecated warning)
- `proxy.ts` intercepts cross-origin RSC redirects to prevent CORS errors on WorkOS auth
- `app/layout.tsx` is a Server Component — uses `withAuth()` from WorkOS for session
- Route groups: `app/admin/` (protected), `app/sign-in/`, `app/sign-up/`, `app/callback/`
- Unauthenticated paths: `/`, `/sign-in`, `/sign-up` — everything else requires auth

**React 19:**
- Use `OrgContext.Provider` — NOT `<OrgContext>` JSX (React 19 compatibility)
- Server Components are the default — mark client components with `"use client"`
- `useConvexAuth()` for Convex auth readiness — NOT WorkOS `useAuth()` (avoids race condition)

**Convex Data Layer:**
- **Dual data mode**: Convex (primary when `NEXT_PUBLIC_CONVEX_URL` set) / JSON fallback
- `use-convex-system.ts` transforms Convex data into UI types — components receive identical shapes regardless of data source
- `use-convex-mutations.ts` (~818 lines) — all CRUD mutations with automatic reactivity. No manual cache invalidation needed
- **Security boundary**: Gate at `systems.list` (entry point). Child queries chain through `systemId`
- **Legacy systems** (orgId=null): visible to all authenticated users during migration
- Seed execution order: `createOrganisations` → users sign in → `bootstrapSuperAdmins` → `assignSystemOrgs`

**Auth Flow (WorkOS → Convex):**
- WorkOS JWT `subject` = WorkOS user ID → lookup via `by_workosId` index
- WorkOS JWT does NOT include email/name claims — must pass from frontend `useAuth()` session
- `getOrCreateMe` accepts optional email/name/avatarUrl args from frontend session
- `use-ensure-user.ts` auto-provisions user record on first sign-in
- Provider chain: `AuthKitProvider` → `ConvexProviderWithAuth` → `UserProvisioner`

**State Management:**
- `app/page.tsx` is the main orchestrator (~680 lines) — manages all UI state (active tab, selected system, edit mode, sidebars)
- Custom hooks extracted: `use-edit-mode`, `use-performance-mode`, `use-portfolio-state`, `use-library`
- Matrix cell resolution: dual lookup — first try `xaxis`/`yaxis` Reference IDs (Azure), then fall back to `order`/`column` as array indices

### Testing Rules

- **No test framework configured** — no Jest, Vitest, or Playwright
- Errors are caught at build time via `pnpm build` (though `ignoreBuildErrors` skips TS errors)
- Validate changes by running `pnpm build` and checking for module resolution errors
- Manual testing via `pnpm dev` on `http://localhost:3000`
- Production testing on `https://jigsaw-1-6-rsa.vercel.app`

### Code Quality & Style Rules

**File Naming:**
- Components: `kebab-case.tsx` (e.g., `node-detail-sidebar.tsx`, `contribution-map.tsx`)
- Hooks: `use-kebab-case.ts` (e.g., `use-edit-mode.ts`, `use-convex-system.ts`)
- Convex functions: `camelCase.ts` (e.g., `matrixCells.ts`, `auditLogs.ts`)
- Data files: `snake_case.json` (e.g., `central_highlands_council.json`)
- Lib utilities: `kebab-case.ts` (e.g., `kpi-utils.ts`, `eric-config.ts`)

**Component Patterns:**
- All custom components export named functions (not default exports)
- shadcn/ui components in `components/ui/` — add new ones via shadcn CLI, not manually
- Use `cn()` from `@/lib/utils` for conditional class merging (clsx + tailwind-merge)
- Styling uses Tailwind CSS 4 utility classes with OKLCH CSS variables from `globals.css`
- Fonts: Plus Jakarta Sans (sans), Lora (serif), IBM Plex Mono (mono)

**Convex Code Patterns:**
- Permission checks in `convex/lib/permissions.ts` — 9 RBAC helper functions
- All mutations must call `requireAuth()` or `requireRole()` before data access
- Queries use index-based lookups (e.g., `.withIndex("by_workosId", ...)`)
- Schema defined in `convex/schema.ts` with `defineSchema` / `defineTable`

**Code Organisation:**
- `app/` — Next.js App Router pages and layouts
- `components/` — React components (flat structure, not deeply nested)
- `components/ui/` — shadcn/ui primitives
- `components/layout/` — Layout components (nav-sidebar, footer)
- `components/providers/` — Context providers (convex-provider)
- `hooks/` — Custom React hooks
- `hooks/convex/` — Convex-specific hooks (data fetching, mutations)
- `convex/` — Backend functions, schema, auth config
- `convex/lib/` — Shared backend utilities (permissions)
- `lib/` — Shared frontend utilities, types, colours
- `data/` — Static JSON fallback data + SystemDataAdapter
- `scripts/` — Utility scripts

### Development Workflow Rules

**Package Management:**
- Always use `pnpm` — never npm or yarn
- Run `pnpm install` if module resolution fails (pnpm sometimes doesn't link properly)
- `pnpm dev` starts on port 3000
- `pnpm build` for production build validation

**Git & Deployment:**
- Main branch: `main`
- Deploy target: Vercel (auto-deploy on push to main)
- Production URL: `https://jigsaw-1-6-rsa.vercel.app`
- Use `printf` not `echo` when piping to `vercel env add` (echo adds trailing `\n` that breaks values)

**Environment Variables:**
- `NEXT_PUBLIC_CONVEX_URL` — Convex deployment URL (required for real-time mode)
- `WORKOS_CLIENT_ID`, `WORKOS_API_KEY`, `WORKOS_COOKIE_PASSWORD` — Auth (set in Vercel)
- Convex deployment: `hidden-fish-6` with `WORKOS_CLIENT_ID` env var set
- Currently using staging WorkOS keys (`sk_test_`) — switch to `sk_live_` for production users

**WorkOS Redirect URIs (staging):**
- Production: `https://jigsaw-1-6-rsa.vercel.app/callback`
- Local: `http://localhost:3000/callback`

### Critical Don't-Miss Rules

**Anti-Patterns — NEVER Do These:**
- NEVER use `middleware.ts` — Next.js 16 uses `proxy.ts`
- NEVER use `<OrgContext>` as JSX — use `OrgContext.Provider` (React 19)
- NEVER use WorkOS `useAuth()` to check Convex auth readiness — use `useConvexAuth()`
- NEVER add manual cache invalidation for Convex mutations — reactivity is automatic
- NEVER use npm or yarn — only pnpm
- NEVER assume WorkOS JWT contains email/name — it only has `subject` (user ID)
- NEVER modify `components/ui/` files manually — use shadcn CLI to add/update

**Edge Cases & Gotchas:**
- `ignoreBuildErrors` only skips TypeScript errors, NOT module resolution errors — missing imports will still fail the build
- When using parallel agents, they may each modify `page.tsx` — check for merge conflicts
- pnpm sometimes doesn't link packages properly — run `pnpm install` if module resolution fails
- Legacy systems without `orgId` are visible to all authenticated users (intentional during migration)
- Super admin emails are hardcoded in seed functions — update `convex/seed.ts` to add new ones

**Security Rules:**
- All Convex mutations MUST call `requireAuth()` or `requireRole()` before any data access
- Security boundary is at `systems.list` — child queries chain through `systemId`
- Never expose `WORKOS_API_KEY` or `WORKOS_COOKIE_PASSWORD` to the client
- Soft deletes use `deletedAt` timestamp — always check for `deletedAt === undefined` in queries

**Known Bug — RSC CORS Redirect:**
- `proxy.ts` checks `request.headers.get("RSC") === "1"` to intercept cross-origin redirects
- Some RSC navigations use `?_rsc=` query param instead of the `RSC` header — these bypass the check
- Symptom: CORS error when unauthenticated user navigates to `/admin` via client-side navigation
- Fix needed: also check for `_rsc` query parameter in `proxy.ts`

**Key Files Reference:**
- Main orchestrator: `app/page.tsx`
- All mutations: `hooks/convex/use-convex-mutations.ts`
- RBAC engine: `convex/lib/permissions.ts`
- Auth middleware: `proxy.ts`
- Auth provider: `components/providers/convex-provider.tsx`
- User auto-provisioning: `hooks/use-ensure-user.ts`
- Schema: `convex/schema.ts`
- Type definitions: `lib/types.ts`
- Seed/migration: `convex/seed.ts`
- Data adapter (JSON fallback): `data/system-adapter.ts`
- Admin Console layout: `app/admin/layout.tsx`
- Organisation CRUD: `app/admin/clients/page.tsx`
- User management: `app/admin/users/page.tsx`
- Session handoffs: `sessions/SESSION-*.md`

---

## Usage Guidelines

**For AI Agents:**
- Read this file before implementing any code
- Follow ALL rules exactly as documented
- When in doubt, prefer the more restrictive option
- Update this file if new patterns emerge

**For Humans:**
- Keep this file lean and focused on agent needs
- Update when technology stack changes
- Review quarterly for outdated rules
- Remove rules that become obvious over time

Last Updated: 2026-02-22
