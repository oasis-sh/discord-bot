FROM node:alpine

WORKDIR /oasis-discord-bot

COPY ["package.json", "yarn.lock", ".yarnrc.yml", "./"]

ADD .yarn /oasis-discord-bot/.yarn

RUN apk update && \
    apk add --no-cache build-base gcc wget git alpine-sdk python3-dev cairo-dev jpeg-dev pango-dev giflib-dev font-noto-emoji ffmpeg libsodium && \
    npm i -g typescript rimraf && \
    yarn

COPY . .

CMD ["yarn", "start"]
