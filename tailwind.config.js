/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          900: '#090d16',
          800: '#0f172a',
          700: '#1e293b',
          600: '#334155',
          accent: '#ef4444',
          accentGlow: '#f87171',
          neon: '#06b6d4',
          emerald: '#10b981',
          amber: '#f59e0b'
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'Courier New', 'monospace'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif']
      },
      boxShadow: {
        'glow-red': '0 0 15px -3px rgba(239, 68, 68, 0.3)',
        'glow-cyan': '0 0 15px -3px rgba(6, 182, 212, 0.3)',
        'glow-emerald': '0 0 15px -3px rgba(16, 185, 129, 0.3)',
      }
    },
  },
  plugins: [],
}
