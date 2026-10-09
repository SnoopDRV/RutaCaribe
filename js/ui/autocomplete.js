/**
 * Autocomplete
 * Search dropdowns for origin/destination inputs
 */

import { STATIONS } from '../data/route-data.js';
import { currentOrigin, currentDest, setCurrentOrigin, setCurrentDest, clearRouteDisplay } from '../routing/routing-engine.js';

export function setupAutocomplete(inputId, dropdownId, onSelect) {
  const input = document.getElementById(inputId);
  const dropdown = document.getElementById(dropdownId);

  function renderOptions(query = '') {
    const q = query.toLowerCase().trim();
    const matches = Object.keys(STATIONS).filter(name => name.toLowerCase().includes(q));

    if (matches.length === 0) {
      dropdown.innerHTML = `<div class="p-3 text-xs text-gray-500 text-center">No se encontraron estaciones</div>`;
      dropdown.classList.remove('hidden');
      return;
    }

    let html = '';
    matches.forEach(name => {
      const st = STATIONS[name];
      html += `
        <div class="px-3 py-2 hover:bg-orange-50 dark:hover:bg-white/10 cursor-pointer flex items-center justify-between border-b border-gray-100 dark:border-white/5 transition-colors" data-station="${name}">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-primary-container text-[18px]">directions_bus</span>
            <div class="flex flex-col">
              <span class="font-medium text-xs text-gray-900 dark:text-white">${name}</span>
              <span class="text-[10px] text-gray-500 dark:text-gray-400">${st.zone || ''}</span>
            </div>
          </div>
          <span class="text-[10px] bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 px-1.5 py-0.5 rounded font-bold">${st.type.toUpperCase()}</span>
        </div>
      `;
    });
    dropdown.innerHTML = html;
    dropdown.classList.remove('hidden');

    dropdown.querySelectorAll('[data-station]').forEach(item => {
      item.addEventListener('click', () => {
        const selectedName = item.getAttribute('data-station');
        input.value = selectedName;
        dropdown.classList.add('hidden');
        onSelect(selectedName);
      });
    });
  }

  input.addEventListener('focus', () => renderOptions(input.value));
  input.addEventListener('input', (e) => {
    renderOptions(input.value);
    if (input.value.trim() === '') {
      if (inputId === 'input-origen') {
        setCurrentOrigin('');
      } else if (inputId === 'input-destino') {
        setCurrentDest('');
      }
      clearRouteDisplay();
    }
  });

  document.addEventListener('click', (e) => {
    if (!input.contains(e.target) && !dropdown.contains(e.target)) {
      dropdown.classList.add('hidden');
    }
  });
}