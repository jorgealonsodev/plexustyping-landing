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
  },
};

export const ui = (locale: Locale): UiStrings => UI[locale];

export const GITHUB_URL = "https://github.com/jorgealonsodev/plexustyping";
