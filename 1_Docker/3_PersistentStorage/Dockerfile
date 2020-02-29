FROM node:10.0-alpine
COPY . /imgurApp
EXPOSE 3000
VOLUME /imgurApp/images
WORKDIR /imgurApp
RUN npm install
CMD npm start

