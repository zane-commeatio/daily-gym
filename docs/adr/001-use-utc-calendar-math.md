# 1. Use UTC calendar math for session dates

**Date:** 2026-04-14
**Status:** accepted

## Context

Session dates are stored as `YYYY-MM-DD` strings. Date arithmetic such as
"yesterday" and "last 7 days" must give consistent results regardless of the
user's local timezone. Using `new Date("YYYY-MM-DD")` in local timezone
would produce off-by-one errors for users near midnight UTC.

## Decision

Use explicit UTC calendar math via the helpers in `src/lib/dates.ts`:

- `parseIsoDate` — constructs a `Date` via `Date.UTC(year, month-1, day)`
- `formatIsoDate` — serialises via `getUTCFullYear`, `getUTCMonth`, `getUTCDate`
- `calendarDaysBetween` — difference in whole UTC days, no DST or TZ effects
- `addCalendarDays` — adds days via `setUTCDate`

No code outside `dates.ts` should construct `new Date("YYYY-MM-DD")` for
session-date logic.

## Consequences

- Consistent behaviour regardless of user timezone.
- Slightly more verbose date arithmetic (must use `dates.ts` helpers).
- Enforced by convention documented in `AGENTS.md`.
