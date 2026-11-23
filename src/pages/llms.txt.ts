// /llms.txt (PRD §10.2, docs/seo-2026.md §B11): Markdown index of the site, built from the collections.
import type { APIRoute } from "astro";
import { buildLlmsTxt } from "../components/prose/llms";
import { collectLlmsData } from "../components/prose/llms-data";

export const GET: APIRoute = async ({ site }) =>
  new Response(buildLlmsTxt(await collectLlmsData(site ?? new URL("https://example.com"))), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
