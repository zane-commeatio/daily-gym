# Implementation plan — PRD to launched Pro

This folder turns [`WORKOUT_RECOMMENDER_PRD.md`](../WORKOUT_RECOMMENDER_PRD.md) into a **phased roadmap** from an empty repo through **MVP**, **beta quality**, **Pro** (extended retention, Apple Health, account + sync), **commercial/compliance**, and **production launch** on your **VPS (Coolify)**.

**Authoritative choices:** [`DECISIONS.md`](DECISIONS.md)  
**Narrow TBDs:** [`OPEN_QUESTIONS.md`](OPEN_QUESTIONS.md) (mostly Apple Health mapping + upgrade merge rules)

| Phase | Doc | Goal |
|-------|-----|------|
| 0 | [Phase 0 — MVP](./phase-0-mvp.md) | PRD core: rules engine, Today / Log / History, **local-first free tier** (14-day history cap), confirm-overwrite, user-chosen empty state. |
| 1 | [Phase 1 — Beta & quality](./phase-1-beta-quality.md) | PWA-ready quality: tests, UX, Discord feedback loop. |
| 2 | [Phase 2 — Pro](./phase-2-pro.md) | Accounts (Pro-only), server DB, **>14d retention**, **Apple Health** (scoped), Pro export/import, cross-device sync. |
| 3 | [Phase 3 — Commercial & compliance](./phase-3-commercial-compliance.md) | Global **subscription**, legal/privacy, privacy-friendly analytics. |
| 4 | [Phase 4 — Production launch](./phase-4-production-launch.md) | **Coolify/VPS**, CI/CD, observability, **full public** launch, Discord support. |

Cross-cutting: [DECISIONS.md](DECISIONS.md) · [OPEN_QUESTIONS.md](OPEN_QUESTIONS.md)
