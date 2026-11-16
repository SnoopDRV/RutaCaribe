/**
 * Planner UI
 * Trip result card, step-by-step leg itinerary, action buttons
 */

function updatePlannerResultUI(res) {
  // Show trip result card and action buttons
  document.getElementById('trip-result-card').classList.remove('hidden');
  document.getElementById('trip-action-buttons').classList.remove('hidden');
  document.getElementById('trip-action-buttons').classList.add('grid');

  document.getElementById('res-badge-line').textContent = res.routeCode;
  document.getElementById('res-trip-time').textContent = `${res.totalMinutes} min`;
  document.getElementById('res-trip-stops').textContent = `${res.totalStops} paradas • ${res.freq}`;
  document.getElementById('res-next-arrival').textContent = res.nextArrival;

  const directTag = document.getElementById('res-direct-tag');
  if (res.isDirect) {
    directTag.textContent = 'Directo';
    directTag.className = 'text-xs text-green-600 dark:text-green-400 font-bold';
  } else {
    directTag.textContent = `${res.transferCount} Transbordo${res.transferCount > 1 ? 's' : ''}`;
    directTag.className = 'text-xs text-amber-600 dark:text-amber-400 font-bold';
  }

  const delayBox = document.getElementById('res-delay-box');
  const delayText = document.getElementById('res-delay-text');
  if (res.hasDelay) {
    delayBox.className = 'bg-amber-500/15 dark:bg-amber-950/40 border border-amber-500/30 rounded px-2.5 py-1.5 flex items-center gap-2';
    delayText.innerHTML = 'Retraso habitual en tramo mixto de Bazurto <strong>(+6 a +10 min)</strong> por tráfico vehicular.';
  } else {
    delayBox.className = 'bg-emerald-500/15 dark:bg-emerald-950/40 border border-emerald-500/30 rounded px-2.5 py-1.5 flex items-center gap-2';
    delayText.innerHTML = 'Operación fluida en carril exclusivo troncal.';
  }

  document.getElementById('btn-paradas-text').textContent = `Ver ${res.stops.length} Paradas`;

  // Render step-by-step leg itinerary
  const stepsList = document.getElementById('itinerary-steps-list');
  document.getElementById('itinerary-summary-count').textContent = `${res.legs.length} tramo${res.legs.length > 1 ? 's' : ''} • ${res.stops.length} estaciones en total`;

  let html = '';
  res.legs.forEach((leg, legIdx) => {
    const isFirst = legIdx === 0;
    const isLast = legIdx === res.legs.length - 1;

    html += `
      <div class="mb-3 pb-3 border-b border-surface-container dark:border-white/5 last:border-0">
        <!-- Leg header: route badge + direction -->
        <div class="flex items-center gap-2 mb-1.5">
          <span class="px-2 py-0.5 rounded text-[10px] font-bold tracking-tight" style="background-color:${leg.color};color:#ffffff;">
            ${leg.routeCode}
          </span>
          <span class="text-xs font-bold text-on-surface dark:text-white">${leg.from} → ${leg.to}</span>
          <span class="ml-auto text-[10px] text-on-surface-variant dark:text-gray-400 font-medium">
            ${leg.stopsCount} parada${leg.stopsCount !== 1 ? 's' : ''} • ~${leg.estimatedMinutes} min
          </span>
        </div>

        <!-- Stop sequence for this leg -->
        <div class="flex flex-col gap-1 pl-2 relative before:content-[''] before:absolute before:left-0.5 before:top-0 before:bottom-0 before:w-0.5 before:bg-primary-container/30">
          ${leg.stops.map((stopName, stopIdx) => {
            const isStopFirst = stopIdx === 0;
            const isStopLast = stopIdx === leg.stops.length - 1;
            const isTransfer = res.transferStations.includes(stopName) && !isStopFirst;
            const st = STATIONS[stopName] || {};

            let iconColor = 'bg-gray-400 dark:bg-gray-600';
            let label = '';
            if (isStopFirst && isFirst) {
              iconColor = 'bg-emerald-600 ring-2 ring-emerald-300';
              label = '<span class="text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 px-1.5 py-0 rounded font-bold ml-1">ORIGEN</span>';
            } else if (isStopLast && isLast) {
              iconColor = 'bg-primary-container ring-2 ring-orange-300';
              label = '<span class="text-[10px] bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-300 px-1.5 py-0 rounded font-bold ml-1">DESTINO</span>';
            } else if (isTransfer) {
              iconColor = 'bg-blue-600 ring-2 ring-blue-300';
              label = '<span class="text-[10px] bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 px-1.5 py-0 rounded font-bold ml-1">TRANSBORDO</span>';
            }

            return `
              <div class="flex items-start gap-2.5 text-xs py-0.5">
                <span class="w-2.5 h-2.5 rounded-full ${iconColor} shrink-0 mt-1"></span>
                <div class="flex flex-col min-w-0">
                  <div class="flex items-center gap-1.5">
                    <span class="font-bold text-on-surface dark:text-white text-sm">${stopName}</span>
                    ${label}
                  </div>
                  <span class="text-gray-500 dark:text-gray-400 text-[11px] truncate">${st.desc || ''}</span>
                </div>
              </div>
            `;
          }).join('')}
        </div>

        <!-- Transfer notice between legs -->
        ${!isLast && res.transferStations.includes(leg.to) ? `
          <div class="flex items-center gap-2 mt-1.5 pt-1.5 border-t border-surface-container dark:border-white/5">
            <span class="w-2.5 h-2.5 rounded-full bg-blue-600 shrink-0"></span>
            <span class="text-xs text-blue-600 dark:text-blue-400 font-bold">
              Transbordo en <strong>${leg.to}</strong> — cambia de ${leg.routeCode} a ${res.legs[legIdx + 1]?.routeCode}
            </span>
          </div>
        ` : ''}
      </div>
    `;
  });
  stepsList.innerHTML = html;
}

function toggleDetalleParadas() {
  const container = document.getElementById('itinerary-steps-container');
  const isHidden = container.classList.contains('hidden');
  if (isHidden) {
    container.classList.remove('hidden');
    container.classList.add('flex');
    document.getElementById('btn-toggle-paradas').classList.add('bg-primary-container/20', 'text-primary-container');
  } else {
    container.classList.add('hidden');
    container.classList.remove('flex');
    document.getElementById('btn-toggle-paradas').classList.remove('bg-primary-container/20', 'text-primary-container');
  }
}

function clearRouteDisplay() {
  // Hide trip result card and action buttons
  document.getElementById('trip-result-card').classList.add('hidden');
  document.getElementById('trip-action-buttons').classList.add('hidden');
  document.getElementById('trip-action-buttons').classList.remove('grid');
  // Reset station markers to normal (show all)
  updateStationMarkerHighlight('ALL');
  // Remove active route polyline and markers
  clearActiveRoute();
  // Reset route filter to ALL
  if (selectedRouteFilter !== 'ALL') {
    selectedRouteFilter = 'ALL';
    selectRouteFilter('ALL');
  }
}

// Expose globally for inline handlers
window.updatePlannerResultUI = updatePlannerResultUI;
window.toggleDetalleParadas = toggleDetalleParadas;
window.clearRouteDisplay = clearRouteDisplay;
