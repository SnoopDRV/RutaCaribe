/**
 * Map Initialization & Station Markers
 * Leaflet map setup with fallback tile layers
 */

let map;
let isMapInitialized = false;

let stationMarkers = {};
let routePolylines = {};
let activePathPolyline = null;
let activeOriginMarker = null;
let activeDestMarker = null;
let simulatedBusMarker = null;

/**
 * Initialize the Leaflet map with fallback tile layers
 */
function initMap() {
  if (isMapInitialized) return;
  isMapInitialized = true;

  const cartagenaCenter = [10.412, -75.515];
  
  map = L.map('gis-map-viewport', {
    center: cartagenaCenter,
    zoom: 13,
    zoomControl: false,
    attributionControl: false
  });

  // PRIMARY: Esri World Imagery (Satélite - muestra Cartagena real)
  const primaryLayer = L.tileLayer(TILE_CONFIG.esri.url, {
    maxZoom: 19,
    attribution: TILE_CONFIG.esri.attribution
  });

  // FALLBACK 1: Stadia Maps Alidade Smooth
  const stadiaKey = TILE_CONFIG.stadia.key ? `?api_key=${TILE_CONFIG.stadia.key}` : '';
  const stadiaStyle = TILE_CONFIG.stadia.styles.smooth;
  const stadiaUrl = TILE_CONFIG.stadia.baseUrl
    .replace('{style}', stadiaStyle) + stadiaKey;
  
  const fallbackLayer1 = L.tileLayer(stadiaUrl, {
    maxZoom: 20,
    subdomains: ['a', 'b', 'c', 'd'],
    attribution: TILE_CONFIG.stadia.attribution
  });

  // FALLBACK 2: OpenStreetMap France - HOT Humanitarian Style
  const fallbackLayer2 = L.tileLayer(TILE_CONFIG.osmfr.hot, {
    maxZoom: 19,
    subdomains: ['a', 'b', 'c'],
    attribution: TILE_CONFIG.osmfr.attribution + ' (Humanitarian Style)'
  });

  // FALLBACK 3: OpenStreetMap France - OSMFR Standard Style
  const fallbackLayer3 = L.tileLayer(TILE_CONFIG.osmfr.osmfr, {
    maxZoom: 19,
    subdomains: ['a', 'b', 'c'],
    attribution: TILE_CONFIG.osmfr.attribution + ' (OSMFR Style)'
  });

  // FALLBACK 4: OpenTopoMap
  const fallbackLayer4 = L.tileLayer(TILE_CONFIG.opentopo.url, {
    maxZoom: 19,
    subdomains: ['a', 'b', 'c'],
    attribution: TILE_CONFIG.opentopo.attribution
  });

  // FALLBACK CHAIN ERROR HANDLING
  const allLayers = [primaryLayer, fallbackLayer1, fallbackLayer2, fallbackLayer3, fallbackLayer4];
  let currentLayerIndex = 0;

  function handleLayerError(layer, index) {
    layer.on('tileerror', function(e) {
      console.warn(`Tile layer ${index} failed (${e.tile.src}), trying fallback ${index + 1}:`, e);
      if (map.hasLayer(layer)) {
        map.removeLayer(layer);
        currentLayerIndex = index + 1;
        if (currentLayerIndex < allLayers.length) {
          allLayers[currentLayerIndex].addTo(map);
          console.log(`Switched to fallback layer ${currentLayerIndex}`);
        } else {
          showMapError('No se pudieron cargar los mapas base. Verifica tu conexión.');
        }
      }
    });
  }

  allLayers.forEach(handleLayerError);

  // Start with Esri Satellite (primary)
  primaryLayer.addTo(map);

  drawNetworkLines();
  renderStationMarkers();
}

function showMapError(message) {
  const viewport = document.getElementById('gis-map-viewport');
  if (!viewport) return;
  
  const existingError = viewport.querySelector('.map-error-overlay');
  if (existingError) existingError.remove();
  
  const errorDiv = document.createElement('div');
  errorDiv.className = 'map-error-overlay absolute inset-0 flex items-center justify-center bg-red-50 dark:bg-red-950/30 z-50 p-4';
  errorDiv.innerHTML = `
    <div class="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md text-center shadow-xl border border-red-200 dark:border-red-800">
      <span class="material-symbols-outlined text-red-500 text-5xl mb-3 block">error</span>
      <h3 class="font-bold text-lg text-gray-900 dark:text-white mb-2">Error en el mapa</h3>
      <p class="text-gray-600 dark:text-gray-300 mb-4">${message}</p>
      <button onclick="this.closest('.map-error-overlay').remove()" class="px-4 py-2 bg-primary-container text-white rounded-lg font-bold hover:opacity-90">Entendido</button>
    </div>
  `;
  viewport.appendChild(errorDiv);
  
  setTimeout(() => errorDiv.remove(), 10000);
}

function centrarEnCartagena() {
  if (map) map.flyTo([10.412, -75.515], 13, { duration: 1 });
}

/**
 * Draw network route lines on the map
 */
function drawNetworkLines() {
  if (!SYSTEM_ROUTES || !STATIONS) return;
  
  for (const [code, route] of Object.entries(SYSTEM_ROUTES)) {
    const coords = route.stops
      .map(stopName => STATIONS[stopName] ? STATIONS[stopName].coords : null)
      .filter(c => c !== null);

    if (coords.length > 1) {
      const polyline = L.polyline(coords, {
        color: route.color,
        weight: route.category === 'TRONCAL' ? 5 : 3.5,
        opacity: 0.65,
        lineJoin: 'round'
      }).addTo(map);

      polyline.bindTooltip(`Línea ${route.code}: ${route.name}`, { sticky: true });
      polyline.on('click', () => {
        selectRouteFilter(code);
      });

      routePolylines[code] = {
        category: route.category,
        layer: polyline
      };
    }
  }
}

/**
 * Render station markers on the map
 */
function renderStationMarkers() {
  if (!STATIONS) return;
  
  for (const [name, station] of Object.entries(STATIONS)) {
    const isTroncal = station.type === 'troncal';
    const isTerminal = station.isTerminal;
    const baseColor = !isTroncal ? '#525f71' : '#f37021';

    const customIcon = L.divIcon({
      className: 'custom-station-wrapper',
      html: `<div class="station-marker-pin ${isTerminal ? 'is-terminal' : ''}" style="background:${baseColor};"></div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });

    const marker = L.marker(station.coords, { icon: customIcon }).addTo(map);

    marker.bindTooltip(`<strong>${station.name}</strong><br><span style="font-size:11px;color:#717a84;">${station.desc}</span>`, {
      direction: 'top',
      offset: [0, -10]
    });

    marker.on('click', () => {
      openStationDetailCard(station);
    });

    // Store station metadata for highlighting
    marker.options.stationName = name;
    marker.options.stationLines = station.lines || [];
    marker.options.baseColor = baseColor;
    marker.options.isTroncal = isTroncal;
    marker.options.isTerminal = isTerminal;

    stationMarkers[name] = marker;
  }
}

/**
 * Update station marker highlight based on selected route
 */
function updateStationMarkerHighlight(routeCode) {
  if (!map) return;
  
  const routeStops = SYSTEM_ROUTES[routeCode]?.stops || [];
  const routeStopSet = new Set(routeStops);
  
  for (const [name, marker] of Object.entries(stationMarkers)) {
    const isOnRoute = routeStopSet.has(name);
    const isTerminal = marker.options.isTerminal;
    const baseColor = marker.options.baseColor;
    
    let iconHtml;
    if (routeCode === 'ALL' || routeCode === null) {
      // Show all stations normally
      iconHtml = `<div class="station-marker-pin ${isTerminal ? 'is-terminal' : ''}" style="background:${baseColor};"></div>`;
    } else if (isOnRoute) {
      // Highlight stations on the selected route
      iconHtml = `<div class="station-marker-pin ${isTerminal ? 'is-terminal' : ''} route-highlight" style="background:${baseColor};"></div>`;
    } else {
      // Grey out stations not on the route
      iconHtml = `<div class="station-marker-pin ${isTerminal ? 'is-terminal' : ''} route-dimmed" style="background:#9ca3af; opacity:0.5;"></div>`;
    }
    
    const newIcon = L.divIcon({
      className: 'custom-station-wrapper',
      html: iconHtml,
      iconSize: isTerminal ? [28, 28] : [24, 24],
      iconAnchor: isTerminal ? [14, 14] : [12, 12]
    });
    
    marker.setIcon(newIcon);
  }
}

// Expose globally for inline handlers and other modules
window.initMap = initMap;
window.centrarEnCartagena = centrarEnCartagena;
window.drawNetworkLines = drawNetworkLines;
window.renderStationMarkers = renderStationMarkers;
window.updateStationMarkerHighlight = updateStationMarkerHighlight;
window.getMap = () => map;