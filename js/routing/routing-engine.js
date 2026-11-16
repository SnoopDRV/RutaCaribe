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
 * Each consecutive stop pair becomes a bidirectional edge weighted by route category.
 */
function buildGraph() {
  const graph = {};

  for (const [code, route] of Object.entries(SYSTEM_ROUTES)) {
    const category = route.category;
    const baseMinutes = CATEGORY_BASE_MINUTES[category] || 2.0;

    for (let i = 0; i < route.stops.length - 1; i++) {
      const a = route.stops[i];
      const b = route.stops[i + 1];
      const weight = baseMinutes;

      if (!graph[a]) graph[a] = [];
      if (!graph[b]) graph[b] = [];

      graph[a].push({ neighbor: b, routeCode: code, weight });
      graph[b].push({ neighbor: a, routeCode: code, weight });
    }
  }

  return graph;
}

/**
 * Run Dijkstra on the station graph with route-aware transfer penalties.
 * State: (station, lastRouteCode) — cost depends on which route we arrived on,
 * so switching routes incurs a transfer penalty.
 */
function findRoute(graph, origin, dest) {
  if (!graph[origin] || !graph[dest]) return null;

  const dist = {};
  const prev = {};
  const visited = new Set();

  const startKey = `${origin}|null`;
  dist[startKey] = 0;

  const pq = [{ station: origin, lastRoute: null, cost: 0 }];

  while (pq.length > 0) {
    // Extract min-cost entry (simple O(n) scan — fine for ~42 stations)
    let minIdx = 0;
    for (let i = 1; i < pq.length; i++) {
      if (pq[i].cost < pq[minIdx].cost) minIdx = i;
    }
    const { station, lastRoute, cost } = pq.splice(minIdx, 1)[0];

    const stateKey = `${station}|${lastRoute}`;
    if (visited.has(stateKey)) continue;
    visited.add(stateKey);

    if (station === dest) {
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

  return null;
}

/**
 * Reconstruct the path from the prev map and group consecutive stops into legs.
 * A new leg starts whenever the route changes (i.e., a transfer occurs).
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
 * Calculate and display a route from origin to destination.
 */
function calculateAndDisplayRoute(origName, destName) {
  if (!origName || !destName || origName === destName) return;

  const orig = STATIONS[origName];
  const dest = STATIONS[destName];
  if (!orig || !dest) return;

  const graph = buildGraph();
  const routeResult = findRoute(graph, origName, destName);

  if (routeResult) {
    updatePlannerResultUI(routeResult);
    if (map) drawActiveRouteOnMap(routeResult);
  }
}

/**
 * Draw all route legs on the map with per-leg colors and transfer station markers.
 */
function drawActiveRouteOnMap(res) {
  if (!map) return;
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
