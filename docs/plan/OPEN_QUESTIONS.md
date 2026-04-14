# Open questions

Most product and stack choices are captured in [`DECISIONS.md`](DECISIONS.md). The items below still need an answer so engineering and compliance do not guess.

## Product & data

1. **Pro retention:** Unlimited history vs a **fixed max** (e.g. 1 year, 5 years)? Any **user-controlled delete** or export obligations?
2. **Apple Health (scope):** **Import** workouts only, **export** sessions only, or **both**? Which HealthKit types map to PRD session types (`S`/`A`/`H`/`T`/`R`)?
3. **Apple Health (platform):** Ship **Health on web** (if any) only after **native app**, or accept **manual CSV** / deferred Health until native?
4. **Subscription trial:** Length (**7 / 14 / none** days) and whether **card required** up front.

## Commercial & tax

5. **Payment provider:** **Stripe**, **Paddle**, or other (must support global subscriptions and tax where you sell)?
6. **Refunds / chargebacks:** Default policy (e.g. 7-day money-back) for Discord/support to reference.

## Legal & privacy

7. **Company jurisdiction** and **primary markets** (for Terms, Privacy, VAT/GST wording — “everywhere” still needs a legal home).
8. **Marketing copy:** Confirm **no medical or guaranteed fitness claims**; align with counsel if you mention Apple Health prominently.

## Operations

9. **Discord:** **Expected response time** (e.g. 24h business days) and whether **billing issues** escalate to email.
10. **On-call:** Named owner for payments webhooks, DB backups, and Coolify outages.

---

When these are answered, update this file and add a short “Resolved” subsection per item or fold answers into `DECISIONS.md`.
