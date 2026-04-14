# Phase 3 — Commercial & compliance

**Outcome:** You can **legally and safely** charge for Pro in your chosen markets, with privacy disclosures and support expectations aligned with reality.

Scope is **conditional**: if Pro is free, donation-only, or enterprise-contract, this phase shrinks accordingly. Use [OPEN_QUESTIONS.md](OPEN_QUESTIONS.md).

## 3.1 Payments & billing

- Select provider(s) (Stripe, Paddle, App Store / Play Billing, etc.).
- Implement checkout, subscription lifecycle (trial, renew, cancel, refund hooks).
- Tax/VAT and invoicing requirements — jurisdiction-dependent.

## 3.2 Legal

- Terms of Service, Privacy Policy, cookie/consent banner if you use non-essential cookies or trackers.
- Refund policy aligned with store rules or local law.
- If health-adjacent claims are made in marketing, review positioning with counsel (tool is decision support, not medical advice — wording TBD).

## 3.3 Privacy & data

- Data inventory: what you store (sessions, emails, analytics), where, retention.
- DPIA / GDPR / CCPA applicability — **region-dependent** (OPEN_QUESTIONS).
- Subprocessor list if you use analytics, email, or auth vendors.

## 3.4 Customer support

- Support channel and SLA (even if “best effort”).
- Process for billing and account issues.

## Exit criteria

- Published policies and in-app links.
- Payment flows tested in **production-like** mode (provider test clocks / sandbox).
- A clear answer to “what data leaves the device and why.”

## Handoff to Phase 4

- Launch is not only “code on a server”; it includes runbooks and monitoring (Phase 4).
