<!--
  Two of the app's eight keyboard layouts drawn by the app's own on-screen keyboard
  (src/sim/keyboard/Keyboard.svelte): Español (España) in ISO shape and English (US) in ANSI shape.
  Rendered on the server only (no client directive): a still picture with 0 KB of JavaScript.
-->
<script lang="ts">
  import "../../sim/app.css";
  import { ES_QWERTY } from "../../sim/data/es-qwerty";
  import { US_QWERTY } from "../../sim/data/us-qwerty.en";
  import type { Locale } from "../../i18n/paths";
  import { KEYBOARD_UI } from "../../sim/i18n/app";
  import Keyboard from "../../sim/keyboard/Keyboard.svelte";

  /** The page's language: key names in Spanish on the Spanish pages, translated on the English ones (site-pages S9). */
  let { locale = "es" }: { locale?: Locale } = $props();

  const ui = KEYBOARD_UI[locale];
  const boards = [
    // The ISO board's right Alt is AltGr, named so in English too (the en names are the US board's).
    { layout: ES_QWERTY, name: "Español (España) · ISO", lang: "es", strings: { ...ui, names: { ...ui.names, AltRight: locale === "es" ? ui.names.AltRight : "AltGr" } } },
    { layout: US_QWERTY, name: "English (US) · ANSI", lang: "en", strings: ui },
  ];
</script>

<div class="boards">
  {#each boards as b (b.layout.id)}
    <div class="board">
      <p class="name" lang={b.lang}>{b.name}</p>
      <div class="pt-frame" inert>
        <div class="pt-app">
          <footer>
            <Keyboard layout={b.layout} highlights={[]} flash={null} strings={b.strings} />
          </footer>
        </div>
      </div>
    </div>
  {/each}
</div>

<style>
  .boards {
    display: grid;
    gap: 1.5rem;
    padding: 1.25rem;
  }
  .name {
    margin: 0 0 0.625rem;
    font-size: 0.875rem;
    font-weight: 700;
    color: var(--muted);
  }
  /* As the simulations: the app's vw/vh read the panel's width (S6Unlock.svelte). */
  .pt-frame {
    container-type: inline-size;
  }
  .pt-app {
    --vw: 1cqw;
    --vh: calc(1cqw * 720 / 1100);
    border-radius: var(--radius);
  }
  footer {
    padding: clamp(0.5rem, 2 * var(--vh), 1rem) 1rem;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
  }
  .pt-app footer :global(.keyboard) {
    --u: min(3.25rem, calc((100 * var(--vw) - 2rem) / 15));
  }
</style>
