import { createHash } from "node:crypto";

/**
 * Inline, render-blocking theme script (the only client JavaScript of the base pages).
 * Follows prefers-color-scheme until the visitor picks a theme; the choice is stored locally and
 * applied before first paint. Also wires every [data-theme-toggle] button by event delegation.
 * It is inlined verbatim, so Astro's CSP cannot hash it on its own: THEME_SCRIPT_HASH is added
 * to script-src by the layout.
 */
export const THEME_SCRIPT = `(()=>{const d=document.documentElement,k="theme";let s=null;try{s=localStorage.getItem(k)}catch{}if(s==="light"||s==="dark")d.dataset.theme=s;d.classList.add("js");const c=()=>d.dataset.theme||(matchMedia("(prefers-color-scheme: light)").matches?"light":"dark");const y=()=>{for(const b of document.querySelectorAll("[data-theme-toggle]"))b.setAttribute("aria-pressed",String(c()==="dark"))};document.addEventListener("DOMContentLoaded",y);document.addEventListener("click",e=>{const b=e.target instanceof Element&&e.target.closest("[data-theme-toggle]");if(!b)return;d.dataset.theme=c()==="dark"?"light":"dark";try{localStorage.setItem(k,d.dataset.theme)}catch{}y()})})();`;

export const THEME_SCRIPT_HASH = `sha256-${createHash("sha256").update(THEME_SCRIPT).digest("base64")}` as const;
