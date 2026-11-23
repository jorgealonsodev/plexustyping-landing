---
title: "Verificar la descarga (SHA-256) · PlexusTyping"
description: "Cómo comprobar con el archivo SHA256SUMS que el instalador de PlexusTyping que descargaste es exactamente el publicado en GitHub Releases."
h1: "Verificar la descarga con SHA-256"
sidebarLabel: "Verificar la descarga"
section: empezar
order: 5
published: 2026-11-23
updated: 2026-11-23
appVersion: "0.1.0"
features: ["motor-adaptativo"]
---

Cada versión de PlexusTyping en GitHub Releases publica, junto a sus tres instaladores, un archivo `SHA256SUMS` con la suma SHA-256 de cada uno. Si la suma del archivo que descargaste coincide con la de esa lista, el archivo es exactamente el publicado y no se ha dañado ni modificado por el camino.

## Qué se publica

| Archivo | Para |
|---|---|
| `plexustyping_<versión>_amd64.deb` | [Linux con el paquete .deb](/docs/empezar/instalar-linux-deb) |
| `plexustyping-<versión>-linux-x86_64.tar.gz` | [Linux con el archivo .tar.gz](/docs/empezar/instalar-linux-tar) |
| `PlexusTyping_<versión>_x64-setup.exe` | [Windows](/docs/empezar/instalar-windows) |
| `SHA256SUMS` | Las sumas de los tres anteriores |

Las sumas de la última versión también aparecen como texto en la [página de descarga](/descargar).

## Verificar en Linux

1. Descarga el instalador y `SHA256SUMS` en la misma carpeta.
2. Abre una terminal en esa carpeta y ejecuta:

   ```sh
   sha256sum -c SHA256SUMS --ignore-missing
   ```

3. Comprueba que el archivo que descargaste aparece con `OK`.

`--ignore-missing` hace que solo se comprueben los archivos que tienes en la carpeta, así que no hace falta descargar los tres.

## Verificar en Windows

Calcula la suma SHA-256 de `PlexusTyping_<versión>_x64-setup.exe` con la herramienta que prefieras y compárala con la línea de ese archivo en `SHA256SUMS` o en la [página de descarga](/descargar). Deben coincidir los 64 caracteres.

## Si la suma no coincide

No instales el archivo. Bórralo y descárgalo de nuevo desde la [página de descarga](/descargar), que enlaza a GitHub Releases, el origen oficial.
