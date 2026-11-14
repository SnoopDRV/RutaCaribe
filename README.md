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
- Interactive markers for 42 stations

**Smart Route Highlighting**
- Auto-zoom to selected route
- Stations on route highlighted; others dimmed
- Quick filter chips for all 23 routes

**Station Inspector**
- Station details: corridor, sector, services
- Quick buttons to set as origin/destination
- Estimated arrivals and platform occupancy

**Station → Route Directory**
- Station-centric list showing which lines serve each stop
- Grouped by type: Trunk, Pre-trunk, Feeder, Complementary
- Set any station as origin/destination with one tap

**Official Schedules**
- Tables by day: Mon–Fri, Saturdays, Sundays/holidays
- "Plan" button per line opens map with route highlighted

## Architecture

Modular architecture with 14 JavaScript modules:

```
RutaCaribe/
├── index.html              # Main HTML (loads modules via <script src>)
├── RouteData.json          # Stations, routes, and schedules data
├── css/styles.css          # Leaflet customizations, marker styles
├── js/
│   ├── app.js              # Main entry point, initialization
│   ├── data/
│   │   ├── route-data.js   # RouteData.json loader + open data refresh
│   │   └── fetch-open-data.js  # ETL: fetches from Cartagena open data portal
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

Route data is sourced from the **Cartagena Municipal Open Data Portal** (`datosabiertos.cartagena.gov.co`), published by the Oficina Asesora de Informática of the Sistema Integrado de Transporte Masivo (Transcaribe) S.A.

### Open Data Datasets (CC-BY licensed)

| Dataset | Resource ID | Description | License |
|---------|-------------|-------------|---------|
| Rutas Transcaribe 2025 | `ab94769a-5f6b-41ad-a5ca-3a4ed8812edf` | 23 route codes, names, categories, schedules, descriptions | [CC-BY](http://opendefinition.org/licenses/cc-by) |
| Paraderos Transcaribe 2025 | `886f50a8-88f0-4e07-9b71-f5bbe4ae7daf` | 948 stop records with locations and route associations | [CC-BY](http://opendefinition.org/licenses/cc-by) |

Data is fetched programmatically via the portal's CKAN Datastore API (`fetch-open-data.js`) and merged with locally curated station coordinates in `RouteData.json`.

### RouteData.json contents

- **42 stations** — 33 with curated geographic coordinates (not available in open data), plus 9 additional stations from open data without coordinates
- **23 routes** — 8 with curated stop sequences (fully routable A→B), 15 with metadata only (schedules, category, description)
- **Schedules** for 3 day types: Lunes–Viernes, Sábados, Domingos/Festivos
- Route metadata (name, category, color, frequency, activation date, notes) sourced from the open data portal

Data extracted from official Transcaribe public sources (2025/2026). Updated annually (routes) and semiannually (stations) by the Alcaldía de Cartagena.

## Tools Used

- OpenCode — code agent for development and refactoring
- Stitch by Google — design system and UI component generation
- VS Code — primary editor
- Leaflet.js — map engine
- Tailwind CSS (via CDN) — utility-first styling
- Material Symbols — iconography

## License & Disclaimer

### Project Code
Independent civic project. Open source on GitHub. No personal data collection, no tracking cookies, no registration required.

### Data Attribution
Route and station data is sourced from the Cartagena Municipal Open Data Portal (`datosabiertos.cartagena.gov.co`), published under the **Creative Commons Attribution (CC-BY)** license by the Oficina Asesora de Informática, Sistema Integrado de Transporte Masivo (Transcaribe) S.A.

When using or redistributing RutaCaribe data, you must provide appropriate credit to:
- **Sistema Integrado de Transporte Masivo (Transcaribe) S.A.** — Cartagena, Bolívar, Colombia
- **Cartagena Municipal Open Data Portal** — `https://datosabiertos.cartagena.gov.co`
- **License:** CC-BY (Creative Commons Attribution)

### Affiliation Disclaimer
This is an independent civic project. It is **not affiliated with, endorsed by, or formally linked to** Transcaribe S.A., the Alcaldía Mayor de Cartagena, or its concessionaires. Station names, route codes, and brands are used for informational and citizen-orientation purposes only. This website does not process PQRS requests or sell tickets.

Route estimates and schedules are derived from published open data and may not reflect real-time service conditions. Always verify with official Transcaribe channels before traveling.

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
- Marcadores interactivos para 42 estaciones

**Resaltado inteligente de rutas**
- Zoom automático a la ruta seleccionada
- Estaciones en la ruta se destacan; el resto se atenúan
- Filtro rápido por chips para las 23 rutas

**Inspector de estación**
- Detalles: corredor, sector, servicios
- Botones rápidos para usar como origen/destino
- Próximos arribos estimados y ocupación de plataforma

**Directorio de paradas y rutas**
- Listado centrado en paradas que muestra qué líneas atienden cada parada
- Agrupadas por tipo: Troncales, Pretroncales, Alimentadoras, Complementarias
- Establecer cualquier parada como origen/destino con un toque

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
│   │   ├── route-data.js   # Cargador de RouteData.json + actualización de datos abiertos
│   │   └── fetch-open-data.js  # ETL: obtiene datos del portal abierto de Cartagena
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

### Fuente de datos

Los datos de rutas y paraderos provienen del **Portal de Datos Abiertos de la Alcaldía de Cartagena** (`datosabiertos.cartagena.gov.co`), publicados por la Oficina Asesora de Informática del Sistema Integrado de Transporte Masivo (Transcaribe) S.A.

#### Conjuntos de datos abiertos (licencia CC-BY)

| Conjunto de datos | ID del recurso | Descripción | Licencia |
|-------------------|----------------|-------------|----------|
| Rutas_Transcaribe 2025 | `ab94769a-5f6b-41ad-a5ca-3a4ed8812edf` | 23 códigos de rutas, nombres, categorías, horarios, descripciones | [CC-BY](http://opendefinition.org/licenses/cc-by) |
| Paradero_Transcaribe 2025 | `886f50a8-88f0-4e07-9b71-f5bbe4ae7daf` | 948 registros de paraderos con ubicaciones y asociaciones de rutas | [CC-BY](http://opendefinition.org/licenses/cc-by) |

Los datos se obtienen mediante programación a través de la API CKAN Datastore del portal (`fetch-open-data.js`) y se fusionan con coordenadas de estaciones curadas localmente en `RouteData.json`.

#### Contenido de RouteData.json

- **42 estaciones** — 33 con coordenadas geográficas curadas (no disponibles en datos abiertos), más 9 estaciones adicionales de datos abiertos sin coordenadas
- **23 rutas** — 8 con secuencias de paradas curadas (rutables A→B), 15 solo con metadatos (horarios, categoría, descripción)
- **Horarios** para 3 tipos de día: Lunes–Viernes, Sábados, Domingos/Festivos

Los datos se extraen de fuentes públicas oficiales de Transcaribe (2025/2026). Actualizados anualmente (rutas) y semestralmente (paraderos) por la Alcaldía de Cartagena.

### Licencia y aviso

#### Código del proyecto
Proyecto cívico independiente. Código abierto en GitHub. No se recopilan datos personales, no hay cookies de seguimiento, no se requiere registro.

#### Atribución de datos
Los datos de rutas y estaciones provienen del Portal de Datos Abiertos de Cartagena (`datosabiertos.cartagena.gov.co`), publicados bajo la licencia **Creative Commons Attribution (CC-BY)** por la Oficina Asesora de Informática, Sistema Integrado de Transporte Masivo (Transcaribe) S.A.

Al usar o redistribuir los datos de RutaCaribe, debe proporcionar el crédito correspondiente a:
- **Sistema Integrado de Transporte Masivo (Transcaribe) S.A.** — Cartagena, Bolívar, Colombia
- **Portal de Datos Abiertos de Cartagena** — `https://datosabiertos.cartagena.gov.co`
- **Licencia:** CC-BY (Creative Commons Attribution)

#### Exención de afiliación
Este es un proyecto cívico independiente. **No está afiliado, avalado ni vinculado formalmente con** Transcaribe S.A., la Alcaldía Mayor de Cartagena ni sus concesionarios de operación. Los nombres de estaciones, códigos de ruta y marcas se usan con fines informativos y de orientación al ciudadano. Esta web no tramita PQRS ni venta de pasajes.

Las estimaciones de rutas y horarios se derivan de datos abiertos publicados y pueden no reflejar las condiciones del servicio en tiempo real. Siempre verifique con los canales oficiales de Transcaribe antes de viajar.