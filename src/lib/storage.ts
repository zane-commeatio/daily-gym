import { addCalendarDays, formatIsoDate } from "./dates";
import type { Session } from "./types";

export const STORAGE_KEY_SESSIONS = "daily-gym-sessions";
export const STORAGE_KEY_STARTING = "daily-gym-starting-preference";

const RETENTION_DAYS = 14;
const STARTING_PREFERENCE_EVENT = "daily-gym-starting-preference-change";

type LegacySession = Session | {
  date: string;
  type: "T";
  intensity?: "easy" | "hard";
};

function normalizeSession(session: LegacySession): Session {
  if (session.type !== "T") {
    return session;
  }

  return {
    date: session.date,
    type: session.intensity === "hard" ? "H" : "A",
  };
}

export function normalizeSessions(sessions: unknown[]): Session[] {
  return sessions.map((session) => normalizeSession(session as LegacySession));
}

export function pruneSessionsForFreeTier(
  sessions: Session[],
  todayIso: string,
): Session[] {
  const cutoff = addCalendarDays(todayIso, -(RETENTION_DAYS - 1));
  return sessions.filter((s) => s.date >= cutoff);
}

export function loadSessions(): Session[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY_SESSIONS);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return normalizeSessions(parsed);
  } catch {
    return [];
  }
}

export function saveSessions(sessions: Session[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY_SESSIONS, JSON.stringify(sessions));
}

export function getTodayIso(): string {
  return formatIsoDate(new Date());
}

export function loadStartingPreference(): "S" | "A" | null {
  if (typeof window === "undefined") return null;
  const v = window.localStorage.getItem(STORAGE_KEY_STARTING);
  if (v === "S" || v === "A") return v;
  return null;
}

export function saveStartingPreference(pref: "S" | "A"): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY_STARTING, pref);
  window.dispatchEvent(new Event(STARTING_PREFERENCE_EVENT));
}

export function subscribeStartingPreference(onChange: () => void): () => void {
  if (typeof window === "undefined") return () => {};

  window.addEventListener("storage", onChange);
  window.addEventListener(STARTING_PREFERENCE_EVENT, onChange);

  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(STARTING_PREFERENCE_EVENT, onChange);
  };
}
