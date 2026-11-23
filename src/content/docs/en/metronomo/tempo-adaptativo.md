---
title: "Adaptive metronome tempo · PlexusTyping"
description: "How PlexusTyping raises or lowers the metronome tempo after each text according to your accuracy and rhythm offset, in 5 % steps."
h1: "Adaptive tempo"
section: metronomo
order: 3
published: 2026-11-23
updated: 2026-11-23
appVersion: "0.1.0"
features: ["metronomo", "motor-adaptativo"]
lang: en
---

With the adaptive tempo, the metronome readjusts its tempo after each text: it raises it one step if you typed accurately and in time, lowers it if you miss keys or lose the pulse, and keeps it in every other case. It is off by default; turn it on in Settings → Metronome or in the quick panel.

## Turning it on

1. [Turn on the metronome](/en/docs/metronome/basics) with <kbd>F4</kbd>.
2. Turn on “Tempo adaptativo” (adaptive tempo) in Settings → Metronome or in the [quick panel](/en/docs/metronome/quick-panel).
3. Type a whole text without changing the tempo by hand.

## The rule

Only a finished text typed entirely at a single tempo counts.

| Text result | Tempo change |
|---|---|
| Accuracy of at least 97 % and a mean offset of at most 15 % of the interval between beats | Up one step |
| Accuracy below 90 % or a mean offset above 20 % of the interval | Down one step |
| Any other case | Stays |

A step is 5 % of the tempo, with a minimum of 2 BPM, always within 30–300 BPM. The mean offset is the results' “Ritmo: desvío medio ±X ms” (rhythm: mean offset ±X ms).

## What you see

The results show the change, for example “Tempo: 60 → 63 BPM”, or “Tempo: se mantiene en 60 BPM” (tempo: stays at 60 BPM). The new tempo is saved in the “Tempo” setting and used for the next text.

If you change the tempo by hand, that value becomes the new starting point. The tempo is a setting shared by all [profiles](/en/docs/progress/profiles).
