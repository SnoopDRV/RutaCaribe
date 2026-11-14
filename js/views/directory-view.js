/**
 * Directory View — Station → Routes map list
 * Shows each station with the routes that serve it (like Transcaribe's
 * in-station route maps). Replaces the old route-card directory.
 */

let currentDirCategory = 'ALL';
let currentSelectedStation = null;

const TYPE_LABELS = {
  TRONCAL: 'Troncales',
  PRETRONCAL: 'Pretroncales',
  ALIMENTADOR: 'Alimentadoras',
  COMPLEMENTARIA: 'Complementarias',
};

const TYPE_COLORS = {
  TRONCAL: '#f37021',
  PRETRONCAL: '#525f71',
  ALIMENTADOR: '#059669',
  COMPLEMENTARIA: '#7c3aed',
};

/**
 * Render the full station list grouped by station type.
 * Each station shows route badges for every line that stops there.
 */
function renderStationList() {
  const container = document.getElementById('station-list-container');
  if (!container) return;

  const q = (document.getElementById('station-search-input')?.value || '').toLowerCase().trim();

  // Group stations by type
  const grouped = {};
  for (const [name, st] of Object.entries(STATIONS)) {
    const type = st.type || 'TRONCAL';
    if (!grouped[type]) grouped[type] = [];
    grouped[type].push({ name, ...st });
  }

  // Sort types in a sensible order
  const typeOrder = ['TRONCAL', 'PRETRONCAL', 'ALIMENTADOR', 'COMPLEMENTARIA'];

  let html = '';

  for (const type of typeOrder) {
    const stations = grouped[type] || [];
    if (stations.length === 0) continue;

    // Filter by category if not ALL
    let filtered = stations;
    if (currentDirCategory !== 'ALL') {
      filtered = stations.filter(s => {
        const lines = s.lines || [];
        return lines.some(l => SYSTEM_ROUTES[l]?.category === currentDirCategory);
      });
    }
    if (filtered.length === 0) continue;

    // Filter by search query
    if (q) {
      filtered = filtered.filter(s =>
        s.name.toLowerCase().includes(q) ||
        (s.zone || '').toLowerCase().includes(q) ||
        (s.lines || []).some(l => l.toLowerCase().includes(q))
      );
    }
    if (filtered.length === 0) continue;

    // Sort stations alphabetically within type
    filtered.sort((a, b) => a.name.localeCompare(b.name));

    html += `
      <section class="mb-space-lg">
        <h2 class="font-headline-sm text-headline-sm text-on-surface dark:text-white mb-space-sm flex items-center gap-2">
          <span class="w-2 h-2 rounded-full" style="background-color:${TYPE_COLORS[type]}"></span>
          ${TYPE_LABELS[type]} (${filtered.length})
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-space-sm">
    `;

    for (const st of filtered) {
      const lines = st.lines || [];
      const lineBadges = lines
        .map(l => {
          const r = SYSTEM_ROUTES[l];
          const color = r ? r.color : TYPE_COLORS[type];
          return `<span class="line-badge px-2 py-0.5 rounded text-[10px] font-bold tracking-tight" style="background-color:${color};color:#ffffff;">${l}</span>`;
        })
        .join('');

      const isSelected = currentSelectedStation === st.name;
      html += `
        <article class="cursor-pointer p-space-md rounded-xl bg-surface-container-lowest dark:bg-[#162130] shadow-sm hover:shadow-md transition-all border border-surface-container/60 dark:border-white/5 ${isSelected ? 'ring-2 ring-primary-container' : ''}" onclick="selectStation('${st.name}')">
          <div class="flex items-start justify-between gap-space-sm">
            <div class="flex items-center gap-2">
              <span class="w-2.5 h-2.5 rounded-full ${st.isTerminal ? 'bg-primary-container' : 'bg-outline-variant'}"></span>
              <span class="font-label-sm font-bold text-on-surface dark:text-white truncate">${st.name}</span>
            </div>
            <div class="flex flex-wrap gap-1" id="lines-${st.name}">
              ${lineBadges}
            </div>
          </div>
          <div class="mt-1">
            <span class="text-xs text-on-surface-variant dark:text-gray-400">${st.zone || 'Cartagena'}</span>
          </div>
          <div class="mt-space-sm flex items-center gap-2">
            <button class="flex-1 py-1.5 rounded-lg bg-surface-container-low dark:bg-[#0f1722] text-on-surface dark:text-white text-xs font-medium border border-surface-container dark:border-white/10 hover:bg-surface-container-low/50 transition-colors" onclick="event.stopPropagation(); setStationAsOriginFromList('${st.name}')">
              Origen
            </button>
            <button class="flex-1 py-1.5 rounded-lg bg-primary-container text-white text-xs font-medium hover:opacity-90 transition-colors" onclick="event.stopPropagation(); setStationAsDestFromList('${st.name}')">
              Destino
            </button>
          </div>
        </article>
      `;
    }

    html += `</div></section>`;
  }

  if (html === '') {
    html = `<div class="text-center py-space-lg text-on-surface-variant dark:text-gray-400 text-sm">No se encontraron estaciones que coincidan con el filtro.</div>`;
  }

  container.innerHTML = html;
}

/**
 * Select a station (visual highlight only).
 */
function selectStation(name) {
  currentSelectedStation = name;
  renderStationList();
}

/**
 * Set a station from the list as origin (A).
 */
function setStationAsOriginFromList(name) {
  currentOrigin = name;
  document.getElementById('input-origen')?.value?.length && (document.getElementById('input-origen').value = name);
  const inp = document.getElementById('input-origen');
  if (inp) inp.value = name;
  const dest = document.getElementById('input-destino')?.value;
  if (dest) calculateAndDisplayRoute(name, dest);
  currentSelectedStation = null;
  renderStationList();
}

/**
 * Set a station from the list as destination (B).
 */
function setStationAsDestFromList(name) {
  currentDest = name;
  const inp = document.getElementById('input-destino');
  if (inp) inp.value = name;
  const orig = document.getElementById('input-origen')?.value;
  if (orig) calculateAndDisplayRoute(orig, name);
  currentSelectedStation = null;
  renderStationList();
}

/**
 * Filter stations by search input.
 */
function filterStationList() {
  renderStationList();
}

/**
 * Set category filter (ALL, TRONCAL, PRETRONCAL, ALIMENTADOR, COMPLEMENTARIA).
 */
function setDirCategory(cat, btn) {
  currentDirCategory = cat;
  document.querySelectorAll('.dir-filter-tab').forEach(b => {
    b.className = 'dir-filter-tab px-3.5 py-1.5 font-label-md text-label-md text-secondary dark:text-gray-300 hover:text-on-surface rounded-lg transition-all';
  });
  if (btn) {
    btn.className = 'dir-filter-tab px-3.5 py-1.5 font-label-md text-label-md rounded-lg transition-all bg-primary-container text-white font-bold';
  }
  renderStationList();
}

// Legacy aliases kept for backward compatibility with view-switcher.js
window.renderDirectoryRoutes = renderStationList;
window.renderStationList = renderStationList;
window.selectDirectoryRoute = selectStation;
window.renderDirectoryDetail = () => {};
window.setDirCategory = setDirCategory;
window.filterDirectoryRoutes = filterStationList;
window.filterStationList = filterStationList;
window.selectStation = selectStation;
window.setStationAsOriginFromList = setStationAsOriginFromList;
window.setStationAsDestFromList = setStationAsDestFromList;
window.planearConRutaActiva = () => {
  // No-op: the rutas tab is now station-centric. Use the map view to plan.
};
