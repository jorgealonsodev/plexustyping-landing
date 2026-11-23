// RSS feed of the release notes (PRD §5, §10.1): one item per release, newest first, linking to its
// section of /novedades.
import rss from "@astrojs/rss";
import type { APIRoute } from "astro";
import { getReleases, releaseAnchor } from "../lib/content";

export const GET: APIRoute = async ({ site }) => {
  const releases = await getReleases("es");
  return rss({
    title: "Novedades de PlexusTyping",
    description: "Notas de versión de PlexusTyping, el tutor de mecanografía adaptativo para Linux y Windows.",
    site: site ?? "https://example.com",
    customData: "<language>es</language>",
    trailingSlash: false,
    items: releases.map((r) => ({
      title: `PlexusTyping ${r.data.version}`,
      pubDate: r.data.date,
      description: r.data.summary,
      link: `/novedades#${releaseAnchor(r.data.version)}`,
    })),
  });
};
