---
title: "Verify the download (SHA-256) · PlexusTyping"
description: "How to check with the SHA256SUMS file that the PlexusTyping installer you downloaded is exactly the one published on GitHub Releases."
h1: "Verify the download with SHA-256"
sidebarLabel: "Verify the download"
section: empezar
order: 5
published: 2026-11-23
updated: 2026-11-23
appVersion: "0.2.0"
features: ["motor-adaptativo"]
lang: en
---

Every PlexusTyping version on GitHub Releases publishes, next to its three installers, a `SHA256SUMS` file with the SHA-256 sum of each one. If the sum of the file you downloaded matches the one in that list, the file is exactly the published one and was not damaged or modified on the way.

## What is published

| File | For |
|---|---|
| `plexustyping_<version>_amd64.deb` | [Linux with the .deb package](/en/docs/getting-started/install-linux-deb) |
| `plexustyping-<version>-linux-x86_64.tar.gz` | [Linux with the .tar.gz archive](/en/docs/getting-started/install-linux-tar) |
| `PlexusTyping_<version>_x64-setup.exe` | [Windows](/en/docs/getting-started/install-windows) |
| `SHA256SUMS` | The sums of the three above |

The sums of the latest version also appear as text on the [download page](/en/download).

## Verify on Linux

1. Download the installer and `SHA256SUMS` into the same folder.
2. Open a terminal in that folder and run:

   ```sh
   sha256sum -c SHA256SUMS --ignore-missing
   ```

3. Check that the file you downloaded appears with `OK`.

`--ignore-missing` checks only the files you have in the folder, so you do not need to download all three.

## Verify on Windows

Compute the SHA-256 sum of `PlexusTyping_<version>_x64-setup.exe` with the tool you prefer and compare it with that file's line in `SHA256SUMS` or on the [download page](/en/download). All 64 characters must match.

## If the sum does not match

Do not install the file. Delete it and download it again from the [download page](/en/download), which links to GitHub Releases, the official source.
