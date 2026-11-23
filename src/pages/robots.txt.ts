// robots.txt (PRD §10.1; docs/seo-2026.md §B3): every search and AI crawler is named and allowed,
// because the site wants to be found and cited. /_astro/ stays crawlable (CSS and JS for rendering).
import type { APIRoute } from "astro";
import { robotsTxt } from "../lib/robots";

export const GET: APIRoute = ({ site }) =>
  new Response(robotsTxt(site ?? new URL("https://example.com")), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
