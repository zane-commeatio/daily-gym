# AGENTS.md

## Commands

- Use `npm` only. `packageManager` is `npm@11.6.2`.
- Node: `package.json` requires `>=20.19.0`; `.nvmrc` is `22.13.0`.
- Install: `npm install`
- Dev: `npm run dev`
- Lint: `npm run lint`
- Test: `npm test`
- Focus one test file with Vitest: `npm test -- src/lib/recommend.test.ts`
- There is no separate `typecheck` script; use `npm run build` for full Next.js type/build verification.

## App Shape

- This is a single-package Next.js 16 App Router app, not a monorepo.
- The main UI currently lives in one route: `src/app/page.tsx`.
- `src/app/page.tsx` renders Today, Log session, and History on the same page.
- `src/app/layout.tsx` wraps the app with `QueryProvider` and a global `sonner` toaster.

## Source Of Truth

- Product behavior is defined by `docs/WORKOUT_RECOMMENDER_PRD.md`.
- Resolved product decisions that affect implementation live in `docs/plan/DECISIONS.md`.
- If docs and code disagree, trust the executable behavior in `src/lib/*` and `package.json`.

## Core Logic

- Recommendation logic is in pure functions under `src/lib/`:
  - `classify.ts`
  - `history.ts`
  - `recommend.ts`
  - labels/types/date helpers nearby
- Tests for the rules engine live beside the logic in:
  - `src/lib/history.test.ts`
  - `src/lib/recommend.test.ts`
- Vitest runs in `node` environment and supports the `@/` alias via `vitest.config.ts`.

## Data And Persistence Constraints

- MVP is client-only. Sessions are stored in `localStorage` via `src/lib/storage.ts`.
- Storage keys are `daily-gym-sessions` and `daily-gym-starting-preference`.
- Free-tier history is capped to 14 days in storage/UI.
- The rules engine only considers the last 7 calendar days.
- There is one session per calendar day; logging the same date replaces the prior entry after confirmation.
- Empty history is not hardcoded to a default workout: the user picks a starting bias (`S` or `A`), which is stored separately.

## Date Handling

- Session dates are plain `YYYY-MM-DD` strings.
- Use the helpers in `src/lib/dates.ts` for parsing/arithmetic.
- These helpers intentionally use UTC calendar math to avoid timezone drift. Do not switch session-date logic to naive `new Date("YYYY-MM-DD")` handling.

## UI Conventions

- Styling is Tailwind CSS v4 via `@tailwindcss/postcss`.
- There is no `tailwind.config.*`; theme tokens live in `src/app/globals.css`.
- UI primitives in `src/components/ui/` follow the `components.json` aliases (`@/components`, `@/components/ui`, `@/lib`, `@/hooks`).
- Use toast feedback patterns consistently with `sonner`; the app already has a global toaster in layout.
