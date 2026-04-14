# Resolved product decisions

Authoritative answers from stakeholder input (2026). Phase docs assume these unless superseded here.

| Area | Decision |
|------|----------|
| **Pro features** | **Extended retention** beyond **14 days** of history (exact cap TBD or unlimited); **Apple Health sync** (import and/or export scope TBD in implementation). |
| **Free tier** | History capped at **14 days** on device (aligns with “more than 14 days” for Pro). Rules engine still uses **last 7 days** per PRD §6 unless PRD is updated. |
| **Empty state (no history)** | **User choice** — prompt to pick an initial preference (e.g. strength vs easy cardio) rather than a fixed default. |
| **Same calendar day, second log** | **Confirm overwrite** — show a confirmation before replacing that day’s session. |
| **History sort** | **Newest first**. |
| **Accounts** | **No account for free** (local-only). **Account required for Pro** (cross-device sync and server-side retention). |
| **Cross-device** | **Pro**: sync across devices **via account**. |
| **Export/import JSON** (PRD Phase F) | **Pro only**. |
| **Stack** | **Next.js**, **NextAuth** (JWT sessions), **Tailwind CSS**, **TanStack Query**, **Drizzle ORM**, **TypeScript**. |
| **Distribution** | **PWA** in scope for web; **native iOS/Android after PMF** (separate track; may require IAP then). |
| **Monetization** | **Subscription** (web checkout for v1; global / “everywhere” intent). |
| **Analytics** | **Privacy-friendly** product analytics (no ad networks; minimal, disclosed). |
| **Hosting** | **VPS** deployed with **Coolify** (app + DB + reverse proxy on your infra). |
| **Rollout** | **Full public** launch (not a prolonged private beta as the default gate). |
| **Support** | **Discord** as primary channel (response-time policy: see [OPEN_QUESTIONS.md](OPEN_QUESTIONS.md)). |

## Notes

- **Apple Health** on **web PWA** is limited; full HealthKit integration typically requires **native iOS** or a defined bridge. Plan Phase 2/4 to spell out “web vs native” milestones for Health.
- **“Everywhere”** for payments implies **Stripe or Paddle** (or similar) with tax tooling; exact provider and trial length remain in OPEN_QUESTIONS.
