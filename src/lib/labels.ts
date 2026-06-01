import type { SessionType } from "./types";

const BASE: Record<SessionType, string> = {
  S: "Strength",
  A: "Easy cardio",
  H: "High intensity",
  R: "Rest",
};

/**
 * Human-readable label for a session type.
 * @param type The session type.
 * @returns The label string (e.g. "Strength", "Rest").
 */
export function labelForType(type: SessionType): string {
  return BASE[type];
}
