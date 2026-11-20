import { describe, expect, it } from "vitest";
import { ES_QWERTY } from "../src/sim/data/es-qwerty";
import { KEY_SEQUENCES, sequencesFor } from "../src/sim/data/sequences";
import { DIAGNOSTIC_TEXT, TARGET_TEXT } from "../src/sim/data/demo";
import { locate } from "../src/sim/keyboard/locate";

// Expected presses read from the app's layouts/es-qwerty.toml (app commit 14f64cf):
// [keys.Equal] shift = "¿"; [keys.Semicolon] normal = "ñ"; [keys.Quote] normal = "´" (dead key)
// then [keys.KeyU] normal = "u"; [keys.KeyQ] shift = "Q".
describe("precomputed key sequences of the es-qwerty layout", () => {
  it.each([
    ["¿", [{ code: "Equal", layer: "shift" }]],
    ["ñ", [{ code: "Semicolon", layer: "normal" }]],
    ["ú", [{ code: "Quote", layer: "normal" }, { code: "KeyU", layer: "normal" }]],
    ["Q", [{ code: "KeyQ", layer: "shift" }]],
    ["ü", [{ code: "Quote", layer: "shift" }, { code: "KeyU", layer: "normal" }]],
    [" ", [{ code: "Space", layer: "normal" }]],
  ])("%s", (ch, presses) => {
    expect(KEY_SEQUENCES[ch]).toEqual(presses);
  });

  it("matches the port of the app's Layout::locate for every char of the demo texts", () => {
    for (const ch of new Set([...DIAGNOSTIC_TEXT, ...TARGET_TEXT])) expect(KEY_SEQUENCES[ch], ch).toEqual(locate(ES_QWERTY, ch));
  });

  it("covers every char of the demo texts, one entry per char", () => {
    const seqs = sequencesFor(DIAGNOSTIC_TEXT);
    expect(seqs).toHaveLength([...DIAGNOSTIC_TEXT].length);
    expect(seqs.every((s) => s !== null)).toBe(true);
  });

  it("a dead key alone is not typeable, as in the app", () => {
    expect(locate(ES_QWERTY, "´")).toBeNull();
    expect(locate(ES_QWERTY, "¨")).toBeNull();
  });
});

describe("locate port against the app's own Rust test (key_sequences_locates_each_char_once_as_camel_case_json)", () => {
  it("aÁ@¨", () => {
    expect([..."aÁ@¨"].map((ch) => locate(ES_QWERTY, ch))).toEqual([
      [{ code: "KeyA", layer: "normal" }],
      [{ code: "Quote", layer: "normal" }, { code: "KeyA", layer: "shift" }],
      [{ code: "Digit2", layer: "altgr" }],
      null,
    ]);
  });
});
