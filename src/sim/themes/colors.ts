// Excerpt of the PlexusTyping app: src/features/themes/colors.ts (app commit 14f64cf2b9619deca9d99c2dbb3a2358586c5390).
// Only the WCAG contrast helpers the copied keyboard/flash.ts needs, verbatim; the rest of the file
// (theme application, palettes) is not used by the demo, whose colours come from src/styles/tokens.css.
// @ts-nocheck: verbatim app code, type-checked in the app under its own tsconfig.

const channels = (hex: string) => [1, 3, 5].map((i) => Number.parseInt(hex.slice(i, i + 2), 16));

/** WCAG relative luminance of a #rrggbb colour. */
const relativeLuminance = (hex: string) => {
  const [r, g, b] = channels(hex).map((v) => {
    const c = v / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

/** WCAG contrast ratio of two #rrggbb colours, from 1 to 21. */
export function contrastRatio(a: string, b: string): number {
  const [hi, lo] = [relativeLuminance(a), relativeLuminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}
