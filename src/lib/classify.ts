import type { Session } from "./types";

/** Load classification per PRD §5. */
/** Classify a session's load as easy or hard per PRD §5. */
/**
 * Classify a session's load as easy or hard per PRD §5.
 * @param session The session to classify.
 * @returns "hard" for HIIT (H) or hard strength, "easy" otherwise.
 */
export function classify(session: Session): "easy" | "hard" {
  if (session.type === "H") return "hard";
  if (session.type === "S" && session.intensity === "hard") return "hard";
  return "easy";
}
