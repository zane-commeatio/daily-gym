# Implementation plan — PRD to launched Pro

This folder turns [`WORKOUT_RECOMMENDER_PRD.md`](../WORKOUT_RECOMMENDER_PRD.md) into a **phased roadmap** from an empty repo through **MVP**, **pre-launch hardening**, **Pro / commercial readiness**, and **production launch**.

**Start here:** read the phase files in order. **Unresolved decisions** live in [`OPEN_QUESTIONS.md`](OPEN_QUESTIONS.md); answering those removes guesswork from scheduling and scope.

| Phase | Doc | Goal |
|-------|-----|------|
| 0 | [Phase 0 — MVP (PRD §13)](./phase-0-mvp.md) | Working local-first app: rules engine, Today / Log / History, persistence. |
| 1 | [Phase 1 — Beta & quality](./phase-1-beta-quality.md) | Reliable enough for real users: tests, UX polish, device coverage, feedback loop. |
| 2 | [Phase 2 — Pro definition & build](./phase-2-pro.md) | Ship a **Pro** that is defined, built, and validated (content + entitlement + support). |
| 3 | [Phase 3 — Commercial & compliance](./phase-3-commercial-compliance.md) | Payments, legal, privacy, support — only as required by your choices in OPEN_QUESTIONS. |
| 4 | [Phase 4 — Production launch](./phase-4-production-launch.md) | Hosting, CI/CD, observability, rollout, and “launched Pro” operational readiness. |

Cross-cutting: [OPEN_QUESTIONS.md](OPEN_QUESTIONS.md).
