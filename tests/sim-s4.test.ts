import { describe, expect, it } from "vitest";
import { GHOST, GHOST_TEXT, RACE_SCRIPT, GhostDemo } from "../src/sim/data/s4";
import { sequencesFor } from "../src/sim/data/sequences";
import { TypingSession } from "../src/sim/practice/engine";
import { GhostRace, NEW_RECORD, formatDelta, ghostPosition } from "../src/sim/practice/ghost";
import { type Clock, toInput } from "../src/sim/replay";

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

/** The user's race, step by step: the delta string after each step that changes the cursor. */
function raceDeltas() {
  const session = new TypingSession(GHOST_TEXT, "backspace-correct");
  const race = new GhostRace(GHOST.times);
  const deltas: { cursor: number; delta: string | null }[] = [];
  for (const step of RACE_SCRIPT.steps) {
    session.apply(toInput(step));
    race.passed(session.cursor, step.atMs - (session.firstT ?? 0));
    deltas.push({ cursor: session.cursor, delta: race.delta === null ? null : formatDelta(race.delta) });
  }
  return { session, deltas };
}

describe("S4 prerecorded record (the ghost)", () => {
  it("passed every position of the same text, in order", () => {
    const length = [...GHOST_TEXT].length;
    expect(GHOST.times).toHaveLength(length);
    expect(GHOST.times[0]).toBe(0);
    for (let i = 1; i < length; i++) expect(GHOST.times[i]!).toBeGreaterThanOrEqual(GHOST.times[i - 1]!);
  });

  it("every char has key presses on the es-qwerty keyboard", () => {
    expect(sequencesFor(GHOST_TEXT).every((s) => s !== null)).toBe(true);
  });

  it("the copied ghostPosition puts the ghost cursor where the record was at chosen instants", () => {
    const length = [...GHOST_TEXT].length;
    expect(ghostPosition(GHOST.times, null)).toBe(0);
    expect(ghostPosition(GHOST.times, 0)).toBe(1);
    expect(ghostPosition(GHOST.times, 2000)).toBe(12);
    expect(ghostPosition(GHOST.times, 5000)).toBe(27);
    expect(ghostPosition(GHOST.times, 10_000)).toBe(50);
    expect(ghostPosition(GHOST.times, GHOST.times[length - 1]! - 1)).toBe(length - 1);
    expect(ghostPosition(GHOST.times, GHOST.times[length - 1]!)).toBe(length);
    expect(ghostPosition(GHOST.times, 600_000)).toBe(length);
  });
});

describe("S4 race against the record", () => {
  it("the copied GhostRace and formatDelta give the live ± difference at chosen cursors", () => {
    const { deltas } = raceDeltas();
    const at = (cursor: number) => deltas.find((d) => d.cursor === cursor)?.delta;
    expect(at(1)).toBe("0,0 s");
    expect(at(20)).toBe("+1,6 s");
    expect(at(80)).toBe("−0,3 s");
    expect(at([...GHOST_TEXT].length)).toBe("−1,2 s");
  });

  it("falls behind after a correction, then overtakes the record", () => {
    const { deltas } = raceDeltas();
    expect(deltas.some((d) => d.delta?.startsWith("+"))).toBe(true);
    expect(deltas.at(-1)!.delta!.startsWith("−")).toBe(true);
  });

  it("ends with «Récord anterior» and «¡Nuevo récord para este texto!»", () => {
    const { clock, drain } = fakeClock();
    const demo = new GhostDemo({ reducedMotion: false, clock });
    demo.restart();
    demo.play();
    drain(() => demo.phase === "results");
    expect(demo.phase).toBe("results");
    expect(demo.session.completed).toBe(true);
    const net = demo.session.result().stats.netWpm;
    expect(net).toBeGreaterThan(GHOST.netWpm);
    // The text alternative (src/sim/i18n/s4.ts) quotes this line.
    expect(Math.round(GHOST.netWpm)).toBe(63);
    expect(demo.records).toEqual([`Récord anterior: ${Math.round(GHOST.netWpm)} PPM`, NEW_RECORD]);
  });

  it("rests on the results, then races again from the start", () => {
    const { clock, drain } = fakeClock();
    const demo = new GhostDemo({ reducedMotion: false, clock });
    demo.restart();
    demo.play();
    drain(() => demo.phase === "results");
    drain(() => demo.phase === "typing");
    expect(demo.session.cursor).toBe(0);
    expect(demo.delta).toBeNull();
  });
});

describe("S4 reduced motion and still state", () => {
  it("the still state is mid-race: ghost cursor and difference shown", () => {
    const demo = new GhostDemo({ reducedMotion: true, clock: fakeClock().clock });
    expect(demo.phase).toBe("typing");
    expect(demo.session.cursor).toBeGreaterThan(0);
    expect(demo.ghostAt(demo.now)).toBeGreaterThan(0);
    expect(demo.delta).not.toBeNull();
  });

  it("does not start on its own", () => {
    const { clock, pending } = fakeClock();
    const demo = new GhostDemo({ reducedMotion: true, clock });
    expect(demo.autoplay()).toBe(false);
    expect(pending()).toBe(0);
  });

  it("starts on its own without reduced motion", () => {
    const { clock, pending } = fakeClock();
    const demo = new GhostDemo({ reducedMotion: false, clock });
    expect(demo.autoplay()).toBe(true);
    expect(pending()).toBe(1);
  });
});
