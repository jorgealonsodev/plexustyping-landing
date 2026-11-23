<!--
  S9 "IA con privacidad" demo (PRD §8): an animated diagram of one AI text request, driven by PrivacyDemo
  (src/sim/data/s9.ts): interface → Rust core → provider and back, with what travels on each hop and what
  never leaves. The app has no such screen, so this is a website diagram drawn in the app's own tokens and
  type (src/sim/app.css, src/styles/tokens.css); the prompt it shows is the one the app builds
  (src/sim/privacy/prompt.ts). Replay only, pausable; under prefers-reduced-motion it rests in the overview,
  where every flow is shown at once.
-->
<script lang="ts">
  import { onMount } from "svelte";
  import type { Locale } from "../../i18n/paths";
  import { type Kind, type Node, PHASES, PrivacyDemo, SCENARIOS, sentFields } from "../../sim/data/s9";
  import type { S9Strings } from "../../sim/i18n/s9";
  import "../../sim/app.css";

  let { strings: t, locale = "es" }: { strings: S9Strings; locale?: Locale } = $props();

  const uid = $props.id();
  const NODES: Node[] = ["ui", "core", "provider"];

  let phase = $state<number | null>(null);
  let kind = $state<Kind>("prose");
  let wantPlay = $state(false);
  let ready = $state(false);
  let announcement = $state("");
  let root = $state<HTMLElement>();
  let onScreen = true;

  const demo = new PrivacyDemo({ reducedMotion: true, onChange: (p) => (phase = p) });
  const prompt = $derived(SCENARIOS[locale].prompt);
  const fields = $derived(sentFields(kind));
  const hop = $derived(phase === null ? null : PHASES[phase]!);
  /** The link between ui and core is "a", between core and provider "b". */
  const linkOf = (h: { from: Node; to: Node }) => (h.from === "provider" || h.to === "provider" ? "b" : "a");
  const backwards = (h: { from: Node; to: Node }) => NODES.indexOf(h.to) < NODES.indexOf(h.from);
  const nodeActive = (n: Node) => phase === null || hop?.from === n || hop?.to === n;
  const linkActive = (l: "a" | "b") => phase === null || (hop !== null && linkOf(hop) === l);

  function run() {
    if (wantPlay && onScreen) demo.play();
    else demo.pause();
  }

  function togglePlay() {
    wantPlay = !wantPlay;
    announcement = wantPlay ? t.playing : t.paused;
    run();
  }

  function choose(next: Kind) {
    kind = next;
    demo.setKind(next);
  }

  onMount(() => {
    const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
    ready = true;
    wantPlay = !reducedMotion;
    run();
    const observer = new IntersectionObserver(([entry]) => {
      onScreen = !!entry?.isIntersecting && !document.hidden;
      run();
    });
    if (root) observer.observe(root);
    const onVisibility = () => {
      onScreen = !document.hidden;
      run();
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      demo.pause();
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

  <div class="pt-app privacy" lang={locale}>
    <div class="kinds" role="group" aria-label={t.kindLabel}>
      {#each ["prose", "code"] as const as k (k)}
        <button type="button" aria-pressed={kind === k} class:active={kind === k} onclick={() => choose(k)}>{t.kinds[k]}</button>
      {/each}
    </div>

    <!-- The diagram repeats the ordered steps below; assistive technology reads those instead. -->
    <div class="flow" aria-hidden="true">
      {#each NODES as n, i (n)}
        {#if i > 0}
          {@const l = i === 1 ? "a" : "b"}
          <div class="link" class:on={linkActive(l)}>
            <span class="wire"></span>
            {#if hop && linkOf(hop) === l}
              {#key `${phase}-${kind}`}
                <span class="packet" class:back={backwards(hop)}>{t.packets[phase!]}</span>
              {/key}
            {/if}
          </div>
        {/if}
        <div class="node {n}" class:on={nodeActive(n)}>
          <b>{t.nodes[n].name}</b>
          <span>{t.nodes[n].note}</span>
          {#if n === "ui"}
            <span class="kept">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="5" y="11" width="14" height="9" rx="2" />
                <path d="M8 11V8a4 4 0 0 1 8 0v3" />
              </svg>
              {t.kept[0]}
            </span>
          {/if}
        </div>
      {/each}
    </div>

    <ol class="steps">
      {#each t.steps as step, i (i)}
        <li aria-current={phase === i ? "step" : undefined} class:on={phase === i}>{step}</li>
      {/each}
    </ol>

    <div class="panels">
      <section class="panel" class:on={phase === null || phase === 0 || phase === 1} aria-labelledby="{uid}-sent">
        <h3 id="{uid}-sent">{t.sentTitle}</h3>
        <dl>
          {#each fields as f (f.key)}
            <div><dt>{t.fields[f.key]}</dt><dd>{t.values[kind][f.key]}</dd></div>
          {/each}
        </dl>
      </section>
      {#if kind === "prose"}
        <section class="panel prompt" class:on={phase === null || phase === 1} aria-labelledby="{uid}-prompt">
          <h3 id="{uid}-prompt">{t.promptTitle}</h3>
          <pre lang="es">{prompt}</pre>
          <p>{t.promptNote}</p>
        </section>
      {/if}
      <section class="panel" class:on={phase === null || phase === 3} aria-labelledby="{uid}-kept">
        <h3 id="{uid}-kept">{t.keptTitle}</h3>
        <ul>
          {#each t.kept as k (k)}<li>{k}</li>{/each}
        </ul>
        <p class="label">{t.reply}</p>
      </section>
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

  /* Website controls, in the window's title bar (src/pages/sim-preview/*.astro), on its right. */
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
  @media (max-width: 30rem) {
    .play-label {
      display: none;
    }
  }

  .privacy {
    container-type: inline-size;
    gap: 1.25rem;
    padding: clamp(1rem, 3vw, 2rem);
  }

  /* The app's prose/code switch (ModeSwitch.svelte .kinds). */
  .kinds {
    display: flex;
    align-self: center;
  }
  .kinds button {
    box-sizing: border-box;
    min-height: 2rem;
    padding: 0 0.9rem;
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
  .kinds button:focus-visible {
    position: relative;
    z-index: 1;
    outline-offset: -3px;
  }
  .kinds button.active:focus-visible {
    outline-color: var(--on-accent);
  }
  .kinds .active {
    color: var(--on-accent);
    background: var(--accent);
    border-color: var(--accent);
  }

  .flow {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(4rem, 0.8fr) minmax(0, 1fr) minmax(4rem, 0.8fr) minmax(0, 1fr);
    align-items: center;
  }
  .node {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    padding: 0.9rem 1rem;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 0.5rem;
    /* The active box is marked by its border only: text keeps its full contrast (WCAG 1.4.3). */
    transition: border-color 200ms ease-out, box-shadow 200ms ease-out;
  }
  .node.on {
    border-color: var(--accent);
    box-shadow: inset 0 0 0 1px var(--accent);
  }
  .node b {
    font-size: 0.95rem;
  }
  .node span {
    font-size: 0.8rem;
    color: var(--muted);
  }
  .node .kept {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    align-self: flex-start;
    margin-top: 0.35rem;
    padding: 0.15rem 0.5rem;
    color: var(--success);
    border: 1px dashed var(--success);
    border-radius: 999px;
  }
  .link {
    position: relative;
    height: 2.5rem;
    opacity: 0.35;
    transition: opacity 200ms ease-out;
  }
  .link.on {
    opacity: 1;
  }
  .wire {
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    border-top: 2px dashed var(--border);
  }
  .link.on .wire {
    border-top-color: var(--accent);
  }
  /* A packet moves along the wire; without motion it stays in the middle. */
  .packet {
    position: absolute;
    top: 50%;
    left: 50%;
    max-width: 12rem;
    padding: 0.15rem 0.5rem;
    font-family: var(--mono);
    font-size: 0.72rem;
    white-space: nowrap;
    color: var(--on-accent);
    background: var(--accent);
    border-radius: 0.3rem;
    transform: translate(-50%, -50%);
    animation: travel 1.6s ease-in-out infinite;
  }
  .packet.back {
    animation-direction: reverse;
  }
  @keyframes travel {
    0% {
      left: 0%;
      transform: translate(0, -50%);
      opacity: 0;
    }
    15%,
    85% {
      opacity: 1;
    }
    100% {
      left: 100%;
      transform: translate(-100%, -50%);
      opacity: 0;
    }
  }

  .steps {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 0.75rem;
    margin: 0;
    padding: 0;
    list-style: none;
    counter-reset: step;
  }
  .steps li {
    counter-increment: step;
    padding-top: 0.5rem;
    font-size: 0.85rem;
    color: var(--muted);
    border-top: 2px solid var(--border);
  }
  .steps li::before {
    content: counter(step) ". ";
    font-family: var(--mono);
  }
  .steps li.on {
    color: var(--text);
    border-top-color: var(--accent);
  }

  .panels {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));
    gap: 0.75rem;
  }
  .panel {
    padding: 0.9rem 1rem;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 0.5rem;
    transition: border-color 200ms ease-out;
  }
  .panel.on {
    border-color: var(--accent);
  }
  .panel h3 {
    margin: 0 0 0.6rem;
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--muted);
  }
  .panel dl {
    display: grid;
    gap: 0.35rem;
    margin: 0;
  }
  .panel dl div {
    display: flex;
    flex-wrap: wrap;
    gap: 0.25rem 0.5rem;
    font-size: 0.85rem;
  }
  .panel dt {
    color: var(--muted);
  }
  .panel dt::after {
    content: ":";
  }
  .panel dd {
    margin: 0;
    font-family: var(--mono);
  }
  .panel pre {
    margin: 0;
    font-family: var(--mono);
    font-size: 0.75rem;
    line-height: 1.5;
    white-space: pre-wrap;
    overflow-wrap: anywhere;
  }
  .panel p {
    margin: 0.6rem 0 0;
    font-size: 0.78rem;
    color: var(--muted);
  }
  .panel ul {
    margin: 0;
    padding-left: 1.1rem;
    font-size: 0.85rem;
  }
  .panel .label {
    font-size: 0.8rem;
  }
  .panel .label::before {
    content: "→ ";
  }

  /* Narrow windows: the boxes stack and the wires run down. */
  @container (max-width: 40rem) {
    .flow {
      grid-template-columns: minmax(0, 1fr);
    }
    .link {
      height: 3rem;
    }
    .wire {
      top: 0;
      bottom: 0;
      left: 50%;
      right: auto;
      border-top: 0;
      border-left: 2px dashed var(--border);
    }
    .link.on .wire {
      border-left-color: var(--accent);
    }
    .packet {
      animation-name: travel-down;
    }
    @keyframes travel-down {
      0% {
        top: 0%;
        transform: translate(-50%, 0);
        opacity: 0;
      }
      15%,
      85% {
        opacity: 1;
      }
      100% {
        top: 100%;
        transform: translate(-50%, -100%);
        opacity: 0;
      }
    }
    .steps {
      grid-template-columns: minmax(0, 1fr);
    }
  }
</style>
