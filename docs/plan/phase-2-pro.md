# Phase 2 — Pro (account, sync, retention, Apple Health, export)

**Outcome:** **Pro** subscribers get a **server-backed account** (required), **cross-device sync**, **unlimited** server history ([`DECISIONS.md`](DECISIONS.md)), **JSON export/import** (Pro), **CSV export** and **delete account** in **Settings**, and **Apple Health** on **iOS native only** (HealthKit — not the web app). Free tier remains local-only with a **14-day** cap.

**Stack (locked):** NextAuth (**JWT**), **Drizzle ORM**, Postgres (or chosen SQL DB on VPS), **TanStack Query** for server state.

## 2.1 Data model & API

- Migrate or sync local sessions to **user-owned** rows when user upgrades (merge vs replace — see [`OPEN_QUESTIONS.md`](OPEN_QUESTIONS.md) until decided).
- Server stores **unlimited** history for Pro; **rules engine** still consumes **last 7 days** unless PRD changes.
- API routes or server actions secured by NextAuth session.
- **Settings:** CSV export; **delete account** with explicit confirmation and data deletion path (Stripe subscription cancel + DB purge per policy).

## 2.2 Identity & entitlement

- **NextAuth** with JWT strategy; **no login required** for free routes; Pro routes require session + **active subscription** (from DB, synced via **Stripe** webhooks — see Phase 3).

## 2.3 Pro features (build)

1. **Retention** — server is source of truth; unlimited history for Pro.
2. **Cross-device sync** — same account; conflict rules documented.
3. **Export/import JSON** — Pro only; validate schema and rate limits.
4. **CSV export** — Pro settings; column contract documented for support.
5. **Apple Health** — **iOS native app track only** ([`DECISIONS.md`](DECISIONS.md)): HealthKit per scope in OPEN_QUESTIONS; web PWA does not implement Health.

## 2.4 QA

- Tests for sync conflicts, subscription expiry, account deletion, CSV/JSON exports.
- Upgrade path from local-only free data.

## Exit criteria

- Pro user can use two browsers/devices and see consistent history past 14 days without cap on server.
- Apple Health: shipped on **iOS** per agreed import/export spec, or blocked on a tracked issue with spec date.

## Handoff to Phase 3

- **Stripe** sandbox + webhooks; Terms reflect **Thailand** entity, **no trial**, **no refunds** (as counsel approves).
