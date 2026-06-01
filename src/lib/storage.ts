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

/**
 * Migrate a legacy "T" (generic training) session to a typed session.
 *
 * The "T" type was used before the app adopted the S/A/H/R model.
 * - Hard intensity → H (high intensity)
 * - Everything else → A (aerobic / easy cardio)
 *
 * This is a one-way migration shim and can be removed once all stored
 * data is guaranteed to use modern types.
 * @param session A session that may have the legacy "T" type.
 * @returns A properly-typed session.
 */
function normalizeSession(session: LegacySession): Session {
  if (session.type !== "T") {
    return session;
  }

  return {
    date: session.date,
    type: session.intensity === "hard" ? "H" : "A",
  };
}

/** Normalize all sessions, migrating any legacy "T" type sessions. */
/**
 * Normalize all sessions, migrating legacy "T" types.
 * @param sessions Raw sessions array from storage (may contain legacy types).
 * @returns All sessions with consistent S/A/H/R typing.
 */
export function normalizeSessions(sessions: unknown[]): Session[] {
  return sessions.map((session) => normalizeSession(session as LegacySession));
}

/** Remove sessions older than the free-tier retention window (14 days). */
/**
 * Remove sessions older than the free-tier window (14 days).
 * @param sessions All sessions to filter.
 * @param todayIso Today's date for cutoff calculation.
 * @returns Sessions within the retention window.
 */
export function pruneSessionsForFreeTier(
  sessions: Session[],
  todayIso: string,
): Session[] {
  const cutoff = addCalendarDays(todayIso, -(RETENTION_DAYS - 1));
  return sessions.filter((s) => s.date >= cutoff);
}

/** Load all sessions from localStorage. */
/**
 * Load all sessions from localStorage.
 * @returns The parsed sessions array, or empty array on failure.
 */
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

/** Persist all sessions to localStorage. */
/**
 * Persist all sessions to localStorage.
 * @param sessions Sessions to save.
 */
export function saveSessions(sessions: Session[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY_SESSIONS, JSON.stringify(sessions));
}

/** Get today's date as YYYY-MM-DD in UTC. */
/**
 * Get today's date as YYYY-MM-DD in UTC.
 * @returns Today's date string.
 */
export function getTodayIso(): string {
  return formatIsoDate(new Date());
}

/** Load the user's starting preference (S or A) from localStorage. */
/**
 * Load the user's starting preference from localStorage.
 * @returns "S", "A", or null if not set.
 */
export function loadStartingPreference(): "S" | "A" | null {
  if (typeof window === "undefined") return null;
  const v = window.localStorage.getItem(STORAGE_KEY_STARTING);
  if (v === "S" || v === "A") return v;
  return null;
}

/** Persist the user's starting preference to localStorage and notify subscribers. */
/**
 * Persist the user's starting preference to localStorage.
 * Dispatches a custom event so other tabs/hooks can react.
 * @param pref The preference to save ("S" or "A").
 */
export function saveStartingPreference(pref: "S" | "A"): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY_STARTING, pref);
  window.dispatchEvent(new Event(STARTING_PREFERENCE_EVENT));
}

/** Subscribe to starting-preference changes from any tab. Returns an unsubscribe function. */
/**
 * Subscribe to starting-preference changes across tabs.
 * @param onChange Callback when the preference changes.
 * @returns An unsubscribe function.
 */
export function subscribeStartingPreference(onChange: () => void): () => void {
  if (typeof window === "undefined") return () => {};

  window.addEventListener("storage", onChange);
  window.addEventListener(STARTING_PREFERENCE_EVENT, onChange);

  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(STARTING_PREFERENCE_EVENT, onChange);
  };
}
