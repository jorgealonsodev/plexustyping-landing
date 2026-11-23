---
title: "Dónde se guardan los datos"
description: "Tus sesiones, estadísticas y ajustes se guardan solo en tu equipo, en una base SQLite. Rutas en Linux y Windows, claves de IA y modo temporal."
section: ajustes
order: 3
published: 2026-11-23
updated: 2026-11-23
appVersion: "0.1.0"
features: [progreso, ia]
---

PlexusTyping guarda todo en tu equipo, sin cuenta ni telemetría. Las sesiones, las pulsaciones, las estadísticas, los perfiles y los ajustes están en el archivo `plexustyping.sqlite3`, dentro de la carpeta de datos de la aplicación: en Linux, `~/.local/share/com.plexustyping.app/`. Las claves de IA van aparte, en el llavero del sistema.

## Rutas

| Qué | Linux | Windows |
|---|---|---|
| Base de datos `plexustyping.sqlite3` | `~/.local/share/com.plexustyping.app/` | `%APPDATA%\com.plexustyping.app\` |
| Sesión de ChatGPT `chatgpt-auth.json` | `~/.config/com.plexustyping.app/` | `%APPDATA%\com.plexustyping.app\` |
| Exportaciones CSV | Carpeta de descargas | Carpeta de descargas |

En Linux, si tienes definidas `XDG_DATA_HOME` o `XDG_CONFIG_HOME`, las carpetas están dentro de ellas en lugar de `~/.local/share` y `~/.config`.

## Qué hay en la base de datos

- Perfiles, con su meta diaria, y cuál es el activo.
- Sesiones, pulsaciones y estadísticas de cada perfil.
- Ajustes de la interfaz y de la práctica (tema, teclado, metrónomo, tipografía…). Se escriben en cuanto cambian, así que cerrar la app nunca pierde el último cambio.
- Ajustes de IA, sin las claves.
- Caché de textos generados y contadores de uso de la IA.

## Claves de IA

Las claves de API se guardan solo en el llavero del sistema: Credential Manager en Windows y Secret Service en Linux, con el servicio `com.plexustyping.app` y la cuenta `ai:<proveedor>`. Nunca se guardan en texto plano ni en la base de datos, y nunca vuelven a la interfaz. Sin un llavero que funcione no se puede guardar ninguna clave. Más en [Proveedores y claves](/docs/ia/proveedores-y-claves).

El archivo `chatgpt-auth.json` guarda los tokens de [Iniciar sesión con ChatGPT](/docs/ia/iniciar-sesion-con-chatgpt), solo legible por tu usuario.

## Modo temporal

Si la base de datos no se puede abrir, la app sigue funcionando con un almacén temporal en memoria y la cabecera muestra «Sin guardar: modo temporal». En ese modo:

- Las sesiones duran hasta que cierras la app.
- El historial muestra «Aún no hay sesiones guardadas.».
- La meta diaria y el desbloqueo progresivo solo duran hasta cerrar la app.

## Al desinstalar

`./install.sh --uninstall`, el desinstalador de la versión `.tar.gz`, conserva tus datos en `~/.local/share/com.plexustyping.app/`. Consulta [Actualizar y desinstalar](/docs/empezar/actualizar-y-desinstalar).

## Relacionado

- [Exportar el historial a CSV](/docs/progreso/exportar-csv)
- [Privacidad](/docs/proyecto/privacidad)
