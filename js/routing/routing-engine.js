/**
 * Routing Engine
 * A→B algorithm with direct routes and transfers
 */

import { STATIONS, SYSTEM_ROUTES } from '../data/route-data.js';
import { map, activePathPolyline, activeOriginMarker, activeDestMarker, simulatedBusMarker } from '../map/map-init.js';

export let currentOrigin = '';
export let currentDest = '';
export let navigationSimulationInterval = null;

function calculateAndDisplayRoute(origName, destName) {
  if (!origName || !destName || origName === destName) return;

  const orig = STATIONS[origName];
  const dest = STATIONS[destName];
  if (!orig || !dest) return;

  let directRoute = null;
  let minStops = 999;
  let orderedStopNames = [];

  for (const [code, r] of Object.entries(SYSTEM_ROUTES)) {
    const idxA = r.stops.indexOf(origName);
    const idxB = r.stops.indexOf(destName);

    if (idxA !== -1 && idxB !== -1) {
      const stopsDiff = Math.abs(idxB - idxA);
      if (stopsDiff < minStops) {
        minStops = stopsDiff;
        directRoute = r;
        if (idxA < idxB) {
          orderedStopNames = r.stops.slice(idxA, idxB + 1);
        } else {
          orderedStopNames = r.stops.slice(idxB, idxA + 1).reverse();
        }
      }
    }
  }

  let routeResult = null;

  if (directRoute) {
    const passesBazurto = orderedStopNames.includes('Bazurto');
    const delayBonus = passesBazurto ? 6 : 0;
    const totalMinutes = Math.round(minStops * 1.9 + 2 + delayBonus);

    routeResult = {
      isDirect: true,
      routeCode: directRoute.code,
      routeColor: directRoute.color,
      routeName: directRoute.name,
      stopsCount: minStops,
      estimatedMinutes: totalMinutes,
      freq: directRoute.freq,
      nextArrival: Math.floor(Math.random() * 4) + 2 + ' min',
      stops: orderedStopNames,
      hasDelay: passesBazurto
    };
  } else {
    const hubs = ['Patio Portal', 'Cuatro Vientos', 'Bazurto', 'Chambacú', 'Centro'];
    let bestHub = null;
    let leg1Route = null, leg2Route = null;
    let bestTotalStops = 999;

    for (const hub of hubs) {
      if (hub === origName || hub === destName) continue;
      
      let r1 = Object.values(SYSTEM_ROUTES).find(r => r.stops.includes(origName) && r.stops.includes(hub));
      let r2 = Object.values(SYSTEM_ROUTES).find(r => r.stops.includes(hub) && r.stops.includes(destName));

      if (r1 && r2) {
        const stops1 = Math.abs(r1.stops.indexOf(hub) - r1.stops.indexOf(origName));
        const stops2 = Math.abs(r2.stops.indexOf(destName) - r2.stops.indexOf(hub));
        if (stops1 + stops2 < bestTotalStops) {
          bestTotalStops = stops1 + stops2;
          bestHub = hub;
          leg1Route = r1;
          leg2Route = r2;
        }
      }
    }

    if (bestHub) {
      const idxA = leg1Route.stops.indexOf(origName);
      const idxH1 = leg1Route.stops.indexOf(bestHub);
      const part1 = (idxA < idxH1) ? leg1Route.stops.slice(idxA, idxH1) : leg1Route.stops.slice(idxH1 + 1, idxA + 1).reverse();

      const idxH2 = leg2Route.stops.indexOf(bestHub);
      const idxB = leg2Route.stops.indexOf(destName);
      const part2 = (idxH2 < idxB) ? leg2Route.stops.slice(idxH2, idxB + 1) : leg2Route.stops.slice(idxB, idxH2 + 1).reverse();

      orderedStopNames = [...part1, ...part2];
      const totalMinutes = Math.round(bestTotalStops * 2.0 + 5);

      routeResult = {
        isDirect: false,
        routeCode: `${leg1Route.code} ➔ ${leg2Route.code}`,
        routeColor: '#f37021',
        routeName: `Transbordo en ${bestHub}`,
        stopsCount: bestTotalStops,
        estimatedMinutes: totalMinutes,
        freq: 'Cada 8 - 12 min',
        nextArrival: '3 min',
        stops: orderedStopNames,
        transferHub: bestHub,
        hasDelay: orderedStopNames.includes('Bazurto')
      };
    }
  }

  if (routeResult) {
    updatePlannerResultUI(routeResult);
    drawActiveRouteOnMap(routeResult);
  }
}

function drawActiveRouteOnMap(res) {
  if (!map) return;
  if (activePathPolyline) map.removeLayer(activePathPolyline);
  if (activeOriginMarker) map.removeLayer(activeOriginMarker);
  if (activeDestMarker) map.removeLayer(activeDestMarker);
  if (simulatedBusMarker) map.removeLayer(simulatedBusMarker);

  const pathCoords = res.stops
    .map(name => STATIONS[name] ? STATIONS[name].coords : null)
    .filter(c => c !== null);

  if (pathCoords.length > 1) {
    activePathPolyline = L.polyline(pathCoords, {
      color: '#f37021',
      weight: 7,
      opacity: 0.95,
      className: 'route-path-animated',
      lineCap: 'round',
      lineJoin: 'round'
    }).addTo(map);

    const iconA = L.divIcon({
      className: 'pin-a-wrapper',
      html: `<div class="station-marker-pin is-selected-a text-white font-extrabold text-[12px] flex items-center justify-center">A</div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });
    activeOriginMarker = L.marker(pathCoords[0], { icon: iconA, zIndexOffset: 1000 }).addTo(map);
    activeOriginMarker.bindTooltip(`<strong>Origen (A):</strong> ${res.stops[0]}`, { permanent: false, direction: 'top' });

    const iconB = L.divIcon({
      className: 'pin-b-wrapper',
      html: `<div class="station-marker-pin is-selected-b text-white font-extrabold text-[12px] flex items-center justify-center">B</div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });
    activeDestMarker = L.marker(pathCoords[pathCoords.length - 1], { icon: iconB, zIndexOffset: 1000 }).addTo(map);
    activeDestMarker.bindTooltip(`<strong>Destino (B):</strong> ${res.stops[res.stops.length - 1]}`, { permanent: false, direction: 'top' });

    map.fitBounds(activePathPolyline.getBounds(), {
      padding: [70, 70],
      maxZoom: 15
    });
  }
}

export function getCurrentOrigin() {
  return currentOrigin;
}

export function getCurrentDest() {
  return currentDest;
}

export function setCurrentOrigin(origin) {
  currentOrigin = origin;
}

export function setCurrentDest(dest) {
  currentDest = dest;
}

export function calculateRoute(origName, destName) {
  calculateAndDisplayRoute(origName, destName);
}

export function clearActiveRoute() {
  if (activePathPolyline) map.removeLayer(activePathPolyline);
  if (activeOriginMarker) map.removeLayer(activeOriginMarker);
  if (activeDestMarker) map.removeLayer(activeDestMarker);
  if (simulatedBusMarker) map.removeLayer(simulatedBusMarker);
  activePathPolyline = null;
  activeOriginMarker = null;
  activeDestMarker = null;
  simulatedBusMarker = null;
}

export function startNavigationSimulation() {
  const btn = document.getElementById('btn-iniciar-guia');
  const btnText = document.getElementById('btn-guia-text');

  if (navigationSimulationInterval) {
    clearInterval(navigationSimulationInterval);
    navigationSimulationInterval = null;
    if (simulatedBusMarker) map.removeLayer(simulatedBusMarker);
    btnText.textContent = 'Iniciar Guía';
    btn.classList.remove('from-emerald-600', 'to-emerald-700');
    return;
  }

  btnText.textContent = 'En Ruta...';
  btn.classList.add('from-emerald-600', 'to-emerald-700');

  const orig = STATIONS[currentOrigin];
  const dest = STATIONS[currentDest];
  if (!orig || !dest) return;

  const busIcon = L.divIcon({
    className: 'bus-sim-wrapper',
    html: `<div class="w-8 h-8 rounded-full bg-emerald-600 border-2 border-white shadow-xl flex items-center justify-center text-white animate-bounce"><span class="material-symbols-outlined text-[18px]">directions_bus</span></div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16]
  });

  simulatedBusMarker = L.marker(orig.coords, { icon: busIcon, zIndexOffset: 2000 }).addTo(map);

  let step = 0;
  const totalSteps = 25;
  navigationSimulationInterval = setInterval(() => {
    step++;
    if (step > totalSteps) {
      clearInterval(navigationSimulationInterval);
      navigationSimulationInterval = null;
      btnText.textContent = '¡Llegaste!';
      setTimeout(() => {
        btnText.textContent = 'Iniciar Guía';
        btn.classList.remove('from-emerald-600', 'to-emerald-700');
        if (simulatedBusMarker) map.removeLayer(simulatedBusMarker);
      }, 3000);
      return;
    }

    const lat = orig.coords[0] + (dest.coords[0] - orig.coords[0]) * (step / totalSteps);
    const lng = orig.coords[1] + (dest.coords[1] - orig.coords[1]) * (step / totalSteps);
    simulatedBusMarker.setLatLng([lat, lng]);
    map.panTo([lat, lng], { animate: true, duration: 0.5 });
  }, 700);
}