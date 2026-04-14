# Phase 2 — Pro definition & build

**Outcome:** **Pro** is defined, implemented behind a clear entitlement, and testable end-to-end — without assuming what Pro includes until [OPEN_QUESTIONS.md](OPEN_QUESTIONS.md) is answered.

The PRD lists **future optional** items (§12) but does not define a paid tier. This phase is where you **lock Pro scope** and build it.

## 2.1 Define Pro (product)

- List **Pro-only** capabilities vs **free** (examples to decide: advanced analytics, export, themes, coaching copy, unlimited history — **not decided in PRD**).
- Define **upgrade moment** in the UX (paywall placement, trial, soft limits).

## 2.2 Define Pro (technical)

- **Identity:** anonymous device vs account (email, OAuth) — drives sync and restore.
- **Entitlement source:** payment provider webhook, app-store receipt, license key, etc.
- **Offline / local-first:** how Pro state behaves when offline (cached entitlement vs server validation).

## 2.3 Implement Pro features

- Build features agreed in 2.1.
- Gate UI and any server-side behavior on entitlement.
- Add tests for entitlement edge cases (expired, refunded, network failure).

## 2.4 Pro QA and dogfooding

- Full regression on free + Pro paths.
- Migration path if existing users already have local data when Pro launches.

## Exit criteria

- Pro value is demonstrable in staging (or production-like environment).
- Entitlement and rollback paths are understood by the team (runbooks — see Phase 4 if operational).

## Handoff to Phase 3

- Once you know **how** you charge and **what** legal/privacy promises you make, Phase 3 runs in parallel with final Pro QA.
