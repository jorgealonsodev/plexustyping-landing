// The demo's in-browser MetronomeApi (website-only code). The app's api.ts asks the Rust core
// (crates/plexustyping-audio) to play; here the beat runs on the page clock, and the sound plays through
// WebAudio with the samples of sound.ts, the port of the app's synthesis.
// No sound before the visitor asks for it: the AudioContext is created only by enableSound(), which the
// island calls from the visitor's click. Until then the metronome is silent and only the dot pulses.
import type { MetronomeApi, MetronomeConfig, MetronomeStarted } from "./api";
import { isAccent } from "./beat";
import { synthesize } from "./sound";

export interface DemoMetronomeOptions {
  /** Epoch ms, like the app's beat 0 (tests pass a fake clock). */
  now?: () => number;
  /** Makes the AudioContext; called at most once, on the first enableSound(). */
  createContext?: () => AudioContext;
}

/** How far ahead beats are queued on the audio clock, in seconds. */
const LOOKAHEAD_S = 0.12;
/** How often the queue is topped up, in ms. */
const PUMP_MS = 25;

export class DemoMetronome implements MetronomeApi {
  #config: MetronomeConfig | null = null;
  #epochMs = 0;
  #ctx: AudioContext | null = null;
  #soundOn = false;
  /** Index of the next beat to queue on the audio clock. */
  #nextBeat = 0;
  /** Audio time (s) minus page time (s), taken when the sound turns on or the beat restarts. */
  #audioOffsetS = 0;
  #timer: ReturnType<typeof setInterval> | null = null;
  #buffers = new Map<string, AudioBuffer>();
  readonly #now: () => number;
  readonly #createContext: () => AudioContext;

  constructor({ now, createContext }: DemoMetronomeOptions = {}) {
    this.#now = now ?? (() => performance.timeOrigin + performance.now());
    this.#createContext = createContext ?? (() => new AudioContext());
  }

  get soundOn(): boolean {
    return this.#soundOn;
  }

  async start(config: MetronomeConfig): Promise<MetronomeStarted> {
    this.#config = config;
    this.#restartBeat();
    return { epochMs: this.#epochMs };
  }

  async update(config: MetronomeConfig): Promise<MetronomeStarted | null> {
    if (!this.#config) return null;
    const newTempo = config.bpm !== this.#config.bpm;
    this.#config = config;
    if (newTempo) this.#restartBeat();
    return { epochMs: this.#epochMs };
  }

  async stop(): Promise<void> {
    this.#config = null;
    this.#stopPump();
  }

  /** Turns the sound on; call it only from a visitor's gesture (it creates and resumes the AudioContext). */
  enableSound(): void {
    this.#ctx ??= this.#createContext();
    void this.#ctx.resume();
    this.#soundOn = true;
    this.#sync();
    this.#startPump();
  }

  disableSound(): void {
    this.#soundOn = false;
    this.#stopPump();
  }

  /** Queues the beats due within the lookahead (the interval timer calls it; tests call it directly). */
  pump(): void {
    const config = this.#config;
    const ctx = this.#ctx;
    if (!config || !ctx || !this.#soundOn) return;
    const intervalMs = 60_000 / config.bpm;
    const horizon = ctx.currentTime + LOOKAHEAD_S;
    for (;;) {
      const at = (this.#epochMs + this.#nextBeat * intervalMs) / 1000 + this.#audioOffsetS;
      if (at > horizon) break;
      const beat = this.#nextBeat++;
      if (at < ctx.currentTime) continue;
      const source = ctx.createBufferSource();
      source.buffer = this.#buffer(ctx, config, isAccent(beat, config.accentEvery));
      const gain = ctx.createGain();
      // clock.rs `render`: every sample times the volume, clamped to 0–1.
      gain.gain.value = Math.min(Math.max(config.volume, 0), 1);
      source.connect(gain);
      gain.connect(ctx.destination);
      source.start(at);
    }
  }

  #restartBeat() {
    this.#epochMs = this.#now();
    this.#sync();
    if (this.#soundOn) this.#startPump();
  }

  /** Maps page time to audio time and queues from the first beat not yet past. */
  #sync() {
    if (!this.#ctx || !this.#config) return;
    const nowMs = this.#now();
    this.#audioOffsetS = this.#ctx.currentTime - nowMs / 1000;
    const intervalMs = 60_000 / this.#config.bpm;
    this.#nextBeat = Math.max(Math.ceil((nowMs - this.#epochMs) / intervalMs), 0);
  }

  #buffer(ctx: AudioContext, config: MetronomeConfig, accent: boolean): AudioBuffer {
    const key = `${config.sound}:${accent}`;
    let buffer = this.#buffers.get(key);
    if (!buffer) {
      const samples = synthesize(config.sound, ctx.sampleRate, accent);
      buffer = ctx.createBuffer(1, samples.length, ctx.sampleRate);
      buffer.copyToChannel(samples, 0);
      this.#buffers.set(key, buffer);
    }
    return buffer;
  }

  #startPump() {
    if (this.#timer !== null || !this.#config) return;
    this.pump();
    this.#timer = setInterval(() => this.pump(), PUMP_MS);
  }

  #stopPump() {
    if (this.#timer !== null) clearInterval(this.#timer);
    this.#timer = null;
  }
}
