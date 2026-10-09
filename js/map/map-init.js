/**
 * Map Initialization
 * Leaflet map setup with fallback tile layers
 */

import { STATIONS, SYSTEM_ROUTES } from '../data/route-data.js';

export let map;
export let isMapInitialized = false;

export let stationMarkers = {};
export let routePolylines = {};
export let activePathPolyline = null;
export let activeOriginMarker = null;
export let activeDestMarker = null;
export let simulatedBusMarker = null;

const TILE_CONFIG = {
  esri: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
  },
  stadia: {
    key: '',
    styles: {
      smooth: 'alidade_smooth',
      smoothDark: 'alidade_smooth_dark',
      bright: 'osm_bright',
      outdoors: 'outdoors'
    },
    baseUrl: 'https://tiles.stadiamaps.com/tiles/{style}/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a> &copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  },
  osmfr: {
    hot: 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
    osmfr: 'https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png',
    cyclosm: 'https://{s}.tile.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles by <a href="https://www.openstreetmap.fr/">OpenStreetMap France</a>'
  },
  opentopo: {
    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://opentopomap.org/">OpenTopoMap</a> &copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }
};

function handleLayerError(layer, index, allLayers) {
  layer.on('tileerror', function(e) {
    console.warn(`Tile layer ${index} failed (${e.tile.src}), trying fallback ${index + 1}:`, e);
    if (map.hasLayer(layer)) {
      map.removeLayer(layer);
      const nextIndex = index + 1;
      if (nextIndex < allLayers.length) {
        allLayers[nextIndex].addTo(map);
        console.log(`Switched to fallback layer ${nextIndex}`);
      } else {
        showMapError('No se pudieron cargar los mapas base. Verifica tu conexión.');
      }
    }
  });
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

export function initMap() {
  if (isMapInitialized) return;
  isMapInitialized = true;

  const cartagenaCenter = [10.412, -75.515];
  
  map = L.map('gis-map-viewport', {
    center: cartagenaCenter,
    zoom: 13,
    zoomControl: false,
    attributionControl: false
  });

  const primaryLayer = L.tileLayer(TILE_CONFIG.esri.url, {
    maxZoom: 19,
    attribution: TILE_CONFIG.esri.attribution
  });

  const stadiaKey = TILE_CONFIG.stadia.key ? `?api_key=${TILE_CONFIG.stadia.key}` : '';
  const stadiaStyle = TILE_CONFIG.stadia.styles.smooth;
  const stadiaUrl = TILE_CONFIG.stadia.baseUrl
    .replace('{style}', stadiaStyle) + stadiaKey;
  
  const fallbackLayer1 = L.tileLayer(stadiaUrl, {
    maxZoom: 20,
    subdomains: ['a', 'b', 'c', 'd'],
    attribution: TILE_CONFIG.stadia.attribution
  });

  const fallbackLayer2 = L.tileLayer(TILE_CONFIG.osmfr.hot, {
    maxZoom: 19,
    subdomains: ['a', 'b', 'c'],
    attribution: TILE_CONFIG.osmfr.attribution + ' (Humanitarian Style)'
  });

  const fallbackLayer3 = L.tileLayer(TILE_CONFIG.osmfr.osmfr, {
    maxZoom: 19,
    subdomains: ['a', 'b', 'c'],
    attribution: TILE_CONFIG.osmfr.attribution + ' (OSMFR Style)'
  });

  const fallbackLayer4 = L.tileLayer(TILE_CONFIG.opentopo.url, {
    maxZoom: 19,
    subdomains: ['a', 'b', 'c'],
    attribution: TILE_CONFIG.opentopo.attribution
  });

  const allLayers = [primaryLayer, fallbackLayer1, fallbackLayer2, fallbackLayer3, fallbackLayer4];
  allLayers.forEach((layer, index) => handleLayerError(layer, index, allLayers));

  primaryLayer.addTo(map);

  drawNetworkLines();
  renderStationMarkers();
}

export function centrarEnCartagena() {
  if (map) map.flyTo([10.412, -75.515], 13, { duration: 1 });
}

export function drawNetworkLines() {
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

export function renderStationMarkers() {
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

    marker.options.stationName = name;
    marker.options.stationLines = station.lines || [];
    marker.options.baseColor = baseColor;
    marker.options.isTroncal = isTroncal;
    marker.options.isTerminal = isTerminal;

    stationMarkers[name] = marker;
  }
}

export function getMap() {
  return map;
}

export function setMap(newMap) {
  map = newMap;
}