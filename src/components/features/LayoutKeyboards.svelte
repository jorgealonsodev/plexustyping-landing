<!--
  Two of the app's eight keyboard layouts drawn by the app's own on-screen keyboard
  (src/sim/keyboard/Keyboard.svelte): Español (España) in ISO shape and English (US) in ANSI shape.
  Rendered on the server only (no client directive): a still picture with 0 KB of JavaScript.
-->
<script lang="ts">
  import "../../sim/app.css";
  import { ES_QWERTY } from "../../sim/data/es-qwerty";
  import { US_QWERTY } from "../../sim/data/us-qwerty.en";
  import Keyboard from "../../sim/keyboard/Keyboard.svelte";

  const boards = [
    { layout: ES_QWERTY, name: "Español (España) · ISO", lang: "es" },
    { layout: US_QWERTY, name: "English (US) · ANSI", lang: "en" },
  ];
</script>

<div class="boards">
  {#each boards as b (b.layout.id)}
    <div class="board">
      <p class="name" lang={b.lang}>{b.name}</p>
      <div class="pt-frame" inert>
        <div class="pt-app">
          <footer>
            <Keyboard layout={b.layout} highlights={[]} flash={null} />
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
