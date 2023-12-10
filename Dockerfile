# base node image
FROM node:slim@sha256:21a626e56b50b95ac0c8263b4b413e80819a2a267579f034ab454218664c08a9 as base
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