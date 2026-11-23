# Static site image: build with Node + pnpm, serve dist/ with unprivileged nginx.
# Works with the classic builder and BuildKit (no cache mounts), so Portainer can build it.

# --- Build stage --------------------------------------------------------------------------------
FROM node:22.23.5-alpine3.24 AS build

ENV CI=true \
    ASTRO_TELEMETRY_DISABLED=1 \
    COREPACK_ENABLE_DOWNLOAD_PROMPT=0
WORKDIR /app

# pnpm version comes from package.json "packageManager".
# git: sitemap <lastmod> comes from commit dates (src/lib/lastmod.ts).
RUN apk add --no-cache git && corepack enable
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN corepack install && pnpm install --frozen-lockfile

COPY . .

# Absolute base for canonical and hreflang URLs (read by astro.config.mjs). Without a real domain
# the build still succeeds, but DEPLOY_BUILD=1 makes every page noindex (src/data/site.ts).
ARG SITE_URL=
ENV SITE_URL=${SITE_URL} \
    DEPLOY_BUILD=1

# _headers is Cloudflare Pages syntax; nginx carries the same headers (deploy/nginx).
# Text assets are precompressed for nginx gzip_static.
RUN pnpm build \
 && rm -f dist/_headers \
 && find dist -type f \( -name '*.html' -o -name '*.css' -o -name '*.js' -o -name '*.mjs' \
      -o -name '*.json' -o -name '*.svg' -o -name '*.txt' -o -name '*.xml' -o -name '*.webmanifest' \) \
      -size +511c -exec gzip -9 -k -n {} +

# --- Runtime stage ------------------------------------------------------------------------------
FROM nginxinc/nginx-unprivileged:1.30.6-alpine3.24

COPY deploy/nginx/nginx.conf /etc/nginx/nginx.conf
COPY deploy/nginx/security-headers.conf /etc/nginx/security-headers.conf
COPY deploy/nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

# Files stay root-owned and read-only to the nginx user (uid 101).
USER 101
EXPOSE 8080
