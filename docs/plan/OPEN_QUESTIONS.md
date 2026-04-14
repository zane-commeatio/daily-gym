# Open questions — answer these to finalize the plan

Decisions below are **intentionally unanswered** in the plan docs so the roadmap stays honest. Reply with your choices (bullet answers are fine); the phase files can then be tightened into a single dated schedule.

## Product & Pro

1. **What does “Pro” include** beyond the PRD MVP? (Pick from: longer history, export/import, themes, weekly summary, Apple Health sync, multiple profiles, priority support, ad-free, etc., or define your own list.)
2. **Free tier limits:** Is the PRD MVP entirely free forever, or do you intend caps (e.g. history length, log frequency) for free users?
3. **Empty state (no history):** Prefer default suggestion **`S`**, **`A`**, or **user-selectable** on first open?
4. **Single session per day:** Confirm **overwrite** vs **confirm/merge** when logging twice the same day.
5. **History screen sort:** **Newest first** vs **calendar order** (PRD §8 allows either — pick one).

## Identity, sync, and data

6. **Accounts:** Stay **anonymous / device-only**, or require **email/OAuth** for Pro (and optional sync)?
7. **Cross-device:** Must Pro work on **phone + desktop** with shared history, or is single-device enough for v1 Pro?
8. **Backup:** Is **export/import JSON** (PRD Phase F) a **Pro-only**, **free**, or **out of scope** feature?

## Tech stack & distribution

9. **Stack:** Confirm **Vite + React + TypeScript** as in PRD §13, or specify another (Next.js, SvelteKit, etc.).
10. **PWA:** Ship as **installable PWA** for v1, or mobile browser only?
11. **Native apps:** Any plan for **App Store / Play** in the first year, or web-only?

## Commercial

12. **Model:** **One-time**, **subscription**, **lifetime**, **freemium**, or **other**?
13. **Channels:** **Web checkout only**, or **Apple/Google IAP** required for iOS/Android?
14. **Regions:** Which countries/currencies must be supported at launch?
15. **Trials:** Free trial length, or no trial?

## Legal, privacy, analytics

16. **Analytics:** **None**, **privacy-friendly product analytics**, or **full marketing stack**? Any ad networks?
17. **Jurisdiction:** Where is the **company / seller** based, and primary **user regions** (affects VAT, CPRA/GDPR)?
18. **Health claims:** Any marketing that could imply medical/fitness outcomes beyond “decision support”?

## Launch & operations

19. **Hosting preference:** **Static host** (e.g. GitHub Pages, Netlify, Vercel, Cloudflare Pages) vs **full backend** from day one?
20. **Rollout:** **Private beta → public**, **soft launch**, or **full public** on day one?
21. **Support:** Email only, in-app form, Discord, or other — and expected response time?

---

After you answer, the next step is to **annotate each phase file** with “Resolved: …” references or to generate a single **dated execution checklist** (optional follow-up).
