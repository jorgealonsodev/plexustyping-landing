/**
 * Sections of the documentation, in sidebar order (PRD §7). The key is the first URL segment
 * under /docs and the folder under src/content/docs.
 */
export const DOCS_SECTIONS = {
  empezar: { es: "Empezar", en: "Getting started" },
  practicar: { es: "Practicar", en: "Practice" },
  "motor-adaptativo": { es: "Motor adaptativo", en: "Adaptive engine" },
  ia: { es: "IA", en: "AI" },
  metronomo: { es: "Metrónomo", en: "Metronome" },
  "teclado-e-idiomas": { es: "Teclado e idiomas", en: "Keyboard and languages" },
  progreso: { es: "Progreso", en: "Progress" },
  personalizacion: { es: "Personalización", en: "Personalization" },
  accesibilidad: { es: "Accesibilidad", en: "Accessibility" },
  ajustes: { es: "Ajustes", en: "Settings" },
  referencia: { es: "Referencia", en: "Reference" },
  ayuda: { es: "Ayuda", en: "Help" },
  proyecto: { es: "Proyecto", en: "Project" },
} as const;

export type DocsSection = keyof typeof DOCS_SECTIONS;
export const DOCS_SECTION_KEYS = Object.keys(DOCS_SECTIONS) as [DocsSection, ...DocsSection[]];
