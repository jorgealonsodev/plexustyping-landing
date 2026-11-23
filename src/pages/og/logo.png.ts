// The keycap logo as a 512×512 PNG, the Organization logo of the home's JSON-LD.
import type { APIRoute } from "astro";
import { renderLogoPng } from "../../lib/og/render";

export const GET: APIRoute = async () =>
  new Response(new Uint8Array(await renderLogoPng()), { headers: { "Content-Type": "image/png" } });
