<!--
  S4 "Sesión fantasma" demo (PRD §8): the app's practice screen (src/sim/practice/PracticeScreen.svelte,
  extracted from the app) driven by GhostDemo (src/sim/data/s4.ts), which races a recorded session against
  a prerecorded record with the app's ghost logic (src/sim/practice/ghost.ts). Replay only, pausable; never
  starts on its own under prefers-reduced-motion. Extracted from the app at commit
  14f64cf2b9619deca9d99c2dbb3a2358586c5390, with their <style>: the ghost delta (src/features/practice/
  Practice.svelte, `.ghost-delta`) and the results (src/features/practice/Results.svelte). Edits are marked
  "Demo edit".
-->
<script lang="ts">
  import { onMount } from "svelte";
  import { ES_QWERTY } from "../../sim/data/es-qwerty";
  import { GHOST_TEXT, GhostDemo } from "../../sim/data/s4";
  import { sequencesFor } from "../../sim/data/sequences";
  import type { S4Strings } from "../../sim/i18n/s4";
  import { type Flash, highlightsFor, keyForChar } from "../../sim/keyboard/keys";
  import { NEW_RECORD, formatDelta } from "../../sim/practice/ghost";
  import { charLabel, formatPercent, formatTime, formatWpm } from "../../sim/practice/format";
  import PracticeScreen from "../../sim/practice/PracticeScreen.svelte";

  let { strings: t }: { strings: S4Strings } = $props();

  const uid = $props.id();
  const textId = `${uid}-text`;
  const SEQUENCES = sequencesFor(GHOST_TEXT);

  let tick = $state(0);
  /** Race time (ms) the ghost cursor is drawn at; moves on between keystrokes while playing. */
  let now = $state(0);
  let flash = $state.raw<Flash | null>(null);
  let wantPlay = $state(false);
  let ready = $state(false);
  let announcement = $state("");
  let root = $state<HTMLElement>();
  let onScreen = $state(true);

  // Server and first client render: the still state, mid-race.
  const demo = new GhostDemo({
    reducedMotion: true,
    onChange: (keystroke) => {
      if (keystroke) {
        now = keystroke.event.tMs;
        if (keystroke.event.kind === "char") {
          const code = keyForChar(ES_QWERTY, keystroke.event.ch);
          if (code) flash = { code, ok: keystroke.event.ch === keystroke.expected };
        }
      } else now = demo.lastT;
      tick++;
    },
  });
  now = demo.lastT;

  const view = $derived.by(() => {
    void tick;
    const s = demo.session;
    return { chars: [...s.chars], states: s.chars.map((_, i) => s.state(i)), cursor: s.cursor, stats: s.result().stats };
  });
  const phase = $derived.by(() => (void tick, demo.phase));
  const delta = $derived.by(() => (void tick, demo.delta));
  const elapsed = $derived.by(() => (void tick, demo.session.firstT === null ? 0 : Math.max(now - demo.session.firstT, 0)));
  const highlights = $derived(highlightsFor(SEQUENCES[view.cursor]));
  // Practice.svelte's ghostAt / ghostIndex / ghostEnd.
  const ghostAt = $derived.by(() => (void tick, phase === "typing" ? demo.ghostAt(now) : null));
  const ghostIndex = $derived(ghostAt === null ? -1 : Math.min(ghostAt, view.chars.length - 1));
  const ghostEnd = $derived(ghostAt !== null && ghostAt === view.chars.length);
  // Results.svelte's figures, for the session just finished.
  const scored = $derived.by(() => {
    void tick;
    if (phase !== "results") return null;
    const result = demo.session.result();
    const failed = [...new Set(result.records.filter((r) => !r.correct).map((r) => r.expected))];
    return { stats: result.stats, failed, records: demo.records };
  });

  // Practice.svelte: "The ghost cursor moves on its own while a raced text is typed" (every 50 ms). Demo
  // edit: the race clock runs on from the latest keystroke, never past the next recorded one.
  const moving = $derived(wantPlay && onScreen && phase === "typing");
  $effect(() => {
    if (!moving) return;
    let last = performance.now();
    const timer = setInterval(() => {
      const t0 = performance.now();
      const next = demo.nextT;
      now = Math.min(now + (t0 - last), next ?? Number.POSITIVE_INFINITY);
      last = t0;
    }, 50);
    return () => clearInterval(timer);
  });

  // Demo edit: the results start at the top of the practice area (the app's area is not scrolled by then).
  $effect(() => {
    if (phase !== "results") return;
    const area = root?.querySelector<HTMLElement>(".pt-app > .main");
    if (area) area.scrollTop = 0;
  });

  function run() {
    if (wantPlay && onScreen) demo.play();
    else demo.pause();
  }

  function togglePlay() {
    wantPlay = !wantPlay;
    announcement = wantPlay ? t.playing : t.paused;
    run();
  }

  onMount(() => {
    const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
    ready = true;
    wantPlay = !reducedMotion;
    run();
    const observer = new IntersectionObserver(([entry]) => {
      onScreen = !!entry?.isIntersecting && !document.hidden;
      run();
    });
    if (root) observer.observe(root);
    const onVisibility = () => {
      onScreen = !document.hidden;
      run();
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      demo.pause();
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
  <div class="screen" lang="es">
    <PracticeScreen
      {view}
      {elapsed}
      source="Corpus local"
      targets={[]}
      layout={ES_QWERTY}
      {highlights}
      {flash}
      heat={null}
      {textId}
      capture={false}
      {ghostIndex}
      {ghostEnd}
      top={delta === null ? undefined : top}
      results={scored ? results : undefined}
    />
  </div>
</div>

{#snippet top()}
  <!-- Practice.svelte, in the stats row while a text races its ghost. -->
  {#if delta !== null}
    {@const d = formatDelta(delta)}
    <p class="ghost-delta" class:behind={d.startsWith("+")} class:ahead={d.startsWith("−")} aria-label="Diferencia con tu récord">{d}</p>
  {/if}
{/snippet}

{#snippet results()}
  {#if scored}
    <!-- Results.svelte. Demo edits: the heading is a <p class="h2"> (the website owns the page's heading
         outline); no metronome rhythm, tempo, daily-goal, unlock, weak-spots or save-error lines (this demo
         shows the ghost's lines); the buttons are a picture (inert); no role="status" on the record lines
         (a looping replay would announce them again and again). -->
    <section class="results" aria-label="Resultado">
      <p class="h2">Resultado</p>
      <dl class="figures">
        <div class="main"><dt>PPM netas</dt><dd>{formatWpm(scored.stats.netWpm)}</dd></div>
        <div><dt>PPM brutas</dt><dd>{formatWpm(scored.stats.grossWpm)}</dd></div>
        <div><dt>Precisión</dt><dd>{formatPercent(scored.stats.accuracy)}</dd></div>
        <div><dt>Tiempo</dt><dd>{formatTime(scored.stats.durationMs)}</dd></div>
        <div><dt>Errores</dt><dd>{scored.stats.errors}</dd></div>
      </dl>
      {#each scored.records as line (line)}<p class="record" class:new-record={line === NEW_RECORD}>{line}</p>{/each}
      {#if scored.failed.length > 0}
        <p class="failed">
          Caracteres fallados:
          {#each scored.failed as c, i (i)}<kbd>{charLabel(c)}</kbd>{/each}
        </p>
      {:else}
        <p class="note">Sin fallos.</p>
      {/if}
      <div class="actions" inert aria-hidden="true">
        <button type="button" class="primary" tabindex="-1">Siguiente texto <kbd>Intro</kbd></button>
        <button type="button" tabindex="-1">Repetir <kbd>Esc</kbd></button>
      </div>
    </section>
  {/if}
{/snippet}

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

  /* src/features/practice/Practice.svelte */
  .ghost-delta {
    margin: 0 0 0 auto;
    font-family: var(--mono);
    font-size: 1.25rem;
    font-variant-numeric: tabular-nums;
    color: var(--muted);
  }
  .ghost-delta.behind {
    color: var(--danger);
  }
  .ghost-delta.ahead {
    color: var(--accent);
  }

  /* src/features/practice/Results.svelte */
  .results {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }
  /* The app's `h2` rule. */
  .h2 {
    margin: 0;
    font-size: 1.1rem;
    color: var(--muted);
    font-weight: 600;
  }
  .figures {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-end;
    gap: 1rem 2.5rem;
    margin: 0;
  }
  dt {
    color: var(--muted);
    font-size: 0.9rem;
  }
  dd {
    margin: 0;
    font-family: var(--mono);
    font-size: 1.75rem;
    font-variant-numeric: tabular-nums;
  }
  .main dd {
    font-size: 3.5rem;
    line-height: 1;
    color: var(--accent);
  }
  .failed,
  .note,
  .record {
    margin: 0;
  }
  .new-record {
    font-weight: 700;
    color: var(--accent);
  }
  .note {
    color: var(--muted);
  }
  .failed kbd {
    margin-left: 0.4rem;
  }
  kbd {
    display: inline-block;
    min-width: 1.4em;
    padding: 0.1em 0.4em;
    font-family: var(--mono);
    text-align: center;
    color: var(--key-fg);
    background: var(--key-bg);
    border: 1px solid var(--key-border);
    border-radius: 0.3em;
  }
  .actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
  }
  .primary {
    color: var(--on-accent);
    background: var(--accent);
    border-color: var(--accent);
  }
  .primary kbd {
    color: inherit;
    background: transparent;
    border-color: currentColor;
  }

  /* Demo edit: phone widths (PracticeScreen's 44rem container rule gives the practice area a fixed 15rem).
     The race needs its delta and the text in view together, so this demo's area is taller and the
     "Pulsaciones/min" figure, the least related to the race, is left out there. */
  @container (max-width: 44rem) {
    .screen :global(.pt-app > .main) {
      height: 20rem;
    }
    .screen :global(.live > div:nth-child(2)) {
      display: none;
    }
    .ghost-delta {
      white-space: nowrap;
    }
  }

  /* Website controls, in the window's title bar (src/pages/sim-preview/*.astro), on its right. */
  .controls {
    position: absolute;
    top: 0;
    right: 0.5rem;
    height: 2.375rem;
    display: flex;
    align-items: center;
    gap: 0.625rem;
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
