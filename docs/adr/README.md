# Architecture Decision Records

Each ADR documents a significant decision, its context, and its consequences.
ADRs are **living** — they are created as `proposed`, moved to `accepted` once
implemented, and marked `superseded` with a link to the replacement when
outdated.

## Active

| # | Title | Status |
|---|-------|--------|
| 1 | [Use UTC calendar math for session dates](001-use-utc-calendar-math.md) | accepted |

## Process

1. Create a new numbered file `docs/adr/NNN-title.md` from the template.
2. Set `Status: proposed`.
3. Open a PR with the ADR and the implementation.
4. Merge → set `Status: accepted`.
5. If a later decision replaces this one, mark it `superseded` and link to the new ADR.
