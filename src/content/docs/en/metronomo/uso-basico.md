---
title: "Metronome: basics · PlexusTyping"
description: "How to turn on PlexusTyping's metronome with F4, choose a tempo from 30 to 300 BPM, sound, volume and accent, and read each key's rhythm offset."
h1: "Metronome: basics"
sidebarLabel: "Basics"
section: metronomo
order: 1
published: 2026-11-23
updated: 2026-11-23
appVersion: "0.1.0"
features: ["metronomo"]
lang: en
---

PlexusTyping's metronome beats a steady rhythm so you type each key on the pulse: one click equals one expected keystroke. It turns on and off with <kbd>F4</kbd> from anywhere or in Settings → Metronome. It has a tempo from 30 to 300 BPM, three sounds, volume and accent, and changes apply at once.

## Turning it on and configuring it

1. Press <kbd>F4</kbd>, or open “Ajustes” (settings) with <kbd>Ctrl</kbd>+<kbd>,</kbd> and turn on “Metrónomo” (metronome).
2. Adjust the options:

| Setting | Values | Default |
|---|---|---|
| Tempo | 30 to 300 BPM | 60 BPM |
| Sonido (sound) | “Clic”, “Madera” or “Bip” (click, wood or beep) | “Clic” |
| Volumen (volume) | 0 to 100 % | 80 % |
| Acento (accent) | One every N beats, from 0 (no accent) to 16 | Every 4 |
| Tempo adaptativo (adaptive tempo) | On or off | Off |

To change it without leaving the text, use the [quick panel](/en/docs/metronome/quick-panel).

## When it sounds

- Only while a text is ready or you are typing it.
- It stops on the results screen and when the window is hidden.
- It plays from the app's core through the default audio output device.

Next to the live statistics, a dot lights up on every beat (accented ones in another color). With the system's reduced motion, the dot still lights up, without a transition.

## The rhythm offset

Every character you type records how many milliseconds it landed before (“adelantada”, early, a negative value) or after (“atrasada”, late, a positive value) the nearest click. In the results you see:

- “Ritmo: desvío medio ±X ms” (rhythm: mean offset ±X ms): the average absolute offset.
- The share of early and late keys.

Offsets are saved per keystroke, and the session saves the BPM when a single tempo covered the whole text (the BPM column of the [history](/en/docs/progress/history-and-charts)). Changing the tempo restarts the pulse.

## Audio latency

Beat 0 is counted when the audio starts, without the device's output latency (a few milliseconds). The click is heard that much later, so keys in time with it read a few milliseconds late.

## Next step

Let the tempo rise by itself with the [adaptive tempo](/en/docs/metronome/adaptive-tempo).
