// The S3 "unlimited text" demo's English texts (English pages): sentences of the app's English corpus
// (./corpus/en.ts, from sentences.txt), unchanged and joined by spaces as a prose text is. Plain data: ./s3.ts
// builds the scripts over them, as it does over the Spanish ones.
import { SENTENCES } from "./corpus/en";
import type { SegmentTypo } from "./s3";

export const START_TEXT = [SENTENCES.toast, SENTENCES.bus, SENTENCES.sundays].join(" ");

export const PIECES = [`${SENTENCES.milk} ${SENTENCES.umbrella}`, `${SENTENCES.neighbour} ${SENTENCES.kitchen}`];

/** Corrected typos per segment: [segment, word, offset, typed]. */
export const TYPOS: SegmentTypo[] = [
  [0, "toast", 3, "r"],
  [0, "traffic", 4, "g"],
  [1, "bread", 2, "w"],
  [2, "bicycle", 4, "x"],
];
