/** robots.txt body (PRD §10.1; docs/seo-2026.md §B3). */
export const CRAWLERS = [
  "Googlebot",
  "Bingbot",
  "OAI-SearchBot",
  "GPTBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-SearchBot",
  "Claude-User",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
] as const;

export function robotsTxt(site: URL): string {
  return [
    "# Search engines and AI assistants are welcome to crawl and cite this site (PRD §10.1).",
    "User-agent: *",
    "Allow: /",
    "",
    ...CRAWLERS.map((c) => `User-agent: ${c}`),
    "Allow: /",
    "",
    `Sitemap: ${new URL("/sitemap-index.xml", site).href}`,
    "",
  ].join("\n");
}
