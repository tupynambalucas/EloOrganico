# Estágio 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
COPY packages/backend/package.json ./packages/backend/
COPY packages/frontend/package.json ./packages/frontend/
COPY packages/shared/package.json ./packages/shared/

RUN npm ci

COPY packages/shared ./packages/shared
COPY packages/backend ./packages/backend


WORKDIR /app/packages/shared
RUN npm run build

WORKDIR /app/packages/backend
RUN npm run build

# Estágio 2: Runner (Produção)
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

USER node

COPY --from=builder --chown=node:node /app/node_modules ./node_modules

COPY --from=builder --chown=node:node /app/packages/shared/dist ./packages/shared/dist
COPY --from=builder --chown=node:node /app/packages/shared/package.json ./packages/shared/

COPY --from=builder --chown=node:node /app/packages/backend/dist ./packages/backend/dist
COPY --from=builder --chown=node:node /app/packages/backend/package.json ./packages/backend/

ENV NODE_PATH=./packages

EXPOSE 3000

CMD ["node", "packages/backend/dist/server.js"]