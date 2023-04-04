# base node image
FROM node:gallium-bullseye-slim@sha256:0b889cbf70af3740c8caaee425be6a26f2e7f3ceffdb94a83b6d236eea1b421e as base
RUN npm i -g pnpm

# Install all node_modules, including dev dependencies
FROM base as build
WORKDIR /project
ADD package.json pnpm-lock.yaml ./
RUN pnpm install
ADD . .
RUN pnpm run build
ENV NODE_ENV=production
CMD ["pnpm", "run", "start"]