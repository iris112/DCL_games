#FROM node:13.8.0-alpine3.11
# node:10.3.0-alpine is on alpine 3.7.0
FROM node:10.3.0-alpine
LABEL maintainer="SFox <admin@sfoxdev.com>"

ARG CI=true

RUN apk add --no-cache bash git ca-certificates build-base python2 krb5-dev alpine-sdk libzmq py-zmq py2-zmq czmq czmq-dev;\
    apk add --upgrade --no-cache binutils bzip2 gnutls libressl libtasn1 musl openldap ;\
    rm -rf /var/cache/apk/*

WORKDIR /app

COPY package*.json ./

#RUN npm audit
RUN npm install

COPY . .
RUN npm build
#RUN npm test

#ENTRYPOINT ["/scripts/reconf.sh"]

#CMD ["npm", "start"]
