// Prerecorded data of the S6 demo on the English pages (demo): the counterpart of ./s6.ts for en / us-qwerty.
// The order is the app's unlock_order (src-tauri/src/unlock.rs, app commit
// 14f64cf2b9619deca9d99c2dbb3a2358586c5390) for that pair: the home-row letters of the layout's normal layer
// ("fjdkslagh": the US Semicolon key types ";", not a letter), then the other letters by their frequency in
// the English corpus's sentences ("etoinrucmwypbvxqz"), 26 letters in all. Each text joins words of the app's
// English word list (./corpus/en.ts) that use only the active letters, as the app writes texts in this mode.
import { WORDS } from "./corpus/en";
import { buildStages, type StageText, type UnlockStage } from "./s6";

/** The app's en / us-qwerty unlock order. */
export const UNLOCK_ORDER = [..."fjdkslaghetoinrucmwypbvxqz"];
const HOME_ROW = 9;

/** Words of the app's English list, joined by spaces (throws on a word the list does not have). */
const words = (...picked: string[]) => {
  for (const w of picked) if (!(WORDS as readonly string[]).includes(w)) throw new Error(`s6: "${w}" not in the corpus words`);
  return picked.join(" ");
};

const TEXTS: StageText[] = [
  [words("dad", "has", "a", "salad", "as", "all", "lads", "had"), 61, [["salad", 2, "k"]]],
  [words("he", "asked", "dad", "as", "she", "feels", "glad"), 62, [["asked", 1, "d"]]],
  [words("dad", "left", "the", "lads", "that", "last", "salad"), 63, [["left", 1, "r"]]],
  [words("those", "lads", "told", "dad", "to", "look", "at", "the", "old", "flag"), 64, [["those", 2, "p"]]],
  [words("she", "said", "this", "is", "still", "a", "good", "life"), 65, [["still", 0, "a"]]],
];

export const STAGES: UnlockStage[] = buildStages(UNLOCK_ORDER, HOME_ROW, UNLOCK_ORDER.length, TEXTS);
