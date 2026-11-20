// Demo data of the S7 personalisation demo (labelled "demostración"): a sample practice text caught mid-way,
// with one wrong char, so the theme's correct, error, cursor and pending colours all show.
import type { CharState } from "../practice/engine";

export const SAMPLE =
  "El veloz murciélago hindú comía feliz cardillo y kiwi. La cigüeña tocaba el saxofón detrás del palenque de paja.";

/** Chars typed so far; the cursor is on the next one. */
export const TYPED = 34;
/** The one char typed wrong (the "e" of "feliz"). */
export const WRONG = 33;

export const STATES: CharState[] = [...SAMPLE].map((_, i) => (i === WRONG ? "error" : i < TYPED ? "correct" : "pending"));

/** Themes the autoplay shows in turn, the app's default first and both high-contrast ones included. */
export const TOUR = ["catppuccin-mocha", "dracula", "alto-contraste-oscuro", "gruvbox-light", "tokyo-night", "alto-contraste-claro"];

/** Ms each theme of the tour stays. */
export const TOUR_MS = 3200;
