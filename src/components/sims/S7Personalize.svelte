<!--
  S7 "Hazla tuya" (PRD §8, §6.8): the app's own settings controls (SettingField, copied, with the select and
  checkbox rows of AppearanceSection.svelte and TextSection.svelte) over a sample practice text drawn with the
  app's practice-text CSS (src/sim/personalize/PracticeText.svelte). A theme's colours are the app's
  typingColors() output, fetched from /sim/themes/<id>.json only when chosen and set on this demo's window with
  style.setProperty (never on <html>); a font's files load only when chosen. A gentle autoplay tours a few
  themes until the visitor touches a control; never under prefers-reduced-motion.
-->
<script lang="ts">
  import { onMount } from "svelte";
  import "../../sim/app.css";
  import { SAMPLE, STATES, TOUR, TOUR_MS, TYPED } from "../../sim/data/s7";
  import type { S7Strings } from "../../sim/i18n/s7";
  import { CURSOR_BLINK_SETTING, CURSOR_SETTING, CURSOR_STYLES, DEFAULT_CURSOR_STYLE } from "../../sim/personalize/cursor";
  import { loadPracticeFont } from "../../sim/personalize/fontFiles";
  import { DEFAULT_FONT_ID, FONT_GROUPS, FONT_SETTING, PRACTICE_FONTS, fontById, fontStyleVars } from "../../sim/personalize/fonts";
  import PracticeText from "../../sim/personalize/PracticeText.svelte";
  import SettingField from "../../sim/personalize/SettingField.svelte";
  import { THEMES } from "../../sim/personalize/themes.generated";

  let { strings: t }: { strings: S7Strings } = $props();

  // settings.ts DIM_PENDING_SETTING, copied (that module is not: the rest of it is the app's settings store).
  const DIM_PENDING_SETTING = {
    label: "Atenuar texto pendiente",
    hint: "Baja el contraste del texto por escribir por debajo del nivel AA para que destaque lo escrito; desactívalo para recuperarlo.",
  };
  // AppearanceSection.svelte's groups. Demo edit: the two high-contrast themes get their own group, first, so
  // they are easy to find; there are no imported themes in the demo.
  const GROUPS = [
    { label: "Alto contraste", themes: THEMES.filter((x) => x.highContrast) },
    { label: "Oscuros", themes: THEMES.filter((x) => x.dark && !x.highContrast) },
    { label: "Claros", themes: THEMES.filter((x) => !x.dark && !x.highContrast) },
  ];

  const CHARS = [...SAMPLE];
  const uid = $props.id();
  const titleId = `${uid}-settings`;
  let themeId = $state("catppuccin-mocha");
  let fontId = $state(DEFAULT_FONT_ID);
  let cursorStyle = $state(DEFAULT_CURSOR_STYLE);
  let cursorBlink = $state(true);
  let dimPending = $state(true);
  const font = $derived(fontById(fontId));

  let ready = $state(false);
  let touring = $state(false);
  let onScreen = true;
  let announcement = $state("");
  let win = $state<HTMLElement>();
  let root = $state<HTMLElement>();
  const cache = new Map<string, Promise<Record<string, string>>>();
  /** The last theme asked for: a slower earlier fetch never overwrites it. */
  let wanted = "";

  function fetchTheme(id: string) {
    let vars = cache.get(id);
    if (!vars) {
      vars = fetch(`/sim/themes/${id}.json`).then((r) => {
        if (!r.ok) throw new Error(String(r.status));
        return r.json() as Promise<Record<string, string>>;
      });
      vars.catch(() => cache.delete(id));
      cache.set(id, vars);
    }
    return vars;
  }

  /** colors.ts applyTheme(), on the demo window only. */
  async function applyTheme(id: string, announce: boolean) {
    themeId = id;
    wanted = id;
    try {
      const vars = await fetchTheme(id);
      if (wanted !== id || !win) return;
      for (const [name, value] of Object.entries(vars)) win.style.setProperty(name, value);
      if (announce) announcement = t.themeApplied.replace("{name}", THEMES.find((x) => x.id === id)?.name ?? id);
    } catch {
      if (announce) announcement = t.themeFailed;
    }
  }

  function setFont(id: string) {
    fontId = id;
    const vars = fontStyleVars(fontById(id));
    // The family is set at once (font-display: swap); its files load only now that it is chosen.
    void loadPracticeFont(id);
    for (const [name, value] of Object.entries(vars)) win?.style.setProperty(name, value);
  }

  // The tour: one theme after another while it plays and the demo is on screen.
  let timer: ReturnType<typeof setInterval> | null = null;
  function runTour() {
    stopTour();
    if (!touring || !onScreen) return;
    timer = setInterval(() => {
      const next = TOUR[(TOUR.indexOf(themeId) + 1) % TOUR.length] ?? TOUR[0]!;
      void applyTheme(next, false);
    }, TOUR_MS);
  }
  function stopTour() {
    if (timer !== null) clearInterval(timer);
    timer = null;
  }

  /** A visitor's choice ends the tour. */
  function interact() {
    if (!touring) return;
    touring = false;
    stopTour();
  }

  function togglePlay() {
    touring = !touring;
    announcement = touring ? t.playing : t.paused;
    runTour();
  }

  type Change<T extends HTMLElement> = Event & { currentTarget: T };

  onMount(() => {
    ready = true;
    void applyTheme(themeId, false);
    touring = !matchMedia("(prefers-reduced-motion: reduce)").matches;
    runTour();
    const observer = new IntersectionObserver(([entry]) => {
      onScreen = (entry?.isIntersecting ?? true) && !document.hidden;
      runTour();
    });
    if (root) observer.observe(root);
    return () => {
      observer.disconnect();
      stopTour();
    };
  });
</script>

<div class="sim" bind:this={root}>
  <p class="sr-only">{t.description}</p>
  {#if ready}
    <div class="controls">
      <button type="button" class="ctl" aria-label={touring ? t.pause : t.play} title={touring ? t.pause : t.play} onclick={togglePlay}>
        {#if touring}
          <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" fill="currentColor">
            <rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" />
          </svg>
        {:else}
          <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" fill="currentColor">
            <path d="M7 4.8v14.4a1 1 0 0 0 1.5.86l11.9-7.2a1 1 0 0 0 0-1.72L8.5 3.94A1 1 0 0 0 7 4.8z" />
          </svg>
          <span>{t.play}</span>
        {/if}
      </button>
    </div>
  {/if}
  <p class="sr-only" aria-live="polite">{announcement}</p>

  <!-- The demo window: the theme's variables are set here, so the whole app (settings included) changes. -->
  <div class="pt-app" lang="es" bind:this={win}>
    <div class="layout">
      <!-- SettingsModal.svelte's frame: header and one panel (Demo edit: only the settings this demo shows). -->
      <div class="settings" role="group" aria-labelledby={titleId}>
        <div class="settings-header"><p class="h2" id={titleId}>Ajustes</p></div>
        <div class="panel">
          <SettingField label="Tema" hint="Colores de toda la aplicación; se aplica al momento.">
            {#snippet children({ id, hintId })}
              <select
                {id}
                aria-describedby={hintId}
                disabled={!ready}
                onchange={(e: Change<HTMLSelectElement>) => {
                  interact();
                  void applyTheme(e.currentTarget.value, true);
                }}
              >
                {#each GROUPS as g (g.label)}
                  <optgroup label={g.label}>
                    {#each g.themes as th (th.id)}
                      <option value={th.id} selected={th.id === themeId}>{th.name}</option>
                    {/each}
                  </optgroup>
                {/each}
              </select>
            {/snippet}
          </SettingField>

          <SettingField label={FONT_SETTING.label} hint="{FONT_SETTING.hint} {font.hint}">
            {#snippet children({ id, hintId })}
              <!-- TextSection.svelte. Demo edit: the select and the try-out field read the chosen family from
                   --practice-font (no style attributes); the options are not drawn in their own fonts, whose
                   files load only when chosen. -->
              <div class="font-pick">
                <select
                  {id}
                  class="in-font"
                  aria-describedby={hintId}
                  disabled={!ready}
                  onchange={(e: Change<HTMLSelectElement>) => {
                    interact();
                    setFont(e.currentTarget.value);
                  }}
                >
                  {#each FONT_GROUPS as g (g)}
                    <optgroup label={g}>
                      {#each PRACTICE_FONTS.filter((f) => f.group === g) as f (f.id)}
                        <option value={f.id} selected={f.id === font.id}>{f.name}</option>
                      {/each}
                    </optgroup>
                  {/each}
                </select>
                <input
                  type="text"
                  class="preview in-font"
                  aria-label="Prueba la fuente"
                  placeholder="Escribe aquí para probarla: Ñandú 0O 1lI ¿{'{}'}?"
                  spellcheck="false"
                  autocomplete="off"
                  disabled={!ready}
                  oninput={interact}
                />
              </div>
            {/snippet}
          </SettingField>

          <SettingField label={CURSOR_SETTING.label} hint={CURSOR_SETTING.hint}>
            {#snippet children({ id, hintId })}
              <select
                {id}
                aria-describedby={hintId}
                disabled={!ready}
                onchange={(e: Change<HTMLSelectElement>) => {
                  interact();
                  cursorStyle = e.currentTarget.value;
                }}
              >
                {#each CURSOR_STYLES as c (c.id)}
                  <option value={c.id} selected={c.id === cursorStyle}>{c.name}</option>
                {/each}
              </select>
            {/snippet}
          </SettingField>

          <SettingField toggle label={CURSOR_BLINK_SETTING.label} hint={CURSOR_BLINK_SETTING.hint}>
            {#snippet children({ id, hintId })}
              <input
                {id}
                type="checkbox"
                aria-describedby={hintId}
                checked={cursorBlink}
                disabled={!ready}
                onchange={(e: Change<HTMLInputElement>) => {
                  interact();
                  cursorBlink = e.currentTarget.checked;
                }}
              />
            {/snippet}
          </SettingField>

          <SettingField toggle label={DIM_PENDING_SETTING.label} hint={DIM_PENDING_SETTING.hint}>
            {#snippet children({ id, hintId })}
              <input
                {id}
                type="checkbox"
                aria-describedby={hintId}
                checked={dimPending}
                disabled={!ready}
                onchange={(e: Change<HTMLInputElement>) => {
                  interact();
                  dimPending = e.currentTarget.checked;
                }}
              />
            {/snippet}
          </SettingField>
        </div>
      </div>

      <div class="practice">
        <p class="kind">Texto de práctica</p>
        <PracticeText chars={CHARS} states={STATES} cursor={TYPED} {cursorStyle} {cursorBlink} dim={dimPending} />
      </div>
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
  /* In the window's title bar (the preview page), on its right, as the hero's. */
  .controls {
    position: absolute;
    top: 0;
    right: 0.5rem;
    height: 2.375rem;
    display: flex;
    align-items: center;
  }
  .ctl {
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
  .ctl:hover {
    border-color: var(--accent);
  }

  .pt-app {
    container-type: inline-size;
  }
  .layout {
    display: grid;
    grid-template-columns: minmax(0, 30rem) minmax(0, 1fr);
    align-items: start;
    gap: 2rem;
    padding: clamp(1rem, 3cqw, 2rem);
  }
  /* SettingsModal.svelte: dialog box, header and panel. */
  .settings {
    color: var(--text);
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 0.75rem;
  }
  .settings-header {
    display: flex;
    align-items: center;
    padding: 0.6rem 0.75rem 0.6rem 1.25rem;
    border-bottom: 1px solid var(--border);
  }
  .h2 {
    margin: 0;
    font-size: 1.1rem;
    font-weight: bold;
  }
  .panel {
    padding: 0.5rem 1.25rem 1rem;
  }
  /* TextSection.svelte: the font select with its try-out field. */
  .font-pick {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    width: 14rem;
    max-width: 100%;
  }
  .preview {
    box-sizing: border-box;
    width: 100%;
    margin: 0.4rem 0 0;
    padding: 0.35rem 0.5rem;
    font-size: 1.05rem;
    font-feature-settings: "liga" 0, "calt" 0;
    color: var(--text);
    background: var(--surface-2);
    border: 1px solid var(--border);
    border-radius: 0.35rem;
  }
  .preview::placeholder {
    color: var(--muted);
  }
  /* Demo edit: the app's inline font-family, from the variable the window carries. */
  .font-pick .in-font {
    font-family: var(--practice-font, var(--mono));
  }
  .practice {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    min-width: 0;
    padding-top: 0.5rem;
  }
  /* Practice.svelte .kind */
  .kind {
    margin: 0 0 -0.75rem;
    font-size: 0.85rem;
    color: var(--muted);
  }
  /* Demo edit: narrow windows stack the text above the settings, and each setting's control under its label
     (the app's window is never this narrow). */
  @container (max-width: 48rem) {
    .layout {
      grid-template-columns: minmax(0, 1fr);
    }
    /* The text first, so a change shows without scrolling. */
    .practice {
      order: -1;
    }
  }
  @container (max-width: 30rem) {
    .settings :global(.field) {
      grid-template-columns: minmax(0, 1fr);
      grid-template-areas: "label" "control" "hint";
      row-gap: 0.35rem;
    }
    .settings :global(.field.toggle) {
      grid-template-columns: auto minmax(0, 1fr);
      grid-template-areas: "control label" ". hint";
    }
    .font-pick {
      width: 100%;
    }
  }
</style>
