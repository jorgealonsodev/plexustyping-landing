// Port to TypeScript of the PlexusTyping app's crates/plexustyping-audio/src/sound.rs `synthesize`
// (app commit 14f64cf2b9619deca9d99c2dbb3a2358586c5390): the same three sounds, lengths, gains, pitches,
// envelopes and deterministic xorshift noise, sample for sample (f64 here, f32 in Rust). The app plays them
// through cpal; the demo through WebAudio (demoApi.ts), scaled by the volume as clock.rs `render` does.
import type { Sound } from "./api";

const TAU = Math.PI * 2;
const U32_MAX = 0xffffffff;

/**
 * Synthesizes one beat as mono samples in `-1.0..=1.0`, shorter than 60 ms.
 *
 * An accented beat is louder and higher-pitched (brighter for `Click`).
 * Output is deterministic for a given input.
 */
export function synthesize(sound: Sound, sampleRate: number, accent: boolean): Float32Array<ArrayBuffer> {
  const rate = Math.max(sampleRate, 1);
  const [gain, pitch] = accent ? [0.95, 1.25] : [0.55, 1.0];
  const lenMs = sound === "click" ? 12.0 : sound === "wood" ? 40.0 : 50.0;
  const len = Math.max(Math.trunc((lenMs / 1000.0) * rate), 1);
  // Deterministic xorshift noise in `-1.0..1.0` (Rust `Noise`).
  let state = 0x9e3779b9;
  const noise = () => {
    state = (state ^ (state << 13)) >>> 0;
    state = (state ^ (state >>> 17)) >>> 0;
    state = (state ^ (state << 5)) >>> 0;
    return (state / U32_MAX) * 2.0 - 1.0;
  };
  let prevNoise = 0.0;
  const out = new Float32Array(len);
  for (let i = 0; i < len; i++) {
    const t = i / rate;
    const n = noise();
    let s: number;
    if (sound === "click") {
      // The accent uses differentiated (high-passed, brighter) noise.
      const burst = accent ? (n - prevNoise) * 0.7 : n;
      prevNoise = n;
      s = burst * Math.exp(-t / 0.0015);
    } else if (sound === "wood") {
      const tone = Math.sin(TAU * 1000.0 * pitch * t) * 0.9;
      s = (tone + n * 0.1 * Math.exp(-t / 0.001)) * Math.exp(-t / 0.006);
    } else {
      const attack = Math.min(t / 0.003, 1.0);
      const release = 1.0 - i / len;
      s = Math.sin(TAU * 880.0 * pitch * t) * attack * release * release;
    }
    out[i] = Math.min(Math.max(s * gain, -1.0), 1.0);
  }
  return out;
}
