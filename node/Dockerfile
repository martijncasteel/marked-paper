FROM node:alpine
ENV PORT 80

# set working directory and copy current directory to /app
WORKDIR /app
ADD . /app

RUN npm install #--only=production

EXPOSE 3000
ENTRYPOINT [ "node", "server.js"]
