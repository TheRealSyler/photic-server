FROM node:13-alpine

WORKDIR /home/node/

# COPY .env . set through heroku vars
COPY ./src .
COPY package.json .
COPY yarn.lock .
COPY tsconfig.json .

# EXPOSE ${PORT} // set by heroku

RUN yarn run init

CMD PORT=$PORT ts-node index.ts

USER node
