FROM node:8-alpine
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package*.json ./
COPY ./ .
RUN npm install
EXPOSE 5000
CMD [ "npm", "start" ]