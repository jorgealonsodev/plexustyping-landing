<!--
  The PlexusTyping practice screen with the app's labels as a prop (S8 code mode, S10 accessibility), so the
  English site can show them translated. The same extraction as src/sim/practice/PracticeScreen.svelte
  (app commit 14f64cf2b9619deca9d99c2dbb3a2358586c5390: src/App.svelte header, src/features/code/ModeSwitch.svelte,
  src/features/practice/Practice.svelte), plus what those demos need from the app:
  - code mode: ModeSwitch's language <select> (live: the demo's language picker) and CodeText.svelte in the
    text region, labelled «Código de práctica», with «<lenguaje> · <origen>» above it (Practice.svelte);
  - the keyboard's colour-blind mode (Keyboard.svelte `colorBlind`, a11y S5);
  - the hint under the text (Practice.svelte `.hint`).
  Edits to the extracted code are marked "Demo edit".
-->
<script lang="ts">
  import type { Snippet } from "svelte";
  import "../app.css";
  import Keyboard from "../keyboard/Keyboard.svelte";
  import type { Flash, Highlight } from "../keyboard/keys";
  import type { Layout } from "../keyboard/types";
  import { formatPercent, formatTime, formatWpm } from "../practice/format";
  import type { PracticeView } from "../practice/PracticeScreen.svelte";
  import CodeText from "./CodeText.svelte";
  import type { KeyboardUi } from "../i18n/app";
  import type { AppLabels } from "./labels";
  import type { TokenClass } from "./syntax";

  let {
    labels,
    kind,
    view,
    elapsed,
    source,
    hint,
    layout,
    highlights,
    flash,
    classes = [],
    languages = [],
    language = "",
    onlanguage,
    colorBlind = false,
    keyboardStrings,
    textId,
    field = $bindable(),
    oninput,
    onkeydown,
    oncompositionend,
    capture = true,
    after,
    percent = formatPercent,
  }: {
    labels: AppLabels;
    kind: "prose" | "code";
    view: PracticeView;
    elapsed: number;
    /** The line above the text: the origin (and in code, the language before it). */
    source: string;
    hint: string;
    layout: Layout;
    highlights: Highlight[];
    flash: Flash | null;
    /** Code: the syntax class of each char. */
    classes?: TokenClass[];
    /** Code: the languages of the picker and the chosen one. */
    languages?: { id: string; name: string }[];
    language?: string;
    onlanguage?: (id: string) => void;
    colorBlind?: boolean;
    /** Demo edit: the keyboard's key names and legend in the page's language (Keyboard.svelte `strings`). */
    keyboardStrings?: KeyboardUi;
    textId: string;
    field?: HTMLTextAreaElement | undefined;
    oninput?: (e: Event) => void;
    onkeydown?: (e: KeyboardEvent) => void;
    oncompositionend?: () => void;
    capture?: boolean;
    after?: Snippet;
    /** Demo edit: accuracy as a percentage in the page's language (the app's Spanish `formatPercent` by default). */
    percent?: (ratio: number) => string;
  } = $props();

  // Demo edit: only the practice area scrolls to the cursor (see PracticeScreen.svelte); code scrolls
  // inside its own block (CodeText.svelte).
  let scroller = $state<HTMLElement>();
  let proseText = $state<HTMLElement>();
  $effect(() => {
    void view.cursor;
    const cursor = proseText?.querySelector<HTMLElement>(".cursor");
    if (!cursor || !scroller) return;
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
  const KINDS = $derived([
    { id: "prose", label: labels.prose },
    { id: "words", label: labels.words },
    { id: "code", label: labels.code },
  ]);
</script>

<div class="pt-frame">
  <div class="pt-app">
    <!-- Demo edit: a picture of the app's header; its controls do nothing here, so they are inert and hidden
         from assistive technology. Only the code language picker is live. -->
    <header>
      <div class="brand" inert aria-hidden="true">
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
        <b class="h1">PlexusTyping</b>
        <span>{labels.tagline}</span>
      </div>
      <div class="who" inert aria-hidden="true">
        <button type="button" class="profile" tabindex="-1">{labels.profile}</button>
      </div>
      <div class="mode">
        {#if kind === "code"}
          <select aria-label={labels.languageLabel} value={language} onchange={(e) => onlanguage?.(e.currentTarget.value)}>
            {#each languages as l (l.id)}
              <option value={l.id}>{l.name}</option>
            {/each}
          </select>
        {/if}
        <div class="kinds" inert aria-hidden="true">
          {#each KINDS as k (k.id)}
            <button type="button" tabindex="-1" class:active={k.id === kind}>{k.label}</button>
          {/each}
        </div>
      </div>
      <div class="gears" inert aria-hidden="true">
        <button type="button" class="gear ai-toggle" tabindex="-1"><span class="ai-label">{labels.ai}</span></button>
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
      <button type="button" class="gear" tabindex="-1">
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
      </div>
    </header>

    {#if capture}
      <textarea
        bind:this={field}
        class="capture"
        aria-label={labels.typingField}
        aria-describedby={textId}
        autocomplete="off"
        {...noAutocorrect}
        autocapitalize="off"
        spellcheck="false"
        {oninput}
        {onkeydown}
        {oncompositionend}
      ></textarea>
    {/if}

    <!-- Demo edit: a <div class="main">, not <main>: the website already has its main landmark. -->
    <div class="main" bind:this={scroller}>
      <section class="practice">
        <div class="top">
          <dl class="live" aria-label={labels.liveStats}>
            <div><dt>{labels.wpm}</dt><dd>{formatWpm(view.stats.netWpm)}</dd></div>
            <div><dt>{labels.kpm}</dt><dd>{formatWpm(view.stats.kpm)}</dd></div>
            <div><dt>{labels.accuracy}</dt><dd>{percent(view.stats.accuracy)}</dd></div>
            <div><dt>{labels.time}</dt><dd>{formatTime(elapsed)}</dd></div>
          </dl>
        </div>
        <p class="kind">{source}</p>
        <!-- Demo edit: no style attribute (the website's CSP); typography at the app's defaults. Cursor: the
             app's default bar, no blink. "Atenuar texto pendiente" is on by default. -->
        <div id={textId} role="region" aria-label={kind === "code" ? labels.codeRegion : labels.textRegion} data-cursor="bar">
          {#if kind === "code"}
            <CodeText chars={view.chars} states={view.states} cursor={view.cursor} {classes} dim />
          {:else}
            <!-- No whitespace inside: the text uses white-space: pre-wrap. -->
            <p class="text dim" bind:this={proseText}>{#each view.chars as c, i (i)}<span
                  class="ch {view.states[i]}"
                  class:space={c === " "}
                  class:cursor={i === view.cursor}>{c}</span
                >{/each}</p>
          {/if}
        </div>
        <p class="hint">{hint}</p>
        {@render after?.()}
      </section>
    </div>

    <footer>
      <Keyboard {layout} {highlights} {flash} {colorBlind} strings={keyboardStrings} />
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
  /* Demo edit: the icon buttons are wrapped in one inert group. */
  .gears {
    flex: none;
    display: flex;
    gap: 1rem;
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
  select {
    box-sizing: border-box;
    height: 2rem;
    max-width: 9rem;
    padding: 0 0.4rem;
    font: inherit;
    font-size: 0.85rem;
    color: var(--text);
    background: var(--surface-2);
    border: 1px solid var(--border);
    border-radius: 0.375rem;
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
  .hint {
    margin: 0;
    color: var(--muted);
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
    .gears {
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
