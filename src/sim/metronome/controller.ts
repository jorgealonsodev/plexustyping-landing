// Verbatim copy of the PlexusTyping app's src/features/metronome/controller.ts (app commit 14f64cf2b9619deca9d99c2dbb3a2358586c5390).
// The demo gives it src/sim/metronome/demoApi.ts instead of the app's Tauri MetronomeApi.

import type { MetronomeApi, MetronomeConfig } from "./api";
import type { BeatAnchor } from "./beat";

const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);

/**
 * Keeps the backend metronome in the wished state (a config, or `null` = stopped). Calls run one
 * at a time and each applies the latest wish, so quick changes collapse into one call.
 */
export class MetronomeController {
  /** Beat 0 (epoch ms) and tempo of the running metronome; `null` when stopped. */
  anchor: BeatAnchor | null = null;
  /** Why the metronome could not start (Spanish, for the user). */
  error: string | null = null;
  private wish: MetronomeConfig | null = null;
  private applied: MetronomeConfig | null = null;
  /** The wish whose start failed: retried only once the wish changes. */
  private failed: MetronomeConfig | null = null;
  private queue: Promise<void> = Promise.resolve();

  constructor(
    private readonly api: MetronomeApi,
    private readonly onChange: () => void,
  ) {}

  /** Resolves once the wish (or a later one) is applied. */
  set(config: MetronomeConfig | null): Promise<void> {
    this.wish = config;
    this.queue = this.queue.then(() => this.step());
    return this.queue;
  }

  private async step() {
    const wish = this.wish;
    if (wish === null && this.applied === null) return this.publish(null, null);
    if (same(wish, this.applied) || (this.error !== null && same(wish, this.failed))) return;
    let anchor: BeatAnchor | null = null;
    let error: string | null = null;
    try {
      if (wish === null) {
        await this.api.stop();
      } else {
        const started = (this.applied && (await this.api.update(wish))) || (await this.api.start(wish));
        anchor = { epochMs: started.epochMs, intervalMs: 60_000 / wish.bpm, bpm: wish.bpm, accentEvery: wish.accentEvery };
      }
      this.applied = wish;
    } catch (err) {
      error = String(err);
      this.applied = null;
      this.failed = wish;
    }
    this.publish(anchor, error);
  }

  private publish(anchor: BeatAnchor | null, error: string | null) {
    const changed = error !== this.error || !same(anchor, this.anchor);
    this.anchor = anchor;
    this.error = error;
    if (changed) this.onChange();
  }
}
