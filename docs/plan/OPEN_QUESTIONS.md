# Open questions

**Policy and commercial choices** are in [`DECISIONS.md`](DECISIONS.md). Nothing here blocks Phase 0–1; remaining items are **optional UX/engineering detail** for Apple Health import and can be decided during iOS build.

## Optional — Apple Health import UX (iOS)

1. **Granularity:** Import as **one session per calendar day** (PRD model) vs allow **multiple Health-backed rows** per day with user merge rules.
2. **Duplicate detection:** When re-importing, match on date + source id vs always create new draft rows for user to confirm.
3. **Export to Health (future):** Revisit if product later needs **write** to Health; current policy is **import only**.

---

Add rows here only when a decision is needed; otherwise delete this file’s sections as they close.
