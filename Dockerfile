FROM node:16.14-slim

RUN mkdir -p /usr/src/app/dist

WORKDIR /usr/src/app/dist

ENTRYPOINT [ "/bin/bash" ]