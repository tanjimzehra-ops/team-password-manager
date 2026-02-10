# Session 79c Handoff — Verify Convex on Production

## Status
- **Main branch** is deployed to Vercel with `NEXT_PUBLIC_CONVEX_URL` set
- Supabase fully removed, architecture is Convex > JSON

## To Verify on Production

1. **Does the green banner appear?** — "Connected to Convex (real-time)" instead of yellow JSON fallback
2. **Do systems load from Convex?** — Nav sidebar should show Convex systems, not the static JSON ones
3. **Is there data in Convex?** — If no systems exist in the Convex database, the app will show empty state. May need to seed data via `npx convex run` or the Convex dashboard
4. **CRUD operations** — Test editing a node, updating a matrix cell, creating a portfolio item

## If Convex Shows No Data

The Convex deployment (`hidden-fish-6`) may not have any systems seeded. Options:
- Seed from JSON via a Convex function
- Create systems manually through the Convex dashboard
- The app will gracefully fall back to JSON if Convex has no data but is connected

## Architecture Reference

```
app/page.tsx (orchestrator, ~680 lines)
  ├─ hooks/convex/use-convex-systems.ts (list systems)
  ├─ hooks/convex/use-convex-system.ts (full system + transform)
  ├─ hooks/convex/use-convex-mutations.ts (all CRUD, 818 lines)
  └─ lib/data/ (JSON fallback via SystemDataAdapter)
```
