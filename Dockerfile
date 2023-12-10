# base node image
FROM node:current-bullseye-slim@sha256:38804fe940240eebb0a059e181d794fba8a43da8e6e8abea453ff4ceb3ba4c9c as base
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