// The S5 metronome demo's English text (English pages): three words of the app's English word list
// (./corpus/en.ts), 15 chars like the Spanish "ritmo constante", so the same per-keystroke offsets apply.
import { WORDS } from "./corpus/en";

const pick = (w: (typeof WORDS)[number]) => w;

export const TEXT = [pick("keep"), pick("the"), pick("rhythm")].join(" ");
