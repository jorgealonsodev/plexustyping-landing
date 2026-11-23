// Prerecorded data of the S10 "Accesibilidad" demo (src/components/sims/S10Accessibility.svelte).
//
// Texts: one corpus sentence of each site language, copied unchanged from the PlexusTyping app at commit
// 14f64cf2b9619deca9d99c2dbb3a2358586c5390: crates/plexustyping-corpus/data/es/sentences.txt ("Este
// verano…", also in texts.ts) and crates/plexustyping-corpus/data/en/sentences.txt ("My sister works…").
// The replay types each with one corrected typo; the screen reader mode's messages come from the app's
// announce.ts (Spanish) or its translation (English), wired as Practice.svelte wires them.
import type { Locale } from "../../i18n/paths";
import { ANNOUNCERS } from "../a11y/announcers";
import { type InputEvent, TypingSession } from "../practice/engine";
import { type Clock, ReplayDriver, type Script, buildScript, toInput } from "../replay";

/** Steps already typed in the still state (server render, reduced motion): past the corrected typo. */
export const STILL_STEPS = 22;
/** Pause after a finished text before it starts again, in ms. */
export const REST_MS = 2600;
/** Messages kept in the visible transcript, the latest last. */
export const TRANSCRIPT_SIZE = 5;

interface DemoText {
  text: string;
  typo: { index: number; expected: string; typed: string };
  script: Script;
}

function demoText(text: string, index: number, typed: string, seed: number): DemoText {
  const script = buildScript(text, { seed, wpm: 34, typos: [{ index, typed, corrected: true }] });
  return { text, typo: { index, expected: [...text][index]!, typed }, script };
}

export const TEXTS: Record<Locale, DemoText> = {
  es: demoText("Este verano queremos ir a la montaña con unos amigos.", 5, "b", 4),
  en: demoText("My sister works in a small bookshop near the train station.", 10, "q", 6),
};

export interface A11yDemoOptions {
  locale: Locale;
  /** `prefers-reduced-motion: reduce`: the replay never starts on its own. */
  reducedMotion: boolean;
  clock?: Clock;
  /** Start in the still state (default) or at the text's first char. */
  still?: boolean;
  /** A keystroke was applied (`null`: a new text). */
  onChange?: (keystroke: { event: InputEvent; expected: string | undefined } | null) => void;
}

const timers: Clock = {
  set: (fn, ms) => setTimeout(fn, ms),
  clear: (handle) => clearTimeout(handle as ReturnType<typeof setTimeout>),
};

/**
 * The S10 demo: the app's TypingSession over the text, typed by the replay, and the screen reader mode's
 * polite announcements collected in a transcript (silent while the mode is off, as in the app).
 */
export class A11yDemo {
  session!: TypingSession;
  /** The latest announcements, oldest first. */
  transcript: string[] = [];
  screenReader = true;
  /** Time of the latest applied event, the live stats' clock. */
  lastT = 0;
  /** Every announcement made (tests and the island's own hooks). */
  onAnnounce: ((message: string) => void) | null = null;
  #driver: ReplayDriver | null = null;
  #rest: { timer: unknown } | null = null;
  #running = false;
  readonly #clock: Clock;

  constructor(private readonly options: A11yDemoOptions) {
    this.#clock = options.clock ?? timers;
    this.#start(options.still === false ? 0 : STILL_STEPS);
  }

  get playing(): boolean {
    return this.#running;
  }

  get #say() {
    return ANNOUNCERS[this.options.locale];
  }

  get #text() {
    return TEXTS[this.options.locale];
  }

  autoplay(): boolean {
    if (this.options.reducedMotion) return false;
    this.play();
    return this.playing;
  }

  play(): void {
    if (this.#running) return;
    this.#running = true;
    if (this.#rest) this.#armRest();
    else this.#driver?.play();
  }

  pause(): void {
    this.#running = false;
    this.#driver?.pause();
    if (this.#rest?.timer != null) {
      this.#clock.clear(this.#rest.timer);
      this.#rest.timer = null;
    }
  }

  /** The "Anunciar con lector de pantalla" setting: off, nothing is announced and the transcript clears. */
  setScreenReader(on: boolean): void {
    this.screenReader = on;
    if (!on) this.transcript = [];
  }

  #announce(message: string) {
    if (!this.screenReader || !message) return;
    this.transcript = [...this.transcript, message].slice(-TRANSCRIPT_SIZE);
    this.onAnnounce?.(message);
  }

  #start(steps: number) {
    const { text, script } = this.#text;
    this.session = new TypingSession(text, "backspace-correct");
    this.#announce(this.#say.newTextMessage(this.session.chars));
    for (const step of script.steps.slice(0, steps)) this.#apply(toInput(step), false);
    this.lastT = script.steps[steps - 1]?.atMs ?? 0;
    this.#driver?.pause();
    this.#driver = new ReplayDriver(script, (e) => this.#apply(e, true), {
      reducedMotion: this.options.reducedMotion,
      clock: this.#clock,
      from: steps,
      onDone: () => this.#done(),
    });
    this.options.onChange?.(null);
  }

  /** Practice.svelte's applyEvent and its announcement. */
  #apply(event: InputEvent, notify: boolean) {
    const expected = this.session.chars[this.session.cursor];
    const before = this.session.cursor;
    if (!this.session.apply(event)) return;
    this.lastT = event.tMs;
    const record = event.kind === "backspace" ? undefined : this.session.lastRecord;
    const wrong = record && !record.correct ? record : null;
    this.#announce(this.#say.keystrokeMessage(wrong, this.session.chars[this.session.cursor], this.session.cursor !== before));
    if (notify) this.options.onChange?.({ event, expected });
  }

  #done() {
    this.#announce(this.#say.resultMessage(this.session.result().stats));
    this.#rest = { timer: null };
    if (this.#running) this.#armRest();
  }

  #armRest() {
    const rest = this.#rest!;
    rest.timer = this.#clock.set(() => {
      this.#rest = null;
      this.#start(0);
      if (this.#running) this.#driver?.play();
    }, REST_MS);
  }
}
