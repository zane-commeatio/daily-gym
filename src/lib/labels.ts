import type { SessionType } from "./types";

const BASE: Record<SessionType, string> = {
  S: "Strength",
  A: "Easy cardio",
  H: "High intensity",
  R: "Rest",
};

export function labelForType(type: SessionType): string {
  return BASE[type];
}
