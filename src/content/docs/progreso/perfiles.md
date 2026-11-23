---
title: "Perfiles locales"
description: "Crea perfiles locales para separar el historial, las estadísticas, la distribución, el idioma y el tema de cada persona u objetivo."
section: progreso
order: 3
published: 2026-11-23
updated: 2026-11-23
appVersion: "0.2.0"
features: [progreso]
---

Los perfiles permiten que varias personas, o varios objetivos, compartan PlexusTyping sin mezclar su progreso. Cada perfil guarda su propio historial, sus estadísticas, su distribución de teclado, su idioma, su tema, su meta diaria y su progreso de desbloqueo. Se gestionan en «Ajustes → Perfiles» y son solo locales: no hay cuentas.

## Gestionar perfiles

El nombre del perfil activo aparece en la cabecera. Al pulsarlo se abre «Ajustes → Perfiles», con la lista de perfiles y el activo marcado.

| Acción | Qué hace |
|---|---|
| «Nuevo perfil» | Crea un perfil con el idioma y la distribución del activo. No pasa a ser el activo hasta que pulsas «Usar». |
| «Usar» | Cambia al perfil elegido. |
| «Renombrar» | Cambia el nombre. |
| «Borrar» | Borra el perfil con todas sus sesiones, pulsaciones y estadísticas. |

Los nombres tienen de 1 a 40 caracteres y no pueden repetirse, sin distinguir mayúsculas de minúsculas.

## Qué guarda cada perfil

| Por perfil | Compartido por todos |
|---|---|
| Historial, pulsaciones y estadísticas (puntos débiles, mapa de calor) | Modo de error y estadísticas en vivo |
| Distribución de teclado | Teclado visual y mapa de calor (activados o no) |
| Idioma de la prosa | Longitud del texto |
| Tema | Metrónomo y opciones de código |
| [Meta diaria y racha](/docs/practicar/meta-diaria-y-racha) | Ajustes de IA |
| Progreso del [desbloqueo progresivo](/docs/practicar/desbloqueo-progresivo) | Temas importados de VS Code |

Al cambiar de perfil se aplican su distribución, su idioma y su tema, se carga un texto nuevo y se muestran sus propios puntos débiles, mapa de calor e historial. Un perfil sin tema mantiene el actual.

## Borrar un perfil

«Borrar» pregunta antes de actuar:

> Se borrarán el historial y las estadísticas de «nombre». ¿Continuar?

- No se puede deshacer.
- Los demás perfiles no cambian.
- El único perfil que queda no se puede borrar.
- Si borras el perfil activo, pasa a ser activo el primero de los que quedan.

## Relacionado

- [Historial y gráficas](/docs/progreso/historial-y-graficas)
- [Mapa de la ventana de ajustes](/docs/ajustes/mapa-de-ajustes)
- [Dónde se guardan los datos](/docs/ajustes/donde-se-guardan-los-datos)
