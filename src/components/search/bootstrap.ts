import { createHash } from "node:crypto";

/**
 * Loader of the documentation search (PRD §7, spec S5): the only script a docs page carries besides
 * the theme script. It does nothing until a [data-search-open] trigger is clicked; then it imports
 * the search module named by the trigger's data-module (search-ui.js, which loads Pagefind) and
 * opens the dialog. So no search JavaScript, index or WebAssembly is fetched before the search is
 * opened. Inlined verbatim, so its hash is added to script-src by DocsSearch.astro.
 */
export const SEARCH_BOOTSTRAP = `document.addEventListener("click",e=>{const b=e.target instanceof Element&&e.target.closest("[data-search-open]");if(!b)return;e.preventDefault();import(b.dataset.module).then(m=>m.open(b)).catch(()=>{b.dataset.failed=""})});`;

export const SEARCH_BOOTSTRAP_HASH = `sha256-${createHash("sha256").update(SEARCH_BOOTSTRAP).digest("base64")}` as const;
