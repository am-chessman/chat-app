FROM node:latest

WORKDIR /chat-app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npx", "ts-node", "server.mts"]
