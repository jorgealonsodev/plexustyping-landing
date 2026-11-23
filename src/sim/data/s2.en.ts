// Prerecorded data of the S2 demo on the English pages (demo): the counterpart of ./s2.ts over the S1 English
// texts and scripts (./demo.en.ts). Synthetic, never real users; the keyframes compress into one text what
// the app's `heatmap` command shows after several.
import type { CharScore } from "../keyboard/heat";
import type { Script } from "../replay";
import { DIAGNOSTIC_SCRIPT, DIAGNOSTIC_STEPS, HEAT_SCORES, TARGET_SCRIPT } from "./demo.en";
import type { S2Pack } from "./s2";

/** Steps of `script` after which the cursor first stands right after `prefix` (./s2.ts's stepsToType). */
function stepsToType(script: Script, prefix: string): number {
  const target = [...prefix].length;
  let cursor = 0;
  for (let i = 0; i < script.steps.length; i++) {
    cursor += script.steps[i]?.event.kind === "char" ? 1 : -1;
    if (cursor === target) return i + 1;
  }
  throw new Error("s2: prefix never typed");
}

const stepAfter = (word: string): number => {
  const at = DIAGNOSTIC_SCRIPT.text.indexOf(word);
  if (at < 0) throw new Error(`s2: "${word}" not in the diagnostic text`);
  return stepsToType(DIAGNOSTIC_SCRIPT, DIAGNOSTIC_SCRIPT.text.slice(0, at + word.length));
};

const diagnostic: Script = { ...DIAGNOSTIC_SCRIPT, steps: DIAGNOSTIC_SCRIPT.steps.slice(0, DIAGNOSTIC_STEPS) };

/** The targets text, typed up to "weekend.": "quiet" is typed, the rest is in view. */
const targets: Script = {
  ...TARGET_SCRIPT,
  steps: TARGET_SCRIPT.steps.slice(0, stepsToType(TARGET_SCRIPT, TARGET_SCRIPT.text.slice(0, TARGET_SCRIPT.text.indexOf("weekend.") + 8))),
};

const keyframes: { step: number; scores: CharScore[] }[] = [
  { step: 0, scores: [] },
  // "quick": typed "y" for "u", corrected; the q is slow.
  { step: stepAfter("quick"), scores: [{ ch: "q", score: 0.2 }] },
  // "fox": typed "c" for "x", corrected.
  {
    step: stepAfter("fox"),
    scores: [
      { ch: "q", score: 0.3 },
      { ch: "x", score: 0.3 },
    ],
  },
  // "jumped": a slow j.
  {
    step: stepAfter("jumped"),
    scores: [
      { ch: "q", score: 0.3 },
      { ch: "x", score: 0.3 },
      { ch: "j", score: 0.14 },
    ],
  },
  // "lazy": typed "x" for "z", left wrong.
  {
    step: stepAfter("lazy"),
    scores: [
      { ch: "q", score: 0.4 },
      { ch: "x", score: 0.4 },
      { ch: "z", score: 0.3 },
      { ch: "j", score: 0.14 },
      { ch: "y", score: 0.1 },
    ],
  },
  // Scored: the stored model the next text is built from (the S1 demo's scores).
  { step: DIAGNOSTIC_STEPS, scores: HEAT_SCORES },
];

function scoresAt(step: number): CharScore[] {
  let scores: CharScore[] = [];
  for (const frame of keyframes) if (frame.step <= step) scores = frame.scores;
  return scores;
}

export const S2_EN: S2Pack = {
  diagnostic,
  targets,
  // The still state: the targets text started ("We are planning a "), with the heat and the targets.
  stillSteps: stepsToType(TARGET_SCRIPT, "We are planning a "),
  keyframes,
  scoresAt,
};
