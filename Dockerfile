FROM node:20-alpine3.18

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

EXPOSE 3000
RUN echo "API_URL=http://192.168.1.254:8000" > .env
RUN npm run build

CMD ["npm", "start", "-H0.0.0.0", "-p3000"]
