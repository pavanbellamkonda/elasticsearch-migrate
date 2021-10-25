# FROM node:12-alpine as node12

# WORKDIR /code

# COPY package*.json ./

# RUN npm install

# COPY . .

# RUN npm run prod-build

# RUN npm run prod-build

# CMD [ "npm", "test" ]