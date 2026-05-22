# Phase 0 — MVP (PRD §13 + resolved decisions)

**Outcome:** A **Next.js** app that implements PRD §2–§9 for the **free, no-account** tier: log sessions, run the rules engine on the **last 7 days** + optional fatigue, show primary + 1–2 alternatives, persist **locally** with a **14-day rolling history** cap (see [`DECISIONS.md`](DECISIONS.md)).

**Stack (locked):** Next.js, Tailwind CSS, TanStack Query, TypeScript. **No server auth yet** — Pro (Phase 2) adds NextAuth JWT, Drizzle, and sync.

## 0.1 Project skeleton

- Scaffold **Next.js** (App Router) with strict TypeScript, Tailwind, ESLint.
- Add TanStack Query for client state/server calls later; structure routes for Today / Log / History.
- Define `Session` / `SessionType` and `classify()` exactly as PRD §5.

## 0.2 Rules engine (pure, testable)

- `buildHistory(sessions, today)` — normalize dates, **newest first**, **last 7 calendar days** for engine input (PRD §6).
- `recommend(history, fatigueToday)` — ordered rules §6; unit tests per branch.
- Label map for UI (PRD §7).

## 0.3 Free-tier persistence (local)

- Persist `Session[]` in **localStorage or IndexedDB** (PRD §9).
- Enforce **one session per calendar day**; on second log for the same day → **confirm overwrite** ([`DECISIONS.md`](DECISIONS.md)).
- Apply **14-day retention** for stored history for free users: prune or hide sessions older than 14 days in the History UI (rules still read ≤7 days).

## 0.4 UI

- **Today** — fatigue + recommendation + alternatives; **empty state** = **user choice** of starting bias (not a hardcoded default).
- **Log** — type, conditional intensity, submit → persist → navigate.
- **History** — rolling window shown per free-tier rules, **newest first**.

## 0.5 Polish

- Accessibility basics; README: run instructions + pointer to PRD.
- Optional: **PWA manifest** (full PWA hardening can spill into Phase 1).

## Exit criteria

- All PRD §6 rules covered by tests; free-tier retention and confirm-overwrite behave as documented.
- Core loop works **without** an account.

## Handoff to Phase 1

- Device/browser matrix, E2E tooling, and Discord feedback links.
