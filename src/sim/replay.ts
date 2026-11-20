// Recorded replay of the S1 demo: a script of keystrokes with a human rhythm, a few typos and their
// corrections, and a driver that feeds it, on a timer, into the app's TypingSession (practice/engine.ts).
// Website-only code: the app has no replay; it is what types when the visitor does not.
import type { InputEvent } from "./practice/engine";

export type ScriptEvent = { kind: "char"; ch: string } | { kind: "backspace" };

export interface ReplayStep {
  /** Script time of the keystroke in ms; the first one is at 0. Also the event's `tMs`. */
  atMs: number;
  event: ScriptEvent;
}

export interface Script {
  text: string;
  steps: ReplayStep[];
  /** Wrong keystrokes typed (the session's `errors`). */
  errors: number;
  /** Indices left wrong at the end (the session's uncorrected errors), ascending. */
  uncorrected: number[];
}

export interface Typo {
  /** Index of the char typed wrong. */
  index: number;
  /** The char typed instead. */
  typed: string;
  /** Noticed after the next char: two backspaces, then both chars again. */
  corrected: boolean;
}

export interface ScriptOptions {
  /** Seed of the rhythm's jitter: the same seed gives the same script. */
  seed: number;
  /** Mean typing speed in words (5 chars) per minute. */
  wpm: number;
  typos: Typo[];
  /** Extra time before typing `ch` (e.g. a Shift or dead-key sequence), in ms. */
  extraMs?: (ch: string) => number;
}

/** mulberry32: a small deterministic PRNG in [0, 1). */
function random(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** A keystroke script that types `text` once, with the given typos. */
export function buildScript(text: string, { seed, wpm, typos, extraMs = () => 0 }: ScriptOptions): Script {
  const chars = [...text];
  const at = (i: number) => chars[i] ?? "";
  const rnd = random(seed);
  const mean = 60_000 / (wpm * 5);
  const steps: ReplayStep[] = [];
  let t = 0;
  const push = (event: ScriptEvent, gap: number) => {
    if (steps.length > 0) t += Math.round(gap);
    steps.push({ atMs: t, event });
  };
  /** Gap before typing chars[i], after chars[i - 1]. */
  const gapBefore = (i: number) => {
    let gap = mean * (0.65 + rnd() * 0.7);
    const prev = chars[i - 1];
    if (prev === " ") gap += 30 + rnd() * 60;
    if (prev && ".,;:?!".includes(prev)) gap += 180 + rnd() * 220;
    return gap + extraMs(at(i));
  };
  const byIndex = new Map(typos.map((typo) => [typo.index, typo]));
  const uncorrected: number[] = [];
  for (let i = 0; i < chars.length; i++) {
    const typo = byIndex.get(i);
    if (!typo) {
      push({ kind: "char", ch: at(i) }, gapBefore(i));
      continue;
    }
    byIndex.delete(i);
    push({ kind: "char", ch: typo.typed }, gapBefore(i));
    if (!typo.corrected || i + 1 >= chars.length) {
      uncorrected.push(i);
      continue;
    }
    // Noticed one char later: a pause, two backspaces, then the right char and the next one again.
    push({ kind: "char", ch: at(i + 1) }, gapBefore(i + 1));
    push({ kind: "backspace" }, 320 + rnd() * 200);
    push({ kind: "backspace" }, 110 + rnd() * 40);
    push({ kind: "char", ch: at(i) }, 160 + rnd() * 80 + extraMs(at(i)));
    push({ kind: "char", ch: at(i + 1) }, gapBefore(i + 1));
    i += 1;
  }
  return { text, steps, errors: typos.length, uncorrected };
}

/** The event a step sends to the session. */
export const toInput = (step: ReplayStep): InputEvent =>
  step.event.kind === "char" ? { kind: "char", ch: step.event.ch, tMs: step.atMs } : { kind: "backspace", tMs: step.atMs };

/** Timers of the driver; tests pass a fake one. */
export interface Clock {
  set(fn: () => void, ms: number): unknown;
  clear(handle: unknown): void;
}

/** The timer handle while a step is being sent: a pause from inside the sink stops the next one. */
const SENDING = Symbol("sending");

const timers: Clock = {
  set: (fn, ms) => setTimeout(fn, ms),
  clear: (handle) => clearTimeout(handle as ReturnType<typeof setTimeout>),
};

export interface DriverOptions {
  /** `prefers-reduced-motion: reduce`: the replay never starts on its own. */
  reducedMotion: boolean;
  clock?: Clock;
  /** The last step was sent. */
  onDone?: () => void;
  /** Index of the first step to send (the earlier ones were applied already). */
  from?: number;
}

/** Sends a script's steps to `sink` at the script's pace; pausable, and never autoplays under reduced motion. */
export class ReplayDriver {
  #pos: number;
  #timer: unknown = null;
  readonly #clock: Clock;

  constructor(
    readonly script: Script,
    private readonly sink: (event: InputEvent) => void,
    private readonly options: DriverOptions,
  ) {
    this.#clock = options.clock ?? timers;
    this.#pos = options.from ?? 0;
  }

  get playing(): boolean {
    return this.#timer !== null;
  }

  get done(): boolean {
    return this.#pos >= this.script.steps.length;
  }

  /** Starts on its own unless reduced motion is asked for; returns whether it started. */
  autoplay(): boolean {
    if (this.options.reducedMotion) return false;
    this.play();
    return this.playing;
  }

  /** Starts or resumes (a visitor's choice: also under reduced motion). */
  play(): void {
    if (this.playing || this.done) return;
    const { steps } = this.script;
    const prev = steps[this.#pos - 1];
    const next = steps[this.#pos];
    this.#schedule(prev && next ? next.atMs - prev.atMs : 0);
  }

  pause(): void {
    if (this.#timer !== null && this.#timer !== SENDING) this.#clock.clear(this.#timer);
    this.#timer = null;
  }

  #schedule(delay: number) {
    this.#timer = this.#clock.set(() => {
      const { steps } = this.script;
      const step = steps[this.#pos++];
      if (!step) return;
      this.#timer = SENDING;
      this.sink(toInput(step));
      if (this.#timer !== SENDING) return;
      this.#timer = null;
      if (this.done) this.options.onDone?.();
      else this.#schedule((steps[this.#pos]?.atMs ?? step.atMs) - step.atMs);
    }, delay);
  }
}
