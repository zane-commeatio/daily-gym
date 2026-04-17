import { classify } from "./classify";
import {
  countHInLast7,
  getYesterdaySession,
  hardSessionsLast3,
  strengthInLast3,
} from "./history";
import { labelForType } from "./labels";
import type { FatigueToday, Session, SessionType } from "./types";

const ALL_TYPES: SessionType[] = ["S", "A", "H", "R"];

export type StartingPreference = "S" | "A";

export type RecommendResult = {
  allowed: SessionType[];
  /** When true, only easy/light strength is allowed (PRD §6 rule 3). */
  strengthOnlyEasy: boolean;
  ranked: SessionType[];
  primaryLabel: string;
  alternativeLabels: string[];
};

/** Default tie-break order when rule 6 does not prioritize strength (PRD §6.7). */
const DEFAULT_ORDER: SessionType[] = ["A", "S", "H", "R"];

function sortRanked(
  allowed: SessionType[],
  history: Session[],
  startingPreference: StartingPreference | undefined,
  isEmptyHistory: boolean,
): SessionType[] {
  const hasS = allowed.includes("S");
  const hasH = allowed.includes("H");
  const prioritizeS =
    !isEmptyHistory && !strengthInLast3(history) && hasS;
  const prioritizeH =
    !isEmptyHistory && hardSessionsLast3(history) === 0 && hasH;

  const score = (t: SessionType): number => {
    if (prioritizeS && t === "S") return 100;
    if (prioritizeH && t === "H") return 90;
    if (isEmptyHistory && startingPreference) {
      if (t === startingPreference) return 90;
    }
    const idx = DEFAULT_ORDER.indexOf(t);
    return 50 - (idx >= 0 ? idx : 0);
  };

  return [...allowed].sort((a, b) => score(b) - score(a));
}

function buildLabels(
  ranked: SessionType[],
  strengthOnlyEasy: boolean,
): { primary: string; alternatives: string[] } {
  const primary = ranked[0];
  if (!primary) {
    return { primary: "Rest", alternatives: [] };
  }

  const primaryLabel = labelForType(primary);
  const alts = ranked.slice(1, 3).map((t) => labelForType(t));

  if (strengthOnlyEasy && primary === "S") {
    return {
      primary: "Light strength",
      alternatives: alts.map((l, i) =>
        ranked[i + 1] === "S" ? "Light strength" : l,
      ),
    };
  }

  return { primary: primaryLabel, alternatives: alts };
}

/**
 * PRD §6 — rules applied in order; blocking/narrowing is cumulative except rule 1 and 5
 * which replace or heavily constrain the allowed set.
 */
export function recommend(
  history: Session[],
  todayIso: string,
  fatigueToday: FatigueToday,
  options?: {
    startingPreference?: StartingPreference;
    isEmptyHistory?: boolean;
  },
): RecommendResult {
  const startingPreference = options?.startingPreference;
  const isEmptyHistory = options?.isEmptyHistory ?? history.length === 0;
  let allowed = new Set<SessionType>(ALL_TYPES);
  let strengthOnlyEasy = false;

  const yesterday = getYesterdaySession(history, todayIso);

  // 1. Fatigue high → A, R only
  if (fatigueToday === "high") {
    allowed = new Set(["A", "R"]);
    const ranked = sortRanked([...allowed], history, undefined, false);
    const { primary, alternatives } = buildLabels(ranked, false);
    return {
      allowed: [...allowed],
      strengthOnlyEasy: false,
      ranked,
      primaryLabel: primary,
      alternativeLabels: alternatives,
    };
  }

  // 2. Yesterday was H → block H and S
  if (yesterday?.type === "H") {
    allowed.delete("H");
    allowed.delete("S");
  }

  // 3. Yesterday was hard S → block H; allow light S only
  if (
    yesterday?.type === "S" &&
    yesterday &&
    classify(yesterday) === "hard"
  ) {
    allowed.delete("H");
    if (allowed.has("S")) {
      strengthOnlyEasy = true;
    }
  }

  // 4. Count H in last 7 ≥ 2 → block H
  if (countHInLast7(history) >= 2) {
    allowed.delete("H");
  }

  // 5. hardSessionsLast3 ≥ 2 → A, R only
  if (hardSessionsLast3(history) >= 2) {
    allowed = new Set(
      [...allowed].filter((t) => t === "A" || t === "R"),
    ) as Set<SessionType>;
  }

  // Ensure at least rest if everything blocked (shouldn't happen often)
  if (allowed.size === 0) {
    allowed.add("R");
  }

  // Rules 6-7 are ordering only (sortRanked). Rule 8 is implicit in remaining allowed.

  const allowedArr = ALL_TYPES.filter((t) => allowed.has(t));
  const ranked = sortRanked(
    allowedArr,
    history,
    startingPreference,
    isEmptyHistory,
  );
  const { primary, alternatives } = buildLabels(
    ranked,
    strengthOnlyEasy,
  );

  return {
    allowed: allowedArr,
    strengthOnlyEasy,
    ranked,
    primaryLabel: primary,
    alternativeLabels: alternatives.filter(Boolean),
  };
}
