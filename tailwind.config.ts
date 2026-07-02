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
        kuska: {
          brown: '#3D1C02',
          red: '#C84B2F',
          teal: '#2E7A6E',
          gold: '#D4920A',
          cream: '#F5F0E8',
          'cream-dark': '#EDE8DE',
          white: '#FFFFFF',
          text: '#1A0A00',
          'text-mid': '#6B4C35',
          border: 'rgba(61,28,2,0.12)',
        },
      },
      fontFamily: {
        display: ['var(--font-playfair)', 'Georgia', 'serif'],
        body: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        nunito: ['var(--font-nunito)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        h1: ['72px', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
        h2: ['48px', { lineHeight: '1.1', fontWeight: '700' }],
        h3: ['32px', { lineHeight: '1.2', fontWeight: '600' }],
      },
      borderRadius: {
        btn: '12px',
        card: '20px',
        modal: '28px',
        glass: '24px',
      },
      spacing: {
        '18': '4.5rem',
      },
      keyframes: {
        'kusi-float': {
          '0%,100%': { transform: 'translateY(0px) rotate(0deg)' },
          '33%': { transform: 'translateY(-14px) rotate(1.5deg)' },
          '66%': { transform: 'translateY(-7px) rotate(-1deg)' },
        },
        'kusi-wave': {
          '0%,100%': { transform: 'rotate(0deg)' },
          '20%': { transform: 'rotate(22deg)' },
          '40%': { transform: 'rotate(-12deg)' },
          '60%': { transform: 'rotate(18deg)' },
          '80%': { transform: 'rotate(-6deg)' },
        },
        'kusi-bounce': {
          '0%': { transform: 'translateY(60px) scale(0.8)', opacity: '0' },
          '60%': { transform: 'translateY(-12px) scale(1.06)', opacity: '1' },
          '80%': { transform: 'translateY(5px) scale(0.97)' },
          '100%': { transform: 'translateY(0) scale(1)', opacity: '1' },
        },
        'kusi-celebrate': {
          '0%': { transform: 'scale(1) rotate(0deg)' },
          '25%': { transform: 'scale(1.2) rotate(12deg)' },
          '50%': { transform: 'scale(1.2) rotate(-12deg)' },
          '75%': { transform: 'scale(1.1) rotate(6deg)' },
          '100%': { transform: 'scale(1) rotate(0deg)' },
        },
        'kusi-think': {
          '0%,100%': { transform: 'rotate(0deg) translateY(0)' },
          '50%': { transform: 'rotate(-6deg) translateY(-4px)' },
        },
        'kusi-idle': {
          '0%,100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.04)' },
        },
        'kusi-sleep': {
          '0%,100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-3px) rotate(2deg)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'underline-grow': {
          '0%': { transform: 'scaleX(0)' },
          '100%': { transform: 'scaleX(1)' },
        },
        'ripple-expand': {
          '0%': { transform: 'scale(0)', opacity: '0.55' },
          '100%': { transform: 'scale(1)', opacity: '0' },
        },
      },
      animation: {
        'kusi-float': 'kusi-float 3.5s ease-in-out infinite',
        'kusi-wave': 'kusi-wave 2.5s ease-in-out infinite',
        'kusi-bounce': 'kusi-bounce 0.8s cubic-bezier(0.36,0.07,0.19,0.97)',
        'kusi-celebrate': 'kusi-celebrate 0.9s ease-in-out',
        'kusi-think': 'kusi-think 3s ease-in-out infinite',
        'kusi-idle': 'kusi-idle 4s ease-in-out infinite',
        'kusi-sleep': 'kusi-sleep 5s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
        'ripple-expand': 'ripple-expand 0.6s ease-out forwards',
      },
    },
  },
  plugins: [],
}

export default config
