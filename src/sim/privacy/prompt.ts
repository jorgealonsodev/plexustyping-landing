// What the PlexusTyping app sends to an AI provider for a prose text, ported to TypeScript for the S9 demo.
// The app builds it in Rust (no Rust at the website's build time), so this is a faithful port, not a copy:
// - buildProsePrompt: crates/plexustyping-ai/src/prompt.rs `build_prompt`, the prose branch of a new text
//   (no continuation, no progressive-unlock restriction), with its `language_name`;
// - aiLength: src-tauri/src/commands.rs `ai_length`;
// - sourceLabel: src/features/practice/prefetch.ts `sourceLabel` and `PROVIDER_NAMES` for an AI text
//   without a model name;
// all at app commit 14f64cf2b9619deca9d99c2dbb3a2358586c5390. tests/sim-s9.test.ts repeats the app's own
// expected prompt (prompt.rs test `prose_prompt_only_asks_for_a_text_in_the_language`).

/** A `Range<usize>`: `end` exclusive. */
export interface Range {
  start: number;
  end: number;
}

/** The fields of a prose `GenerationRequest` that reach the prompt. */
export interface ProseRequest {
  /** Language code, e.g. `"es"` or `"en-US"`. */
  language: string;
  length: Range;
  /** Optional topic; `null` means free topic. */
  topic: string | null;
}

/** Accepted length of an AI prose text for a chosen `length`: 80 % to 125 % of it, end exclusive. */
export const aiLength = (length: number): Range => ({
  start: Math.floor((length * 4) / 5),
  end: Math.floor((length * 5) / 4) + 1,
});

/** Spanish name of a language code (`es`, `en-US`, `pt_BR`...); unknown codes are used as given. */
function languageName(code: string): string {
  const base = (code.trim().split(/[-_]/)[0] ?? "").toLowerCase();
  const names: Record<string, string> = {
    es: "español",
    en: "inglés",
    fr: "francés",
    de: "alemán",
    pt: "portugués",
    it: "italiano",
  };
  return names[base] ?? code.trim();
}

/** The prompt of a new prose text: only the language, the length range and the topic. */
export function buildProsePrompt(req: ProseRequest): string {
  const ANSWER = 'Responde solo con JSON: {"text": "..."}';
  const language = languageName(req.language);
  const longest = Math.max(req.length.end - 1, req.length.start);
  const topic = (req.topic ?? "").split(/\s+/).filter(Boolean).join(" ") || "libre";
  return [
    `Escribe un texto en ${language} de ${req.length.start}–${longest} caracteres.`,
    `Tema: ${topic}.`,
    "No empieces con «El» ni con «La».",
    ANSWER,
  ].join("\n");
}

const PROVIDER_NAMES: Record<string, string> = {
  claude: "Claude",
  openai: "OpenAI",
  gemini: "Gemini",
  "opencode-go": "OpenCode Go",
  chatgpt: "ChatGPT",
};

/** The label above an AI text of `provider` (no model name). */
export const sourceLabel = (provider: string) => ["Generado con IA", PROVIDER_NAMES[provider] ?? provider].join(" · ");
