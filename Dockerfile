# syntax=docker/dockerfile:1

# Build here and pull down all the devDependencies
FROM node:18 AS builder
ARG NODE_OPTIONS="--max_old_space_size=5120"
WORKDIR /app
COPY . .
RUN yarn install
# If a local yarn script for build exists, use that override. Otherwise, use the default.
RUN if yarn run | yarn run | awk '{print $3}'| grep -q "^build$"; then yarn build; else yarn xy build; fi

# Just install the production dependencies here
FROM node:18 AS dependencies
WORKDIR /app
COPY . .
RUN yarn workspaces focus --production

# Copy over the compiled output & production dependencies
# into puppeteer container
FROM node:18-alpine as server
ENV PORT="80"
WORKDIR /app
ENV SDK_META_SERVER_DIR="./node_modules/@xylabs/meta-server"

# Install puppeteer
# https://github.com/puppeteer/puppeteer/blob/main/docs/troubleshooting.md#running-on-alpine
# Install Chromium package.
RUN apk add --no-cache \
  chromium \
  nss \
  freetype \
  harfbuzz \
  ca-certificates \
  ttf-freefont

# Tell Puppeteer to skip installing Chrome. We'll be using the installed package.
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# Copy over the meta-server to run the app
COPY --from=dependencies /app/node_modules ./node_modules

# Use Node to read in the package.json and determine the Node output dist dir
RUN SDK_META_SERVER_DIST_DIR_RELATIVE=$(node -p "path.dirname(require('${SDK_META_SERVER_DIR}/package').exports['.'].node.require.default)") \
  && SDK_META_SERVER_DIST_DIR=$(node -p "path.join('${SDK_META_SERVER_DIR}', '${SDK_META_SERVER_DIST_DIR_RELATIVE}')") \
  # create the expected destination directory
  && mkdir -p ${SDK_META_SERVER_DIST_DIR_RELATIVE} \
  # Copy over the node build files
  && cp -r ${SDK_META_SERVER_DIST_DIR}/. ${SDK_META_SERVER_DIST_DIR_RELATIVE}/

# Copy over the compiled static app
ARG BUILD_OUTPUT_DIR=build
COPY --from=builder /app/${BUILD_OUTPUT_DIR} ./bin/build

WORKDIR /app/bin

# Start the meta-server pointed to the static app
CMD ["node", "/app/node_modules/@xylabs/meta-server/dist/node/bin/start-meta.js"]
