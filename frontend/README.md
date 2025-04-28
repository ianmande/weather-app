# Weather App

Aplicación de pronóstico del tiempo que permite buscar el clima de ciudades en todo el mundo, guardar favoritos y ver información meteorológica detallada.

## Características

- 🔍 Búsqueda de ciudades con autocompletado
- 🌡️ Visualización de datos meteorológicos actuales
- 💾 Guardar ciudades favoritas
- 📱 Diseño responsive para móviles y escritorio
- historial de busqueda

## Tecnologías

- React + TypeScript
- Vite
- Tailwind CSS
- Shadcn/UI
- Vitest para testing

## Requisitos

- Node.js 20 o superior
- npm o yarn

## Instalación y ejecución local

1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd weather-app/frontend
```

2. Instalar dependencias

```bash
npm install
```

3. Ejecutar en modo desarrollo

```bash
npm run dev
```

4. Abrir en el navegador

```
http://localhost:5173
```

## Comandos disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run preview` - Vista previa de la versión de producción
- `npm run test` - Ejecuta los tests
- `npm run lint` - Ejecuta ESLint para verificar errores

## Dockerización

La aplicación puede ser fácilmente ejecutada en Docker:

1. Construir la imagen

```bash
docker-compose build
```

2. Iniciar el contenedor

```bash
docker-compose up
```

3. Acceder a la aplicación

```
http://localhost:5173
```

## Estructura de directorios

```
src/
├── assets/          # Recursos estáticos (imágenes, iconos)
├── components/      # Componentes reutilizables
│   ├── common/      # Componentes comunes (SearchBar, etc.)
│   └── ui/          # Componentes de UI básicos (shadcn)
├── context/         # Contextos de React
├── hooks/           # Custom hooks
├── interfaces/      # Tipos e interfaces TypeScript
├── services/        # Servicios para API
├── store/           # Estado global
└── screens/         # Pantallas de la aplicación
```

## API

La aplicación utiliza la API de WeatherAPI.com para obtener:

- Datos meteorológicos actuales
- Búsqueda y autocompletado de ciudades
- Auth y crear usuario
