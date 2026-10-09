/**
 * Planner UI
 * Trip result card, itinerary steps, action buttons
 */

import { STATIONS } from '../data/route-data.js';

export function updatePlannerResultUI(res) {
  document.getElementById('trip-result-card').classList.remove('hidden');
  document.getElementById('trip-action-buttons').classList.remove('hidden');
  document.getElementById('trip-action-buttons').classList.add('grid');
  
  document.getElementById('res-badge-line').textContent = res.routeCode;
  document.getElementById('res-trip-time').textContent = `${res.estimatedMinutes} min`;
  document.getElementById('res-trip-stops').textContent = `${res.stopsCount} paradas • ${res.freq}`;
  document.getElementById('res-next-arrival').textContent = res.nextArrival;
  
  const directTag = document.getElementById('res-direct-tag');
  if (res.isDirect) {
    directTag.textContent = 'Directo';
    directTag.className = 'text-xs text-green-600 dark:text-green-400 font-bold';
  } else {
    directTag.textContent = `1 Transbordo (${res.transferHub})`;
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

  const stepsList = document.getElementById('itinerary-steps-list');
  document.getElementById('itinerary-summary-count').textContent = `${res.stops.length} estaciones en total`;
  
  let html = '';
  res.stops.forEach((stopName, idx) => {
    const isFirst = idx === 0;
    const isLast = idx === res.stops.length - 1;
    const isTransfer = res.transferHub && stopName === res.transferHub;
    const st = STATIONS[stopName] || {};

    let iconColor = 'bg-primary-container';
    if (isFirst) iconColor = 'bg-emerald-600 ring-2 ring-emerald-300';
    else if (isLast) iconColor = 'bg-primary-container ring-2 ring-orange-300';
    else if (isTransfer) iconColor = 'bg-blue-600 ring-2 ring-blue-300';

    html += `
      <div class="flex items-start gap-2.5 text-xs py-1">
        <span class="w-2.5 h-2.5 rounded-full ${iconColor} shrink-0 mt-1"></span>
        <div class="flex flex-col min-w-0">
          <div class="flex items-center gap-1.5">
            <span class="font-bold text-on-surface dark:text-white ${isFirst || isLast || isTransfer ? 'text-sm' : ''}">${stopName}</span>
            ${isFirst ? '<span class="text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 px-1 rounded font-bold">ORIGEN</span>' : ''}
            ${isLast ? '<span class="text-[10px] bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-300 px-1 rounded font-bold">DESTINO</span>' : ''}
            ${isTransfer ? '<span class="text-[10px] bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 px-1 rounded font-bold">TRANSBORDO</span>' : ''}
          </div>
          <span class="text-gray-500 dark:text-gray-400 text-[11px] truncate">${st.desc || ''}</span>
        </div>
      </div>
    `;
  });
  stepsList.innerHTML = html;
}

export function toggleDetalleParadas() {
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

export function clearRouteDisplay() {
  document.getElementById('trip-result-card').classList.add('hidden');
  document.getElementById('trip-action-buttons').classList.add('hidden');
  document.getElementById('trip-action-buttons').classList.remove('grid');
}