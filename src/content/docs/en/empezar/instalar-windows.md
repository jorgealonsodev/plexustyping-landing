---
title: "Install on Windows · PlexusTyping"
description: "How to install PlexusTyping on 64-bit Windows 10 and 11 without administrator rights, and what to do about the unsigned installer's SmartScreen warning."
h1: "Install PlexusTyping on Windows"
sidebarLabel: "Install on Windows"
section: empezar
order: 4
published: 2026-11-23
updated: 2026-11-23
appVersion: "0.2.0"
features: ["motor-adaptativo"]
lang: en
---

On 64-bit Windows 10 and 11, PlexusTyping installs with `PlexusTyping_<version>_x64-setup.exe`. The installer works for your user account only, without administrator rights, and downloads the WebView2 component if Windows does not have it. Because it is not signed yet, SmartScreen shows an unknown publisher warning the first time.

## Requirements

- 64-bit Windows 10 or 11 (x64).
- An internet connection during installation only if WebView2 is missing.

## Install

1. Download `PlexusTyping_<version>_x64-setup.exe` and `SHA256SUMS` from the [download page](/en/download).
2. Check the SHA-256 sum as explained in [verify the download](/en/docs/getting-started/verify-download).
3. Run the installer.
4. If the SmartScreen warning appears, click “More info” and then “Run anyway”.
5. Finish the wizard and open PlexusTyping.

## Why SmartScreen appears

The installer does not have a code signature yet, so Windows does not recognize the publisher and warns you. Signing is planned for a future version. Meanwhile, the way to check that the file is the published one is its SHA-256 sum.

## Uninstall

Uninstall it from Settings → Apps, like any other application. More details in [update and uninstall](/en/docs/getting-started/update-and-uninstall).

## Next step

Continue with the [first launch and the diagnostic text](/en/docs/getting-started/first-launch).
