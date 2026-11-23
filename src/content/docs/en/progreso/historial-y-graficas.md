---
title: "History and charts"
description: "Open the history with Ctrl+H and review your sessions, your progress per day and your weakest characters, with charts and tables."
section: progreso
order: 1
published: 2026-11-23
updated: 2026-11-23
appVersion: "0.1.0"
features: [progreso, motor-adaptativo]
lang: en
---

The history shows every saved session of the active profile. Open it with `Ctrl+H` or the clock button in the header. A filter picks which sessions you see (Todo, Prosa, Palabras or Código: all, prose, words or code) and a selector switches between three views: “Sesiones” (sessions), “Por día” (by day) and “Por carácter” (by character).

## Filter and views

| Control | Options | What it changes |
|---|---|---|
| Filter | Todo · Prosa · Palabras · Código | The sessions every view uses |
| View | Sesiones · Por día · Por carácter | What the window shows |

Every view follows the active filter. `Esc`, the `×` button, a click outside the window or `Ctrl+H` again close the history and return focus to the text.

## The “Sesiones” view

The default view.

- **Summary:** number of sessions, average and best net WPM, and average accuracy.
- **Chart:** net WPM and accuracy of the last 50 sessions, from the oldest (left) to the most recent.
- **Table:** every session, from the most recent to the oldest, with date, mode and language, net WPM, accuracy, time and BPM (empty if you did not use the metronome).

This view is where you export the history: see [export the history to CSV](/en/docs/progress/export-csv).

## The “Por día” view

It groups sessions by local day, the same day the [daily goal](/en/docs/practice/daily-goal-and-streak) uses, and shows the last 30 days with sessions.

- **Chart:** the day's average net WPM (line) and minutes practiced (bars).
- **Table:** Day · Sessions · Minutes · Net WPM · Accuracy, from the most recent day to the oldest.

The day's WPM and accuracy are averages weighted by each session's duration. Minutes are rounded down.

## The “Por carácter” view

It uses the same per-character statistics that decide your weak spots and the [heatmap](/en/docs/adaptive-engine/heatmap).

- **Table:** Character · Samples · Error · Slowness, with the characters that have at least 5 samples, from worst to best (first by error, then by slowness).
- **Chart:** bars with the error of the 20 worst characters.

The space appears as “espacio”, Enter as “Intro” and Tab as “Tab”. The error is shown as a percentage (`4,2 %`, with the Spanish decimal comma) and the slowness as the stored relative value, from 0 to 1, with one decimal. With the “Todo” filter, prose and code are combined by their samples; “Palabras” shares the prose statistics.

If there are not enough keystrokes yet, the view says “Aún no hay bastantes pulsaciones por carácter.” (not enough keystrokes per character yet).

## Without sessions

With no saved sessions, or in temporary mode, every view shows “Aún no hay sesiones guardadas.” (no saved sessions yet). Temporary mode is explained in [where data is stored](/en/docs/settings/where-data-is-stored).

## Related

- [Profiles](/en/docs/progress/profiles): each profile has its own history.
- [Glossary](/en/docs/reference/glossary): what net WPM, accuracy and slowness are.
- [How it measures your weak spots](/en/docs/adaptive-engine/how-it-measures-weak-spots).
