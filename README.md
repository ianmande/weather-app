# Aplicación del Clima

Esta aplicación permite consultar el clima de diferentes ciudades, guardar favoritos y administrar usuarios.

## Estructura del Proyecto

El proyecto está dividido en dos partes principales:

- **Frontend**: Aplicación web desarrollada con React/Vite
- **Backend**: API REST desarrollada con NestJS

## Requisitos Previos

- Node.js v18 o superior
- npm o yarn
- PostgreSQL (para ejecución sin Docker)
- Docker y Docker Compose (para ejecución con Docker)

## Instrucciones de Instalación

### Con Docker

1. Clonar el repositorio:

   ```bash
   git clone <url-del-repositorio>
   cd weather-app
   ```

2. Crear un archivo `.env` en la carpeta `backend/` con las siguientes variables:

   ```
   JWT_SECRET=tu_secreto_jwt
   JWT_EXPIRES_IN=1d
   ```

3. Iniciar la aplicación con Docker Compose:

   ```bash
   docker-compose up -d
   ```

4. La aplicación estará disponible en:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - PgAdmin: http://localhost:5050 (Email: admin@admin.com, Contraseña: admin)

### Sin Docker

#### Backend

1. Navegar a la carpeta del backend:

   ```bash
   cd backend
   ```

2. Instalar dependencias:

   ```bash
   npm install
   ```

3. Crear un archivo `.env` con las siguientes variables:

   ```
   DATABASE_HOST=localhost
   DATABASE_PORT=5432
   DATABASE_USERNAME=tu_usuario
   DATABASE_PASSWORD=tu_contraseña
   DATABASE_NAME=weather_db
   JWT_SECRET=tu_secreto_jwt
   JWT_EXPIRES_IN=1d
   ```

4. Iniciar el servidor:
   ```bash
   npm run start:dev
   ```

#### Frontend

1. Navegar a la carpeta del frontend:

   ```bash
   cd frontend
   ```

2. Instalar dependencias:

   ```bash
   npm install
   ```

3. Crear un archivo `.env` con las siguientes variables:

   ```
   VITE_API_URL=http://localhost:3000
   ```

4. Iniciar la aplicación:
   ```bash
   npm run dev
   ```

## Cómo Funciona la Aplicación

### Estructura

La aplicación sigue una arquitectura de microservicios:

- **Frontend**: Interfaz de usuario desarrollada con React/Vite que permite a los usuarios consultar el clima, gestionar favoritos y autenticarse.
- **Backend**: API REST desarrollada con NestJS que se comunica con una API externa de clima y gestiona la base de datos.
- **Base de datos**: PostgreSQL para almacenar usuarios y ciudades favoritas.

### Decisiones de Diseño

- **Autenticación**: Se utiliza JWT para la autenticación de usuarios.
- **Arquitectura**: El backend sigue una arquitectura modular con principios SOLID.
- **Seguridad**: Endpoints protegidos con guardias de autenticación, excepto aquellos marcados como públicos.

### Manejo de Errores

- **Backend**: Utiliza filtros de excepciones para manejar errores HTTP.
- **Frontend**: Muestra mensajes de error amigables al usuario y maneja errores de red.

## Descripción de Endpoints del Backend

### Auth

| Método | Ruta                  | Descripción                              | Autenticación |
| ------ | --------------------- | ---------------------------------------- | ------------- |
| POST   | /auth/login           | Autenticación con email y contraseña     | No            |
| POST   | /auth/forgot-password | Solicitar restablecimiento de contraseña | No            |
| POST   | /auth/reset-password  | Restablecer contraseña con token         | No            |

### Usuarios

| Método | Ruta       | Descripción                | Autenticación |
| ------ | ---------- | -------------------------- | ------------- |
| POST   | /users     | Crear nuevo usuario        | No            |
| GET    | /users     | Obtener todos los usuarios | No            |
| GET    | /users/:id | Obtener usuario por ID     | Sí            |

### Clima

| Método | Ruta                     | Descripción                           | Autenticación |
| ------ | ------------------------ | ------------------------------------- | ------------- |
| GET    | /weather                 | Obtener datos del clima de una ciudad | No            |
| GET    | /weather/autocomplete    | Obtener sugerencias de ciudades       | No            |
| GET    | /weather/favorites       | Obtener lista de ciudades favoritas   | Sí            |
| POST   | /weather/favorites       | Agregar ciudad a favoritos            | Sí            |
| DELETE | /weather/favorites/:city | Eliminar ciudad de favoritos          | Sí            |

## Solución de Problemas

### Error de compilación de bcrypt

Si encuentras errores relacionados con la compilación de bcrypt durante la construcción de la imagen Docker, asegúrate de que el Dockerfile incluya las dependencias necesarias:

```dockerfile
# Instalar Python y dependencias necesarias para la compilación de módulos nativos
RUN apk add --no-cache python3 make g++ gcc
```

Este error suele ocurrir porque bcrypt necesita compilarse nativamente y requiere Python y herramientas de compilación.

### Errores de construcción en el frontend (Rollup en ARM64)

Si encuentras errores de construcción en el frontend, especialmente en arquitecturas ARM64 (M1/M2/M3), se ha implementado una solución robusta:

1. **Enfoque multi-etapa con NGINX**:
   - Usamos una construcción en dos etapas (build y producción)
   - La etapa de construcción instala solo lo mínimo necesario
   - Evitamos por completo los problemas de Rollup instalando solo lo esencial
   - Usamos NGINX como servidor web en lugar de serve o node para mayor eficiencia

```dockerfile
FROM node:20-alpine AS build

WORKDIR /app

# Copiar solo los archivos necesarios
COPY package.json ./
COPY public ./public
COPY index.html ./
COPY src ./src
COPY vite.config.ts ./
COPY tsconfig.json ./tsconfig.json

# Instalar solamente las dependencias mínimas necesarias para construir
RUN npm install -g vite@latest
RUN npm install react react-dom

# Construir sin verificación de tipos
RUN vite build --force

# Etapa de producción
FROM nginx:alpine

# Copiar los archivos compilados a NGINX
COPY --from=build /app/dist /usr/share/nginx/html
```

2. Esta estrategia:
   - Evita problemas de módulos nativos de Rollup
   - Reduce drásticamente el tamaño de la imagen
   - Proporciona mejor rendimiento con NGINX
   - Es más robusta para entornos de producción

### Problemas de conexión a la base de datos

Si el backend no puede conectarse a la base de datos, verifica:

1. Las variables de entorno están correctamente configuradas
2. La base de datos PostgreSQL está en ejecución
3. Los puertos están correctamente mapeados en el archivo docker-compose.yml

### Problemas de conexión entre frontend y backend

Si el frontend no puede conectarse al backend, asegúrate de que:

1. La variable de entorno `VITE_API_URL` está configurada correctamente
2. El backend está en ejecución y accesible
3. Los puertos están correctamente mapeados en el archivo docker-compose.yml
