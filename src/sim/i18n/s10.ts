// Strings of the S10 "Accesibilidad" simulation (src/components/sims/S10Accessibility.svelte). `app` and
// `settings` are the app's own words inside the demo: in Spanish exactly as the app has them (sources in the
// comments, app commit 14f64cf2b9619deca9d99c2dbb3a2358586c5390); in English, faithful translations.
import type { Locale } from "../../i18n/paths";
import type { AppLabels } from "../code/labels";

interface Setting {
  label: string;
  hint: string;
}

export interface S10Strings {
  play: string;
  pause: string;
  description: string;
  paused: string;
  playing: string;
  windowTitle: string;
  caption: string;
  /** The panel of switches beside the demo. */
  settingsTitle: string;
  settings: { screenReader: Setting; colorBlind: Setting; reducedMotion: Setting };
  /** The transcript of what the screen reader mode announces. */
  transcriptTitle: string;
  transcriptOff: string;
  app: AppLabels;
}

export const S10_STRINGS: Record<Locale, S10Strings> = {
  es: {
    play: "Reproducir",
    pause: "Pausar",
    description:
      "Demostración con datos de ejemplo: las ayudas de accesibilidad de PlexusTyping. Una sesión grabada escribe una frase con un error corregido. Con «Anunciar con lector de pantalla», la app anuncia en una región aria-live educada el siguiente carácter, los errores, cada texto nuevo y el resultado; la transcripción muestra esos anuncios. El «Modo daltónico» cambia los destellos del teclado a azul y naranja y subraya la tecla errónea. Con el movimiento reducido del sistema no hay destellos ni animaciones: la tecla pulsada solo se subraya. Los tres conmutadores cambian la demostración.",
    paused: "Demostración en pausa.",
    playing: "Reproduciendo la demostración.",
    windowTitle: "PlexusTyping · demostración",
    caption:
      "Accesibilidad: anuncios para lectores de pantalla, modo daltónico y movimiento reducido, además de temas de alto contraste y tamaño de texto. Datos de ejemplo.",
    settingsTitle: "Accesibilidad",
    settings: {
      // settings.ts SCREEN_READER_SETTING
      screenReader: {
        label: "Anunciar con lector de pantalla",
        hint: "Anuncia el siguiente carácter, los errores, cada texto nuevo y el resultado (aria-live).",
      },
      // settings.ts COLOR_BLIND_SETTING
      colorBlind: {
        label: "Modo daltónico",
        hint: "Destellos en azul y naranja en lugar de verde y rojo; una tecla errónea se subraya.",
      },
      // The app follows the system setting (AccessibilitySection.svelte note); here it is a switch.
      reducedMotion: {
        label: "Movimiento reducido",
        hint: "Ajuste del sistema: sin destellos ni animaciones.",
      },
    },
    transcriptTitle: "Lo que anuncia el lector de pantalla",
    transcriptOff: "Desactivado: no se anuncia nada.",
    app: {
      tagline: "Del cerebro a los dedos.",
      profile: "Principal",
      ai: "IA",
      kindsLabel: "Modo de práctica",
      prose: "Prosa",
      words: "Palabras",
      code: "Código",
      languageLabel: "Lenguaje de programación",
      typingField: "Entrada de mecanografía",
      liveStats: "Estadísticas en vivo",
      wpm: "PPM",
      kpm: "Pulsaciones/min",
      accuracy: "Precisión",
      time: "Tiempo",
      textRegion: "Texto de práctica",
      codeRegion: "Código de práctica",
      source: "Corpus local",
      hintStart: "Empieza a escribir cuando quieras · Esc reinicia · F4 metrónomo · F6 menú", // focus.ts typingHint(false, false)
      hintStarted: "Esc reinicia el texto · F4 metrónomo · F6 menú", // focus.ts typingHint(true, false)
    },
  },
  en: {
    play: "Play",
    pause: "Pause",
    description:
      "Demo with sample data: PlexusTyping's accessibility aids. A recorded session types a sentence with one corrected typo. With “Announce with screen reader”, the app announces in a polite aria-live region the next character, errors, each new text and the result; the transcript shows those announcements. “Color-blind mode” turns the keyboard flashes blue and orange and underlines a wrong key. With the system's reduced motion there are no flashes or animations: the pressed key is only underlined. The three switches change the demo. Inside the demo the app's labels are translated; the app's own interface is in Spanish.",
    paused: "Demo paused.",
    playing: "Playing the demo.",
    windowTitle: "PlexusTyping · demo",
    caption:
      "Accessibility: screen reader announcements, color-blind mode and reduced motion, plus high-contrast themes and text size. Sample data; the app's interface is in Spanish.",
    settingsTitle: "Accessibility",
    settings: {
      screenReader: {
        label: "Announce with screen reader",
        hint: "Announces the next character, errors, each new text and the result (aria-live).",
      },
      colorBlind: {
        label: "Color-blind mode",
        hint: "Blue and orange flashes instead of green and red; a wrong key is underlined.",
      },
      reducedMotion: {
        label: "Reduced motion",
        hint: "System setting: no flashes or animations.",
      },
    },
    transcriptTitle: "What the screen reader announces",
    transcriptOff: "Off: nothing is announced.",
    app: {
      tagline: "From brain to fingers.",
      profile: "Main",
      ai: "AI",
      kindsLabel: "Practice mode",
      prose: "Prose",
      words: "Words",
      code: "Code",
      languageLabel: "Programming language",
      typingField: "Typing input",
      liveStats: "Live statistics",
      wpm: "WPM",
      kpm: "Keystrokes/min",
      accuracy: "Accuracy",
      time: "Time",
      textRegion: "Practice text",
      codeRegion: "Practice code",
      source: "Local corpus",
      hintStart: "Start typing whenever you like · Esc restarts · F4 metronome · F6 menu",
      hintStarted: "Esc restarts the text · F4 metronome · F6 menu",
    },
  },
};
