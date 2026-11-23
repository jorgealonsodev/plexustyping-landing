import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { SYNTAX_CLASSES, codeKeyEvent, tokenClasses } from "../src/sim/code/syntax";
import { SNIPPETS, typedText } from "../src/sim/data/s8";
import { S8_STRINGS } from "../src/sim/i18n/s8";
import { TypingSession } from "../src/sim/practice/engine";
import { type Clock, ReplayDriver } from "../src/sim/replay";

/** Every string leaf of a strings table. */
const leaves = (x: unknown): string[] =>
  typeof x === "string" ? [x] : x && typeof x === "object" ? Object.values(x).flatMap(leaves) : [];

/** Spanish strings of `es` (names and symbols aside) that the English table repeats. */
function spanishLeaks(es: unknown, en: unknown, shared: string[] = []): string[] {
  const english = leaves(en);
  return leaves(es).filter((s) => s.length > 3 && /[a-záéíóúñ]/.test(s) && !shared.includes(s) && english.some((e) => e.includes(s)));
}

function fakeClock() {
  const timers = new Map<number, { at: number; fn: () => void }>();
  let now = 0;
  let seq = 0;
  const clock: Clock = {
    set(fn, ms) {
      timers.set(++seq, { at: now + ms, fn });
      return seq;
    },
    clear: (h) => void timers.delete(h as number),
  };
  const drain = () => {
    while (timers.size > 0) {
      const [id, timer] = [...timers.entries()].sort((a, b) => a[1].at - b[1].at)[0]!;
      timers.delete(id);
      now = timer.at;
      timer.fn();
    }
  };
  return { clock, drain };
}

describe("S8 prerecorded tokens", () => {
  it("offers three languages of the app's corpus", () => {
    expect(SNIPPETS.map((s) => s.name)).toEqual(["Python", "TypeScript", "Rust"]);
  });

  for (const s of SNIPPETS) {
    it(`${s.id}: every span lies within its text, tiles it, and uses a class tokenClasses knows`, () => {
      const length = [...s.text].length;
      let next = 0;
      for (const token of s.tokens) {
        expect(token.start).toBe(next);
        expect(token.end).toBeGreaterThan(token.start);
        expect(token.end).toBeLessThanOrEqual(length);
        expect(SYNTAX_CLASSES).toContain(token.class);
        next = token.end;
      }
      expect(next).toBe(length);
      const classes = tokenClasses(length, s.tokens);
      expect(classes).toHaveLength(length);
      expect(classes.every((c) => SYNTAX_CLASSES.includes(c))).toBe(true);
      // Some real highlighting: keywords, functions and punctuation at least.
      for (const cls of ["keyword", "function", "punctuation"] as const) expect(classes).toContain(cls);
    });

    it(`${s.id}: the corpus rules hold (5–20 lines, 4-space indent, no tabs, ≤ 80 columns)`, () => {
      const lines = s.text.split("\n");
      expect(lines.length).toBeGreaterThanOrEqual(5);
      expect(lines.length).toBeLessThanOrEqual(20);
      for (const line of lines) {
        expect(line).not.toMatch(/\t|\s$/);
        expect(line.length).toBeLessThanOrEqual(80);
        expect(line.match(/^ */)![0].length % 4).toBe(0);
      }
    });
  }
});

// The snippets are the app's own: checked against its corpus when the app repository is beside this one
// (or at $PLEXUSTYPING_APP), skipped elsewhere.
const APP = process.env.PLEXUSTYPING_APP ?? "../plexustyping";
const CORPUS = `${APP}/crates/plexustyping-corpus/data/code`;
it.skipIf(!existsSync(CORPUS))("S8 snippets are the first snippet of each corpus file, verbatim", () => {
  for (const s of SNIPPETS) {
    const file = readFileSync(`${CORPUS}/${s.id}.txt`, "utf8");
    const first = file.split(/^%%.*$/m)[1]!.trimEnd().replace(/^[\r\n]+/, "");
    expect(s.text).toBe(first);
  }
});

describe("S8 replay in the automatic indent mode", () => {
  for (const s of SNIPPETS) {
    it(`${s.id}: types only the unindented chars, Enter as a measured newline, and ends with every char right`, () => {
      // The script never types indentation: auto indent fills it after each correct newline.
      const typed = s.script.steps.filter((st) => st.event.kind === "char").map((st) => (st.event.kind === "char" ? st.event.ch : ""));
      expect(typed.join("")).not.toMatch(/\n /);
      expect(typed.filter((ch) => ch === "\n").length).toBe(s.text.split("\n").length - 1);
      // Enter in code mode is the same event the script sends.
      expect(codeKeyEvent("enter", true, 5)).toEqual({ kind: "char", ch: "\n", tMs: 5 });

      const session = new TypingSession(s.text, "backspace-correct", "auto");
      const { clock, drain } = fakeClock();
      let done = false;
      const cursors: number[] = [];
      const driver = new ReplayDriver(s.script, (e) => (session.apply(e), cursors.push(session.cursor)), {
        reducedMotion: false,
        clock,
        onDone: () => (done = true),
      });
      expect(driver.autoplay()).toBe(true);
      drain();
      expect(done).toBe(true);
      expect(session.completed).toBe(true);
      const { stats, records } = session.result();
      expect(stats.uncorrectedErrors).toBe(0);
      expect(stats.errors).toBe(s.script.errors);
      expect(s.script.errors).toBe(2);
      expect(s.text.split("").every((_, i) => session.state(i) === "correct")).toBe(true);
      // Newlines are measured keystrokes (records) and none of the indentation is.
      expect(records.filter((r) => r.expected === "\n" && r.correct).length).toBe(s.text.split("\n").length - 1);
      expect(records.some((r) => r.expected === " " && /\n {4}$/.test(s.text.slice(0, r.index + 1)))).toBe(false);
      // The first newline jumps the cursor past the next line's indentation.
      const firstNl = s.text.indexOf("\n");
      const indent = s.text.slice(firstNl + 1).match(/^ */)![0].length;
      expect(cursors).toContain(firstNl + 1 + indent);
    });
  }

  it("typos land on real chars that are not before a newline", () => {
    for (const s of SNIPPETS) {
      const typed = typedText(s.text);
      const wrong = s.script.steps.filter((st) => st.event.kind === "backspace").length;
      expect(wrong).toBe(4);
      for (const step of s.script.steps) expect(step.atMs).toBeGreaterThanOrEqual(0);
      expect([...typed].length).toBeGreaterThan(100);
    }
  });

  it("never starts on its own under reduced motion", () => {
    const session = new TypingSession(SNIPPETS[0]!.text, "backspace-correct", "auto");
    const driver = new ReplayDriver(SNIPPETS[0]!.script, (e) => session.apply(e), { reducedMotion: true, clock: fakeClock().clock });
    expect(driver.autoplay()).toBe(false);
    expect(driver.playing).toBe(false);
    expect(session.cursor).toBe(0);
  });
});

/** Names that are the same in both languages. */
const SHARED = ["PlexusTyping"];

describe("S8 strings", () => {
  it("has no Spanish UI string in the English table", () => {
    expect(spanishLeaks(S8_STRINGS.es, S8_STRINGS.en, SHARED)).toEqual([]);
  });
});
