FROM node:20-bookworm-slim
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev
COPY . .

RUN mkdir -p uploads
EXPOSE 3000

CMD ["sh", "-c", "node crearTablas.js && node app.js"]
