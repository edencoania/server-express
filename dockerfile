FROM node
WORKDIR /app

ARG ENV_FILE=local.env

COPY $NODE_ENV_FILE /app/.env

COPY package.json /app/package.json
RUN npm install

COPY . /app
ENV NODE_ENV $ENV_FILE

CMD npm start
