<!--
  The PlexusTyping practice text (prose), presentational: the region and <p class="text"> markup and their CSS
  extracted from the app's src/features/practice/Practice.svelte (app commit 14f64cf2b9619deca9d99c2dbb3a2358586c5390),
  every cursor style and the blink included, keeping the app's class names, variables and values.
  Demo edits, each marked below: no style attribute (the website's CSP; the island sets --practice-font and
  --practice-features with style.setProperty on an ancestor, where the app's region sets them inline); the
  font size reads the demo window's width (container units, from the island's .pt-app) instead of the app
  window's; no ghost cursor;
  the `[data-cursor]` selectors drop the app's `:global()` because the region lives in this component.
-->
<script lang="ts">
  import type { CharState } from "../practice/engine";

  let {
    chars,
    states,
    cursor,
    cursorStyle = "bar",
    cursorBlink = false,
    dim = true,
    label = "Texto de práctica",
  }: {
    chars: string[];
    states: CharState[];
    /** Index of the next char to type (`chars.length` when the text is done). */
    cursor: number;
    /** A CURSOR_STYLES id (settings/cursor.ts). */
    cursorStyle?: string;
    cursorBlink?: boolean;
    /** "Atenuar texto pendiente" (on by default in the app). */
    dim?: boolean;
    label?: string;
  } = $props();
</script>

<!-- A named region (a11y S3) carrying the cursor look for the text inside. -->
<div class="pt-text" role="region" aria-label={label} data-cursor={cursorStyle} data-cursor-blink={cursorBlink || undefined}>
  <!-- No whitespace inside: the text uses white-space: pre-wrap. -->
  <p class="text" class:dim>{#each chars as c, i (i)}<span
        class="ch {states[i]}"
        class:space={c === " "}
        class:cursor={i === cursor}>{c}</span
      >{/each}</p>
</div>

<style>
  .text {
    margin: 0;
    /* The chosen practice font (practice-font S1), set by the practice text region. */
    font-family: var(--practice-font, var(--mono));
    font-feature-settings: var(--practice-features, normal);
    /* Demo edit: the app's clamp(1rem, min(2.4vw, 4vh), 2rem) on the demo window's width: cqw reads the
       nearest size container, which each island sets on its .pt-app window. */
    font-size: calc(clamp(1rem, 2.4cqw, 2rem) * var(--text-scale, 1));
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
  [data-cursor="block"] .cursor {
    color: var(--bg);
    background: var(--cur);
    box-shadow: none;
  }
  [data-cursor="underline"] .cursor {
    background: transparent;
    border-radius: 0;
    box-shadow: inset 0 -0.15em var(--cur);
  }
  [data-cursor="outline"] .cursor {
    background: transparent;
    box-shadow: inset 0 0 0 0.08em var(--cur);
  }
  /* About once a second; the global prefers-reduced-motion rule stops it (a11y S6). */
  [data-cursor-blink] .cursor {
    animation: cursor-blink 1.06s steps(1) infinite;
  }
  /* The bar fades like Monkeytype's caret; each keystroke moves it to a new char, which restarts the
     fade from fully visible, so it stays solid while typing. */
  [data-cursor="bar"][data-cursor-blink] .cursor {
    animation: none;
  }
  [data-cursor="bar"][data-cursor-blink] .cursor::before {
    animation: caret-fade 1s ease-in-out 0.5s infinite;
  }
  @keyframes caret-fade {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0;
    }
  }
  @keyframes cursor-blink {
    50% {
      color: var(--text);
      background: transparent;
      box-shadow: none;
    }
  }
</style>
