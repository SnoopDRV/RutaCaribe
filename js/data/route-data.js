/**
 * RouteData Loader
 * Loads and parses RouteData.json into global state
 */

let STATIONS = {};
let SYSTEM_ROUTES = {};
let SCHEDULES_DATA = {};

/**
 * Load route data from RouteData.json
 * @returns {Promise<void>}
 */
async function loadRouteData() {
  try {
    const response = await fetch('RouteData.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    STATIONS = data.stations;
    SYSTEM_ROUTES = data.routes;
    SCHEDULES_DATA = data.schedules;
    console.log('RouteData.json cargado correctamente:', {
      stations: Object.keys(STATIONS).length,
      routes: Object.keys(SYSTEM_ROUTES).length,
      schedules: Object.keys(SCHEDULES_DATA).length
    });
  } catch (error) {
    console.error('Error al cargar RouteData.json:', error);
    showDataLoadError();
  }
}

function showDataLoadError() {
  const errorHtml = `
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-background/95 dark:bg-[#0f151c]/95 backdrop-blur-sm">
      <div class="bg-surface-container-lowest dark:bg-[#1a2532] rounded-xl p-6 max-w-md mx-4 shadow-xl border border-error/30 text-center">
        <span class="material-symbols-outlined text-error text-5xl mb-3 block">error</span>
        <h3 class="font-headline-sm text-headline-sm text-on-surface dark:text-white mb-2">Error al cargar datos</h3>
        <p class="text-on-surface-variant dark:text-gray-400 mb-4">
          No se pudo cargar RouteData.json. Asegúrate de servir el proyecto mediante un servidor web local (ej. <code>npx serve</code> o <code>python -m http.server</code>) y no abrir el archivo directamente.
        </p>
        <button onclick="location.reload()" class="px-4 py-2 bg-error text-on-error rounded-lg font-bold hover:opacity-90">Reintentar</button>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', errorHtml);
}

// Expose globally for inline handlers
window.STATIONS = STATIONS;
window.SYSTEM_ROUTES = SYSTEM_ROUTES;
window.SCHEDULES_DATA = SCHEDULES_DATA;
window.loadRouteData = loadRouteData;

/**
 * Refresh route data from the Cartagena open data portal (CKAN datastore API).
 * Fetches live routes + paraderos, merges with curated station coordinates,
 * and updates the global STATIONS / SYSTEM_ROUTES / SCHEDULES_DATA state.
 * @returns {Promise<void>}
 */
async function refreshFromOpenData() {
  if (!window.fetchOpenData) {
    throw new Error('fetch-open-data.js no se ha cargado');
  }

  const curated = { stations: STATIONS, routes: SYSTEM_ROUTES, schedules: SCHEDULES_DATA };
  const merged = await window.fetchOpenData.buildRouteData(curated);

  STATIONS = merged.stations;
  SYSTEM_ROUTES = merged.routes;
  SCHEDULES_DATA = merged.schedules;

  window.STATIONS = STATIONS;
  window.SYSTEM_ROUTES = SYSTEM_ROUTES;
  window.SCHEDULES_DATA = SCHEDULES_DATA;

  console.log('Datos actualizados desde el portal abierto:', merged._meta);
  return merged._meta;
}

window.refreshFromOpenData = refreshFromOpenData;