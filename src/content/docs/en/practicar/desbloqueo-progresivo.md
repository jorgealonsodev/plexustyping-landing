---
title: "Progressive unlock for beginners · PlexusTyping"
description: "How PlexusTyping's progressive unlock works: start on the home row and add one key each time you master the active ones."
h1: "Progressive unlock"
section: practicar
order: 6
published: 2026-11-23
updated: 2026-11-23
appVersion: "0.2.0"
features: ["progreso", "motor-adaptativo"]
lang: en
---

Progressive unlock is a mode for beginners, off by default: you start with only the keyboard's home row and the app adds one key each time you master the active ones. You turn it on in Settings → Practice → “Progressive unlock”. It only affects prose texts; the words and code modes ignore it.

## Turning it on

1. Open “Settings” with <kbd>Ctrl</kbd>+<kbd>,</kbd> and go to Practice.
2. Turn on “Progressive unlock”.
3. Choose the “Target speed”: 20, 30 (the default), 40 or 50 WPM.

Progress is saved per profile, language and layout, and is kept even if you turn the mode off and on again.

## Where it starts

The starting keys are the letters your layout puts on the keys from A to L and the one after L. In Spanish: a s d f g h j k l ñ. The space is always active, and so is the capital of every active letter.

## When a key unlocks

A key is mastered when it meets all three conditions, according to your prose statistics:

| Condition | Value |
|---|---|
| Samples | At least 30 |
| Error rate (moving average) | 5 % or less |
| Median time per keystroke | Within the target speed: 12 000 / WPM ms (400 ms at 30 WPM) |

After each prose session saved in this mode, one key is added if all active keys are mastered, or after 3 sessions in a row without mastering a new one.

## In what order

First the home row (in Spanish: f j d k s l a ñ) and then the other letters by their frequency in the language (in Spanish: e o n r i t u c m p…). Numbers and punctuation unlock all together once every letter is active.

## Which texts you get

- **With fewer than 15 letters** there are no meaningful sentences: the texts are lowercase words made only of active letters, without AI. First real words from the language's corpus and, to fill in, pronounceable pseudo-words. The new key and your weak keys come up more often.
- **From 15 letters**, texts come from the usual generation (the AI if it is on, the corpus otherwise), limited to the active characters.

## Where you see the progress

- The [on-screen keyboard](/en/docs/keyboard-and-languages/on-screen-keyboard-and-flashes) dims the keys still locked.
- Above the text: “Keys: 9/27 · next: e”.
- In the results of the session that adds a key: “New key unlocked: e”.

In temporary mode, progress lasts until you close the app. To measure how much you practice each day, use the [daily goal](/en/docs/practice/daily-goal-and-streak).
