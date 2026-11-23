/**
 * Spanish passages inside English pages (WCAG 3.1.2 Language of Parts, odd/tasks/site-pages.md T7).
 *
 * Since app v0.2.0 the English pages quote the app's English labels (site-pages S17), but a few strings stay
 * Spanish in every interface language, such as the provider name “ChatGPT (tu suscripción)” (app v0.2.0
 * crates/plexustyping-ai/src/lib.rs:81), quoted with an English gloss. This marks every such quotation
 * with `<span lang="es">` at build time (src/middleware.ts), so screen readers switch voice, while the Markdown
 * sources stay plain text for /llms-full.txt. The English quotation marks stay outside the span.
 *
 * Only text between tags inside <body> changes: never attributes, the head, scripts, styles, code, or
 * simulation islands (<astro-island>), whose server HTML must match what Svelte hydrates. The simulations
 * on English pages are translated (site-pages S9) and set their own `lang`.
 */

/**
 * Quoted strings on the English pages that are Spanish because the English app shows them in Spanish
 * (app v0.2.0 crates/plexustyping-ai/src/lib.rs:81, the provider label). Every other quotation is English.
 */
export const SPANISH_QUOTES: ReadonlySet<string> = new Set(["ChatGPT (tu suscripción)"]);

/** Elements whose text is left as it is (raw text, code, or hydrated by an island). */
const SKIP = new Set(["script", "style", "code", "pre", "kbd", "textarea", "astro-island", "svg"]);

/** True for the English site's paths, with or without the built file's `.html`. */
export function isEnglishPath(pathname: string): boolean {
  return /^\/en(?:\.html)?$|^\/en\//.test(pathname);
}

const QUOTED = /“([^“”]+)”/g;

function markText(text: string): string {
  return text.replace(QUOTED, (whole, inner: string) =>
    SPANISH_QUOTES.has(inner) ? `“<span lang="es">${inner}</span>”` : whole,
  );
}

/** Wraps the Spanish quotations of an English page's <body> in lang="es" spans. Idempotent. */
export function markSpanishQuotes(html: string): string {
  const start = html.search(/<body[\s>]/);
  if (start < 0) return html;
  const head = html.slice(0, start);
  const parts = html.slice(start).split(/(<[^>]*>)/);
  const skipped: string[] = [];
  const out = parts.map((part, i) => {
    if (i % 2 === 1) {
      const tag = /^<(\/?)([a-zA-Z][\w-]*)/.exec(part);
      const name = tag?.[2]?.toLowerCase();
      if (!tag || !name || !SKIP.has(name) || part.endsWith("/>")) return part;
      if (tag[1]) {
        const at = skipped.lastIndexOf(name);
        if (at >= 0) skipped.length = at;
      } else skipped.push(name);
      return part;
    }
    // Text between tags; a quotation already wrapped is split by its own span tags, so it is never re-wrapped.
    return skipped.length === 0 && part.includes("“") ? markText(part) : part;
  });
  return head + out.join("");
}
