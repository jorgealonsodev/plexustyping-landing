<!--
  S5 "Metrónomo" (PRD §8, §6.6): the app's beat dot and quick panel (src/sim/metronome/, copied from the app)
  driven by the app's MetronomeController on an in-browser MetronomeApi (demoApi.ts). A prerecorded text is
  typed to the beat; when it ends, the app's Results lines show the rhythm ("Ritmo: desvío medio ±X ms") and,
  with "Tempo adaptativo" on, the next text's tempo from the app's adaptTempo. The pulse runs on its own (never
  under prefers-reduced-motion); the sound plays only after the visitor presses its button. On the English pages
  (`locale` "en") the app's UI is translated (src/sim/i18n/s5.ts) and the text is English (src/sim/data/s5.en.ts).
-->
<script lang="ts">
  import { onMount } from "svelte";
  import "../../sim/app.css";
  import type { Locale } from "../../i18n/paths";
  import { type Run, OFF_BEAT, ON_BEAT, START, STILL_TYPED, S5_TEXTS } from "../../sim/data/s5";
  import { PRACTICE_UI, RESULTS_UI } from "../../sim/i18n/app";
  import { METRONOME_UI, type S5Strings } from "../../sim/i18n/s5";
  import { type BeatAnchor, type MetronomeSettings, rhythmSummary, tempoChangeFor, toConfig } from "../../sim/metronome/beat";
  import { MetronomeController } from "../../sim/metronome/controller";
  import { DemoMetronome } from "../../sim/metronome/demoApi";
  import MetronomeQuick from "../../sim/metronome/MetronomeQuick.svelte";
  import PracticeText from "../../sim/personalize/PracticeText.svelte";
  import type { CharState } from "../../sim/practice/engine";

  let { strings: t, locale = "es" }: { strings: S5Strings; locale?: Locale } = $props();

  // The page's language is fixed for the island's life. Spanish: the app as it is; English: translated UI and text.
  // svelte-ignore state_referenced_locally
  const lang: Locale = locale;
  const m = METRONOME_UI[lang];
  const practiceText = PRACTICE_UI[lang].practiceText;

  const CHARS = [...S5_TEXTS[lang]];
  const RUNS: Run[] = [ON_BEAT, OFF_BEAT];
  /** Beats the finished text's result rests before the next text starts. */
  const REST_BEATS = 6;

  const api = new DemoMetronome();
  let anchor = $state.raw<BeatAnchor | null>(null);
  const controller = new MetronomeController(api, () => (anchor = controller.anchor));

  let settings = $state<MetronomeSettings>({ ...START });
  /** The demo should play (the button reads "Pausar"); it plays only while on screen. */
  let wantPlay = $state(false);
  let onScreen = $state(true);
  let soundOn = $state(false);
  let ready = $state(false);
  let announcement = $state("");
  let root = $state<HTMLElement>();

  const running = $derived(wantPlay && onScreen);
  /** The anchor the dot shows; a still one while paused (BeatDot is then unlit). */
  const shown = $derived<BeatAnchor>(
    anchor ?? { epochMs: 0, intervalMs: 60_000 / settings.bpm, bpm: settings.bpm, accentEvery: settings.accentEvery },
  );

  // The current run and how much of it is typed; the still state is the on-beat run, partly typed.
  let run = $state(0);
  let typed = $state(STILL_TYPED);
  const states = $derived<CharState[]>(CHARS.map((_, i) => (i < typed ? "correct" : "pending")));

  /** Results.svelte's rhythm and tempo lines for `r` typed at `bpm`. */
  function resultOf(r: Run, bpm: number) {
    const offsets = r.offsets.map((share) => Math.round(share * (60_000 / bpm)));
    return {
      rhythm: rhythmSummary(offsets),
      tempo: settings.adaptive ? tempoChangeFor(bpm, r.accuracy, offsets, false) : null,
    };
  }
  // The still state's previous text: the off-beat run at 105 BPM, which brought the tempo down to 100.
  let result = $state.raw(resultOf(OFF_BEAT, 105));

  // Keeps the metronome as the demo wants it: the app's MetronomeController collapses quick changes.
  $effect(() => {
    void controller.set(running ? toConfig(settings) : null);
  });

  /** Epoch ms of beat 0 of the current text, and the anchor it was laid on. */
  let textStart = 0;
  let laidOn: BeatAnchor | null = null;
  let restUntil = 0;

  const nowMs = () => performance.timeOrigin + performance.now();

  /** Lays the current text on the beat: the next keystroke falls on the next beat. */
  function layText(a: BeatAnchor, now: number) {
    const next = Math.max(Math.ceil((now - a.epochMs) / a.intervalMs), 0);
    textStart = a.epochMs + (next - typed) * a.intervalMs;
    laidOn = a;
  }

  function step(a: BeatAnchor) {
    const now = nowMs();
    if (laidOn !== a) layText(a, now);
    if (restUntil > 0) {
      if (now < restUntil) return;
      restUntil = 0;
      run = (run + 1) % RUNS.length;
      typed = 0;
      const to = result.tempo?.to;
      // The adaptive metronome sets the next text's tempo; a new tempo restarts beat 0 and re-lays the text.
      if (to !== undefined && to !== settings.bpm) settings.bpm = to;
      else layText(a, now);
      return;
    }
    const offsets = RUNS[run]?.offsets ?? [];
    const beats = (now - textStart) / a.intervalMs;
    let count = typed;
    while (count < CHARS.length && count + (offsets[count] ?? 0) <= beats) count++;
    if (count !== typed) typed = count;
    if (typed === CHARS.length) {
      result = resultOf(RUNS[run] ?? ON_BEAT, a.bpm);
      restUntil = now + REST_BEATS * a.intervalMs;
    }
  }

  $effect(() => {
    const a = anchor;
    if (!running || !a) return;
    let frame = requestAnimationFrame(function tick() {
      step(a);
      frame = requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(frame);
  });

  function change(c: Partial<MetronomeSettings>) {
    // "Apagar F4" stops the demo's metronome.
    if (c.enabled === false) {
      pause();
      return;
    }
    Object.assign(settings, c);
  }

  function pause() {
    wantPlay = false;
    announcement = t.paused;
  }

  function togglePlay() {
    if (wantPlay) return pause();
    wantPlay = true;
    announcement = t.playing;
  }

  /** The only way to sound: the visitor's press creates the AudioContext (demoApi.ts). */
  function toggleSound() {
    if (soundOn) {
      api.disableSound();
      soundOn = false;
      announcement = t.soundStopped;
      return;
    }
    api.enableSound();
    soundOn = true;
    wantPlay = true;
    announcement = t.soundStarted;
  }

  onMount(() => {
    ready = true;
    wantPlay = !matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Off screen or in a hidden tab the metronome stops, as the app's plays only while its window is visible.
    let visible = true;
    const update = () => (onScreen = visible && !document.hidden);
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? true;
      update();
    });
    if (root) observer.observe(root);
    document.addEventListener("visibilitychange", update);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", update);
      api.disableSound();
      void api.stop();
    };
  });
</script>

<div class="sim" bind:this={root}>
  <p class="sr-only">{t.description}</p>
  {#if ready}
    <div class="controls">
      <button type="button" class="ctl sound" aria-pressed={soundOn} onclick={toggleSound}>
        <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" fill="currentColor" stroke="none" />
          {#if soundOn}
            <path d="M15.5 9a4.5 4.5 0 0 1 0 6" /><path d="M18 6.5a8 8 0 0 1 0 11" />
          {:else}
            <path d="m16 9.5 5 5" /><path d="m21 9.5-5 5" />
          {/if}
        </svg>
        <span class="ctl-label">{soundOn ? t.soundOff : t.soundOn}</span>
      </button>
      <button type="button" class="ctl" aria-label={wantPlay ? t.pause : t.play} title={wantPlay ? t.pause : t.play} onclick={togglePlay}>
        {#if wantPlay}
          <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" fill="currentColor">
            <rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" />
          </svg>
        {:else}
          <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" fill="currentColor">
            <path d="M7 4.8v14.4a1 1 0 0 0 1.5.86l11.9-7.2a1 1 0 0 0 0-1.72L8.5 3.94A1 1 0 0 0 7 4.8z" />
          </svg>
          <span class="ctl-label">{t.play}</span>
        {/if}
      </button>
    </div>
  {/if}
  <p class="sr-only" aria-live="polite">{announcement}</p>

  <div class="pt-app" lang={lang}>
    <div class="main">
      <!-- Practice.svelte's .top row holds the beat dot and its quick panel (open here, in its own room). -->
      <div class="quick">
        <MetronomeQuick anchor={shown} metronome={settings} onChange={change} startOpen inline {running} strings={lang === "es" ? undefined : m} />
      </div>
      <div class="practice">
        <p class="kind">{practiceText}</p>
        <PracticeText chars={CHARS} {states} cursor={typed} label={practiceText} />
        <!-- Results.svelte's rhythm and tempo lines (Demo edit: under the next text, not on a results screen). -->
        <section class="results" aria-label={m.previousResult}>
          <p class="h2">{RESULTS_UI[lang].title}</p>
          {#if result.rhythm}
            <p class="rhythm">
              {m.rhythm(result.rhythm.meanAbsMs)}
              <span class="note">{m.rhythmShares(result.rhythm.earlyPct, result.rhythm.latePct)}</span>
            </p>
          {/if}
          {#if result.tempo}<p class="rhythm">{m.tempoNotice(result.tempo)}</p>{/if}
        </section>
      </div>
    </div>
  </div>
</div>

<style>
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    margin: -1px;
    padding: 0;
    overflow: hidden;
    clip-path: inset(50%);
    white-space: nowrap;
    border: 0;
  }
  /* In the window's title bar (the preview page), on its right, as the hero's. */
  .controls {
    position: absolute;
    top: 0;
    right: 0.5rem;
    height: 2.375rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  .ctl {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    min-width: 1.75rem;
    height: 1.75rem;
    padding: 0 0.375rem;
    font: inherit;
    font-size: 0.8125rem;
    color: var(--text);
    background: transparent;
    border: 1px solid var(--border);
    border-radius: 0.375rem;
    cursor: pointer;
  }
  .ctl:hover,
  .sound[aria-pressed="true"] {
    border-color: var(--accent);
  }
  .ctl svg {
    flex: none;
  }

  /* The demo window: Practice.svelte's main area, with the quick panel beside the text on wide windows. */
  .pt-app {
    container-type: inline-size;
  }
  .main {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr);
    align-items: start;
    gap: 1.5rem 2.5rem;
    padding: clamp(1rem, 4cqw, 2.5rem) clamp(1rem, 4cqw, 2rem);
  }
  .practice {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    min-width: 0;
  }
  /* Practice.svelte .kind */
  .kind {
    margin: 0 0 -0.75rem;
    font-size: 0.85rem;
    color: var(--muted);
  }
  /* Results.svelte: h2, .rhythm, .note */
  .results {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding-top: 1.25rem;
    border-top: 1px solid var(--border);
  }
  .h2 {
    margin: 0;
    font-size: 1.1rem;
    color: var(--muted);
    font-weight: 600;
  }
  .rhythm {
    margin: 0;
  }
  .note {
    color: var(--muted);
  }
  /* Narrow windows: panel above the text. */
  @container (max-width: 40rem) {
    .main {
      grid-template-columns: minmax(0, 1fr);
    }
  }
  @media (max-width: 30rem) {
    .sound .ctl-label {
      position: absolute;
      width: 1px;
      height: 1px;
      overflow: hidden;
      clip-path: inset(50%);
      white-space: nowrap;
    }
  }
</style>
