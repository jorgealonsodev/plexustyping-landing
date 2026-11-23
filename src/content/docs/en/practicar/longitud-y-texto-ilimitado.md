---
title: "Text length and unlimited text · PlexusTyping"
description: "Text lengths in PlexusTyping 0.1.0, from 100 to 600 characters, and what version 0.1.1 brings: up to 2000 characters and the “Ilimitado” mode."
h1: "Text length and unlimited text"
sidebarLabel: "Length and unlimited text"
section: practicar
order: 2
published: 2026-11-23
updated: 2026-11-23
appVersion: "0.1.0"
features: ["texto-ilimitado"]
lang: en
---

The length of each prose and words text is chosen in Settings → Practice → “Longitud” (length). In version 0.1.0 you can choose 100, 200, 300, 450 or 600 characters; the default is 300 and the change applies from the next text. Longer lengths and the “Ilimitado” (unlimited) text arrive in version 0.1.1.

## Lengths available in 0.1.0

| Option | Characters |
|---|---|
| Options | 100, 200, 300, 450 or 600 |
| Default | 300 |
| When it applies | From the next text |

Code mode does not use “Longitud”: its snippets are measured in lines (“Líneas máximas”, maximum lines, from 5 to 20, in Settings → Code). See the [practice modes](/en/docs/practice/modes).

### How closely each text fits the length

- With the AI on, the prose text is requested at 80 % to 125 % of the chosen length: with 300, between 240 and 375 characters.
- Local corpus texts have their own margin: the chosen length plus one fifth.

## Next version (0.1.1)

What follows is not in the released version yet; it arrives with 0.1.1.

- **More lengths:** 800, 1000, 1500 and 2000 characters.
- **“Ilimitado” (unlimited):** the text grows while you type. As you near the end, the app asks in the background for a continuation (from the AI or the local corpus) and appends it without interrupting you. Only the end of the text generated so far is sent, never what you type.
- **Finishing an unlimited text:** <kbd>Esc</kbd> or the “Terminar” (finish) button scores what you typed up to then as a normal session.

What each version brings is published in the [release notes](/en/docs/project/release-notes).

## Related

- [Targets and weak spots](/en/docs/practice/targets-and-weak-spots)
- [What is sent to the AI and what is not](/en/docs/ai/what-is-sent)
