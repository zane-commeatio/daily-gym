# Phase 2 — Pro (account, sync, retention, Apple Health, export)

**Outcome:** **Pro** subscribers get a **server-backed account** (required), **cross-device sync**, **unlimited** server history ([`DECISIONS.md`](DECISIONS.md)), **JSON export/import** (Pro), **CSV export** and **delete account** in **Settings**, and **Apple Health import** on **iOS native only** (HealthKit — not the web app). Free tier remains local-only with a **14-day** cap.

**Stack (locked):** NextAuth (**JWT**), **Drizzle ORM**, Postgres (or chosen SQL DB on VPS), **TanStack Query** for server state.

## 2.1 Data model & API

- On **upgrade from free → Pro:** **merge this device’s local history** into the server-backed account only ([`DECISIONS.md`](DECISIONS.md)) — implement idempotent merge (e.g. by date key) so retries are safe.
- Server stores **unlimited** history for Pro; **rules engine** still consumes **last 7 days** unless PRD changes.
- API routes or server actions secured by NextAuth session.
- **Settings:** CSV export; **delete account** with explicit confirmation and data deletion path (Stripe subscription cancel + DB purge per policy).

## 2.2 Identity & entitlement

- **NextAuth** with JWT strategy; **no login required** for free routes; Pro routes require session + **active subscription** (from DB, synced via **Stripe** webhooks — see Phase 3).

## 2.3 Pro features (build)

1. **Retention** — server is source of truth; unlimited history for Pro.
2. **Cross-device sync** — same account; conflict rules documented (merge upgrade path is defined above).
3. **Export/import JSON** — Pro only; validate schema and rate limits.
4. **CSV export** — Pro settings; column contract documented for support.
5. **Apple Health (iOS native)** — **Import only:** read HealthKit data and create or update **sessions** in the app; **no automatic PRD type mapping** — user assigns `S`/`A`/`H`/`R` (or confirms suggestions if you add non-binding hints later). Optional UX details in [`OPEN_QUESTIONS.md`](OPEN_QUESTIONS.md).

## 2.4 QA

- Tests for sync conflicts, subscription expiry, account deletion, CSV/JSON exports, **merge-on-upgrade** from local storage.
- Upgrade path from local-only free data.

## Exit criteria

- Pro user can use two browsers/devices and see consistent history past 14 days without cap on server.
- **iOS:** Health import matches **import-only, no auto-map** policy ([`DECISIONS.md`](DECISIONS.md)), or is explicitly phased with issue link.

## Handoff to Phase 3

- **Stripe** sandbox + webhooks; Terms reflect **Thailand** entity, **no trial**, **no refunds** (as counsel approves).
