---
title: "Troubleshooting"
description: "What to do if WebKitGTK is missing, Windows shows SmartScreen, the metronome is silent, the AI does not answer or the app enters temporary mode."
section: ayuda
order: 2
published: 2026-11-23
updated: 2026-11-23
appVersion: "0.1.0"
features: [ia, metronomo, texto-ilimitado]
lang: en
---

This page gathers the most common problems with PlexusTyping 0.1.0 and how to solve them: missing WebKitGTK on Linux, the SmartScreen warning on Windows, a silent metronome, an AI that does not answer and temporary mode. Each section gives the message you will see in the app (in Spanish, with its meaning) and the step that fixes it.

## Linux: WebKitGTK 4.1 is missing

**Symptom:** when you run `./plexustyping` from the `.tar.gz`, the app does not start and the terminal shows the package to install (the output ends with status 1).

**Solution:** install WebKitGTK 4.1 and GTK 3 with your distribution's command:

| Distribution | Command |
|---|---|
| Debian / Ubuntu | `sudo apt install libwebkit2gtk-4.1-0 libgtk-3-0` |
| Fedora | `sudo dnf install webkit2gtk4.1 gtk3` |
| Arch Linux | `sudo pacman -S webkit2gtk-4.1 gtk3` |

The `.deb` package installs these dependencies for you. More in [install on Linux (.tar.gz)](/en/docs/getting-started/install-linux-tar).

## Windows: SmartScreen warning

**Symptom:** when you open `PlexusTyping_<version>_x64-setup.exe`, Windows warns about an unknown publisher.

**Cause:** the installer is not signed yet.

**Solution:** click “More info” and then “Run anyway”. Before that, if you want, [check the SHA-256 sum](/en/docs/getting-started/verify-download) of the file.

## The metronome is silent

Check, in this order:

1. **It is on:** press `F4` or turn it on in Settings → Metronome.
2. **A text is ready or in progress:** the metronome only sounds then. It stops on the results screen and when the window is hidden.
3. **Volume:** check “Volumen” (volume) in the settings or in the [quick panel](/en/docs/metronome/quick-panel).
4. **Audio device:** the metronome uses the system's default audio output. If there is none, you see “Metrónomo: No hay dispositivo de audio” (no audio device). If playback fails, “Metrónomo: No se pudo reproducir el audio: …” (the audio could not be played).

## The AI does not answer

When the AI fails, the app does not stop: it generates the text from the cache or the local corpus and shows the reason above the text.

| Notice | What to do |
|---|---|
| “Falta la clave de …” (the key for … is missing) | Save the provider's key in Settings → AI |
| “… rechazó la clave” (… rejected the key) | Check the key and save it again |
| “… rechazó la petición (revisa el modelo)” (… rejected the request; check the model) | Choose another model for that provider |
| “Falta el modelo de …” (the model for … is missing) | Choose a model for that provider |
| “Sin conexión con la IA” (no connection to the AI) | Check your internet connection |
| “… no respondió a tiempo” (… did not answer in time) | Each provider has 30 s and the chain 60 s; try another provider or later |
| “… está limitando las peticiones” (… is rate-limiting requests) | Wait or add another provider to the chain |
| “La IA no devolvió un texto válido” (the AI did not return a valid text) | The text did not meet the length or the allowed characters; the provider has one retry and then the next one is tried |

Use “Probar conexión” (test connection) on each provider to check it without practicing. If a key cannot be saved, the system keychain is not working: see [where data is stored](/en/docs/settings/where-data-is-stored). With ChatGPT, a plan error stops the chain and never falls back to your keys: see [sign in with ChatGPT](/en/docs/ai/sign-in-with-chatgpt).

On Linux, if you run the app from a terminal, each failed attempt is logged to the error output, without the key.

## “Sin guardar: modo temporal”

**Symptom:** the header shows “Sin guardar: modo temporal” (not saved: temporary mode).

**Cause:** the database could not be opened. The app works, but what you practice is lost when you close it.

**Solution:** hover over the notice to see the exact error. The file is `plexustyping.sqlite3`, in the app's data folder; the path for each system is in [where data is stored](/en/docs/settings/where-data-is-stored).

## Unlimited text (next version 0.1.1)

The “Ilimitado” (unlimited) length arrives in version 0.1.1. If the text's continuation does not arrive, the app says “No se pudo continuar el texto: …; reintentando…” (the text could not be continued; retrying) and asks again; at the end of the text it waits with “Generando más texto…” (generating more text). See [length and unlimited text](/en/docs/practice/length-and-unlimited-text).

## Problem not listed?

See [report a bug](/en/docs/help/report-a-bug).
