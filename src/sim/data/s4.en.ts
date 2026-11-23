// The S4 ghost-session demo's English text (English pages): two sentences of the app's English corpus
// (./corpus/en.ts, from sentences.txt), unchanged, joined by a space. Plain data: ./s4.ts builds the record
// and the race over it, as it does over the Spanish one.
import { SENTENCES } from "./corpus/en";
import type { WordTypo } from "./s4";

export const GHOST_TEXT = `${SENTENCES.bookshop} ${SENTENCES.children}`;
/** The record's one corrected typo. */
export const GHOST_TYPOS: WordTypo[] = [["bookshop", 3, "l"]];
/** The race's slow start: two corrected typos. */
export const RACE_TYPOS: WordTypo[] = [
  ["sister", 3, "y"],
  ["works", 2, "e"],
];
/** The still state: the race typed up to this word, ahead of the record. */
export const STILL_WORD = "bookshop";
