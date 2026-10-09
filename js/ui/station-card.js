/**
 * Station Detail Card
 * Right drawer panel for station inspection
 */

import { STATIONS } from '../data/route-data.js';
import { currentOrigin, currentDest, calculateAndDisplayRoute } from '../routing/routing-engine.js';

export let selectedStationForCard = null;

export function openStationDetailCard(station) {
  selectedStationForCard = station;
  const card = document.getElementById('station-detail-card');
  card.classList.remove('hidden');

  document.getElementById('card-station-name').textContent = station.name;
  document.getElementById('card-station-sub').textContent = station.desc;
  document.getElementById('card-station-zone').textContent = station.zone || 'Cartagena';
  document.getElementById('card-station-lines').textContent = station.lines.join(', ');

  const badge = document.getElementById('card-station-badge');
  if (station.name === 'Bazurto') {
    badge.textContent = 'Demora estimada (+12m)';
    badge.className = 'font-label-sm text-label-sm bg-error text-on-error px-2 py-0.5 rounded font-bold uppercase';
  } else {
    badge.textContent = 'Operación Normal';
    badge.className = 'font-label-sm text-label-sm bg-emerald-600 text-white px-2 py-0.5 rounded font-bold uppercase';
  }

  const occPercent = station.name === 'Bazurto' ? 84 : Math.floor(Math.random() * 35) + 40;
  document.getElementById('card-occupancy-bar').style.width = `${occPercent}%`;
  document.getElementById('card-occupancy-tag').textContent = occPercent > 75 ? `Alta (${occPercent}%)` : `Media (${occPercent}%)`;

  const departuresContainer = document.getElementById('card-live-departures');
  let depsHTML = '';
  station.lines.slice(0, 3).forEach((lineCode, i) => {
    const arrivalMin = (i * 4) + 2;
    depsHTML += `
      <div class="p-2.5 flex items-center justify-between hover:bg-surface-container dark:hover:bg-white/5 transition-colors">
        <div class="flex items-center gap-2.5 min-w-0">
          <span class="bg-primary-container text-white font-label-sm text-label-sm px-2 py-0.5 rounded font-bold shrink-0">${lineCode}</span>
          <div class="flex flex-col min-w-0">
            <span class="font-label-md text-label-md text-on-surface dark:text-white truncate">Hacia Terminal / Retorno</span>
            <span class="font-body-sm text-xs text-gray-500 dark:text-gray-400">Frecuencia habitual</span>
          </div>
        </div>
        <div class="text-right shrink-0 pl-2">
          <span class="font-headline-sm text-lg text-primary-container block leading-none font-bold">${arrivalMin} min</span>
          <span class="text-[10px] text-gray-500">En camino</span>
        </div>
      </div>
    `;
  });
  departuresContainer.innerHTML = depsHTML;
}

export function dismissStationCard() {
  document.getElementById('station-detail-card').classList.add('hidden');
  selectedStationForCard = null;
}

export function setStationAsOrigin() {
  if (selectedStationForCard) {
    currentOrigin = selectedStationForCard.name;
    document.getElementById('input-origen').value = currentOrigin;
    if (currentDest) calculateAndDisplayRoute(currentOrigin, currentDest);
    dismissStationCard();
  }
}

export function setStationAsDest() {
  if (selectedStationForCard) {
    currentDest = selectedStationForCard.name;
    document.getElementById('input-destino').value = currentDest;
    if (currentOrigin) calculateAndDisplayRoute(currentOrigin, currentDest);
    dismissStationCard();
  }
}

export function planearConEstaEstacion() {
  setStationAsDest();
}

export function getSelectedStation() {
  return selectedStationForCard;
}