import { describe, expect, it } from "vitest";
import { ES_QWERTY } from "../src/sim/data/es-qwerty";
import { STAGES, STILL_STAGE, UNLOCK_ORDER } from "../src/sim/data/s6";
import { TypingSession } from "../src/sim/practice/engine";
import { ReplayDriver, toInput } from "../src/sim/replay";
import { lockedKeys, progressLine, unlockNotice } from "../src/sim/unlock/unlock";

const LETTER_KEYS = Object.entries(ES_QWERTY.keys)
  .filter(([, k]) => k.normal !== null && /^\p{Ll}$/u.test(k.normal))
  .map(([code]) => code);
const codeOf = (ch: string) => Object.entries(ES_QWERTY.keys).find(([, k]) => k.normal === ch)?.[0];

describe("S6 prerecorded unlock sequence (app unlock.ts)", () => {
  it("follows the app's es-qwerty order: the home row, then e, o, n, r", () => {
    expect(UNLOCK_ORDER.join("")).toBe("fjdkslañgheonri");
    expect(STAGES.map((s) => s.status.active.length)).toEqual([10, 11, 12, 13, 14]);
    expect(STAGES.map((s) => s.unlocks)).toEqual(["e", "o", "n", "r", null]);
  });

  it("words the progress line as the app does", () => {
    expect(STAGES.map((s) => progressLine(s.status))).toEqual([
      "Teclas: 10/27 · siguiente: e",
      "Teclas: 11/27 · siguiente: o",
      "Teclas: 12/27 · siguiente: n",
      "Teclas: 13/27 · siguiente: r",
      "Teclas: 14/27 · siguiente: i",
    ]);
  });

  it("words the notice as the app does", () => {
    expect(STAGES.map((s) => unlockNotice(s.unlocks))).toEqual([
      "Nueva tecla desbloqueada: e",
      "Nueva tecla desbloqueada: o",
      "Nueva tecla desbloqueada: n",
      "Nueva tecla desbloqueada: r",
      null,
    ]);
  });

  it("dims every key but the home row at first", () => {
    const locked = lockedKeys(ES_QWERTY, STAGES[0]!.status);
    const lit = ["KeyA", "KeyS", "KeyD", "KeyF", "KeyG", "KeyH", "KeyJ", "KeyK", "KeyL", "Semicolon", "Space"];
    for (const code of lit) expect(locked.has(code)).toBe(false);
    for (const code of LETTER_KEYS.filter((c) => !lit.includes(c))) expect(locked.has(code)).toBe(true);
    // Digits and signs stay dimmed; keys without chars (Shift, Tab…) stay lit.
    expect(locked.has("Digit1")).toBe(true);
    expect(locked.has("Comma")).toBe(true);
    expect(locked.has("ShiftLeft")).toBe(false);
  });

  it("lights exactly the unlocked key at each stage", () => {
    for (let i = 1; i < STAGES.length; i++) {
      const before = lockedKeys(ES_QWERTY, STAGES[i - 1]!.status);
      const after = lockedKeys(ES_QWERTY, STAGES[i]!.status);
      expect([...before].filter((c) => !after.has(c))).toEqual([codeOf(STAGES[i - 1]!.unlocks!)]);
      expect([...after].every((c) => before.has(c))).toBe(true);
    }
  });

  it("types texts made only of the active letters, each with the newest one", () => {
    for (const [i, stage] of STAGES.entries()) {
      const allowed = new Set([" ", ...stage.status.active]);
      expect([...stage.text].filter((c) => !allowed.has(c))).toEqual([]);
      if (i > 0) expect(stage.text).toContain(STAGES[i - 1]!.unlocks!);
      const session = new TypingSession(stage.text, "backspace-correct");
      for (const step of stage.script.steps) session.apply(toInput(step));
      expect(session.completed).toBe(true);
    }
  });

  it("rests, without JavaScript, on a notice", () => {
    expect(unlockNotice(STAGES[STILL_STAGE]!.unlocks)).toBe("Nueva tecla desbloqueada: e");
  });
});

describe("S6 under reduced motion", () => {
  it("never starts on its own", () => {
    let scheduled = 0;
    const driver = new ReplayDriver(STAGES[0]!.script, () => {}, {
      reducedMotion: true,
      clock: { set: () => scheduled++, clear: () => {} },
    });
    expect(driver.autoplay()).toBe(false);
    expect(scheduled).toBe(0);
  });
});
