# syntax=docker/dockerfile:1
# Build here and pull down all the devDependencies
FROM node:16 AS builder
WORKDIR /app
COPY . .
RUN yarn install
RUN yarn xy build

# Just install the production dependencies here
FROM node:16 AS dependencies
WORKDIR /app
COPY ./package.json ./package.json
COPY ./yarn.lock ./yarn.lock
RUN yarn install --production --immutable

# Copy over the compiled output and production dependencies
# into a slimmer container
FROM node:16-alpine as server
ENV PORT="80"
WORKDIR /app

ENV SDK_META_SERVER_DIR="./node_modules/@xylabs/meta-server"

# Copy over the meta-server to run the app
COPY --from=dependencies /app/node_modules ./node_modules

# Use Node to read in the package.json and determine the Node output dist dir
RUN SDK_META_SERVER_DIST_DIR_RELATIVE=$(node -p "path.dirname(require('${SDK_META_SERVER_DIR}/package').exports['.'].node.require)") \
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
CMD ["node", "/app/node_modules/@xylabs/meta-server/dist/cjs/bin/start-meta.js"]
