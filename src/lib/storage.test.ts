import { describe, expect, it } from "vitest";
import { normalizeSessions } from "./storage";

describe("normalizeSessions", () => {
  it("maps legacy tennis sessions into general workout types", () => {
    expect(
      normalizeSessions([
        { date: "2026-04-13", type: "T", intensity: "easy" },
        { date: "2026-04-12", type: "T", intensity: "hard" },
        { date: "2026-04-11", type: "T" },
        { date: "2026-04-10", type: "S", intensity: "easy" },
      ]),
    ).toEqual([
      { date: "2026-04-13", type: "A" },
      { date: "2026-04-12", type: "H" },
      { date: "2026-04-11", type: "A" },
      { date: "2026-04-10", type: "S", intensity: "easy" },
    ]);
  });
});
