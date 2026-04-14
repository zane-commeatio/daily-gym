# Phase 4 — Production launch

**Outcome:** **Pro is live** for real customers: deployed, observable, recoverable, and repeatable (CI/CD).

## 4.1 Hosting & environments

- Production + staging (minimum); secrets management; domain and TLS.
- CDN / edge config if applicable; caching rules for SPA.

## 4.2 CI/CD

- Lint, typecheck, tests on every merge; optional preview deploys per branch.
- Release process: versioning, changelog, rollback strategy.

## 4.3 Observability

- Error tracking (e.g. front-end errors, API errors if any).
- Uptime checks; alerting thresholds.
- Product analytics **only if** approved in OPEN_QUESTIONS (privacy alignment).

## 4.4 Security

- Dependency updates; SAST/secret scanning as appropriate.
- If backend exists: auth hardening, rate limits, webhook signature verification.

## 4.5 Launch execution

- Communication plan: who is notified, where (email list, social, etc.).
- Gradual rollout vs big bang — **OPEN_QUESTIONS**.
- Post-launch checklist: smoke tests, payment verification, support readiness.

## Exit criteria

- Production URL serves the shipped build; Pro purchases work end-to-end.
- On-call or owner knows how to roll back and where logs live.
- “Launched Pro” = users can pay (if paid), use Pro features, and get support per published policy.
