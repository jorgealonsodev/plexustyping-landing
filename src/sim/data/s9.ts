// Prerecorded data of the S9 "IA con privacidad" demo (src/components/sims/S9Privacy.svelte): one request
// for the next text, from the interface to the Rust core, from the core to the provider, and the reply back.
// What travels follows the app (PRD §6.3, README "Privacy", crates/plexustyping-ai/src/prompt.rs at app
// commit 14f64cf2b9619deca9d99c2dbb3a2358586c5390): in prose only the language, the length and the topic;
// in code also the code language, the targets and the allowed characters. What you type never leaves.
// The request itself (a 300-character text about a train journey, answered by Claude) is a sample.
import type { Locale } from "../../i18n/paths";
import { type ProseRequest, aiLength, buildProsePrompt } from "../privacy/prompt";
import type { Clock } from "../replay";

export type Kind = "prose" | "code";
export type Node = "ui" | "core" | "provider";
export type FieldKey = "language" | "codeLanguage" | "length" | "topic" | "targets" | "allowed";

/** The request fields that leave for the provider, in the order the prompt names them. */
export function sentFields(kind: Kind): { key: FieldKey }[] {
  const keys: FieldKey[] =
    kind === "prose" ? ["language", "length", "topic"] : ["language", "codeLanguage", "length", "topic", "targets", "allowed"];
  return keys.map((key) => ({ key }));
}

/** The four hops of one generated text, each shown for `ms`. */
export const PHASES: { from: Node; to: Node; ms: number }[] = [
  { from: "ui", to: "core", ms: 3200 },
  { from: "core", to: "provider", ms: 4200 },
  { from: "provider", to: "core", ms: 2800 },
  { from: "core", to: "ui", ms: 3200 },
];

/** The overview between two rounds, in ms. */
export const REST_MS = 3000;

/** The sample provider of the demo (prefetch.ts PROVIDER_NAMES id). */
export const PROVIDER = "claude";

/** The sample request of each site language and the prose prompt the app builds for it. */
export const SCENARIOS: Record<Locale, { request: ProseRequest; prompt: string }> = (() => {
  const make = (request: ProseRequest) => ({ request, prompt: buildProsePrompt(request) });
  return {
    es: make({ language: "es", length: aiLength(300), topic: "un viaje en tren" }),
    en: make({ language: "en", length: aiLength(300), topic: "a train journey" }),
  };
})();

export interface PrivacyDemoOptions {
  /** `prefers-reduced-motion: reduce`: the demo never starts on its own. */
  reducedMotion: boolean;
  clock?: Clock;
  /** The shown phase changed (`null`: the overview). */
  onChange?: (phase: number | null) => void;
}

const timers: Clock = {
  set: (fn, ms) => setTimeout(fn, ms),
  clear: (handle) => clearTimeout(handle as ReturnType<typeof setTimeout>),
};

/** Steps through PHASES, rests in the overview and loops; pausable, never autoplays under reduced motion. */
export class PrivacyDemo {
  /** The hop shown, or `null` for the overview (every flow at once: the still state). */
  phase: number | null = null;
  kind: Kind = "prose";
  #timer: unknown = null;
  #running = false;
  readonly #clock: Clock;

  constructor(private readonly options: PrivacyDemoOptions) {
    this.#clock = options.clock ?? timers;
  }

  get playing(): boolean {
    return this.#running;
  }

  autoplay(): boolean {
    if (this.options.reducedMotion) return false;
    this.play();
    return this.playing;
  }

  /** Runs from the phase shown (the overview goes on to the first hop at once). */
  play(): void {
    if (this.#running) return;
    this.#running = true;
    if (this.phase === null) this.#show(0);
    this.#arm();
  }

  pause(): void {
    this.#running = false;
    if (this.#timer !== null) this.#clock.clear(this.#timer);
    this.#timer = null;
  }

  /** Prose or code: the round starts again (or the overview, while paused). */
  setKind(kind: Kind): void {
    this.kind = kind;
    if (this.#timer !== null) this.#clock.clear(this.#timer);
    this.#timer = null;
    this.#show(this.#running ? 0 : null);
    if (this.#running) this.#arm();
  }

  #show(phase: number | null) {
    this.phase = phase;
    this.options.onChange?.(phase);
  }

  #arm() {
    const ms = this.phase === null ? REST_MS : PHASES[this.phase]!.ms;
    this.#timer = this.#clock.set(() => {
      this.#timer = null;
      const next = this.phase === null ? 0 : this.phase + 1 < PHASES.length ? this.phase + 1 : null;
      this.#show(next);
      if (this.#running) this.#arm();
    }, ms);
  }
}
