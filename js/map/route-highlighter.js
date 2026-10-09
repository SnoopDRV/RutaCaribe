/**
 * Route Highlighter
 * Filter and highlight routes and stations on the map
 */

import { routePolylines, stationMarkers, map, STATIONS, SYSTEM_ROUTES, centrarEnCartagena } from './map-init.js';

export let selectedRouteFilter = 'ALL';

export function updateStationMarkerHighlight(routeCode) {
  if (!map) return;
  
  const routeStops = SYSTEM_ROUTES[routeCode]?.stops || [];
  const routeStopSet = new Set(routeStops);
  
  for (const [name, marker] of Object.entries(stationMarkers)) {
    const isOnRoute = routeStopSet.has(name);
    const isTerminal = marker.options.isTerminal;
    const baseColor = marker.options.baseColor;
    
    let iconHtml;
    if (routeCode === 'ALL' || routeCode === null) {
      iconHtml = `<div class="station-marker-pin ${isTerminal ? 'is-terminal' : ''}" style="background:${baseColor};"></div>`;
    } else if (isOnRoute) {
      iconHtml = `<div class="station-marker-pin ${isTerminal ? 'is-terminal' : ''} route-highlight" style="background:${baseColor};"></div>`;
    } else {
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

export function selectRouteFilter(lineCode) {
  if (!map) return;
  selectedRouteFilter = lineCode;
  if (lineCode === 'ALL') {
    for (const code in routePolylines) {
      routePolylines[code].layer.setStyle({ opacity: 0.65, weight: 4.5 });
    }
    updateStationMarkerHighlight('ALL');
    centrarEnCartagena();
  } else {
    for (const code in routePolylines) {
      if (code === lineCode) {
        routePolylines[code].layer.setStyle({ opacity: 1, weight: 7 });
        map.fitBounds(routePolylines[code].layer.getBounds(), { padding: [50, 50] });
      } else {
        routePolylines[code].layer.setStyle({ opacity: 0.15, weight: 2 });
      }
    }
    updateStationMarkerHighlight(lineCode);
  }
}

export function toggleRouteLayer(type) {
  if (!map) return;
  const btn = document.getElementById(`layer-${type}`);
  const isTroncal = type === 'troncal';
  
  for (const code in routePolylines) {
    const item = routePolylines[code];
    if ((isTroncal && item.category === 'TRONCAL') || (!isTroncal && item.category !== 'TRONCAL')) {
      if (map.hasLayer(item.layer)) {
        map.removeLayer(item.layer);
        btn.classList.add('opacity-40');
      } else {
        map.addLayer(item.layer);
        btn.classList.remove('opacity-40');
      }
    }
  }
}