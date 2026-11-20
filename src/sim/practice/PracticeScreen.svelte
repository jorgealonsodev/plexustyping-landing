<!--
  The PlexusTyping practice screen, presentational. Extracted from the app at commit
  14f64cf2b9619deca9d99c2dbb3a2358586c5390, keeping its class names, variables and values:
  - header: src/App.svelte (<header> markup and its <style>) and src/features/code/ModeSwitch.svelte
    (the Prosa/Palabras/Código group and its <style>);
  - typing field, live stats, label line, practice text with the bar cursor and keyboard footer:
    src/features/practice/Practice.svelte (markup and <style>).
  The app's behaviour (Tauri IPC, settings store, results, ghost, metronome, unlimited text) is not here:
  src/components/HeroSim.svelte drives this screen. Edits to the extracted code are marked "Demo edit".
-->
<script lang="ts">
  import "../app.css";
  import Keyboard from "../keyboard/Keyboard.svelte";
  import type { Flash, Highlight } from "../keyboard/keys";
  import type { Layout } from "../keyboard/types";
  import type { CharState, Stats } from "./engine";
  import { charLabel, formatPercent, formatTime, formatWpm } from "./format";

  export interface PracticeView {
    chars: string[];
    states: CharState[];
    cursor: number;
    stats: Stats;
  }

  let {
    view,
    elapsed,
    source,
    targets,
    layout,
    highlights,
    flash,
    heat,
    refreshing = false,
    textId,
    field = $bindable(),
    oninput,
    onkeydown,
    oncompositionend,
  }: {
    view: PracticeView;
    elapsed: number;
    source: string;
    targets: string[];
    layout: Layout;
    highlights: Highlight[];
    flash: Flash | null;
    heat: Map<string, number> | null;
    /** The "Nuevo texto" arrows turn while a new text loads (App.svelte `.spinning`). */
    refreshing?: boolean;
    textId: string;
    field?: HTMLTextAreaElement | undefined;
    oninput: (e: Event) => void;
    onkeydown: (e: KeyboardEvent) => void;
    oncompositionend: () => void;
  } = $props();

  // Demo edit: Practice.svelte keeps the cursor line in view with scrollIntoView(), which would also scroll
  // the website. Here only the practice area scrolls, by the same amount (the cursor's 1.75em scroll margin).
  let scroller = $state<HTMLElement>();
  let proseText = $state<HTMLElement>();
  $effect(() => {
    void view.cursor;
    const cursor = proseText?.querySelector<HTMLElement>(".cursor");
    if (!cursor || !scroller) return;
    // A new or restarted text starts at the top, stats included.
    if (view.cursor === 0) {
      scroller.scrollTop = 0;
      return;
    }
    const margin = Number.parseFloat(getComputedStyle(cursor).scrollMarginBlockEnd) || 0;
    const c = cursor.getBoundingClientRect();
    const s = scroller.getBoundingClientRect();
    if (c.bottom + margin > s.bottom) scroller.scrollTop += c.bottom + margin - s.bottom;
    else if (c.top - margin < s.top) scroller.scrollTop -= s.top - (c.top - margin);
  });

  const noAutocorrect: Record<string, string> = { autocorrect: "off" };

  // ModeSwitch.svelte's KINDS; the demo shows prose ("Prosa"), the app's default.
  const KINDS = [
    { id: "prose", label: "Prosa" },
    { id: "words", label: "Palabras" },
    { id: "code", label: "Código" },
  ];
</script>

<div class="pt-frame">
  <div class="pt-app">
    <!-- Demo edit: the header is a picture of the app's header. Its controls do nothing here, so it is inert
         and hidden from assistive technology (no focus stops, no clicks). -->
    <header inert aria-hidden="true">
      <div class="brand">
        <button type="button" class="logo" aria-pressed="true" tabindex="-1">
          <svg viewBox="16 16 224 224" width="28" height="28" aria-hidden="true">
            <defs>
              <linearGradient id="hdr-top" x1="0" y1="0" x2="0" y2="1"
                ><stop offset="0" stop-color="#b4cdff" /><stop offset="1" stop-color="#7aa2f7" /></linearGradient
              >
              <linearGradient id="hdr-side" x1="0" y1="0" x2="0" y2="1"
                ><stop offset="0" stop-color="#4f6fa8" /><stop offset="1" stop-color="#2a3b66" /></linearGradient
              >
            </defs>
            <rect x="16" y="30" width="224" height="210" rx="50" fill="url(#hdr-side)" />
            <rect x="34" y="16" width="188" height="184" rx="38" fill="url(#hdr-top)" />
            <text
              x="128"
              y="138"
              text-anchor="middle"
              font-family="Inter, 'Segoe UI', Helvetica, Arial, sans-serif"
              font-size="104"
              font-weight="800"
              fill="#1e1e2e">P</text
            >
            <rect class="led on" x="100" y="160" width="56" height="10" rx="5" stroke="#1e1e2e" stroke-width="3" />
          </svg>
        </button>
        <!-- Demo edit: the app's <h1> is a <b class="h1">, so the website keeps one h1. -->
        <b class="h1">PlexusTyping</b>
        <span>Del cerebro a los dedos.</span>
      </div>
      <div class="who">
        <button type="button" class="profile" tabindex="-1">Principal</button>
      </div>
      <div class="mode">
        <div class="kinds">
          {#each KINDS as k (k.id)}
            <button type="button" tabindex="-1" class:active={k.id === "prose"}>{k.label}</button>
          {/each}
        </div>
      </div>
      <button type="button" class="gear ai-toggle" tabindex="-1"><span class="ai-label">IA</span></button>
      <!-- The ghost session is on by default in the app (settings `ghost`). -->
      <button type="button" class="gear ai-toggle active" tabindex="-1">
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="none" stroke="currentColor">
          <path
            d="M5 20.5V11a7 7 0 0 1 14 0v9.5l-2.33-1.75-2.34 1.75L12 18.75l-2.33 1.75-2.34-1.75z"
            stroke-width="2"
            stroke-linejoin="round"
          />
          <circle cx="9.5" cy="10.5" r="1.2" fill="currentColor" stroke="none" />
          <circle cx="14.5" cy="10.5" r="1.2" fill="currentColor" stroke="none" />
        </svg>
      </button>
      <button type="button" class="gear" class:spinning={refreshing} tabindex="-1">
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="none" stroke="currentColor">
          <path d="M19.5 12a7.5 7.5 0 0 1-12.8 5.3" stroke-width="2" stroke-linecap="round" />
          <path d="M4.5 12a7.5 7.5 0 0 1 12.8-5.3" stroke-width="2" stroke-linecap="round" />
          <path d="M17.8 2.8v4h-4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M6.2 21.2v-4h4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>
      <button type="button" class="gear" tabindex="-1">
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="none" stroke="currentColor">
          <circle cx="12" cy="12" r="8.5" stroke-width="2" />
          <path d="M12 7v5l3.5 2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>
      <button type="button" class="gear" tabindex="-1">
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="none" stroke="currentColor">
          <circle cx="12" cy="12" r="8.4" stroke-width="3" stroke-dasharray="3.3 3.3" />
          <circle cx="12" cy="12" r="5.6" stroke-width="2.6" />
        </svg>
      </button>
    </header>

    <textarea
      bind:this={field}
      class="capture"
      aria-label="Entrada de mecanografía"
      aria-describedby={textId}
      autocomplete="off"
      {...noAutocorrect}
      autocapitalize="off"
      spellcheck="false"
      {oninput}
      {onkeydown}
      {oncompositionend}
    ></textarea>

    <!-- Demo edit: a <div class="main">, not <main>: the website already has its main landmark. -->
    <div class="main" bind:this={scroller}>
      <section class="practice">
        <div class="top">
          <dl class="live" aria-label="Estadísticas en vivo">
            <div><dt>PPM</dt><dd>{formatWpm(view.stats.netWpm)}</dd></div>
            <div><dt>Pulsaciones/min</dt><dd>{formatWpm(view.stats.kpm)}</dd></div>
            <div><dt>Precisión</dt><dd>{formatPercent(view.stats.accuracy)}</dd></div>
            <div><dt>Tiempo</dt><dd>{formatTime(elapsed)}</dd></div>
          </dl>
        </div>
        <p class="kind">
          {source}
          {#if targets.length > 0}
            · Practicando:
            {#each targets as t, i (i)}{#if i > 0}<span class="sep">·</span>{/if}<kbd>{charLabel(t)}</kbd>{/each}
          {/if}
        </p>
        <!-- Demo edit: no style attribute (the website's CSP); the app's typography and font variables are at
             their defaults, which are the fallbacks of the rules below. Cursor: the app's default bar, no blink. -->
        <div id={textId} role="region" aria-label="Texto de práctica" data-cursor="bar">
          <!-- No whitespace inside: the text uses white-space: pre-wrap. "Atenuar texto pendiente" is on by default. -->
          <p class="text dim" bind:this={proseText}>{#each view.chars as c, i (i)}<span
                class="ch {view.states[i]}"
                class:space={c === " "}
                class:cursor={i === view.cursor}>{c}</span
              >{/each}</p>
        </div>
      </section>
    </div>

    <footer>
      <Keyboard {layout} {highlights} {flash} {heat} />
    </footer>
  </div>
</div>

<style>
  /* Demo edit: the app fills a desktop window; the demo is that window, 1100×720 like the reference
     screenshots, scaled to the panel's width. Every vw/vh of the app's rules reads --vw/--vh instead. */
  .pt-frame {
    container-type: inline-size;
  }
  .pt-app {
    --vw: 1cqw;
    --vh: calc(1cqw * 720 / 1100);
    aspect-ratio: 1100 / 720;
  }

  /* src/App.svelte */
  header {
    flex: none;
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    /* Fixed height: the same bar in prose and code, whatever the engine draws the selects at. */
    box-sizing: border-box;
    height: clamp(3.4rem, calc(2.4rem + 4 * var(--vh)), 4.4rem);
    padding: 0 clamp(1rem, 3 * var(--vw), 2rem);
    background: var(--surface);
    border-bottom: 1px solid var(--border);
  }
  .brand {
    flex: none;
    display: flex;
    align-items: baseline;
    gap: 0.75rem;
  }
  .logo {
    align-self: center;
    display: flex;
    margin-right: -0.25rem;
    padding: 0;
    background: none;
    border: 0;
    border-radius: 0.3rem;
  }
  /* Off: an unlit bar; on: a green light, like Caps Lock. */
  .led {
    fill: #5b6078;
    /* Off under reduced motion, with every other transition (app.css, a11y S6). */
    transition: fill 150ms ease-out;
  }
  /* A vivid LED green with a glow, the same in every theme. */
  .led.on {
    fill: #2bff6a;
    filter: drop-shadow(0 0 6px #2bff6a);
  }
  /* The app's `h1` rule; the browser's h1 weight restated. */
  .h1 {
    margin: 0;
    font-size: 1.1rem;
    font-weight: bold;
  }
  /* The name keeps its room (up to 12rem); the goal text gives way first. */
  .profile {
    flex: none;
    max-width: 12rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    padding: 0.3rem 0.7rem;
    font-size: 0.9rem;
    color: var(--muted);
  }
  .who {
    flex: 0 1 auto;
    min-width: 0;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  .gear {
    flex: none;
    display: flex;
    padding: 0.35rem;
    color: var(--muted);
  }
  /* The same box as the icon buttons: "IA" fills the 20 px an icon takes. */
  .ai-label {
    display: grid;
    place-items: center;
    width: 20px;
    height: 20px;
    font-size: 0.8rem;
    font-weight: 700;
    line-height: 1;
  }
  .ai-toggle.active {
    color: var(--on-accent);
    background: var(--accent);
    border-color: var(--accent);
  }
  /* While a new text is generated the arrows turn. */
  .spinning svg {
    animation: spin 0.9s linear infinite;
  }
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .spinning svg {
      animation: none;
    }
  }
  .brand span {
    white-space: nowrap;
    color: var(--muted);
    font-size: 0.9rem;
  }
  /* Narrow windows keep the header to one row: drop the tagline. (Demo edit: a container query on the
     demo window instead of the app's @media on its own window.) */
  @container (max-width: 1100px) {
    .brand span {
      display: none;
    }
  }
  @container (max-width: 900px) {
    .brand {
      align-items: center;
    }
  }

  /* src/features/code/ModeSwitch.svelte */
  .mode {
    display: flex;
    align-items: center;
    /* Room for the native select (WebKitGTK may draw it taller than 2rem) in both modes. */
    height: 2.4rem;
    gap: 0.5rem;
    margin-left: auto;
  }
  .kinds {
    display: flex;
  }
  /* One fixed height: showing the language select must not change the header height. */
  .kinds button {
    box-sizing: border-box;
    height: 2rem;
  }
  .kinds button {
    padding: 0 0.7rem;
    font-size: 0.85rem;
    color: var(--muted);
    border-radius: 0;
  }
  .kinds button:not(:first-child) {
    margin-left: -1px;
  }
  .kinds button:first-child {
    border-radius: 0.375rem 0 0 0.375rem;
  }
  .kinds button:last-child {
    border-radius: 0 0.375rem 0.375rem 0;
  }
  .kinds .active {
    color: var(--on-accent);
    background: var(--accent);
    border-color: var(--accent);
  }

  /* src/features/practice/Practice.svelte */
  /* Focusable but invisible: it only collects typed and composed text. (Demo edit: absolute inside the
     demo, not fixed to the window, so focusing it never moves the website.) */
  .capture {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 1px;
    height: 1px;
    padding: 0;
    border: 0;
    opacity: 0;
    resize: none;
    overflow: hidden;
    pointer-events: none;
  }
  .pt-app {
    position: relative;
  }
  .main {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
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
    /* The chosen practice font (practice-font S1), set by the practice text region. */
    font-family: var(--practice-font, var(--mono));
    font-feature-settings: var(--practice-features, normal);
    /* Also scales with the height, so the text and the keyboard fit at 720×480. */
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
  /* "Atenuar texto pendiente" (a11y S7): the same rule reads the dimmed colour; the cursor char keeps its own. */
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
  /* A soft tint with an underline bar: marks the next char without pulling the eye. */
  .cursor {
    /* Scrolling into view also shows the following line. */
    scroll-margin-block: calc(var(--text-leading, 1.75) * 1em);
    color: var(--text);
    background: color-mix(in srgb, var(--cursor) 18%, transparent);
    box-shadow: inset 0 -0.12em var(--cursor);
    border-radius: 0.1em;
  }
  .cursor.error {
    background: color-mix(in srgb, var(--text-error) 22%, transparent);
    box-shadow: inset 0 -0.12em var(--text-error);
  }
  /* Cursor styles (cursor-style S1, S2): --cur is the cursor colour, or the error colour on a wrong char.
     Shadows and backgrounds only, so no style changes the char's width. */
  .cursor {
    --cur: var(--cursor);
  }
  .cursor.error {
    --cur: var(--text-error);
  }
  /* Monkeytype-style caret: a thin straight line at the left edge of the next char, between it and
     the typed one; the char keeps its own colour. */
  :global([data-cursor="bar"]) .cursor {
    position: relative;
    color: var(--text-pending);
    background: transparent;
    border-radius: 0;
    box-shadow: none;
  }
  :global([data-cursor="bar"]) .cursor.error {
    color: var(--text-error);
  }
  :global([data-cursor="bar"]) .cursor::before {
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
  .kind kbd {
    display: inline-block;
    margin-left: 0.3rem;
    padding: 0 0.35em;
    font-family: var(--mono);
    color: var(--key-fg);
    background: var(--key-bg);
    border: 1px solid var(--key-border);
    border-radius: 0.3em;
  }
  .kind .sep {
    margin-left: 0.3rem;
  }

  /* Demo edit: phone widths. The app's smallest window is 720×480; below it the demo drops the header's
     secondary controls, lets the practice area take a fixed height and widens the keyboard to the edges,
     so the text stays at the app's 1rem floor and nothing scrolls sideways. */
  @container (max-width: 44rem) {
    .pt-app {
      aspect-ratio: auto;
    }
    .who,
    .gear {
      display: none;
    }
    .main {
      flex: none;
      height: 15rem;
      padding: 1rem;
    }
    footer {
      padding: 0.5rem 0.25rem;
    }
    .pt-app footer :global(.keyboard) {
      --u: calc((100cqw - 1rem) / 15);
    }
    /* The heatmap legend wraps instead of running past the window. */
    .pt-app footer :global(.legend) {
      flex-wrap: wrap;
      row-gap: 0.375rem;
      padding-inline: 0.5rem;
    }
  }
  @container (max-width: 24rem) {
    .brand .h1 {
      display: none;
    }
  }
</style>
