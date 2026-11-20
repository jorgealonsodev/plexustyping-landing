// Copy of the PlexusTyping app's src/features/settings/cursor.ts (app commit 14f64cf2b9619deca9d99c2dbb3a2358586c5390).
// Demo edit: the localStorage load/save helpers and the settings import are left out (the demo keeps nothing).
// The rest is verbatim.

/** Ajustes → Texto select of the typing cursor's look, prose and code (cursor-style S1). */
export const CURSOR_SETTING = {
  label: "Cursor",
  hint: "Cómo se marca el siguiente carácter que hay que escribir.",
};

export const CURSOR_BLINK_SETTING = {
  label: "Cursor parpadeante",
  hint: "El cursor parpadea mientras esperas y se queda fijo al escribir; no lo hace con el movimiento reducido del sistema.",
};

export interface CursorStyle {
  id: string;
  name: string;
}

/** Display order; the first, the Monkeytype-style bar, is the default. The practice text reads the id from `data-cursor`. */
export const CURSOR_STYLES: CursorStyle[] = [
  { id: "bar", name: "Barra" },
  { id: "highlight", name: "Resaltado" },
  { id: "block", name: "Bloque" },
  { id: "underline", name: "Subrayado" },
  { id: "outline", name: "Contorno" },
];

// Demo edit: `!` on CURSOR_STYLES[0] (twice) for the site's strictest tsconfig (noUncheckedIndexedAccess).
export const DEFAULT_CURSOR_STYLE = CURSOR_STYLES[0]!.id;

/** The style `id`, or the default for an unknown one. */
export const cursorStyleById = (id: string): CursorStyle => CURSOR_STYLES.find((s) => s.id === id) ?? CURSOR_STYLES[0]!;
