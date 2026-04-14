import { pruneSessionsForFreeTier } from "./storage";
import type { Session } from "./types";

export function upsertSession(
  sessions: Session[],
  next: Session,
  todayIso: string,
): Session[] {
  const rest = sessions.filter((s) => s.date !== next.date);
  return pruneSessionsForFreeTier([...rest, next], todayIso);
}

export function hasSessionOnDate(sessions: Session[], date: string): boolean {
  return sessions.some((s) => s.date === date);
}
