# daily-gym

Workout **decision support**: log what you did, get a simple recommendation for today based on the rules in [`docs/WORKOUT_RECOMMENDER_PRD.md`](docs/WORKOUT_RECOMMENDER_PRD.md).

## Run locally

```bash
yarn install
yarn dev
```

Open [http://localhost:3000](http://localhost:3000). The app uses **local storage** only (no account) for the free tier.

## Scripts

| Command   | Description        |
| --------- | ------------------ |
| `yarn dev`   | Next.js dev server |
| `yarn build` | Production build   |
| `yarn test`  | Vitest unit tests  |
| `yarn lint`  | ESLint             |

## Product rules

The recommendation engine lives under `src/lib/` (`buildHistory`, `recommend`, `classify`). Behavior is defined in PRD §5–§6 and covered by unit tests.
