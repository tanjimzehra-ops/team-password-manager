# 03 — MAST Technical Stack: Decisions and Options

> **Source**: CPF Team Sessions, 4 March 2026 + ERIC 1.5 PRD
> **Status**: 7 open decisions — blocked by Azure validation and deep-dive session

---

## Current Technical State

| Component | Current | Notes |
|-----------|---------|-------|
| Platform | Azure | EricSFM.com |
| Data storage | Azure database + Excel data trees | Cell references, not labels |
| Formulas | Excel-based within variable files | Integrity unvalidated for export |
| Frontend | Legacy ERIC interface | Exact architecture unknown |
| Authentication | None / CPF-managed | No user-facing auth |
| Report generation | Server-side via ERIC algorithms | Details in Martin's ERIC docs |

---

## 7 Open Technical Decisions

### Decision 1: Database — Azure vs Supabase AU vs Hybrid

| Option | Pros | Cons |
|--------|------|------|
| **Keep Azure** | No migration needed; known system | Cost; Australian hosting unclear; government compliance risk |
| **Supabase AU** | Australian server hosting (Sydney region); modern API; realtime; auth built-in; team familiarity | Migration effort; formula integrity risk |
| **Hybrid** | Gradual migration; lower risk | Complexity; two systems to maintain |

**Status**: Blocked by Pradeep's Azure validation (T1–T3 in `05_PRADEEP_TECH_INVESTIGATION.md`)
**Government requirement**: Data must be hosted on Australian servers.
**Recommendation**: Supabase AU (pending validation results).

### Decision 2: Standalone Application vs Jigsaw 1.6 Tenant

| Option | Pros | Cons |
|--------|------|------|
| **Standalone app** | Clean separation; MAST-specific UX; no Jigsaw dependency | More build effort; separate codebase to maintain |
| **Jigsaw 1.6 tenant** | Shared infrastructure; faster build; future upgrade path natural | Jigsaw 1.6 not yet deployed; permission system needs fixing first; may over-engineer Phase 1 |

**Status**: Open — discuss at deep-dive session.
**Key consideration**: Jigsaw 1.6 has a known permission hierarchy bug (channel-client-system disconnection). If MAST is a tenant, this must be fixed first.

### Decision 3: Frontend Framework

| Option | Pros | Cons |
|--------|------|------|
| **React + TypeScript** | Team already uses it; component reuse from Jigsaw | May be heavier than needed for Phase 1 |
| **Lighter framework** (e.g., Next.js static) | Faster initial load; simpler | Less team familiarity; harder to extend for Phase 2 |

**Status**: Likely React — team competency is the deciding factor.

### Decision 4: Authentication System

| Option | Pros | Cons |
|--------|------|------|
| **Supabase Auth** | Built-in with Supabase; RLS policies; simple | Less enterprise features |
| **WorkOS** | Enterprise SSO; team has experience (Jigsaw 1.6) | Additional dependency; cost; known issues in Jigsaw 1.6 |
| **Custom** | Full control | Build effort; security risk |

**Status**: Open — depends on Decision 1 (database) and Decision 2 (standalone vs tenant).
**Note**: WorkOS has a known RBAC disconnect in Jigsaw 1.6 (Convex/WorkOS permission enforcement issue). If using WorkOS, this must be resolved first.

### Decision 5: Cell References — Keep vs Add Labels

| Option | Decision |
|--------|----------|
| **Keep cell references as-is** | **DECIDED — Phase 1** |
| Add semantic labels | Deferred to Phase 2 (required for AI integration) |

**Rationale**: Martin confirmed this is a "transition step" — get MAST working on current structure first, rebuild with AI-readable labels later. Documented as technical debt.

### Decision 6: Report Generation Method

| Option | Pros | Cons |
|--------|------|------|
| **Server-side PDF** | Consistent output; batch generation; familiar pattern | Server load; less interactive |
| **Client-side export** | Instant; no server load | Browser inconsistencies; harder to standardise |
| **Both** | Maximum flexibility | Build effort |

**Status**: Open — depends on current report format (PDF? Excel? Both?).
**Reference**: ERIC 1.5 PRD targets < 60 seconds for PDF export (30 pages).

### Decision 7: Domain

| Option | Notes |
|--------|-------|
| TBD | Martin to propose domain name |
| Must NOT be EricSFM.com | Shared domain — MAST needs own identity |
| Must NOT be Jigsaw domain | MAST doesn't know Jigsaw exists |

**Status**: Open — Martin to decide.

---

## Decision Summary

| # | Decision | Options | Status | Blocker |
|---|----------|---------|--------|---------|
| 1 | Database | Azure / Supabase AU / Hybrid | Blocked | Pradeep's Azure validation |
| 2 | Standalone vs tenant | Own app / Jigsaw 1.6 tenant | Open | Deep-dive discussion |
| 3 | Frontend | React / lighter option | Likely React | — |
| 4 | Authentication | Supabase Auth / WorkOS / Custom | Open | Decisions 1 & 2 |
| 5 | Cell references | Keep (Phase 1) / Labels (Phase 2) | **Decided** | — |
| 6 | Report generation | Server PDF / Client export / Both | Open | Report format confirmation |
| 7 | Domain | TBD | Open | Martin's input |

---

## Timeline Reality Check

The MAST deadline is **~13 March 2026**. From today (3 March), that is approximately **9 working days**.

### What Must Happen in 9 Days

| Step | Estimated Days | Dependency |
|------|---------------|------------|
| Preparation documents (this set) | 1–2 | None |
| Martin's workflow document | 1–2 | Martin's availability |
| Pradeep's Azure validation | 2–3 | Azure access |
| Deep-dive session | 0.5 | Martin + Pradeep deliverables |
| Brief writing | 1 | Deep-dive complete |
| PRD writing | 2–3 | Brief approved |
| Architecture + sprint planning | 1 | PRD approved |
| **Total (serial)** | **~9–12 days** | |

### Assessment

This timeline is **extremely aggressive** for going from "no PRD" to "production-ready". Realistic outcomes by 13 March:

- **Achievable**: Brief + PRD + architecture plan complete
- **Stretch**: Epics defined with sprint structure
- **Unlikely**: Production deployment

**Recommendation**: Target the brief and PRD as the 13 March deliverable, with production deployment on a separate timeline after architecture decisions are confirmed.

---

## Technical Debt Register

| Item | Impact | Phase |
|------|--------|-------|
| Cell references instead of labels | Blocks AI integration; no semantic meaning in data | Phase 2 |
| ERIC documentation not centralised | Knowledge only on Martin's machine | Resolve ASAP |
| Azure DB separation unknown | Could change entire migration approach | Resolve in investigation |
| No existing user management | Must build from scratch — do not retrofit | Phase 1 (first module) |
