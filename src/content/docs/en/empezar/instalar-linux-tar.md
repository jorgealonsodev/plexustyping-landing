---
title: "Install on Linux with the .tar.gz · PlexusTyping"
description: "How to install PlexusTyping on any Linux x86_64 distribution with the portable .tar.gz archive: dependencies, install.sh in ~/.local and uninstalling."
h1: "Install PlexusTyping on Linux with the .tar.gz archive"
sidebarLabel: "Install on Linux (.tar.gz)"
section: empezar
order: 3
published: 2026-11-23
updated: 2026-11-23
appVersion: "0.2.0"
features: ["motor-adaptativo"]
lang: en
---

The portable `plexustyping-<version>-linux-x86_64.tar.gz` archive works on any 64-bit Linux distribution that has WebKitGTK 4.1 and GTK 3. You can run the app from the unpacked folder or install it with `install.sh` into `~/.local`, without administrator rights. First, install those two dependencies with your distribution's package manager.

## 1. Install the dependencies

The archive does not include WebKitGTK 4.1 or GTK 3. Install them first:

| Distribution | Command |
|---|---|
| Debian / Ubuntu | `sudo apt install libwebkit2gtk-4.1-0 libgtk-3-0` |
| Fedora | `sudo dnf install webkit2gtk4.1 gtk3` |
| Arch Linux | `sudo pacman -S webkit2gtk-4.1 gtk3` |

## 2. Unpack and run

1. Download the archive and `SHA256SUMS` from the [download page](/en/download) and [verify the download](/en/docs/getting-started/verify-download).
2. Unpack it and enter the folder:

   ```sh
   tar -xzf plexustyping-<version>-linux-x86_64.tar.gz
   cd plexustyping-<version>
   ```

3. Run the app from there, without installing anything:

   ```sh
   ./plexustyping
   ```

`plexustyping` is a launcher: if WebKitGTK 4.1 is missing, it shows the package to install on Debian/Ubuntu, Fedora and Arch and exits with code 1. If it is there, it starts the real binary, `plexustyping-bin`.

## 3. Install into ~/.local (optional)

```sh
./install.sh
```

`install.sh` copies the two executables to `~/.local/bin`, the menu entry to `~/.local/share/applications` and the icons to `~/.local/share/icons/hicolor`. It writes nothing outside `~/.local`. If `~/.local/bin` is not in your `PATH`, the script tells you so you can add it.

## Uninstall

```sh
./install.sh --uninstall
```

It removes exactly what `install.sh` installed. Your data is kept in `~/.local/share/com.plexustyping.app/`.

## Update

The `.tar.gz` does not update itself: download the new one and run `./install.sh` again. More details in [update and uninstall](/en/docs/getting-started/update-and-uninstall). The archive includes a `README` in Spanish with the same instructions.

## Next step

Continue with the [first launch and the diagnostic text](/en/docs/getting-started/first-launch).
