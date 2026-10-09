/**
 * Schedules View
 * Schedules table rendering and day selection
 */

import { SCHEDULES_DATA, SYSTEM_ROUTES } from '../data/route-data.js';
import { currentOrigin, currentDest, setCurrentOrigin, setCurrentDest, calculateAndDisplayRoute } from '../routing/routing-engine.js';
import { switchMainView } from './view-switcher.js';
import { selectRouteFilter } from '../map/route-highlighter.js';

export function renderSchedulesTable(dayType) {
  const tbody = document.getElementById('schedule-tbody');
  const data = SCHEDULES_DATA[dayType] || SCHEDULES_DATA.lv;
  let html = '';

  data.forEach(item => {
    const isTroncal = item.code.startsWith('T');
    const badgeColor = isTroncal ? 'bg-primary-container' : 'bg-secondary';

    html += `
      <tr class="hover:bg-surface-container-low/50 dark:hover:bg-white/5 transition-colors">
        <td class="py-3.5 px-space-md whitespace-nowrap">
          <span class="inline-flex items-center px-2.5 py-1 rounded-md font-label-md text-white font-bold shadow-sm ${badgeColor}">${item.code}</span>
        </td>
        <td class="py-3.5 px-space-md font-semibold text-on-surface dark:text-white">${item.name}</td>
        <td class="py-3.5 px-space-md tabular-nums font-bold text-on-surface dark:text-white">${item.time}</td>
        <td class="py-3.5 px-space-md text-secondary dark:text-gray-300 font-medium">${item.freq}</td>
        <td class="py-3.5 px-space-md text-right">
          <button onclick="planearDesdeHorario('${item.code}')" class="px-2.5 py-1 text-xs bg-primary-container text-white rounded font-bold hover:opacity-90">Planear</button>
        </td>
      </tr>
    `;
  });
  tbody.innerHTML = html;
}

export function selectDaySchedule(type) {
  const btnLv = document.getElementById('day-lv');
  const btnSab = document.getElementById('day-sab');
  const btnDom = document.getElementById('day-dom');

  const activeClass = 'px-space-md py-2 rounded-lg font-label-md text-label-md bg-white dark:bg-[#1d2939] text-on-surface dark:text-white shadow-sm border border-surface-container/50 dark:border-white/10 transition-all flex items-center gap-1.5 font-bold cursor-pointer';
  const inactiveClass = 'px-space-md py-2 rounded-lg font-label-md text-label-md text-secondary dark:text-gray-300 hover:text-on-surface dark:hover:text-white hover:bg-surface-container dark:hover:bg-white/5 transition-all flex items-center gap-1.5 cursor-pointer';

  [btnLv, btnSab, btnDom].forEach(b => b.className = inactiveClass);

  if (type === 'lv') btnLv.className = activeClass;
  else if (type === 'sab') btnSab.className = activeClass;
  else btnDom.className = activeClass;

  renderSchedulesTable(type);
}

export function planearDesdeHorario(code) {
  const r = SYSTEM_ROUTES[code];
  if (r) {
    setCurrentOrigin(r.stops[0]);
    setCurrentDest(r.stops[r.stops.length - 1]);
    document.getElementById('input-origen').value = currentOrigin;
    document.getElementById('input-destino').value = currentDest;
    switchMainView('mapa');
    selectRouteFilter(r.code);
    calculateAndDisplayRoute(currentOrigin, currentDest);
  }
}