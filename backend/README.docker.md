# Dockerización de la Aplicación Weather API

Este documento describe cómo dockerizar y ejecutar la aplicación Weather API utilizando Docker y Docker Compose.

## Requisitos previos

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)
- Node.js 20 (usamos esta versión en el contenedor)

## Estructura de archivos

La aplicación incluye los siguientes archivos para la dockerización:

- `Dockerfile`: Define cómo construir la imagen Docker de la aplicación usando Node.js 20
- `docker-compose.yml`: Define los servicios, redes y volúmenes
- `.dockerignore`: Especifica los archivos que no deben incluirse en la imagen Docker

## Configuración del entorno

1. Crea un archivo `.env` en la raíz del proyecto con el siguiente contenido:

```
# API Settings
NODE_ENV=development
PORT=3000

# Database Configuration
DATABASE_HOST=postgres
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=weather_db
DATABASE_LOGGING=true

# WeatherAPI Configuration
WEATHER_API_KEY=your_weather_api_key_here
WEATHER_API_URL=https://api.weatherapi.com/v1

# Cache Configuration
CACHE_TTL=3600000

# JWT Authentication
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRATION=3600
```

> **Importante**:
>
> - Reemplaza `your_weather_api_key_here` con tu clave API real de [WeatherAPI](https://www.weatherapi.com/)
> - Reemplaza `your_jwt_secret_here` con una clave secreta fuerte para JWT
> - Si tienes otras variables de entorno específicas de tu entorno local, agrégalas a este archivo

## Servicios disponibles

El archivo `docker-compose.yml` define los siguientes servicios:

1. **api**: La aplicación Weather API (NestJS con Node.js 20)
2. **postgres**: Base de datos PostgreSQL
3. **pgadmin**: Herramienta de administración web para PostgreSQL

## Ejecución

### Desarrollo

Para ejecutar la aplicación en modo desarrollo:

```bash
docker-compose up
```

Este comando:

- Construye la imagen de la aplicación si no existe
- Inicia todos los servicios definidos en el archivo docker-compose.yml
- Mapea el código fuente local a la imagen para habilitar la recarga en tiempo real

La API estará disponible en [http://localhost:3000](http://localhost:3000).

### Producción

Para ejecutar en modo producción:

1. Modifica el `docker-compose.yml` para usar la etapa de producción:

```yaml
api:
  build:
    context: .
    target: production
  command: node dist/main
```

2. Ejecuta:

```bash
docker-compose up -d
```

## Gestión de datos

### Base de datos PostgreSQL

- **Puerto**: 5432
- **Usuario**: postgres
- **Contraseña**: postgres
- **Base de datos**: weather_db

Los datos de PostgreSQL se almacenan en un volumen Docker para persistencia.

### PgAdmin

PgAdmin está disponible en [http://localhost:5050](http://localhost:5050)

- **Email**: admin@admin.com
- **Contraseña**: admin

Para conectar a la base de datos desde pgAdmin:

1. Añade un nuevo servidor
2. Nombre: weather_postgres
3. Host: postgres
4. Puerto: 5432
5. Usuario: postgres
6. Contraseña: postgres

## Comandos útiles

```bash
# Iniciar todos los servicios en segundo plano
docker-compose up -d

# Ver logs
docker-compose logs -f

# Detener todos los servicios
docker-compose down

# Reconstruir la imagen (después de cambios de dependencias)
docker-compose build

# Eliminar volúmenes (reset de datos)
docker-compose down -v
```
