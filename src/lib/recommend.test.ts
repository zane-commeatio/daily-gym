import { describe, expect, it } from "vitest";
import { buildHistory } from "./history";
import { recommend } from "./recommend";
import type { Session } from "./types";

const today = "2026-04-14";

function h(date: string, type: Session["type"], intensity?: "easy" | "hard"): Session {
  return { date, type, intensity };
}

describe("recommend", () => {
  it("rule 1: fatigue high → A and R only", () => {
    const hist = buildHistory([h("2026-04-13", "S", "easy")], today);
    const r = recommend(hist, today, "high");
    expect(r.allowed.sort()).toEqual(["A", "R"].sort());
    expect(r.ranked[0]).toBe("A");
  });

  it("rule 2: yesterday H → block H and S", () => {
    const hist = buildHistory([h("2026-04-13", "H")], today);
    const r = recommend(hist, today, undefined);
    expect(r.allowed).not.toContain("H");
    expect(r.allowed).not.toContain("S");
    expect(r.suggestTennisEasy).toBe(true);
  });

  it("rule 3: yesterday hard S → block H; light S ok", () => {
    const hist = buildHistory([h("2026-04-13", "S", "hard")], today);
    const r = recommend(hist, today, undefined);
    expect(r.allowed).not.toContain("H");
    expect(r.strengthOnlyEasy).toBe(true);
  });

  it("rule 4: ≥2 H in last 7 → block H", () => {
    const hist = buildHistory(
      [h("2026-04-13", "A"), h("2026-04-12", "H"), h("2026-04-11", "H")],
      today,
    );
    const r = recommend(hist, today, undefined);
    expect(r.allowed).not.toContain("H");
  });

  it("rule 5: ≥2 hard in last 3 → A and R only", () => {
    const hist = buildHistory(
      [h("2026-04-13", "H"), h("2026-04-12", "S", "hard")],
      today,
    );
    const r = recommend(hist, today, undefined);
    expect(r.allowed.sort()).toEqual(["A", "R"].sort());
  });

  it("rule 6: no S in last 3 → prioritize S in ranking", () => {
    const hist = buildHistory(
      [h("2026-04-13", "A"), h("2026-04-12", "A")],
      today,
    );
    const r = recommend(hist, today, undefined);
    expect(r.allowed).toContain("S");
    expect(r.ranked[0]).toBe("S");
  });

  it("rule 7: no hard in last 3 → prioritize H when allowed", () => {
    const hist = buildHistory([h("2026-04-13", "S", "easy")], today);
    const r = recommend(hist, today, undefined);
    expect(r.allowed).toContain("H");
    expect(r.ranked[0]).toBe("H");
  });

  it("rule 7: when both S and H are due, S ranks first", () => {
    const hist = buildHistory([h("2026-04-13", "A"), h("2026-04-12", "A")], today);
    const r = recommend(hist, today, undefined);
    expect(r.allowed).toContain("S");
    expect(r.allowed).toContain("H");
    expect(r.ranked[0]).toBe("S");
    expect(r.ranked[1]).toBe("H");
  });

  it("rule 7: does not promote H when earlier rules block it", () => {
    const fromYesterdayH = recommend(
      buildHistory([h("2026-04-13", "H")], today),
      today,
      undefined,
    );
    expect(fromYesterdayH.allowed).not.toContain("H");

    const fromHardStrengthYesterday = recommend(
      buildHistory([h("2026-04-13", "S", "hard")], today),
      today,
      undefined,
    );
    expect(fromHardStrengthYesterday.allowed).not.toContain("H");
  });

  it("empty history: starting preference biases order", () => {
    const hist = buildHistory([], today);
    const rS = recommend(hist, today, undefined, {
      isEmptyHistory: true,
      startingPreference: "S",
    });
    expect(rS.ranked[0]).toBe("S");
    const rA = recommend(hist, today, undefined, {
      isEmptyHistory: true,
      startingPreference: "A",
    });
    expect(rA.ranked[0]).toBe("A");
  });
});
