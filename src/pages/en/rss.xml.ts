// English RSS feed of the release notes (PRD §5, §10.1): one item per release, newest first, linking to
// its section of /en/release-notes. Mirrors src/pages/rss.xml.ts.
import rss from "@astrojs/rss";
import type { APIRoute } from "astro";
import { ROUTES } from "../../data/routes";
import { localizePath } from "../../i18n/paths";
import { getReleases, releaseAnchor } from "../../lib/content";

export const GET: APIRoute = async ({ site }) => {
  const releases = await getReleases("en");
  return rss({
    title: "What's new in PlexusTyping",
    description: "Release notes of PlexusTyping, the adaptive typing tutor for Linux and Windows.",
    site: site ?? "https://example.com",
    customData: "<language>en</language>",
    trailingSlash: false,
    items: releases.map((r) => ({
      title: `PlexusTyping ${r.data.version}`,
      pubDate: r.data.date,
      description: r.data.summary,
      link: `${localizePath(ROUTES.news, "en")}#${releaseAnchor(r.data.version)}`,
    })),
  });
};
