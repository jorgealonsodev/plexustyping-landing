import { describe, expect, it } from "vitest";
import { LOOP_FROM, PIECES, SEGMENTS, SEGMENT_SCRIPTS, START_TEXT, UnlimitedDemo } from "../src/sim/data/s3";
import { sequencesFor } from "../src/sim/data/sequences";
import { continuationPiece, shouldContinue } from "../src/sim/practice/unlimited";
import type { Clock } from "../src/sim/replay";

/** A clock whose timers run only when the test drains them, in due order. */
function fakeClock() {
  let now = 0;
  let seq = 0;
  const timers = new Map<number, { at: number; fn: () => void }>();
  const clock: Clock = {
    set(fn, ms) {
      const id = ++seq;
      timers.set(id, { at: now + ms, fn });
      return id;
    },
    clear(handle) {
      timers.delete(handle as number);
    },
  };
  /** Runs due timers in order until `until` says stop (checked after each one) or none is left. */
  const drain = (until: () => boolean = () => false, limit = 100_000) => {
    for (let i = 0; i < limit && timers.size > 0; i++) {
      const [id, timer] = [...timers.entries()].sort((a, b) => a[1].at - b[1].at)[0]!;
      timers.delete(id);
      now = timer.at;
      timer.fn();
      if (until()) return;
    }
  };
  return { clock, drain, pending: () => timers.size };
}

/** The loop's start: the start text typed up to LOOP_FROM, playing. */
function playingFromLoop() {
  const { clock, drain, pending } = fakeClock();
  const demo = new UnlimitedDemo({ reducedMotion: false, clock });
  demo.restart();
  demo.play();
  return { demo, drain, pending };
}

describe("S3 prerecorded texts", () => {
  it("the continuations are chained on the start text as the app's continuationPiece does", () => {
    let text = START_TEXT;
    for (const piece of PIECES) text += continuationPiece([...text], piece);
    expect(SEGMENTS.join("")).toBe(text);
    expect(SEGMENTS[0]).toBe(START_TEXT);
    expect(SEGMENTS[1]).toBe(` ${PIECES[0]}`);
  });

  it("every char has key presses on the es-qwerty keyboard", () => {
    expect(sequencesFor(SEGMENTS.join("")).every((s) => s !== null)).toBe(true);
  });

  it("each segment's script types it whole", () => {
    SEGMENT_SCRIPTS.forEach((script, i) => expect(script.text).toBe(SEGMENTS[i]));
  });
});

describe("S3 replay: the text grows near the end", () => {
  it("asks for a continuation on the keystroke where the copied shouldContinue holds, one at a time", () => {
    const { demo, drain } = playingFromLoop();
    const length = [...START_TEXT].length;
    // As in the app, only a keystroke asks (applyEvent → maybeContinue), never the loaded text itself.
    expect(demo.session.cursor).toBe(LOOP_FROM);
    expect(demo.continuing).toBe(false);
    drain(() => demo.continuing);
    const at = demo.session.cursor;
    expect(demo.askedAt).toBe(at);
    expect(shouldContinue({ cursor: at, length, pending: false, retryFrom: 0 })).toBe(true);
    // While it is under way, no second request.
    expect(shouldContinue({ cursor: at, length, pending: demo.continuing, retryFrom: 0 })).toBe(false);
    drain(() => demo.session.cursor > at + 10);
    expect(demo.askedAt).toBe(at);
  });

  it("a later continuation arrives before the end, so the text grows without stopping", () => {
    const { demo, drain } = playingFromLoop();
    drain(() => demo.segment === 1);
    const before = demo.session.chars.length;
    drain(() => demo.segment === 2);
    expect(demo.session.cursor).toBeLessThan(before);
    expect(demo.session.chars.length).toBe(before + [...SEGMENTS[2]!].length);
  });

  it("at the end it shows «Generando más texto…», then the text grows by the prerecorded piece", () => {
    const { demo, drain } = playingFromLoop();
    drain(() => demo.waiting);
    const before = demo.session.chars.length;
    expect(before).toBe([...START_TEXT].length);
    expect(demo.session.cursor).toBe(before);
    expect(demo.waiting).toBe(true);
    drain(() => demo.segment === 1);
    expect(demo.waiting).toBe(false);
    expect(demo.session.chars.length).toBe(before + [...SEGMENTS[1]!].length);
    expect(demo.session.chars.join("")).toBe(START_TEXT + continuationPiece([...START_TEXT], PIECES[0]!));
    // Typing goes on where it was: the start text stays typed.
    expect(demo.session.cursor).toBe(before);
  });

  it("chains every piece, then rests and starts the loop again", () => {
    const { demo, drain } = playingFromLoop();
    drain(() => demo.segment === SEGMENTS.length - 1);
    expect(demo.session.chars.join("")).toBe(SEGMENTS.join(""));
    drain(() => demo.refreshing);
    drain(() => !demo.refreshing);
    expect(demo.segment).toBe(0);
    expect(demo.session.chars.join("")).toBe(START_TEXT);
    expect(demo.session.cursor).toBe(demo.loopCursor);
  });

  it("pause stops the replay, play resumes it", () => {
    const { demo, drain, pending } = playingFromLoop();
    drain(() => demo.session.cursor > LOOP_FROM + 3);
    demo.pause();
    expect(pending()).toBe(0);
    const cursor = demo.session.cursor;
    drain();
    expect(demo.session.cursor).toBe(cursor);
    demo.play();
    drain(() => demo.waiting);
    expect(demo.waiting).toBe(true);
  });
});

describe("S3 reduced motion and still state", () => {
  it("the still state is the start text typed to its end, waiting for its continuation", () => {
    const demo = new UnlimitedDemo({ reducedMotion: false, clock: fakeClock().clock });
    expect(demo.session.cursor).toBe([...START_TEXT].length);
    expect(demo.waiting).toBe(true);
  });

  it("does not start on its own", () => {
    const { clock, pending } = fakeClock();
    const demo = new UnlimitedDemo({ reducedMotion: true, clock });
    expect(demo.autoplay()).toBe(false);
    expect(pending()).toBe(0);
    expect(demo.waiting).toBe(true);
  });

  it("starts on its own without reduced motion", () => {
    const { clock, pending } = fakeClock();
    const demo = new UnlimitedDemo({ reducedMotion: false, clock });
    expect(demo.autoplay()).toBe(true);
    expect(pending()).toBe(1);
  });
});
