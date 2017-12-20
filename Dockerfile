FROM mhart/alpine-node

WORKDIR /usr/src/app

COPY package.json .

RUN yarn

COPY . .
COPY .env_docker .env

EXPOSE 8080

CMD ["yarn", "start"]