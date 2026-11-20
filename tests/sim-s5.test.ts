// S5 "Metrónomo": the app's beat helpers (copied), the port of its Rust sound synthesis and the demo's
// in-browser MetronomeApi, which never makes a sound before the visitor's first gesture.
import { describe, expect, it } from "vitest";
import { DemoMetronome } from "../src/sim/metronome/demoApi";
import { adaptTempo, beatAt, parseBpm, stepBpm } from "../src/sim/metronome/beat";
import { synthesize } from "../src/sim/metronome/sound";

describe("beat.ts (copied from the app)", () => {
  it("beatAt gives the beat index and the time since it, or null before beat 0", () => {
    expect(beatAt(1000, 1000, 500)).toEqual({ index: 0, sinceMs: 0 });
    expect(beatAt(2130, 1000, 500)).toEqual({ index: 2, sinceMs: 130 });
    expect(beatAt(999, 1000, 500)).toBeNull();
  });

  it("stepBpm moves by 5 BPM on the 5s grid, inside 30–300", () => {
    expect([stepBpm(60, 1), stepBpm(60, -1)]).toEqual([65, 55]);
    expect([stepBpm(62, 1), stepBpm(62, -1)]).toEqual([65, 60]);
    expect([stepBpm(300, 1), stepBpm(30, -1), stepBpm(298, 1), stepBpm(32, -1)]).toEqual([300, 30, 300, 30]);
  });

  it("parseBpm rounds and clamps a typed tempo to 30–300, and keeps the current one for non-numbers", () => {
    expect(parseBpm("120", 90)).toBe(120);
    expect(parseBpm(" 97.6 ", 90)).toBe(98);
    expect(parseBpm("5", 90)).toBe(30);
    expect(parseBpm("9999", 90)).toBe(300);
    expect(parseBpm("", 90)).toBe(90);
    expect(parseBpm("abc", 90)).toBe(90);
  });

  it("adaptTempo raises 5 % when accurate and on the beat, lowers when not, inside 30–300", () => {
    const at = (ms: number) => [ms, -ms, ms, -ms];
    expect(adaptTempo(60, 0.97, at(150))).toBe(63);
    expect(adaptTempo(30, 1, at(10))).toBe(32);
    expect(adaptTempo(60, 0.899, at(10))).toBe(57);
    expect(adaptTempo(60, 1, at(201))).toBe(57);
    expect(adaptTempo(60, 0.969, at(10))).toBe(60);
    expect(adaptTempo(299, 1, at(1))).toBe(300);
    expect(adaptTempo(31, 0, at(1))).toBe(30);
    expect(adaptTempo(60, 1, [null, null])).toBe(60);
  });
});

describe("sound.ts (port of crates/plexustyping-audio/src/sound.rs)", () => {
  it("synthesizes the app's three sounds at their lengths, within the accent gain, deterministically", () => {
    const rate = 48_000;
    expect(synthesize("click", rate, false)).toHaveLength(576);
    expect(synthesize("wood", rate, false)).toHaveLength(1920);
    expect(synthesize("beep", rate, true)).toHaveLength(2400);
    for (const sound of ["click", "wood", "beep"] as const) {
      for (const accent of [false, true]) {
        const samples = synthesize(sound, rate, accent);
        const peak = Math.max(...samples.map(Math.abs));
        expect(peak).toBeGreaterThan(0);
        // The accented click's differentiated noise can reach the ±1 clamp, as in Rust.
        expect(peak).toBeLessThanOrEqual(accent ? 1 : 0.55);
        expect(synthesize(sound, rate, accent)).toEqual(samples);
      }
    }
    // Beep and wood start from silence (sine at t = 0).
    expect(synthesize("beep", rate, false)[0]).toBe(0);
  });
});

/** A stand-in AudioContext that records what the demo asks of it. */
function fakeAudio() {
  const created: { started: number[] }[] = [];
  const factory = () => {
    const record = { started: [] as number[] };
    created.push(record);
    const node = () => ({ connect: () => node(), gain: { value: 1 } });
    return {
      sampleRate: 48_000,
      currentTime: 0,
      state: "running",
      destination: {},
      resume: async () => {},
      createBuffer: (_c: number, length: number) => ({ length, copyToChannel: () => {} }),
      createGain: () => ({ connect: () => {}, gain: { value: 1 } }),
      createBufferSource: () => ({ buffer: null, connect: () => {}, start: (t: number) => record.started.push(t) }),
    } as unknown as AudioContext;
  };
  return { created, factory };
}

describe("DemoMetronome (the demo's MetronomeApi)", () => {
  const config = { bpm: 120, sound: "click" as const, volume: 0.8, accentEvery: 4 };

  it("runs the beat without any audio before the visitor's first gesture", async () => {
    const audio = fakeAudio();
    let now = 1_000;
    const metronome = new DemoMetronome({ now: () => now, createContext: audio.factory });
    expect(await metronome.start(config)).toEqual({ epochMs: 1_000 });
    now = 5_000;
    metronome.pump();
    expect(audio.created).toHaveLength(0);
    expect(metronome.soundOn).toBe(false);
  });

  it("creates the audio context only when the visitor turns the sound on, then schedules the beats", async () => {
    const audio = fakeAudio();
    let now = 1_000;
    const metronome = new DemoMetronome({ now: () => now, createContext: audio.factory });
    await metronome.start(config);
    metronome.enableSound();
    expect(audio.created).toHaveLength(1);
    now = 1_050;
    metronome.pump();
    expect(audio.created[0]!.started.length).toBeGreaterThan(0);
    metronome.disableSound();
    expect(metronome.soundOn).toBe(false);
  });

  it("keeps beat 0 on a same-tempo update, restarts it on a new tempo and answers null when stopped", async () => {
    let now = 1_000;
    const metronome = new DemoMetronome({ now: () => now, createContext: fakeAudio().factory });
    await metronome.start(config);
    now = 2_000;
    expect(await metronome.update({ ...config, volume: 0.2 })).toEqual({ epochMs: 1_000 });
    expect(await metronome.update({ ...config, bpm: 90 })).toEqual({ epochMs: 2_000 });
    await metronome.stop();
    expect(await metronome.update(config)).toBeNull();
  });
});
