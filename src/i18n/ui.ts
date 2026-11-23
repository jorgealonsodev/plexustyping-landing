import type { Locale } from "./paths";

/** Shared UI strings of the site chrome (nav, footer, skip link), one entry per language. */
export interface UiStrings {
  skipLink: string;
  navLabel: string;
  homeLabel: string;
  nav: { features: string; docs: string; news: string; download: string };
  /** Phone menu (SiteHeader drawer): accessible names of its open and close buttons and of the drawer nav. */
  menu: { open: string; close: string; label: string };
  footerLabel: string;
  footer: {
    privacy: string;
    licenses: string;
    faq: string;
    rss: string;
    github: string;
    language: string;
    /** Name of the other language, written in that language. */
    otherLanguage: string;
    /** Label of the theme toggle; aria-pressed tells whether the dark theme is on. */
    darkTheme: string;
  };
  /** Release facts under the footer links: date, platforms, licence. */
  release: {
    published: string;
    platforms: string;
    license: string;
    /** English site only: the released app's interface is Spanish (PRODUCT.md), said on every page. */
    appLanguage?: string;
  };
  /** Shared chrome of the content layouts (breadcrumbs, docs meta, sidebar, TOC). */
  layout: {
    breadcrumbs: string;
    home: string;
    updated: string;
    appVersion: string;
    editOnGithub: string;
    feedback: string;
    toc: string;
    docsNav: string;
    relatedDocs: string;
    relatedFeatures: string;
    /** og:image:alt of the generated cards: "{title} · PlexusTyping". */
    ogAlt: string;
  };
  /** The S1 hero demo around the app screen (whose own UI is the app's Spanish one, translated on /en). */
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
    menu: { open: "Abrir menú", close: "Cerrar menú", label: "Menú" },
    footerLabel: "Pie de página",
    footer: {
      privacy: "Privacidad",
      licenses: "Licencias",
      faq: "Preguntas frecuentes",
      rss: "Novedades por RSS",
      github: "Código en GitHub",
      language: "Idioma",
      otherLanguage: "English",
      darkTheme: "Tema oscuro",
    },
    release: { published: "publicada el", platforms: "Linux y Windows", license: "MIT o Apache-2.0" },
    layout: {
      breadcrumbs: "Migas de pan",
      home: "Inicio",
      updated: "Actualizado",
      appVersion: "Versión de la app",
      editOnGithub: "Editar en GitHub",
      feedback: "¿Te ha ayudado? Cuéntanoslo en GitHub",
      toc: "En esta página",
      docsNav: "Documentación",
      relatedDocs: "Documentación relacionada",
      relatedFeatures: "Funciones relacionadas",
      ogAlt: "{title} · PlexusTyping",
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
    menu: { open: "Open menu", close: "Close menu", label: "Menu" },
    footerLabel: "Footer",
    footer: {
      privacy: "Privacy",
      licenses: "Licenses",
      faq: "FAQ",
      rss: "What's new (RSS)",
      github: "Source on GitHub",
      language: "Language",
      otherLanguage: "Español",
      darkTheme: "Dark theme",
    },
    release: {
      published: "released on",
      platforms: "Linux and Windows",
      license: "MIT or Apache-2.0",
      appLanguage: "the app's interface is in Spanish",
    },
    layout: {
      breadcrumbs: "Breadcrumbs",
      home: "Home",
      updated: "Updated",
      appVersion: "App version",
      editOnGithub: "Edit on GitHub",
      feedback: "Did this help? Tell us on GitHub",
      toc: "On this page",
      docsNav: "Documentation",
      relatedDocs: "Related documentation",
      relatedFeatures: "Related features",
      ogAlt: "{title} · PlexusTyping",
    },
    heroSim: {
      hint: "Click and type",
      play: "Play",
      pause: "Pause",
      description:
        "Demo with sample data: the PlexusTyping practice screen typing on its own (the released app's interface is in Spanish; the demo shows it translated). It shows the live stats (words per minute, keystrokes per minute, accuracy and time), the text with right and wrong characters, and the on-screen keyboard highlighting the next key. After the diagnostic text, the keyboard is tinted by each key's errors and the next text practices qu, z and x. You can type yourself: click the demo or Tab to its typing field; Esc restarts the text.",
      paused: "Demo paused.",
      playing: "Demo playing.",
      restarted: "Text restarted.",
      finished: "Text finished: {wpm} WPM, {accuracy} accuracy.",
    },
  },
};

export const ui = (locale: Locale): UiStrings => UI[locale];

export const GITHUB_URL = "https://github.com/jorgealonsodev/plexustyping";
