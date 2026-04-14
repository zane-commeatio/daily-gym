import { classify } from "./classify";
import { calendarDaysBetween } from "./dates";
import type { Session } from "./types";

/**
 * Normalize to engine input: last 7 calendar days relative to `todayIso`, newest first,
 * at most one row per day (latest wins).
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

export function getYesterdaySession(
  history: Session[],
  todayIso: string,
): Session | undefined {
  const y = history.find((s) => calendarDaysBetween(s.date, todayIso) === 1);
  return y;
}

export function countHInLast7(history: Session[]): number {
  return history.filter((s) => s.type === "H").length;
}

export function hardSessionsLast3(history: Session[]): number {
  return history.slice(0, 3).filter((s) => classify(s) === "hard").length;
}

export function strengthInLast3(history: Session[]): boolean {
  return history.slice(0, 3).some((s) => s.type === "S");
}
