---
title: "System requirements"
description: "PlexusTyping runs on Linux x86_64 with WebKitGTK 4.1 and GTK 3, and on 64-bit Windows 10 and 11. Requirements per package, network, audio and keychain."
section: referencia
order: 3
published: 2026-11-23
updated: 2026-11-23
appVersion: "0.1.0"
features: [ia, metronomo, distribuciones-e-idiomas]
lang: en
---

PlexusTyping runs on Linux x86_64 and on 64-bit Windows 10 and 11. On Linux it needs WebKitGTK 4.1 and GTK 3: the `.deb` package installs them for you and the `.tar.gz` requires them to be installed already. On Windows it uses WebView2, which the installer downloads if it is missing. It needs no internet connection except for AI texts.

## Per package

| Package | System | Requirements |
|---|---|---|
| `plexustyping_<version>_amd64.deb` | Debian, Ubuntu 22.04 or later and derivatives, x86_64 | `apt` installs `libwebkit2gtk-4.1-0` and `libgtk-3-0` |
| `plexustyping-<version>-linux-x86_64.tar.gz` | Any x86_64 distribution | WebKitGTK 4.1 and GTK 3 installed beforehand |
| `PlexusTyping_<version>_x64-setup.exe` | Windows 10 or 11 x64 | WebView2; the installer downloads it if Windows does not have it. No administrator rights needed |

Dependencies of the `.tar.gz` by distribution:

| Distribution | Command |
|---|---|
| Debian / Ubuntu | `sudo apt install libwebkit2gtk-4.1-0 libgtk-3-0` |
| Fedora | `sudo dnf install webkit2gtk4.1 gtk3` |
| Arch Linux | `sudo pacman -S webkit2gtk-4.1 gtk3` |

There is no macOS version.

## Other requirements

| Resource | What for | Without it |
|---|---|---|
| Internet connection | AI texts and signing in with ChatGPT | The app works with the local corpus |
| Audio output device | Metronome (uses the default device) | Notice “Metrónomo: No hay dispositivo de audio” (metronome: no audio device) |
| System keychain (Secret Service on Linux, Credential Manager on Windows) | Saving AI API keys | No key can be saved |

The app window measures at least 720 × 480 pixels.

The keyboard layout chosen in the app must match the operating system's, because keystrokes arrive through the system. See [layouts](/en/docs/keyboard-and-languages/layouts).

## Related

- [Install on Linux (.deb)](/en/docs/getting-started/install-linux-deb)
- [Install on Linux (.tar.gz)](/en/docs/getting-started/install-linux-tar)
- [Install on Windows](/en/docs/getting-started/install-windows)
- [Troubleshooting](/en/docs/help/troubleshooting)
