<!--
  S2 "Tus puntos débiles" (PRD §8): the app's practice screen (src/sim/practice/PracticeScreen.svelte, extracted
  from the app) scored by the app's TypingSession. A recorded replay types the diagnostic text while the keyboard
  heatmap tints (the app's heat.ts levels and legend), then a new text arrives with the targets ("Practicando:
  ñ · qu · z") and words that contain them. Replay only: the screen is a picture the visitor watches, so it is
  inert. Never starts on its own under prefers-reduced-motion. The loop is website-only (as in HeroSim.svelte).
  On the English pages (`locale` "en") the texts are the app's English corpus on the English (US) keyboard
  (src/sim/data/demo.en.ts, s2.en.ts) and the app's UI is translated (src/sim/i18n/app.ts).
-->
<script lang="ts">
  import { onMount } from "svelte";
  import type { Locale } from "../../i18n/paths";
  import { DEMO_PACKS } from "../../sim/data/s1";
  import { S2_PACKS } from "../../sim/data/s2";
  import type { SimStrings } from "../../sim/i18n/s2";
  import { heatScores } from "../../sim/keyboard/heat";
  import { type Flash, highlightsFor, keyForChar } from "../../sim/keyboard/keys";
  import { type InputEvent, TypingSession } from "../../sim/practice/engine";
  import PracticeScreen from "../../sim/practice/PracticeScreen.svelte";
  import { ReplayDriver, type Script, toInput } from "../../sim/replay";

  let { strings: t, locale = "es" }: { strings: SimStrings; locale?: Locale } = $props();

  // The page's language is fixed for the island's life: its texts, layout and heat keyframes.
  // svelte-ignore state_referenced_locally
  const lang: Locale = locale;
  const { layout: LAYOUT, sequencesFor, heatScores: HEAT_SCORES, targets: TARGETS, diagnosticSource: DIAGNOSTIC_SOURCE, targetSource: TARGET_SOURCE } = DEMO_PACKS[lang];
  const { diagnostic: S2_DIAGNOSTIC, targets: S2_TARGETS, stillSteps: S2_STILL_STEPS, scoresAt } = S2_PACKS[lang];

  type Phase = "diagnostic" | "targets";
  const SCRIPTS: Record<Phase, Script> = { diagnostic: S2_DIAGNOSTIC, targets: S2_TARGETS };
  const FULL_HEAT = heatScores(LAYOUT, HEAT_SCORES);
  const MODE = "backspace-correct";
  const noop = () => {};

  const uid = $props.id();

  let phase = $state<Phase>("targets");
  let session = new TypingSession(SCRIPTS.targets.text, MODE);
  let tick = $state(0);
  let now = $state(0);
  /** Replay steps sent in this text: the diagnostic's heat keyframes follow it. */
  let step = $state(0);
  let flash = $state.raw<Flash | null>(null);
  let refreshing = $state(false);
  let root = $state<HTMLElement>();
  let wantPlay = $state(false);
  let ready = $state(false);
  let announcement = $state("");
  /** The loop has begun at the diagnostic text (the still state is the targets text). */
  let begun = false;
  let reducedMotion = true;
  let onScreen = true;
  let driver: ReplayDriver | null = null;
  let hold: { ms: number; fn: () => void; timer: ReturnType<typeof setTimeout> | null } | null = null;

  const view = $derived.by(() => {
    void tick;
    const s = session;
    return { chars: [...s.chars], states: s.chars.map((_, i) => s.state(i)), cursor: s.cursor, stats: s.result().stats };
  });
  const elapsed = $derived.by(() => (void tick, session.firstT === null ? 0 : Math.max(now - session.firstT, 0)));
  const sequences = $derived(sequencesFor(SCRIPTS[phase].text));
  const highlights = $derived(highlightsFor(sequences[view.cursor]));
  const heat = $derived(phase === "targets" ? FULL_HEAT : heatScores(LAYOUT, scoresAt(step)));
  const source = $derived(phase === "targets" ? TARGET_SOURCE : DIAGNOSTIC_SOURCE);
  const targets = $derived(phase === "targets" ? TARGETS : []);

  function apply(event: InputEvent, flashKey = true) {
    const expected = session.chars[session.cursor];
    if (!session.apply(event)) return;
    now = event.tMs;
    step++;
    tick++;
    if (flashKey && event.kind === "char") {
      const code = keyForChar(LAYOUT, event.ch);
      if (code) flash = { code, ok: event.ch === expected };
    }
  }

  function startText(next: Phase, steps = 0) {
    phase = next;
    session = new TypingSession(SCRIPTS[next].text, MODE);
    step = 0;
    for (const s of SCRIPTS[next].steps.slice(0, steps)) apply(toInput(s), false);
    tick++;
  }

  // Server and first client render: the targets text started, with the heat and the targets.
  startText("targets", S2_STILL_STEPS);

  function makeDriver() {
    driver = new ReplayDriver(SCRIPTS[phase], (e) => apply(e), { reducedMotion, onDone: replayDone });
  }

  function later(ms: number, fn: () => void) {
    hold = { ms, fn, timer: null };
    run();
  }

  /** The new text loads with the "Nuevo texto" arrows turning, as in the app. */
  function newText(next: Phase) {
    refreshing = true;
    later(700, () => {
      refreshing = false;
      startText(next);
      makeDriver();
      run();
    });
  }

  /** The diagnostic is scored and a new text arrives soon; the targets text rests, then the loop begins again. */
  function replayDone() {
    const next: Phase = phase === "diagnostic" ? "targets" : "diagnostic";
    later(phase === "diagnostic" ? 1400 : 3000, () => newText(next));
  }

  function run() {
    if (!wantPlay || !onScreen) return;
    if (!begun) {
      begun = true;
      startText("diagnostic");
      makeDriver();
    }
    if (hold) {
      if (hold.timer !== null) return;
      const h = hold;
      h.timer = setTimeout(() => {
        if (hold === h) hold = null;
        h.fn();
      }, h.ms);
    } else driver?.play();
  }

  function halt() {
    driver?.pause();
    if (hold?.timer != null) {
      clearTimeout(hold.timer);
      hold.timer = null;
    }
  }

  function togglePlay() {
    wantPlay = !wantPlay;
    announcement = wantPlay ? t.playing : t.paused;
    if (wantPlay) run();
    else halt();
  }

  onMount(() => {
    reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
    ready = true;
    // The same rule as the replay driver: autoplay unless reduced motion; "Reproducir" starts it then.
    wantPlay = new ReplayDriver(S2_DIAGNOSTIC, noop, { reducedMotion, clock: { set: noop, clear: noop } }).autoplay();
    run();
    const observer = new IntersectionObserver(([entry]) => {
      onScreen = (entry?.isIntersecting ?? false) && !document.hidden;
      if (onScreen) run();
      else halt();
    });
    if (root) observer.observe(root);
    const onVisibility = () => {
      onScreen = !document.hidden;
      if (onScreen) run();
      else halt();
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      halt();
    };
  });
</script>

<div class="sim" bind:this={root}>
  <p class="sr-only">{t.description}</p>
  {#if ready}
    <div class="controls">
      <button type="button" class="play" aria-label={wantPlay ? t.pause : t.play} title={wantPlay ? t.pause : t.play} onclick={togglePlay}>
        {#if wantPlay}
          <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" fill="currentColor">
            <rect x="6" y="5" width="4" height="14" rx="1" />
            <rect x="14" y="5" width="4" height="14" rx="1" />
          </svg>
        {:else}
          <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" fill="currentColor">
            <path d="M7 4.8v14.4a1 1 0 0 0 1.5.86l11.9-7.2a1 1 0 0 0 0-1.72L8.5 3.94A1 1 0 0 0 7 4.8z" />
          </svg>
          <span class="play-label">{t.play}</span>
        {/if}
      </button>
    </div>
  {/if}
  <p class="sr-only" aria-live="polite">{announcement}</p>
  <!-- A picture of the app at work: no focus stops inside, the text alternative above says what it shows. -->
  <div class="screen" lang={lang} inert>
    <PracticeScreen
      {view}
      {elapsed}
      {source}
      {targets}
      layout={LAYOUT}
      {highlights}
      {flash}
      {heat}
      {refreshing}
      textId={`${uid}-text`}
      oninput={noop}
      onkeydown={noop}
      oncompositionend={noop}
    />
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
  /* In the window's title bar (the preview page's frame), on its right. */
  .controls {
    position: absolute;
    top: 0;
    right: 0.5rem;
    height: 2.375rem;
    display: flex;
    align-items: center;
  }
  .play {
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
  .play:hover {
    border-color: var(--accent);
  }
  .play svg {
    flex: none;
  }
</style>
