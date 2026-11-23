/**
 * Runs once per page at build time (static output): English pages get their quoted Spanish app labels
 * marked with lang="es" (src/lib/lang-es.ts, WCAG 3.1.2). Every other response passes through unchanged.
 */
import { defineMiddleware } from "astro:middleware";
import { isEnglishPath, markSpanishQuotes } from "./lib/lang-es";

export const onRequest = defineMiddleware(async (context, next) => {
  const response = await next();
  if (!isEnglishPath(context.url.pathname)) return response;
  if (!(response.headers.get("content-type") ?? "").includes("text/html")) return response;
  const html = await response.text();
  const headers = new Headers(response.headers);
  headers.delete("content-length");
  return new Response(markSpanishQuotes(html), { status: response.status, statusText: response.statusText, headers });
});
