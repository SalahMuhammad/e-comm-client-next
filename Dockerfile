FROM node:20-alpine3.18

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Install the timezone data package using Alpine's package manager (apk)
RUN apk add --no-cache tzdata

# Set the timezone environment variable to Cairo, Egypt
# The 'TZ' variable is used by many programs and libraries to determine the local time.
ENV TZ="Africa/Cairo"

EXPOSE 3000
RUN echo "API_URL=http://192.168.1.254:8000" > .env
RUN npm run build

CMD ["npm", "start", "-H0.0.0.0", "-p3000"]
