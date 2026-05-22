# Resolved product decisions

Authoritative answers from stakeholder input (2026). Phase docs assume these unless superseded here.

| Area | Decision |
|------|----------|
| **Pro features** | **Unlimited** history on the server; **Apple Health** — **iOS only** (native HealthKit; not web PWA). |
| **Apple Health — direction** | **Import only** — bring **Apple Health data into sessions** in the app (no export of app sessions **to** Health for this policy baseline). |
| **Apple Health — typing** | **No automatic mapping** from HealthKit samples to PRD `SessionType` — the user **assigns or confirms** type (e.g. pick `S`/`A`/`H`/`R` per row or batch); implementation can still **suggest** from raw Health data, but **no silent auto-map**. |
| **Pro — settings** | **CSV export** available in settings; **delete account** (full erasure flow) in settings. |
| **Pro — data export** | **JSON export/import** remains **Pro only** (PRD Phase F); **CSV** is an additional export format in settings. |
| **Free tier** | History capped at **14 days** on device. Rules engine still uses **last 7 days** per PRD §6 unless PRD is updated. |
| **Empty state (no history)** | **User choice** — prompt to pick an initial preference (e.g. strength vs easy cardio) rather than a fixed default. |
| **Same calendar day, second log** | **Confirm overwrite** — show a confirmation before replacing that day’s session. |
| **History sort** | **Newest first**. |
| **Accounts** | **No account for free** (local-only). **Account required for Pro** (cross-device sync and server-side retention). |
| **Cross-device** | **Pro**: sync across devices **via account**. |
| **Free → Pro upgrade** | **Merge local history only** — default path: merge **this device’s** local history into the server-backed account (no separate “replace server with local” or “replace local with server” as the primary flow). |
| **Stack** | **Next.js**, **NextAuth** (JWT sessions), **Tailwind CSS**, **TanStack Query**, **Drizzle ORM**, **TypeScript**. |
| **Distribution** | **PWA** for web; **native iOS/Android after PMF** — **Apple Health (import)** ships with **iOS native** (not before). |
| **Monetization** | **Subscription** via **Stripe** (global / “everywhere” intent). **No free trial.** |
| **Refunds** | **No refunds** — state clearly in Terms/checkout/support docs; verify enforceability with counsel for jurisdictions sold into. |
| **Company** | Incorporated / operating from **Thailand** (legal entity home for Terms, Privacy, tax registration — detail with counsel). |
| **Marketing copy** | **No medical or guaranteed fitness claims**; position as **decision support** only (including when mentioning Apple Health). |
| **Analytics** | **Privacy-friendly** product analytics (no ad networks; minimal, disclosed). |
| **Hosting** | **VPS** deployed with **Coolify** (app + DB + reverse proxy on your infra). |
| **Rollout** | **Full public** launch (not a prolonged private beta as the default gate). |
| **Support** | **Discord** as primary channel; expect responses within **2 days** (set expectations in server rules / docs). |
| **Operations** | **Single owner** (“only me”) for payments webhooks, DB backups, and Coolify incidents — document runbooks and bus factor risk. |
| **Billing / receipts (v1)** | **Simplest path:** **Stripe** Checkout + Customer Portal + **Stripe email receipts**; no dedicated billing support email until you choose to add one later. |

## Notes

- **Stripe** handles tax tooling for global subscriptions; Thailand entity + cross-border sales need accounting/counsel sign-off.
- **No refunds** must be written carefully; some markets impose mandatory cooling-off or dispute rules — legal review before launch.
- **Import-only Health** UX (lists, filters, duplicate handling) can be refined in implementation without changing the policy above.
