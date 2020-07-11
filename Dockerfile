FROM node:12-alpine

RUN mkdir /home/node/app
RUN chmod g+rwx /home/node/app
RUN addgroup node root
USER node

COPY dist/goove /home/node/app/dist/goove
WORKDIR /home/node/app

ENTRYPOINT ["node", "/home/node/app/dist/goove/server/main.js"]
