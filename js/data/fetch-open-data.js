/**
 * Open Data ETL for RutaCaribe
 * Fetches Transcaribe routes and paraderos from the Cartagena open data portal
 * (CKAN datastore API) and merges them with locally curated station coordinates.
 *
 * Source: https://datosabiertos.cartagena.gov.co
 * License: CC-BY (Creative Commons Attribution)
 */

const CKAN_BASE = 'https://datosabiertos.cartagena.gov.co/api/3/action';
const ROUTES_RESOURCE_ID = 'ab94769a-5f6b-41ad-a5ca-3a4ed8812edf';
const PARADEROS_RESOURCE_ID = '886f50a8-88f0-4e07-9b71-f5bbe4ae7daf';

// Category mapping from open data "Tipo" to internal route categories
const CATEGORY_MAP = {
  TRONCAL: 'TRONCAL',
  PRETRONCALES: 'PRETRONCAL',
  ALIMENTADORAS: 'ALIMENTADOR',
  COMPLEMENTARIAS: 'COMPLEMENTARIA',
};

// Default colors by category (matching existing RouteData.json palette)
const CATEGORY_COLORS = {
  TRONCAL: '#f37021',
  PRETRONCAL: '#525f71',
  ALIMENTADOR: '#059669',
  COMPLEMENTARIA: '#7c3aed',
};

/**
 * Fetch all records from a CKAN datastore resource (handles pagination).
 */
async function fetchAllRecords(resourceId) {
  const records = [];
  let offset = 0;
  const limit = 100;

  while (true) {
    const url = `${CKAN_BASE}/datastore_search?resource_id=${resourceId}&limit=${limit}&offset=${offset}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`CKAN API error: ${response.status}`);
    const data = await response.json();
    if (!data.success) throw new Error('CKAN API returned success: false');

    const batch = data.result.records;
    records.push(...batch);

    if (batch.length < limit) break;
    offset += limit;
  }

  return records;
}

/**
 * Normalize an open-data route record into RouteData.json route format.
 */
function normalizeRoute(record) {
  const code = record.Codigo_Rutas?.trim();
  const category = CATEGORY_MAP[record.Tipo?.trim()] || 'COMPLEMENTARIA';
  const color = CATEGORY_COLORS[category];

  // Parse open-data schedule times into a readable string
  const lvStart = record['Horario_Lunes-Viernes_salida1'] || '';
  const lvEnd = record['Horario_Lunes-Viernes_salida2'] || '';
  const sabStart = record['Horario_sabado_Salida1'] || '';
  const sabEnd = record['Horario_sabado_Salida2'] || '';
  const domStart = record['Horario_Domingo-Festivos_Salida1'] || '';
  const domEnd = record['Horario_Domingo-Festivos_Salida2'] || '';

  const schedule = {
    lv: `${lvStart} - ${lvEnd}`.replace(' - ', ' - ').trim() || 'N/D',
    sab: `${sabStart} - ${sabEnd}`.trim() || 'N/D',
    dom: `${domStart} - ${domEnd}`.trim() || 'N/D',
  };

  // Derive a frequency label from the route type
  const freqMap = {
    TRONCAL: 'Cada 5 - 8 min',
    PRETRONCAL: 'Cada 10 - 15 min',
    ALIMENTADOR: 'Cada 10 - 12 min',
    COMPLEMENTARIA: 'Cada 15 - 20 min',
  };

  return {
    code,
    name: record.Nombre_Rutas?.trim() || code,
    category,
    typeLabel: record.Tipo?.trim() || category,
    color,
    freq: freqMap[category],
    schedule: schedule.lv || 'N/D',
    scheduleByDay: schedule,
    stops: [], // Populated separately from curated data / paraderos matching
    origen: record.Rutas?.split('-')[0]?.trim() || '',
    destino: record.Rutas?.split('-').pop()?.trim() || '',
    descripcion: record.Descripcion?.trim() || '',
    fechaActivacion: record.Fecha_Activacion || '',
    nota: record.Nota?.trim() || '',
    longitud: record.Longitud || '', // Route length in km (not coordinates)
  };
}

/**
 * Merge open-data routes with curated RouteData.json.
 * Existing stop sequences are preserved for routes that already have them.
 */
function mergeRoutes(openRoutes, curatedRoutes = {}) {
  const routes = { ...curatedRoutes };

  for (const route of openRoutes) {
    const normalized = normalizeRoute(route);

    // If we already have curated stop sequences for this route, keep them
    if (curatedRoutes[normalized.code]?.stops?.length > 0) {
      normalized.stops = curatedRoutes[normalized.code].stops;
    }

    // If curated route has a more specific freq/schedule, prefer it
    if (curatedRoutes[normalized.code]?.freq) {
      normalized.freq = curatedRoutes[normalized.code].freq;
    }
    if (curatedRoutes[normalized.code]?.schedule) {
      normalized.schedule = curatedRoutes[normalized.code].schedule;
    }

    routes[normalized.code] = normalized;
  }

  return routes;
}

/**
 * Extract station-line associations from paraderos records.
 * Returns a map of station name -> array of route codes.
 */
function extractStationLines(paraderos) {
  const stationLines = {};

  for (const p of paraderos) {
    const location = p.Ubicacion_del_Paradero?.trim();
    const code = p.Codigo_Rutas?.trim();
    if (!location || !code) continue;

    if (!stationLines[location]) {
      stationLines[location] = new Set();
    }
    stationLines[location].add(code);
  }

  // Convert Sets to arrays
  const result = {};
  for (const [name, codes] of Object.entries(stationLines)) {
    result[name] = Array.from(codes);
  }
  return result;
}

/**
 * Main ETL: fetch open data, merge with curated data, output RouteData.json shape.
 */
async function buildRouteData(curatedData = {}) {
  console.log('[OpenData ETL] Fetching routes from Cartagena open data portal...');
  const openRoutes = await fetchAllRecords(ROUTES_RESOURCE_ID);
  console.log(`[OpenData ETL] Got ${openRoutes.length} route records.`);

  console.log('[OpenData ETL] Fetching paraderos from Cartagena open data portal...');
  const paraderos = await fetchAllRecords(PARADEROS_RESOURCE_ID);
  console.log(`[OpenData ETL] Got ${paraderos.length} paradero records.`);

  const routes = mergeRoutes(openRoutes, curatedData.routes || {});
  const stationLines = extractStationLines(paraderos);

  // Merge station line associations into curated stations
  const stations = { ...curatedData.stations };
  for (const [name, lines] of Object.entries(stationLines)) {
    if (stations[name]) {
      // Merge curated lines with open-data lines, deduplicate
      const merged = [...new Set([...(stations[name].lines || []), ...lines])];
      stations[name].lines = merged;
    }
    // Note: Stations not in curated data won't have coordinates, so we skip adding them
  }

  return {
    stations,
    routes,
    schedules: curatedData.schedules || {
      lv: [],
      sab: [],
      dom: [],
    },
    source: 'datosabiertos.cartagena.gov.co (CKAN datastore API)',
    license: 'CC-BY',
    fetchedAt: new Date().toISOString(),
  };
}

window.fetchOpenData = { buildRouteData, fetchAllRecords, normalizeRoute, mergeRoutes };
