# Open questions

Most decisions are in [`DECISIONS.md`](DECISIONS.md) (including PR review resolutions: unlimited history, CSV in settings, delete account, iOS-only Health, no trial, Stripe, no refunds, Thailand entity, 2-day Discord response, single owner on-call).

The items below still need a concrete spec so implementation does not guess.

## Apple Health (iOS native)

1. **Direction:** **Import** from Health into sessions, **export** workouts to Health, or **both**?
2. **Mapping:** How each PRD `SessionType` (`S` / `A` / `H` / `T` / `R`) maps to **HealthKit** samples or categories (and what to do with unmapped data).

## Upgrade & sync edge cases

3. **First Pro login from free:** **Merge this device’s local history** vs **replace server** vs **user picks** — default and conflict rules.

## Optional polish (can ship later)

4. **Billing receipts:** Stripe **customer portal** + email receipts only, or also a **support email** for invoice questions (Discord remains primary for chat).

---

Update this file when answered; fold stable answers into `DECISIONS.md` if they become policy.
