# Phase 2 — Pro (account, sync, retention, Apple Health, export)

**Outcome:** **Pro** subscribers get a **server-backed account** (required), **cross-device sync**, **history retention beyond 14 days**, **Apple Health** integration (scope per [`OPEN_QUESTIONS.md`](OPEN_QUESTIONS.md)), and **JSON export/import** (Pro only). Free tier remains local-only with **14-day** cap.

**Stack (locked):** NextAuth (**JWT**), **Drizzle ORM**, Postgres (or chosen SQL DB on VPS), **TanStack Query** for server state.

## 2.1 Data model & API

- Migrate or sync local sessions to **user-owned** rows when user upgrades (clear UX: “merge this device” vs “replace server” — define in OPEN_QUESTIONS if ambiguous).
- Server stores full history for Pro; **rules engine** still consumes **last 7 days** unless PRD changes.
- API routes or server actions secured by NextAuth session.

## 2.2 Identity & entitlement

- **NextAuth** with JWT strategy; **no login required** for free routes; Pro routes require session + **active subscription** claim (from DB or webhook-synced field).
- Webhook handler for subscription lifecycle (**Stripe/Paddle TBD** in Phase 3).

## 2.3 Pro features (build)

1. **Extended retention** — server is source of truth; clients reconcile via TanStack Query.
2. **Cross-device sync** — same account, merge semantics documented.
3. **Export/import JSON** — Pro only; validate schema and abuse limits (size, rate).
4. **Apple Health** — implement per resolved scope:
   - **Web-only era:** likely **deferred** or **limited**; HealthKit usually needs **native** (post-PMF). Document milestone: “Health v1 = native bridge” if web cannot satisfy.
   - Track dependency: native app **after PMF** ([`DECISIONS.md`](DECISIONS.md)).

## 2.4 QA

- Tests for sync conflicts, subscription expiry (read-only vs export-only vs grace period — decide in OPEN_QUESTIONS).
- Upgrade path from local-only free data.

## Exit criteria

- Pro user can use two browsers/devices and see consistent history past 14 days.
- Apple Health: either shipped in agreed form or explicitly phased with a dated follow-up in OPEN_QUESTIONS.

## Handoff to Phase 3

- Live subscription provider in sandbox; legal text reflects Health + account data.
