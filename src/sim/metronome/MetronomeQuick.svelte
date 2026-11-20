<!--
  Copy of the PlexusTyping app's src/features/metronome/MetronomeQuick.svelte (app commit 14f64cf2b9619deca9d99c2dbb3a2358586c5390).
  Demo edits, each marked below: no focus trap (Tab leaves the panel, as a web page must allow; the app keeps
  the keyboard inside it); a `startOpen` prop so the demo can show the panel open without moving the focus; an
  `inline` prop that gives the open panel its own room in the demo instead of floating over the text; a
  `running` prop passed to BeatDot; ids made unique per instance. Everything else is the app's markup and CSS.
-->
<script lang="ts">
  import { tick } from "svelte";
  import type { Sound } from "./api";
  import BeatDot from "./BeatDot.svelte";
  import { type BeatAnchor, MAX_ACCENT_EVERY, MAX_BPM, MIN_BPM, type MetronomeSettings, SOUNDS, parseBpm, stepBpm } from "./beat";

  // The beat dot is also the metronome's quick settings: a click opens a small panel to tune it
  // without leaving the text. Classes only (CSP). Keyboard (accessibility S2): opening moves the
  // focus into the panel, Tab stays inside it while open, and Escape (from the toggle or the panel)
  // closes it and gives the focus back to the toggle.
  let {
    anchor,
    metronome,
    onChange,
    startOpen = false,
    running = true,
    inline = false,
  }: {
    anchor: BeatAnchor;
    metronome: MetronomeSettings;
    onChange: (change: Partial<MetronomeSettings>) => void;
    /** Demo edit: the panel starts open, without taking the focus. */
    startOpen?: boolean;
    /** Demo edit: passed to BeatDot (the demo can pause). */
    running?: boolean;
    /** Demo edit: the panel takes its room in the page instead of floating over the practice text. */
    inline?: boolean;
  } = $props();

  // Demo edit: unique ids, in case a page shows the demo twice.
  const uid = $props.id();
  // svelte-ignore state_referenced_locally
  let open = $state(startOpen);
  let toggle = $state<HTMLButtonElement>();
  let panel = $state<HTMLDivElement>();
  type Change<T extends HTMLElement> = Event & { currentTarget: T };
  const number = (e: Change<HTMLInputElement>) => e.currentTarget.valueAsNumber;

  const controls = () =>
    panel ? [...panel.querySelectorAll<HTMLElement>("button, input, select")].filter((c) => !c.hasAttribute("disabled")) : [];

  async function show() {
    open = true;
    await tick();
    (controls()[0] ?? panel)?.focus();
  }
  function close() {
    open = false;
    toggle?.focus();
  }
  function onToggleKeydown(e: KeyboardEvent) {
    // Escape on the toggle closes an open panel; it never reaches the practice (no restart).
    if (e.key !== "Escape") return;
    e.stopPropagation();
    e.preventDefault();
    if (open) close();
  }
  function onKeydown(e: KeyboardEvent) {
    // Keys typed in the panel never reach the practice (Escape would restart the text).
    e.stopPropagation();
    if (e.key === "Escape") {
      e.preventDefault();
      close();
    }
    // Demo edit: the app's Tab trap (nextFocusIndex) is left out, so Tab moves on through the page.
  }
</script>

<div class="metro-quick">
  <button
    bind:this={toggle}
    type="button"
    class="toggle"
    aria-expanded={open}
    aria-haspopup="dialog"
    aria-label="Ajustes rápidos del metrónomo: {metronome.bpm} BPM"
    title="Ajustar el metrónomo"
    onclick={() => (open ? close() : void show())}
    onkeydown={onToggleKeydown}
  >
    <BeatDot {anchor} {running} />
    <span class="bpm">{metronome.bpm} BPM</span>
  </button>
  {#if open}
    <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
    <div bind:this={panel} class="panel" class:inline role="dialog" aria-label="Metrónomo" tabindex="-1" onkeydown={onKeydown}>
      <div class="row">
        <label class="name" for={`${uid}-bpm`}>Tempo</label>
        <button type="button" aria-label="Más lento" onclick={() => onChange({ bpm: stepBpm(metronome.bpm, -1) })}>−</button>
        <!-- Typed tempo applies on Enter or when leaving the field, not per key (typing 120 passes "1"). -->
        <input
          id={`${uid}-bpm`}
          class="bpm-input"
          type="number"
          inputmode="numeric"
          min={MIN_BPM}
          max={MAX_BPM}
          value={metronome.bpm}
          aria-label="Tempo en BPM"
          onchange={(e: Change<HTMLInputElement>) => {
            const bpm = parseBpm(e.currentTarget.value, metronome.bpm);
            e.currentTarget.value = String(bpm);
            onChange({ bpm });
          }}
        />
        <span class="unit">BPM</span>
        <button type="button" aria-label="Más rápido" onclick={() => onChange({ bpm: stepBpm(metronome.bpm, 1) })}>+</button>
      </div>
      <div class="row">
        <label class="name" for={`${uid}-sound`}>Sonido</label>
        <select id={`${uid}-sound`} onchange={(e: Change<HTMLSelectElement>) => onChange({ sound: e.currentTarget.value as Sound })}>
          {#each SOUNDS as s (s.id)}
            <option value={s.id} selected={s.id === metronome.sound}>{s.label}</option>
          {/each}
        </select>
      </div>
      <div class="row">
        <label class="name" for={`${uid}-volume`}>Volumen</label>
        <input
          id={`${uid}-volume`}
          type="range"
          min="0"
          max="100"
          value={metronome.volume}
          oninput={(e: Change<HTMLInputElement>) => onChange({ volume: number(e) })}
        />
        <span class="value">{metronome.volume} %</span>
      </div>
      <div class="row">
        <label class="name" for={`${uid}-accent`}>Acento cada</label>
        <input
          id={`${uid}-accent`}
          type="number"
          min="0"
          max={MAX_ACCENT_EVERY}
          value={metronome.accentEvery}
          onchange={(e: Change<HTMLInputElement>) => onChange({ accentEvery: number(e) })}
        />
      </div>
      <div class="row check">
        <input
          id={`${uid}-adaptive`}
          type="checkbox"
          checked={metronome.adaptive}
          onchange={(e: Change<HTMLInputElement>) => onChange({ adaptive: e.currentTarget.checked })}
        />
        <label for={`${uid}-adaptive`}>Tempo adaptativo</label>
      </div>
      <div class="row end">
        <button type="button" onclick={() => onChange({ enabled: false })}>Apagar <kbd>F4</kbd></button>
        <button type="button" onclick={close}>Cerrar</button>
      </div>
    </div>
  {/if}
</div>

<style>
  .metro-quick {
    position: relative;
    flex: none;
  }
  .toggle {
    display: flex;
    align-items: center;
    gap: 0.45rem;
    padding: 0.2rem 0.55rem;
    font: inherit;
    font-size: 0.85rem;
    color: var(--muted);
    background: none;
    border: 1px solid transparent;
    border-radius: 999px;
  }
  .toggle:hover,
  .toggle[aria-expanded="true"] {
    color: var(--text);
    border-color: var(--border);
    background: var(--surface-2);
  }
  .bpm {
    font-variant-numeric: tabular-nums;
  }
  .panel {
    position: absolute;
    top: calc(100% + 0.4rem);
    left: 0;
    z-index: 20;
    display: flex;
    flex-direction: column;
    gap: 0.55rem;
    width: 19rem;
    padding: 0.75rem 0.85rem;
    font-size: 0.85rem;
    color: var(--text);
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 0.6rem;
    box-shadow: 0 0.5rem 1.5rem color-mix(in srgb, black 35%, transparent);
  }
  /* Demo edit: the `inline` panel (see the props). */
  .panel.inline {
    position: static;
    max-width: 100%;
    box-sizing: border-box;
    margin-top: 0.4rem;
  }
  .row {
    position: static;
    display: flex;
    min-height: 1.9rem;
    align-items: center;
    gap: 0.5rem;
  }
  .row.end {
    justify-content: flex-end;
  }
  .name {
    flex: none;
    width: 5.5rem;
    color: var(--muted);
  }
  .value {
    width: 3rem;
    text-align: right;
    font-variant-numeric: tabular-nums;
  }
  .bpm-input {
    width: 4.5rem;
    padding: 0.2rem 0.35rem;
    font: inherit;
    font-variant-numeric: tabular-nums;
    text-align: center;
    color: var(--text);
    background: var(--surface-2);
    border: 1px solid var(--border);
    border-radius: 0.3rem;
  }
  .unit {
    color: var(--muted);
    font-size: 0.85em;
  }
  input[type="range"] {
    flex: 1;
    min-width: 6rem;
    accent-color: var(--accent);
  }
  input[type="number"],
  select,
  .panel button {
    padding: 0.25rem 0.45rem;
    font: inherit;
    color: var(--text);
    background: var(--surface-2);
    border: 1px solid var(--border);
    border-radius: 0.375rem;
  }
  input[type="number"] {
    width: 4rem;
  }
  .panel button:hover {
    border-color: var(--accent);
  }
  .check {
    gap: 0.45rem;
  }
</style>
