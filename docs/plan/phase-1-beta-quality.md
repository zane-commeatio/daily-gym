# Phase 1 — Beta & quality

**Outcome:** The MVP is stable and understandable for **early users** on the browsers/devices you care about, with a lightweight way to collect issues and iterate.

This phase is **not** fully defined in the PRD; scope depends on answers in [OPEN_QUESTIONS.md](OPEN_QUESTIONS.md).

## 1.1 Testing depth

- Expand unit/integration coverage as needed (e.g. storage migrations, navigation, date edge cases around midnight/time zones).
- Optional: E2E against a single browser (tooling TBD in OPEN_QUESTIONS).

## 1.2 UX and content

- Refine copy, empty states, and error messages (offline storage failures, quota exceeded).
- Confirm history sort order and labeling for tennis variants (PRD §7) match user testing.

## 1.3 Performance and resilience

- Validate cold start and storage size for long-term use (7-day window is small; still verify).
- Decide behavior when `localStorage` / IndexedDB is unavailable or full.

## 1.4 Beta channel

- Distribution mechanism: private URL, TestFlight (if native wrapper), PWA install link, etc. — **OPEN_QUESTIONS**.
- Feedback: in-app link, email, or issue tracker — **OPEN_QUESTIONS**.

## Exit criteria

- No known **P0** bugs on supported environments.
- Success criteria in PRD §11 validated informally (e.g. short user tests: “understand today’s recommendation in ~5 seconds”).

## Handoff to Phase 2

- Document what “free vs Pro” might mean before building Pro (see Phase 2).
