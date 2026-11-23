---
title: "Local profiles"
description: "Create local profiles to keep each person's or goal's history, statistics, layout, language and theme apart."
section: progreso
order: 3
published: 2026-11-23
updated: 2026-11-23
appVersion: "0.1.0"
features: [progreso]
lang: en
---

Profiles let several people, or several goals, share PlexusTyping without mixing their progress. Each profile keeps its own history, statistics, keyboard layout, language, theme, daily goal and unlock progress. They are managed in Settings → Profiles and are only local: there are no accounts.

## Managing profiles

The active profile's name appears in the header. Clicking it opens Settings → Profiles, with the list of profiles and the active one marked.

| Action | What it does |
|---|---|
| “Nuevo perfil” (new profile) | Creates a profile with the active one's language and layout. It does not become active until you click “Usar”. |
| “Usar” (use) | Switches to the chosen profile. |
| “Renombrar” (rename) | Changes the name. |
| “Borrar” (delete) | Deletes the profile with all its sessions, keystrokes and statistics. |

Names have 1 to 40 characters and cannot repeat, ignoring case.

## What each profile keeps

| Per profile | Shared by all |
|---|---|
| History, keystrokes and statistics (weak spots, heatmap) | Error mode and live statistics |
| Keyboard layout | On-screen keyboard and heatmap (on or off) |
| Prose language | Text length |
| Theme | Metronome and code options |
| [Daily goal and streak](/en/docs/practice/daily-goal-and-streak) | AI settings |
| [Progressive unlock](/en/docs/practice/progressive-unlock) progress | Imported VS Code themes |

Switching profile applies its layout, language and theme, loads a new text and shows its own weak spots, heatmap and history. A profile without a theme keeps the current one.

## Deleting a profile

“Borrar” asks before acting:

> Se borrarán el historial y las estadísticas de «nombre». ¿Continuar?
> (The history and statistics of “name” will be deleted. Continue?)

- It cannot be undone.
- The other profiles do not change.
- The last remaining profile cannot be deleted.
- If you delete the active profile, the first of the remaining ones becomes active.

## Related

- [History and charts](/en/docs/progress/history-and-charts)
- [Settings window map](/en/docs/settings/settings-map)
- [Where data is stored](/en/docs/settings/where-data-is-stored)
