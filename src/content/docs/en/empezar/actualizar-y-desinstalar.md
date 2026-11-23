---
title: "Update and uninstall · PlexusTyping"
description: "How to move to a new PlexusTyping version and how to uninstall it on Linux (.deb and .tar.gz) and Windows, and what happens to your data."
h1: "Update and uninstall PlexusTyping"
sidebarLabel: "Update and uninstall"
section: empezar
order: 7
published: 2026-11-23
updated: 2026-11-23
appVersion: "0.1.0"
features: ["progreso"]
lang: en
---

PlexusTyping does not update itself: to change version you download the new installer and install it the same way as the first. New versions are announced on the website and in their release notes. Your sessions and settings are stored apart from the program, in your data folder, and are kept when you install the new version.

## Update

| Installation | How to update |
|---|---|
| Linux `.deb` | Install the new `.deb` the same way as the first: `sudo apt install ./plexustyping_<version>_amd64.deb` |
| Linux `.tar.gz` | Download and unpack the new archive, and run `./install.sh` again |
| Windows | Run the new installer, `PlexusTyping_<version>_x64-setup.exe` |

Always download from the [download page](/en/download) and [verify the download](/en/docs/getting-started/verify-download) before installing.

## Uninstall

### Linux with the .deb package

```sh
sudo apt remove plexus-typing
```

### Linux with the .tar.gz archive

From the unpacked folder:

```sh
./install.sh --uninstall
```

It removes exactly what `install.sh` installed in `~/.local`.

### Windows

Uninstall it from Settings → Apps.

## Your data

Sessions, statistics and settings live in the app's data folder (on Linux, `~/.local/share/com.plexustyping.app/`), not next to the program. Uninstalling with `./install.sh --uninstall` keeps them, and the settings survive reinstalls. If you want to keep your history in another format, [export it to CSV](/en/docs/progress/export-csv) first.
