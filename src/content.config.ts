/**
 * Content collections (PRD §5, §7). Files whose name starts with "_" are ignored.
 * - docs:     src/content/docs/<section>/<page>.{md,mdx} -> /docs/<section>/<page> (DocsLayout).
 *             English pages, when the mirror exists, live under docs/en/ and carry `lang: en`.
 * - features: src/content/features/<slug>.{md,mdx} -> /funciones/<slug> (FeatureLayout); slug is one of FEATURE_SLUGS.
 * - releases: src/content/releases/<version>.md -> a section of /novedades and an item of /rss.xml.
 * - faq:      src/content/faq/<id>.md -> one question of /preguntas-frecuentes; the body is the answer.
 * Limits follow PRD §10.1: titles at most 60 characters, descriptions at most 155.
 */
import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { DOCS_SECTION_KEYS } from "./data/docs-sections";
import { FEATURE_SLUGS } from "./data/routes";

const PATTERN = "**/[^_]*.{md,mdx}";
const lang = z.enum(["es", "en"]).default("es");
const title = z.string().min(1).max(60);
const description = z.string().min(1).max(155);
const semver = z.string().regex(/^\d+\.\d+\.\d+$/);
/** A documentation page id: "<section>/<page>". */
const docId = z.string().regex(/^[a-z0-9-]+\/[a-z0-9-]+$/);

const docs = defineCollection({
  loader: glob({ pattern: PATTERN, base: "./src/content/docs" }),
  schema: z.object({
    /** <title> (without the " · PlexusTyping" suffix when it would pass 60 characters). */
    title,
    description,
    /** Visible <h1>; defaults to `title`. */
    h1: z.string().optional(),
    section: z.enum(DOCS_SECTION_KEYS),
    /** Position inside its section in the sidebar. */
    order: z.number().int(),
    sidebarLabel: z.string().optional(),
    /** First publication; TechArticle datePublished. */
    published: z.coerce.date(),
    /** Last meaningful change; the visible "Actualizado" date and TechArticle dateModified. */
    updated: z.coerce.date(),
    /** App version the page applies to. */
    appVersion: semver,
    /** Related feature pages (at least one internal link to a feature, docs/seo-2026.md §C). */
    features: z.array(z.enum(FEATURE_SLUGS)).min(1),
    lang,
  }),
});

const features = defineCollection({
  loader: glob({ pattern: PATTERN, base: "./src/content/features" }),
  schema: z.object({
    title,
    description,
    h1: z.string().min(1),
    /** The 40–60 word answer that opens the page (spec S4). */
    lead: z.string().min(1),
    order: z.number().int(),
    updated: z.coerce.date(),
    /** Documentation pages this feature links to, as "<section>/<page>" (at least one). */
    docs: z.array(docId).min(1),
    lang,
  }),
});

const releases = defineCollection({
  loader: glob({ pattern: PATTERN, base: "./src/content/releases" }),
  schema: z.object({
    version: semver,
    /** Publication date of the GitHub release. */
    date: z.coerce.date(),
    /** One-line summary, used by the RSS item. */
    summary: z.string().min(1).max(300),
    github: z.url(),
    lang,
  }),
});

const faq = defineCollection({
  loader: glob({ pattern: PATTERN, base: "./src/content/faq" }),
  schema: z.object({
    question: z.string().min(1),
    order: z.number().int(),
    /** The documentation page the answer links to, as "<section>/<page>". */
    doc: docId,
    lang,
  }),
});

export const collections = { docs, features, releases, faq };
