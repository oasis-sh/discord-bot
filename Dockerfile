FROM node:alpine

WORKDIR /oasis-discord-bot

COPY ["package.json", "yarn.lock", ".yarnrc.yml", "./"]

ADD .yarn /oasis-discord-bot/.yarn

RUN apk update && \
    apk add --no-cache build-base gcc wget git alpine-sdk python3-dev cairo-dev jpeg-dev pango-dev giflib-dev font-noto-emoji ffmpeg libsodium imagemagick && \
    npm i -g typescript rimraf node-gyp pm2 && \
    yarn

COPY . .

CMD ["pm2-runtime", "dist/index.js"]
