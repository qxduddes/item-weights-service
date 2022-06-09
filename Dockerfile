FROM node:16
WORKDIR /home/node/app
COPY package.json .
RUN npm -v
RUN npm install
COPY . .