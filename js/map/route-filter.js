/**
 * Route Filter
 * Filter and highlight routes and stations on the map
 */

let selectedRouteFilter = 'ALL';

function selectRouteFilter(lineCode) {
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

function toggleRouteLayer(type) {
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

// Expose globally for inline handlers
window.selectRouteFilter = selectRouteFilter;
window.toggleRouteLayer = toggleRouteLayer;