<!--
  The PlexusTyping code text, extracted from the app at commit 14f64cf2b9619deca9d99c2dbb3a2358586c5390:
  src/features/code/CodeText.svelte, its markup, props and <style> kept. Edits are marked "Demo edit".
-->
<script lang="ts">
  import type { CharState } from "../practice/engine";
  import { type TokenClass, newlineMark } from "./syntax";

  // A code text (S3, S4): newlines and indentation kept, each char coloured by its syntax class.
  let {
    chars,
    states,
    cursor,
    classes,
    ghost = -1,
    ghostEnd = false,
    dim = false,
  }: {
    chars: string[];
    states: CharState[];
    cursor: number;
    classes: TokenClass[];
    /** Index of the ghost cursor's char (ghost S4), -1 for none; `ghostEnd`: it is past that last char. */
    ghost?: number;
    ghostEnd?: boolean;
    /** Pending chars in the dimmed colours of about 2.5:1 (a11y S7). */
    dim?: boolean;
  } = $props();

  let block = $state<HTMLPreElement>();

  // Keeps the cursor line in view as the text scrolls inside its block.
  // Demo edit: scrollIntoView() would also scroll the website; only the block scrolls here, by the same amount.
  $effect(() => {
    void cursor;
    const c = block?.querySelector<HTMLElement>(".cursor");
    if (!block || !c) return;
    if (cursor === 0) {
      block.scrollTop = 0;
      return;
    }
    const b = block.getBoundingClientRect();
    const r = c.getBoundingClientRect();
    if (r.bottom > b.bottom) block.scrollTop += r.bottom - b.bottom;
    else if (r.top < b.top) block.scrollTop -= b.top - r.top;
  });
</script>

<!-- No whitespace inside: the block keeps every space and newline. -->
<pre bind:this={block} class="code" class:dim>{#each chars as c, i (i)}<span
      class="ch {states[i]} syn-{classes[i]}"
      class:space={c === " "}
      class:nl={c === "\n"}
      class:cursor={i === cursor}
      class:ghost={i === ghost}
      class:ghost-end={ghostEnd && i === ghost}>{newlineMark(c, states[i], i === cursor)}{c}</span
    >{/each}</pre>

<style>
  .code {
    margin: 0;
    padding: 0.75rem 1rem;
    /* Demo edit: the app window's vw/vh are the demo window's --vw/--vh (set by CodeScreen.svelte). */
    max-height: max(8rem, 42 * var(--vh, 1vh));
    overflow: auto;
    /* Font (practice-font S1) and typography settings (a11y S4), set by the practice text region. */
    font-family: var(--practice-font, var(--mono));
    font-feature-settings: var(--practice-features, normal);
    font-size: calc(clamp(0.9rem, min(1.8 * var(--vw, 1vw), 3 * var(--vh, 1vh)), 1.5rem) * var(--text-scale, 1));
    letter-spacing: var(--text-spacing, 0);
    line-height: var(--text-leading, 1.6);
    white-space: pre;
    tab-size: 4;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 0.375rem;
  }
  .ch {
    border-radius: 0.15em;
  }
  /* "Atenuar texto pendiente" (a11y S7): every class's pending shade reads its dimmed one. */
  .code.dim {
    --syntax-pending-plain: var(--syntax-pending-dim-plain);
    --syntax-pending-keyword: var(--syntax-pending-dim-keyword);
    --syntax-pending-string: var(--syntax-pending-dim-string);
    --syntax-pending-number: var(--syntax-pending-dim-number);
    --syntax-pending-comment: var(--syntax-pending-dim-comment);
    --syntax-pending-function: var(--syntax-pending-dim-function);
    --syntax-pending-type: var(--syntax-pending-dim-type);
    --syntax-pending-variable: var(--syntax-pending-dim-variable);
    --syntax-pending-constant: var(--syntax-pending-dim-constant);
    --syntax-pending-operator: var(--syntax-pending-dim-operator);
    --syntax-pending-punctuation: var(--syntax-pending-dim-punctuation);
    --syntax-pending-tag: var(--syntax-pending-dim-tag);
    --syntax-pending-attribute: var(--syntax-pending-dim-attribute);
    --syntax-pending-property: var(--syntax-pending-dim-property);
  }
  .syn-plain { --syn: var(--syntax-plain); --syn-pending: var(--syntax-pending-plain); }
  .syn-keyword { --syn: var(--syntax-keyword); --syn-pending: var(--syntax-pending-keyword); }
  .syn-string { --syn: var(--syntax-string); --syn-pending: var(--syntax-pending-string); }
  .syn-number { --syn: var(--syntax-number); --syn-pending: var(--syntax-pending-number); }
  .syn-comment { --syn: var(--syntax-comment); --syn-pending: var(--syntax-pending-comment); }
  .syn-function { --syn: var(--syntax-function); --syn-pending: var(--syntax-pending-function); }
  .syn-type { --syn: var(--syntax-type); --syn-pending: var(--syntax-pending-type); }
  .syn-variable { --syn: var(--syntax-variable); --syn-pending: var(--syntax-pending-variable); }
  .syn-constant { --syn: var(--syntax-constant); --syn-pending: var(--syntax-pending-constant); }
  .syn-operator { --syn: var(--syntax-operator); --syn-pending: var(--syntax-pending-operator); }
  .syn-punctuation { --syn: var(--syntax-punctuation); --syn-pending: var(--syntax-pending-punctuation); }
  .syn-tag { --syn: var(--syntax-tag); --syn-pending: var(--syntax-pending-tag); }
  .syn-attribute { --syn: var(--syntax-attribute); --syn-pending: var(--syntax-pending-attribute); }
  .syn-property { --syn: var(--syntax-property); --syn-pending: var(--syntax-pending-property); }
  /* Still to type: the syntax colour dimmed towards the code background, kept readable (colors.ts, S1). */
  .pending {
    color: var(--syn-pending);
  }
  .correct {
    color: var(--syn);
  }
  .error {
    color: var(--text-error);
    background: var(--error-bg);
  }
  .space.error {
    box-shadow: inset 0 -0.15em var(--text-error);
  }
  .nl {
    color: var(--muted);
  }
  .nl.error {
    color: var(--text-error);
  }
  .cursor {
    color: var(--syn);
    background: color-mix(in srgb, var(--cursor) 18%, transparent);
    box-shadow: inset 0 -0.12em var(--cursor);
    border-radius: 0.1em;
  }

  /* The ghost cursor (S4): a translucent frame; after the last char once the record finished. */
  .ghost {
    outline: 0.08em solid color-mix(in srgb, var(--cursor) 45%, transparent);
    outline-offset: -0.04em;
  }
  .ghost-end {
    outline: none;
  }
  .ghost-end::after {
    content: "";
    border-right: 0.12em solid color-mix(in srgb, var(--cursor) 45%, transparent);
  }
  .nl.cursor {
    color: var(--muted);
  }
  .cursor.error {
    color: var(--text-error);
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
    color: var(--syn-pending);
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
  :global([data-cursor="block"]) .cursor {
    color: var(--bg);
    background: var(--cur);
    box-shadow: none;
  }
  :global([data-cursor="underline"]) .cursor {
    background: transparent;
    border-radius: 0;
    box-shadow: inset 0 -0.15em var(--cur);
  }
  :global([data-cursor="outline"]) .cursor {
    background: transparent;
    box-shadow: inset 0 0 0 0.08em var(--cur);
  }
  /* About once a second; the global prefers-reduced-motion rule stops it (a11y S6). */
  :global([data-cursor-blink]) .cursor {
    animation: cursor-blink 1.06s steps(1) infinite;
  }
  /* The bar fades like Monkeytype's caret; each keystroke moves it to a new char, which restarts the
     fade from fully visible, so it stays solid while typing. */
  :global([data-cursor="bar"][data-cursor-blink]) .cursor {
    animation: none;
  }
  :global([data-cursor="bar"][data-cursor-blink]) .cursor::before {
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
      color: var(--syn);
      background: transparent;
      box-shadow: none;
    }
  }
</style>
