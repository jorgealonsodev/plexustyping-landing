// Website strings of the S6 demo ("Desbloqueo progresivo", src/components/sims/S6Unlock.svelte): the controls,
// caption and text alternative around it, and (UNLOCK_UI) the app's unlock lines inside it. Spanish pages show
// the app's Spanish UI; English pages show it translated, with English texts and the English (US) layout.
import type { Locale } from "../../i18n/paths";
import type { UnlockStatus } from "../unlock/api";
import { progressLine, unlockNotice } from "../unlock/unlock";
import type { SimStrings } from "./s2";

export const S6_STRINGS: Record<Locale, SimStrings> = {
  es: {
    title: "PlexusTyping · demostración",
    caption:
      "Desbloqueo progresivo. Empiezas por la fila base y cada vez que dominas las teclas activas se desbloquea una más; los textos usan solo las teclas activas. Demostración acelerada: en la app cada tecla llega tras varias sesiones.",
    play: "Reproducir",
    pause: "Pausar",
    description:
      "Demostración con datos de ejemplo: el modo de desbloqueo progresivo de PlexusTyping. El teclado en pantalla muestra atenuadas las teclas aún bloqueadas y solo la fila base encendida. Tras cada texto, escrito solo con las teclas activas, el resultado muestra «Nueva tecla desbloqueada» y la tecla se enciende: primero la e, luego la o, la n y la r. La línea de progreso cuenta las teclas, de «Teclas: 10/27 · siguiente: e» a «Teclas: 14/27 · siguiente: i».",
    paused: "Demostración en pausa.",
    playing: "Reproduciendo la demostración.",
  },
  en: {
    title: "PlexusTyping · demo",
    caption:
      "Progressive unlock. You start on the home row and each time you master the active keys one more unlocks; texts use only the active keys. Sped-up demo: in the app each key takes several sessions.",
    play: "Play",
    pause: "Pause",
    description:
      "Demo with sample data: PlexusTyping's progressive unlock mode, with English texts on the English (US) keyboard. The on-screen keyboard dims the keys still locked, with only the home row lit. After each text, typed with the active keys only, the result shows “New key unlocked” and the key lights up: first e, then t, o and i. The progress line counts the keys, from “Keys: 9/26 · next: e” to “Keys: 13/26 · next: n”.",
    paused: "Demo paused.",
    playing: "Playing the demo.",
  },
};

/** Progressive unlock (unlock.ts). */
export interface UnlockUi {
  label: string;
  progressLine: (status: UnlockStatus | null) => string | null;
  notice: (unlocked: string | null | undefined) => string | null;
}

export const UNLOCK_UI: Record<Locale, UnlockUi> = {
  es: { label: "Desbloqueo progresivo", progressLine, notice: unlockNotice },
  en: {
    label: "Progressive unlock",
    // unlock.ts's progressLine with the same counting (distinct active lowercase letters, at most `total`).
    progressLine: (status) => {
      if (!status?.enabled) return null;
      const letters = Math.min(new Set(status.active.filter((ch) => /^\p{Ll}$/u.test(ch))).size, status.total);
      const count = `Keys: ${letters}/${status.total}`;
      return status.next === null ? count : `${count} · next: ${status.next}`;
    },
    notice: (unlocked) => (unlocked ? `New key unlocked: ${unlocked}` : null),
  },
};
