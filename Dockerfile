#####################################################################
# BUILD
#####################################################################
FROM node:16.13.1-alpine@sha256:a9b9cb880fa429b0bea899cd3b1bc081ab7277cc97e6d2dcd84bd9753b2027e1   as build-stage

ENV NODE_ENV=production
ENV BUILD_DIR=/opt/build/

COPY package.json package-lock.json ${BUILD_DIR}

WORKDIR /opt/build/
RUN npm ci --only=production

#####################################################################
# FINAL
#####################################################################
FROM node:16.13.1-alpine@sha256:a9b9cb880fa429b0bea899cd3b1bc081ab7277cc97e6d2dcd84bd9753b2027e1 as final

LABEL maintainer-email="hje.lloyd@gmail.com"
LABEL application=locate-user-node

ENV APP_NAME=locate-user-node
ENV APP_DIR=/opt/$APP_NAME
ENV NODE_ENV=production
ENV TZ=Europe/London

RUN apk add --no-cache tzdata

RUN mkdir -p $APP_DIR

COPY --chown=node:node --from=build-stage /opt/build/node_modules/ $APP_DIR/node_modules/
COPY --chown=node:node  src/ $APP_DIR/src/
COPY --chown=node:node package.json $APP_DIR/

WORKDIR $APP_DIR
USER node

EXPOSE 3000
CMD ["/usr/local/bin/node", "./src/main.js"]
