FROM node:alpine

WORKDIR /oasis-discord-bot

COPY ["package.json", "yarn.lock", ".yarnrc.yml", "./"]

ADD .yarn /oasis-discord-bot/.yarn

RUN apk update && \
    apk add build-base gcc wget git alpine-sdk python3-dev && \
    yarn

COPY . .

CMD ["yarn", "start"]
