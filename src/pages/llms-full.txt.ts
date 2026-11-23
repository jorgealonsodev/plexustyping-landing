// /llms-full.txt (PRD §10.2): the /llms.txt index plus the full Markdown of every documentation page.
import type { APIRoute } from "astro";
import { buildLlmsFullTxt } from "../components/prose/llms";
import { collectLlmsData } from "../components/prose/llms-data";

export const GET: APIRoute = async ({ site }) =>
  new Response(buildLlmsFullTxt(await collectLlmsData(site ?? new URL("https://example.com"))), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
