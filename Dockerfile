FROM node:16-alpine

WORKDIR /app/client-terminal
COPY client-terminal/package*.json ./
RUN npm install
COPY --chown=node:node ./client-terminal ./

WORKDIR /app/pwa
COPY pwa/package*.json ./
RUN npm install
COPY --chown=node:node ./pwa ./
RUN npm run build

WORKDIR /app/server
COPY server/package*.json ./
RUN npm install
COPY --chown=node:node ./server ./

EXPOSE 3000

ENV HOST=0.0.0.0 PORT=3000 NODE_ENV=production

CMD ["npm", "start"]