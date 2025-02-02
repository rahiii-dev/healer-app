FROM node:21-alpine

WORKDIR /app

COPY src/package*.json ./

RUN npm install --omit=dev

COPY . .

EXPOSE 5000

CMD ["node", "src/server.js"]
