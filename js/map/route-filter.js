/**
 * Route Filter
 * Filter and highlight routes and stations on the map
 */

let selectedRouteFilter = 'ALL';

function selectRouteFilter(lineCode) {
  if (!map) return;
  selectedRouteFilter = lineCode;
  if (lineCode === 'ALL') {
    // Hide all route lines — keep map clean, show stations only
    for (const code in routePolylines) {
      routePolylines[code].layer.setStyle({ opacity: 0 });
    }
    updateStationMarkerHighlight('ALL');
    centrarEnCartagena();
  } else {
    // Show only the selected route's line; hide all others
    for (const code in routePolylines) {
      if (code === lineCode) {
        routePolylines[code].layer.setStyle({ opacity: 1, weight: 7, interactive: true });
        map.fitBounds(routePolylines[code].layer.getBounds(), { padding: [50, 50] });
      } else {
        routePolylines[code].layer.setStyle({ opacity: 0, interactive: false });
      }
    }
    updateStationMarkerHighlight(lineCode);
  }
}

function toggleRouteLayer(type) {
  if (!map) return;
  const btn = document.getElementById(`layer-${type}`);
  const isTroncal = type === 'troncal';
  const currentlyHidden = btn.classList.contains('opacity-40');

  for (const code in routePolylines) {
    const item = routePolylines[code];
    if ((isTroncal && item.category === 'TRONCAL') || (!isTroncal && item.category !== 'TRONCAL')) {
      // Toggle opacity: show (1) or hide (0) all lines of this category
      item.layer.setStyle({ opacity: currentlyHidden ? 1 : 0 });
    }
  }

  if (currentlyHidden) {
    btn.classList.remove('opacity-40');
  } else {
    btn.classList.add('opacity-40');
  }
}

// Expose globally for inline handlers
window.selectRouteFilter = selectRouteFilter;
window.toggleRouteLayer = toggleRouteLayer;