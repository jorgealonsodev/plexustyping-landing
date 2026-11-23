---
title: "Actualizar y desinstalar · PlexusTyping"
description: "Cómo pasar a una versión nueva de PlexusTyping y cómo desinstalarlo en Linux (.deb y .tar.gz) y Windows, y qué pasa con tus datos."
h1: "Actualizar y desinstalar PlexusTyping"
sidebarLabel: "Actualizar y desinstalar"
section: empezar
order: 7
published: 2026-11-23
updated: 2026-11-23
appVersion: "0.2.0"
features: ["progreso"]
---

PlexusTyping no se actualiza solo: para cambiar de versión descargas el instalador nuevo y lo instalas igual que el primero. Las versiones nuevas se anuncian en la web y en sus notas de versión. Tus sesiones y ajustes se guardan aparte del programa, en tu carpeta de datos, y se conservan al instalar la versión nueva.

## Actualizar

| Instalación | Cómo actualizar |
|---|---|
| Linux `.deb` | Instala el `.deb` nuevo igual que el primero: `sudo apt install ./plexustyping_<versión>_amd64.deb` |
| Linux `.tar.gz` | Descarga y descomprime el archivo nuevo, y vuelve a ejecutar `./install.sh` |
| Windows | Ejecuta el instalador nuevo, `PlexusTyping_<versión>_x64-setup.exe` |

Descarga siempre desde la [página de descarga](/descargar) y [verifica la descarga](/docs/empezar/verificar-descarga) antes de instalar.

## Desinstalar

### Linux con el paquete .deb

```sh
sudo apt remove plexus-typing
```

### Linux con el archivo .tar.gz

Desde la carpeta descomprimida:

```sh
./install.sh --uninstall
```

Elimina exactamente lo que instaló `install.sh` en `~/.local`.

### Windows

Desinstálalo desde Configuración → Aplicaciones.

## Tus datos

Las sesiones, las estadísticas y los ajustes viven en la carpeta de datos de la app (en Linux, `~/.local/share/com.plexustyping.app/`), no junto al programa. Desinstalar con `./install.sh --uninstall` los conserva, y los ajustes sobreviven a reinstalaciones. Si quieres guardar tu historial en otro formato, [expórtalo a CSV](/docs/progreso/exportar-csv) antes.
