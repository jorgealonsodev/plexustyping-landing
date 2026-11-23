import { describe, expect, it } from "vitest";
import { pressFor } from "../src/sim/code/keys";
import { CodeDemo, REST_MS, SNIPPETS, STILL_STEPS } from "../src/sim/data/s8";
import { ES_QWERTY } from "../src/sim/data/es-qwerty";
import type { Stats } from "../src/sim/practice/engine";
import type { Clock } from "../src/sim/replay";

/** A fake clock that runs timers only up to a time, so a looping demo can be stepped. */
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
  const advance = (ms: number) => {
    const until = now + ms;
    for (;;) {
      const due = [...timers.entries()].filter(([, t]) => t.at <= until).sort((a, b) => a[1].at - b[1].at)[0];
      if (!due) break;
      timers.delete(due[0]);
      now = due[1].at;
      due[1].fn();
    }
    now = until;
  };
  return { clock, advance, pending: () => timers.size };
}

const scriptMs = (i: number) => SNIPPETS[i]!.script.steps.at(-1)!.atMs;
/** Replay time left from the still state of the first snippet. */
const stillLeftMs = () => scriptMs(0) - SNIPPETS[0]!.script.steps[STILL_STEPS - 1]!.atMs;

describe("pressFor", () => {
  it("finds the key and layer of code chars on the layout", () => {
    expect(pressFor(ES_QWERTY, "(")).toEqual([{ code: "Digit8", layer: "shift" }]);
    expect(pressFor(ES_QWERTY, "[")).toEqual([{ code: "BracketLeft", layer: "altgr" }]);
    expect(pressFor(ES_QWERTY, "a")).toEqual([{ code: "KeyA", layer: "normal" }]);
    expect(pressFor(ES_QWERTY, " ")).toEqual([{ code: "Space", layer: "normal" }]);
  });
  it("types a newline with Enter and has nothing for an unknown char", () => {
    expect(pressFor(ES_QWERTY, "\n")).toEqual([{ code: "Enter", layer: "normal" }]);
    expect(pressFor(ES_QWERTY, "☃")).toBeNull();
    expect(pressFor(ES_QWERTY, undefined)).toBeNull();
  });
});

describe("CodeDemo", () => {
  it("starts in the still state: the first snippet partly typed, nothing playing", () => {
    const { clock, advance } = fakeClock();
    const demo = new CodeDemo({ reducedMotion: true, clock });
    expect(demo.index).toBe(0);
    expect(demo.session.chars.join("")).toBe(SNIPPETS[0]!.text);
    expect(demo.session.events.length).toBe(STILL_STEPS);
    expect(demo.session.cursor).toBeGreaterThan(0);
    expect(demo.autoplay()).toBe(false);
    expect(demo.playing).toBe(false);
    const cursor = demo.session.cursor;
    advance(60_000);
    expect(demo.session.cursor).toBe(cursor);
  });

  it("plays each snippet to the end, rests, then the next language, and loops", () => {
    const { clock, advance } = fakeClock();
    const changes: (string | null)[] = [];
    const demo = new CodeDemo({ reducedMotion: false, clock, onChange: (k) => changes.push(k?.expected ?? null) });
    expect(demo.autoplay()).toBe(true);
    advance(stillLeftMs());
    expect(demo.session.completed).toBe(true);
    expect(demo.session.result().stats.uncorrectedErrors).toBe(0);
    advance(REST_MS - 1);
    expect(demo.index).toBe(0);
    advance(1);
    expect(demo.index).toBe(1);
    expect(demo.session.chars.join("")).toBe(SNIPPETS[1]!.text);
    // Its first keystroke is at 0 ms: the replay types it at once.
    expect(demo.session.cursor).toBeLessThanOrEqual(1);
    advance(scriptMs(1) + REST_MS + scriptMs(2) + REST_MS);
    expect(demo.index).toBe(0);
    expect(changes.length).toBeGreaterThan(100);
  });

  it("pauses where it is and resumes, also between snippets", () => {
    const { clock, advance } = fakeClock();
    const demo = new CodeDemo({ reducedMotion: false, clock });
    demo.autoplay();
    advance(2000);
    demo.pause();
    expect(demo.playing).toBe(false);
    const cursor = demo.session.cursor;
    advance(60_000);
    expect(demo.session.cursor).toBe(cursor);
    demo.play();
    expect(demo.playing).toBe(true);
    advance(stillLeftMs() - 1500);
    expect(demo.session.completed).toBe(true);
    demo.pause();
    advance(REST_MS * 3);
    expect(demo.index).toBe(0);
    demo.play();
    advance(REST_MS);
    expect(demo.index).toBe(1);
  });

  it("the language picker starts that snippet from its first char", () => {
    const { clock, advance } = fakeClock();
    const demo = new CodeDemo({ reducedMotion: false, clock });
    demo.autoplay();
    demo.select(2);
    expect(demo.index).toBe(2);
    expect(demo.snippet.id).toBe("rust");
    expect(demo.session.chars.join("")).toBe(SNIPPETS[2]!.text);
    expect(demo.session.cursor).toBe(0);
    advance(scriptMs(2));
    expect(demo.session.completed).toBe(true);
  });

  it("the visitor takes over: the replay stops, the snippet restarts, Enter is a measured newline with auto indent", () => {
    const { clock, advance } = fakeClock();
    const demo = new CodeDemo({ reducedMotion: false, clock });
    demo.autoplay();
    const text = SNIPPETS[0]!.text;
    const firstLine = text.slice(0, text.indexOf("\n"));
    demo.input([...firstLine].map((ch, i) => ({ kind: "char", ch, tMs: 1000 + i * 100 })));
    expect(demo.mode).toBe("visitor");
    expect(demo.playing).toBe(false);
    expect(demo.session.cursor).toBe(firstLine.length);
    expect(demo.key("enter", 9000)).toBe(true);
    const indent = text.slice(firstLine.length + 1).match(/^ */)![0].length;
    expect(demo.session.cursor).toBe(firstLine.length + 1 + indent);
    expect(demo.session.lastRecord).toMatchObject({ expected: "\n", typed: "\n", correct: true });
    // Tab is not the demo's: it leaves the demo (WCAG 2.1.2), and auto indent needs none.
    expect(demo.key("tab", 9100)).toBe(false);
    expect(demo.key("backspace", 9200)).toBe(true);
    expect(demo.session.cursor).toBe(firstLine.length);
    expect(demo.key("escape", 9300)).toBe(true);
    expect(demo.session.cursor).toBe(0);
    expect(demo.session.events.length).toBe(0);
    const cursor = demo.session.cursor;
    advance(60_000);
    expect(demo.session.cursor).toBe(cursor);
  });

  it("a finished visitor snippet reports its stats, then the next language waits for the visitor", () => {
    const { clock, advance } = fakeClock();
    const finished: Stats[] = [];
    const demo = new CodeDemo({ reducedMotion: true, clock, onFinished: (s) => finished.push(s) });
    const text = SNIPPETS[0]!.text;
    let t = 0;
    for (const line of text.split("\n")) {
      if (t > 0) demo.key("enter", (t += 150));
      demo.input([...line.trimStart()].map((ch) => ({ kind: "char", ch, tMs: (t += 150) })));
    }
    expect(demo.session.completed).toBe(true);
    expect(finished).toHaveLength(1);
    expect(finished[0]!.accuracy).toBe(1);
    expect(finished[0]!.netWpm).toBeGreaterThan(0);
    advance(1500);
    expect(demo.index).toBe(1);
    expect(demo.mode).toBe("visitor");
    expect(demo.session.cursor).toBe(0);
    // Play hands the demo back to the replay, from the current snippet's start.
    demo.play();
    expect(demo.mode).toBe("replay");
    expect(demo.playing).toBe(true);
    advance(scriptMs(1));
    expect(demo.session.completed).toBe(true);
  });
});
