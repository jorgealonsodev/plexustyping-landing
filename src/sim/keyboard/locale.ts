// The keyboard of the simulations per site language: Spanish pages draw the app's es-qwerty layout with its
// precomputed key sequences (src/sim/data/es-qwerty.ts, sequences.ts); English pages the app's English (US)
// layout (src/sim/data/us-qwerty.en.ts, sequences.en.ts).
import type { Locale } from "../../i18n/paths";
import { ES_QWERTY } from "../data/es-qwerty";
import { sequencesFor as esSequences } from "../data/sequences";
import { sequencesFor as enSequences } from "../data/sequences.en";
import { US_QWERTY } from "../data/us-qwerty.en";
import type { KeyPress, Layout } from "./types";

export interface SimKeyboard {
  layout: Layout;
  sequencesFor: (text: string) => (KeyPress[] | null)[];
}

export const KEYBOARDS: Record<Locale, SimKeyboard> = {
  es: { layout: ES_QWERTY, sequencesFor: esSequences },
  en: { layout: US_QWERTY, sequencesFor: enSequences },
};
