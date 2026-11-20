// @ts-check
import svelte from "@astrojs/svelte";
import { defineConfig } from "astro/config";

// The production domain is still undecided (PRODUCT.md, "Undecided"). Set SITE_URL in CI once it is;
// until then canonical and hreflang URLs use the reserved example.com placeholder.
const site = process.env.SITE_URL ?? "https://example.com";

export default defineConfig({
  site,
  output: "static",
  trailingSlash: "never",
  build: { format: "file" },
  integrations: [svelte()],
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
    },
  },
});
