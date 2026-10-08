# RutaCaribe

Route planner and mobility tool for Transcaribe in Cartagena de Indias.

## What it does

RutaCaribe is a web application for planning point-to-point trips on the Transcaribe SITM system. It calculates the best line, estimated travel time, intermediate stops, recommended transfers, and corridor traffic status.

### Main features

**Trip planner (A → B)**
- Origin/destination selection with autocomplete
- GPS detection to find nearest station
- Instant route reversal
- Automatic calculation: recommended line, travel time, stops, next arrival, transfers
- Live navigation simulation

**Interactive map**
- Leaflet.js with Stadia Maps tiles (Alidade Smooth) — OSM policy compliant
- Automatic fallbacks to OpenStreetMap France
- Vector routes colored by category (trunk, pre-trunk, feeder)
- Interactive markers for 33 stations

**Smart route highlighting**
- Auto-zoom to selected route
- Stations on route highlighted; others dimmed
- Quick filter chips (T101–T103, X101–X104, A101–A102)

**Station inspector**
- Station details: corridor, sector, services
- Quick buttons to set as origin/destination
- Estimated arrivals and platform occupancy

**Route directory**
- 8 routes categorized (Trunk, Pre-trunk, Feeder)
- Full stop sequences with "Load on map" button

**Official schedules**
- Tables by day: Mon–Fri, Saturdays, Sundays/holidays
- "Plan" button per line opens map with route highlighted

## How to run

**A local web server is required** (the app loads `RouteData.json` via `fetch()`, which doesn't work with `file://`).

```bash
# Python 3
python -m http.server 8080

# Node.js (npx)
npx serve

# PHP
php -S localhost:8080
```

Then open `http://localhost:8080` in your browser.

## Project structure

```
RutaCaribe/
├── index.html          # Complete application (single-file SPA)
├── RouteData.json      # Stations, routes, and schedules data
├── README.md           # This file
└── design/             # Design assets and Stitch exports
    └── stitch-exports/
        ├── 01-inicio/
        ├── 02-mapa-planificador/
        ├── 03-rutas-sistema/
        ├── 04-horarios-itinerarios/
        └── 05-sistema-operacional/
```

## Tools used

- **OpenCode** — code agent for development and refactoring
- **Stitch by Google** — design system and UI component generation
- **VS Code** — primary editor
- **Leaflet.js** — map engine
- **Tailwind CSS** (via CDN) — utility-first styling
- **Material Symbols** — iconography

## License & disclaimer

Independent civic project. No affiliation with Transcaribe S.A. or the Mayor's Office of Cartagena. Station names and brands used for informational purposes only.

No personal data collection, no tracking cookies, no registration required. Open source on GitHub.

---

# RutaCaribe

Planificador de rutas y movilidad para Transcaribe en Cartagena de Indias.

## Qué hace

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

## Cómo ejecutar

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

## Estructura del proyecto

```
RutaCaribe/
├── index.html          # Aplicación completa (SPA en un archivo)
├── RouteData.json      # Datos de estaciones, rutas y horarios
├── README.md           # Este archivo
└── design/             # Assets de diseño y exports de Stitch
    └── stitch-exports/
        ├── 01-inicio/
        ├── 02-mapa-planificador/
        ├── 03-rutas-sistema/
        ├── 04-horarios-itinerarios/
        └── 05-sistema-operacional/
```

## Herramientas utilizadas

- **OpenCode** — agente de código para desarrollo y refactorización
- **Stitch by Google** — sistema de diseño y generación de componentes UI
- **VS Code** — editor principal
- **Leaflet.js** — motor de mapas
- **Tailwind CSS** (vía CDN) — utilidades de estilo
- **Material Symbols** — iconografía

## Licencia y aviso

Proyecto cívico independiente. Sin afiliación a Transcaribe S.A. ni a la Alcaldía Mayor de Cartagena. Las marcas y nombres de estaciones se usan con fines informativos.

No recopila datos personales, no usa cookies de seguimiento, no requiere registro. Código abierto en GitHub.