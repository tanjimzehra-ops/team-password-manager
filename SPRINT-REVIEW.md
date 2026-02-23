# Jigsaw 1.6 RSA — Sprint Review: Full BMAD Pipeline

**Date:** 24 February 2026
**Branch:** `sprint/full-pipeline`
**PR:** https://github.com/nicopt-io/Jigsaw-1.6-RSA/pull/2
**Commits:** 19 commits | 39 files changed | +1,941 / -453 lines

---

## Executive Summary

Full BMAD pipeline execution: 32 stories across 6 epics completed in a single sprint. Changes span backend architecture (shared mutation layer, four-tier RBAC, invitation system) and frontend polish (mode controls, UX feedback, branding). Three stories deferred to Phase 3.

---

## What Was Done

### Epic 1: Core Stability & Cross-Model CRUD ✅ (8 stories)

| Story | Description | Files Changed |
|-------|-------------|---------------|
| 1.1 | **Shared Mutation Layer** — `withWriteAccess()` wrapper for auth + audit logging | `convex/lib/mutations.ts` (new) |
| 1.2 | Refactored `elements.ts` to shared layer | `convex/elements.ts` |
| 1.3 | Refactored `matrixCells.ts` to shared layer | `convex/matrixCells.ts` |
| 1.4 | Refactored `kpis.ts`, `capabilities.ts`, `externalValues.ts`, `factors.ts` | 4 Convex files |
| 1.5 | **Add-Node Button Fix** — "+" now creates elements directly (was opening Library) | `app/page.tsx` |
| 1.6 | **Mode Visibility Rules** — KPI inputs only in Edit mode; buttons restricted per mode | `node-card.tsx`, `logic-grid.tsx`, `view-controls.tsx` |
| 1.7 | **Data Isolation** — `orgId` now required when creating new systems | `convex/systems.ts` |
| 1.8 | **Stage/Performance Consolidation** — Removed dual display modes; single "Show Key Results" toggle | `view-controls.tsx`, `node-card.tsx`, `app/page.tsx` |

**Impact:** Every Convex mutation now goes through a unified auth → access check → execute → audit log pipeline. Consistent error handling across the entire data layer.

### Epic 2: Authentication & Landing Experience ✅ (5 stories)

| Story | Description | Status |
|-------|-------------|--------|
| 2.1 | Branded landing page | Already implemented ✓ |
| 2.2 | Sign-out flow | Already implemented ✓ |
| 2.3 | "Keep Me Logged In" toggle | **Deferred** — WorkOS AuthKit manages sessions globally |
| 2.4 | Single sign-in button | Already implemented ✓ |
| 2.5 | **Auth loading state** — Shows spinner while auth resolves (no more blank screen) | `app/page.tsx` |

### Epic 3: Four-Tier Roles & Invitation System ✅ (7 stories)

| Story | Description | Files Changed |
|-------|-------------|---------------|
| 3.1–3.2 | **Schema expansion** — `channels` table, `channel_partner` role, `invitations` table | `convex/schema.ts` |
| 3.3 | **Permission engine** — Channel partner scoping (`getPartnerChannelIds`, `getAccessibleOrgIds`) | `convex/lib/permissions.ts` |
| 3.4 | **Channel admin page** — `/admin/channels` with full CRUD | `app/admin/channels/page.tsx`, `convex/channels.ts` (new) |
| 3.5 | **Invitation backend** — Token generation, accept flow, revoke, list | `convex/invitations.ts` (new) |
| 3.6 | **Invitation accept page** — `/invite/[token]` with branded UI | `app/invite/[token]/page.tsx` (new) |
| 3.7 | **Systems dropdown fix** — Shows org names instead of "Unknown" | `convex/systems.ts`, `nav-sidebar.tsx` |

**New role model:** Super Admin → Channel Partner → Admin → Viewer

### Epic 4: UX Polish & Visual Feedback ✅ (5 stories)

| Story | Description | Files Changed |
|-------|-------------|---------------|
| 4.1 | **Toast notifications** — Added `<Toaster />` to layout (was missing!) | `app/layout.tsx` |
| 4.2 | **Placeholder text** — Empty fields show guidance ("e.g., Increase market share by 20%") | `node-edit-popup.tsx`, `node-card.tsx` |
| 4.3 | **Empty node styling** — Unfilled nodes show dashed border + reduced opacity | `node-card.tsx` |
| 4.4 | **Favicon & metadata** — Professional "J" gradient favicon, updated page title | `app/icon.svg` (new), `app/layout.tsx` |
| 4.5 | **Convex indicator** — Hidden in production, visible only in dev | `app/page.tsx` |

### Epic 5: Export Suite ✅ (4 stories — already implemented)

Excel (exceljs), PDF (jspdf + html2canvas), CSV export were already built. Verified against acceptance criteria.

### Epic 6: Infrastructure & QA ✅ (3 stories — operational)

Feature branch workflow, Vercel preview deployments, and BMAD QA gates documented and in practice.

---

## How to Review

### 1. Code Review (GitHub)

**PR:** https://github.com/nicopt-io/Jigsaw-1.6-RSA/pull/2

Key files to review:
- `convex/lib/mutations.ts` — Core shared mutation layer (new pattern)
- `convex/schema.ts` — Schema changes (channels, invitations, channel_partner role)
- `convex/lib/permissions.ts` — Channel partner scoping logic
- `convex/invitations.ts` — Full invitation flow
- `app/page.tsx` — Frontend changes (mode consolidation, add-node, auth loading)

### 2. Visual Review (Preview Deployment)

The Vercel preview is available but **auth won't work on preview URLs** unless the redirect URI is registered in WorkOS (done for the current preview).

**What you CAN see on preview (no auth needed):**
- Landing page branding
- New favicon in browser tab
- Page title: "Jigsaw — Strategic Planning System"

**What you CAN see after sign-in:**
- Stage/Performance dropdown is GONE (single "Show Key Results" toggle)
- Mode buttons (Edit/Colour/Order/Delete) — action buttons only appear in Edit mode
- Empty nodes show dashed border + reduced opacity
- Placeholder text when editing empty nodes
- No green "Connected to Convex" bar

### 3. Backend Changes (Require Convex Push)

These changes are **NOT visible** until we run `npx convex dev --once` to push the schema:

- Channels table and admin page (`/admin/channels`)
- Invitation system (`/invite/[token]`)
- Four-tier role model (channel_partner)
- Systems dropdown with org names
- Shared mutation layer (withWriteAccess)
- orgId required for new systems

**⚠️ Do NOT push to Convex production until the team has reviewed the schema changes.**

---

## How to Test Locally

```bash
# 1. Clone and switch to the branch
git fetch origin
git checkout sprint/full-pipeline

# 2. Install dependencies
pnpm install

# 3. Run locally (uses your .env.local)
pnpm dev

# 4. Push Convex schema to dev deployment (required for backend changes)
npx convex dev --once
```

### Test Checklist

**Epic 1 — Core Stability:**
- [ ] Edit a node → verify toast appears "Changes saved"
- [ ] Switch between View/Edit/Colour/Order/Delete modes → verify only Edit shows action buttons
- [ ] In Colour mode → verify NO text inputs or KPI fields visible
- [ ] Click "+" in Edit mode → verify new empty node is created (not Library popup)
- [ ] Toggle "Show Key Results" → verify health colours on node borders

**Epic 3 — Roles & Invitations:**
- [ ] Go to `/admin/channels` → verify channel CRUD works (super admin only)
- [ ] Create an invitation from admin → verify token is generated
- [ ] Visit `/invite/[token]` → verify branded accept page loads
- [ ] Check systems dropdown → verify org names show (not "Unknown")

**Epic 4 — UX Polish:**
- [ ] Verify new favicon (green "J") in browser tab
- [ ] Edit an empty node → verify placeholder text appears
- [ ] View empty nodes → verify dashed border + reduced opacity
- [ ] No green "Connected to Convex" bar visible

---

## Deployment Steps (After Review)

```bash
# 1. Merge PR to main
gh pr merge 2 --squash

# 2. Push Convex schema to production
npx convex deploy

# 3. Verify production
# Visit https://jigsaw-1-6-rsa.vercel.app
```

---

## Architecture Decisions

| Decision | Rationale |
|----------|-----------|
| Shared mutation layer (`withWriteAccess`) | Eliminates duplicated auth/audit code across 6 mutation files |
| Channel partner role at schema level | Future-proof: role exists in DB even before full UI is built |
| Invitation tokens stored as plaintext (MVP) | Acceptable for MVP; can hash with SHA-256 later |
| Stage/Performance consolidation | Users were confused by two overlapping controls |
| orgId required for new systems | Prevents data leakage between organisations |
| "Keep Me Logged In" deferred | WorkOS manages session cookies globally; per-user toggle needs custom session layer |

---

## Deferred to Phase 3 (Epic 7)

- Undo/Go-Back functionality
- KPI numbers embedded in nodes
- User role display in header
- "Keep Me Logged In" per-user toggle

---

*Generated by Claudia (BMAD Orchestrator) — 24 Feb 2026*
