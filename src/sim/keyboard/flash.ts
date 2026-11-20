// Copied verbatim from the PlexusTyping app: src/features/keyboard/flash.ts (app commit 14f64cf2b9619deca9d99c2dbb3a2358586c5390).
// Do not edit by hand: re-copy from the app instead.
import { contrastRatio } from "../themes";

/** Okabe–Ito colour-blind-safe pair (a11y S5, L3): blue for a right key, orange for a wrong one. */
export const OKABE_ITO_BLUE = "#0072B2";
export const OKABE_ITO_ORANGE = "#E69F00";

/** Black or white, whichever has more contrast on `background`. */
const labelOn = (background: string) => {
  const bg = background.toLowerCase();
  return contrastRatio("#000000", bg) >= contrastRatio("#ffffff", bg) ? "#000000" : "#ffffff";
};

/**
 * CSS variables of the key flashes (`Keyboard.svelte`): the fill and the label of a right and a wrong key.
 * The theme's --success/--danger labelled in --bg, or the Okabe–Ito pair in colour-blind mode, the same
 * in every theme. Set through the CSSOM (`style.setProperty`), which the CSP allows.
 */
export function flashVars(colorBlind: boolean): Record<string, string> {
  if (!colorBlind)
    return {
      "--flash-ok": "var(--success)",
      "--flash-ok-fg": "var(--bg)",
      "--flash-bad": "var(--danger)",
      "--flash-bad-fg": "var(--bg)",
    };
  return {
    "--flash-ok": OKABE_ITO_BLUE,
    "--flash-ok-fg": labelOn(OKABE_ITO_BLUE),
    "--flash-bad": OKABE_ITO_ORANGE,
    "--flash-bad-fg": labelOn(OKABE_ITO_ORANGE),
  };
}
