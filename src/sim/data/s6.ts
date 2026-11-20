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

/** The status with the home row and `extra` more letters active. */
const statusWith = (extra: number): UnlockStatus => ({
  enabled: true,
  targetWpm: 30,
  active: UNLOCK_ORDER.slice(0, HOME_ROW + extra),
  mastered: UNLOCK_ORDER.slice(0, HOME_ROW + extra - 1),
  next: UNLOCK_ORDER[HOME_ROW + extra] ?? null,
  total: TOTAL,
  stalledSessions: 0,
});

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

/** A beginner's pace (the default target speed is 30 PPM). */
const stage = (extra: number, text: string, seed: number, typos: [string, number, string][]): UnlockStage => ({
  status: statusWith(extra),
  text,
  script: buildScript(text, { seed, wpm: 46, typos: typos.map(([w, o, t]) => typo(text, w, o, t)) }),
  unlocks: extra < 4 ? (UNLOCK_ORDER[HOME_ROW + extra] ?? null) : null,
});

export const STAGES: UnlockStage[] = [
  stage(0, "la sala da salsa a las hadas", 61, [["salsa", 2, "k"]]),
  stage(1, "el hada desea la seda de jade", 62, [["desea", 1, "d"]]),
  stage(2, "el oso halla dos hojas del lago", 63, [["hojas", 1, "l"]]),
  stage(3, "los enanos llegan a la fonda del lago", 64, [["enanos", 1, "j"]]),
  stage(4, "ella regala rosas rojas a la rana", 65, [["regala", 0, "e"]]),
];

/** The still state (no JavaScript, reduced motion): the result screen of this stage, with its notice. */
export const STILL_STAGE = 0;
