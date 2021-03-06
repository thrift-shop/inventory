FROM node:carbon-alpine

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app/
COPY package-lock.json /usr/src/app/
RUN npm install --production

# Bundle app source
COPY ./dist/ /usr/src/app/dist/

CMD node ./dist/server.js
