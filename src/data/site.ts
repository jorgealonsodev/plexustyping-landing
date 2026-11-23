/** Site-wide facts shared by the layouts, the SEO helpers and the feeds. */
export const SITE_NAME = "PlexusTyping";
/** Tagline of the binding wordmark (PRODUCT.md, Brand Commitments). */
export const SITE_TAGLINE = "Adaptive typing";
/** The app's source repository. */
export const APP_REPO_URL = "https://github.com/jorgealonsodev/plexustyping";
/** This website's source repository ("Editar en GitHub", "¿Te ha ayudado?"). */
export const SITE_REPO_URL = "https://github.com/jorgealonsodev/plexustyping-landing";
/** Branch the site is built and deployed from. */
export const SITE_REPO_BRANCH = "main";
export const GITHUB_OWNER_URL = "https://github.com/jorgealonsodev";
/** App code licenses (PRODUCT.md: MIT or Apache-2.0). */
export const APP_LICENSES = [
  { spdx: "MIT", url: "https://spdx.org/licenses/MIT.html" },
  { spdx: "Apache-2.0", url: "https://spdx.org/licenses/Apache-2.0.html" },
] as const;
/** Size of the default Open Graph cards (src/pages/og). */
export const OG_SIZE = { width: 1200, height: 630 } as const;
/** Reserved placeholder origin used until the production domain is decided (PRODUCT.md, "Undecided"). */
export const PLACEHOLDER_SITE = "https://example.com";

/**
 * True for a deploy build (DEPLOY_BUILD=1, set by the Dockerfile) whose SITE_URL is missing, invalid
 * or the placeholder: every page then gets noindex, so a site whose canonicals point at example.com
 * is never indexed (odd/tasks/seo-gaps.md S1). Local builds and tests are unaffected.
 */
export function isUnindexableDeploy(env: Record<string, string | undefined> = process.env): boolean {
  if (env.DEPLOY_BUILD !== "1") return false;
  const raw = env.SITE_URL?.trim();
  if (!raw) return true;
  try {
    return new URL(raw).origin === PLACEHOLDER_SITE;
  } catch {
    return true;
  }
}
