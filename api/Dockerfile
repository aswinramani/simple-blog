# api dockerfile
FROM node:14

WORKDIR /app

COPY nestjs-backend/package*.json ./

RUN npm install

COPY nestjs-backend/. .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]