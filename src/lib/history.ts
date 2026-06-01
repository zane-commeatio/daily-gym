import { classify } from "./classify";
import { calendarDaysBetween } from "./dates";
import type { Session } from "./types";

/**
 * Normalize to engine input: last 7 calendar days relative to `todayIso`, newest first,
 * at most one row per day (latest wins).
 * @param sessions All sessions to filter.
 * @param todayIso Today's date string (YYYY-MM-DD).
 * @returns The sessions in the 7-day window, newest first, deduplicated by date.
 */
export function buildHistory(sessions: Session[], todayIso: string): Session[] {
  const byDate = new Map<string, Session>();
  for (const s of sessions) {
    byDate.set(s.date, s);
  }

  const inWindow: Session[] = [];
  for (const s of byDate.values()) {
    const diff = calendarDaysBetween(s.date, todayIso);
    if (diff >= 0 && diff < 7) inWindow.push(s);
  }

  inWindow.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
  return inWindow.slice(0, 7);
}

/**
 * Find the session from yesterday (1 calendar day before today).
 * @param history The history array to search.
 * @param todayIso Today's date string.
 * @returns The session from yesterday, or undefined.
 */
export function getYesterdaySession(
  history: Session[],
  todayIso: string,
): Session | undefined {
  const y = history.find((s) => calendarDaysBetween(s.date, todayIso) === 1);
  return y;
}

/** Count how many HIIT (H) sessions appear in the given history array. */
/**
 * Count HIIT (H) sessions in the history.
 * @param history Sessions to scan.
 * @returns The number of HIIT sessions.
 */
export function countHInLast7(history: Session[]): number {
  return history.filter((s) => s.type === "H").length;
}

/** Count hard sessions among the first 3 entries (used for rule 5). */
/**
 * Count hard sessions in the first 3 entries (PRD §6 rule 5).
 * @param history Sessions (newest first).
 * @returns Number of hard sessions in the first 3.
 */
export function hardSessionsLast3(history: Session[]): number {
  return history.slice(0, 3).filter((s) => classify(s) === "hard").length;
}

/** Check whether any of the first 3 entries is a strength (S) session. */
/**
 * Check whether a strength session appears in the first 3 entries.
 * @param history Sessions (newest first).
 * @returns True if any of the first 3 is strength.
 */
export function strengthInLast3(history: Session[]): boolean {
  return history.slice(0, 3).some((s) => s.type === "S");
}
