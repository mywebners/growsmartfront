/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    screens: {
      xs: "400px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        outfit: ['Outfit', 'sans-serif'],
      },
      colors: {
        'career-primary': '#E11D74',
        'career-secondary': '#F43F8A',
        'career-accent': '#FF2D87',
        'bg-main': '#0D050A',
        'bg-card': '#170A12',
        'text-secondary': '#D8C7D0',
        'theme-border': '#3A1728',
        'glass-bg': 'rgba(23, 10, 18, 0.85)',
        'glass-border': '#3A1728',
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'orbit': 'orbit 20s linear infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'glow': 'glow 1.5s ease-in-out infinite alternate',
      },
      scrollbar: {
        DEFAULT: '8px',
        'thin': '2px',
        'thick': '12px',
      },
      scrollbarTrack: {
        DEFAULT: 'rgba(13, 5, 10, 0.8)',
        'hover': 'rgba(58, 23, 40, 0.5)',
        'glass': 'rgba(23, 10, 18, 0.4)',
      },
      scrollbarThumb: {
        DEFAULT: 'linear-gradient(to bottom, rgba(244,63,138,0.7), rgba(225,29,116,0.4))',
        'hover': 'linear-gradient(to bottom, rgba(255,45,135,0.85), rgba(244,63,138,0.5))',
        'active': 'linear-gradient(to bottom, rgba(255,107,168,0.9), rgba(225,29,116,0.6))',
      },

      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        orbit: {
          '0%': { transform: 'rotate(0deg) translateX(100px) rotate(0deg)' },
          '100%': { transform: 'rotate(360deg) translateX(100px) rotate(-360deg)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(225, 29, 116, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(255, 45, 135, 0.55)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px currentColor' },
          '100%': { boxShadow: '0 0 30px currentColor' },
        },
      },
    },
  },
  plugins: [],
}
