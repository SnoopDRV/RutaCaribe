/**
 * Theme Utility
 * Dark/light mode toggle with localStorage persistence
 */

export function applyTheme(isDark) {
  const htmlRoot = document.documentElement;
  const themeToggle = document.getElementById('theme-toggle');
  const themeKnob = document.getElementById('theme-knob');
  
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

export function initTheme() {
  const themeToggle = document.getElementById('theme-toggle');
  const htmlRoot = document.documentElement;
  
  const savedTheme = localStorage.getItem('rutacaribe_theme');
  if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    applyTheme(true);
  } else {
    applyTheme(false);
  }

  themeToggle.addEventListener('click', () => {
    const isCurrentlyDark = htmlRoot.classList.contains('dark');
    const newThemeDark = !isCurrentlyDark;
    applyTheme(newThemeDark);
    localStorage.setItem('rutacaribe_theme', newThemeDark ? 'dark' : 'light');
  });
}