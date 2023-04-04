# base node image
FROM node:gallium-bullseye-slim@sha256:0b889cbf70af3740c8caaee425be6a26f2e7f3ceffdb94a83b6d236eea1b421e as base
RUN npm i -g pnpm

# Install all node_modules, including dev dependencies
FROM base as deps
RUN mkdir /app
WORKDIR /app
ADD package.json pnpm-lock.yaml ./
RUN pnpm install

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
ADD package.json pnpm-lock.yaml ./
COPY --from=deps /app/node_modules /app/node_modules
COPY --from=build /app/build /app/build
COPY --from=build /app/public /app/public
COPY --from=build /app/public /app/public
CMD ["pnpm", "run", "start"]