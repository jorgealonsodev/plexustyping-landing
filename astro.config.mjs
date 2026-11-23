// @ts-check
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import svelte from "@astrojs/svelte";
import { defineConfig } from "astro/config";
import { NOINDEX_PATHS } from "./src/data/routes.ts";
import { lastModifiedFor } from "./src/lib/lastmod.ts";

// The production domain is still undecided (PRODUCT.md, "Undecided"). Set SITE_URL in CI once it is;
// until then canonical and hreflang URLs use the reserved example.com placeholder.
const site = process.env.SITE_URL ?? "https://example.com";

export default defineConfig({
  site,
  output: "static",
  trailingSlash: "never",
  build: { format: "file" },
  integrations: [
    svelte(),
    mdx(),
    // sitemap-index.xml + sitemap-0.xml with indexable pages only (docs/seo-2026.md §B5). hreflang lives
    // in each page's <head>, so the sitemap carries no alternates; priority and changefreq are ignored
    // by Google and left out; lastmod is the git commit date of the page's source.
    sitemap({
      filter: (page) => {
        const path = new URL(page).pathname;
        return !NOINDEX_PATHS.some((p) => path === p || path.startsWith(`${p}/`));
      },
      serialize: (item) => {
        const lastmod = lastModifiedFor(new URL(item.url).pathname);
        return lastmod ? { url: item.url, lastmod } : { url: item.url };
      },
    }),
  ],
  // Code blocks in Markdown stay plain <pre><code> styled by Prose.astro with the app tokens: Shiki
  // colours tokens with inline style attributes, which the CSP below blocks (no 'unsafe-inline').
  markdown: { syntaxHighlight: false },
  i18n: {
    locales: ["es", "en"],
    defaultLocale: "es",
    routing: { prefixDefaultLocale: false },
  },
  // Astro's built-in CSP (PRD §12): a <meta> with hashes of every script and style it emits.
  // Not compatible with <ClientRouter />, so page transitions use the native cross-document
  // View Transitions API from CSS (@view-transition), which needs no JavaScript.
  security: {
    csp: {
      directives: [
        "default-src 'none'",
        "img-src 'self' data:",
        "font-src 'self'",
        "connect-src 'self'",
        "base-uri 'none'",
        "form-action 'none'",
        "upgrade-insecure-requests",
      ],
      // script-src keeps Astro's default 'self' (the lazy docs search module and Pagefind load from the
      // site itself) and adds 'wasm-unsafe-eval': Pagefind compiles its WebAssembly search core with
      // WebAssembly.instantiate, which CSP blocks without it. The keyword allows WebAssembly compilation
      // only, not eval() or new Function(), and no page loads WebAssembly until its search is opened.
      scriptDirective: { resources: ["'self'", "'wasm-unsafe-eval'"] },
    },
  },
});
