FROM node:buster

WORKDIR /oasis-discord-bot

COPY ["package.json", "yarn.lock", ".yarnrc.yml", "./"]

ADD .yarn /oasis-discord-bot/.yarn

RUN yarn

COPY . .

CMD ["yarn", "start"]
