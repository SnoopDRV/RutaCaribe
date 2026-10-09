/**
 * View Switcher
 * Main view navigation between Inicio, Mapa, Rutas, Horarios
 */

import { initMap } from '../map/map-init.js';
import { renderDirectoryRoutes } from './directory-view.js';
import { renderSchedulesTable } from './schedules-view.js';

export function switchMainView(view) {
  const viewInicio = document.getElementById('view-inicio');
  const viewMapa = document.getElementById('view-mapa');
  const viewRutas = document.getElementById('view-rutas');
  const viewHorarios = document.getElementById('view-horarios');

  const btnInicio = document.getElementById('nav-btn-inicio');
  const btnMapa = document.getElementById('nav-btn-mapa');
  const btnRutas = document.getElementById('nav-btn-rutas');
  const btnHorarios = document.getElementById('nav-btn-horarios');

  const activeClasses = 'px-3.5 py-1.5 rounded-full flex items-center gap-1 bg-primary-container text-on-primary font-medium text-label-md sm:text-label-lg shadow-sm transition-all';
  const inactiveClasses = 'px-3.5 py-1.5 rounded-full flex items-center gap-1 text-on-surface-variant dark:text-gray-300 hover:text-on-surface dark:hover:text-white hover:bg-surface-container dark:hover:bg-white/5 font-medium text-label-md sm:text-label-lg transition-colors';

  [btnInicio, btnMapa, btnRutas, btnHorarios].forEach(b => {
    if (b) b.className = inactiveClasses;
  });

  viewInicio.classList.add('hidden');
  viewInicio.classList.remove('flex');
  viewMapa.classList.add('hidden');
  viewMapa.classList.remove('flex');
  viewRutas.classList.add('hidden');
  viewRutas.classList.remove('flex');
  viewHorarios.classList.add('hidden');
  viewHorarios.classList.remove('flex');

  if (view === 'inicio') {
    viewInicio.classList.remove('hidden');
    viewInicio.classList.add('flex');
    if (btnInicio) btnInicio.className = activeClasses;
  } else if (view === 'mapa') {
    viewMapa.classList.remove('hidden');
    viewMapa.classList.add('flex');
    if (btnMapa) btnMapa.className = activeClasses;
    initMap();
    setTimeout(() => {
      const map = document.getElementById('gis-map-viewport')._leaflet_map;
      if (map) map.invalidateSize();
    }, 200);
  } else if (view === 'rutas') {
    viewRutas.classList.remove('hidden');
    viewRutas.classList.add('flex');
    if (btnRutas) btnRutas.className = activeClasses;
    renderDirectoryRoutes();
  } else if (view === 'horarios') {
    viewHorarios.classList.remove('hidden');
    viewHorarios.classList.add('flex');
    if (btnHorarios) btnHorarios.className = activeClasses;
    renderSchedulesTable('lv');
  }
}

export function startApp() {
  const btn = document.getElementById('btn-comenzar');
  const btnText = document.getElementById('btn-comenzar-text');
  const btnIcon = document.getElementById('btn-comenzar-icon');
  const btnLoader = document.getElementById('btn-comenzar-loader');
  
  btn.disabled = true;
  btnText.textContent = 'Cargando...';
  btnIcon.style.display = 'none';
  btnLoader.style.display = 'flex';
  btn.classList.add('opacity-75', 'cursor-wait');
  
  setTimeout(() => {
    switchMainView('mapa');
    setTimeout(() => {
      btn.disabled = false;
      btnText.textContent = 'Comenzar';
      btnIcon.style.display = 'inline';
      btnLoader.style.display = 'none';
      btn.classList.remove('opacity-75', 'cursor-wait');
    }, 300);
  }, 800);
}