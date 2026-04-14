# Phase 3 — Commercial & compliance (global subscription)

**Outcome:** **Subscription** checkout works in **all intended markets** ([`DECISIONS.md`](DECISIONS.md)), with Terms, Privacy, refund stance, and **privacy-friendly** analytics disclosed. Support is **Discord-first** ([`DECISIONS.md`](DECISIONS.md)).

## 3.1 Payments & billing

- Integrate **Stripe or Paddle** (or equivalent) with **global** tax/VAT support — confirm provider in [`OPEN_QUESTIONS.md`](OPEN_QUESTIONS.md).
- Subscription lifecycle: create, renew, cancel, failed payment, webhook idempotency, customer portal link.
- Define **trial** policy (OPEN_QUESTIONS).

## 3.2 Legal & product copy

- Terms of Service, Privacy Policy (account, sessions, Health data if collected, subprocessors).
- Cookie/consent: align with **privacy-friendly** analytics only.
- Refund/support policy referenced from app and Discord.

## 3.3 Privacy-friendly analytics

- One vendor (e.g. Plausible, PostHog self-hosted, or similar) — **no ad networks**; document events and retention.

## 3.4 Health data (if Apple Health is in scope)

- Apple **privacy nutrition** labels and in-app explanation of what is read/written.
- If native ships later, plan **App Store** compliance (IAP rules may apply to digital goods — track separately).

## 3.5 Support

- Discord roles/channels for **billing** vs **product**; escalation path (email for invoices — OPEN_QUESTIONS).

## Exit criteria

- Sandbox → production test of full subscribe / cancel / webhook path.
- Policies published and linked from the app and marketing site.

## Handoff to Phase 4

- Secrets, webhooks, and DB backups ready for Coolify production.
