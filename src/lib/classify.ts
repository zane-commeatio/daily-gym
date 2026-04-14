import type { Session } from "./types";

/** Load classification per PRD §5. */
export function classify(session: Session): "easy" | "hard" {
  if (session.type === "H") return "hard";
  if (session.type === "S" && session.intensity === "hard") return "hard";
  if (session.type === "T" && session.intensity === "hard") return "hard";
  return "easy";
}
