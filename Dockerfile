FROM node:18.12.1-alpine3.16

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

EXPOSE 3001

RUN chmod +x entrypoint.sh

ENTRYPOINT ["sh", "./entrypoint.sh"]
