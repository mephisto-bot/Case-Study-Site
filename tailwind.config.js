/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#040d1a',
          900: '#07152b',
          850: '#091932',
          800: '#0c2340',
          700: '#14345d',
          600: '#1e487e',
          100: '#e6effa',
          50: '#f0f5fc',
        },
        brand: {
          orange: '#f05a22',
          'orange-hover': '#d94c17',
          'orange-light': '#fff3eb',
          'orange-glow': 'rgba(240, 90, 34, 0.25)',
          blue: '#07152b',
          'blue-card': '#0b1d38',
          'blue-light': '#f4f7fb',
          slate: '#475569',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(7, 21, 43, 0.06), 0 2px 6px -1px rgba(7, 21, 43, 0.04)',
        'elevated': '0 12px 32px -4px rgba(7, 21, 43, 0.12), 0 4px 12px -2px rgba(7, 21, 43, 0.06)',
        'orange-glow': '0 8px 24px -4px rgba(240, 90, 34, 0.35)',
      }
    },
  },
  plugins: [],
}
