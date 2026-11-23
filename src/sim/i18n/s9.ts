// Strings of the S9 "IA con privacidad" simulation (src/components/sims/S9Privacy.svelte). Every statement
// comes from the app (PRD §6.3; the app's README "Privacy" and "Keys"; prompt.rs): the website's words
// around a diagram. The prompt shown inside it is app data, in Spanish as the app sends it.
import type { Locale } from "../../i18n/paths";
import type { FieldKey, Kind, Node } from "../data/s9";

export interface S9Strings {
  play: string;
  pause: string;
  description: string;
  paused: string;
  playing: string;
  windowTitle: string;
  caption: string;
  /** The prose / code switch: its group name and options. */
  kindLabel: string;
  kinds: Record<Kind, string>;
  /** The three boxes: a name and what is true of each. */
  nodes: Record<Node, { name: string; note: string }>;
  /** Each hop's step, in PHASES order. */
  steps: string[];
  /** Title over the ordered list of steps. */
  stepsTitle: string;
  /** What is sent, its field names and sample values per kind. */
  sentTitle: string;
  fields: Record<FieldKey, string>;
  values: Record<Kind, Partial<Record<FieldKey, string>>>;
  /** The prompt panel (prose). */
  promptTitle: string;
  promptNote: string;
  /** The label the text then shows: the app's sourceLabel() (translated on the English site). */
  reply: string;
  /** What travels on each hop, in PHASES order. */
  packets: string[];
  /** What never leaves this computer (keys do go to their provider, so they are not listed). */
  keptTitle: string;
  kept: string[];
}

export const S9_STRINGS: Record<Locale, S9Strings> = {
  es: {
    play: "Reproducir",
    pause: "Pausar",
    description:
      "Demostración con datos de ejemplo: qué sale hacia el proveedor de IA cuando PlexusTyping pide un texto. La interfaz no tiene acceso a la red: pide el siguiente texto al núcleo en Rust, que lee la clave del llavero del sistema y envía la petición al proveedor. En prosa solo viajan el idioma, la longitud y el tema; en código, también el lenguaje, los caracteres objetivo y los caracteres permitidos. Lo que escribes nunca sale de tu equipo. El proveedor responde con el texto, el núcleo lo valida y la interfaz lo muestra como «Generado con IA · Claude».",
    paused: "Demostración en pausa.",
    playing: "Reproduciendo la demostración.",
    windowTitle: "PlexusTyping · demostración",
    caption:
      "IA con privacidad: las peticiones salen solo del núcleo en Rust y solo con lo necesario para escribir el texto. Datos de ejemplo.",
    kindLabel: "Tipo de texto",
    kinds: { prose: "Prosa", code: "Código" },
    nodes: {
      ui: { name: "Interfaz", note: "Sin acceso a la red" },
      core: { name: "Núcleo en Rust", note: "Claves en el llavero del sistema" },
      provider: { name: "Proveedor de IA", note: "Claude, OpenAI, Gemini, OpenCode Go o ChatGPT" },
    },
    stepsTitle: "Cómo llega un texto con IA",
    steps: [
      "Mientras escribes, la interfaz pide el siguiente texto al núcleo.",
      "El núcleo lee la clave del llavero y envía la petición al proveedor.",
      "El proveedor responde solo con el texto.",
      "El núcleo valida el texto y la interfaz lo muestra.",
    ],
    sentTitle: "Lo que se envía",
    fields: {
      language: "Idioma",
      codeLanguage: "Lenguaje",
      length: "Longitud",
      topic: "Tema",
      targets: "Caracteres objetivo",
      allowed: "Caracteres permitidos",
    },
    values: {
      prose: { language: "español", length: "240–375 caracteres", topic: "un viaje en tren" },
      code: {
        language: "español (comentarios)",
        codeLanguage: "Rust",
        length: "la elegida",
        topic: "un viaje en tren",
        targets: "( ) ;",
        allowed: "los de tu distribución de teclado",
      },
    },
    promptTitle: "La petición, tal cual",
    promptNote:
      "Con el desbloqueo progresivo se añaden los caracteres permitidos y, en «Ilimitado», el final del texto ya generado. En código pide además un fragmento de 5 a 20 líneas con los caracteres objetivo.",
    reply: "Generado con IA · Claude",
    packets: ["Siguiente texto", "Petición", '{"text": "…"}', "Texto validado"],
    keptTitle: "Nunca sale de tu equipo",
    kept: ["Lo que escribes"],
  },
  en: {
    play: "Play",
    pause: "Pause",
    description:
      "Demo with sample data: what goes to the AI provider when PlexusTyping asks for a text. The interface has no network access: it asks the Rust core for the next text, and the core reads the key from the system keychain and sends the request to the provider. For prose only the language, the length and the topic travel; for code, also the programming language, the target characters and the allowed characters. What you type never leaves your computer. The provider answers with the text, the core validates it and the interface shows it as “Generated with AI · Claude”. Inside the demo the app shows its English interface.",
    paused: "Demo paused.",
    playing: "Playing the demo.",
    windowTitle: "PlexusTyping · demo",
    caption:
      "Private AI: requests leave only from the Rust core, carrying only what the text needs. Sample data.",
    kindLabel: "Text type",
    kinds: { prose: "Prose", code: "Code" },
    nodes: {
      ui: { name: "Interface", note: "No network access" },
      core: { name: "Rust core", note: "Keys in the system keychain" },
      provider: { name: "AI provider", note: "Claude, OpenAI, Gemini, OpenCode Go or ChatGPT" },
    },
    stepsTitle: "How an AI text arrives",
    steps: [
      "While you type, the interface asks the core for the next text.",
      "The core reads the key from the keychain and sends the request to the provider.",
      "The provider answers with the text only.",
      "The core validates the text and the interface shows it.",
    ],
    sentTitle: "What is sent",
    fields: {
      language: "Language",
      codeLanguage: "Programming language",
      length: "Length",
      topic: "Topic",
      targets: "Target characters",
      allowed: "Allowed characters",
    },
    values: {
      prose: { language: "English", length: "240–375 characters", topic: "a train journey" },
      code: {
        language: "English (comments)",
        codeLanguage: "Rust",
        length: "the one you chose",
        topic: "a train journey",
        targets: "( ) ;",
        allowed: "those of your keyboard layout",
      },
    },
    promptTitle: "The request, as sent",
    promptNote:
      "With progressive unlock the allowed characters are added and, in “Unlimited” length, the end of the text already generated. For code it also asks for a 5 to 20 line snippet with the target characters. The app writes its requests in Spanish.",
    reply: "Generated with AI · Claude",
    packets: ["Next text", "Request", '{"text": "…"}', "Validated text"],
    keptTitle: "Never leaves your computer",
    kept: ["What you type"],
  },
};
