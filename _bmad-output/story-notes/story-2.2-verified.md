# Story 2.2: Fix Sign-Out Flow — VERIFIED ✅

**Date:** 2026-02-24
**Status:** Already implemented, verified against acceptance criteria

## Verification

| Criteria | Status | Evidence |
|----------|--------|----------|
| Visible logout button in header | ✅ | `<Button>` with LogOut icon + "Sign out" text in header.tsx |
| Session terminated via WorkOS | ✅ | `signOut({ returnTo: "/" })` calls WorkOS SDK |
| Redirect to sign-in page (not error) | ✅ | `returnTo: "/"` → landing page with Sign In button |
| Refresh after logout doesn't restore session | ✅ | WorkOS handles cookie/JWT cleanup |
| Button accessible at all times | ✅ | Renders whenever `user` is truthy |

## Location
- `components/header.tsx` — Sign-out button in top-right of header
