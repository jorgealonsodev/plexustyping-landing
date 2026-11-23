<!--
  S6 "Desbloqueo progresivo" (PRD §8). The PlexusTyping practice screen in its progressive unlock mode, extracted
  from the app at commit 14f64cf2b9619deca9d99c2dbb3a2358586c5390, keeping its class names, variables and values:
  - live stats, label lines (source and the unlock progress line), practice text with the bar cursor, keyboard
    footer with the locked keys dimmed: src/features/practice/Practice.svelte (markup and <style>);
  - result screen with the unlock notice: src/features/practice/Results.svelte (markup and <style>);
  - the progress line, the dimmed keys and the notice: the app's unlock.ts, copied (src/sim/unlock/unlock.ts);
  - the keyboard: the app's Keyboard.svelte, copied (src/sim/keyboard/Keyboard.svelte).
  A recorded replay types one text per prerecorded UnlockStatus (src/sim/data/s6.ts); each result unlocks the
  next key of the app's order. Replay only, so the screen is inert; never starts on its own under
  prefers-reduced-motion. Edits to the extracted code are marked "Demo edit". On the English pages (`locale`
  "en") the app's UI is translated (src/sim/i18n/), the texts and order are English (src/sim/data/s6.en.ts) and
  the keyboard is English (US).
-->
<script lang="ts">
  import { onMount } from "svelte";
  import "../../sim/app.css";
  import type { Locale } from "../../i18n/paths";
  import { STAGES as ES_STAGES, STILL_STAGE } from "../../sim/data/s6";
  import { STAGES as EN_STAGES } from "../../sim/data/s6.en";
  import { KEYBOARD_UI, PRACTICE_UI, RESULTS_UI } from "../../sim/i18n/app";
  import type { SimStrings } from "../../sim/i18n/s2";
  import { UNLOCK_UI } from "../../sim/i18n/s6";
  import Keyboard from "../../sim/keyboard/Keyboard.svelte";
  import { type Flash, highlightsFor, keyForChar } from "../../sim/keyboard/keys";
  import { KEYBOARDS } from "../../sim/keyboard/locale";
  import { type InputEvent, TypingSession } from "../../sim/practice/engine";
  import { charLabel, formatTime, formatWpm } from "../../sim/practice/format";
  import { ReplayDriver, toInput } from "../../sim/replay";
  import { lockedKeys } from "../../sim/unlock/unlock";

  let { strings: t, locale = "es" }: { strings: SimStrings; locale?: Locale } = $props();

  // The page's language is fixed for the island's life. Spanish: the app as it is; English: translated UI,
  // English texts and the English (US) layout.
  // svelte-ignore state_referenced_locally
  const lang: Locale = locale;
  const { layout: LAYOUT, sequencesFor } = KEYBOARDS[lang];
  const STAGES = lang === "en" ? EN_STAGES : ES_STAGES;
  const p = PRACTICE_UI[lang];
  const r = RESULTS_UI[lang];
  const u = UNLOCK_UI[lang];

  const MODE = "backspace-correct";
  const noop = () => {};
  const uid = $props.id();

  let index = $state(STILL_STAGE);
  let phase = $state<"typing" | "results">("results");
  let session = new TypingSession(STAGES[STILL_STAGE]!.text, MODE);
  let tick = $state(0);
  let now = $state(0);
  let flash = $state.raw<Flash | null>(null);
  let root = $state<HTMLElement>();
  let wantPlay = $state(false);
  let ready = $state(false);
  let announcement = $state("");
  let begun = false;
  let reducedMotion = true;
  let onScreen = true;
  let driver: ReplayDriver | null = null;
  let hold: { ms: number; fn: () => void; timer: ReturnType<typeof setTimeout> | null } | null = null;

  const stage = $derived(STAGES[index]!);
  // The result of a session that unlocked a key already reads the new status: the key lights up with the notice.
  const status = $derived(phase === "results" && stage.unlocks ? STAGES[index + 1]!.status : stage.status);
  const locked = $derived(lockedKeys(LAYOUT, status));
  const unlockLine = $derived(u.progressLine(status));
  const notice = $derived(u.notice(stage.unlocks));

  const view = $derived.by(() => {
    void tick;
    const s = session;
    return { chars: [...s.chars], states: s.chars.map((_, i) => s.state(i)), cursor: s.cursor, stats: s.result().stats };
  });
  const elapsed = $derived.by(() => (void tick, session.firstT === null ? 0 : Math.max(now - session.firstT, 0)));
  const sequences = $derived(sequencesFor(stage.text));
  const highlights = $derived(phase === "typing" ? highlightsFor(sequences[view.cursor]) : []);
  // Demo edit: the app's result comes from the Rust core (`score_session`); here from the session's own records.
  const failed = $derived.by(() => {
    void tick;
    return [...new Set(session.result().records.filter((r) => !r.correct).map((r) => r.expected))];
  });

  function apply(event: InputEvent, flashKey = true) {
    const expected = session.chars[session.cursor];
    if (!session.apply(event)) return;
    now = event.tMs;
    tick++;
    if (flashKey && event.kind === "char") {
      const code = keyForChar(LAYOUT, event.ch);
      if (code) flash = { code, ok: event.ch === expected };
    }
  }

  function startStage(next: number) {
    index = next;
    phase = "typing";
    session = new TypingSession(STAGES[next]!.text, MODE);
    tick++;
    driver = new ReplayDriver(STAGES[next]!.script, (e) => apply(e), { reducedMotion, onDone: replayDone });
  }

  // Server and first client render: the result of the first text, with "Nueva tecla desbloqueada: e".
  for (const step of STAGES[STILL_STAGE]!.script.steps) apply(toInput(step), false);

  function later(ms: number, fn: () => void) {
    hold = { ms, fn, timer: null };
    run();
  }

  /** The text is scored: its result (and notice) rests, then the next text of the new status starts. */
  function replayDone() {
    later(500, () => {
      phase = "results";
      later(stage.unlocks ? 3200 : 2200, () => {
        startStage((index + 1) % STAGES.length);
        run();
      });
    });
  }

  function run() {
    if (!wantPlay || !onScreen) return;
    if (!begun) {
      begun = true;
      startStage(0);
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
    // The replay driver's rule: autoplay unless reduced motion; "Reproducir" starts it then.
    wantPlay = new ReplayDriver(STAGES[0]!.script, noop, { reducedMotion, clock: { set: noop, clear: noop } }).autoplay();
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
  <div class="pt-frame" lang={lang} inert>
    <div class="pt-app">
      <!-- Demo edit: the app's header is left out (the hero shows it); a <div class="main">, not <main>. -->
      <div class="main">
        <section class="practice">
          {#if phase === "results"}
            <!-- src/features/practice/Results.svelte -->
            <section class="results">
              <!-- Demo edit: the app's <h2> is a <p class="h2">, so the demo adds no heading to the website. -->
              <p class="h2">{r.title}</p>
              {#if notice}<p class="goal-met">{notice}</p>{/if}
              <dl class="figures">
                <div class="main"><dt>{r.netWpm}</dt><dd>{formatWpm(view.stats.netWpm)}</dd></div>
                <div><dt>{r.grossWpm}</dt><dd>{formatWpm(view.stats.grossWpm)}</dd></div>
                <div><dt>{p.accuracy}</dt><dd>{p.percent(view.stats.accuracy)}</dd></div>
                <div><dt>{p.time}</dt><dd>{formatTime(view.stats.durationMs)}</dd></div>
                <div><dt>{r.errors}</dt><dd>{view.stats.errors}</dd></div>
              </dl>
              {#if failed.length > 0}
                <p class="failed">
                  {r.failed}
                  {#each failed as c, i (i)}<kbd>{charLabel(c)}</kbd>{/each}
                </p>
              {:else}
                <p class="note">{r.noFailed}</p>
              {/if}
              <div class="actions">
                <button type="button" class="primary" tabindex="-1">{r.next} <kbd>{r.enter}</kbd></button>
                <button type="button" tabindex="-1">{r.repeat} <kbd>Esc</kbd></button>
              </div>
            </section>
          {:else}
            <div class="top">
              <dl class="live" aria-label={p.liveStats}>
                <div><dt>{p.wpm}</dt><dd>{formatWpm(view.stats.netWpm)}</dd></div>
                <div><dt>{p.kpm}</dt><dd>{formatWpm(view.stats.kpm)}</dd></div>
                <div><dt>{p.accuracy}</dt><dd>{p.percent(view.stats.accuracy)}</dd></div>
                <div><dt>{p.time}</dt><dd>{formatTime(elapsed)}</dd></div>
              </dl>
            </div>
            <p class="kind">{p.localCorpus}</p>
            {#if unlockLine}<p class="kind" aria-label={u.label}>{unlockLine}</p>{/if}
            <!-- Demo edit: no style attribute (the website's CSP); the typography variables are at their defaults. -->
            <div id={`${uid}-text`} role="region" aria-label={p.practiceText} data-cursor="bar">
              <!-- No whitespace inside: the text uses white-space: pre-wrap. -->
              <p class="text dim">{#each view.chars as c, i (i)}<span
                    class="ch {view.states[i]}"
                    class:space={c === " "}
                    class:cursor={i === view.cursor}>{c}</span
                  >{/each}</p>
            </div>
          {/if}
        </section>
      </div>
      <footer>
        <Keyboard layout={LAYOUT} {highlights} {flash} heat={null} {locked} strings={KEYBOARD_UI[lang]} />
      </footer>
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

  /* Demo edit: the app fills a desktop window; the demo is the lower part of that window (1100 px wide like
     the reference screenshots), scaled to the panel's width. Every vw/vh of the app's rules reads --vw/--vh. */
  .pt-frame {
    container-type: inline-size;
  }
  .pt-app {
    --vw: 1cqw;
    --vh: calc(1cqw * 720 / 1100);
    position: relative;
  }

  /* src/features/practice/Practice.svelte */
  /* Demo edit: `.pt-app >` added, as Results' first figure is also a `.main`. */
  .pt-app > .main {
    flex: none;
    /* Demo edit: a fixed height that holds the result screen, so the keyboard does not move between screens. */
    height: 21rem;
    box-sizing: border-box;
    overflow: hidden;
    padding: clamp(1rem, 5 * var(--vh), 4rem) 2rem;
  }
  footer {
    flex: none;
    padding: clamp(0.25rem, 1.5 * var(--vh), 1rem) 1.5rem;
    background: var(--surface);
    border-top: 1px solid var(--border);
  }
  /* Demo edit: the keyboard's key unit (Keyboard.svelte --u) reads the demo window, not the browser's. */
  .pt-app footer :global(.keyboard) {
    --u: min(4.25rem, calc((100 * var(--vw) - 3rem) / 15), 8 * var(--vh));
  }
  .practice {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    width: min(100%, 62rem);
    margin: 0 auto;
  }
  .top {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  .live {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem 2rem;
    margin: 0;
    color: var(--muted);
  }
  .live div {
    display: flex;
    align-items: baseline;
    gap: 0.5rem;
  }
  .live dt {
    font-size: 0.85rem;
  }
  .live dd {
    margin: 0;
    color: var(--text);
    font-family: var(--mono);
    font-size: 1.25rem;
    font-variant-numeric: tabular-nums;
  }
  .text {
    margin: 0;
    font-family: var(--practice-font, var(--mono));
    font-feature-settings: var(--practice-features, normal);
    font-size: calc(clamp(1rem, min(2.4 * var(--vw), 4 * var(--vh)), 2rem) * var(--text-scale, 1));
    letter-spacing: var(--text-spacing, 0);
    line-height: var(--text-leading, 1.75);
    white-space: pre-wrap;
    overflow-wrap: break-word;
  }
  .ch {
    border-radius: 0.15em;
  }
  .pending {
    color: var(--text-pending);
  }
  .text.dim {
    --text-pending: var(--text-pending-dim);
  }
  .correct {
    color: var(--text-correct);
  }
  .error {
    color: var(--text-error);
    background: var(--error-bg);
  }
  .space.error {
    box-shadow: inset 0 -0.15em var(--text-error);
  }
  .cursor {
    --cur: var(--cursor);
  }
  .cursor.error {
    --cur: var(--text-error);
  }
  [data-cursor="bar"] .cursor {
    position: relative;
    color: var(--text-pending);
    background: transparent;
    border-radius: 0;
    box-shadow: none;
  }
  [data-cursor="bar"] .cursor.error {
    color: var(--text-error);
  }
  [data-cursor="bar"] .cursor::before {
    content: "";
    position: absolute;
    top: 50%;
    left: -0.05em;
    width: max(2px, 0.1em);
    height: 1.2em;
    border-radius: 1px;
    background: var(--cur);
    transform: translateY(-50%);
    pointer-events: none;
  }
  .kind {
    margin: 0 0 -0.75rem;
    font-size: 0.85rem;
    color: var(--muted);
  }

  /* src/features/practice/Results.svelte */
  .results {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }
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
  /* Demo edit: `.figures` added, as the practice area is also a `.main` here. */
  .figures .main dd {
    font-size: 3.5rem;
    line-height: 1;
    color: var(--accent);
  }
  .failed,
  .note,
  .goal-met {
    margin: 0;
  }
  .goal-met {
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

  /* Demo edit: phone widths (as PracticeScreen.svelte): below the app's smallest window the practice area is
     tighter and the keyboard reaches the edges, so nothing scrolls sideways. */
  @container (max-width: 44rem) {
    .pt-app > .main {
      height: 24.5rem;
      padding: 1rem;
    }
    .figures {
      gap: 0.75rem 1.5rem;
    }
    .figures .main dd {
      font-size: 2.75rem;
    }
    dd {
      font-size: 1.375rem;
    }
    footer {
      padding: 0.5rem 0.25rem;
    }
    .pt-app footer :global(.keyboard) {
      --u: calc((100cqw - 1rem) / 15);
    }
  }
</style>
