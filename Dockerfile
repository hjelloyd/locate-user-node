#####################################################################
# CREATE CERTS
#####################################################################
FROM alpine:latest@sha256:644fcb1a676b5165371437feaa922943aaf7afcfa8bfee4472f6860aad1ef2a0 as cert-creator

RUN apk add --no-cache openssl pwgen && \
        export CERT_PASS=$(pwgen -s 5 1) && \
        openssl genrsa -des3 -passout pass:$CERT_PASS -out self.pass.key 2048 && \
        openssl rsa -passin pass:$CERT_PASS -in self.pass.key -out self.key && \
        rm self.pass.key && \
        openssl req -new -key self.key -out self.csr \
        -subj "/C=GB/ST=Lancashire/L=Blackpool/O=PERSONAL/OU=PERSONAL/CN=LOCATOR" && \
        openssl x509 -req -days 365 -in self.csr -signkey self.key -out self.crt
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
ENV NODE_ENV=dev
ENV TZ=Europe/London
ENV NODE_EXTRA_CA_CERTS=/etc/ssl/self.crt

RUN apk add --no-cache tzdata

RUN mkdir -p $APP_DIR

COPY --chown=node:node --from=cert-creator self.crt self.key /etc/ssl/
COPY --chown=node:node --from=build-stage /opt/build/node_modules/ $APP_DIR/node_modules/
COPY --chown=node:node  src/ $APP_DIR/src/
COPY --chown=node:node package.json $APP_DIR/
COPY --chown=node:node  resources/ $APP_DIR/resources/

WORKDIR $APP_DIR
USER node

EXPOSE 3000
CMD ["/usr/local/bin/node", "./src/main.js"]
