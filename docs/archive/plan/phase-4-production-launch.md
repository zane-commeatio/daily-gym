# Phase 4 — Production launch (Coolify VPS, full public)

**Outcome:** App and database run on your **VPS under Coolify**, **full public** launch ([`DECISIONS.md`](DECISIONS.md)), with monitoring, backups, and Discord support ready.

## 4.1 Infrastructure (Coolify)

- **Production** + **staging** environments on VPS (separate DB or schema).
- Coolify: app service, **Postgres** (or chosen DB), persistent volumes, health checks, auto-restart.
- TLS via Coolify / reverse proxy; custom domain.
- **Secrets:** API keys (auth, **Stripe**, analytics), `NEXTAUTH_SECRET`, DB URL, **Stripe webhook** signing secret.

## 4.2 App architecture notes (Next.js)

- **Not** a static-only host: SSR/API routes, NextAuth, webhooks require a **Node** runtime on the VPS.
- Configure **build pipeline** (GitHub → Coolify) and migrations (**Drizzle**) on deploy.

## 4.3 CI/CD

- CI: lint, typecheck, unit tests; optional E2E on main.
- Deploy hooks: run migrations before traffic switch; documented rollback (revert image + migration strategy).

## 4.4 Observability

- Error tracking (e.g. Sentry) for server and client.
- Uptime checks against `/health` or equivalent.
- Privacy-friendly analytics verified in production (no PII in events).

## 4.5 Security

- Rate limits on auth and webhook routes; secure cookies for production.
- Dependency updates; backup verification (DB + Coolify volume snapshots if used).

## 4.6 Launch execution

- **Full public** go-live checklist: DNS, payments live mode, smoke tests, Discord announcement.
- Post-launch: monitor errors and payment webhooks for 24–48h (operational expectation, not a calendar promise).

## Exit criteria

- Public URL serves the app; free and Pro flows work; subscriptions renew; Discord is the documented support surface.
