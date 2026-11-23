// Presses of each char on the English (US) layout of the /en simulations, as the app's key_sequences command
// returns them: the port of the app's Rust `Layout::locate` (src/sim/keyboard/locate.ts) over the app's
// layouts/us-qwerty.toml (./us-qwerty.en.ts). The layout has no dead keys, so every press is one key.
import { locate } from "../keyboard/locate";
import type { KeyPress } from "../keyboard/types";
import { US_QWERTY } from "./us-qwerty.en";

const cache = new Map<string, KeyPress[] | null>();

/** The presses of one char (`null` if untypeable). */
export function keySequence(ch: string): KeyPress[] | null {
  if (!cache.has(ch)) cache.set(ch, locate(US_QWERTY, ch));
  return cache.get(ch) ?? null;
}

/** The presses for each char of `text` (`null` if untypeable), like `key_sequences` for one text. */
export const sequencesFor = (text: string): (KeyPress[] | null)[] => [...text].map(keySequence);
