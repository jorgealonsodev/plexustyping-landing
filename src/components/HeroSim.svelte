<!--
  S1 hero demo (PRD §8): the app's practice screen (src/sim/practice/PracticeScreen.svelte, extracted from the
  app) scored by the app's TypingSession. A recorded replay types when the visitor does not; it stops the moment
  the visitor types, and never starts on its own under prefers-reduced-motion. The input handling mirrors the
  app's Practice.svelte (takeText/onInput/onKeydown/applyEvent); the loop and the replay are website-only.
  On the English pages (`locale` "en", S9 of odd/tasks/site-pages.md) the app's labels are translated and the
  texts are the app's English corpus on the English (US) keyboard (src/sim/data/s1.ts DEMO_PACKS); without a
  locale the demo is the Spanish one.
-->
<script lang="ts">
  import { onMount } from "svelte";
  import type { Locale } from "../i18n/paths";
  import type { HeroSimStrings } from "../i18n/ui";
  import { DEMO_PACKS } from "../sim/data/s1";
  import { KEYBOARD_UI, PRACTICE_UI } from "../sim/i18n/app";
  import { heatScores } from "../sim/keyboard/heat";
  import { type Flash, highlightsFor, keyForChar } from "../sim/keyboard/keys";
  import { type InputEvent, TypingSession, acceptsInput, keyAction, textToEvents } from "../sim/practice/engine";
  import { formatPercent, formatWpm } from "../sim/practice/format";
  import PracticeScreen from "../sim/practice/PracticeScreen.svelte";
  import { ReplayDriver, type Script, toInput } from "../sim/replay";

  // The strings come as a prop (only the page's language reaches the browser, not the whole ui.ts).
  let { strings: t, locale = "es" }: { strings: HeroSimStrings; locale?: Locale } = $props();

  // The page's language is fixed for the island's life: its texts, layout and labels.
  // svelte-ignore state_referenced_locally
  const lang: Locale = locale;
  const {
    layout: LAYOUT,
    sequencesFor,
    diagnosticScript: DIAGNOSTIC_SCRIPT,
    diagnosticSource: DIAGNOSTIC_SOURCE,
    diagnosticSteps: DIAGNOSTIC_STEPS,
    heatScores: HEAT_SCORES,
    stillSteps: STILL_STEPS,
    targetScript: TARGET_SCRIPT,
    targetSource: TARGET_SOURCE,
    targets: TARGETS,
  } = DEMO_PACKS[lang];

  type Phase = "diagnostic" | "targets";
  /** The replay types the start of the diagnostic text, then asks for a new text (F5), as a person might. */
  const SCRIPTS: Record<Phase, Script> = {
    diagnostic: { ...DIAGNOSTIC_SCRIPT, steps: DIAGNOSTIC_SCRIPT.steps.slice(0, DIAGNOSTIC_STEPS) },
    targets: TARGET_SCRIPT,
  };
  const HEAT = heatScores(LAYOUT, HEAT_SCORES);
  // Backspace corrects (the app's "Borrar con Retroceso" mode), so the replay can show its corrections.
  const MODE = "backspace-correct";

  const uid = $props.id();
  const textId = `${uid}-text`;

  let phase = $state<Phase>("targets");
  // The session is replaced, not mutated reactively: `tick` tells the view to read it again (as in the app).
  let session = new TypingSession(SCRIPTS.targets.text, MODE);
  let tick = $state(0);
  let now = $state(0);
  let flash = $state.raw<Flash | null>(null);
  let refreshing = $state(false);
  let field = $state<HTMLTextAreaElement>();
  let root = $state<HTMLElement>();
  /** Who types: the recorded replay or the visitor. */
  let mode = $state<"replay" | "visitor">("replay");
  /** The replay should run (the button reads "Pausar"); it runs only while the demo is on screen. */
  let wantPlay = $state(false);
  let ready = $state(false);
  let announcement = $state("");
  let reducedMotion = true;
  let onScreen = true;
  let driver: ReplayDriver | null = null;
  let hold: { ms: number; fn: () => void; timer: ReturnType<typeof setTimeout> | null } | null = null;

  const view = $derived.by(() => {
    void tick;
    const s = session;
    return { chars: [...s.chars], states: s.chars.map((_, i) => s.state(i)), cursor: s.cursor, stats: s.result().stats };
  });
  const started = $derived.by(() => (void tick, session.firstT !== null));
  const elapsed = $derived.by(() => (void tick, session.firstT === null ? 0 : Math.max(now - session.firstT, 0)));
  const sequences = $derived(sequencesFor(SCRIPTS[phase].text));
  const highlights = $derived(highlightsFor(sequences[view.cursor]));
  const heat = $derived(phase === "targets" ? HEAT : null);
  const source = $derived(phase === "targets" ? TARGET_SOURCE : DIAGNOSTIC_SOURCE);
  const targets = $derived(phase === "targets" ? TARGETS : []);

  /** The practice screen's applyEvent: scores the keystroke, moves the clock and flashes the key. */
  function apply(event: InputEvent, flashKey = true) {
    const expected = session.chars[session.cursor];
    if (!session.apply(event)) return;
    now = event.tMs;
    tick++;
    if (flashKey && event.kind === "char") {
      const code = keyForChar(LAYOUT, event.ch);
      if (code) flash = { code, ok: event.ch === expected };
    }
    if (mode === "visitor" && session.completed) visitorFinished();
  }

  /** A fresh session of `next`'s text, with its first `steps` replay steps already typed (the still state). */
  function startText(next: Phase, steps = 0) {
    phase = next;
    session = new TypingSession(SCRIPTS[next].text, MODE);
    for (const step of SCRIPTS[next].steps.slice(0, steps)) apply(toInput(step), false);
    tick++;
  }

  // Server and first client render: the targets text typed up to "quedarnos" (Spanish), heat and targets shown.
  startText("targets", STILL_STEPS);

  function makeDriver(from = 0) {
    driver = new ReplayDriver(SCRIPTS[phase], (e) => apply(e), { reducedMotion, from, onDone: replayDone });
  }

  function later(ms: number, fn: () => void) {
    hold = { ms, fn, timer: null };
    run();
  }

  /** After a replayed text: the diagnostic asks for a new text soon; the targets text rests, then loops. */
  function replayDone() {
    const next: Phase = phase === "diagnostic" ? "targets" : "diagnostic";
    later(phase === "diagnostic" ? 900 : 2600, () => {
      refreshing = true;
      later(700, () => {
        refreshing = false;
        startText(next);
        makeDriver();
        run();
      });
    });
  }

  /** Runs the replay (or its pending pause between texts) when it is wanted and visible. */
  function run() {
    if (!wantPlay || !onScreen || mode !== "replay") return;
    if (hold) {
      if (hold.timer !== null) return;
      const h = hold;
      h.timer = setTimeout(() => {
        if (hold === h) hold = null;
        h.fn();
      }, h.ms);
    } else driver?.play();
  }

  /** Stops the replay where it is; `run` resumes it. */
  function halt() {
    driver?.pause();
    if (hold?.timer != null) {
      clearTimeout(hold.timer);
      hold.timer = null;
    }
  }

  function togglePlay() {
    if (wantPlay) {
      wantPlay = false;
      halt();
      announcement = t.paused;
      return;
    }
    wantPlay = true;
    announcement = t.playing;
    // After the visitor typed, the replay starts the current text again.
    if (mode === "visitor") {
      mode = "replay";
      startText(phase);
      makeDriver();
    }
    run();
  }

  /** The visitor takes over: the replay stops and the current text starts again for them. */
  function takeOver() {
    if (mode === "visitor") return;
    wantPlay = false;
    halt();
    hold = null;
    driver = null;
    refreshing = false;
    mode = "visitor";
    startText(phase);
  }

  function visitorFinished() {
    const { netWpm, accuracy } = session.result().stats;
    announcement = t.finished.replace("{wpm}", formatWpm(netWpm)).replace("{accuracy}", formatPercent(accuracy));
    const next: Phase = phase === "diagnostic" ? "targets" : "diagnostic";
    setTimeout(() => mode === "visitor" && startText(next), 1500);
  }

  // Practice.svelte: typed chars come only from text the field received; reading and clearing it makes the
  // `input` and `compositionend` paths idempotent.
  function takeText() {
    if (!field) return;
    const value = field.value;
    field.value = "";
    if (!value) return;
    takeOver();
    for (const event of textToEvents(value, performance.now())) apply(event);
  }

  function onInput(e: Event) {
    const input = e as globalThis.InputEvent;
    if (input.isComposing) return;
    if (acceptsInput(input.inputType)) takeText();
    else if (field) field.value = "";
  }

  // Practice.svelte's onKeydown for prose, on the field only: Esc restarts, Backspace corrects; Tab is left
  // alone so it leaves the demo, and Enter types nothing in prose.
  function onKeydown(e: KeyboardEvent) {
    const action = keyAction(e);
    if (action === "escape") {
      e.preventDefault();
      takeOver();
      startText(phase);
      announcement = t.restarted;
    } else if (action === "enter") {
      e.preventDefault();
    } else if (action === "backspace") {
      e.preventDefault();
      takeOver();
      apply({ kind: "backspace", tMs: performance.now() });
    }
  }

  // The clock of a text the visitor is typing, as the app's 250 ms interval.
  const ticking = $derived(mode === "visitor" && started && view.cursor < view.chars.length);
  $effect(() => {
    if (!ticking) return;
    const timer = setInterval(() => (now = performance.now()), 250);
    return () => clearInterval(timer);
  });

  /** A click anywhere on the demo gives the keyboard to its typing field. */
  function focusField(e: MouseEvent) {
    if ((e.target as Element).closest("button")) return;
    field?.focus({ preventScroll: true });
  }

  onMount(() => {
    reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
    ready = true;
    // The replay goes on from the still state; under reduced motion it waits for "Reproducir".
    makeDriver(STILL_STEPS);
    wantPlay = driver?.autoplay() ?? false;
    const observer = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting && !document.hidden;
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
  <div class="screen" onclick={focusField} {lang}>
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
      {textId}
      bind:field
      oninput={onInput}
      onkeydown={onKeydown}
      oncompositionend={takeText}
      strings={PRACTICE_UI[lang]}
      keyboardStrings={KEYBOARD_UI[lang]}
    />
  </div>
</div>

<style>
  /* The site's .sr-only, restated so the island's hidden texts stay hidden on their own. */
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
  .screen {
    cursor: text;
  }
  /* The typing field is invisible: the whole app window shows that it has the keyboard. */
  .screen:focus-within :global(.pt-app) {
    outline: 2px solid var(--accent);
    outline-offset: -2px;
  }
  /* In the window's title bar (HomeHero.astro), on its right. */
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
  /* Phones: the window title keeps the bar; the button keeps its icon and its accessible name. */
  @media (max-width: 30rem) {
    .hint,
    .play-label {
      display: none;
    }
    .play {
      justify-content: center;
      min-width: 2rem;
    }
  }
</style>
