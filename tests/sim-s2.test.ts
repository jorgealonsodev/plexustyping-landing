import { describe, expect, it } from "vitest";
import { DIAGNOSTIC_SCRIPT, HEAT_SCORES, TARGETS, TARGET_TEXT } from "../src/sim/data/demo";
import { ES_QWERTY } from "../src/sim/data/es-qwerty";
import { HEAT_KEYFRAMES, S2_DIAGNOSTIC, S2_STILL_STEPS, S2_TARGETS, scoresAt, stepAfter } from "../src/sim/data/s2";
import { heatLevel, heatScores } from "../src/sim/keyboard/heat";
import { ReplayDriver, type Script } from "../src/sim/replay";

/** Tint step of every tinted key after `step` replay steps of the diagnostic text, via the app's heat.ts. */
const levelsAt = (step: number) =>
  Object.fromEntries([...heatScores(ES_QWERTY, scoresAt(step))].map(([code, score]) => [code, heatLevel(score)]));

/** The part of a script's text that is typed once its steps ran. */
const typedText = (script: Script, steps = script.steps.length) =>
  [...script.text].slice(0, script.steps.slice(0, steps).reduce((n, s) => n + (s.event.kind === "char" ? 1 : -1), 0)).join("");

describe("S2 recorded heat sequence (app heat.ts levels)", () => {
  it("starts with no tint", () => {
    expect(levelsAt(0)).toEqual({});
  });

  it("tints the keys of the first slow and wrong chars as they are typed", () => {
    expect(levelsAt(stepAfter("qué") - 1)).toEqual({});
    expect(levelsAt(stepAfter("qué"))).toEqual({ KeyQ: 2 });
    expect(levelsAt(stepAfter("pingüino"))).toEqual({ KeyQ: 3, KeyU: 3 });
    expect(levelsAt(stepAfter("Xavier"))).toEqual({ KeyQ: 4, KeyU: 3, KeyX: 3 });
  });

  it("ends the diagnostic with the full model the next text is built from", () => {
    expect(levelsAt(S2_DIAGNOSTIC.steps.length)).toEqual({
      KeyQ: 6,
      KeyU: 3,
      KeyX: 3,
      KeyW: 1,
      KeyK: 1,
      Semicolon: 8,
      KeyZ: 7,
      Equal: 2,
    });
    expect(scoresAt(S2_DIAGNOSTIC.steps.length)).toEqual(HEAT_SCORES);
  });

  it("only ever deepens a key's tint (progressive)", () => {
    let previous: Record<string, number> = {};
    for (const { step } of HEAT_KEYFRAMES) {
      const now = levelsAt(step);
      for (const [code, level] of Object.entries(previous)) expect(now[code] ?? 0).toBeGreaterThanOrEqual(level);
      previous = now;
    }
  });

  it("types the start of the app's diagnostic text, then a text containing every target", () => {
    expect(S2_DIAGNOSTIC.text).toBe(DIAGNOSTIC_SCRIPT.text);
    expect(S2_DIAGNOSTIC.steps.length).toBeLessThan(DIAGNOSTIC_SCRIPT.steps.length);
    expect(S2_TARGETS.text).toBe(TARGET_TEXT);
    for (const unit of TARGETS) expect(TARGET_TEXT).toContain(unit);
    expect(typedText(S2_TARGETS)).toBe("Este verano queremos ir a la montaña con unos amigos.");
    // The still state (no JavaScript, reduced motion) shows the targets text started, not finished.
    expect(typedText(S2_TARGETS, S2_STILL_STEPS)).toBe("Este verano queremos ir a la ");
  });
});

describe("S2 under reduced motion", () => {
  it("never starts on its own", () => {
    let scheduled = 0;
    const driver = new ReplayDriver(S2_DIAGNOSTIC, () => {}, {
      reducedMotion: true,
      clock: { set: () => scheduled++, clear: () => {} },
    });
    expect(driver.autoplay()).toBe(false);
    expect(driver.playing).toBe(false);
    expect(scheduled).toBe(0);
  });
});
