/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './components/**/*.{vue,js,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './app.vue',
    './error.vue',
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#06070d',
          900: '#0a0c14',
          800: '#11141f',
          700: '#161a28',
          600: '#1f2336',
          500: '#2a2f48',
          400: '#3d4263',
          300: '#5b6088',
        },
        cyan: {
          400: '#5dfaff',
          500: '#22e6f1',
          600: '#0fb6c0',
        },
        violet: {
          400: '#9b6cff',
          500: '#7d3cff',
          600: '#5d1fd9',
        },
      },
      fontFamily: {
        sans: ['"Space Grotesk"', 'ui-sans-serif', 'system-ui'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        glow: '0 0 40px -10px rgba(34, 230, 241, 0.45)',
        glowViolet: '0 0 40px -10px rgba(125, 60, 255, 0.5)',
        card: '0 30px 80px -40px rgba(0, 0, 0, 0.8)',
      },
      backgroundImage: {
        'grid-fade':
          'radial-gradient(circle at 50% 0%, rgba(34,230,241,0.15), transparent 60%)',
        'aurora':
          'linear-gradient(135deg, rgba(34,230,241,0.25) 0%, rgba(125,60,255,0.25) 100%)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 8s linear infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
      },
    },
  },
  plugins: [],
};
