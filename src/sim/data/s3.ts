// S3 "Texto ilimitado" (PRD §8; app feature "Ilimitado", próxima versión 0.1.1): prerecorded data and the
// replay that drives the app's unlimited-text logic (src/sim/practice/unlimited.ts, copied from the app).
// Demostración: the texts are sentences of the app's Spanish corpus at app commit
// 14f64cf2b9619deca9d99c2dbb3a2358586c5390 (crates/plexustyping-corpus/data/es/sentences.txt), unchanged and
// joined by spaces as a prose text is. In the app the continuations come from the local corpus or an AI
// provider through the Rust core; here they are fixed and arrive on a schedule (see UnlimitedDemo).
// English pages: the same replay over sentences of the app's English corpus (./s3.en.ts, S3_PACKS.en).
import { type InputEvent, TypingSession } from "../practice/engine";
import { continuationPiece, shouldContinue } from "../practice/unlimited";
import { type Clock, ReplayDriver, type Script, type Typo, buildScript, toInput } from "../replay";
import type { Locale } from "../../i18n/paths";
import * as EN from "./s3.en";

/** The text the session starts with (the app's first text is about 600 chars; the demo's is shorter). */
export const START_TEXT =
  "Esta mañana he desayunado café con leche y una tostada con tomate. Mi hermana trabaja en una tienda de ropa cerca de la estación. El autobús llegó tarde porque había mucho tráfico en el centro.";

/** The continuations the "provider" returns, in order, before continuationPiece() trims and chains them. */
export const PIECES = [
  "Necesito comprar pan, huevos y fruta antes de volver a casa. Mañana lloverá por la tarde, así que llévate un paraguas.",
  "El perro del vecino ladra cada vez que pasa una bicicleta. Mi abuela prepara una sopa de verduras que huele de maravilla.",
];

/** The start text, then each piece as the app's continuationPiece() appends it (after a single space). */
function segmentsOf(start: string, pieces: string[]): string[] {
  const out = [start];
  let text = start;
  for (const piece of pieces) {
    const chained = continuationPiece([...text], piece);
    out.push(chained);
    text += chained;
  }
  return out;
}

/** The replay plays this many times faster than it was recorded ("reproducción acelerada"); the stats keep the recorded times. */
export const SPEED = 2.5;
/** Steps of the start text already typed when the loop starts again (a fresh text). */
export const LOOP_FROM = 0;
/** The first continuation is late: the cursor waits at the end, with "Generando más texto…", this long (ms). */
export const REPLY_WAIT_MS = 1600;
/** The second one arrives while this many chars remain ahead, so the text grows without a stop. */
const ARRIVES_AHEAD = [0, 24];
/** The last piece is typed up to this many chars before its end; then the demo rests and loads a new text. */
const LAST_LEFT = 40;
const REST_MS = 1800;
const REFRESH_MS = 700;
/** Recorded gap between the last keystroke of a piece and the first of the next one (ms). */
const GAP_MS = 160;
const MODE = "backspace-correct";

/** A corrected typo on the `offset`-th char of the first `word` of segment `segment`, typed as `typed`. */
export type SegmentTypo = [segment: number, word: string, offset: number, typed: string];

function typo(text: string, word: string, offset: number, typed: string): Typo {
  const at = text.indexOf(word);
  if (at < 0) throw new Error(`s3: "${word}" not in the text`);
  return { index: [...text.slice(0, at)].length + offset, typed, corrected: true };
}

/** One language's S3 texts and the scripts recorded over them. */
export interface UnlimitedPack {
  start: string;
  pieces: string[];
  segments: string[];
  /** One keystroke script per segment, recorded at a steady 78 PPM with a few corrected typos. */
  segmentScripts: Script[];
  /** The scripts the replay plays: faster, and the last one stops LAST_LEFT chars before its end. */
  played: Script[];
}

export function unlimitedPack(start: string, pieces: string[], typos: SegmentTypo[]): UnlimitedPack {
  const segments = segmentsOf(start, pieces);
  const segmentScripts = segments.map((text, i) =>
    buildScript(text, {
      seed: 310 + i,
      wpm: 78,
      typos: typos
        .filter(([seg]) => seg === i)
        .map(([, word, offset, typed]) => typo(text, word, offset, typed))
        .sort((a, b) => a.index - b.index),
    }),
  );
  const played = segmentScripts.map((script, i) => {
    let steps = script.steps;
    if (i === segmentScripts.length - 1) {
      const stop = [...script.text].length - LAST_LEFT;
      let cursor = 0;
      const end = steps.findIndex((s) => (cursor += s.event.kind === "char" ? 1 : -1) === stop);
      steps = steps.slice(0, end + 1);
    }
    return { ...script, steps: steps.map((s) => ({ ...s, atMs: s.atMs / SPEED })) };
  });
  return { start, pieces, segments, segmentScripts, played };
}

const ES_PACK = unlimitedPack(START_TEXT, PIECES, [
  [0, "tostada", 3, "r"],
  [0, "tráfico", 4, "g"],
  [1, "huevos", 2, "w"],
  [2, "bicicleta", 4, "x"],
]);

export const SEGMENTS: string[] = ES_PACK.segments;
export const SEGMENT_SCRIPTS: Script[] = ES_PACK.segmentScripts;

/** Spanish pages: the app's Spanish corpus; English pages: the app's English corpus (./s3.en.ts). */
export const S3_PACKS: Record<Locale, UnlimitedPack> = {
  es: ES_PACK,
  en: unlimitedPack(EN.START_TEXT, EN.PIECES, EN.TYPOS),
};

/**
 * The hint under the practice text. Copied verbatim from the app's src/features/practice/focus.ts
 * (`typingHint`, app commit 14f64cf); the rest of focus.ts is DOM focus handling the demo does not need.
 */
export function typingHint(started: boolean, isCode: boolean, unlimited = false): string {
  if (unlimited) return `${started ? "" : "Empieza a escribir cuando quieras · "}Esc terminar · F4 metrónomo · F6 menú`;
  if (started) return "Esc reinicia el texto · F4 metrónomo · F6 menú";
  return `Empieza a escribir cuando quieras · ${isCode ? "Intro = salto de línea · Tab = sangría · " : ""}Esc reinicia · F4 metrónomo · F6 menú`;
}

const timers: Clock = {
  set: (fn, ms) => setTimeout(fn, ms),
  clear: (handle) => clearTimeout(handle as ReturnType<typeof setTimeout>),
};

export interface DemoOptions {
  /** `prefers-reduced-motion: reduce`: the replay never starts on its own. */
  reducedMotion: boolean;
  clock?: Clock;
  /** Something changed; `event` is the keystroke just applied and `expected` the char it was typed for. */
  onChange?: (keystroke?: { event: InputEvent; expected: string | undefined }) => void;
  /** The texts and scripts to play: the Spanish ones by default. */
  pack?: UnlimitedPack;
}

/**
 * The S3 replay. It types the start text and, as in the app's Practice.svelte, asks for a continuation
 * from each keystroke when shouldContinue() holds (one at a time), keeps the cursor at the end while one
 * is under way ("Generando más texto…") and appends each one with session.extend(continuationPiece(…)).
 * Demo edit: the replies are prerecorded and timed (REPLY_WAIT_MS, ARRIVES_AHEAD) instead of awaited.
 */
export class UnlimitedDemo {
  readonly pack: UnlimitedPack;
  session: TypingSession;
  /** Continuations appended so far. */
  segment = 0;
  /** A continuation is under way (the app's `continuing`). */
  continuing = false;
  /** Cursor at which the current or last continuation was asked. */
  askedAt: number | null = null;
  /** The "Nuevo texto" arrows turn while the next loop's text loads. */
  refreshing = false;
  /** Recorded time of the latest keystroke (ms); the "Tiempo" clock reads it. */
  lastT = 0;
  readonly loopCursor = LOOP_FROM;
  #typing = 0;
  #offset = 0;
  #driver: ReplayDriver | null = null;
  #hold: { ms: number; fn: () => void; timer: unknown } | null = null;
  #playing = false;
  readonly #clock: Clock;

  constructor(private readonly options: DemoOptions) {
    this.#clock = options.clock ?? timers;
    this.pack = options.pack ?? ES_PACK;
    this.session = new TypingSession(this.pack.start, MODE);
    // The still state (no JavaScript, reduced motion): the start text typed to its end, waiting.
    this.#load();
    for (const step of this.pack.segmentScripts[0]!.steps) this.#apply(toInput(step));
    this.#drive(0, this.pack.played[0]!.steps.length);
    this.#segmentDone();
  }

  /** The cursor reached the end of the text: the app's "Generando más texto…" shows. */
  get waiting(): boolean {
    return this.session.completed;
  }

  get playing(): boolean {
    return this.#playing;
  }

  /** Starts on its own unless reduced motion is asked for; returns whether it started. */
  autoplay(): boolean {
    if (this.options.reducedMotion) return false;
    this.play();
    return true;
  }

  play(): void {
    this.#playing = true;
    this.#run();
  }

  pause(): void {
    this.#playing = false;
    this.#driver?.pause();
    if (this.#hold && this.#hold.timer !== null) {
      this.#clock.clear(this.#hold.timer);
      this.#hold.timer = null;
    }
  }

  /** A fresh start text at the loop's start (paused or playing as it was). */
  restart(): void {
    const playing = this.#playing;
    this.pause();
    this.#hold = null;
    this.refreshing = false;
    this.#load();
    for (const step of this.pack.segmentScripts[0]!.steps.slice(0, LOOP_FROM)) this.#apply(toInput(step));
    this.#drive(0, LOOP_FROM);
    this.options.onChange?.();
    if (playing) this.play();
  }

  #load() {
    this.session = new TypingSession(this.pack.start, MODE);
    this.segment = 0;
    this.continuing = false;
    this.askedAt = null;
    this.lastT = 0;
    this.#offset = 0;
  }

  /** Practice.svelte's applyEvent, for the parts the demo shows. */
  #apply(event: InputEvent) {
    const s = this.session;
    // At the end of the text keys wait for the continuation; they are neither applied nor recorded.
    if (s.completed) return;
    const expected = s.chars[s.cursor];
    if (!s.apply(event)) return;
    this.lastT = event.tMs;
    this.#maybeContinue();
    this.#arrives();
    this.options.onChange?.({ event, expected });
  }

  /** Practice.svelte's maybeContinue: one continuation at a time, when shouldContinue() holds. */
  #maybeContinue() {
    const s = this.session;
    if (!shouldContinue({ cursor: s.cursor, length: s.chars.length, pending: this.continuing, retryFrom: 0 })) return;
    this.continuing = true;
    this.askedAt = s.cursor;
  }

  /** Demo edit: a prerecorded reply that comes before the end arrives once ARRIVES_AHEAD chars remain. */
  #arrives() {
    const s = this.session;
    const ahead = ARRIVES_AHEAD[this.segment] ?? 0;
    if (this.continuing && this.segment < this.pack.pieces.length && ahead > 0 && s.chars.length - s.cursor <= ahead) this.#append();
  }

  /** The reply arrived: the piece is appended after a single space and typing goes on. */
  #append() {
    const piece = continuationPiece(this.session.chars, this.pack.pieces[this.segment]!);
    this.continuing = false;
    this.session.extend(piece);
    this.segment++;
    this.#maybeContinue();
    this.options.onChange?.();
  }

  #drive(index: number, from = 0) {
    this.#typing = index;
    this.#driver = new ReplayDriver(
      this.pack.played[index]!,
      (e) => this.#apply({ ...e, tMs: this.#offset + Math.round(e.tMs * SPEED) }),
      { reducedMotion: this.options.reducedMotion, clock: this.#clock, from, onDone: () => this.#segmentDone() },
    );
  }

  /** A piece's keystrokes ran out: type the next one, after its continuation if it has not arrived yet. */
  #segmentDone() {
    const index = this.#typing;
    if (index + 1 >= this.pack.played.length) {
      this.#later(REST_MS, () => {
        this.refreshing = true;
        this.options.onChange?.();
        this.#later(REFRESH_MS, () => this.restart());
      });
      return;
    }
    const next = (gap: number) => {
      this.#offset = this.lastT + gap;
      this.#drive(index + 1);
      this.#run();
    };
    if (this.segment > index) next(GAP_MS);
    else
      this.#later(REPLY_WAIT_MS, () => {
        this.#append();
        next(REPLY_WAIT_MS * SPEED);
      });
  }

  #later(ms: number, fn: () => void) {
    this.#hold = { ms, fn, timer: null };
    this.#run();
  }

  #run() {
    if (!this.#playing) return;
    const hold = this.#hold;
    if (!hold) {
      this.#driver?.play();
      return;
    }
    if (hold.timer !== null) return;
    hold.timer = this.#clock.set(() => {
      if (this.#hold === hold) this.#hold = null;
      hold.fn();
    }, hold.ms);
  }
}
