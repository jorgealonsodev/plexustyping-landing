---
title: "Historial y gráficas"
description: "Abre el historial con Ctrl+H y revisa tus sesiones, tu progreso por día y tus caracteres más débiles, con gráficas y tablas."
section: progreso
order: 1
published: 2026-11-23
updated: 2026-11-23
appVersion: "0.2.0"
features: [progreso, motor-adaptativo]
---

El historial muestra todas las sesiones guardadas del perfil activo. Ábrelo con `Ctrl+H` o con el botón del reloj de la cabecera, junto al engranaje. Un filtro elige qué sesiones ves (Todo, Prosa, Palabras o Código) y un selector cambia entre tres vistas: «Sesiones», «Por día» y «Por carácter».

## Filtro y vistas

| Control | Opciones | Qué cambia |
|---|---|---|
| Filtro | Todo · Prosa · Palabras · Código | Las sesiones que usan todas las vistas |
| Vista | Sesiones · Por día · Por carácter | Lo que se muestra en la ventana |

Todas las vistas siguen el filtro activo. `Esc`, el botón `×`, un clic fuera de la ventana o `Ctrl+H` de nuevo cierran el historial y devuelven el foco al texto.

## Vista «Sesiones»

Es la vista por defecto.

- **Resumen:** número de sesiones, PPM netas media y mejor, y precisión media.
- **Gráfica:** PPM netas y precisión de las últimas 50 sesiones, de la más antigua (izquierda) a la más reciente.
- **Tabla:** todas las sesiones, de la más reciente a la más antigua, con fecha, modo e idioma, PPM netas, precisión, tiempo y BPM (vacío si no usabas el metrónomo).

Desde esta vista se exporta el historial: consulta [Exportar el historial a CSV](/docs/progreso/exportar-csv).

## Vista «Por día»

Agrupa las sesiones por día local, el mismo día que usa la [meta diaria](/docs/practicar/meta-diaria-y-racha), y muestra los últimos 30 días con sesiones.

- **Gráfica:** PPM netas medias del día (línea) y minutos practicados (barras).
- **Tabla:** Día · Sesiones · Minutos · PPM netas · Precisión, del día más reciente al más antiguo.

Las PPM y la precisión del día son medias ponderadas por la duración de cada sesión. Los minutos se redondean hacia abajo.

## Vista «Por carácter»

Usa las mismas estadísticas por carácter que deciden tus puntos débiles y el [mapa de calor](/docs/motor-adaptativo/mapa-de-calor).

- **Tabla:** Carácter · Muestras · Error · Lentitud, con los caracteres que tienen al menos 5 muestras, del peor al mejor (primero por error, después por lentitud).
- **Gráfica:** barras con el error de los 20 peores caracteres.

El espacio aparece como «espacio», Enter como «Intro» y Tab como «Tab». El error se muestra en porcentaje (`4,2 %`) y la lentitud como el valor relativo guardado, de 0 a 1, con un decimal. Con el filtro «Todo» se combinan prosa y código según sus muestras; «Palabras» comparte las estadísticas de la prosa.

Si aún no hay bastantes pulsaciones, la vista dice «Aún no hay bastantes pulsaciones por carácter.».

## Sin sesiones

Sin sesiones guardadas, o en modo temporal, todas las vistas muestran «Aún no hay sesiones guardadas.». El modo temporal se explica en [Dónde se guardan los datos](/docs/ajustes/donde-se-guardan-los-datos).

## Relacionado

- [Perfiles](/docs/progreso/perfiles): cada perfil tiene su propio historial.
- [Glosario](/docs/referencia/glosario): qué son PPM netas, precisión y lentitud.
- [Cómo mide tus debilidades](/docs/motor-adaptativo/como-mide-tus-debilidades).
