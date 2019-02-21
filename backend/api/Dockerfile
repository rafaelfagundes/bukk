FROM node:latest
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json /usr/src/app/
RUN npm install
COPY . /usr/src/app
EXPOSE 4000
RUN unlink /etc/localtime
RUN ln -s /usr/share/zoneinfo/Brazil/East /etc/localtime
CMD ["npm", "start"]