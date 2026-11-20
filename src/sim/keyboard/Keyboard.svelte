<!-- Copied verbatim from the PlexusTyping app: src/features/keyboard/Keyboard.svelte (app commit 14f64cf2b9619deca9d99c2dbb3a2358586c5390). Do not edit by hand. -->
<script lang="ts">
  import { onDestroy, untrack } from "svelte";
  import { NAMED_LABELS, fingerOf, rowsFor } from "./geometry";
  import { flashVars } from "./flash";
  import { HEAT_LEGEND, HEAT_LEGEND_TITLE, heatLegendText, heatLevel, heatRank } from "./heat";
  import { type Flash, type Highlight, keyLabels } from "./keys";
  import type { Layout } from "./types";

  let {
    layout,
    highlights,
    flash,
    heat = null,
    locked = null,
    colorBlind = false,
  }: {
    layout: Layout | null;
    highlights: Highlight[];
    flash: Flash | null;
    /** Error score per key code (`heatScores`); `null` hides the heatmap. */
    heat?: Map<string, number> | null;
    /** Codes of the keys progressive unlock has not reached yet (S6): drawn dimmed. */
    locked?: Set<string> | null;
    /** Colour-blind mode (a11y S5): Okabe–Ito blue/orange flashes and a bold underline on a wrong key. */
    colorBlind?: boolean;
  } = $props();

  let root = $state<HTMLDivElement>();

  // Flash colours through the CSSOM: the CSP blocks style attributes, not `style.setProperty`.
  $effect(() => {
    if (!root) return;
    for (const [name, value] of Object.entries(flashVars(colorBlind))) root.style.setProperty(name, value);
  });

  const FLASH_MS = 150;

  const rows = $derived(
    rowsFor(layout).map((row) =>
      row.map((spec) => ({
        ...spec,
        // Classes, not style attributes: widths are a fixed set of key units.
        widthClass: `w${spec.width * 100}`,
        finger: fingerOf(spec.code),
        labels: keyLabels(layout?.keys[spec.code], layout?.deadKeys ?? []),
        name: spec.unlabelled ? null : (NAMED_LABELS[spec.code] ?? null),
      })),
    ),
  );
  const roles = $derived(new Map(highlights.map((h) => [h.code, h.role])));

  let flashed = $state<Record<string, "ok" | "bad">>({});
  const timers = new Map<string, ReturnType<typeof setTimeout>>();

  $effect(() => {
    if (!flash) return;
    const { code, ok } = flash;
    untrack(() => {
      clearTimeout(timers.get(code));
      flashed[code] = ok ? "ok" : "bad";
      timers.set(
        code,
        setTimeout(() => {
          delete flashed[code];
          timers.delete(code);
        }, FLASH_MS),
      );
    });
  });

  onDestroy(() => timers.forEach((timer) => clearTimeout(timer)));
</script>

<!-- Decorative: the practice text already says what to type. -->
<div class="keyboard" class:colorblind={colorBlind} aria-hidden="true" bind:this={root}>
  {#each rows as row, r (r)}
    <div class="row">
      {#each row as key, i (i)}
        {@const role = roles.get(key.code)}
        {@const level = heat ? heatLevel(heat.get(key.code) ?? 0) : 0}
        {@const rank = heatRank(level)}
        <div
          class="key {key.widthClass} {role && key.finger ? `finger-${key.finger}` : ''} {level ? `heat heat-${level}` : ''}"
          class:primary={role === "primary"}
          class:modifier={role === "modifier"}
          class:secondary={role === "secondary"}
          class:flash-ok={flashed[key.code] === "ok"}
          class:flash-bad={flashed[key.code] === "bad"}
          class:home={key.code === "KeyF" || key.code === "KeyJ"}
          class:locked={locked?.has(key.code) ?? false}
        >
          {#if key.labels.shift}<span class="shift" class:dead={key.labels.shift.dead}>{key.labels.shift.text}</span>{/if}
          {#if key.labels.main}
            <span class="main" class:dead={key.labels.main.dead}>{key.labels.main.text}</span>
          {:else if key.name}
            <span class="name">{key.name}</span>
          {/if}
          {#if key.labels.altgr}<span class="altgr" class:dead={key.labels.altgr.dead}>{key.labels.altgr.text}</span>{/if}
          <!-- Heat level 1–5: the heatmap does not rely on colour alone (a11y S5). -->
          {#if rank}<span class="rank">{rank}</span>{/if}
        </div>
      {/each}
    </div>
  {/each}
</div>
{#if heat}
  <!-- Each level with its number and its tint, as drawn on the keys (a11y S5). -->
  <p class="legend" title={heatLegendText()}>
    <span>{HEAT_LEGEND_TITLE}:</span>
    {#each HEAT_LEGEND as entry (entry.rank)}
      <span class="level"><span class="swatch heat heat-{entry.tint}">{entry.rank}</span> {entry.name}</span>
    {/each}
  </p>
{/if}

<style>
  .keyboard {
    /* One key unit: shrinks with the window so the keyboard fits down to 720×480. */
    --u: min(4.25rem, calc((100vw - 3rem) / 15), 8vh);
    --gap: calc(var(--u) * 0.08);
    display: flex;
    flex-direction: column;
    align-items: center;
    font-family: var(--mono);
    font-size: calc(var(--u) * 0.4);
    line-height: 1;
    user-select: none;
  }
  .row {
    display: flex;
    width: calc(var(--u) * 15);
  }
  .key {
    position: relative;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    height: calc(var(--u) - var(--gap));
    margin: calc(var(--gap) / 2);
    color: var(--key-fg);
    background: var(--key-bg);
    border: 1px solid var(--key-border);
    border-radius: calc(var(--u) * 0.12);
  }
  .w100 { width: calc(var(--u) * 1 - var(--gap)); }
  .w125 { width: calc(var(--u) * 1.25 - var(--gap)); }
  .w150 { width: calc(var(--u) * 1.5 - var(--gap)); }
  .w175 { width: calc(var(--u) * 1.75 - var(--gap)); }
  .w200 { width: calc(var(--u) * 2 - var(--gap)); }
  .w225 { width: calc(var(--u) * 2.25 - var(--gap)); }
  .w250 { width: calc(var(--u) * 2.5 - var(--gap)); }
  .w275 { width: calc(var(--u) * 2.75 - var(--gap)); }
  .w675 { width: calc(var(--u) * 6.75 - var(--gap)); }
  .shift,
  .altgr {
    position: absolute;
    font-size: 0.7em;
    opacity: 0.75;
  }
  .shift {
    top: 0.2em;
    left: 0.3em;
  }
  .altgr {
    right: 0.3em;
    bottom: 0.2em;
  }
  .rank {
    position: absolute;
    top: 0.2em;
    right: 0.3em;
    font-family: system-ui, sans-serif;
    font-size: 0.6em;
    font-weight: 700;
  }
  .name {
    font-family: system-ui, sans-serif;
    font-size: 0.72em;
    opacity: 0.75;
    white-space: nowrap;
  }
  /* Dead keys compose with the next key: dotted underline. */
  .dead {
    text-decoration: underline dotted;
    text-underline-offset: 0.15em;
  }
  .home .main {
    text-decoration: underline;
    text-underline-offset: 0.2em;
  }
  /* Heatmap tint: the key background mixed toward --heat-base by score, under any highlight. */
  .heat { background: color-mix(in srgb, var(--heat-base) var(--heat), var(--key-bg)); }
  .heat-1 { --heat: 6%; }
  .heat-2 { --heat: 12%; }
  .heat-3 { --heat: 18%; }
  .heat-4 { --heat: 24%; }
  .heat-5 { --heat: 30%; }
  .heat-6 { --heat: 36%; }
  .heat-7 { --heat: 42%; }
  .heat-8 { --heat: 48%; }
  .heat-9 { --heat: 54%; }
  .heat-10 { --heat: 60%; }
  .legend {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    margin: 0.15rem 0 0;
    font-size: 0.75rem;
    line-height: 1;
    color: var(--muted);
  }
  .level {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
  }
  .swatch {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1.1rem;
    height: 1.1rem;
    font-weight: 700;
    color: var(--key-fg);
    border: 1px solid var(--key-border);
    border-radius: 0.25rem;
  }
  .finger-l-pinky { --finger: var(--finger-l-pinky); }
  .finger-l-ring { --finger: var(--finger-l-ring); }
  .finger-l-middle { --finger: var(--finger-l-middle); }
  .finger-l-index { --finger: var(--finger-l-index); }
  .finger-r-index { --finger: var(--finger-r-index); }
  .finger-r-middle { --finger: var(--finger-r-middle); }
  .finger-r-ring { --finger: var(--finger-r-ring); }
  .finger-r-pinky { --finger: var(--finger-r-pinky); }
  .finger-thumb { --finger: var(--finger-thumb); }
  .primary,
  .modifier {
    color: var(--bg);
    background: var(--finger);
    border-color: var(--finger);
    font-weight: 700;
  }
  .modifier {
    opacity: 0.85;
  }
  .secondary {
    color: var(--finger);
    border: 2px dashed var(--finger);
  }
  /* A key progressive unlock has not reached yet (S6). */
  .locked {
    opacity: 0.3;
  }
  /* After the highlight rules, so a flash wins on the same key. Colours: --flash-* (`flash.ts`). */
  @media (prefers-reduced-motion: no-preference) {
    .flash-ok,
    .flash-bad {
      opacity: 1;
    }
    .flash-ok {
      color: var(--flash-ok-fg);
      background: var(--flash-ok);
      border-color: var(--flash-ok);
    }
    .flash-bad {
      color: var(--flash-bad-fg);
      background: var(--flash-bad);
      border-color: var(--flash-bad);
    }
  }
  /* Reduced motion (a11y S6): no flash; the key keeps its look and is underlined in the flash colour. */
  @media (prefers-reduced-motion: reduce) {
    .flash-ok {
      box-shadow: inset 0 calc(var(--u) * -0.1) 0 var(--flash-ok);
    }
    .flash-bad {
      box-shadow: inset 0 calc(var(--u) * -0.1) 0 var(--flash-bad);
    }
  }
  /* Colour-blind mode (a11y S5): a wrong key is also marked by a bold underline, not by colour alone. */
  .colorblind .flash-bad .main,
  .colorblind .flash-bad .name {
    text-decoration: underline;
    text-decoration-thickness: 0.15em;
    text-underline-offset: 0.2em;
  }
</style>
