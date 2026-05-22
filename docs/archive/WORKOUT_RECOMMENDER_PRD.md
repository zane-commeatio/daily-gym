# Workout recommender — product requirements

A minimal web app that tells the user what workout to do **today** based on **simple rules** and **recent history** (not a fixed weekly schedule). The user logs what they did; the app decides what is allowed next and suggests today’s session.

---

## 1. Core concept

1. **Log** — User records daily sessions (type, intensity, optional fatigue).
2. **Decide** — A rules engine reads the last 7 days (and optional today’s fatigue) and computes **allowed** session types.
3. **Suggest** — The UI shows a **primary recommendation** plus **1–2 alternatives** so the user does not have to think.

---

## 2. Session types

| Code | Meaning        |
|------|----------------|
| **S** | Strength     |
| **A** | Aerobic (easy) |
| **H** | High intensity |
| **R** | Rest           |

---

## 3. User inputs (daily)

| Field | Required | Values | Notes |
|-------|----------|--------|--------|
| Session type | Yes | `S` / `A` / `H` / `R` | |
| Intensity | When needed | `easy` / `hard` | Drives classification of `S`; see §5 |
| Fatigue | No | `low` / `medium` / `high` | Used **only** for **today’s recommendation** (not stored as a session field unless you choose to extend the model later) |

---

## 4. Data model (minimal)

```ts
type SessionType = "S" | "A" | "H" | "R";

type Session = {
  date: string; // ISO date, e.g. "2026-04-14" — one session per calendar day for MVP
  type: SessionType;
  intensity?: "easy" | "hard";
};
```

**MVP assumptions:**

- **One session per day** stored; logging overwrites or confirms that day’s entry (product choice: overwrite is simpler).
- History for the engine is the **last 7 calendar days** of sessions, **sorted newest first** (`history[0]` = yesterday if today has no entry, or include “today” only after log — see implementation plan).

---

## 5. Derived logic: hard vs easy

```ts
function classify(session: Session): "easy" | "hard" {
  if (session.type === "H") return "hard";
  if (session.type === "S" && session.intensity === "hard") return "hard";
  return "easy";
}
```

- **`A` and `R`** are always **easy** for load purposes (unless you later refine `A`).
- **`S` easy** = “light S” when rules allow it.

---

## 6. Rules engine (authoritative)

**Inputs:**

- `history`: up to **7** sessions, **newest first**, dates in the last 7 days (relative to “today”).
- `fatigueToday`: `low` | `medium` | `high` | `undefined`.

**Helpers (conceptual):**

- `yesterday` = session on calendar day **yesterday** (if any).
- `last3` / `last7` = first 3 / 7 entries in `history` (newest first).
- `countHInLast7` = number of sessions where `type === "H"` (each counts as one **H** day).
- `hardSessionsLast3` = count of sessions in `last3` where `classify(s) === "hard"`.
- `strengthInLast3` = any session in `last3` with `type === "S"`.

**Rules (evaluate in order; first match wins unless noted):**

1. **Fatigue high** → allowed: **`A`**, **`R`** only.
2. **Yesterday was `H`** → **block** `H` and **`S`** → allowed: **`A`**, **`R`**.
3. **Yesterday was `S` and `classify(yesterday) === "hard"`** → **block** `H` → allowed: **`A`**, **`R`**, or **light `S`** (`S` with easy intensity).
4. **Count `H` in last 7 days ≥ 2** → **block** `H` (still apply after 2–3 unless fatigue or other rules removed all options).
5. **`hardSessionsLast3` ≥ 2** → allowed: **`A`**, **`R`** only (forces recovery-ish choices).
6. **No `S` in last 3 days** → **prioritize** `S` (recommendation order: prefer **`S`** as “best”; alternatives may include **`A`** or **`R`** if allowed by other rules).
7. **No hard session in last 3 days** → **prioritize** `H` when still allowed, but keep **`S`** ahead of **`H`** if both ranking rules apply.
8. **Default** → allow **`A`** (and other types not blocked by above).

**Blocked types** must be excluded from both “best” and “also acceptable” unless the rule explicitly allows a variant (e.g. light `S`).

**Note:** An earlier illustrative pseudo-code snippet in the brief mixed “hard in 7 days” with blocking `H`; **this numbered list is the source of truth** for implementation. Implement tests against these rules.

---

## 7. Output (main feature)

- **Primary line:** “Today you should do: **[label]**” where the label is user-friendly (e.g. “Strength”, “Easy cardio”, “Rest”).
- **Secondary:** 1–2 alternatives:
  - **Best** — primary recommendation.
  - **Also acceptable** — second (and optionally third) ranked option from allowed set.

Example copy:

- **Best:** Strength  
- **Also ok:** Easy cardio  

Map codes to short labels in one place (constants / i18n-ready object).

---

## 8. UI (simple)

### Screen 1 — Today

- Large **one-word or short phrase** recommendation.
- **Secondary options** (best + also acceptable).
- **`Log session`** → navigates to Log.

Optional: show **today’s fatigue** selector on this screen **before** recommendation, or on a small sub-panel — minimal path is one tap to set fatigue then refresh recommendation.

### Screen 2 — Log

- Select **session type** (`S` / `A` / `H` / `R`).
- Show **intensity** when `S`.
- **Submit** → save to persistence → return to Today (or History).

### Screen 3 — History

- List **last 7 days** (date + type + intensity if present).
- Newest first or calendar order — pick one and stay consistent.

---

## 9. Persistence

- **Local-first** for MVP: `localStorage` or `IndexedDB` keyed by project ID.
- Serialize `Session[]` with stable date strings.

---

## 10. Non-goals

- No calorie tracking  
- No heart rate integration  
- No multi-week periodization  
- No social features  

---

## 11. Success criteria

- User opens the app and understands **what to do today in under ~5 seconds**.
- No manual “planning” — only **decision support**.
- Balances strength, cardio, and recovery **without** encouraging back-to-back hard days.

---

## 12. Future (optional)

- Apple Health (or similar) auto-import  
- RPE tracking  
- Weekly summary (hard vs easy balance)  

---

## 13. Step-by-step implementation plan

### Phase A — Project skeleton

1. **Scaffold** the web app (e.g. Vite + React + TypeScript) in-repo if not present; align with existing tooling (`npm`).
2. **Add** path alias and strict TypeScript for `Session` / `SessionType`.
3. **Define** the data model and `classify()` exactly as in §5.

### Phase B — Rules engine (pure functions)

4. **Implement** `buildHistory(sessions, today)` — normalize dates, sort newest first, slice last 7 days.
5. **Implement** `recommend(history, fatigueToday)` returning at minimum:
   - `allowed: SessionType[]` (or a structure that distinguishes `S` easy vs hard if needed),
   - `ranked: SessionType[]` for “best” and “also acceptable”.
6. **Encode** rules §6 **in order** with unit tests: fatigue, yesterday H, yesterday hard S, H count in 7d, 2 hard in 3d, no S in 3d, default.
7. **Add** label mapping for UI strings (`S` → “Strength”, etc.).

### Phase C — Persistence + state

8. **Load/save** sessions from browser storage on boot and after log.
9. **Single session per day** — validate `date` and merge behavior (overwrite).

### Phase D — UI

10. **Today** screen: read fatigue + history → call `recommend` → show primary + alternatives + “Log session”.
11. **Log** screen: form with conditional intensity → submit → persist → navigate.
12. **History** screen: last 7 days list.

### Phase E — Polish and quality

13. **Empty state** — no history: sensible default (e.g. suggest `S` or `A` per product preference).
14. **Accessibility** — buttons, labels, focus order.
15. **README** — how to run, how rules work (short pointer to this PRD).

### Phase F — Optional follow-ups

16. PWA manifest for “install on phone”.  
17. Export/import JSON backup.  

---

## Document history

| Version | Date       | Notes        |
|---------|------------|--------------|
| 1.0     | 2026-04-14 | Initial PRD |
