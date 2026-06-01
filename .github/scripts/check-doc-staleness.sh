#!/usr/bin/env bash
# Warns when source files are newer than their associated docs.
# This is a non-blocking signal to remind contributors to keep docs current.
set -euo pipefail

stale=false

check_pair() {
  local src="$1" doc="$2"
  if [ ! -f "$doc" ]; then
    echo "::warning title=doc-staleness::Missing doc: $doc (referenced by $src)"
    stale=true
    return
  fi
  if [ "$src" -nt "$doc" ]; then
    echo "::warning title=doc-staleness::$doc may be stale — $src was updated more recently"
    stale=true
  fi
}

# src/lib/ core logic ↔ PRD
check_pair "src/lib/recommend.ts" "docs/archive/WORKOUT_RECOMMENDER_PRD.md"
check_pair "src/lib/classify.ts" "docs/archive/WORKOUT_RECOMMENDER_PRD.md"
check_pair "src/lib/history.ts" "docs/archive/WORKOUT_RECOMMENDER_PRD.md"
check_pair "src/lib/types.ts" "docs/archive/WORKOUT_RECOMMENDER_PRD.md"

# Date handling ↔ ADR 001
check_pair "src/lib/dates.ts" "docs/adr/001-use-utc-calendar-math.md"

if [ "$stale" = true ]; then
  echo "---"
  echo "Update the stale docs listed above, or confirm they remain accurate by touching them."
fi
