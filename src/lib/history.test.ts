import { describe, expect, it } from "vitest";
import { buildHistory } from "./history";
import type { Session } from "./types";

describe("buildHistory", () => {
  it("keeps last 7 calendar days, newest first, one per day", () => {
    const sessions: Session[] = [
      { date: "2026-04-10", type: "A" },
      { date: "2026-04-12", type: "H" },
      { date: "2026-04-12", type: "S", intensity: "easy" },
    ];
    const h = buildHistory(sessions, "2026-04-14");
    expect(h.map((x) => x.date)).toEqual(["2026-04-12", "2026-04-10"]);
    expect(h[0].type).toBe("S");
  });
});
