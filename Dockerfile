FROM node:20-alpine3.18

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

EXPOSE 3000

CMD ["npm", "run", "build"]

CMD ["npm", "start", "-H 0.0.0.0"]
