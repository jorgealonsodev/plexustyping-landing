---
title: "Text length and unlimited text · PlexusTyping"
description: "PlexusTyping's text lengths, from 100 to 2000 characters, the header picker and the “Unlimited” mode, which grows while you type."
h1: "Text length and unlimited text"
sidebarLabel: "Length and unlimited text"
section: practicar
order: 2
published: 2026-11-23
updated: 2026-11-23
appVersion: "0.2.0"
features: ["texto-ilimitado"]
lang: en
---

The length of each prose and words text is chosen in the header picker, next to Prose / Words / Code, or in Settings → Practice → “Length”. You can choose 100, 200, 300, 450, 600, 800, 1000, 1500 or 2000 characters, or “Unlimited”, a text that grows while you type; the default is 300.

## Available lengths

| Option | Characters |
|---|---|
| Options | 100, 200, 300, 450, 600, 800, 1000, 1500 or 2000, or “Unlimited” |
| Default | 300 |
| Where to choose it | In the header, next to Prose / Words / Code, or in Settings → Practice → “Length” |

The 800 to 2000 character lengths, “Unlimited” and the header picker arrived with version 0.2.0.

Code mode does not use “Length”: its snippets are measured in lines. In code mode, the same header picker chooses the “Maximum lines” (5, 8, 12, 16 or 20), which can also be set from 5 to 20 in Settings → Code. See the [practice modes](/en/docs/practice/modes).

### How closely each text fits the length

- With the AI on, the prose text is requested at 80% to 125% of the chosen length: with 300, between 240 and 375 characters.
- Local corpus texts have their own margin: the chosen length plus one fifth.

## “Unlimited” text

With “Unlimited” (in prose and words) the text grows while you type:

- **It starts** with a 600-character text from the usual source (AI, cache or corpus).
- **It grows:** when the cursor reaches the middle of the text, or 400 characters or fewer are left ahead, the app asks in the background for a continuation of about 600 characters and appends it after a space without interrupting you.
- **Where the continuation comes from:** in prose the AI writes it from the last 400 characters, in the same language. Without AI, or when the AI is slow or fails, a text from the local corpus follows, with a note giving the reason. In words mode, more corpus words always follow.
- **If you reach the end** before the continuation, the text waits with “Generating more text…” and goes on as soon as it arrives. If it cannot be continued, the app says “Could not continue the text: …; retrying…” and asks again.
- **Ending:** <kbd>Esc</kbd> or the “End” button under the text scores what you typed as a normal session, with results, history, statistics, daily goal and progressive unlock. If you end without typing anything, it is discarded and another text loads.
- **“Repeat”** after an unlimited text repeats only the part you typed, as a normal text.

Continuations are never cached, and only the text generated so far is sent, never what you type. Unlimited texts do not race the ghost session, and the metronome's adaptive tempo does not change after them. The first diagnostic text is never unlimited.

What each version brings is published in the [release notes](/en/docs/project/release-notes).

## Related

- [Targets and weak spots](/en/docs/practice/targets-and-weak-spots)
- [What is sent to the AI and what is not](/en/docs/ai/what-is-sent)
