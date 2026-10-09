/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "primary-container": "#f37021",
        "on-primary-container": "#541f00",
        "primary": "#a04100",
        "on-primary": "#ffffff",
        "primary-fixed": "#ffdbcb",
        "primary-fixed-dim": "#ffb693",
        "secondary": "#525f71",
        "on-secondary": "#ffffff",
        "secondary-container": "#d3e1f6",
        "on-secondary-container": "#566475",
        "tertiary": "#545f73",
        "on-tertiary": "#ffffff",
        "tertiary-container": "#8c97ad",
        "on-tertiary-container": "#242f42",
        "background": "#f7f9ff",
        "on-background": "#141c24",
        "surface": "#f7f9ff",
        "on-surface": "#141c24",
        "surface-dim": "#d2dbe6",
        "surface-bright": "#f7f9ff",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#ecf4ff",
        "surface-container": "#e6effa",
        "surface-container-high": "#e0e9f4",
        "surface-container-highest": "#dae3ef",
        "outline": "#8c7166",
        "outline-variant": "#e0c0b2",
        "error": "#ba1a1a",
        "on-error": "#ffffff",
        "error-container": "#ffdad6",
        "on-error-container": "#93000a"
      },
      borderRadius: {
        "DEFAULT": "0.125rem",
        "lg": "0.25rem",
        "xl": "0.5rem",
        "full": "0.75rem"
      },
      spacing: {
        "space-xs": "0.25rem",
        "space-sm": "0.5rem",
        "space-md": "0.75rem",
        "space-lg": "1.25rem",
        "space-xl": "2rem",
        "gutter": "1rem",
        "gutter-mobile": "0.75rem",
        "margin": "1.5rem",
        "margin-mobile": "1rem"
      },
      fontFamily: {
        "body-md": ["Inter", "sans-serif"],
        "headline-sm": ["Inter", "sans-serif"],
        "headline-md": ["Inter", "sans-serif"],
        "headline-lg": ["Inter", "sans-serif"],
        "headline-xl": ["Inter", "sans-serif"],
        "label-lg": ["Inter", "sans-serif"],
        "label-md": ["Inter", "sans-serif"],
        "label-sm": ["Inter", "sans-serif"]
      }
    }
  }
}