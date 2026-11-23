// Open Graph cards rendered at build time (docs/seo-2026.md §B6): /og/<slug>.png, 1200×630 PNG.
import type { APIRoute, GetStaticPaths } from "astro";
import { type OgCardEntry, ogCards } from "../../lib/og/cards";
import { renderOgCard } from "../../lib/og/render";

export const getStaticPaths = (async () =>
  (await ogCards()).map((card) => ({ params: { slug: card.slug }, props: card }))) satisfies GetStaticPaths;

export const GET: APIRoute<OgCardEntry> = async ({ props }) =>
  new Response(new Uint8Array(await renderOgCard(props)), { headers: { "Content-Type": "image/png" } });
