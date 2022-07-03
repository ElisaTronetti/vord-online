FROM node:alpine
COPY package.json .
COPY package-lock.json .
RUN npm install -g serve
RUN	npm install --silent
COPY . .
RUN npm run build

CMD ["serve", "-s", "build"]