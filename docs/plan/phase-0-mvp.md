# Phase 0 — MVP (aligned with PRD §13)

**Outcome:** A minimal web app that implements §2–§9 of the PRD: log sessions, run the rules engine on the last 7 days + optional fatigue, show a primary recommendation and 1–2 alternatives, persist locally.

This phase maps directly to **Phases A–E** in the PRD. The repo currently has **no application code** (only the PRD and a stub README); Phase 0 includes scaffolding.

## 0.1 Project skeleton (PRD Phase A)

- Scaffold the web app (stack to be chosen — see [OPEN_QUESTIONS.md](OPEN_QUESTIONS.md) *Tech stack*).
- Strict TypeScript for `Session` / `SessionType`; implement `classify()` exactly as PRD §5.

## 0.2 Rules engine (PRD Phase B)

- `buildHistory(sessions, today)` — normalize dates, newest first, last 7 calendar days.
- `recommend(history, fatigueToday)` — `allowed` + ranked output for “best” and “also acceptable”; rules §6 **in order**.
- Unit tests covering each rule branch and edge cases (empty history, boundaries of 7-day window).
- Central label map (PRD §7, i18n-ready shape if desired later).

## 0.3 Persistence (PRD Phase C)

- Load/save `Session[]` via local-first storage (PRD §9).
- Enforce one session per calendar day and chosen merge behavior (overwrite vs confirm — **open in questions** if not fixed in PRD).

## 0.4 UI (PRD Phase D)

- **Today** — recommendation + alternatives + path to Log; fatigue capture as in PRD §8.
- **Log** — type, conditional intensity, submit → persist → navigate.
- **History** — last 7 days, consistent sort order.

## 0.5 Polish (PRD Phase E)

- Empty-state behavior when there is no history (product preference — **OPEN_QUESTIONS**).
- Basic accessibility (focus, labels, semantics).
- Root README: how to run + pointer to PRD (PRD §13 item 15).

## Exit criteria

- All PRD §6 rules have automated tests.
- A user can complete the core loop: open → see suggestion → log → see history → see updated suggestion — without manual planning.

## Handoff to Phase 1

- List known UX gaps and device targets from OPEN_QUESTIONS before calling MVP “beta-ready.”
