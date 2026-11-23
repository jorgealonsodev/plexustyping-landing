// The S7 personalisation demo's English sample (English pages): two sentences of the app's English corpus
// (./corpus/en.ts, from sentences.txt), caught mid-way with one wrong char, like the Spanish sample.
import type { CharState } from "../practice/engine";
import { SENTENCES } from "./corpus/en";

export const SAMPLE = `${SENTENCES.cat} ${SENTENCES.grandmother}`;

/** Chars typed so far; the cursor is on the next one. */
export const TYPED = 34;
/** The one char typed wrong (the second "e" of "every"). */
export const WRONG = 29;

export const STATES: CharState[] = [...SAMPLE].map((_, i) => (i === WRONG ? "error" : i < TYPED ? "correct" : "pending"));
