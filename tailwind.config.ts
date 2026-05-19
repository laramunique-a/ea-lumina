import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Brand oficial EA Lumina — Azul Celestial Premium
        brand: {
          50:  '#e0f2ff',
          100: '#bae2ff',
          200: '#7ccaff',
          300: '#3eb2ff',
          400: '#0090FF', // Cor oficial
          500: '#007adb',
          600: '#0062b0',
          700: '#004a85',
          800: '#00315a',
          900: '#00192f',
          950: '#000c17',
        },
        // Ouro Lumina — Sofisticação e Acento
        gold: {
          50:  '#fdf9ed',
          100: '#faf1d1',
          200: '#f4e0a3',
          300: '#eed075',
          400: '#e8bf47',
          500: '#C5A03F', // Cor oficial
          600: '#ab8a36',
          700: '#8c712c',
          800: '#6d5822',
          900: '#59481c',
          950: '#332910',
        },
        // Primary mapeado para o novo Azul
        primary: {
          50:  '#e0f2ff',
          100: '#bae2ff',
          200: '#7ccaff',
          300: '#3eb2ff',
          400: '#0090FF',
          500: '#C5A03F', // Midpoint Gold para contrastes premium
          600: '#0090FF',
          700: '#0062b0',
          800: '#004a85',
          900: '#00315a',
        },
        // Sand para fundos luxuosos
        sand: {
          50:  '#FDFCFB',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A',
        },
        surface: {
          DEFAULT: '#ffffff',
          50:  '#FAFAF9',
          100: '#F5F5F4',
          200: '#E7E7E4',
          300: '#D6D6D2',
        },
      },
      fontFamily: {
        sans:    ['Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'Inter', 'system-ui', 'sans-serif'], // Fonte mais premium para títulos
      },
      boxShadow: {
        'card':        '0 1px 3px 0 rgba(0,144,255,0.06), 0 1px 2px -1px rgba(0,144,255,0.04)',
        'card-hover':  '0 12px 32px -4px rgba(0,144,255,0.12), 0 4px 12px -2px rgba(0,144,255,0.06)',
        'brand-glow':  '0 0 25px rgba(0,144,255,0.25)',
        'gold-glow':   '0 0 20px rgba(197,160,63,0.30)',
        'inner-sm':    'inset 0 1px 2px rgba(0,0,0,0.05)',
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '24px',
        '4xl': '32px',
        pill:  '9999px',
      },
      backgroundImage: {
        'hero-mesh':     'radial-gradient(ellipse 80% 60% at 50% -20%, rgba(0,144,255,0.12), transparent)',
        'lumina-gradient': 'linear-gradient(135deg, #0090FF 0%, #0055AA 100%)',
        'gold-gradient':   'linear-gradient(135deg, #C5A03F 0%, #E8BF47 100%)',
        'sand-gradient': 'linear-gradient(135deg, #FDFCFB 0%, #F1F5F9 100%)',
      },
      animation: {
        'fade-in':    'fadeIn 0.3s ease-out',
        'slide-up':   'slideUp 0.4s cubic-bezier(0.16,1,0.3,1)',
        'scale-in':   'scaleIn 0.25s ease-out',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4,0,0.6,1) infinite',
        'float':      'float 6s ease-in-out infinite',
        'marquee':    'marquee 40s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%':   { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%':   { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-10px)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        }
      },
    },
  },
  plugins: [],
}

export default config
