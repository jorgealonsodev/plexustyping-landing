import type { Locale } from "./paths";

/** Shared UI strings of the site chrome (nav, footer, skip link), one entry per language. */
export interface UiStrings {
  skipLink: string;
  navLabel: string;
  homeLabel: string;
  nav: { features: string; docs: string; news: string; download: string };
  footerLabel: string;
  footer: {
    privacy: string;
    licenses: string;
    github: string;
    language: string;
    /** Name of the other language, written in that language. */
    otherLanguage: string;
    /** Label of the theme toggle; aria-pressed tells whether the dark theme is on. */
    darkTheme: string;
  };
  /** The S1 hero demo around the app screen (whose own UI stays in Spanish, as the app's). */
  heroSim: HeroSimStrings;
}

/** Strings of the S1 hero demo (src/components/HeroSim.svelte); plain strings, so they can be island props. */
export interface HeroSimStrings {
  /** Visible next to the play/pause button. */
  hint: string;
  play: string;
  pause: string;
  /** Text alternative of the demo, read before it. */
  description: string;
  /** Polite announcements, only for the visitor's own actions. */
  paused: string;
  playing: string;
  restarted: string;
  /** "Texto terminado: {wpm} PPM, precisión {accuracy}." */
  finished: string;
}

export const UI: Record<Locale, UiStrings> = {
  es: {
    skipLink: "Saltar al contenido",
    navLabel: "Principal",
    homeLabel: "PlexusTyping, inicio",
    nav: { features: "Funciones", docs: "Documentación", news: "Novedades", download: "Descargar" },
    footerLabel: "Pie de página",
    footer: {
      privacy: "Privacidad",
      licenses: "Licencias",
      github: "Código en GitHub",
      language: "Idioma",
      otherLanguage: "English",
      darkTheme: "Tema oscuro",
    },
    heroSim: {
      hint: "Haz clic y escribe",
      play: "Reproducir",
      pause: "Pausar",
      description:
        "Demostración con datos de ejemplo: la pantalla de práctica de PlexusTyping escribiendo sola. Muestra las estadísticas en vivo (PPM, pulsaciones por minuto, precisión y tiempo), el texto con los aciertos y los errores, y el teclado en pantalla con la tecla siguiente resaltada. Tras el texto de diagnóstico, el teclado se tiñe según los errores de cada tecla y el texto siguiente practica ñ, qu y z. Puedes escribir tú: haz clic en la demostración o llega con Tab al campo de escritura; Esc reinicia el texto.",
      paused: "Demostración en pausa.",
      playing: "Reproduciendo la demostración.",
      restarted: "Texto reiniciado.",
      finished: "Texto terminado: {wpm} PPM, precisión {accuracy}.",
    },
  },
  en: {
    skipLink: "Skip to content",
    navLabel: "Main",
    homeLabel: "PlexusTyping, home",
    nav: { features: "Features", docs: "Documentation", news: "What's new", download: "Download" },
    footerLabel: "Footer",
    footer: {
      privacy: "Privacy",
      licenses: "Licenses",
      github: "Source on GitHub",
      language: "Language",
      otherLanguage: "Español",
      darkTheme: "Dark theme",
    },
    heroSim: {
      hint: "Click and type",
      play: "Play",
      pause: "Pause",
      description:
        "Demo with sample data: the PlexusTyping practice screen typing on its own (the app's interface is in Spanish). It shows the live stats (words per minute, keystrokes per minute, accuracy and time), the text with right and wrong characters, and the on-screen keyboard highlighting the next key. After the diagnostic text, the keyboard is tinted by each key's errors and the next text practises ñ, qu and z. You can type yourself: click the demo or Tab to its typing field; Esc restarts the text.",
      paused: "Demo paused.",
      playing: "Demo playing.",
      restarted: "Text restarted.",
      finished: "Text finished: {wpm} WPM, {accuracy} accuracy.",
    },
  },
};

export const ui = (locale: Locale): UiStrings => UI[locale];

export const GITHUB_URL = "https://github.com/jorgealonsodev/plexustyping";
