---
title: "Practice modes: prose, words and code · PlexusTyping"
description: "What each PlexusTyping mode practices: “Prosa” with sentences, single lowercase “Palabras” and “Código” in 15 languages, and how to switch."
h1: "Practice modes: prose, words and code"
sidebarLabel: "Modes"
section: practicar
order: 1
published: 2026-11-23
updated: 2026-11-23
appVersion: "0.1.0"
features: ["modo-codigo", "motor-adaptativo"]
lang: en
---

PlexusTyping has three practice modes, chosen with the “Prosa / Palabras / Código” (prose / words / code) switch in the header, next to the gear. “Prosa” gives sentences, “Palabras” gives single lowercase words and “Código” gives program snippets. Switching mode loads a new text at once.

## Comparison

| Mode | What you type | Where the text comes from | Statistics |
|---|---|---|---|
| Prose | Sentences with capitals and punctuation | AI if turned on; otherwise cache or local corpus | The prose ones |
| Words | Real lowercase words, separated by a space, without punctuation | Always the local corpus, never the AI | The prose ones (same language and layout) |
| Code | Snippets of 5 to 20 lines with syntax highlighting | AI if turned on; otherwise cache or bundled snippets | Their own, apart from prose |

## Prose

The default mode. With targets, the local corpus builds sentences in which at least half of the words contain your weak units. The language is chosen in Practice → “Idioma” (language) ([text languages](/en/docs/keyboard-and-languages/text-languages)).

## Words

Practice single words of the chosen language, all lowercase. At least half contain your weak units (the same targets as prose) and they only use characters your layout can type. These sessions feed the prose statistics, so the results, weak spots and heatmap are the prose ones. In the history they appear as “Palabras”.

## Code

When you choose “Código”, a selector next to the mode switch picks the language: Python, JavaScript, TypeScript, Java, C#, C++, C, Go, Rust, PHP, SQL, Bash, HTML/CSS, Kotlin or Swift.

- <kbd>Enter</kbd> types the line break and <kbd>Tab</kbd> types a tab or skips the spaces to the next tab stop; both are measured keystrokes.
- “Sangría” (indentation, Settings → Code): “Automática” (automatic) fills in the next line's indentation after a correct line break; “Manual” makes you type every space.
- “Líneas máximas” (maximum lines, Settings → Code) sets the snippet size, from 5 to 20 lines (12 by default).

Code sessions have their own weak-spot model, shared by all languages, so symbols do not affect your prose metrics. More in [how it measures your weak spots](/en/docs/adaptive-engine/how-it-measures-weak-spots).

## Related

- [Length and unlimited text](/en/docs/practice/length-and-unlimited-text)
- [Targets and weak spots](/en/docs/practice/targets-and-weak-spots)
