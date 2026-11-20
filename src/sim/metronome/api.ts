// Copy of the PlexusTyping app's src/features/metronome/api.ts (app commit 14f64cf2b9619deca9d99c2dbb3a2358586c5390).
// Demo edit: the types only. The app's `metronomeApi` calls the Rust core over Tauri IPC; the demo's
// in-browser stand-in is src/sim/metronome/demoApi.ts.

export type Sound = "click" | "wood" | "beep";

/** `plexustyping-audio` `MetronomeConfig`; volume is a 0–1 gain. */
export interface MetronomeConfig {
  bpm: number;
  sound: Sound;
  volume: number;
  accentEvery: number;
}

/** Beat 0 of the running metronome, in ms since the UNIX epoch (device output latency excluded). */
export interface MetronomeStarted {
  epochMs: number;
}

export interface MetronomeApi {
  start(config: MetronomeConfig): Promise<MetronomeStarted>;
  /** `null` when the metronome is stopped. A new tempo restarts beat 0. */
  update(config: MetronomeConfig): Promise<MetronomeStarted | null>;
  stop(): Promise<void>;
}
