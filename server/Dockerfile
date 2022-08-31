FROM node:lts-alpine as base
WORKDIR /app

FROM base as node_modules
COPY package.json .
COPY package-lock.json .
RUN npm ci

FROM base as production
COPY package.json .
COPY package-lock.json .
COPY --from=node_modules /app/node_modules /app/node_modules
COPY src src
COPY index.js .
CMD ["node", "index.js"]