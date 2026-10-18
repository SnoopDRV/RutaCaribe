# RutaCaribe

Route planner and mobility tool for Transcaribe in Cartagena de Indias.

## What It Does

RutaCaribe is a web application for planning point-to-point trips on the Transcaribe SITM system. It calculates the best line, estimated travel time, intermediate stops, recommended transfers, and corridor traffic status.

### Main Features

**Trip Planner (A → B)**
- Origin/destination selection with autocomplete
- GPS detection to find nearest station
- Instant route reversal
- Automatic calculation: recommended line, travel time, stops, next arrival, transfers
- Live navigation simulation

**Interactive Map**
- Leaflet.js with Stadia Maps tiles (Alidade Smooth) — OSM policy compliant
- Automatic fallbacks to OpenStreetMap France
- Vector routes colored by category (trunk, pre-trunk, feeder)
- Interactive markers for 33 stations

**Smart Route Highlighting**
- Auto-zoom to selected route
- Stations on route highlighted; others dimmed
- Quick filter chips (T101–T103, X101–X104, A101–A102)

**Station Inspector**
- Station details: corridor, sector, services
- Quick buttons to set as origin/destination
- Estimated arrivals and platform occupancy

**Route Directory**
- 8 routes categorized (Trunk, Pre-trunk, Feeder)
- Full stop sequences with "Load on map" button

**Official Schedules**
- Tables by day: Mon–Fri, Saturdays, Sundays/holidays
- "Plan" button per line opens map with route highlighted

## Architecture

Modular ES6 architecture with 13 JavaScript modules:

```
RutaCaribe/
├── index.html              # Main HTML (loads modules via <script src>)
├── RouteData.json          # Stations, routes, and schedules data
├── css/styles.css          # Leaflet customizations, marker styles
├── js/
│   ├── app.js              # Main entry point, initialization
│   ├── data/
│   │   └── route-data.js   # RouteData.json loader
│   ├── map/
│   │   ├── tile-config.js  # Tile layer providers & fallbacks
│   │   ├── map-init.js     # Leaflet init, station markers, network lines
│   │   └── route-filter.js # Route/station highlighting, layer toggles
│   ├── routing/
│   │   └── routing-engine.js  # A→B algorithm, direct + transfers
│   ├── ui/
│   │   ├── autocomplete.js    # Station search dropdowns
│   │   ├── planner-ui.js      # Trip result card, itinerary
│   │   └── station-card.js    # Station detail drawer
│   ├── views/
│   │   ├── directory-view.js  # Routes directory rendering
│   │   ├── schedules-view.js  # Schedules tables
│   │   └── view-switcher.js   # Main view navigation
│   └── utils/
│       └── theme.js           # Dark/light mode persistence
├── design/                   # Design assets (Stitch exports)
└── README.md
```

Dependencies load in order via `<script src="js/...">` (no build step, no bundler).

## Running Locally

A local web server is required (the app loads `RouteData.json` via `fetch()`, which doesn't work with `file://`).

```bash
# Python 3
python -m http.server 8080

# Node.js (npx)
npx serve

# PHP
php -S localhost:8080
```

Then open `http://localhost:8080` in your browser.

## Deployment

### GitHub Pages (Recommended)

1. Push the `main` branch to GitHub
2. Settings → Pages → Source: "Deploy from a branch"
3. Select `main` branch, `/ (root)` folder
4. Site available at `https://<username>.github.io/RutaCaribe/`

### Netlify / Vercel / Cloudflare Pages

Connect the repository, build command: *none*, output directory: *root*. These services serve static files correctly and handle HTTPS automatically.

### Custom Server

Any static file server works (nginx, Apache, Caddy). No server-side processing needed.

**Key requirement:** The server must serve `RouteData.json` with correct MIME type (`application/json`).

## Data Source

RouteData.json contains:
- 33 stations with coordinates, type, zone, and line associations
- 8 routes (3 trunk, 3 pre-trunk, 2 feeder) with stop sequences
- Schedules for 3 day types (weekday, Saturday, Sunday/holiday)

Data extracted from official Transcaribe public sources (2025/2026).

## Tools Used

- OpenCode — code agent for development and refactoring
- Stitch by Google — design system and UI component generation
- VS Code — primary editor
- Leaflet.js — map engine
- Tailwind CSS (via CDN) — utility-first styling
- Material Symbols — iconography

## License & Disclaimer

Independent civic project. No affiliation with Transcaribe S.A. or the Mayor's Office of Cartagena. Station names and brands used for informational purposes only.

No personal data collection, no tracking cookies, no registration required. Open source on GitHub.

---

## RutaCaribe (Español)

Planificador de rutas y movilidad para Transcaribe en Cartagena de Indias.

### Qué hace

RutaCaribe es una aplicación web para planear trayectos punto a punto en el SITM Transcaribe. Calcula la mejor línea, tiempo estimado, paradas intermedias, transbordos recomendados y estado del corredor.

### Funciones principales

**Planificador A → B**
- Selección de origen y destino con autocompletado
- Detección GPS para encontrar la estación más cercana
- Inversión instantánea de trayecto
- Cálculo automático: línea recomendada, tiempo de viaje, paradas, próximo arribo, transbordos
- Simulación de navegación en vivo

**Mapa interactivo**
- Leaflet.js con tiles de Stadia Maps (Alidade Smooth) — compatible con política OSM
- Fallbacks automáticos a OpenStreetMap France
- Rutas vectoriales coloreadas por categoría (troncal, pretroncales, alimentadoras)
- Marcadores interactivos para 33 estaciones

**Resaltado inteligente de rutas**
- Zoom automático a la ruta seleccionada
- Estaciones en la ruta se destacan; el resto se atenúan
- Filtro rápido por chips (T101–T103, X101–X104, A101–A102)

**Inspector de estación**
- Detalles: corredor, sector, servicios
- Botones rápidos para usar como origen/destino
- Próximos arribos estimados y ocupación de plataforma

**Directorio de rutas**
- 8 rutas categorizadas (Troncales, Pretroncales, Alimentadoras)
- Secuencia completa de paradas con botón "Cargar en el mapa"

**Horarios oficiales**
- Tablas por día: Lunes–Viernes, Sábados, Domingos y festivos
- Botón "Planear" por línea abre el mapa con la ruta resaltada

### Cómo ejecutar

**Se requiere un servidor web local** (la app carga `RouteData.json` vía `fetch()`, lo cual no funciona con `file://`).

```bash
# Python 3
python -m http.server 8080

# Node.js (npx)
npx serve

# PHP
php -S localhost:8080
```

Luego abre `http://localhost:8080` en el navegador.

### Estructura del proyecto

```
RutaCaribe/
├── index.html              # HTML principal (carga módulos con <script src>)
├── RouteData.json          # Datos de estaciones, rutas y horarios
├── css/styles.css          # Personalizaciones Leaflet, estilos de marcadores
├── js/
│   ├── app.js              # Punto de entrada, inicialización
│   ├── data/
│   │   └── route-data.js   # Cargador de RouteData.json
│   ├── map/
│   │   ├── tile-config.js  # Proveedores de tiles y fallbacks
│   │   ├── map-init.js     # Inicialización Leaflet, marcadores, red
│   │   └── route-filter.js # Resaltado de rutas/estaciones, capas
│   ├── routing/
│   │   └── routing-engine.js  # Algoritmo A→B, directo + transbordos
│   ├── ui/
│   │   ├── autocomplete.js    # Desplegables de búsqueda de estaciones
│   │   ├── planner-ui.js      # Tarjeta de resultado, itinerario
│   │   └── station-card.js    # Panel detalle de estación
│   ├── views/
│   │   ├── directory-view.js  # Renderizado directorio de rutas
│   │   ├── schedules-view.js  # Tablas de horarios
│   │   └── view-switcher.js   # Navegación principal entre vistas
│   └── utils/
│       └── theme.js           # Persistencia modo oscuro/claro
├── design/                   # Assets de diseño (exports de Stitch)
└── README.md
```

Las dependencias se cargan en orden mediante `<script src="js/...">` (sin paso de build, sin bundler).

### Despliegue

**GitHub Pages (Recomendado)**
1. Push a GitHub
2. Settings → Pages → Source: "Deploy from a branch"
3. Rama `main`, carpeta `/ (root)`
4. Disponible en `https://<usuario>.github.io/RutaCaribe/`

**Netlify / Vercel / Cloudflare Pages**
Conectar repositorio, comando de build: *ninguno*, directorio de salida: *root*. Estos servicios sirven archivos estáticos correctamente y manejan HTTPS automáticamente.

**Servidor personalizado**
Cualquier servidor de archivos estáticos (nginx, Apache, Caddy). No se requiere procesamiento del lado del servidor.

**Requisito clave:** El servidor debe servir `RouteData.json` con MIME type correcto (`application/json`).

### Herramientas utilizadas

- OpenCode — agente de código para desarrollo y refactorización
- Stitch by Google — sistema de diseño y generación de componentes UI
- VS Code — editor principal
- Leaflet.js — motor de mapas
- Tailwind CSS (vía CDN) — utilidades de estilo
- Material Symbols — iconografía

### Licencia y aviso

Proyecto cívico independiente. Sin afiliación a Transcaribe S.A. ni a la Alcaldía Mayor de Cartagena. Las marcas y nombres de estaciones se usan con fines informativos.

No recopila datos personales, no usa cookies de seguimiento, no requiere registro. Código abierto en GitHub.