// S4 "Sesión fantasma" (PRD §8): prerecorded data and the replay that races the app's ghost logic
// (src/sim/practice/ghost.ts, copied from the app). Demostración: the text is two sentences of the app's
// Spanish corpus at app commit 14f64cf2b9619deca9d99c2dbb3a2358586c5390
// (crates/plexustyping-corpus/data/es/sentences.txt), unchanged, joined by a space. The record (the ghost)
// and the new session are synthetic keystroke scripts; in the app the record comes from the profile's
// history through the `ghost_for_text` command. English pages: the same race over two sentences of the app's
// English corpus (./s4.en.ts, S4_PACKS.en), with the result's record lines translated.
import { type InputEvent, TypingSession } from "../practice/engine";
import { type Ghost, GhostRace, ghostPosition, recordLines } from "../practice/ghost";
import { type Clock, ReplayDriver, type Script, type Typo, buildScript, toInput } from "../replay";
import type { Locale } from "../../i18n/paths";
import * as EN from "./s4.en";

export const GHOST_TEXT =
  "Hemos plantado tomates, pimientos y lechugas en el huerto. Me encanta el olor de la tierra mojada después de la lluvia.";

const MODE = "backspace-correct";
/** The results stay on screen this long before the race starts again (ms). */
const RESULTS_MS = 5200;

function typo(text: string, word: string, offset: number, typed: string): Typo {
  const at = text.indexOf(word);
  if (at < 0) throw new Error(`s4: "${word}" not in the text`);
  return { index: [...text.slice(0, at)].length + offset, typed, corrected: true };
}

/** What `ghost_for_text` returns for a script: its net PPM and the ms at which it first passed each position. */
function ghostOf(script: Script): Ghost {
  const session = new TypingSession(script.text, MODE);
  const times: (number | null)[] = [...script.text].map(() => null);
  let reached = 0;
  for (const step of script.steps) {
    session.apply(toInput(step));
    while (reached < session.cursor) times[reached++] = step.atMs - (session.firstT ?? step.atMs);
  }
  return { sessionId: 1, netWpm: session.result().stats.netWpm, times };
}

/** A corrected typo on the `offset`-th char of the first `word`, typed as `typed`. */
export type WordTypo = [word: string, offset: number, typed: string];

/** One language's race: the text, the record (the ghost) and the session racing it. */
export interface GhostPack {
  text: string;
  /** The earlier best session with this text. */
  ghostScript: Script;
  ghost: Ghost;
  race: Script;
  /** Steps of the race typed in the still state. */
  stillSteps: number;
}

/**
 * The race over `text`: a steady record at 72 PPM with `ghostTypos`, and a session at 80 PPM with `raceTypos`
 * (a slow start with corrections, then faster than the record). The still state stops before `stillWord`.
 */
export function ghostPack(text: string, ghostTypos: WordTypo[], raceTypos: WordTypo[], stillWord: string): GhostPack {
  const typos = (list: WordTypo[]) => list.map(([w, o, t]) => typo(text, w, o, t)).sort((a, b) => a.index - b.index);
  const ghostScript = buildScript(text, { seed: 4101, wpm: 72, typos: typos(ghostTypos) });
  const race = buildScript(text, { seed: 4217, wpm: 80, typos: typos(raceTypos) });
  const target = [...text.slice(0, text.indexOf(stillWord))].length;
  let cursor = 0;
  const stillSteps = race.steps.findIndex((s) => (cursor += s.event.kind === "char" ? 1 : -1) === target) + 1;
  return { text, ghostScript, ghost: ghostOf(ghostScript), race, stillSteps };
}

const ES_PACK = ghostPack(GHOST_TEXT, [["lechugas", 3, "x"]], [["plantado", 3, "m"], ["tomates", 2, "n"]], "lechugas");

export const GHOST_SCRIPT: Script = ES_PACK.ghostScript;
export const RACE_SCRIPT: Script = ES_PACK.race;
export const GHOST: Ghost = ES_PACK.ghost;
/** Steps of the race typed in the still state (no JavaScript, reduced motion): up to "lechugas", ahead. */
export const STILL_STEPS = ES_PACK.stillSteps;

/** Spanish pages: the app's Spanish corpus; English pages: the app's English corpus (./s4.en.ts). */
export const S4_PACKS: Record<Locale, GhostPack> = {
  es: ES_PACK,
  en: ghostPack(EN.GHOST_TEXT, EN.GHOST_TYPOS, EN.RACE_TYPOS, EN.STILL_WORD),
};

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
  /** The race to play: the Spanish one by default. */
  pack?: GhostPack;
  /** The result's record lines: the app's Spanish recordLines() by default. */
  recordLines?: typeof recordLines;
}

/**
 * The S4 replay. It types the race script into the app's TypingSession and, as Practice.svelte's
 * applyEvent does, tells the app's GhostRace each new position; the ghost cursor follows the record's
 * times (ghostPosition). When the text is done the results show the app's record lines (recordLines).
 */
export class GhostDemo {
  readonly pack: GhostPack;
  session: TypingSession;
  race: GhostRace;
  /** The live difference with the record in ms (the app's `ghostDelta`). */
  delta: number | null = null;
  phase: "typing" | "results" = "typing";
  /** Results lines: "Récord anterior: … PPM" and, when beaten, "¡Nuevo récord para este texto!". */
  records: string[] = [];
  /** Recorded time of the latest keystroke (ms). */
  lastT = 0;
  #applied = 0;
  #driver: ReplayDriver | null = null;
  #hold: { ms: number; fn: () => void; timer: unknown } | null = null;
  #playing = false;
  readonly #clock: Clock;

  constructor(private readonly options: DemoOptions) {
    this.#clock = options.clock ?? timers;
    this.pack = options.pack ?? ES_PACK;
    this.session = new TypingSession(this.pack.text, MODE);
    this.race = new GhostRace(this.pack.ghost.times);
    this.#load(this.pack.stillSteps);
  }

  /** The race's time now (ms): the latest keystroke's. The view moves it on between keystrokes (`at`). */
  get now(): number {
    return this.lastT;
  }

  /** Recorded time of the next keystroke, or `null` at the end: the ghost clock never runs past it. */
  get nextT(): number | null {
    return this.pack.race.steps[this.#applied]?.atMs ?? null;
  }

  /** Where the ghost cursor is at race time `at` (Practice.svelte's `ghostAt`). */
  ghostAt(at: number): number {
    const first = this.session.firstT;
    return ghostPosition(this.pack.ghost.times, first === null ? null : Math.max(at - first, 0));
  }

  get playing(): boolean {
    return this.#playing;
  }

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

  /** The race from its start ("Repetir"), paused or playing as it was. */
  restart(): void {
    const playing = this.#playing;
    this.pause();
    this.#hold = null;
    this.#load(0);
    this.options.onChange?.();
    if (playing) this.play();
  }

  #load(steps: number) {
    this.session = new TypingSession(this.pack.text, MODE);
    this.race = new GhostRace(this.pack.ghost.times);
    this.delta = null;
    this.phase = "typing";
    this.records = [];
    this.lastT = 0;
    this.#applied = 0;
    for (const step of this.pack.race.steps.slice(0, steps)) this.#apply(toInput(step));
    this.#driver = new ReplayDriver(this.pack.race, (e) => this.#apply(e), {
      reducedMotion: this.options.reducedMotion,
      clock: this.#clock,
      from: steps,
      onDone: () => this.#finished(),
    });
  }

  /** Practice.svelte's applyEvent, for the parts the demo shows. */
  #apply(event: InputEvent) {
    const s = this.session;
    const expected = s.chars[s.cursor];
    this.#applied++;
    if (!s.apply(event)) return;
    this.lastT = event.tMs;
    if (s.firstT !== null) {
      this.race.passed(s.cursor, event.tMs - s.firstT);
      this.delta = this.race.delta;
    }
    this.options.onChange?.({ event, expected });
  }

  /** The text is done: the results with the record lines (a saved session), then the race again. */
  #finished() {
    this.phase = "results";
    this.records = (this.options.recordLines ?? recordLines)(this.pack.ghost.netWpm, this.session.result().stats.netWpm, true);
    this.options.onChange?.();
    this.#later(RESULTS_MS, () => this.restart());
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
