<!--
  Copy of the PlexusTyping app's src/features/metronome/BeatDot.svelte (app commit 14f64cf2b9619deca9d99c2dbb3a2358586c5390).
  Demo edits: a `running` prop; while the demo is paused the dot stays unlit and no frame loop runs. A `label`
  prop (the English pages' translated name; the app's Spanish one without it).
-->
<script lang="ts">
  import { type BeatAnchor, beatAt, isAccent } from "./beat";

  // Flashes on each beat (S7), driven by requestAnimationFrame from beat 0; classes only (CSP).
  // Demo edit: `running` (see the header).
  // Demo edit: `label`, the dot's accessible name for a tempo.
  let { anchor, running = true, label }: { anchor: BeatAnchor; running?: boolean; label?: (bpm: number) => string } = $props();

  let on = $state(false);
  let accent = $state(false);

  $effect(() => {
    // Demo edit: paused, the dot is unlit and nothing runs.
    if (!running) {
      on = false;
      accent = false;
      return;
    }
    const { epochMs, intervalMs, accentEvery } = anchor;
    const flashMs = Math.min(120, intervalMs / 2);
    let frame = 0;
    const tick = () => {
      const beat = beatAt(performance.timeOrigin + performance.now(), epochMs, intervalMs);
      const lit = beat !== null && beat.sinceMs < flashMs;
      if (lit !== on) on = lit;
      const strong = lit && beat !== null && isAccent(beat.index, accentEvery); // Demo edit: `beat !== null` for the site's strictest tsconfig
      if (strong !== accent) accent = strong;
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  });
</script>

<span class="dot" class:on class:accent role="img" aria-label={label ? label(anchor.bpm) : `Metrónomo: ${anchor.bpm} BPM`} title="{anchor.bpm} BPM"></span>

<style>
  .dot {
    flex: none;
    width: 0.75rem;
    height: 0.75rem;
    border-radius: 50%;
    background: var(--surface-2);
    border: 1px solid var(--border);
  }
  .on {
    background: var(--accent);
    border-color: var(--accent);
  }
  /* Reduced motion (a11y S6): the dot still lights on every beat, instantly, with no transition or animation. */
  @media (prefers-reduced-motion: reduce) {
    .dot {
      transition: none;
      animation: none;
    }
  }
  .on.accent {
    background: var(--warning);
    border-color: var(--warning);
    box-shadow: 0 0 0 0.2rem color-mix(in srgb, var(--warning) 35%, transparent);
  }
</style>
