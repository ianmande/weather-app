# Etapa de construcción
FROM node:20-alpine AS builder
WORKDIR /app

# Copiar archivos de dependencias
COPY package.json package-lock.json ./

# Instalar dependencias sin opcionales para evitar binarios nativos de Rollup
RUN npm ci --omit=optional

# Copiar el resto del código fuente
COPY . .

# Construir la aplicación
RUN npm run build

# Etapa de producción
FROM node:20-alpine AS runner
WORKDIR /app

# Instalar 'serve' para servir archivos estáticos
ENV NODE_ENV=production
RUN npm install -g serve

# Copiar archivos compilados desde la etapa 'builder'
COPY --from=builder /app/dist ./dist

# Configurar puerto y comando de inicio
ENV PORT=3000
EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
