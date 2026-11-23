/** Link labels of the nine feature pages (PRD §5), for cross-links from docs before or without their page data. */
import type { FeatureSlug } from "./routes";

export const FEATURE_LABELS: Record<FeatureSlug, { es: string; en: string }> = {
  "motor-adaptativo": { es: "Motor adaptativo", en: "Adaptive engine" },
  ia: { es: "IA opcional", en: "Optional AI" },
  "texto-ilimitado": { es: "Texto ilimitado", en: "Unlimited text" },
  metronomo: { es: "Metrónomo", en: "Metronome" },
  "modo-codigo": { es: "Modo código", en: "Code mode" },
  "distribuciones-e-idiomas": { es: "Distribuciones e idiomas", en: "Layouts and languages" },
  accesibilidad: { es: "Accesibilidad", en: "Accessibility" },
  personalizacion: { es: "Personalización", en: "Personalization" },
  progreso: { es: "Progreso", en: "Progress" },
};
