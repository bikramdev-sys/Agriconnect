/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          50: '#F0FDF4',
          100: '#DCFCE7',
          200: '#BBF7D0',
          300: '#86EFAC',
          400: '#4ADE80',
          500: '#22C55E', // Fresh Green
          600: '#16A34A',
          700: '#15803D',
          800: '#166534',
          900: '#14532D', // Primary Forest Green
          950: '#052E16',
        },
        fresh: {
          DEFAULT: '#22C55E',
          light: '#4ADE80',
          dark: '#16A34A',
        },
        accent: {
          yellow: '#FACC15',
          gold: '#EAB308',
          amber: '#F59E0B',
        },
        cream: {
          DEFAULT: '#FAFAF5',
          soft: '#F4F4EB',
          warm: '#F7F7F0',
          surface: '#FAF7EE',
        },
        agriText: {
          main: '#14251B',
          muted: '#647067',
          subtle: '#8C9A90',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'Plus Jakarta Sans', 'sans-serif'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(20, 83, 45, 0.08)',
        'glass-hover': '0 12px 40px 0 rgba(20, 83, 45, 0.14)',
        'float': '0 20px 40px -15px rgba(20, 83, 45, 0.12)',
        'soft': '0 4px 20px -2px rgba(20, 37, 27, 0.05)',
        'premium': '0 10px 30px -5px rgba(20, 83, 45, 0.06), 0 0 0 1px rgba(20, 83, 45, 0.05)',
      },
      animation: {
        'float-slow': 'float 6s ease-in-out infinite',
        'float-reverse': 'floatReverse 7s ease-in-out infinite',
        'pulse-subtle': 'pulseSubtle 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        floatReverse: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(10px) rotate(-3deg)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.85' },
        },
      },
    },
  },
  plugins: [],
}
