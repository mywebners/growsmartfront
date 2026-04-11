/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
      colors: {
        'career-primary': '#4f46e5',
        'career-secondary': '#7c3aed',
        'career-accent': '#10b981',
        'glass-bg': 'rgba(255, 255, 255, 0.1)',
        'glass-border': 'rgba(255, 255, 255, 0.2)',
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
        DEFAULT: 'rgba(255, 255, 255, 0.05)',
        'hover': 'rgba(255, 255, 255, 0.1)',
        'glass': 'rgba(255, 255, 255, 0.02)',
      },
      scrollbarThumb: {
        DEFAULT: 'linear-gradient(to bottom, rgba(255,255,255,0.3), rgba(255,255,255,0.1))',
        'hover': 'linear-gradient(to bottom, rgba(255,255,255,0.6), rgba(255,255,255,0.2))',
        'active': 'linear-gradient(to bottom, rgba(255,255,255,0.8), rgba(255,255,255,0.4))',
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
          '0%, 100%': { boxShadow: '0 0 20px rgba(79, 70, 229, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(79, 70, 229, 0.6)' },
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

