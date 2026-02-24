# Story 2.3: "Keep Me Logged In" Toggle - DEFERRED

## Status
**DEFERRED** to Epic 7 (Future)

## Analysis

After reviewing the WorkOS AuthKit implementation, the following was determined:

### WorkOS AuthKit Session Management

The `@workos-inc/authkit-nextjs` library handles session management via:

1. **Encrypted Cookies**: Uses `iron-session` for secure session encryption
2. **Cookie Configuration** (from `node_modules/@workos-inc/authkit-nextjs/src/cookie.ts`):
   - Default max-age: 400 days (Chrome's maximum allowed)
   - Configurable via `WORKOS_COOKIE_MAX_AGE` environment variable
   - HttpOnly, Secure (HTTPS), SameSite=Lax by default

3. **Token-based Authentication**:
   - Access tokens and refresh tokens managed server-side
   - JWT cookie for access token with 30-second TTL
   - Automatic refresh via refresh token

### Why Deferred?

**WorkOS AuthKit does NOT natively support per-user "keep me logged in" toggle.**

The session duration is configured **globally** via environment variables, not per-login. Implementing a per-user toggle would require:

1. **Custom Session Management**: Building a parallel session system on top of WorkOS
2. **Cookie Manipulation**: Dynamically setting different cookie expirations per user
3. **Security Considerations**: Managing different session lifetimes securely
4. **Token Refresh Logic**: Custom handling of token refresh based on user preference

This is **out of scope for MVP** as it would:
- Add significant complexity
- Bypass WorkOS AuthKit's built-in security model
- Require ongoing maintenance as WorkOS AuthKit evolves

### Recommendation

Defer to Epic 7 (Future) when:
- WorkOS AuthKit may add native support for this feature
- There's capacity to implement and maintain custom session management
- Security audit can be performed on custom implementation

### Alternative (Minimal)

If needed before Epic 7, consider:
- Adding informational text explaining session duration (400 days default)
- Using `WORKOS_COOKIE_MAX_AGE` to set a shorter default for all users
- Documenting that session persistence is managed by the auth provider

## Related Files
- `app/sign-in/route.ts` - Sign-in flow
- `app/callback/route.ts` - Auth callback handler
- `components/providers/convex-provider.tsx` - Auth provider wrapper
- `node_modules/@workos-inc/authkit-nextjs/src/cookie.ts` - WorkOS cookie implementation
- `node_modules/@workos-inc/authkit-nextjs/src/session.ts` - WorkOS session management

## Story Reference
Original Story: Implement "Keep Me Logged In" Toggle
Epic: Epic 2 - Authentication & Onboarding
Deferred To: Epic 7 - Future Enhancements
