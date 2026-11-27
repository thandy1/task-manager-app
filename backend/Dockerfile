# This file tells Docker how to build the image for the API.


# syntax=docker/dockerfile:1

# ---- Stage 1: build ----
# Full dependency install, Prisma client generation, TypeScript compile.
FROM node:24-alpine AS build 
WORKDIR /app

# Copy manifests first so this layer is cached until dependencies change.
COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Prisma requires DATABASE_URL to be set when loading its configuration `prisma.config.ts`,
# otherwise it throws an error.
# Client generation doesn't connect to the database, so we use a temporary placeholder so 
# Prisma can load its configuration.
RUN DATABASE_URL="postgresql://placeholder" npx prisma generate
RUN npm run build

# ---- Stage 2: runtime ----
# Production dependencies and compiled output only.
FROM node:24-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production

COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

# The generated Prisma client lives in src/generated, so tsc compiles it into dist.
COPY --from=build --chown=node:node /app/dist ./dist

# The official Node image ships an unprivileged "node" user.
USER node

EXPOSE 3000
CMD ["node", "dist/server.js"]