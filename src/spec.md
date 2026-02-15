# Specification

## Summary
**Goal:** Make the Camera the default app start experience as a full-screen “big camera” view for all users, without forcing logged-out users into the Login screen.

**Planned changes:**
- Update the app launch flow so that after the intro splash completes, the Camera view opens by default for authenticated, guest, and logged-out users.
- Render the Camera as a true full-screen experience (no header/sidebar/app-shell chrome and no container padding used by other screens).
- Remove the startup redirect that sends logged-out users to Login; instead, show a non-blocking authentication prompt on top of the camera with actions to sign in (Internet Identity) or continue as guest.
- Add safe auth gating for identity-required camera actions: allow preview while logged out, but show an English message when a logged-out user attempts saving/persisting to Gallery (and avoid runtime errors on logged-out paths).

**User-visible outcome:** After the splash screen, users immediately see a full-screen camera preview. If they are logged out, they can still view the camera and can choose to sign in or continue as guest; attempts to save while logged out show a clear sign-in-required message.
