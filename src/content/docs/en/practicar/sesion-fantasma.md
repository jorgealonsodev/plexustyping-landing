---
title: "Ghost session · PlexusTyping"
description: "How the PlexusTyping ghost session works: a second cursor replays your best session with the same text and shows the difference in seconds."
h1: "Ghost session: race your record"
sidebarLabel: "Ghost session"
section: practicar
order: 5
published: 2026-11-23
updated: 2026-11-23
appVersion: "0.1.0"
features: ["progreso", "motor-adaptativo"]
lang: en
---

When you type a text you have typed before, a second, translucent cursor moves at the pace of your best previous session with that same text. Next to the live statistics you see how far behind or ahead you are, in seconds. It is on by default and you turn it off with the ghost button in the header.

## When it appears

The ghost runs when there is a record for exactly that text:

- when you press “Repetir” (repeat) on the results;
- with the diagnostic text;
- with any text that comes up again.

The record is your best session with that text in the same profile and the same mode (and, in code, the same language): the one with the highest net WPM; on a tie, the oldest.

## How to read it

1. The ghost waits at the start until your first key.
2. While you type, the difference shows “+1,2 s” if you are behind or “−0,8 s” if you are ahead, measured at the last position you reached.
3. If it reaches the end before you, it stays there.
4. In the results you see “Récord anterior: 52 PPM” (previous record: 52 WPM) and, if you beat it, “¡Nuevo récord para este texto!” (new record for this text).

A record set in this attempt is the ghost of the next one.

## Turning it on or off

- The ghost button in the header (lit while it is active).
- Settings → Practice → “Sesión fantasma” (ghost session).

## Details

- It works in all three [error modes](/en/docs/practice/error-modes), because it is rebuilt from the saved keystrokes.
- In temporary mode (no database) it uses that run's sessions.
- The time spent deleting with Backspace is not saved per key: it is spread over the keys typed after each deletion.

Your saved sessions are in the history; more in [history and charts](/en/docs/progress/history-and-charts).
