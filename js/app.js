/**
 * RutaCaribe - Main Entry Point
 * Initializes all modules and starts the application
 */

// Initialize autocomplete after DOM is ready
function initAutocomplete() {
  setupAutocomplete('input-origen', 'dropdown-origen', (selected) => {
    currentOrigin = selected;
    if (currentDest) calculateAndDisplayRoute(currentOrigin, currentDest);
  });

  setupAutocomplete('input-destino', 'dropdown-destino', (selected) => {
    currentDest = selected;
    if (currentOrigin) calculateAndDisplayRoute(currentOrigin, selected);
  });

  document.querySelectorAll('#quick-line-chips .line-chip').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#quick-line-chips .line-chip').forEach(b => {
        b.className = 'line-chip px-3 py-1 rounded-full bg-surface-container-lowest dark:bg-white/10 text-on-surface dark:text-gray-200 font-label-sm text-label-sm whitespace-nowrap border border-outline-variant/30 dark:border-white/10 hover:bg-surface-container';
      });
      btn.className = 'line-chip px-3 py-1 rounded-full bg-on-surface dark:bg-white text-surface-container-lowest dark:text-[#121a24] font-label-sm text-label-sm whitespace-nowrap font-bold shadow-sm';
      
      const line = btn.getAttribute('data-line');
      selectRouteFilter(line);
    });
  });
}

// Debug keybind: press / to log current routing state
window.addEventListener('keydown', (e) => {
  if (e.key === '/' && !e.target.matches('input, textarea')) {
    e.preventDefault();
    console.group('🔍 RutaCaribe Debug State');
    console.log('Origin:', window.getCurrentOrigin ? window.getCurrentOrigin() : 'N/A');
    console.log('Destination:', window.getCurrentDest ? window.getCurrentDest() : 'N/A');
    console.log('STATIONS count:', Object.keys(window.STATIONS || {}).length);
    console.log('SYSTEM_ROUTES count:', Object.keys(window.SYSTEM_ROUTES || {}).length);
    console.log('Map initialized:', !!window.getMap ? !!window.getMap() : 'N/A');
    console.groupEnd();
  }
});

// Main initialization
window.addEventListener('DOMContentLoaded', async () => {
  try {
    await loadRouteData();
  } catch (e) {
    console.error('Failed to load route data:', e);
  }
  try {
    initTheme();
  } catch (e) {
    console.error('Failed to init theme:', e);
  }
  try {
    initAutocomplete();
  } catch (e) {
    console.error('Failed to init autocomplete:', e);
  }
  try {
    switchMainView('inicio');
  } catch (e) {
    console.error('Failed to switch to inicio view:', e);
  }
});