---
title: "How it measures your weak spots · PlexusTyping"
description: "How PlexusTyping calculates your weak spots: errors and slowness per character and per letter pair, with exponential moving averages."
h1: "How the adaptive engine measures your weak spots"
sidebarLabel: "How it measures weak spots"
section: motor-adaptativo
order: 1
published: 2026-11-23
updated: 2026-11-23
appVersion: "0.1.0"
features: ["motor-adaptativo"]
lang: en
---

After every completed session, PlexusTyping goes over all your keystrokes and updates a score from 0 to 1 for every character and every pair of consecutive letters. The score combines your errors (70 %) and your slowness relative to your own pace (30 %), with exponential moving averages that give more weight to what is recent.

## What is measured

The engine works with **units**:

- **Characters:** every character of the text, including the space and, in code, the line break and the tab.
- **Bigrams:** two consecutive expected characters, such as “qu” or “rr”, as long as neither is whitespace.

Each keystroke updates the expected character and the bigram that ends in it. Repeated keystrokes at the same position also count (for example, with “Parar hasta corregir”, stop until corrected).

## A unit's score

| Component | Weight | How it is calculated |
|---|---|---|
| Error | 0.7 | Moving average of 1 (miss) and 0 (hit) |
| Slowness | 0.3 | Moving average of how much longer you take than your mean interval between keys, from 0 to 1 |

- The exponential moving averages (EMA) use a smoothing factor of 0.2: each new keystroke weighs 20 % and the earlier history 80 %.
- Your mean interval between keys is also a moving average, so slowness is measured against your pace, not a fixed speed.
- Intervals longer than 2 seconds count as pauses and are not used for slowness.
- A unit only competes to be a target once it has at least 3 samples.

## Separate models

| Model | Fed by |
|---|---|
| Prose | Prose and words sessions |
| Code | Code sessions in every language |

Each [profile](/en/docs/progress/profiles) has its own models, shared by all its languages. That way code symbols do not affect your prose metrics.

## Where it is used

- To choose each text's targets: [how it picks the texts](/en/docs/adaptive-engine/how-it-picks-texts).
- To tint the keyboard: [heatmap](/en/docs/adaptive-engine/heatmap).
- In the results, as “Tus puntos débiles” (your weak spots): [targets and weak spots](/en/docs/practice/targets-and-weak-spots).
