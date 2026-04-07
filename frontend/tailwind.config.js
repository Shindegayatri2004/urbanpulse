/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          50: '#e0f7ff',
          100: '#b3ecff',
          200: '#7ddeff',
          300: '#38ccff',
          400: '#00b8f5',
          500: '#009ed6',
          600: '#007fb0',
          700: '#005f85',
          800: '#003f5a',
          900: '#002030',
        },
        neon: {
          blue: '#00d4ff',
          cyan: '#00ffea',
          green: '#00ff88',
          yellow: '#ffee00',
          orange: '#ff8800',
          red: '#ff2244',
          purple: '#9b59ff',
        },
      },
      fontFamily: {
        orbitron: ['Orbitron', 'sans-serif'],
        rajdhani: ['Rajdhani', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'neon-blue': '0 0 20px rgba(0, 212, 255, 0.5), 0 0 40px rgba(0, 212, 255, 0.2)',
        'neon-green': '0 0 20px rgba(0, 255, 136, 0.5)',
        'neon-red': '0 0 20px rgba(255, 34, 68, 0.5)',
        'neon-orange': '0 0 20px rgba(255, 136, 0, 0.5)',
        'glow': '0 0 30px rgba(0, 212, 255, 0.3)',
      },
      animation: {
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'scan': 'scan 2s linear infinite',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(0,212,255,0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(0,212,255,0.8), 0 0 60px rgba(0,212,255,0.3)' },
        },
      },
      backgroundImage: {
        'grid-pattern': 'linear-gradient(rgba(0,212,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.05) 1px, transparent 1px)',
        'cyber-gradient': 'linear-gradient(135deg, #0a0e1a 0%, #0d1829 50%, #0a1520 100%)',
      },
      backgroundSize: {
        'grid': '50px 50px',
      },
    },
  },
  plugins: [],
};
