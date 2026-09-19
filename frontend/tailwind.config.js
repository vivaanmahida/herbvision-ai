export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ayur: {
          950: '#1a1410', 900: '#221b14', 800: '#2a2018',
          700: '#3d2e1e', 600: '#4f3c28', 500: '#6b5030',
          400: '#8b6940', 300: '#a8855a',
        },
        saffron: {
          300: '#f5c878', 400: '#f0b060', 500: '#e8a045',
          600: '#d4862a', 700: '#c4752a',
        },
        sandalwood: {
          200: '#f0dfc0', 300: '#e8c9a0', 400: '#d4a878',
          500: '#c4956a', 600: '#a87850',
        },
        herb: {
          gold: '#e8a045',
          cream: '#fdf6e3',
          sand: '#e8c9a0',
          bark: '#8b6940',
          earth: '#5c4033',
          sage: '#74b49b',
          leaf: '#2d6a4f',
          moss: '#3a5a40',
        },
      },
      fontFamily: {
        display: ["'Playfair Display'", "Georgia", "serif"],
        sans: ["'Inter'", "system-ui", "sans-serif"],
        lora: ["'Lora'", "Georgia", "serif"],
      },
      backgroundImage: {
        'ayur-gradient': 'linear-gradient(135deg, #1a1410 0%, #221b14 40%, #2a2018 70%, #3d2e1e 100%)',
        'gold-gradient': 'linear-gradient(135deg, #e8a045 0%, #d4862a 50%, #c4752a 100%)',
        'card-glass': 'linear-gradient(135deg, rgba(255,220,150,0.07) 0%, rgba(255,180,80,0.03) 100%)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 9s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'fade-up': 'fadeUp 0.6s ease-out forwards',
        'slide-in': 'slideIn 0.4s ease-out forwards',
        'spin-slow': 'spin 12s linear infinite',
        'shimmer': 'shimmer 1.5s linear infinite',
        'bounce-subtle': 'bounceSm 1.5s ease-in-out infinite',
      },
      keyframes: {
        float: { '0%, 100%': { transform: 'translateY(0px)' }, '50%': { transform: 'translateY(-18px)' } },
        pulseGlow: { '0%, 100%': { boxShadow: '0 0 12px rgba(232,160,69,0.3)' }, '50%': { boxShadow: '0 0 30px rgba(232,160,69,0.7)' } },
        fadeUp: { from: { opacity: '0', transform: 'translateY(24px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        slideIn: { from: { opacity: '0', transform: 'translateX(-20px)' }, to: { opacity: '1', transform: 'translateX(0)' } },
        shimmer: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
        bounceSm: { '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-4px)' } },
      },
      boxShadow: {
        glass: '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,220,150,0.1)',
        'glass-sm': '0 4px 16px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,220,150,0.08)',
        'gold-glow': '0 0 20px rgba(232,160,69,0.4), 0 4px 12px rgba(0,0,0,0.3)',
      },
    },
  },
  plugins: [],
};
