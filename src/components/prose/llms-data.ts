/**
 * Gathers the Spanish collections for /llms.txt and /llms-full.txt (src/components/prose/llms.ts).
 * New docs, feature, FAQ and release files appear in both files on the next build.
 */
import { DOCS_SECTIONS } from "../../data/docs-sections";
import { ROUTES } from "../../data/routes";
import { SITE_NAME } from "../../data/site";
import { docPath, featurePath, getDocs, getFaq, getFeatures, getReleases, releaseAnchor } from "../../lib/content";
import { markdownToPlainText } from "./faq";
import type { LlmsData } from "./llms";

export async function collectLlmsData(site: URL): Promise<LlmsData> {
  const [docs, features, releases, faq] = await Promise.all([getDocs("es"), getFeatures("es"), getReleases("es"), getFaq("es")]);
  return {
    site,
    name: SITE_NAME,
    summary:
      "Tutor de mecanografía adaptativo, gratuito y de código abierto (MIT o Apache-2.0) para Linux y Windows: practica tus puntos débiles con textos del corpus local o, opcionalmente, generados con IA.",
    intro: [
      "Funciona sin cuenta, sin telemetría y sin conexión. La interfaz de la app está solo en español; los textos de práctica pueden estar en español, inglés, portugués de Brasil, francés o alemán.",
    ],
    pages: [
      { title: "Inicio", path: ROUTES.home },
      { title: "Descargar", path: ROUTES.download, description: "Instaladores para Linux y Windows con sus sumas SHA-256." },
      { title: "Funciones", path: ROUTES.features },
      { title: "Documentación", path: ROUTES.docs },
      { title: "Novedades", path: ROUTES.news, description: "Notas de versión y hoja de ruta." },
      { title: "Preguntas frecuentes", path: ROUTES.faq },
      { title: "Privacidad", path: ROUTES.privacy, description: "Qué guarda la app y qué envía la IA opcional." },
      { title: "Licencias", path: ROUTES.licenses },
    ],
    features: features.map((f) => ({
      title: f.data.h1,
      path: featurePath(f.id.replace(/^en\//, ""), "es"),
      description: f.data.description,
    })),
    docs: docs.map((d) => ({
      section: DOCS_SECTIONS[d.data.section].es,
      title: d.data.h1 ?? d.data.title,
      path: docPath(d),
      description: d.data.description,
      body: d.body ?? "",
    })),
    releases: releases.map((r) => ({
      version: r.data.version,
      date: r.data.date,
      summary: r.data.summary,
      path: `${ROUTES.news}#${releaseAnchor(r.data.version)}`,
      github: r.data.github,
    })),
    faq: faq.map((q) => ({ question: q.data.question, answer: markdownToPlainText(q.body ?? ""), path: `/docs/${q.data.doc}` })),
  };
}
