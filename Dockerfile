FROM node:7.10.0-onbuild
MAINTAINER Nick Chan <nick.ccm1122@gmail.com>

COPY . /usr/src/app
WORKDIR /usr/src/app