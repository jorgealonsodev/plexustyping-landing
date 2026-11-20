<!-- Verbatim copy of the PlexusTyping app's src/features/settings/SettingField.svelte (app commit 14f64cf2b9619deca9d99c2dbb3a2358586c5390). -->
<script lang="ts">
  import type { Snippet } from "svelte";

  // One setting: label, one-line hint and the control, which receives the ids that tie them together.
  let {
    label,
    hint,
    shortcut,
    toggle = false,
    children,
  }: {
    label: string;
    hint: string;
    /** A key that also changes this setting, shown next to the label. */
    shortcut?: string;
    /** Checkbox layout: control before the label. */
    toggle?: boolean;
    children: Snippet<[{ id: string; hintId: string }]>;
  } = $props();

  const id = $props.id();
  const hintId = `${id}-hint`;
</script>

<div class="field" class:toggle>
  <label for={id}>
    {label}
    {#if shortcut}<kbd>{shortcut}</kbd>{/if}
  </label>
  <div class="control">{@render children({ id, hintId })}</div>
  <p class="hint" id={hintId}>{hint}</p>
</div>

<style>
  .field {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    grid-template-areas:
      "label control"
      "hint control";
    align-items: center;
    column-gap: 1rem;
    row-gap: 0.15rem;
    padding: 0.6rem 0;
    border-bottom: 1px solid var(--border);
  }
  .field:last-child {
    border-bottom: none;
  }
  .field.toggle {
    grid-template-columns: auto minmax(0, 1fr);
    grid-template-areas:
      "control label"
      ". hint";
  }
  label {
    grid-area: label;
    font-weight: 600;
    cursor: pointer;
  }
  .control {
    grid-area: control;
    display: flex;
  }
  .hint {
    grid-area: hint;
    margin: 0;
    font-size: 0.85rem;
    color: var(--muted);
  }
  kbd {
    margin-left: 0.3em;
    padding: 0 0.3em;
    font-family: var(--mono);
    font-size: 0.8em;
    font-weight: 400;
    border: 1px solid var(--key-border);
    border-radius: 0.25em;
  }
  .control :global(select) {
    min-width: 10rem;
    max-width: 16rem;
    padding: 0.3rem 0.5rem;
    font: inherit;
    color: var(--text);
    background: var(--surface-2);
    border: 1px solid var(--border);
    border-radius: 0.375rem;
  }
  .control :global(input[type="checkbox"]) {
    width: 1.1rem;
    height: 1.1rem;
    margin: 0;
    accent-color: var(--accent);
  }
</style>
