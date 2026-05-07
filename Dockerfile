FROM node:20-alpine

WORKDIR /app

COPY server/package*.json ./
RUN npm install --production

COPY docs .
COPY server .

EXPOSE 3000

CMD ["node", "server.js"]

