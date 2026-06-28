/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        kuska: {
          base:      '#0B0804',
          base2:     '#100C08',
          base3:     '#1A1208',
          brown:     '#3D1C02',
          brownMid:  '#5a2d0c',
          red:       '#C84B2F',
          redDark:   '#A83A22',
          redLight:  '#E05A3A',
          teal:      '#2E7A6E',
          tealLight: '#4A9D90',
          gold:      '#D4920A',
          goldLight: '#F0B429',
          cream:     '#F0EAE0',
          creamDark: '#C8BFB0',
          dark:      '#060402',
        },
      },
      fontFamily: {
        sans:  ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
      },
      animation: {
        'fade-in':       'fadeIn 0.6s ease-out forwards',
        'slide-up':      'slideUp 0.6s ease-out forwards',
        'slide-in-left': 'slideInLeft 0.6s ease-out forwards',
        'pulse-slow':    'pulse 3s ease-in-out infinite',
        'float':         'float 6s ease-in-out infinite',
        'glow':          'glow 2s ease-in-out infinite',
        'shimmer':       'shimmer 2s linear infinite',
        'spin-slow':     'spin 8s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%':   { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          '0%':   { opacity: '0', transform: 'translateX(-30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-12px)' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(212,146,10,0.3)' },
          '50%':      { boxShadow: '0 0 40px rgba(212,146,10,0.6)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      backgroundImage: {
        'gradient-kuska': 'linear-gradient(135deg, #3D1C02 0%, #5a2d0c 50%, #3D1C02 100%)',
        'gradient-hero':  'linear-gradient(135deg, #0B0804 0%, #1A1208 100%)',
        'gradient-card':  'linear-gradient(145deg, rgba(61,28,2,0.05) 0%, rgba(46,122,110,0.05) 100%)',
        'gradient-red':   'linear-gradient(135deg, #C84B2F 0%, #A83A22 100%)',
        'gradient-gold':  'linear-gradient(135deg, #D4920A 0%, #F0B429 100%)',
        'gradient-teal':  'linear-gradient(135deg, #2E7A6E 0%, #4A9D90 100%)',
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'kuska':      '0 4px 24px rgba(200,75,47,0.15)',
        'kuska-lg':   '0 8px 40px rgba(200,75,47,0.25)',
        'kuska-glow': '0 0 30px rgba(212,146,10,0.25)',
        'dark':       '0 4px 24px rgba(0,0,0,0.4)',
        'dark-lg':    '0 8px 40px rgba(0,0,0,0.6)',
      },
    },
  },
  plugins: [],
}
