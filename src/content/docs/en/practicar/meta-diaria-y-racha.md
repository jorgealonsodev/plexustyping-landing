---
title: "Daily goal and streak · PlexusTyping"
description: "How to set a daily goal in minutes or texts per profile in PlexusTyping, how today's progress is counted and how the day streak works."
h1: "Daily goal and streak"
section: practicar
order: 7
published: 2026-11-23
updated: 2026-11-23
appVersion: "0.2.0"
features: ["progreso"]
lang: en
---

Each profile can have its own daily goal, in minutes or texts per day, set in Settings → Profiles. With a goal set, the header shows today's progress next to the profile name, for example “Today 12/20 min · streak 3”. The streak counts the days in a row you met it.

## Setting the goal

1. Open “Settings” with <kbd>Ctrl</kbd>+<kbd>,</kbd> and go to Profiles.
2. In “Daily goal”, choose an option:

| Option | Values |
|---|---|
| Off | The default |
| Minutes per day | 5, 10, 15, 20, 30, 45, 60, 90 or 120 |
| Texts per day | 1, 3, 5, 10, 15, 20 or 30 |

The goal belongs to the active profile; the other profiles keep theirs. More about profiles in [profiles](/en/docs/progress/profiles).

## How it is counted

The active profile's saved sessions (prose, words and code) that started today, in your local time, count.

- **Minutes:** the sum of their durations. It is shown rounded down, and the goal is met when the exact sum reaches it.
- **Texts:** the number of sessions.

## What you see

| Moment | Text |
|---|---|
| During the day | “Today 12/20 min · streak 3” or “Today 2/5 texts” |
| Goal met | “Goal met · streak 4” |
| Results of the session that meets it | “Daily goal met!” |

## The streak

- It counts the consecutive days on which the current goal was met.
- It ends today if you already met it today, and yesterday if you have not yet.
- A day without sessions breaks it.
- If you change the goal, the new one also applies to past days.

In temporary mode, the goal and progress last until you close the app. Your practice per day also appears in the “By day” view of the [history](/en/docs/progress/history-and-charts).
