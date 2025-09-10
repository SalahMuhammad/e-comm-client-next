FROM node:20-alpine3.18

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

EXPOSE 3000

RUN npm run build

CMD ["npm", "start", "-H0.0.0.0", "-p3000"]
