---
title: "Glosario: PPM, precisión, bigrama, EMA y más"
description: "Qué significan PPM brutas y netas, precisión, pulsaciones por minuto, bigrama, EMA, lentitud y nivel del mapa de calor, tal como los calcula la app."
h1: "Glosario"
section: referencia
order: 2
published: 2026-11-23
updated: 2026-11-23
appVersion: "0.1.0"
features: [motor-adaptativo, progreso, metronomo]
---

Este glosario define los términos que muestra PlexusTyping tal como los calcula la aplicación. Una palabra son 5 caracteres; el tiempo de una sesión va de la primera a la última pulsación; y cada carácter y cada bigrama tienen una puntuación de debilidad que combina error y lentitud con medias móviles exponenciales (EMA).

## Velocidad y precisión

### PPM (palabras por minuto)

La velocidad en palabras de 5 caracteres por minuto. PlexusTyping muestra dos:

| Medida | Cálculo |
|---|---|
| PPM brutas | (caracteres escritos ÷ 5) ÷ minutos |
| PPM netas | (caracteres escritos ÷ 5 − errores sin corregir) ÷ minutos, nunca menos de 0 |

«Caracteres escritos» es la posición final del cursor. Las gráficas y medias del historial usan las PPM netas.

### Error sin corregir

Una posición ya pasada por el cursor cuyo último carácter escrito no es el correcto. Resta de las PPM netas.

### Precisión

Pulsaciones de carácter correctas ÷ pulsaciones de carácter, en porcentaje. Cuenta cada intento, también los repetidos en una misma posición con «Parar hasta corregir». Los retrocesos no cuentan. Sin pulsaciones, la precisión es del 100 %.

### Errores

Pulsaciones de carácter incorrectas. «Caracteres fallados» son los caracteres esperados en esas pulsaciones.

### Pulsaciones por minuto

Todas las pulsaciones aplicadas, caracteres y retrocesos, ÷ minutos.

### Tiempo

Del momento de la primera pulsación al de la última. El reloj empieza con la primera tecla.

## Motor adaptativo

### Unidad

Lo que el motor mide: un carácter (`ñ`) o un bigrama (`qu`).

### Bigrama

Dos caracteres seguidos del texto, como «qu» o «rr». Cada pulsación actualiza su carácter y, desde la segunda posición, el bigrama que termina en él, salvo que alguno de los dos sea un espacio u otro blanco.

### EMA (media móvil exponencial)

Una media que da más peso a lo reciente. Con cada muestra nueva:

```text
EMA nueva = 0,2 × muestra + 0,8 × EMA anterior
```

La primera muestra de una unidad se toma tal cual.

### Error de una unidad

La EMA de sus muestras de error: 1 si la pulsación fue incorrecta y 0 si fue correcta.

### Lentitud

Cuánto más lenta que tu ritmo habitual es una pulsación, de 0 a 1:

```text
lentitud = límite(intervalo ÷ intervalo medio − 1, 0, 1)
```

El intervalo es el tiempo desde la pulsación anterior. El intervalo medio es una EMA de tus intervalos. Los intervalos de más de 2000 ms son pausas y no cuentan. La lentitud de una unidad es la EMA de estas muestras.

### Puntuación de debilidad

```text
puntuación = 0,7 × error + 0,3 × lentitud
```

Va de 0 a 1. Solo compiten como objetivo las unidades con al menos 3 muestras.

### Objetivos

Las unidades débiles que practica cada texto, 2 o 3 según el ajuste «Objetivos», mostradas como «Practicando: ñ · qu · z». Se eligen al azar entre las peores, con más probabilidad cuanto mayor es su puntuación. Más en [Cómo elige los textos](/docs/motor-adaptativo/como-elige-los-textos).

### Nivel del mapa de calor

Cada tecla toma la puntuación más alta de los caracteres que produce; un carácter compuesto como `á` cuenta para su tecla base. La puntuación se convierte en un tinte de 10 pasos y en un nivel del 1 al 5 (dos pasos por nivel), que aparece en la tecla: 1 muy pocos, 2 pocos, 3 algunos, 4 bastantes, 5 muchos errores. Consulta [Mapa de calor](/docs/motor-adaptativo/mapa-de-calor).

## Metrónomo

### BPM

Pulsos por minuto del metrónomo, de 30 a 300. Un clic equivale a una pulsación esperada.

### Desvío de ritmo

Cuántos milisegundos antes (negativo, «adelantada») o después (positivo, «atrasada») del clic más cercano cayó cada pulsación. Los resultados muestran «Ritmo: desvío medio ±X ms», la media del desvío absoluto.

## Progreso

### Tecla dominada

En el [desbloqueo progresivo](/docs/practicar/desbloqueo-progresivo), una tecla con al menos 30 muestras, un error (EMA) del 5 % o menos y una mediana de tiempo por pulsación dentro de la velocidad objetivo: 12 000 ÷ PPM ms, es decir, 400 ms a 30 PPM.

### Racha

Días seguidos en los que se cumplió la meta diaria actual. Consulta [Meta diaria y racha](/docs/practicar/meta-diaria-y-racha).

### Texto de diagnóstico

El texto fijo con el que empieza cada perfil hasta guardar su primera sesión.

## Relacionado

- [Cómo mide tus debilidades](/docs/motor-adaptativo/como-mide-tus-debilidades)
- [Historial y gráficas](/docs/progreso/historial-y-graficas)
