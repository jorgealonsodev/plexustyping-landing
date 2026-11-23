// Prerecorded data of the S1 demo on the English pages (demo): the counterpart of ./demo.ts with the app's
// English corpus (./corpus/en.ts) and the English (US) layout (./us-qwerty.en.ts). Synthetic, never real users.
// - DIAGNOSTIC_TEXT: the app's English diagnostic text.
// - TARGET_TEXT: four corpus sentences that contain the demo targets qu, z and x, joined by spaces as a prose
//   text is: "We are planning…", "Next summer…" from sentences.txt, "Most kids love pizza…" and "Her bright
//   quick eye…" from sentences-cv.txt. The app picks such sentences itself (Rust); here they are a fixed sample.
import type { CharScore } from "../keyboard/heat";
import { buildScript, type Script, type Typo } from "../replay";
import { DIAGNOSTIC, SENTENCES } from "./corpus/en";
import { keySequence } from "./sequences.en";

export const DIAGNOSTIC_TEXT = DIAGNOSTIC;

export const TARGET_TEXT = [SENTENCES.picnic, SENTENCES.pizza, SENTENCES.summer, SENTENCES.quick].join(" ");

/** The weak units the targets text practises ("Practising: qu · z · x"). */
export const TARGETS = ["qu", "z", "x"];

/** Error scores (0..1) per char, as the app's `heatmap` command returns them; drawn by heatScores(). */
export const HEAT_SCORES: CharScore[] = [
  { ch: "x", score: 0.82 },
  { ch: "z", score: 0.68 },
  { ch: "q", score: 0.55 },
  { ch: "u", score: 0.34 },
  { ch: "?", score: 0.26 },
  { ch: "y", score: 0.22 },
  { ch: "j", score: 0.14 },
  { ch: "w", score: 0.1 },
];

/** Labels of the practice text, as the app's sourceLabel() returns them, translated. */
export const DIAGNOSTIC_SOURCE = "Diagnostic text";
export const TARGET_SOURCE = "Local corpus";

/** A typo on the `offset`-th char of the first `word` in `text`. */
function typoIn(text: string, word: string, offset: number, typed: string, corrected: boolean): Typo {
  const at = text.indexOf(word);
  if (at < 0) throw new Error(`demo typo: "${word}" not in text`);
  return { index: [...text.slice(0, at)].length + offset, typed, corrected };
}

/** Shift sequences take a little longer, as they do for a person (the layout has no dead keys). */
const extraMs = (ch: string) => {
  const seq = keySequence(ch);
  if (!seq?.[0]) return 0;
  return (seq.length - 1) * 140 + (seq[0].layer === "normal" ? 0 : 70);
};

export const DIAGNOSTIC_SCRIPT = buildScript(DIAGNOSTIC_TEXT, {
  seed: 20261120,
  wpm: 58,
  extraMs,
  typos: [
    typoIn(DIAGNOSTIC_TEXT, "quick", 1, "y", true),
    typoIn(DIAGNOSTIC_TEXT, "fox", 2, "c", true),
    typoIn(DIAGNOSTIC_TEXT, "lazy", 2, "x", false),
    typoIn(DIAGNOSTIC_TEXT, "keeper", 4, "o", true),
    typoIn(DIAGNOSTIC_TEXT, "waltz", 4, "x", false),
  ].sort((a, b) => a.index - b.index),
});

export const TARGET_SCRIPT = buildScript(TARGET_TEXT, {
  seed: 1129,
  wpm: 62,
  extraMs,
  typos: [
    typoIn(TARGET_TEXT, "quiet", 1, "y", true),
    typoIn(TARGET_TEXT, "pizza", 2, "x", false),
    typoIn(TARGET_TEXT, "Next", 2, "z", true),
    typoIn(TARGET_TEXT, "quick", 0, "w", true),
  ].sort((a, b) => a.index - b.index),
});

/** Steps of `script` after which the cursor first stands right after `prefix`, i.e. `prefix` is typed. */
function stepsToType(script: Script, prefix: string): number {
  const target = [...prefix].length;
  let cursor = 0;
  for (let i = 0; i < script.steps.length; i++) {
    cursor += script.steps[i]?.event.kind === "char" ? 1 : -1;
    if (cursor === target) return i + 1;
  }
  throw new Error("demo: prefix never typed");
}

/** How much of the diagnostic text the replay types before it asks for a new text (F5), in steps. */
export const DIAGNOSTIC_STEPS = stepsToType(DIAGNOSTIC_SCRIPT, DIAGNOSTIC_TEXT.slice(0, DIAGNOSTIC_TEXT.indexOf(";") + 1));

/** The still state (no JavaScript, reduced motion): the targets text typed up to "spend", in steps. */
export const STILL_STEPS = stepsToType(TARGET_SCRIPT, TARGET_TEXT.slice(0, TARGET_TEXT.indexOf("spend")));
