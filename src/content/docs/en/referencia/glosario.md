---
title: "Glossary: WPM, accuracy, bigram, EMA and more"
description: "What gross and net WPM, accuracy, keystrokes per minute, bigram, EMA, slowness and heatmap level mean, as the app calculates them."
h1: "Glossary"
section: referencia
order: 2
published: 2026-11-23
updated: 2026-11-23
appVersion: "0.1.0"
features: [motor-adaptativo, progreso, metronomo]
lang: en
---

This glossary defines the terms PlexusTyping shows, as the application calculates them. A word is 5 characters; a session's time runs from the first to the last keystroke; and every character and every bigram has a weakness score that combines error and slowness with exponential moving averages (EMA). The app's Spanish term is given in parentheses.

## Speed and accuracy

### WPM (words per minute, “PPM”)

Speed in 5-character words per minute. PlexusTyping shows two:

| Measure | Calculation |
|---|---|
| Gross WPM (“PPM brutas”) | (characters typed ÷ 5) ÷ minutes |
| Net WPM (“PPM netas”) | (characters typed ÷ 5 − uncorrected errors) ÷ minutes, never below 0 |

“Characters typed” is the cursor's final position. The history's charts and averages use net WPM.

### Uncorrected error

A position the cursor has already passed whose last typed character is not the right one. It is subtracted from net WPM.

### Accuracy (“precisión”)

Correct character keystrokes ÷ character keystrokes, as a percentage. It counts every attempt, including those repeated at the same position with “Parar hasta corregir” (stop until corrected). Backspaces do not count. With no keystrokes, accuracy is 100 %.

### Errors (“errores”)

Wrong character keystrokes. “Caracteres fallados” (missed characters) are the characters expected at those keystrokes.

### Keystrokes per minute (“pulsaciones por minuto”)

Every applied keystroke, characters and backspaces, ÷ minutes.

### Time (“tiempo”)

From the moment of the first keystroke to that of the last. The clock starts with the first key.

## Adaptive engine

### Unit

What the engine measures: a character (`ñ`) or a bigram (`qu`).

### Bigram

Two consecutive characters of the text, such as “qu” or “rr”. Each keystroke updates its character and, from the second position, the bigram ending in it, unless either of the two is a space or other whitespace.

### EMA (exponential moving average)

An average that gives more weight to what is recent. With each new sample:

```text
new EMA = 0.2 × sample + 0.8 × previous EMA
```

A unit's first sample is taken as is.

### A unit's error

The EMA of its error samples: 1 if the keystroke was wrong and 0 if it was right.

### Slowness (“lentitud”)

How much slower than your usual pace a keystroke is, from 0 to 1:

```text
slowness = clamp(interval ÷ mean interval − 1, 0, 1)
```

The interval is the time since the previous keystroke. The mean interval is an EMA of your intervals. Intervals longer than 2000 ms are pauses and do not count. A unit's slowness is the EMA of these samples.

### Weakness score

```text
score = 0.7 × error + 0.3 × slowness
```

It goes from 0 to 1. Only units with at least 3 samples compete as targets.

### Targets (“objetivos”)

The weak units each text practices, 2 or 3 according to the “Objetivos” setting, shown as “Practicando: ñ · qu · z”. They are drawn at random among the worst, more likely the higher their score. More in [how it picks the texts](/en/docs/adaptive-engine/how-it-picks-texts).

### Heatmap level

Each key takes the highest score of the characters it produces; a composed character such as `á` counts for its base key. The score becomes a 10-step tint and a level from 1 to 5 (two steps per level), shown on the key: 1 very few, 2 few, 3 some, 4 quite a few, 5 many errors. See [heatmap](/en/docs/adaptive-engine/heatmap).

## Metronome

### BPM

The metronome's beats per minute, from 30 to 300. One click equals one expected keystroke.

### Rhythm offset (“desvío de ritmo”)

How many milliseconds before (negative, “adelantada”, early) or after (positive, “atrasada”, late) the nearest click each keystroke landed. The results show “Ritmo: desvío medio ±X ms” (rhythm: mean offset), the average absolute offset.

## Progress

### Mastered key

In [progressive unlock](/en/docs/practice/progressive-unlock), a key with at least 30 samples, an error (EMA) of 5 % or less and a median time per keystroke within the target speed: 12 000 ÷ WPM ms, that is, 400 ms at 30 WPM.

### Streak (“racha”)

Days in a row on which the current daily goal was met. See [daily goal and streak](/en/docs/practice/daily-goal-and-streak).

### Diagnostic text (“texto de diagnóstico”)

The fixed text every profile starts with until it saves its first session.

## Related

- [How it measures your weak spots](/en/docs/adaptive-engine/how-it-measures-weak-spots)
- [History and charts](/en/docs/progress/history-and-charts)
