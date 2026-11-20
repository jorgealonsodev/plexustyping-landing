// Prerecorded data of the S1 demo (demostración): the two texts' keystroke scripts, the targets and the
// heat scores the app's Rust core would compute after the diagnostic text. Synthetic, never real users.
import type { CharScore } from "../keyboard/heat";
import { buildScript, type Script, type Typo } from "../replay";
import { KEY_SEQUENCES } from "./sequences";
import { DIAGNOSTIC_TEXT, TARGET_TEXT } from "./texts";

export { DIAGNOSTIC_TEXT, TARGET_TEXT };

/** The weak units the targets text practises, as the app shows them ("Practicando: ñ · qu · z"). */
export const TARGETS = ["ñ", "qu", "z"];

/** Error scores (0..1) per char, as the app's `heatmap` command returns them; drawn by heatScores(). */
export const HEAT_SCORES: CharScore[] = [
  { ch: "ñ", score: 0.82 },
  { ch: "z", score: 0.68 },
  { ch: "q", score: 0.55 },
  { ch: "u", score: 0.34 },
  { ch: "ü", score: 0.3 },
  { ch: "x", score: 0.26 },
  { ch: "¿", score: 0.22 },
  { ch: "k", score: 0.14 },
  { ch: "w", score: 0.1 },
];

/** Labels of the practice text, as the app's sourceLabel() returns them. */
export const DIAGNOSTIC_SOURCE = "Texto de diagnóstico";
export const TARGET_SOURCE = "Corpus local";

/** A typo on the `offset`-th char of the first `word` in `text`. */
function typoIn(text: string, word: string, offset: number, typed: string, corrected: boolean): Typo {
  const at = text.indexOf(word);
  if (at < 0) throw new Error(`demo typo: "${word}" not in text`);
  return { index: [...text.slice(0, at)].length + offset, typed, corrected };
}

/** Shift and dead-key sequences take a little longer, as they do for a person. */
const extraMs = (ch: string) => {
  const seq = KEY_SEQUENCES[ch];
  if (!seq?.[0]) return 0;
  return (seq.length - 1) * 140 + (seq[0].layer === "normal" ? 0 : 70);
};

export const DIAGNOSTIC_SCRIPT = buildScript(DIAGNOSTIC_TEXT, {
  seed: 20261120,
  wpm: 58,
  extraMs,
  typos: [
    typoIn(DIAGNOSTIC_TEXT, "pingüino", 4, "u", true),
    typoIn(DIAGNOSTIC_TEXT, "kiwi", 2, "e", true),
    typoIn(DIAGNOSTIC_TEXT, "niña", 2, "n", false),
    typoIn(DIAGNOSTIC_TEXT, "extraño", 5, "l", true),
    typoIn(DIAGNOSTIC_TEXT, "zamba", 0, "x", false),
  ].sort((a, b) => a.index - b.index),
});

export const TARGET_SCRIPT = buildScript(TARGET_TEXT, {
  seed: 1129,
  wpm: 62,
  extraMs,
  typos: [
    typoIn(TARGET_TEXT, "queremos", 1, "i", true),
    typoIn(TARGET_TEXT, "montaña", 5, "n", false),
    typoIn(TARGET_TEXT, "empieza", 5, "x", true),
    typoIn(TARGET_TEXT, "quedarnos", 0, "w", true),
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

/** The still state (no JavaScript, reduced motion): the targets text typed up to "quedarnos", in steps. */
export const STILL_STEPS = stepsToType(TARGET_SCRIPT, TARGET_TEXT.slice(0, TARGET_TEXT.indexOf("quedarnos")));
