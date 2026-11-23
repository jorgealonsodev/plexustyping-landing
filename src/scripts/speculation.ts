import { createHash } from "node:crypto";

/**
 * Speculation Rules (docs/seo-2026.md §B9; odd/tasks/seo-gaps.md S7): prefetch same-site pages when
 * the visitor shows intent (hover or pointer down: "moderate"), so the next page is already fetched.
 * Search data, Open Graph cards, feeds and text files are not pages and are never prefetched. The
 * rules are inlined, so the layout adds SPECULATION_RULES_HASH to the CSP script-src.
 */
const rules = {
  prefetch: [
    {
      where: {
        and: [
          { href_matches: "/*" },
          { not: { href_matches: "/pagefind/*" } },
          { not: { href_matches: "/og/*" } },
          { not: { href_matches: "/*.xml" } },
          { not: { href_matches: "/*.txt" } },
        ],
      },
      eagerness: "moderate",
    },
  ],
};

export const SPECULATION_RULES = JSON.stringify(rules);

export const SPECULATION_RULES_HASH = `sha256-${createHash("sha256").update(SPECULATION_RULES).digest("base64")}` as const;
