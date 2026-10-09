/**
 * Directory View
 * Routes directory rendering and interaction
 */

import { SYSTEM_ROUTES, STATIONS } from '../data/route-data.js';
import { currentOrigin, currentDest, setCurrentOrigin, setCurrentDest, calculateAndDisplayRoute } from '../routing/routing-engine.js';
import { switchMainView } from './view-switcher.js';
import { selectRouteFilter } from '../map/route-highlighter.js';

export let currentDirCategory = 'ALL';
export let currentSelectedDirCode = 'T101';

export function renderDirectoryRoutes() {
  const container = document.getElementById('directory-routes-list');
  let html = '';

  for (const [code, r] of Object.entries(SYSTEM_ROUTES)) {
    const isMatchCat = (currentDirCategory === 'ALL' || r.category === currentDirCategory);
    if (!isMatchCat) continue;

    const isSelected = code === currentSelectedDirCode;
    html += `
      <article class="cursor-pointer p-space-md rounded-xl bg-surface-container-lowest dark:bg-[#162130] shadow-sm hover:shadow-md transition-all relative overflow-hidden border border-surface-container/60 dark:border-white/5 ${isSelected ? 'ring-2 ring-primary-container' : ''}" onclick="selectDirectoryRoute('${code}')">
        <div class="absolute left-0 top-0 bottom-0 w-1.5" style="background-color: ${r.color};"></div>
        <div class="flex items-start justify-between gap-space-sm pl-2">
          <div class="flex items-center gap-space-sm">
            <span class="text-white font-headline-sm px-2.5 py-1 rounded tracking-tight tabular-nums font-bold" style="background-color: ${r.color};">
              ${r.code}
            </span>
            <div class="flex flex-col">
              <span class="font-label-sm uppercase tracking-wide font-bold" style="color: ${r.color};">${r.typeLabel}</span>
              <h3 class="font-headline-sm text-on-surface dark:text-white leading-snug">${r.name}</h3>
            </div>
          </div>
          <span class="material-symbols-outlined text-[20px] text-gray-400">arrow_forward</span>
        </div>
        <div class="flex items-center justify-between mt-space-sm pt-space-xs pl-2 bg-surface-container-low/50 dark:bg-[#0f1722]/60 p-1.5 rounded-lg text-xs text-gray-600 dark:text-gray-300">
          <div class="flex items-center gap-1">
            <span class="material-symbols-outlined text-[16px]">pin_drop</span>
            <span>${r.stops.length} estaciones</span>
          </div>
          <div class="flex items-center gap-1">
            <span class="material-symbols-outlined text-[16px] text-primary-container">schedule</span>
            <span>${r.freq}</span>
          </div>
        </div>
      </article>
    `;
  }
  container.innerHTML = html;
  renderDirectoryDetail(currentSelectedDirCode);
}

export function selectDirectoryRoute(code) {
  currentSelectedDirCode = code;
  renderDirectoryRoutes();
}

export function renderDirectoryDetail(code) {
  const r = SYSTEM_ROUTES[code];
  if (!r) return;

  document.getElementById('dir-detail-badge').textContent = r.code;
  document.getElementById('dir-detail-badge').style.backgroundColor = r.color;
  document.getElementById('dir-detail-type').textContent = r.typeLabel;
  document.getElementById('dir-detail-type').style.color = r.color;
  document.getElementById('dir-detail-title').textContent = r.name;
  document.getElementById('dir-detail-stops-count').textContent = `${r.stops.length} paradas`;

  const timeline = document.getElementById('dir-detail-timeline');
  let html = '';
  r.stops.forEach((stopName, idx) => {
    const isFirst = idx === 0;
    const isLast = idx === r.stops.length - 1;
    const st = STATIONS[stopName] || {};

    html += `
      <div class="relative flex items-start justify-between gap-space-sm group">
        <span class="absolute -left-5 top-1.5 w-3 h-3 rounded-full ${isFirst || isLast ? 'bg-primary-container ring-2 ring-white' : 'bg-gray-400 dark:bg-gray-600'}"></span>
        <div class="flex flex-col pl-2">
          <span class="font-bold text-on-surface dark:text-white ${isFirst || isLast ? 'text-base text-primary-container' : 'text-sm'}">${stopName}</span>
          <span class="text-xs text-gray-500 dark:text-gray-400">${st.desc || ''}</span>
        </div>
        <div class="flex items-center gap-1 text-[11px] bg-gray-100 dark:bg-white/5 px-2 py-0.5 rounded text-gray-600 dark:text-gray-300">
          ${isFirst ? 'Salida' : isLast ? 'Terminal' : `${idx + 1}`}
        </div>
      </div>
    `;
  });
  timeline.innerHTML = html;
}

export function setDirCategory(cat, btn) {
  currentDirCategory = cat;
  document.querySelectorAll('.dir-filter-tab').forEach(b => {
    b.className = 'dir-filter-tab px-3.5 py-1.5 font-label-md text-label-md text-secondary dark:text-gray-300 hover:text-on-surface rounded-lg transition-all';
  });
  btn.className = 'dir-filter-tab px-3.5 py-1.5 font-label-md text-label-md rounded-lg transition-all bg-primary-container text-white font-bold';
  renderDirectoryRoutes();
}

export function filterDirectoryRoutes() {
  const q = document.getElementById('directory-search-input').value.toLowerCase().trim();
  const articles = document.querySelectorAll('#directory-routes-list article');
  articles.forEach(art => {
    const text = art.textContent.toLowerCase();
    art.classList.toggle('hidden', !text.includes(q));
  });
}

export function planearConRutaActiva() {
  const r = SYSTEM_ROUTES[currentSelectedDirCode];
  if (r && r.stops.length > 1) {
    currentOrigin = r.stops[0];
    currentDest = r.stops[r.stops.length - 1];
    document.getElementById('input-origen').value = currentOrigin;
    document.getElementById('input-destino').value = currentDest;
    switchMainView('mapa');
    selectRouteFilter(r.code);
    calculateAndDisplayRoute(currentOrigin, currentDest);
  }
}

export function getCurrentDirCategory() {
  return currentDirCategory;
}

export function getCurrentSelectedDirCode() {
  return currentSelectedDirCode;
}