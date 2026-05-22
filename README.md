# daily-gym

Workout **decision support**: log what you did, get a simple recommendation for today based on recent history and how you feel — not a fixed weekly plan.

## What it does

- **Today** — rules-based recommendation (primary + alternatives) from the last **7 calendar days**, plus optional fatigue for today only
- **Log session** — one entry per day (`S` / `A` / `H` / `R`); replacing a day asks for confirmation
- **History** — up to **14 days** stored on this device (free tier, no account)

Session data stays in **localStorage** only for the MVP.

## Run locally

Requires **Node ≥ 20.19** (see `.nvmrc` for the version used in CI).

```bash
npm install
npm run dev
```

Open [http://localhost:3025](http://localhost:3025).

## Scripts

| Command | Description |
| ------- | ----------- |
| `npm run dev` | Next.js dev server (port **3025**) |
| `npm run build` | Production build + TypeScript check |
| `npm test` | Vitest unit tests (`src/lib/*.test.ts`) |
| `npm run lint` | ESLint |

## How rules work

The recommendation engine is pure TypeScript under `src/lib/`:

- `classify.ts` — easy vs hard load
- `history.ts` — last 7 days, newest first
- `recommend.ts` — blocking rules and ranking

Behavior is covered by unit tests; run `npm test` after changing rules.

## Documentation

| Doc | Status |
| ----- | ------ |
| [`AGENTS.md`](./AGENTS.md) | **Current** — commands, layout, conventions for contributors |
| [`docs/archive/`](./docs/archive/) | **Archived** — original PRD and phased plans; may be stale |

If archived docs disagree with the app, trust **`src/lib/*`** and the tests.
