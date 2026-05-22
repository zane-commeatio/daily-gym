# Phase 3 — Commercial & compliance (global subscription)

**Outcome:** **Stripe** subscriptions work globally ([`DECISIONS.md`](DECISIONS.md)), with Terms, Privacy, and checkout copy aligned: **Thailand** company, **no trial**, **no refunds** (as legally reviewed), **privacy-friendly** analytics, **Discord** support (**2-day** response expectation).

## 3.1 Payments & billing

- **Stripe** — Checkout + Customer Portal; subscription lifecycle (create, renew, cancel, failed payment); **webhook idempotency**; tax settings for jurisdictions sold into; **Stripe email receipts** ([`DECISIONS.md`](DECISIONS.md)).
- **No free trial** — do not configure trial periods in Stripe for this product unless policy changes.
- **v1 billing support:** simplest path — no separate **billing@** inbox; revisit later if volume warrants ([`DECISIONS.md`](DECISIONS.md)).

## 3.2 Legal & product copy

- Terms of Service, Privacy Policy: Thailand entity, session data, optional Health data (iOS), subprocessors, **no medical claims** ([`DECISIONS.md`](DECISIONS.md)).
- **Refund policy:** **No refunds** — clear at purchase and in Terms; validate against consumer rules in target markets with counsel.
- Cookie/consent: align with **privacy-friendly** analytics only.

## 3.3 Privacy-friendly analytics

- One vendor (e.g. Plausible, PostHog self-hosted, or similar) — **no ad networks**; document events and retention.

## 3.4 Health data (iOS)

- App Store **privacy nutrition** labels; in-app copy: **import from Health** into app sessions, **no auto-mapping** to workout types ([`DECISIONS.md`](DECISIONS.md)).
- **App Store** IAP rules may apply when native ships — track separately from web Stripe.

## 3.5 Support

- **Discord** primary; pin **2-day** response expectation ([`DECISIONS.md`](DECISIONS.md)).
- **Stripe Customer Portal** for self-serve subscription management; invoice questions via Discord unless you add email later ([`DECISIONS.md`](DECISIONS.md)).

## 3.6 Operations

- Single owner for webhooks/backups/incidents — document **runbooks** and backup restore drill ([`DECISIONS.md`](DECISIONS.md)).

## Exit criteria

- Sandbox → production test: subscribe, renew, cancel, webhook handling; copy matches **no trial** / **no refunds**.
- Policies published and linked from the app.

## Handoff to Phase 4

- Secrets, Stripe webhooks, and DB backups ready for Coolify production.
