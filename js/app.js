/**
 * RutaCaribe - Main Entry Point
 * Initializes all modules and starts the application
 */

import { loadRouteData } from './data/route-data.js';
import { switchMainView, startApp } from './views/view-switcher.js';
import { setupAutocomplete } from './ui/autocomplete.js';
import { initTheme } from './utils/theme.js';
import { selectRouteFilter } from './map/route-highlighter.js';
import { calculateRoute, setCurrentOrigin, setCurrentDest, clearActiveRoute, startNavigationSimulation } from './routing/routing-engine.js';
import { toggleDetalleParadas, clearRouteDisplay } from './ui/planner-ui.js';
import { dismissStationCard, setStationAsOrigin, setStationAsDest, planearConEstaEstacion } from './ui/station-card.js';
import { planearConRutaActiva } from './views/directory-view.js';
import { planearDesdeHorario } from './views/schedules-view.js';

// Make functions globally available for inline onclick handlers
window.switchMainView = switchMainView;
window.startApp = startApp;
window.selectRouteFilter = selectRouteFilter;
window.calculateAndDisplayRoute = calculateRoute;
window.setCurrentOrigin = setCurrentOrigin;
window.setCurrentDest = setCurrentDest;
window.clearActiveRoute = clearActiveRoute;
window.startNavigationSimulation = startNavigationSimulation;
window.toggleDetalleParadas = toggleDetalleParadas;
window.clearRouteDisplay = clearRouteDisplay;
window.dismissStationCard = dismissStationCard;
window.setStationAsOrigin = setStationAsOrigin;
window.setStationAsDest = setStationAsDest;
window.planearConEstaEstacion = planearConEstaEstacion;
window.planearConRutaActiva = planearConRutaActiva;
window.planearDesdeHorario = planearDesdeHorario;
window.centrarEnCartagena = () => {
  const map = document.getElementById('gis-map-viewport')._leaflet_map;
  if (map) map.flyTo([10.412, -75.515], 13, { duration: 1 });
};
window.toggleRouteLayer = (type) => {
  // Will be imported from route-highlighter
  import('./map/route-highlighter.js').then(m => m.toggleRouteLayer(type));
};

// Initialize autocomplete after DOM is ready
function initAutocomplete() {
  setupAutocomplete('input-origen', 'dropdown-origen', (selected) => {
    setCurrentOrigin(selected);
    const currentDest = document.getElementById('input-destino').value;
    if (currentDest) calculateRoute(selected, currentDest);
  });

  setupAutocomplete('input-destino', 'dropdown-destino', (selected) => {
    setCurrentDest(selected);
    const currentOrigin = document.getElementById('input-origen').value;
    if (currentOrigin) calculateRoute(currentOrigin, selected);
  });

  document.getElementById('btn-invert').addEventListener('click', () => {
    const temp = document.getElementById('input-origen').value;
    document.getElementById('input-origen').value = document.getElementById('input-destino').value;
    document.getElementById('input-destino').value = temp;
    const currentOrigin = document.getElementById('input-origen').value;
    const currentDest = document.getElementById('input-destino').value;
    setCurrentOrigin(currentOrigin);
    setCurrentDest(currentDest);
    if (currentOrigin && currentDest) calculateRoute(currentOrigin, currentDest);
  });

  document.getElementById('btn-gps').addEventListener('click', () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const userLat = pos.coords.latitude;
          const userLng = pos.coords.longitude;

          let closestStation = null;
          let minDist = 99999;

          import('./data/route-data.js').then(({ STATIONS }) => {
            for (const [name, st] of Object.entries(STATIONS)) {
              const d = Math.hypot(st.coords[0] - userLat, st.coords[1] - userLng);
              if (d < minDist) {
                minDist = d;
                closestStation = name;
              }
            }

            if (closestStation) {
              setCurrentOrigin(closestStation);
              document.getElementById('input-origen').value = closestStation;
              const currentDest = document.getElementById('input-destino').value;
              if (currentDest) calculateRoute(closestStation, currentDest);
            }
          });
        },
        (err) => {
          setCurrentOrigin('Patio Portal');
          document.getElementById('input-origen').value = 'Patio Portal';
          const currentDest = document.getElementById('input-destino').value;
          if (currentDest) calculateRoute('Patio Portal', currentDest);
        }
      );
    }
  });

  document.querySelectorAll('#quick-line-chips .line-chip').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#quick-line-chips .line-chip').forEach(b => {
        b.className = 'line-chip px-3 py-1 rounded-full bg-surface-container-lowest dark:bg-white/10 text-on-surface dark:text-gray-200 font-label-sm text-label-sm whitespace-nowrap border border-outline-variant/30 dark:border-white/10 hover:bg-surface-container';
      });
      btn.className = 'line-chip px-3 py-1 rounded-full bg-on-surface dark:bg-white text-surface-container-lowest dark:text-[#121a24] font-label-sm text-label-sm whitespace-nowrap font-bold shadow-sm';
      
      const line = btn.getAttribute('data-line');
      selectRouteFilter(line);
    });
  });
}

// Main initialization
window.addEventListener('DOMContentLoaded', async () => {
  await loadRouteData();
  initTheme();
  initAutocomplete();
  switchMainView('inicio');
});