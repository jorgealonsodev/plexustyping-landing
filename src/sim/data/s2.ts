// Prerecorded data of the S2 demo, "Tus puntos débiles" (demostración). It reuses the S1 demo's texts and
// keystroke scripts (./demo.ts) and adds the heat scores as they grow while the diagnostic text is typed.
// Synthetic, never real users. In the app the `heatmap` command is read again after each text; the demo
// compresses that into keyframes during one text, so the tint can be seen growing in a few seconds.
// English pages: S2_PACKS.en, from the S1 English data (./demo.en.ts) and its own keyframes (./s2.en.ts).
import type { Locale } from "../../i18n/paths";
import type { CharScore } from "../keyboard/heat";
import type { Script } from "../replay";
import { DIAGNOSTIC_SCRIPT, DIAGNOSTIC_STEPS, HEAT_SCORES, TARGET_SCRIPT } from "./demo";
import { S2_EN } from "./s2.en";

/** Steps of `script` after which the cursor first stands right after `prefix`, i.e. `prefix` is typed. */
function stepsToType(script: Script, prefix: string): number {
  const target = [...prefix].length;
  let cursor = 0;
  for (let i = 0; i < script.steps.length; i++) {
    cursor += script.steps[i]?.event.kind === "char" ? 1 : -1;
    if (cursor === target) return i + 1;
  }
  throw new Error("s2: prefix never typed");
}

/** The diagnostic text, typed up to "fuego;" (as in the hero), then the app asks for a new text. */
export const S2_DIAGNOSTIC: Script = { ...DIAGNOSTIC_SCRIPT, steps: DIAGNOSTIC_SCRIPT.steps.slice(0, DIAGNOSTIC_STEPS) };

/** Steps of the diagnostic replay after which `word` (its first occurrence) is typed. */
export const stepAfter = (word: string): number => {
  const at = DIAGNOSTIC_SCRIPT.text.indexOf(word);
  if (at < 0) throw new Error(`s2: "${word}" not in the diagnostic text`);
  return stepsToType(DIAGNOSTIC_SCRIPT, DIAGNOSTIC_SCRIPT.text.slice(0, at + word.length));
};

/** The targets text, typed up to "amigos.": "queremos" and "montaña" are typed, the rest is in view. */
export const S2_TARGETS: Script = {
  ...TARGET_SCRIPT,
  steps: TARGET_SCRIPT.steps.slice(0, stepsToType(TARGET_SCRIPT, TARGET_SCRIPT.text.slice(0, TARGET_SCRIPT.text.indexOf("amigos.") + 7))),
};

/** The still state (no JavaScript, reduced motion): the targets text started, the targets and the heat shown. */
export const S2_STILL_STEPS = stepsToType(TARGET_SCRIPT, "Este verano queremos ir a la ");

/** Error scores (0..1) per char after `step` steps of the diagnostic replay, ascending by step. */
export const HEAT_KEYFRAMES: { step: number; scores: CharScore[] }[] = [
  { step: 0, scores: [] },
  // "qué": the dead key and the q are slow.
  { step: stepAfter("qué"), scores: [{ ch: "q", score: 0.2 }] },
  // "pingüino": typed "u" for "ü", corrected.
  {
    step: stepAfter("pingüino"),
    scores: [
      { ch: "q", score: 0.3 },
      { ch: "ü", score: 0.3 },
    ],
  },
  // "Xavier": a slow Shift + x.
  {
    step: stepAfter("Xavier"),
    scores: [
      { ch: "q", score: 0.4 },
      { ch: "ü", score: 0.3 },
      { ch: "x", score: 0.26 },
    ],
  },
  // "kiwi": typed "e" for "w", corrected.
  {
    step: stepAfter("kiwi"),
    scores: [
      { ch: "q", score: 0.45 },
      { ch: "ü", score: 0.3 },
      { ch: "x", score: 0.26 },
      { ch: "k", score: 0.14 },
      { ch: "w", score: 0.1 },
    ],
  },
  // Scored: the stored model the next text is built from (the S1 demo's scores, with ñ and z from earlier sessions).
  { step: DIAGNOSTIC_STEPS, scores: HEAT_SCORES },
];

/** The scores of the last keyframe reached after `step` steps. */
export function scoresAt(step: number): CharScore[] {
  let scores: CharScore[] = [];
  for (const frame of HEAT_KEYFRAMES) if (frame.step <= step) scores = frame.scores;
  return scores;
}

/** One language's S2 data: the scripts it plays, its still state and its heat keyframes. */
export interface S2Pack {
  diagnostic: Script;
  targets: Script;
  stillSteps: number;
  keyframes: { step: number; scores: CharScore[] }[];
  scoresAt: (step: number) => CharScore[];
}

export const S2_PACKS: Record<Locale, S2Pack> = {
  es: { diagnostic: S2_DIAGNOSTIC, targets: S2_TARGETS, stillSteps: S2_STILL_STEPS, keyframes: HEAT_KEYFRAMES, scoresAt },
  en: S2_EN,
};
