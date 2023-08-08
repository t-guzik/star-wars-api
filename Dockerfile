# https://gallery.ecr.aws/docker/library/node
ARG NODE_REPO="public.ecr.aws/docker/library/node"
ARG NODE_TAG="18.17.0-alpine3.17"

# System packages base
FROM ${NODE_REPO}:${NODE_TAG} as base
RUN apk update && \
    apk upgrade && \
    apk add dumb-init
WORKDIR /usr/src/app

# Development build
FROM base as NPM
RUN apk update && \
    apk upgrade && \
    apk add jq
ENV NODE_ENV="development"
COPY package*.json ./
RUN npm ci --legacy-peer-deps
COPY . ./
RUN npm run build && \
    mkdir -p /usr/src/app/runtime && \
    jq .version package.json -r > /usr/src/app/version.txt && \
    # Copy production requirements to "runtime" directory
    cp /usr/src/app/version.txt /usr/src/app/runtime/version.txt && \
    cp docker-entrypoint.sh /usr/src/app/runtime/docker-entrypoint.sh
ENTRYPOINT ["sh", "/usr/src/app/docker-entrypoint.sh"]
CMD ["dumb-init", "node", "dist/main.js"]

# Production npm dependencies
FROM base as prodDeps
WORKDIR /usr/src/deps
ENV NODE_ENV="production"
COPY package*.json ./
RUN npm ci --only=production --legacy-peer-deps

# Release build
FROM base as API
ENV NODE_ENV="production"
USER node
COPY --chown=node:node --from=NPM /usr/src/app/runtime/* /usr/src/app/
COPY --chown=node:node --from=prodDeps /usr/src/deps/node_modules /usr/src/app/node_modules
COPY --chown=node:node --from=NPM /usr/src/app/dist /usr/src/app/dist
ENTRYPOINT ["sh", "/usr/src/app/docker-entrypoint.sh"]
CMD ["dumb-init", "node", "dist/main.js"]
