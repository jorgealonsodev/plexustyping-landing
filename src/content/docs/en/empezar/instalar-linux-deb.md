---
title: "Install on Linux with the .deb · PlexusTyping"
description: "How to install PlexusTyping on Ubuntu 22.04 or later, Debian and derivatives with the .deb package and apt, which also installs WebKitGTK and GTK 3."
h1: "Install PlexusTyping on Linux with the .deb package"
sidebarLabel: "Install on Linux (.deb)"
section: empezar
order: 2
published: 2026-11-23
updated: 2026-11-23
appVersion: "0.2.0"
features: ["motor-adaptativo"]
lang: en
---

The `plexustyping_<version>_amd64.deb` package is the simplest way to install PlexusTyping on Ubuntu 22.04 or later, Debian and their 64-bit derivatives. It installs with `apt`, which also installs the system dependencies it needs, the menu entry and the icons. There is nothing else to configure.

## Requirements

- Linux x86_64 (64-bit) with Debian, Ubuntu 22.04 or later, or a derivative.
- Administrator rights (`sudo`) to install the package.

If your distribution does not use `.deb` packages, use the [portable .tar.gz archive](/en/docs/getting-started/install-linux-tar).

## Install

1. Download `plexustyping_<version>_amd64.deb` and `SHA256SUMS` from the [download page](/en/download).
2. Check the SHA-256 sum as explained in [verify the download](/en/docs/getting-started/verify-download).
3. Open a terminal in the download folder and install the package:

   ```sh
   sudo apt install ./plexustyping_<version>_amd64.deb
   ```

4. Open PlexusTyping from the applications menu.

`apt` installs at the same time the dependencies the package declares: `libwebkit2gtk-4.1-0` and `libgtk-3-0`.

## Package name

The installed package is called `plexus-typing` (the name Tauri derives from the product name). It is the one you use to uninstall it:

```sh
sudo apt remove plexus-typing
```

## Next step

Continue with the [first launch and the diagnostic text](/en/docs/getting-started/first-launch). To install a new version, see [update and uninstall](/en/docs/getting-started/update-and-uninstall).
