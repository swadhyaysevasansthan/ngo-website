/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // From first config
        primary: {
          // amber theme
          DEFAULT: '#f59e0b',   // amber-500
          dark: '#d97706',      // amber-600
          light: '#fbbf24',     // amber-400
          // you can optionally keep blue scale too if you want:
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        forest: '#0f172a',
        leaf: '#64748b',
        earth: '#43302b',
        sky: '#0ea5e9',
        sunset: '#fb923c',

        // From second config
        saffron: {
          500: '#ff9933',
          600: '#ff7f00',
        },
      },

      fontFamily: {
        // From first config
        sans: ['Inter', 'system-ui', 'sans-serif'],
        // From second config
        poppins: ['Poppins', 'sans-serif'],
      },

      screens: {
        // From second config
        nav: '1250px',
      },

      animation: {
        // From first config
        'fade-in': 'fadeIn 0.5s ease-in',
        'slide-up': 'slideUp 0.6s ease-out',
        'slide-down': 'slideDown 0.6s ease-out',
        'scale-in': 'scaleIn 0.4s ease-out',
        'float': 'float 20s ease-in-out infinite',
        'fall': 'fall 15s linear infinite',
        // From second config
        'scroll': 'scroll 30s linear infinite',
      },

      keyframes: {
        // From first config
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translate(0, 0) rotate(0deg)' },
          '33%': { transform: 'translate(50px, -50px) rotate(120deg)' },
          '66%': { transform: 'translate(-50px, 50px) rotate(240deg)' },
        },
        fall: {
          '0%': { top: '-10%', transform: 'rotate(0deg)' },
          '100%': { top: '110%', transform: 'rotate(360deg)' },
        },

        // From second config
        scroll: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-33.333%)' },
        },
      },
    },
  },
  plugins: [],
};
