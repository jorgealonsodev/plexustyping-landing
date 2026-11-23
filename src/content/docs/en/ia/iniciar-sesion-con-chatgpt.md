---
title: "Sign in with ChatGPT · PlexusTyping"
description: "How to use your ChatGPT plan in PlexusTyping without an API key: OpenAI's official sign-in, plan limits, signing out and privacy."
h1: "Sign in with ChatGPT"
section: ia
order: 3
published: 2026-11-23
updated: 2026-11-23
appVersion: "0.1.0"
features: ["ia"]
lang: en
---

The “ChatGPT (tu suscripción)” (your subscription) provider generates the texts with your ChatGPT plan instead of an API key. It uses OpenAI's official sign-in for local open-source applications, still in preview. Usage counts against your plan's quota, and a plan error never falls back to spending your keys.

## Signing in

1. In Settings → AI, add “ChatGPT (tu suscripción)” to the fallback chain.
2. Click “Iniciar sesión con ChatGPT” (sign in with ChatGPT). OpenAI's sign-in page opens in your browser.
3. Meanwhile, the app shows “Esperando al navegador…” (waiting for the browser) with a “Cancelar” (cancel) button.
4. When you finish, the app shows the account's email and whether plan usage is enabled.
5. Choose the model from your plan's list.

If you deny access, cancel or take more than 5 minutes, nothing is saved and the app tells you why.

## Usage and limits

- Usage counts against your ChatGPT plan, with its own limits. “Gestionar uso” (manage usage) opens your account's usage page on chatgpt.com.
- When you reach the limit you see “Has alcanzado el límite de tu plan de ChatGPT” (you have reached your ChatGPT plan's limit).

## No silent switch to your keys

A plan error (limit reached, plan usage unavailable or not enabled, ineligible account, rejected session) stops the chain: the text comes from the cache or the local corpus with that notice, and the keys of your other providers are never used instead. Only a network failure, a timeout or a malformed response moves on to the next provider. More in [fallback chain, cache and usage](/en/docs/ai/fallback-cache-and-usage).

## Signing out

“Cerrar sesión” (sign out) revokes the session at OpenAI and deletes the tokens from your computer. If OpenAI cannot confirm the revocation, the app says “No se pudo confirmar la revocación” (the revocation could not be confirmed), but the tokens are deleted anyway. Afterwards you can sign in with the same account or another.

## Privacy

The session tokens are stored only in a private file on your computer, `chatgpt-auth.json`, in the app's configuration folder (on Linux, `~/.config/com.plexustyping.app/`), readable only by your user. They never go to the database, the logs or the interface. OpenAI receives the same as any other provider: [what is sent and what is not](/en/docs/ai/what-is-sent).
