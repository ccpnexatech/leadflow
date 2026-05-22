/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: '#080C08',
        surface: '#0F140F',
        accent: '#22C55E',
        'accent-dim': '#16A34A',
        'text-primary': '#E8F5E8',
        'text-secondary': '#6B7A6B',
        danger: '#EF4444',
        warning: '#F59E0B',
        border: '#1A2A1A',
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
        sans: ['DM Sans', 'Outfit', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
