# AGENTS.md

## Cursor Cloud specific instructions

### Overview

**daily-gym** is a workout recommender web app (Next.js App Router, TypeScript, Tailwind CSS, TanStack Query). It tells users what workout to do today based on simple rules and recent exercise history.

The app is in early development (Phase 0 MVP). There is no backend, database, or auth yet — the free tier is local-storage only.

### Commands

| Task | Command |
|------|---------|
| Install deps | `npm install` |
| Dev server | `npm run dev` (runs on port 3000 by default) |
| Build | `npm run build` |
| Lint | `npm run lint` |

### Architecture notes

- **Package manager:** npm. Do not use yarn or pnpm.
- **Framework:** Next.js 16 with App Router (`src/app/`).
- **Styling:** Tailwind CSS v4 via `@tailwindcss/postcss`.
- **Client state:** TanStack Query is installed for future use.
- **No server-side services required** for the MVP free tier — everything runs client-side.
- PRD and planning docs live in `docs/`.
