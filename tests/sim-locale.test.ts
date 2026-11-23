// S9 of odd/tasks/site-pages.md: on /en every simulation shows English everywhere (the app's interface labels
// translated, English practice text from the app's English corpus, the English (US) layout and its key
// sequences); Spanish pages keep the app's real Spanish UI, texts and layout unchanged.
import { describe, expect, it } from "vitest";
import { DIAGNOSTIC, SENTENCES, WORDS } from "../src/sim/data/corpus/en";
import * as esDemo from "../src/sim/data/demo";
import { ES_QWERTY } from "../src/sim/data/es-qwerty";
import { DEMO_PACKS } from "../src/sim/data/s1";
import { HEAT_KEYFRAMES, S2_DIAGNOSTIC, S2_PACKS, S2_STILL_STEPS, S2_TARGETS } from "../src/sim/data/s2";
import { S3_PACKS, SEGMENTS, SEGMENT_SCRIPTS, UnlimitedDemo } from "../src/sim/data/s3";
import { GHOST, GHOST_TEXT, GhostDemo, RACE_SCRIPT, S4_PACKS, STILL_STEPS as S4_STILL } from "../src/sim/data/s4";
import { TypingSession } from "../src/sim/practice/engine";
import { toInput } from "../src/sim/replay";
import { S5_TEXTS, TEXT as S5_TEXT } from "../src/sim/data/s5";
import { STAGES as ES_STAGES, UNLOCK_ORDER as ES_ORDER } from "../src/sim/data/s6";
import { STAGES as EN_STAGES, UNLOCK_ORDER as EN_ORDER } from "../src/sim/data/s6.en";
import { S7_SAMPLES, SAMPLE, STATES, TYPED } from "../src/sim/data/s7";
import { sequencesFor as esSequences } from "../src/sim/data/sequences";
import { sequencesFor as enSequences } from "../src/sim/data/sequences.en";
import { US_QWERTY } from "../src/sim/data/us-qwerty.en";
import { KEYBOARD_UI, PRACTICE_UI, RESULTS_UI } from "../src/sim/i18n/app";
import { UNLIMITED_UI } from "../src/sim/i18n/s3";
import { GHOST_UI } from "../src/sim/i18n/s4";
import { METRONOME_UI } from "../src/sim/i18n/s5";
import { UNLOCK_UI } from "../src/sim/i18n/s6";
import { SETTINGS_UI } from "../src/sim/i18n/s7";
import { NAMED_LABELS } from "../src/sim/keyboard/geometry";
import { HEAT_LEGEND_TITLE } from "../src/sim/keyboard/heat";
import { keyForChar } from "../src/sim/keyboard/keys";
import { SOUNDS, tempoNotice } from "../src/sim/metronome/beat";
import { CURSOR_SETTING } from "../src/sim/personalize/cursor";
import { FONT_SETTING } from "../src/sim/personalize/fonts";
import { formatPercent } from "../src/sim/practice/format";
import { NEW_RECORD, formatDelta, recordLines } from "../src/sim/practice/ghost";
import { typingHint } from "../src/sim/data/s3";
import { progressLine, unlockNotice } from "../src/sim/unlock/unlock";

const SENTENCE_LIST: string[] = Object.values(SENTENCES);
/** `text` is made of whole English corpus sentences joined by single spaces. */
const fromSentences = (text: string) => {
  let rest = text;
  while (rest) {
    const s = SENTENCE_LIST.find((x) => rest === x || rest.startsWith(`${x} `));
    if (!s) return false;
    rest = rest.slice(s.length).trimStart();
  }
  return true;
};
const fromWords = (text: string) => text.split(" ").every((w) => (WORDS as readonly string[]).includes(w));

/** Every English text a simulation types, with where it comes from. */
const EN_TEXTS: [string, string][] = [
  ["S1/S2 diagnostic", DEMO_PACKS.en.diagnosticText],
  ["S1/S2 targets", DEMO_PACKS.en.targetText],
  ["S3 unlimited", S3_PACKS.en.segments.join("")],
  ["S4 ghost", S4_PACKS.en.text],
  ["S5 metronome", S5_TEXTS.en],
  ["S7 personalisation", S7_SAMPLES.en.sample],
  ...EN_STAGES.map((s, i): [string, string] => [`S6 stage ${i}`, s.text]),
];

/** A string with Spanish-only letters or signs. */
const SPANISH = /[ñáéíóúü¿¡]/i;

describe("English pages: the English (US) layout of the app", () => {
  it("is the app's us-qwerty: ANSI, no dead keys, US punctuation", () => {
    expect(US_QWERTY.id).toBe("us-qwerty");
    expect(US_QWERTY.name).toBe("English (US)");
    expect(US_QWERTY.deadKeys).toEqual([]);
    expect(US_QWERTY.keys.Semicolon).toEqual({ normal: ";", shift: ":", altgr: null });
    expect(US_QWERTY.keys.Quote).toEqual({ normal: "'", shift: '"', altgr: null });
    expect(US_QWERTY.keys.Slash).toEqual({ normal: "/", shift: "?", altgr: null });
    expect("IntlBackslash" in US_QWERTY.keys).toBe(false);
  });

  it("gives the presses of the app's key_sequences on that layout", () => {
    expect(enSequences("?A ;")).toEqual([
      [{ code: "Slash", layer: "shift" }],
      [{ code: "KeyA", layer: "shift" }],
      [{ code: "Space", layer: "normal" }],
      [{ code: "Semicolon", layer: "normal" }],
    ]);
  });

  it.each(EN_TEXTS)("%s is typeable on it, one press per char", (_, text) => {
    for (const seq of enSequences(text)) expect(seq?.length).toBe(1);
  });

  it("S1, S2 and S6 draw and flash it", () => {
    expect(DEMO_PACKS.en.layout).toBe(US_QWERTY);
    expect(DEMO_PACKS.en.sequencesFor).toBe(enSequences);
    expect(keyForChar(US_QWERTY, "?")).toBe("Slash");
  });
});

describe("English pages: practice text from the app's English corpus", () => {
  it("S1/S2 type the English diagnostic text, then corpus sentences with every target", () => {
    expect(DEMO_PACKS.en.diagnosticText).toBe(DIAGNOSTIC);
    expect(fromSentences(DEMO_PACKS.en.targetText)).toBe(true);
    for (const unit of DEMO_PACKS.en.targets) expect(DEMO_PACKS.en.targetText).toContain(unit);
    expect(DEMO_PACKS.en.targets).toEqual(["qu", "z", "x"]);
  });

  it("S3 and S4 type corpus sentences; S5, S6 and S7 corpus words or sentences", () => {
    expect(fromSentences(S3_PACKS.en.segments.join(""))).toBe(true);
    expect(fromSentences(S4_PACKS.en.text)).toBe(true);
    expect(fromWords(S5_TEXTS.en)).toBe(true);
    expect(fromSentences(S7_SAMPLES.en.sample)).toBe(true);
    for (const stage of EN_STAGES) expect(fromWords(stage.text), stage.text).toBe(true);
  });

  it.each(EN_TEXTS)("%s is English (no Spanish letters or signs)", (_, text) => {
    expect(text).not.toMatch(SPANISH);
  });

  it("S2 tints the keys the English diagnostic stumbles on, up to the full model", () => {
    const en = S2_PACKS.en;
    const last = en.keyframes.at(-1);
    expect(last?.scores).toEqual(DEMO_PACKS.en.heatScores);
    expect(last?.step).toBe(en.diagnostic.steps.length);
    expect(en.scoresAt(0)).toEqual([]);
    expect(en.scoresAt(en.diagnostic.steps.length).length).toBeGreaterThan(0);
  });

  it("S3 and S4 play the English texts; the English race beats its record", () => {
    expect(new UnlimitedDemo({ reducedMotion: true, pack: S3_PACKS.en }).session.chars.join("")).toBe(S3_PACKS.en.start);
    const ghost = new GhostDemo({ reducedMotion: true, pack: S4_PACKS.en, recordLines: GHOST_UI.en.recordLines });
    expect(ghost.session.chars.join("")).toBe(S4_PACKS.en.text);
    const race = new TypingSession(S4_PACKS.en.text, "backspace-correct");
    for (const step of S4_PACKS.en.race.steps) race.apply(toInput(step));
    expect(GHOST_UI.en.recordLines(S4_PACKS.en.ghost.netWpm, race.result().stats.netWpm, true)).toEqual([
      "Previous record: 63 WPM",
      "New record for this text!",
    ]);
  });

  it("S6 follows the app's en / us-qwerty unlock order (home row without ';', then corpus frequency)", () => {
    expect(EN_ORDER.join("")).toBe("fjdkslaghetoinrucmwypbvxqz");
    expect(EN_STAGES[0]?.status.active.join("")).toBe("fjdkslagh");
    expect(EN_STAGES.map((s) => s.unlocks)).toEqual(["e", "t", "o", "i", null]);
    EN_STAGES.forEach((stage) => {
      const allowed = new Set([" ", ...stage.status.active]);
      for (const ch of stage.text) expect(allowed.has(ch), `${ch} in "${stage.text}"`).toBe(true);
    });
  });
});

describe("English pages: the app's interface labels translated", () => {
  it("practice screen and results", () => {
    expect(PRACTICE_UI.en).toMatchObject({ wpm: "WPM", accuracy: "Accuracy", time: "Time", practising: "Practicing:" });
    expect(PRACTICE_UI.en.percent(0.905)).toBe("90.5%");
    expect(RESULTS_UI.en).toMatchObject({ title: "Result", netWpm: "Net WPM", noFailed: "No mistakes.", enter: "Enter" });
    expect(DEMO_PACKS.en.diagnosticSource).toBe("Diagnostic text");
    expect(DEMO_PACKS.en.targetSource).toBe("Local corpus");
  });

  it("keyboard names and heatmap legend", () => {
    expect(KEYBOARD_UI.en.names).toMatchObject({ Enter: "Enter", CapsLock: "Caps Lock", ShiftLeft: "Shift", AltRight: "Alt" });
    expect(KEYBOARD_UI.en.legendTitle).toBe("Errors per key");
    expect(KEYBOARD_UI.en.legendNames).toHaveLength(5);
  });

  it("ghost, unlimited text, metronome, unlock and settings lines", () => {
    expect(GHOST_UI.en.delta(1240)).toBe("+1.2 s");
    expect(GHOST_UI.en.delta(-800)).toBe("−0.8 s");
    expect(GHOST_UI.en.recordLines(63, 70, true)).toEqual(["Previous record: 63 WPM", "New record for this text!"]);
    expect(UNLIMITED_UI.en.generating).toBe("Generating more text…");
    expect(UNLIMITED_UI.en.hint(true, false, true)).toBe("Esc end · F4 metronome · F6 menu");
    expect(METRONOME_UI.en.tempoNotice({ from: 100, to: 105 })).toBe("Tempo: 100 → 105 BPM");
    expect(METRONOME_UI.en.tempoNotice({ from: 100, to: 100 })).toBe("Tempo: stays at 100 BPM");
    expect(METRONOME_UI.en.sounds).toEqual({ click: "Click", wood: "Wood", beep: "Beep" });
    expect(UNLOCK_UI.en.progressLine(EN_STAGES[0]!.status)).toBe("Keys: 9/26 · next: e");
    expect(UNLOCK_UI.en.notice("e")).toBe("New key unlocked: e");
    expect(SETTINGS_UI.en.title).toBe("Settings");
    expect(SETTINGS_UI.en.cursorStyles).toEqual({ bar: "Bar", highlight: "Highlight", block: "Block", underline: "Underline", outline: "Outline" });
  });

  it.each([
    ["practice", PRACTICE_UI.en],
    ["results", RESULTS_UI.en],
    ["keyboard", KEYBOARD_UI.en],
    ["settings", SETTINGS_UI.en],
  ])("%s labels have no Spanish letters", (_, ui) => {
    // The shown strings (values), not the internal keys (e.g. the app's font group ids).
    const shown = (v: unknown): string[] =>
      typeof v === "string" ? [v] : v && typeof v === "object" ? Object.values(v).flatMap(shown) : [];
    for (const text of shown(ui)) expect(text).not.toMatch(SPANISH);
  });
});

describe("Spanish pages keep the app's real Spanish UI, texts and layout (unchanged)", () => {
  it("S1: the Spanish demo data and es-qwerty", () => {
    const es = DEMO_PACKS.es;
    expect(es.layout).toBe(ES_QWERTY);
    expect(es.sequencesFor).toBe(esSequences);
    expect(es.diagnosticScript).toBe(esDemo.DIAGNOSTIC_SCRIPT);
    expect(es.targetScript).toBe(esDemo.TARGET_SCRIPT);
    expect(es.stillSteps).toBe(esDemo.STILL_STEPS);
    expect(es.targets).toEqual(["ñ", "qu", "z"]);
  });

  it("S2: the Spanish scripts and heat keyframes", () => {
    expect(S2_PACKS.es.diagnostic).toBe(S2_DIAGNOSTIC);
    expect(S2_PACKS.es.targets).toBe(S2_TARGETS);
    expect(S2_PACKS.es.stillSteps).toBe(S2_STILL_STEPS);
    expect(S2_PACKS.es.keyframes).toBe(HEAT_KEYFRAMES);
  });

  it("S3: the Spanish segments and scripts", () => {
    expect(S3_PACKS.es.segments).toBe(SEGMENTS);
    expect(S3_PACKS.es.segmentScripts).toBe(SEGMENT_SCRIPTS);
    expect(SEGMENTS[0]).toMatch(/^Esta mañana he desayunado/);
  });

  it("S4: the Spanish text, record and race", () => {
    expect(S4_PACKS.es).toMatchObject({ text: GHOST_TEXT, ghost: GHOST, race: RACE_SCRIPT, stillSteps: S4_STILL });
    expect(GHOST_TEXT).toMatch(/^Hemos plantado tomates/);
  });

  it("S5 and S7: the Spanish texts", () => {
    expect(S5_TEXTS.es).toBe(S5_TEXT);
    expect(S5_TEXT).toBe("ritmo constante");
    expect(S7_SAMPLES.es).toEqual({ sample: SAMPLE, states: STATES, typed: TYPED });
  });

  it("S6: the Spanish order and texts", () => {
    expect(ES_ORDER.join("")).toBe("fjdkslañgheonri");
    expect(ES_STAGES.map((s) => s.text)).toEqual([
      "la sala da salsa a las hadas",
      "el hada desea la seda de jade",
      "el oso halla dos hojas del lago",
      "los enanos llegan a la fonda del lago",
      "ella regala rosas rojas a la rana",
    ]);
    expect(ES_STAGES.map((s) => s.unlocks)).toEqual(["e", "o", "n", "r", null]);
  });

  it("the app's UI strings are the copied app code's own", () => {
    expect(PRACTICE_UI.es.percent).toBe(formatPercent);
    expect(PRACTICE_UI.es).toMatchObject({ wpm: "PPM", kpm: "Pulsaciones/min", practising: "Practicando:", localCorpus: "Corpus local" });
    expect(RESULTS_UI.es).toMatchObject({ title: "Resultado", failed: "Caracteres fallados:", enter: "Intro" });
    expect(KEYBOARD_UI.es.names).toBe(NAMED_LABELS);
    expect(KEYBOARD_UI.es.legendTitle).toBe(HEAT_LEGEND_TITLE);
    expect(GHOST_UI.es).toMatchObject({ delta: formatDelta, recordLines, newRecord: NEW_RECORD });
    expect(UNLIMITED_UI.es.hint).toBe(typingHint);
    expect(METRONOME_UI.es.tempoNotice).toBe(tempoNotice);
    expect(METRONOME_UI.es.sounds).toEqual(Object.fromEntries(SOUNDS.map((s) => [s.id, s.label])));
    expect(METRONOME_UI.es.toggle(100)).toBe("Ajustes rápidos del metrónomo: 100 BPM");
    expect(UNLOCK_UI.es).toMatchObject({ progressLine, notice: unlockNotice });
    expect(SETTINGS_UI.es.font).toBe(FONT_SETTING);
    expect(SETTINGS_UI.es.cursor).toBe(CURSOR_SETTING);
  });
});
