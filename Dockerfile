FROM node:18.16.0-alpine

WORKDIR /app

#COPY package*.json ./

#COPY /app/data/alumnos.txt ./data

COPY . .

RUN npm install

EXPOSE 3000

CMD ["node", "/app/app/index_api.js"]

