FROM node:20-alpine AS development

# Crear directorio de la aplicación
WORKDIR /usr/src/app

# Copiar archivos de dependencias
COPY package*.json ./
COPY tsconfig*.json ./

# Instalar dependencias
RUN npm ci

# Copiar el código fuente
COPY . .

# Compilar la aplicación
RUN npm run build

# Etapa de producción
FROM node:20-alpine AS production

# Variables de entorno para producción
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

# Crear directorio de la aplicación
WORKDIR /usr/src/app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar solo dependencias de producción
RUN npm ci --only=production

# Copiar el código compilado desde la etapa de desarrollo
COPY --from=development /usr/src/app/dist ./dist

# Definir el comando para ejecutar la aplicación
CMD ["node", "dist/main"]

# Exponer el puerto en el que corre la aplicación
EXPOSE 3000 