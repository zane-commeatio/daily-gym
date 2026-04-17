export type SessionType = "S" | "A" | "H" | "R";

export type Session = {
  date: string;
  type: SessionType;
  intensity?: "easy" | "hard";
};

export type FatigueToday = "low" | "medium" | "high" | undefined;

export const SESSION_TYPES: SessionType[] = ["S", "A", "H", "R"];
