import { describe, expect, it } from "vitest";
import { DIAGNOSTIC_SCRIPT, TARGET_SCRIPT } from "../src/sim/data/demo";
import { TypingSession } from "../src/sim/practice/engine";
import { type Clock, ReplayDriver, type Script } from "../src/sim/replay";

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
  const drain = (limit = 100_000) => {
    for (let i = 0; i < limit && timers.size > 0; i++) {
      const [id, timer] = [...timers.entries()].sort((a, b) => a[1].at - b[1].at)[0]!;
      timers.delete(id);
      now = timer.at;
      timer.fn();
    }
  };
  return { clock, drain, pending: () => timers.size };
}

function runToEnd(script: Script) {
  const session = new TypingSession(script.text, "backspace-correct");
  const { clock, drain } = fakeClock();
  let done = false;
  const driver = new ReplayDriver(script, (e) => session.apply(e), { reducedMotion: false, clock, onDone: () => (done = true) });
  expect(driver.autoplay()).toBe(true);
  drain();
  return { session, done };
}

describe("replay driver fed into the app's TypingSession", () => {
  it.each([
    ["diagnostic text", DIAGNOSTIC_SCRIPT],
    ["targets text", TARGET_SCRIPT],
  ])("types the whole %s with the scripted errors and corrections", (_, script) => {
    const { session, done } = runToEnd(script);
    expect(done).toBe(true);
    expect(session.completed).toBe(true);
    const expected = [...script.text].map((_, i) => (script.uncorrected.includes(i) ? "error" : "correct"));
    expect([...script.text].map((_, i) => session.state(i))).toEqual(expected);
    const { stats } = session.result();
    expect(stats.errors).toBe(script.errors);
    expect(stats.uncorrectedErrors).toBe(script.uncorrected.length);
    expect(script.errors).toBeGreaterThan(script.uncorrected.length);
    expect(stats.durationMs).toBe(script.steps.at(-1)!.atMs - script.steps[0]!.atMs);
  });

  it("pause stops the typing and play resumes it where it was", () => {
    const session = new TypingSession(DIAGNOSTIC_SCRIPT.text, "backspace-correct");
    const { clock, drain, pending } = fakeClock();
    const driver = new ReplayDriver(DIAGNOSTIC_SCRIPT, (e) => session.apply(e), { reducedMotion: false, clock });
    driver.play();
    driver.pause();
    expect(pending()).toBe(0);
    expect(driver.playing).toBe(false);
    drain();
    expect(session.cursor).toBe(0);
    driver.play();
    drain();
    expect(session.completed).toBe(true);
  });
});

describe("reduced motion", () => {
  it("does not start the replay on its own", () => {
    const { clock, pending } = fakeClock();
    const events: unknown[] = [];
    const driver = new ReplayDriver(DIAGNOSTIC_SCRIPT, (e) => events.push(e), { reducedMotion: true, clock });
    expect(driver.autoplay()).toBe(false);
    expect(driver.playing).toBe(false);
    expect(pending()).toBe(0);
    expect(events).toEqual([]);
  });

  it("still plays when the visitor presses play", () => {
    const { clock, drain } = fakeClock();
    const events: unknown[] = [];
    const driver = new ReplayDriver(DIAGNOSTIC_SCRIPT, (e) => events.push(e), { reducedMotion: true, clock });
    driver.play();
    expect(driver.playing).toBe(true);
    drain();
    expect(events.length).toBe(DIAGNOSTIC_SCRIPT.steps.length);
  });
});
