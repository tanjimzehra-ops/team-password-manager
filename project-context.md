---
project_name: 'TeamPasswordManager'
user_name: 'Nicolas'
date: '2026-03-08'
sections_completed: ['technology_stack', 'language_rules', 'framework_rules', 'testing_rules', 'quality_rules', 'workflow_rules']
status: 'draft'
rule_count: 45
optimized_for_llm: true
---

# Project Context for AI Agents

_This file contains critical rules and patterns that AI agents must follow when implementing code in this project. Focus on unobvious details that agents might otherwise miss._

---

## Technology Stack & Versions

| Layer | Technology | Version | Notes |
|-------|------------|---------|-------|
| Framework | Next.js (App Router) | 16.0.10 | Uses `proxy.ts`, NOT `middleware.ts` |
| UI Library | React | 19.2.0 | Server Components enabled |
| Language | TypeScript | ^5 | `strict: true`, `bundler` moduleResolution |
| Styling | Tailwind CSS 4 | ^4.1.9 | OKLCH colour vars, `@tailwindcss/postcss` |
| Components | shadcn/ui (New York) | 57 components | Lucide icons, `cn()` helper |
| Backend/DB | Convex | ^1.31.7 | Real-time, schema in `convex/schema.ts` |
| Auth | WorkOS AuthKit | ^2.14.0 | JWT, staging keys (`sk_test_`) |
| Forms | react-hook-form + zod | ^7.60.0 / 3.25.76 | — |
| Package Manager | pnpm | 9.15.0 | Required — not npm/yarn |
| Deploy | Vercel | — | Auto-deploy on push |

---

## Application Overview

**Team Password Manager** is an enterprise-grade password management platform that enables teams to securely store, manage, and share passwords for different applications.

**Core Features:**
1. **Password Vault** — Add/manage passwords for different apps
2. **Team Sharing** — Share passwords with team members
3. **Categories** — Organize passwords by application type
4. **Search** — Quick search across all passwords
5. **Copy to Clipboard** — One-click copy with auto-clear
6. **Role-Based Access** — Admin, Editor, Viewer roles
7. **Audit Logs** — Complete compliance trail
8. **Security** — AES-256 encryption, master password

**Technology Constraints:**
- Runs on port 3001 (to avoid conflict with Jigsaw on 3000)
- Uses separate Convex deployment from Jigsaw
- Separate WorkOS application for authentication

---

## Critical Implementation Rules

### Language-Specific Rules (TypeScript)

**Configuration:**
- `strict: true` — do not use `any` loosely or skip null checks
- `isolatedModules: true` — no `const enum`, no cross-file type-only re-exports

**Import Conventions:**
- Use `@/*` path alias for all project imports (e.g., `@/lib/types`, `@/components/ui/button`)
- Convex internal imports use relative paths: `../../convex/_generated/api`
- Use `import type` for type-only imports: `import type { Metadata } from "next"`
- Convex types: `Id<"passwords">`, `Doc<"users">` from `convex/_generated/dataModel`

**Type Patterns:**
- Core UI types in `lib/types.ts`
- Convex validators use `v.` prefix from `convex/values` (e.g., `v.string()`, `v.id("users")`)
- Role type: `"super_admin" | "admin" | "editor" | "viewer"` (union literal)
- Soft deletes: `deletedAt: v.optional(v.number())` — timestamp in ms, not boolean

**Error Handling:**
- No global error boundary
- Convex mutations throw on auth failures via `requireAuth()` / `requireRole()`
- No test framework — errors caught at build time only

### Framework-Specific Rules

**Next.js 16:**
- Auth middleware lives in `proxy.ts` (Next.js 16 convention) — NEVER use `middleware.ts`
- `proxy.ts` intercepts cross-origin redirects using `Sec-Fetch-Dest` header detection
- `app/layout.tsx` is a Server Component
- Route groups: `app/admin/`, `app/sign-in/`, `app/sign-up/`, `app/callback/`
- Unauthenticated paths: `/`, `/sign-in`, `/sign-up` — everything else requires auth

**React 19:**
- Use context providers with `.Provider` JSX syntax (React 19 compatibility)
- Server Components are the default — mark client components with `"use client"`
- Use `useConvexAuth()` for Convex auth readiness

**Convex Data Layer:**
- All data operations go through Convex
- Security boundary: Gate at `passwords.list` (entry point)
- All mutations wired with `logAudit()` for audit trail
- Audit logs use cursor-based pagination

### Testing Rules

- **No test framework configured** — no Jest, Vitest, or Playwright
- Errors are caught at build time via `pnpm build` (TypeScript strict mode enforced)
- Validate changes by running `pnpm build` and checking for module resolution errors
- Manual testing via `pnpm dev` on `http://localhost:3001`

### Code Quality & Style Rules

**File Naming:**
- Components: `kebab-case.tsx` (e.g., `password-list.tsx`, `category-card.tsx`)
- Hooks: `use-kebab-case.ts` (e.g., `use-passwords.ts`, `use-auth.ts`)
- Convex functions: `camelCase.ts` (e.g., `passwords.ts`, `auditLogs.ts`)
- Lib utilities: `kebab-case.ts` (e.g., `encryption.ts`, `permissions.ts`)

**Component Patterns:**
- All custom components export named functions (not default exports)
- shadcn/ui components in `components/ui/` — add new ones via shadcn CLI
- Use `cn()` from `@/lib/utils` for conditional class merging
- Styling uses Tailwind CSS 4 utility classes with OKLCH CSS variables

**Convex Code Patterns:**
- Permission checks in `convex/lib/permissions.ts`
- All mutations must call `requireAuth()` or `requireRole()` before data access
- Queries use index-based lookups
- Schema defined in `convex/schema.ts`

### Development Workflow Rules

**Package Management:**
- Always use `pnpm` — never npm or yarn
- Run `pnpm install` if module resolution fails
- `pnpm dev` starts on port 3001
- `pnpm build` for production build validation

**Git & Deployment:**
- Main branch: `main`
- Deploy target: Vercel (auto-deploy on push to main)
- This app uses a separate Vercel project from Jigsaw

**Environment Variables:**
- `NEXT_PUBLIC_CONVEX_URL` — Convex deployment URL (separate from Jigsaw)
- `WORKOS_CLIENT_ID`, `WORKOS_API_KEY`, `WORKOS_COOKIE_PASSWORD` — Auth (separate app)
- `NEXT_PUBLIC_APP_URL` — http://localhost:3001

### Anti-Patterns — NEVER Do These

- NEVER use `middleware.ts` — Next.js 16 uses `proxy.ts`
- NEVER use context without `.Provider` JSX (React 19)
- NEVER use npm or yarn — only pnpm
- NEVER expose sensitive credentials to the client
- NEVER modify `components/ui/` files manually — use shadcn CLI
- NEVER skip `requireAuth()` in mutations
- NEVER hard-delete data — use soft deletes with `deletedAt`

---

## Key Files Reference

- Schema: `convex/schema.ts`
- Main page: `app/page.tsx`
- RBAC engine: `convex/lib/permissions.ts`
- Auth provider: `components/providers/convex-provider.tsx`
- Type definitions: `lib/types.ts`

---

## Usage Guidelines

**For AI Agents:**
- Read this file before implementing any code
- Follow ALL rules exactly as documented
- When in doubt, prefer the more restrictive option
- Update this file if new patterns emerge

---

Last Updated: 2026-03-08 (Initial setup)
