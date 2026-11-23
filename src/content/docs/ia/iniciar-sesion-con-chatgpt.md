---
title: "Iniciar sesión con ChatGPT · PlexusTyping"
description: "Cómo usar tu plan de ChatGPT en PlexusTyping sin clave de API: inicio de sesión oficial de OpenAI, límites del plan, cierre de sesión y privacidad."
h1: "Iniciar sesión con ChatGPT"
section: ia
order: 3
published: 2026-11-23
updated: 2026-11-23
appVersion: "0.2.0"
features: ["ia"]
---

El proveedor «ChatGPT (tu suscripción)» genera los textos con tu plan de ChatGPT en lugar de una clave de API. Usa el inicio de sesión oficial de OpenAI para aplicaciones locales de código abierto, aún en vista previa. El uso cuenta contra la cuota de tu plan, y un error del plan nunca pasa a gastar tus claves.

## Iniciar sesión

1. En Ajustes → IA, añade «ChatGPT (tu suscripción)» a la cadena de respaldo.
2. Pulsa «Iniciar sesión con ChatGPT». Se abre la página de inicio de sesión de OpenAI en tu navegador.
3. Mientras tanto, la app muestra «Esperando al navegador…» con un botón «Cancelar».
4. Al terminar, la app muestra el correo de la cuenta y si el uso del plan está habilitado.
5. Elige el modelo de la lista de tu plan.

Si rechazas el acceso, cancelas o tardas más de 5 minutos, no se guarda nada y la app indica el motivo.

## Uso y límites

- El uso cuenta contra tu plan de ChatGPT, con sus propios límites. «Gestionar uso» abre la página de uso de tu cuenta en chatgpt.com.
- Al llegar al límite verás «Has alcanzado el límite de tu plan de ChatGPT».

## Sin cambios silenciosos a tus claves

Un error del plan (límite alcanzado, uso del plan no disponible o no habilitado, cuenta no apta, sesión rechazada) detiene la cadena: el texto sale del caché o del corpus local con ese aviso, y nunca se usan las claves de tus otros proveedores en su lugar. Solo un fallo de red, un tiempo agotado o una respuesta mal formada pasan al siguiente proveedor. Más en [cadena de respaldo, caché y uso](/docs/ia/respaldo-cache-y-uso).

## Cerrar sesión

«Cerrar sesión» revoca la sesión en OpenAI y borra los tokens de tu equipo. Si OpenAI no puede confirmar la revocación, la app dice «No se pudo confirmar la revocación», pero los tokens se borran igualmente. Después puedes iniciar sesión con la misma cuenta o con otra.

## Privacidad

Los tokens de la sesión se guardan solo en un archivo privado de tu equipo, `chatgpt-auth.json`, en la carpeta de configuración de la app (en Linux, `~/.config/com.plexustyping.app/`), accesible solo para tu usuario. Nunca van a la base de datos, a los registros ni a la interfaz. A OpenAI le llega lo mismo que a cualquier otro proveedor: [qué se envía y qué no](/docs/ia/que-se-envia).
