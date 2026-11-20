// Website strings of the S6 demo ("Desbloqueo progresivo", src/components/sims/S6Unlock.svelte). The app's own
// interface inside the demo stays Spanish; these are the controls, caption and text alternative around it.
import type { Locale } from "../../i18n/paths";
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
      "Progressive unlock. You start on the home row and each time you master the active keys one more unlocks; texts use only the active keys. Sped-up demo: in the app each key takes several sessions. The app's interface is in Spanish.",
    play: "Play",
    pause: "Pause",
    description:
      "Demo with sample data: PlexusTyping's progressive unlock mode. The on-screen keyboard dims the keys still locked, with only the home row lit. After each text, typed with the active keys only, the result shows «Nueva tecla desbloqueada» (new key unlocked) and the key lights up: first e, then o, n and r. The progress line counts the keys, from «Teclas: 10/27 · siguiente: e» to «Teclas: 14/27 · siguiente: i».",
    paused: "Demo paused.",
    playing: "Playing the demo.",
  },
};
