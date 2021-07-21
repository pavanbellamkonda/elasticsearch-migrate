FROM node:14.17.0-alpine3.11
WORKDIR /lib
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
CMD ["node", "./dist"]