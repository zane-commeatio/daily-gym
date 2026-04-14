# daily-gym

Workout **decision support**: log what you did, get a simple recommendation for today based on the rules in [`docs/WORKOUT_RECOMMENDER_PRD.md`](docs/WORKOUT_RECOMMENDER_PRD.md).

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The app uses **local storage** only (no account) for the free tier.

## Scripts

| Command   | Description        |
| --------- | ------------------ |
| `npm run dev`   | Next.js dev server |
| `npm run build` | Production build   |
| `npm test`      | Vitest unit tests  |
| `npm run lint`  | ESLint             |

## Product rules

The recommendation engine lives under `src/lib/` (`buildHistory`, `recommend`, `classify`). Behavior is defined in PRD §5–§6 and covered by unit tests.
