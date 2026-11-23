// Prerecorded data of the S8 "Modo código" demo (src/components/sims/S8Code.svelte).
//
// Snippets: copied verbatim from the PlexusTyping app's bundled code corpus,
// crates/plexustyping-corpus/data/code/{python,typescript,rust}.txt (app commit
// 14f64cf2b9619deca9d99c2dbb3a2358586c5390), the first snippet of each file, as `code.rs` parse() returns it
// (header line dropped, trailing whitespace trimmed). They are original work of the app, MIT OR Apache-2.0.
//
// Tokens: the app gets them from Rust (`plexustyping-highlight::highlight`, syntect grammars of two-face);
// the website has no Rust and the app has no token fixture or dump tool, so these spans are AUTHORED BY HAND
// against that crate's scope → class table (crates/plexustyping-highlight/src/lib.rs, RULES) and its tests
// (tests/highlight.rs). Like the crate's output, they tile the whole text and adjacent runs of one class are
// merged. Unsure cases (Python docstring as comment, Rust `let` as keyword) are noted where they occur.
import { type Token, type TokenClass, codeKeyEvent } from "../code/syntax";
import { type InputEvent, type KeyAction, type Stats, TypingSession } from "../practice/engine";
import { type Clock, ReplayDriver, type Script, buildScript, toInput } from "../replay";

/** [class, text] runs in order; a bare string is plain. */
type Run = string | [TokenClass, string];

/** Tokens from runs, as `highlight` returns them: contiguous, adjacent runs of one class merged. */
export function tokensFrom(runs: readonly Run[]): { text: string; tokens: Token[] } {
  const tokens: Token[] = [];
  let text = "";
  for (const run of runs) {
    const [cls, part] = typeof run === "string" ? (["plain", run] as const) : run;
    const start = [...text].length;
    const end = start + [...part].length;
    text += part;
    if (end === start) continue;
    const last = tokens.at(-1);
    if (last && last.class === cls) last.end = end;
    else tokens.push({ start, end, class: cls });
  }
  return { text, tokens };
}

const k = (s: string): Run => ["keyword", s];
const f = (s: string): Run => ["function", s];
const t = (s: string): Run => ["type", s];
const v = (s: string): Run => ["variable", s];
const p = (s: string): Run => ["punctuation", s];
const o = (s: string): Run => ["operator", s];
const n = (s: string): Run => ["number", s];
const c = (s: string): Run => ["comment", s];
const C = (s: string): Run => ["constant", s];
const P = (s: string): Run => ["property", s];

// prettier-ignore
const PYTHON: Run[] = [
  k("def"), " ", f("average_score"), p("("), v("scores"), p(":"), " ", t("list"), p("["), t("float"), p("])"), " ", p("->"), " ", t("float"), p(":"), "\n",
  // A docstring: the Python grammar scopes it as a documentation comment (unsure: may be `string`).
  "    ", c('"""Return the mean of the scores, or 0.0 when there are none."""'), "\n",
  "    ", k("if"), " ", o("not"), " scores", p(":"), "\n",
  "        ", k("return"), " ", n("0.0"), "\n",
  "    total ", o("="), " ", n("0.0"), "\n",
  "    ", k("for"), " value ", k("in"), " scores", p(":"), "\n",
  "        total ", o("+="), " value\n",
  "    ", k("return"), " total ", o("/"), " ", f("len"), p("("), "scores", p(")"),
];

// prettier-ignore
const TYPESCRIPT: Run[] = [
  k("interface"), " ", t("Task"), " ", p("{"), "\n",
  "    ", v("id"), o(":"), " ", t("number"), p(";"), "\n",
  "    ", v("title"), o(":"), " ", t("string"), p(";"), "\n",
  "    ", v("done"), o(":"), " ", t("boolean"), p(";"), "\n",
  "    ", v("tags"), o("?:"), " ", t("string"), p("[];"), "\n",
  p("}"), "\n\n",
  k("function"), " ", f("pending"), p("("), v("tasks"), o(":"), " ", t("Task"), p("[])"), o(":"), " ", t("Task"), p("[]"), " ", p("{"), "\n",
  "    ", k("return"), " ", v("tasks"), p("."), f("filter"), p("(("), v("task"), p(")"), " ", k("=>"), " ", o("!"), v("task"), p("."), P("done"), p(");"), "\n",
  p("}"),
];

// prettier-ignore
const RUST: Run[] = [
  k("fn"), " ", f("mean"), p("("), v("values"), p(":"), " ", o("&"), p("["), t("f64"), p("])"), " ", p("->"), " ", t("Option"), p("<"), t("f64"), p(">"), " ", p("{"), "\n",
  "    ", k("if"), " values", p("."), f("is_empty"), p("()"), " ", p("{"), "\n",
  "        ", k("return"), " ", C("None"), p(";"), "\n",
  "    ", p("}"), "\n",
  // `let`: a declaration keyword (unsure: older grammars scope it `storage.type`, which the crate maps to type).
  "    ", k("let"), " sum", p(":"), " ", t("f64"), " ", o("="), " values", p("."), f("iter"), p("()."), f("sum"), p("();"), "\n",
  "    ", C("Some"), p("("), "sum ", o("/"), " values", p("."), f("len"), p("()"), " ", o("as"), " ", t("f64"), p(")"), "\n",
  p("}"),
];

/** A bundled code language as the app's `code_languages` command lists it (`plexustyping-corpus` code.rs). */
export interface CodeSnippet {
  /** Language id (`CodeLanguage::id`). */
  id: "python" | "typescript" | "rust";
  /** Its display name (`CodeLanguage::name`), the same in every language. */
  name: string;
  text: string;
  tokens: Token[];
  script: Script;
}

/**
 * What the typist types in the app's automatic indent mode: every char except the indentation that a
 * correct newline fills in (engine.ts `apply`, `indent === "auto"`).
 */
export function typedText(text: string): string {
  return text.replace(/\n[ \t]+/g, "\n");
}

/** Typos of each snippet's replay, as indices into its `typedText`; all corrected. */
const TYPOS: Record<CodeSnippet["id"], { index: number; typed: string }[]> = {
  python: [
    { index: 9, typed: "s" },
    { index: 120, typed: "r" },
  ],
  typescript: [
    { index: 30, typed: "r" },
    { index: 140, typed: "i" },
  ],
  rust: [
    { index: 14, typed: "a" },
    { index: 112, typed: "t" },
  ],
};

/** The extra time a key takes: Shift chars and Enter, as a person typing code. */
const extraMs = (ch: string) => (ch === "\n" ? 260 : /[A-Z(){}[\]<>:;"_!&?=+]/.test(ch) ? 90 : 0);

function snippet(id: CodeSnippet["id"], name: string, runs: Run[], seed: number): CodeSnippet {
  const { text, tokens } = tokensFrom(runs);
  const typos = TYPOS[id].map((typo) => ({ ...typo, corrected: true }));
  const typed = buildScript(typedText(text), { seed, wpm: 46, typos, extraMs });
  return { id, name, text, tokens, script: { ...typed, text } };
}

export const SNIPPETS: CodeSnippet[] = [
  snippet("python", "Python", PYTHON, 8),
  snippet("typescript", "TypeScript", TYPESCRIPT, 3),
  snippet("rust", "Rust", RUST, 9),
];

/** Steps of each replay already typed in the still state (server render, reduced motion). */
export const STILL_STEPS = 96;

/** Pause after a finished snippet before the next language's starts, in ms. */
export const REST_MS = 2600;

/** Pause after a visitor's finished snippet before the next language's, in ms (as the hero demo). */
export const NEXT_MS = 1500;

/** One applied keystroke and the char it was meant for, for the key flash. */
export interface CodeKeystroke {
  event: InputEvent;
  expected: string | undefined;
}

export interface CodeDemoOptions {
  /** `prefers-reduced-motion: reduce`: the replay never starts on its own. */
  reducedMotion: boolean;
  clock?: Clock;
  /** The session changed: a keystroke was applied (`null`: a new or restarted snippet). */
  onChange?: (keystroke: CodeKeystroke | null) => void;
  /** The visitor finished a snippet. */
  onFinished?: (stats: Stats) => void;
}

const timers: Clock = {
  set: (fn, ms) => setTimeout(fn, ms),
  clear: (handle) => clearTimeout(handle as ReturnType<typeof setTimeout>),
};

/**
 * The S8 demo: the app's TypingSession in code mode (backspace corrects, automatic indent) over each
 * snippet in turn. A recorded replay types them, resting between languages; the visitor can take over
 * at any time (the replay stops and the snippet starts again for them) and "play" hands it back.
 */
export class CodeDemo {
  index = 0;
  session!: TypingSession;
  mode: "replay" | "visitor" = "replay";
  /** Time of the latest applied event, the live stats' clock. */
  lastT = 0;
  #driver: ReplayDriver | null = null;
  /** A pending pause before the next snippet; `timer` is set while it runs. */
  #wait: { ms: number; fn: () => void; timer: unknown } | null = null;
  #running = false;
  readonly #clock: Clock;

  constructor(private readonly options: CodeDemoOptions) {
    this.#clock = options.clock ?? timers;
    this.#start(0, STILL_STEPS);
  }

  get snippet(): CodeSnippet {
    return SNIPPETS[this.index]!;
  }

  /** The replay is running. */
  get playing(): boolean {
    return this.#running;
  }

  /** Starts on its own unless reduced motion is asked for; returns whether it started. */
  autoplay(): boolean {
    if (this.options.reducedMotion) return false;
    this.play();
    return this.playing;
  }

  /** Runs the replay; after the visitor typed, from the current snippet's start. */
  play(): void {
    if (this.mode === "visitor") {
      this.mode = "replay";
      this.#cancelWait();
      this.#start(this.index);
    }
    this.#running = true;
    if (this.#wait) {
      if (this.#wait.timer === null) this.#arm(this.#wait);
    } else this.#driver?.play();
  }

  /** Stops the replay where it is (or its rest between snippets); `play` resumes it. */
  pause(): void {
    this.#running = false;
    this.#driver?.pause();
    if (this.#wait && this.#wait.timer !== null) {
      this.#clock.clear(this.#wait.timer);
      this.#wait.timer = null;
    }
  }

  /** The language picker: that snippet from its first char, typed by whoever types now. */
  select(index: number): void {
    if (!SNIPPETS[index]) return;
    this.#cancelWait();
    this.#start(index);
    if (this.mode === "replay" && this.#running) this.#driver?.play();
  }

  /** Text the visitor typed: they take over first. */
  input(events: InputEvent[]): void {
    this.#takeOver();
    for (const event of events) this.#apply(event);
  }

  /**
   * Practice.svelte's keys in code mode: Enter types a measured newline, Backspace corrects, Esc restarts
   * the snippet. Tab is left to the browser (it leaves the demo; automatic indent needs none). Returns
   * whether the key was the demo's.
   */
  key(action: KeyAction | null, tMs: number): boolean {
    if (action === "escape") {
      this.#takeOver();
      this.#start(this.index);
      return true;
    }
    if (action === "backspace") {
      this.input([{ kind: "backspace", tMs }]);
      return true;
    }
    const event = action === "enter" ? codeKeyEvent(action, true, tMs) : null;
    if (!event) return false;
    this.input([event]);
    return true;
  }

  /** A fresh session of snippet `index`, its first `steps` replay steps typed, and a replay from there. */
  #start(index: number, steps = 0) {
    this.index = index;
    const { text, script } = this.snippet;
    this.session = new TypingSession(text, "backspace-correct", "auto");
    for (const step of script.steps.slice(0, steps)) this.session.apply(toInput(step));
    this.lastT = script.steps[steps - 1]?.atMs ?? 0;
    this.#driver?.pause();
    this.#driver =
      this.mode === "replay"
        ? new ReplayDriver(script, (e) => this.#apply(e), {
            reducedMotion: this.options.reducedMotion,
            clock: this.#clock,
            from: steps,
            onDone: () => this.#later(REST_MS, () => this.#next()),
          })
        : null;
    this.options.onChange?.(null);
  }

  #apply(event: InputEvent) {
    const expected = this.session.chars[this.session.cursor];
    if (!this.session.apply(event)) return;
    this.lastT = event.tMs;
    this.options.onChange?.({ event, expected });
    if (this.mode === "visitor" && this.session.completed) {
      this.options.onFinished?.(this.session.result().stats);
      this.#later(NEXT_MS, () => this.#start((this.index + 1) % SNIPPETS.length));
    }
  }

  /** The next language's snippet, replayed if the replay is running. */
  #next() {
    this.#start((this.index + 1) % SNIPPETS.length);
    if (this.#running) this.#driver?.play();
  }

  #takeOver() {
    if (this.mode === "visitor") return;
    this.pause();
    this.#cancelWait();
    this.mode = "visitor";
    this.#start(this.index);
  }

  #later(ms: number, fn: () => void) {
    this.#wait = { ms, fn, timer: null };
    // The visitor's pause always runs; the replay's only while it plays.
    if (this.mode === "visitor" || this.#running) this.#arm(this.#wait);
  }

  #arm(wait: { ms: number; fn: () => void; timer: unknown }) {
    wait.timer = this.#clock.set(() => {
      if (this.#wait === wait) this.#wait = null;
      wait.fn();
    }, wait.ms);
  }

  #cancelWait() {
    if (this.#wait?.timer != null) this.#clock.clear(this.#wait.timer);
    this.#wait = null;
  }
}
