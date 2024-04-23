ARG PORT_ARG=4567
ARG HOST_ARG=0.0.0.0
ARG PREFIX_ARG=dynamodb

# Stage I [server-builder]
FROM node:16-alpine as server-builder

WORKDIR /usr/src/server
COPY ["./server/package.json", "./server/yarn.lock", "./"]
RUN yarn
COPY ./server ./
ENV NODE_ENV=production
RUN yarn build
RUN rm -rf node_modules
RUN yarn

# Stage II [app-builder]
FROM node:16-alpine as app-builder

ARG PREFIX_ARG
WORKDIR /usr/src/app
COPY ["./app/package.json", "./app/yarn.lock", "./"]
RUN yarn
COPY ./app ./
RUN sed -i "s/dynamodb/$PREFIX_ARG/g" .env.production
ENV NODE_ENV=production
RUN yarn build-only

# Stage III [dynamodb-dashboard]
FROM node:16-alpine

ARG HOST_ARG
ARG PORT_ARG
ARG PREFIX_ARG

ENV PORT=$PORT_ARG
ENV HOST=$HOST_ARG
ENV PREFIX=$PREFIX_ARG

WORKDIR /usr/dynamodb-dashboard

COPY --from=server-builder /usr/src/server/yarn.lock ./
COPY --from=server-builder /usr/src/server/package.json ./
COPY --from=server-builder /usr/src/server/build ./build
COPY --from=server-builder /usr/src/server/node_modules ./node_modules
COPY --from=app-builder /usr/src/app/dist ./build/public

EXPOSE $PORT
CMD ["sh", "-c", "node build/bin/cli.js start --prefix=$PREFIX --port=$PORT --host=$HOST -d"]

