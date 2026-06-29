'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Image from 'next/image'

const STORAGE_KEY = 'kuska_loaded_v7'

const PHRASES = [
  { qu: 'Allinllachu',        es: 'Te damos la bienvenida' },
  { qu: 'Awashanchik…',       es: 'Tejiendo historias' },
  { qu: 'Makikunap kallpan',  es: 'La fuerza de las manos' },
  { qu: 'Kuska kanchik',      es: 'Estamos juntos' },
]

type Phase = 'init' | 'loading' | 'ready'

export default function LoadingScreen() {
  // 'init' renderiza null → SSR y primer render cliente coinciden (sin mismatch)
  const [phase, setPhase] = useState<Phase>('init')
  const [idx, setIdx] = useState(0)

  useEffect(() => {
    let seen = false
    try { seen = localStorage.getItem(STORAGE_KEY) === '1' } catch { /* noop */ }
    if (seen) { setPhase('ready'); return }

    requestAnimationFrame(() => setPhase('loading'))
    const rotate = setInterval(() => setIdx(i => (i + 1) % PHRASES.length), 650)
    const done = setTimeout(() => {
      try { localStorage.setItem(STORAGE_KEY, '1') } catch { /* noop */ }
      setPhase('ready')
    }, 2100)

    return () => { clearInterval(rotate); clearTimeout(done) }
  }, [])

  if (phase === 'init' || phase === 'ready') return null

  const p = PHRASES[idx]

  return (
    <AnimatePresence>
      <motion.div
        key="loading"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
        style={{ background: '#3D1C02' }}
      >
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="kusi-idle"
        >
          <Image src="/logo.png" alt="Kuska" width={96} height={96} priority className="rounded-3xl shadow-2xl" />
        </motion.div>

        <div className="h-10 mt-8 overflow-hidden text-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={idx}
              initial={{ y: 16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -16, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-[#F5F0E8] font-display text-lg font-bold">{p.qu}</p>
              <p className="text-[#F5F0E8]/55 text-xs">{p.es}</p>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-6 w-32 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(245,240,232,0.15)' }}>
          <motion.div
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 2.1, ease: 'easeInOut' }}
            className="h-full"
            style={{ background: 'linear-gradient(90deg,#C84B2F,#D4920A)' }}
          />
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
