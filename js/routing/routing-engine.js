/**
 * Routing Engine
 * Graph-based multi-leg route calculation using Dijkstra's algorithm
 * Supports direct routes, single transfers, and multi-leg journeys
 */

const TRANSFER_PENALTY_MINUTES = 5;

const CATEGORY_BASE_MINUTES = {
  TRONCAL: 1.9,
  PRETRONCAL: 2.2,
  ALIMENTADOR: 2.5,
  COMPLEMENTARIA: 3.0,
};

let currentOrigin = '';
let currentDest = '';
let activePathPolylines = [];
let activeOriginMarker = null;
let activeDestMarker = null;
let activeTransferMarkers = [];

/**
 * Build an adjacency graph from all system routes.
 */
function buildGraph() {
  const graph = {};
  let edgeCount = 0;

  for (const [code, route] of Object.entries(SYSTEM_ROUTES)) {
    const category = route.category;
    const baseMinutes = CATEGORY_BASE_MINUTES[category] || 2.0;

    if (!route.stops || route.stops.length < 2) {
      console.warn(`[Routing] Route ${code} has no valid stop sequence, skipping`);
      continue;
    }

    for (let i = 0; i < route.stops.length - 1; i++) {
      const a = route.stops[i];
      const b = route.stops[i + 1];
      const weight = baseMinutes;

      if (!graph[a]) graph[a] = [];
      if (!graph[b]) graph[b] = [];

      graph[a].push({ neighbor: b, routeCode: code, weight });
      graph[b].push({ neighbor: a, routeCode: code, weight });
      edgeCount++;
    }
  }

  console.log(`[Routing] Graph built: ${Object.keys(graph).length} stations, ${edgeCount} edges`);
  return graph;
}

/**
 * Run Dijkstra on the station graph with route-aware transfer penalties.
 */
function findRoute(graph, origin, dest) {
  console.log(`[Routing] findRoute: origin="${origin}", dest="${dest}"`);
  console.log(`[Routing] origin in graph: ${!!graph[origin]}, dest in graph: ${!!graph[dest]}`);

  if (!graph[origin] || !graph[dest]) {
    console.warn(`[Routing] Station not found in graph: ${!graph[origin] ? origin : ''} ${!graph[dest] ? dest : ''}`);
    return null;
  }

  const dist = {};
  const prev = {};
  const visited = new Set();

  const startKey = `${origin}|null`;
  dist[startKey] = 0;

  const pq = [{ station: origin, lastRoute: null, cost: 0 }];

  let iterations = 0;
  while (pq.length > 0) {
    iterations++;
    if (iterations > 10000) {
      console.error('[Routing] Dijkstra exceeded iteration limit, possible infinite loop');
      break;
    }

    let minIdx = 0;
    for (let i = 1; i < pq.length; i++) {
      if (pq[i].cost < pq[minIdx].cost) minIdx = i;
    }
    const { station, lastRoute, cost } = pq.splice(minIdx, 1)[0];

    const stateKey = `${station}|${lastRoute}`;
    if (visited.has(stateKey)) continue;
    visited.add(stateKey);

    if (station === dest) {
      console.log(`[Routing] Route found after ${iterations} iterations`);
      return reconstructPath(prev, station, lastRoute);
    }

    if (!graph[station]) continue;

    for (const edge of graph[station]) {
      const transferPenalty = lastRoute !== null && lastRoute !== edge.routeCode
        ? TRANSFER_PENALTY_MINUTES
        : 0;
      const newCost = cost + edge.weight + transferPenalty;
      const neighborKey = `${edge.neighbor}|${edge.routeCode}`;

      if (!dist[neighborKey] || newCost < dist[neighborKey]) {
        dist[neighborKey] = newCost;
        prev[neighborKey] = {
          prevStation: station,
          prevRoute: lastRoute,
          edgeRoute: edge.routeCode,
          neighbor: edge.neighbor,
        };
        pq.push({
          station: edge.neighbor,
          lastRoute: edge.routeCode,
          cost: newCost,
        });
      }
    }
  }

  console.warn(`[Routing] No route found after ${iterations} iterations`);
  return null;
}

/**
 * Reconstruct the path from the prev map and group consecutive stops into legs.
 */
function reconstructPath(prev, destStation, destRoute) {
  const path = [];
  let currentKey = `${destStation}|${destRoute}`;

  while (prev[currentKey]) {
    const entry = prev[currentKey];
    path.unshift({
      station: entry.neighbor,
      route: entry.edgeRoute,
    });
    currentKey = `${entry.prevStation}|${entry.prevRoute}`;
  }

  // Add origin station at the beginning
  path.unshift({
    station: currentKey.split('|')[0],
    route: null,
  });

  console.log(`[Routing] Path: ${path.map(p => `${p.station}(${p.route})`).join(' -> ')}`);

  // Group into legs: consecutive stops on the same route form one leg
  const legs = [];
  let currentLeg = null;

  for (let i = 0; i < path.length - 1; i++) {
    const step = path[i];
    const nextStep = path[i + 1];
    const routeCode = nextStep.route;

    if (!currentLeg || currentLeg.routeCode !== routeCode) {
      if (currentLeg) legs.push(currentLeg);
      currentLeg = {
        routeCode,
        routeName: routeCode ? SYSTEM_ROUTES[routeCode]?.name : '',
        color: routeCode ? SYSTEM_ROUTES[routeCode]?.color : '#9ca3af',
        from: step.station,
        to: nextStep.station,
        stops: [step.station],
      };
    }

    currentLeg.stops.push(nextStep.station);
    currentLeg.to = nextStep.station;
  }

  if (currentLeg) legs.push(currentLeg);

  // Calculate per-leg and total stats
  let totalMinutes = 0;
  let totalStops = 0;
  const transferStations = [];

  for (let i = 0; i < legs.length; i++) {
    const leg = legs[i];
    leg.stopsCount = leg.stops.length - 1;

    const category = SYSTEM_ROUTES[leg.routeCode]?.category;
    const baseMinutes = CATEGORY_BASE_MINUTES[category] || 2.0;
    leg.estimatedMinutes = Math.round(leg.stopsCount * baseMinutes + 2);

    // Add transfer penalty for legs after the first
    if (i > 0) {
      leg.estimatedMinutes += TRANSFER_PENALTY_MINUTES;
      transferStations.push(leg.from);
    }

    totalMinutes += leg.estimatedMinutes;
    totalStops += leg.stopsCount;
  }

  const isDirect = legs.length === 1;
  const transferHub = transferStations[0] || null;

  // Flatten stops without duplicating transfer stations
  const allStops = legs.flatMap((leg, idx) => (idx === 0 ? leg.stops : leg.stops.slice(1)));

  console.log(`[Routing] Result: ${legs.length} leg(s), ${totalStops} stops, ~${totalMinutes} min`);
  if (!isDirect) {
    console.log(`[Routing] Transfers at: ${transferStations.join(', ')}`);
  }

  return {
    isDirect,
    legs,
    transferCount: legs.length - 1,
    transferStations,
    transferHub,
    totalStops,
    totalMinutes,
    routeCode: isDirect ? legs[0]?.routeCode : legs.map(l => l.routeCode).join(' ➔ '),
    routeName: isDirect ? legs[0]?.routeName : `Transbordo en ${transferStations.join(' → ')}`,
    routeColor: isDirect ? legs[0]?.color : '#f37021',
    stops: allStops,
    freq: isDirect ? (legs[0]?.freq || 'N/D') : 'Varía por tramo',
    nextArrival: Math.floor(Math.random() * 4) + 2 + ' min',
    hasDelay: allStops.includes('Bazurto'),
  };
}

/**
 * Show a "no route found" message in the planner UI.
 */
function showNoRouteFound(origName, destName) {
  const card = document.getElementById('trip-result-card');
  const actions = document.getElementById('trip-action-buttons');
  const stepsList = document.getElementById('itinerary-steps-list');

  if (card) card.classList.remove('hidden');
  if (actions) {
    actions.classList.remove('hidden');
    actions.classList.add('grid');
  }

  document.getElementById('res-badge-line').textContent = '—';
  document.getElementById('res-trip-time').textContent = '—';
  document.getElementById('res-trip-stops').textContent = 'Sin ruta disponible';
  document.getElementById('res-next-arrival').textContent = '—';

  const directTag = document.getElementById('res-direct-tag');
  directTag.textContent = 'Sin conexión';
  directTag.className = 'text-xs text-error dark:text-red-400 font-bold';

  const delayBox = document.getElementById('res-delay-box');
  const delayText = document.getElementById('res-delay-text');
  delayBox.className = 'bg-error/15 dark:bg-red-950/40 border border-error/30 rounded px-2.5 py-1.5 flex items-center gap-2';
  delayText.innerHTML = `No hay ruta disponible entre <strong>${origName}</strong> y <strong>${destName}</strong> con los datos actuales.`;

  if (stepsList) {
    stepsList.innerHTML = `
      <div class="text-center py-4 text-on-surface-variant dark:text-gray-400 text-sm">
        Intenta seleccionar estaciones diferentes o revisa que ambas tengan coordenadas asignadas.
      </div>
    `;
  }

  document.getElementById('btn-paradas-text').textContent = 'Ver paradas';
}

/**
 * Calculate and display a route from origin to destination.
 */
function calculateAndDisplayRoute(origName, destName) {
  console.log(`[Routing] calculateAndDisplayRoute called: "${origName}" -> "${destName}"`);

  try {
    if (!origName || !destName || origName === destName) {
      console.warn('[Routing] Invalid origin/destination');
      return;
    }

    const orig = STATIONS[origName];
    const dest = STATIONS[destName];
    if (!orig || !dest) {
      console.warn(`[Routing] Station not found in STATIONS: ${!orig ? origName : ''} ${!dest ? destName : ''}`);
      showNoRouteFound(origName, destName);
      return;
    }

    console.log(`[Routing] Origin coords: [${orig.coords}], Dest coords: [${dest.coords}]`);

    const graph = buildGraph();
    const routeResult = findRoute(graph, origName, destName);

    if (routeResult) {
      console.log('[Routing] Route calculated successfully, updating UI');
      updatePlannerResultUI(routeResult);
      if (map) drawActiveRouteOnMap(routeResult);
    } else {
      console.warn('[Routing] No route found, showing error state');
      showNoRouteFound(origName, destName);
    }
  } catch (err) {
    console.error('[Routing] Unexpected error:', err);
    showNoRouteFound(origName, destName);
  }
}

/**
 * Draw all route legs on the map with per-leg colors and transfer station markers.
 */
function drawActiveRouteOnMap(res) {
  if (!map) {
    console.warn('[Routing] Map not initialized, skipping drawActiveRouteOnMap');
    return;
  }
  clearActiveRoute();

  // Draw a polyline for each leg using that leg's route color
  for (const leg of res.legs) {
    const pathCoords = leg.stops
      .map(name => STATIONS[name] ? STATIONS[name].coords : null)
      .filter(c => c !== null);

    if (pathCoords.length > 1) {
      const polyline = L.polyline(pathCoords, {
        color: leg.color,
        weight: 7,
        opacity: 0.95,
        className: 'route-path-animated',
        lineCap: 'round',
        lineJoin: 'round',
      }).addTo(map);
      activePathPolylines.push(polyline);
    } else {
      console.warn(`[Routing] Leg ${leg.routeCode} has insufficient coordinates for polyline`);
    }
  }

  // Origin marker (A)
  const firstLeg = res.legs[0];
  const firstStopCoords = STATIONS[firstLeg.from]?.coords;
  if (firstStopCoords) {
    const iconA = L.divIcon({
      className: 'pin-a-wrapper',
      html: `<div class="station-marker-pin is-selected-a text-white font-extrabold text-[12px] flex items-center justify-center">A</div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });
    activeOriginMarker = L.marker(firstStopCoords, { icon: iconA, zIndexOffset: 1000 }).addTo(map);
    activeOriginMarker.bindTooltip(`<strong>Origen (A):</strong> ${firstLeg.from}`, { permanent: false, direction: 'top' });
  }

  // Destination marker (B)
  const lastLeg = res.legs[res.legs.length - 1];
  const lastStopCoords = STATIONS[lastLeg.to]?.coords;
  if (lastStopCoords) {
    const iconB = L.divIcon({
      className: 'pin-b-wrapper',
      html: `<div class="station-marker-pin is-selected-b text-white font-extrabold text-[12px] flex items-center justify-center">B</div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });
    activeDestMarker = L.marker(lastStopCoords, { icon: iconB, zIndexOffset: 1000 }).addTo(map);
    activeDestMarker.bindTooltip(`<strong>Destino (B):</strong> ${lastLeg.to}`, { permanent: false, direction: 'top' });
  }

  // Transfer station markers
  for (const transferStation of res.transferStations) {
    const coords = STATIONS[transferStation]?.coords;
    if (!coords) continue;
    const iconT = L.divIcon({
      className: 'pin-transfer-wrapper',
      html: `<div class="station-marker-pin text-white font-extrabold text-[12px] flex items-center justify-center" style="background:#3b82f6; border:3px solid #ffffff;">T</div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });
    const marker = L.marker(coords, { icon: iconT, zIndexOffset: 900 }).addTo(map);
    marker.bindTooltip(`<strong>Transbordo:</strong> ${transferStation}`, { permanent: false, direction: 'top' });
    activeTransferMarkers.push(marker);
  }

  // Fit bounds to all polylines
  if (activePathPolylines.length > 0) {
    const group = L.featureGroup(activePathPolylines);
    map.fitBounds(group.getBounds(), { padding: [70, 70], maxZoom: 15 });
  }
}

function clearActiveRoute() {
  for (const polyline of activePathPolylines) {
    if (map) map.removeLayer(polyline);
  }
  activePathPolylines = [];
  if (activeOriginMarker && map) map.removeLayer(activeOriginMarker);
  if (activeDestMarker && map) map.removeLayer(activeDestMarker);
  for (const marker of activeTransferMarkers) {
    if (map) map.removeLayer(marker);
  }
  activeTransferMarkers = [];
  activeOriginMarker = null;
  activeDestMarker = null;
}

// Expose globally for inline handlers
window.currentOrigin = currentOrigin;
window.currentDest = currentDest;
window.calculateAndDisplayRoute = calculateAndDisplayRoute;
window.clearActiveRoute = clearActiveRoute;
window.setCurrentOrigin = (val) => { currentOrigin = val; };
window.setCurrentDest = (val) => { currentDest = val; };
window.getCurrentOrigin = () => currentOrigin;
window.getCurrentDest = () => currentDest;
window.showNoRouteFound = showNoRouteFound;
