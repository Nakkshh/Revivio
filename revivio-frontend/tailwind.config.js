/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Revivio Brand Colors
        'brand-navy': '#142B3B',
        'brand-mint': '#27C6A5',

        // Light theme tokens
        'surface': '#FFFFFF',
        'background': '#F5F7F8',
        'text-primary': '#142B3B',
        'text-secondary': '#64748B',
        'border': '#E5EAF0',

        // Dark theme tokens (applied via CSS variables)
        'dark-bg': '#101E2C',
        'dark-surface': '#172A3A',
        'dark-elevated': '#1C3040',
        'dark-text': '#F5F8FA',
        'dark-text-secondary': '#A8BAC7',
        'dark-border': '#2B4050',

        // Semantic palette
        mint: {
          50: '#EDFAF7',
          100: '#D1F4EC',
          200: '#A3E9D9',
          300: '#75DEC6',
          400: '#47D3B3',
          500: '#27C6A5',
          600: '#1FA688',
          700: '#17876B',
          800: '#0F674E',
          900: '#074831',
        },
        navy: {
          50: '#E8EEF2',
          100: '#C6D3DC',
          200: '#8FA7B8',
          300: '#587B94',
          400: '#2A5570',
          500: '#142B3B',
          600: '#112432',
          700: '#0E1D29',
          800: '#0B1620',
          900: '#080F17',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      fontSize: {
        'display': ['3.5rem', { lineHeight: '1.1', letterSpacing: '-0.03em', fontWeight: '700' }],
        'h1': ['2.25rem', { lineHeight: '1.2', letterSpacing: '-0.02em', fontWeight: '700' }],
        'h2': ['1.875rem', { lineHeight: '1.3', letterSpacing: '-0.015em', fontWeight: '600' }],
        'h3': ['1.5rem', { lineHeight: '1.35', letterSpacing: '-0.01em', fontWeight: '600' }],
        'h4': ['1.25rem', { lineHeight: '1.4', letterSpacing: '-0.008em', fontWeight: '600' }],
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(20,43,59,0.08), 0 1px 2px -1px rgba(20,43,59,0.06)',
        'card-hover': '0 4px 12px 0 rgba(20,43,59,0.12), 0 2px 4px -1px rgba(20,43,59,0.08)',
        'dropdown': '0 8px 24px rgba(20,43,59,0.14)',
        'modal': '0 20px 60px rgba(20,43,59,0.20)',
        'brand': '0 4px 24px rgba(39,198,165,0.25)',
      },
      borderRadius: {
        'DEFAULT': '0.5rem',
        'card': '0.75rem',
        'modal': '1rem',
        'pill': '999px',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-in-out',
        'slide-up': 'slideUp 0.2s ease-out',
        'pulse-soft': 'pulseSoft 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 1.5s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      transitionProperty: {
        'theme': 'background-color, border-color, color, fill, stroke',
      },
      transitionDuration: {
        'theme': '200ms',
      },
    },
  },
  plugins: [],
}
