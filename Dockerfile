# base node image
FROM node:gallium-bullseye-slim@sha256:0b889cbf70af3740c8caaee425be6a26f2e7f3ceffdb94a83b6d236eea1b421e as base
# install pnpm
RUN curl -fsSL https://get.pnpm.io/install.sh | SHELL=`which bash` bash -

# Install all node_modules, including dev dependencies
FROM base as deps

RUN mkdir /app
WORKDIR /app

ADD package.json package-lock.yaml ./
RUN pnpm install --production=false

# Setup production node_modules
FROM base as production-deps

RUN mkdir /app
WORKDIR /app

COPY --from=deps /app/node_modules /app/node_modules
ADD package.json package-lock.yaml ./
RUN pnpm prune --production

# Build the app
FROM base as build

RUN mkdir /app
WORKDIR /app

COPY --from=deps /app/node_modules /app/node_modules

ADD . .
RUN pnpm run build

# Finally, build the production image with minimal footprint
FROM base

ENV NODE_ENV=production

RUN mkdir /app
WORKDIR /app

COPY --from=production-deps /app/node_modules /app/node_modules
#My build goes to /app/server/build and i'm running /server/index.js express
COPY --from=build /app/server /app/server
COPY --from=build /app/public /app/public
ADD . .

CMD ["pnpm", "run", "start"]