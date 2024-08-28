# syntax=docker/dockerfile:1

# Define build-time arguments
ARG NODE_VERSION=22.4.1

# Build here and pull down all the devDependencies
FROM node:${NODE_VERSION} AS builder
ARG NODE_OPTIONS="--max_old_space_size=8192"
WORKDIR /app
COPY . .
RUN corepack enable
RUN corepack prepare
RUN yarn install
# If a local yarn script for build exists, use that override. Otherwise, use the default.
RUN if yarn run | yarn run | awk '{print $3}'| grep -q "^build$"; then yarn build; else yarn xy build; fi

# Just install the production dependencies here
FROM node:${NODE_VERSION} AS dependencies
WORKDIR /app
COPY . .
RUN corepack enable
RUN corepack prepare
RUN yarn workspaces focus --production

# Copy over the compiled output & production dependencies
# into puppeteer container
FROM node:${NODE_VERSION} AS server
WORKDIR /app
ENV PORT="80"
ENV SDK_META_SERVER_DIR="./node_modules/@xylabs/meta-server"
# Tell Puppeteer to skip installing Chrome. We'll be using the installed package.
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

# Start the meta-server pointed to the static app
CMD ["node", "/app/node_modules/@xylabs/meta-server/dist/node/bin/start-meta.mjs"]

# Install puppeteer
# https://github.com/puppeteer/puppeteer/blob/main/docs/troubleshooting.md#running-on-alpine
# Install Chromium package.
# Alpine version
# RUN apk add --no-cache \
#   ca-certificates \
#   chromium \
#   freetype \
#   harfbuzz \
#   nss \
#   ttf-freefont
RUN apt-get update && apt-get install -y --no-install-recommends \
  ca-certificates \
  chromium \
  fonts-freefont-ttf \
  fonts-ipafont-gothic \
  fonts-kacst \
  fonts-thai-tlwg \
  fonts-wqy-zenhei \
  libfreetype6 \
  libharfbuzz0b \
  libnss3 \
  libxss1 \
  && rm -rf /var/lib/apt/lists/*

# Copy over the meta-server to run the app
COPY --from=dependencies /app/node_modules ./node_modules

# Use Node to read in the package.json and determine the Node output dist dir
RUN SDK_META_SERVER_DIST_DIR_RELATIVE=$(node -p "path.dirname(require('${SDK_META_SERVER_DIR}/package').exports['.'].node.import.default)") \
  && SDK_META_SERVER_DIST_DIR=$(node -p "path.join('${SDK_META_SERVER_DIR}', '${SDK_META_SERVER_DIST_DIR_RELATIVE}')") \
  # create the expected destination directory
  && mkdir -p ${SDK_META_SERVER_DIST_DIR_RELATIVE} \
  # Copy over the node build files
  && cp -r ${SDK_META_SERVER_DIST_DIR}/. ${SDK_META_SERVER_DIST_DIR_RELATIVE}/

COPY --from=dependencies /app/package.json ./package.json
RUN corepack enable
RUN corepack prepare
COPY --from=dependencies /app/.yarn ./.yarn
COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=dependencies /app/yarn.lock ./yarn.lock
COPY --from=dependencies /root/.yarn /root/.yarn

# Copy over the compiled static app
ARG BUILD_OUTPUT_DIR=build
COPY --from=builder /app/${BUILD_OUTPUT_DIR} ./bin/build

WORKDIR /app/bin