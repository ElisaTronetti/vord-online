FROM node:lts-alpine as base
WORKDIR /app

FROM base as node_modules
COPY package.json .
COPY package-lock.json .
RUN npm ci

FROM base as build
COPY package.json .
COPY package-lock.json .
COPY --from=node_modules /app/node_modules /app/node_modules
COPY public public
COPY src src
ARG REACT_APP_SERVER=http://localhost:3001
RUN npm run build

FROM base as production
RUN npm i -g serve
COPY --from=build /app/build /app
CMD ["serve", "-s", ".", "-n"]
