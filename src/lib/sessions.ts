import { pruneSessionsForFreeTier } from "./storage";
import type { Session } from "./types";

/** Insert or replace a session for a given date, then prune to the free-tier window. */
/**
 * Insert or replace a session for a given date, then prune to the free-tier window.
 * @param sessions Existing sessions.
 * @param next The new session to upsert.
 * @param todayIso Today's date for retention pruning.
 * @returns The updated sessions array.
 */
export function upsertSession(
  sessions: Session[],
  next: Session,
  todayIso: string,
): Session[] {
  const rest = sessions.filter((s) => s.date !== next.date);
  return pruneSessionsForFreeTier([...rest, next], todayIso);
}

/** Check whether a session already exists for the given date. */
/**
 * Check whether a session already exists for the given date.
 * @param sessions Sessions to search.
 * @param date The date to check (YYYY-MM-DD).
 * @returns True if a session exists for that date.
 */
export function hasSessionOnDate(sessions: Session[], date: string): boolean {
  return sessions.some((s) => s.date === date);
}
