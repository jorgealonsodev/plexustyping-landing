<!--
  S3 "Texto ilimitado" demo (PRD §8; app feature "Ilimitado", próxima versión 0.1.1): the app's practice
  screen (src/sim/practice/PracticeScreen.svelte, extracted from the app) driven by UnlimitedDemo
  (src/sim/data/s3.ts), which runs the app's unlimited-text logic (src/sim/practice/unlimited.ts) over a
  recorded replay. Replay only, accelerated, pausable; never starts on its own under prefers-reduced-motion.
  The markup under the text ("Generando más texto…", the hint and "Terminar") and its <style> are extracted
  from the app's src/features/practice/Practice.svelte at commit 14f64cf2b9619deca9d99c2dbb3a2358586c5390.
  On the English pages (`locale` "en") the texts are the app's English corpus on the English (US) keyboard
  (src/sim/data/s3.en.ts) and the app's UI is translated (src/sim/i18n/).
-->
<script lang="ts">
  import { onMount } from "svelte";
  import type { Locale } from "../../i18n/paths";
  import { S3_PACKS, UnlimitedDemo } from "../../sim/data/s3";
  import { PRACTICE_UI } from "../../sim/i18n/app";
  import { type S3Strings, UNLIMITED_UI } from "../../sim/i18n/s3";
  import { type Flash, highlightsFor, keyForChar } from "../../sim/keyboard/keys";
  import { KEYBOARDS } from "../../sim/keyboard/locale";
  import PracticeScreen from "../../sim/practice/PracticeScreen.svelte";

  let { strings: t, locale = "es" }: { strings: S3Strings; locale?: Locale } = $props();

  // The page's language is fixed for the island's life: its texts, layout and the app's UI strings.
  // svelte-ignore state_referenced_locally
  const lang: Locale = locale;
  const { layout: LAYOUT, sequencesFor } = KEYBOARDS[lang];
  const PACK = S3_PACKS[lang];
  const u = UNLIMITED_UI[lang];

  const uid = $props.id();
  const textId = `${uid}-text`;
  // Every char the text can grow to; the session's chars are always a prefix of it.
  const SEQUENCES = sequencesFor(PACK.segments.join(""));

  let tick = $state(0);
  let flash = $state.raw<Flash | null>(null);
  let wantPlay = $state(false);
  let ready = $state(false);
  let announcement = $state("");
  let root = $state<HTMLElement>();
  let generating = $state<HTMLElement>();
  let onScreen = true;

  // Server and first client render: the still state (the start text typed, waiting for its continuation).
  const demo = new UnlimitedDemo({
    reducedMotion: true,
    pack: PACK,
    onChange: (keystroke) => {
      if (keystroke?.event.kind === "char") {
        const code = keyForChar(LAYOUT, keystroke.event.ch);
        if (code) flash = { code, ok: keystroke.event.ch === keystroke.expected };
      }
      tick++;
    },
  });

  const view = $derived.by(() => {
    void tick;
    const s = demo.session;
    return { chars: [...s.chars], states: s.chars.map((_, i) => s.state(i)), cursor: s.cursor, stats: s.result().stats };
  });
  const elapsed = $derived.by(() => (void tick, demo.session.firstT === null ? 0 : demo.lastT - demo.session.firstT));
  const refreshing = $derived.by(() => (void tick, demo.refreshing));
  const highlights = $derived(highlightsFor(SEQUENCES[view.cursor]));
  const atEnd = $derived(view.cursor === view.chars.length);

  // Demo edit: the practice area scrolls to the cursor only (PracticeScreen); at the end there is no cursor
  // char, so "Generando más texto…" is brought into the area's view here, without scrolling the website.
  $effect(() => {
    if (!atEnd || !generating) return;
    const area = generating.closest<HTMLElement>(".pt-app > .main");
    if (!area) return;
    const over = generating.getBoundingClientRect().bottom - area.getBoundingClientRect().bottom;
    if (over > 0) area.scrollTop += over;
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
  <div class="controls">
    <span class="upcoming">{t.upcoming}</span>
    {#if ready}
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
    {/if}
  </div>
  <p class="sr-only" aria-live="polite">{announcement}</p>
  <div class="screen" lang={lang}>
    <PracticeScreen
      {view}
      {elapsed}
      source={PRACTICE_UI[lang].localCorpus}
      targets={[]}
      layout={LAYOUT}
      {highlights}
      {flash}
      heat={null}
      {refreshing}
      {textId}
      capture={false}
    >
      {#snippet after()}
        <!-- Practice.svelte, under the text of an unlimited session. Demo edit: no role="status" (a looping
             replay would announce it again and again; the text alternative describes it). -->
        {#if atEnd}
          <p class="hint" bind:this={generating}>{u.generating}</p>
        {/if}
        <p class="hint">{u.hint(view.cursor !== 0, false, true)}</p>
        <!-- Demo edit: a picture of the app's button; it does nothing here, so it is inert. -->
        <button type="button" class="end" tabindex="-1" inert aria-hidden="true">{u.finish}</button>
      {/snippet}
    </PracticeScreen>
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

  /* src/features/practice/Practice.svelte */
  .end {
    align-self: flex-start;
  }
  .hint {
    margin: 0;
    color: var(--muted);
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
  .upcoming {
    padding: 0.125rem 0.5rem;
    font-size: 0.75rem;
    font-weight: 600;
    white-space: nowrap;
    color: var(--accent);
    border: 1px solid color-mix(in srgb, var(--accent) 55%, transparent);
    border-radius: 999px;
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
  @media (max-width: 30rem) {
    .play-label {
      display: none;
    }
  }
</style>
