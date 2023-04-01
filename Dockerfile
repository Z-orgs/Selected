FROM node:lts-hydrogen

RUN mkdir /myapp

WORKDIR /myapp

ADD package.json /myapp/package.json

RUN npx yarn install

ADD . /myapp