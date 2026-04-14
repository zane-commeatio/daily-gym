import type { SessionType } from "./types";

const BASE: Record<SessionType, string> = {
  S: "Strength",
  A: "Easy cardio",
  H: "High intensity",
  T: "Tennis",
  R: "Rest",
};

/** User-facing label; use easy tennis when rules present T-A. */
export function labelForType(
  type: SessionType,
  opts?: { tennisEasy?: boolean },
): string {
  if (type === "T" && opts?.tennisEasy) return "Easy tennis";
  return BASE[type];
}
