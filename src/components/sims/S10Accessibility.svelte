<!--
  S10 "Accesibilidad" demo (PRD §8): the app's practice screen (src/sim/code/AppScreen.svelte, extracted from
  the app) typed by A11yDemo (src/sim/data/s10.ts), with the app's accessibility switches beside it, drawn
  with its SettingField (src/sim/personalize/SettingField.svelte) in the SettingsModal frame:
  - «Anunciar con lector de pantalla»: the transcript shows what the app's polite aria-live region says
    (announce.ts). Demo edit: it is a visible list, not a live region, so a looping replay is not read aloud.
  - «Modo daltónico»: the keyboard's colour-blind flashes (Keyboard.svelte `colorBlind`).
  - «Movimiento reducido»: the app follows the system setting; here a switch shows its effect (no flashes,
    the pressed key underlined, as Keyboard.svelte's reduced-motion rule). It starts at the visitor's own
    setting, and under prefers-reduced-motion the replay never starts on its own.
-->
<script lang="ts">
  import { onMount } from "svelte";
  import type { Locale } from "../../i18n/paths";
  import AppScreen from "../../sim/code/AppScreen.svelte";
  import { pressFor } from "../../sim/code/keys";
  import { A11yDemo } from "../../sim/data/s10";
  import { ES_QWERTY } from "../../sim/data/es-qwerty";
  import type { S10Strings } from "../../sim/i18n/s10";
  import { type Flash, highlightsFor, keyForChar } from "../../sim/keyboard/keys";
  import type { Layout } from "../../sim/keyboard/types";
  import SettingField from "../../sim/personalize/SettingField.svelte";

  let {
    strings: t,
    locale = "es",
    layout = ES_QWERTY,
  }: { strings: S10Strings; locale?: Locale; layout?: Layout } = $props();

  const uid = $props.id();
  const textId = `${uid}-text`;
  const titleId = `${uid}-title`;
  const transcriptId = `${uid}-transcript`;

  let tick = $state(0);
  let flash = $state.raw<Flash | null>(null);
  let wantPlay = $state(false);
  let ready = $state(false);
  let announcement = $state("");
  let colorBlind = $state(false);
  let reduceMotion = $state(false);
  let root = $state<HTMLElement>();
  let onScreen = true;

  // Server and first client render: the still state. The page decides whether it plays (wantPlay).
  const demo = new A11yDemo({
    locale,
    reducedMotion: true,
    onChange: (keystroke) => {
      if (keystroke?.event.kind === "char") {
        const code = keyForChar(layout, keystroke.event.ch);
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
  const highlights = $derived(highlightsFor(pressFor(layout, view.chars[view.cursor])));
  const transcript = $derived.by(() => (void tick, demo.transcript));
  const screenReader = $derived.by(() => (void tick, demo.screenReader));

  function run() {
    if (wantPlay && onScreen) demo.play();
    else demo.pause();
  }

  function togglePlay() {
    wantPlay = !wantPlay;
    announcement = wantPlay ? t.playing : t.paused;
    run();
  }

  type Change = Event & { currentTarget: HTMLInputElement };

  onMount(() => {
    reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
    ready = true;
    wantPlay = !reduceMotion;
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

  <div class="screen" class:reduce={reduceMotion} lang={locale}>
    <AppScreen
      labels={t.app}
      kind="prose"
      {view}
      {elapsed}
      source={t.app.source}
      hint={view.cursor !== 0 ? t.app.hintStarted : t.app.hintStart}
      {layout}
      {highlights}
      {flash}
      {colorBlind}
      {textId}
      capture={false}
    />
  </div>

  <div class="pt-app panels" lang={locale}>
    <!-- SettingsModal.svelte's frame with AccessibilitySection.svelte's switches (Demo edit: plus the
         system's reduced motion, which the app only follows). -->
    <div class="settings" role="group" aria-labelledby={titleId}>
      <div class="settings-header"><p class="h2" id={titleId}>{t.settingsTitle}</p></div>
      <div class="panel">
        <SettingField toggle label={t.settings.screenReader.label} hint={t.settings.screenReader.hint}>
          {#snippet children({ id, hintId })}
            <input
              {id}
              type="checkbox"
              aria-describedby={hintId}
              aria-controls={transcriptId}
              checked={screenReader}
              disabled={!ready}
              onchange={(e: Change) => {
                demo.setScreenReader(e.currentTarget.checked);
                tick++;
              }}
            />
          {/snippet}
        </SettingField>
        <SettingField toggle label={t.settings.colorBlind.label} hint={t.settings.colorBlind.hint}>
          {#snippet children({ id, hintId })}
            <input
              {id}
              type="checkbox"
              aria-describedby={hintId}
              checked={colorBlind}
              disabled={!ready}
              onchange={(e: Change) => (colorBlind = e.currentTarget.checked)}
            />
          {/snippet}
        </SettingField>
        <SettingField toggle label={t.settings.reducedMotion.label} hint={t.settings.reducedMotion.hint}>
          {#snippet children({ id, hintId })}
            <input
              {id}
              type="checkbox"
              aria-describedby={hintId}
              checked={reduceMotion}
              disabled={!ready}
              onchange={(e: Change) => (reduceMotion = e.currentTarget.checked)}
            />
          {/snippet}
        </SettingField>
      </div>
    </div>

    <section class="transcript" id={transcriptId} aria-labelledby="{transcriptId}-title">
      <p class="h2" id="{transcriptId}-title">{t.transcriptTitle}</p>
      {#if screenReader}
        <ol>
          {#each transcript as line, i (`${i}-${line}`)}
            <li class:latest={i === transcript.length - 1}>{line}</li>
          {/each}
        </ol>
      {:else}
        <p class="off">{t.transcriptOff}</p>
      {/if}
    </section>
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

  /* Website controls, in the window's title bar (src/pages/sim-preview/*.astro), on its right. */
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
  @media (max-width: 30rem) {
    .play-label {
      display: none;
    }
  }

  /* The demo's reduced motion: Keyboard.svelte's prefers-reduced-motion rule, applied by the switch. The
     flashed key keeps its look and is underlined in the flash colour. */
  .screen.reduce :global(.keyboard .key.flash-ok),
  .screen.reduce :global(.keyboard .key.flash-bad) {
    color: var(--key-fg);
    background: var(--key-bg);
    border-color: var(--key-border);
  }
  .screen.reduce :global(.keyboard .key.flash-ok) {
    box-shadow: inset 0 calc(var(--u) * -0.1) 0 var(--flash-ok);
  }
  .screen.reduce :global(.keyboard .key.flash-bad) {
    box-shadow: inset 0 calc(var(--u) * -0.1) 0 var(--flash-bad);
  }

  .panels {
    container-type: inline-size;
    display: grid;
    grid-template-columns: minmax(0, 28rem) minmax(0, 1fr);
    align-items: start;
    gap: 1.5rem;
    padding: clamp(1rem, 3vw, 2rem);
    border-top: 1px solid var(--border);
  }
  @media (max-width: 48rem) {
    .panels {
      grid-template-columns: minmax(0, 1fr);
    }
  }
  /* SettingsModal.svelte: dialog box, header and panel (as S7). */
  .settings,
  .transcript {
    color: var(--text);
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 0.75rem;
  }
  .settings-header {
    display: flex;
    align-items: center;
    padding: 0.6rem 0.75rem 0.6rem 1.25rem;
    border-bottom: 1px solid var(--border);
  }
  .h2 {
    margin: 0;
    font-size: 1.1rem;
    font-weight: bold;
  }
  .panel {
    padding: 0.5rem 1.25rem 1rem;
  }
  .transcript {
    padding: 0.6rem 1.25rem 1rem;
  }
  .transcript .h2 {
    padding-bottom: 0.6rem;
    font-size: 0.95rem;
  }
  .transcript ol {
    display: grid;
    gap: 0.35rem;
    margin: 0;
    padding: 0;
    list-style: none;
    font-family: var(--mono);
    font-size: 0.82rem;
  }
  .transcript li {
    color: var(--muted);
  }
  .transcript li.latest {
    color: var(--text);
  }
  .transcript li::before {
    content: "› ";
    color: var(--accent);
  }
  .off {
    margin: 0;
    font-size: 0.85rem;
    color: var(--muted);
  }
</style>
