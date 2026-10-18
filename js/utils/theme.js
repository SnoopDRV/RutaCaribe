/**
 * Theme Utility
 * Dark/light mode toggle with localStorage persistence
 */

function applyTheme(isDark) {
  const htmlRoot = document.documentElement;
  const themeToggle = document.getElementById('theme-toggle');
  const themeKnob = document.getElementById('theme-knob');
  
  if (!themeToggle || !themeKnob) {
    console.warn('[Theme] Elements not found:', { themeToggle: !!themeToggle, themeKnob: !!themeKnob });
    return;
  }
  
  if (isDark) {
    htmlRoot.classList.add('dark');
    themeToggle.setAttribute('aria-checked', 'true');
    themeKnob.style.transform = 'translateX(32px)';
  } else {
    htmlRoot.classList.remove('dark');
    themeToggle.setAttribute('aria-checked', 'false');
    themeKnob.style.transform = 'translateX(0px)';
  }
}

function toggleTheme() {
  const htmlRoot = document.documentElement;
  const themeToggle = document.getElementById('theme-toggle');
  const themeKnob = document.getElementById('theme-knob');
  
  if (!themeToggle || !themeKnob) {
    console.warn('[Theme] Toggle elements not found');
    return;
  }
  
  const isCurrentlyDark = htmlRoot.classList.contains('dark');
  const newThemeDark = !isCurrentlyDark;
  
  if (newThemeDark) {
    htmlRoot.classList.add('dark');
    themeToggle.setAttribute('aria-checked', 'true');
    themeKnob.style.transform = 'translateX(32px)';
  } else {
    htmlRoot.classList.remove('dark');
    themeToggle.setAttribute('aria-checked', 'false');
    themeKnob.style.transform = 'translateX(0px)';
  }
  localStorage.setItem('rutacaribe_theme', newThemeDark ? 'dark' : 'light');
}

function initTheme() {
  const savedTheme = localStorage.getItem('rutacaribe_theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const shouldBeDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
  
  applyTheme(shouldBeDark);
}

// Expose globally immediately
window.applyTheme = applyTheme;
window.toggleTheme = toggleTheme;
window.initTheme = initTheme;