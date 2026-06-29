'use client'

import { motion } from 'framer-motion'
import { useLanguage } from '@/contexts/LanguageContext'

export default function LanguageToggle({ variant = 'dark' }: { variant?: 'dark' | 'light' }) {
  const { lang, setLang } = useLanguage()
  const isDark = variant === 'dark'

  return (
    <div
      className="relative inline-flex items-center rounded-full p-0.5 select-none"
      style={{
        background: isDark ? 'rgba(245,240,232,0.12)' : 'rgba(61,28,2,0.08)',
        border: `1px solid ${isDark ? 'rgba(212,146,10,0.25)' : 'rgba(61,28,2,0.12)'}`,
      }}
      role="group"
      aria-label="Selector de idioma"
    >
      {(['es', 'qu'] as const).map(code => {
        const active = lang === code
        return (
          <button
            key={code}
            onClick={() => setLang(code)}
            className="btn-press relative z-10 px-2.5 py-1 text-xs font-bold rounded-full transition-colors duration-200"
            style={{ color: active ? '#FFFFFF' : isDark ? 'rgba(245,240,232,0.6)' : 'rgba(61,28,2,0.55)' }}
            aria-pressed={active}
          >
            {active && (
              <motion.span
                layoutId="lang-pill"
                className="absolute inset-0 rounded-full -z-10"
                style={{ background: '#C84B2F' }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            {code === 'es' ? 'ES' : 'QU'}
          </button>
        )
      })}
    </div>
  )
}
