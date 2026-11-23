<!--
  S8 "Modo código" demo (PRD §8): the app's practice screen in code mode (src/sim/code/AppScreen.svelte,
  extracted from the app) driven by CodeDemo (src/sim/data/s8.ts): the app's TypingSession with automatic
  indent over a snippet of the app's code corpus, syntax-highlighted. A recorded replay types it and moves
  on to the next language; the visitor can type instead (click or Tab to the field) or pick a language.
  Under prefers-reduced-motion it never starts on its own.
-->
<script lang="ts">
  import { onMount } from "svelte";
  import { pressFor } from "../../sim/code/keys";
  import { tokenClasses } from "../../sim/code/syntax";
  import { CodeDemo, SNIPPETS } from "../../sim/data/s8";
  import { ES_QWERTY } from "../../sim/data/es-qwerty";
  import { type S8Strings, percentIn } from "../../sim/i18n/s8";
  import { KEYBOARD_UI } from "../../sim/i18n/app";
  import { type Flash, highlightsFor, keyForChar } from "../../sim/keyboard/keys";
  import type { Layout } from "../../sim/keyboard/types";
  import { acceptsInput, keyAction, textToEvents } from "../../sim/practice/engine";
  import { formatWpm } from "../../sim/practice/format";
  import AppScreen from "../../sim/code/AppScreen.svelte";
  import type { Locale } from "../../i18n/paths";

  let {
    strings: t,
    locale = "es",
    layout = ES_QWERTY,
  }: { strings: S8Strings; locale?: Locale; layout?: Layout } = $props();

  const uid = $props.id();
  const textId = `${uid}-text`;
  const LANGUAGES = SNIPPETS.map(({ id, name }) => ({ id, name }));

  let tick = $state(0);
  let now = $state(0);
  let flash = $state.raw<Flash | null>(null);
  let wantPlay = $state(false);
  let ready = $state(false);
  let announcement = $state("");
  let field = $state<HTMLTextAreaElement>();
  let root = $state<HTMLElement>();
  let onScreen = true;

  // Server and first client render: the still state (the first snippet partly typed). The page decides
  // whether it plays (wantPlay below), so the demo's own reduced-motion autoplay is never used.
  const demo = new CodeDemo({
    reducedMotion: true,
    onChange: (keystroke) => {
      if (keystroke?.event.kind === "char") {
        const code = keystroke.event.ch === "\n" ? "Enter" : keyForChar(layout, keystroke.event.ch);
        if (code) flash = { code, ok: keystroke.event.ch === keystroke.expected };
      }
      // The constructor reports its still state before `demo` exists: the keystroke carries the time.
      if (keystroke) now = keystroke.event.tMs;
      tick++;
    },
    onFinished: ({ netWpm, accuracy }) => {
      announcement = t.finished.replace("{wpm}", formatWpm(netWpm)).replace("{accuracy}", percentIn(locale, accuracy));
    },
  });
  now = demo.lastT;

  const view = $derived.by(() => {
    void tick;
    const s = demo.session;
    return { chars: [...s.chars], states: s.chars.map((_, i) => s.state(i)), cursor: s.cursor, stats: s.result().stats };
  });
  const snippet = $derived.by(() => (void tick, demo.snippet));
  const classes = $derived(tokenClasses(view.chars.length, snippet.tokens));
  const highlights = $derived(highlightsFor(pressFor(layout, view.chars[view.cursor])));
  const elapsed = $derived.by(() => (void tick, demo.session.firstT === null ? 0 : Math.max(now - demo.session.firstT, 0)));
  const hint = $derived(view.cursor !== 0 ? t.app.hintStarted : t.app.hintStart);
  const visitor = $derived.by(() => (void tick, demo.mode === "visitor"));

  function run() {
    if (wantPlay && onScreen) demo.play();
    else demo.pause();
    tick++;
  }

  function togglePlay() {
    wantPlay = !wantPlay;
    announcement = wantPlay ? t.playing : t.paused;
    run();
  }

  function choose(id: string) {
    demo.select(SNIPPETS.findIndex((s) => s.id === id));
    tick++;
  }

  /** The visitor's first keystroke stops the replay (the button then reads "Reproducir"). */
  function typed() {
    if (wantPlay) wantPlay = false;
  }

  // Practice.svelte: typed chars come only from text the field received.
  function takeText() {
    if (!field) return;
    const value = field.value;
    field.value = "";
    if (!value) return;
    typed();
    demo.input(textToEvents(value, performance.now()));
  }

  function onInput(e: Event) {
    const input = e as globalThis.InputEvent;
    if (input.isComposing) return;
    if (acceptsInput(input.inputType)) takeText();
    else if (field) field.value = "";
  }

  function onKeydown(e: KeyboardEvent) {
    const action = keyAction(e);
    if (!demo.key(action, performance.now())) return;
    e.preventDefault();
    typed();
    if (action === "escape") announcement = t.restarted;
  }

  // The clock of a snippet the visitor is typing, as the app's 250 ms interval.
  const ticking = $derived(visitor && view.cursor > 0 && view.cursor < view.chars.length);
  $effect(() => {
    if (!ticking) return;
    const timer = setInterval(() => (now = performance.now()), 250);
    return () => clearInterval(timer);
  });

  /** A click on the demo gives the keyboard to its typing field. */
  function focusField(e: MouseEvent) {
    if ((e.target as Element).closest("button, select")) return;
    field?.focus({ preventScroll: true });
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
      <span class="hint" aria-hidden="true">{t.hint}</span>
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
  <!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
  <!-- Pointer convenience only: keyboard users reach the typing field with Tab. -->
  <div class="screen" onclick={focusField} lang={locale}>
    <AppScreen
      labels={t.app}
      kind="code"
      {view}
      {elapsed}
      source={`${snippet.name} · ${t.app.source}`}
      {hint}
      {layout}
      keyboardStrings={KEYBOARD_UI[locale]}
      {highlights}
      {flash}
      {classes}
      languages={LANGUAGES}
      language={snippet.id}
      onlanguage={choose}
      {textId}
      bind:field
      capture={ready}
      oninput={onInput}
      onkeydown={onKeydown}
      oncompositionend={takeText}
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
  .hint {
    font-size: 0.8125rem;
    color: var(--muted);
    white-space: nowrap;
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
    .hint,
    .play-label {
      display: none;
    }
  }
</style>
