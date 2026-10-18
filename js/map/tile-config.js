/**
 * Tile Layer Configuration
 * OSM-compliant tile providers with fallback chain
 */

const TILE_CONFIG = {
  // PRIMARY: Esri World Imagery - Satellite view (free, no API key, shows real Cartagena)
  esri: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
  },
  
  // FALLBACK 1: Stadia Maps Alidade Smooth (street view, compliant with OSM policy)
  stadia: {
    key: '', // Optional: 'YOUR_STADIA_API_KEY'
    styles: {
      smooth: 'alidade_smooth',
      smoothDark: 'alidade_smooth_dark',
      bright: 'osm_bright',
      outdoors: 'outdoors'
    },
    baseUrl: 'https://tiles.stadiamaps.com/tiles/{style}/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a> &copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  },
  
  // FALLBACK 2: OpenStreetMap France - HOT Humanitarian Style (donation-funded)
  osmfr: {
    hot: 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
    osmfr: 'https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png',
    cyclosm: 'https://{s}.tile.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles by <a href="https://www.openstreetmap.fr/">OpenStreetMap France</a>'
  },
  
  // FALLBACK 3: OpenTopoMap - Topográfico (free, no key needed)
  opentopo: {
    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://opentopomap.org/">OpenTopoMap</a> &copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }
};

window.TILE_CONFIG = TILE_CONFIG;