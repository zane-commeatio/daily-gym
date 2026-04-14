# Phase 1 — Beta & quality (PWA + Discord)

**Outcome:** The MVP is stable for a **full public** launch path: **installable PWA**, solid tests, clear errors, and a **Discord** feedback entry point ([`DECISIONS.md`](DECISIONS.md)).

## 1.1 Testing

- Integration tests for storage, navigation, **confirm overwrite** flow, **14-day prune**, timezone/date boundaries.
- Optional: Playwright (or similar) E2E on one desktop + one mobile viewport.

## 1.2 PWA

- Web app manifest, icons, **install** affordance; service worker strategy (offline shell vs network-only — pick minimal safe default).
- Document iOS/Android install quirks in README.

## 1.3 UX and content

- Empty state (user choice), storage quota errors, offline behavior.
- In-app link to **Discord** (invite URL) for support and feedback.

## 1.4 Performance

- Lighthouse sanity on Today/Log/History; avoid blocking the rules engine on main thread for large local lists (still small at 14 days).

## Exit criteria

- No known **P0** bugs on target browsers.
- PRD §11 “under ~5 seconds to understand today” validated with a few quick sessions.

## Handoff to Phase 2

- Backend schema sketch, NextAuth providers, and Stripe/Paddle choice for Pro.
