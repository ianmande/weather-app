# API de Clima (Weather API)

API REST que proporciona información del clima, autocompletado de ciudades y gestión de favoritos utilizando la [API de WeatherAPI](https://www.weatherapi.com/).

## Funcionalidades

- Consulta de datos del clima por ciudad
- Autocompletado de ciudades en función de un texto de búsqueda
- Gestión de ciudades favoritas (agregar, listar, eliminar)
- Autenticación de usuarios mediante JWT
- Caché de resultados para optimizar el rendimiento
- Persistencia de favoritos en base de datos PostgreSQL
- Manejo robusto de errores

## Endpoints

### Clima

- `GET /api/weather?city=...`: Devuelve datos del clima para la ciudad especificada

### Autocompletado

- `GET /api/weather/autocomplete?query=...`: Devuelve sugerencias de ciudades basadas en el texto de búsqueda

### Favoritos

- `GET /api/weather/favorites`: Obtiene la lista de ciudades favoritas
- `POST /api/weather/favorites`: Agrega una ciudad a favoritos
- `DELETE /api/weather/favorites/:city`: Elimina una ciudad de favoritos

### Autenticación

- `POST /api/auth/register`: Registra un nuevo usuario
- `POST /api/auth/login`: Inicia sesión y devuelve un token JWT
- `GET /api/auth/profile`: Obtiene el perfil del usuario autenticado
- `POST /api/auth/refresh`: Renueva el token JWT

### Usuarios

- `GET /api/users`: Lista todos los usuarios (solo administradores)
- `GET /api/users/:id`: Obtiene un usuario por ID
- `PATCH /api/users/:id`: Actualiza un usuario
- `DELETE /api/users/:id`: Elimina un usuario

## Requisitos previos

- Node.js (versión 20 o superior)
- PostgreSQL
- Yarn

## Configuración

1. Clona este repositorio
2. Instala las dependencias con `yarn install`
3. Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```
# API externa de clima
WEATHER_API_KEY=tu_api_key_aqui
WEATHER_API_URL=https://api.weatherapi.com/v1

# Base de datos (puedes usar cualquiera de estos formatos)
DATABASE_HOST=localhost          # o DB_HOST
DATABASE_PORT=5432               # o DB_PORT
DATABASE_USERNAME=postgres       # o DB_USERNAME
DATABASE_PASSWORD=postgres       # o DB_PASSWORD
DATABASE_NAME=weather_app        # o DB_NAME
DATABASE_SYNC=true               # o DB_SYNC
DATABASE_LOGGING=true            # o DB_LOGGING

# Configuración de caché
CACHE_TTL=3600000

# JWT (JSON Web Token)
JWT_SECRET=tu_secreto_aqui
JWT_EXPIRATION=3600
```

4. Asegúrate de tener PostgreSQL en ejecución y crea una base de datos llamada `weather_app`

## Ejecución

```bash
# Desarrollo
yarn start:dev

# Producción
yarn build
yarn start:prod
```

La API estará disponible en `http://localhost:3000/api` y la documentación Swagger en `http://localhost:3000/api/docs`.

## Docker

También puedes ejecutar la aplicación usando Docker:

```bash
# Construir e iniciar todos los servicios
docker-compose up

# Ejecutar en segundo plano
docker-compose up -d
```

Ver [README.docker.md](./README.docker.md) para más información sobre la configuración con Docker.

## Tests

El proyecto incluye pruebas unitarias completas para los componentes principales:

```bash
# Ejecutar todos los tests
yarn test

# Ejecutar tests específicos
yarn test src/modules/weather

# Tests con cobertura
yarn test:cov
```

Las pruebas cubren:

- Servicio de clima (`WeatherService`)
- Controlador de clima (`WeatherController`)
- Manejo de errores
- Caché y persistencia

## Estructura del proyecto

```
src/
├── modules/
│   ├── weather/           # Módulo de clima
│   │   ├── dtos/          # Data Transfer Objects
│   │   ├── interfaces/    # Interfaces y tipos
│   │   ├── models/        # Entidades TypeORM
│   │   ├── tests/         # Tests unitarios
│   │   ├── weather.controller.ts
│   │   ├── weather.module.ts
│   │   └── weather.service.ts
│   ├── auth/              # Módulo de autenticación
│   │   ├── dtos/
│   │   ├── guards/        # Guards de autenticación
│   │   ├── strategies/    # Estrategias Passport
│   │   ├── auth.controller.ts
│   │   ├── auth.module.ts
│   │   └── auth.service.ts
│   └── users/             # Módulo de usuarios
│       ├── dtos/
│       ├── entities/
│       ├── users.controller.ts
│       ├── users.module.ts
│       └── users.service.ts
├── common/                # Componentes compartidos
│   ├── decorators/        # Decoradores personalizados
│   ├── filters/           # Filtros de excepción
│   ├── guards/            # Guards de seguridad
│   ├── interceptors/      # Interceptores
│   └── services/          # Servicios comunes
├── config/                # Configuración
└── main.ts               # Punto de entrada
```

## Entidad FavoriteCity (Base de datos)

La aplicación guarda las ciudades favoritas en la tabla `favorite_cities` con la siguiente estructura:

| Campo     | Tipo      | Descripción                                                       |
| --------- | --------- | ----------------------------------------------------------------- |
| id        | UUID      | Identificador único                                               |
| city      | string    | Nombre de la ciudad                                               |
| country   | string    | País de la ciudad                                                 |
| region    | string    | Región de la ciudad (opcional)                                    |
| cityKey   | string    | Clave única de la ciudad (generalmente ciudad,país)               |
| userId    | string    | ID del usuario (opcional, para implementaciones de autenticación) |
| createdAt | timestamp | Fecha de creación                                                 |
| updatedAt | timestamp | Fecha de última actualización                                     |

## Tecnologías utilizadas

- NestJS: Framework backend
- TypeScript: Lenguaje de programación
- PostgreSQL: Base de datos relacional
- TypeORM: ORM para gestión de base de datos
- JWT: Autenticación basada en tokens
- Swagger: Documentación de API
- API de WeatherAPI: Proveedor de datos climáticos
- Cache Manager: Caché de resultados
- Jest: Framework de testing
- Docker: Contenedorización para desarrollo y despliegue
