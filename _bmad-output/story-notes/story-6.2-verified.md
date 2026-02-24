# Story 6.2: Staging Environment Setup — VERIFIED ✅

**Date:** 2026-02-24
**Status:** Available via Vercel preview deployments

## Evidence
- Vercel project connected to GitHub repo
- Every PR/push generates a preview URL automatically
- Preview deployments use the same Convex deployment (hidden-fish-6)
- Production at: https://jigsaw-1-6-rsa.vercel.app

## Notes
- Separate Convex staging deployment (dev vs prod) is deferred — current pipeline uses `npx convex dev --once` against the dev deployment
- For true staging isolation, would need a second Convex deployment — out of scope for MVP
