FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# Instalar serve globalmente
RUN npm install -g serve

EXPOSE 3000

# Iniciar serve cuando el contenedor arranque
CMD ["serve", "-s", "dist", "-l", "5173"] 