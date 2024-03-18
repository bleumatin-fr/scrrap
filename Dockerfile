FROM node:18.18.2 AS build
ENV YARN_VERSION 1.22.19
ENV NODE_ENV=development

RUN apt-get update
RUN apt-get install -y gcc make build-essential

ADD . /app
WORKDIR /app
RUN yarn clean
RUN yarn global add node-gyp
RUN yarn install --frozen-lockfile
ENV NODE_ENV=production
RUN yarn build

FROM node:18.18.2-alpine
RUN apk upgrade libssl3 libcrypto3

WORKDIR /app

COPY --from=build /app/packages/server/dist /app

COPY --from=build /app/packages/admin/build /app/admin
COPY --from=build /app/packages/client/build /app/client
RUN yarn install --production --frozen-lockfile

COPY --from=build /app/packages/core/dist /app/node_modules/@scrrap/core

ENV ADMIN_PATH=/app/admin
ENV CLIENT_PATH=/app/client
ENV NODE_ENV=production
CMD ["node", "src/app.js"]