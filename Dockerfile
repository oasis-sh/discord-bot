FROM node:alpine

WORKDIR /oasis-discord-bot

ENV NODE_ENV=production

COPY ["package.json", "yarn.lock", ".yarnrc.yml", "./"]

ADD .yarn /oasis-discord-bot/.yarn

RUN apk update && \
    apk add build-base gcc wget git alpine-sdk python3-dev cairo-dev jpeg-dev pango-dev giflib-dev font-noto-emoji && \
    npm i -g typescript rimraf && \
    yarn

COPY . .

CMD ["yarn", "start"]
