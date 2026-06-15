# syntax=docker/dockerfile:1

# Shared stage: install dependencies once.
FROM node:24-slim AS deps
WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1

COPY package*.json ./
RUN npm ci

# Dev stage: run Next.js with hot reload.
FROM deps AS dev
ENV NODE_ENV=development

COPY . .

EXPOSE 3000
CMD ["npm", "run", "dev", "--", "--hostname", "0.0.0.0"]

# Build stage: create the production output.
FROM deps AS builder
ENV NODE_ENV=production

COPY . .
RUN npm run build

# Prod stage: run only the built app.
FROM node:24-slim AS prod
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

RUN groupadd --system --gid 1001 nodejs \
  && useradd --system --uid 1001 nextjs

# Requires `output: "standalone"` in next.config.mjs
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
CMD ["node", "server.js"]

#               npm ci
#                   ↓
#
#          +----------------+
#          |      deps      |
#          | node_modules   |
#          +----------------+
#             /          \
#            /            \
#           v              v
#
# +----------------+  +----------------+
# |      dev       |  |    builder     |
# | npm run dev    |  | npm run build  |
# +----------------+  +----------------+
#                              |
#                              |
#                              v
#
#                   +----------------+
#                   |      prod      |
#                   | standalone     |
#                   | server.js      |
#                   | static files   |
#                   +----------------+
#
#                   node server.js

