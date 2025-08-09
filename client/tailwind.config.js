/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Microsoft Azure inspired colors
        'azure': {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        'microsoft': {
          blue: '#0078d4',
          dark: '#1b1b1b',
          gray: '#f3f2f1',
          light: '#ffffff',
          accent: '#106ebe',
        },
        'status': {
          healthy: '#107c10',
          warning: '#ff8c00',
          critical: '#d13438',
          degraded: '#ffb900',
        }
      },
      fontFamily: {
        'segoe': ['Segoe UI', 'Tahoma', 'Geneva', 'Verdana', 'sans-serif'],
        'mono': ['Cascadia Code', 'Consolas', 'Monaco', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      },
      boxShadow: {
        'microsoft': '0 2px 8px rgba(0, 0, 0, 0.1)',
        'microsoft-lg': '0 4px 16px rgba(0, 0, 0, 0.15)',
      }
    },
  },
  plugins: [],
} 