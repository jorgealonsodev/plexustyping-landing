// Prerecorded data of the S6 demo, "Desbloqueo progresivo" (demostración): the unlock statuses the app's
// `unlock_status` command would return as a beginner masters keys, and one short text per status.
// Synthetic, never real users. The order is the app's: the home row, then the other letters by their
// frequency in the Spanish corpus (src-tauri/src/unlock.rs `unlock_order`, pinned by its test
// `the_order_is_the_home_row_then_the_language_frequency`: "fjdkslañgheonritucmp…", 27 letters), at app
// commit 14f64cf2b9619deca9d99c2dbb3a2358586c5390. In the app a key unlocks once the active ones are mastered
// at the target speed, over many sessions; the demo unlocks one per text.
import { buildScript, type Script, type Typo } from "../replay";
import type { UnlockStatus } from "../unlock/api";

/** The start of the app's es / es-qwerty unlock order. */
export const UNLOCK_ORDER = [..."fjdkslañgheonri"];
/** Letters of the home row, active from the start. */
const HOME_ROW = 10;
/** Letters of the full order for es / es-qwerty. */
const TOTAL = 27;

export interface UnlockStage {
  status: UnlockStatus;
  /** A prose text with only the active letters, as the app writes them in this mode. */
  text: string;
  script: Script;
  /** The key the session of this text unlocks (its result screen's notice); `null` for none. */
  unlocks: string | null;
}

/** A typo on the `offset`-th char of the first `word` in `text`, noticed one char later. */
function typo(text: string, word: string, offset: number, typed: string): Typo {
  const at = text.indexOf(word);
  if (at < 0) throw new Error(`s6 typo: "${word}" not in text`);
  return { index: [...text.slice(0, at)].length + offset, typed, corrected: true };
}

/** One stage's text: the text, its replay's seed and its typos as [word, offset, typed]. */
export type StageText = [text: string, seed: number, typos: [string, number, string][]];

/**
 * The stages of an unlock order: stage `i` has the home row (`homeRow` letters of `order`) and `i` more
 * letters active, out of `total`; every stage but the last unlocks the next letter of the order.
 */
export function buildStages(order: string[], homeRow: number, total: number, texts: StageText[]): UnlockStage[] {
  const last = texts.length - 1;
  return texts.map(([text, seed, typos], extra) => ({
    status: {
      enabled: true,
      targetWpm: 30,
      active: order.slice(0, homeRow + extra),
      mastered: order.slice(0, homeRow + extra - 1),
      next: order[homeRow + extra] ?? null,
      total,
      stalledSessions: 0,
    },
    text,
    // A beginner's pace (the default target speed is 30 PPM).
    script: buildScript(text, { seed, wpm: 46, typos: typos.map(([w, o, t]) => typo(text, w, o, t)) }),
    unlocks: extra < last ? (order[homeRow + extra] ?? null) : null,
  }));
}

export const STAGES: UnlockStage[] = buildStages(UNLOCK_ORDER, HOME_ROW, TOTAL, [
  ["la sala da salsa a las hadas", 61, [["salsa", 2, "k"]]],
  ["el hada desea la seda de jade", 62, [["desea", 1, "d"]]],
  ["el oso halla dos hojas del lago", 63, [["hojas", 1, "l"]]],
  ["los enanos llegan a la fonda del lago", 64, [["enanos", 1, "j"]]],
  ["ella regala rosas rojas a la rana", 65, [["regala", 0, "e"]]],
]);

/** The still state (no JavaScript, reduced motion): the result screen of this stage, with its notice. */
export const STILL_STAGE = 0;
