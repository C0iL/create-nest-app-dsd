FROM node:lts-alpine

RUN mkdir /app

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH
ENV NODE_ENV prod

COPY package.json /app/package.json
COPY package-lock.json /app/package-lock.json

RUN npm ci

COPY . /app

RUN npm run build

CMD [ "node", "dist/main.js" ]