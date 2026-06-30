'use client'

import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Image from 'next/image'
import { Kusi } from '@/components/ui/Kusi'

const STORAGE_KEY = 'kuska_loaded_v8'
const DURATION_MS = 7000

const frases = [
  'Kawsay... Cargando vida 🌱',
  'Hatun sueños, hatun corazón ✨',
  'Kuska teqsimuyu... Juntos al mundo 🌍',
  'Sumaq llankay... Bello trabajo 🏺',
  'Arte que nace del alma peruana 🇵🇪',
  'Conectando manos que crean mundos 🦙',
  'Munay kawsay... Amor y vida 💛',
  'Cada tejido cuenta una historia 🧶',
]

interface Particle {
  left: string
  delay: string
  duration: string
  size: number
}

export function LoadingScreen() {
  const [visible, setVisible] = useState(false)
  const [progress, setProgress] = useState(0)
  const [fraseIndex, setFraseIndex] = useState(0)

  const particles = useMemo<Particle[]>(
    () =>
      Array.from({ length: 50 }).map(() => ({
        left: `${Math.random() * 100}%`,
        delay: `${Math.random() * 4}s`,
        duration: `${3 + Math.random() * 4}s`,
        size: 2 + Math.random() * 5,
      })),
    [],
  )

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY)) return
    setVisible(true)

    const start = Date.now()
    const tick = setInterval(() => {
      const pct = Math.min(100, ((Date.now() - start) / DURATION_MS) * 100)
      setProgress(pct)
    }, 40)

    const fraseTimer = setInterval(
      () => setFraseIndex((i) => (i + 1) % frases.length),
      2500,
    )

    const done = setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, '1')
      setVisible(false)
    }, DURATION_MS)

    return () => {
      clearInterval(tick)
      clearInterval(fraseTimer)
      clearTimeout(done)
    }
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden"
          style={{
            background:
              'linear-gradient(135deg, #3D1C02 0%, #2E7A6E 60%, #1a3a35 100%)',
          }}
        >
          {/* Partículas doradas */}
          {particles.map((p, i) => (
            <span
              key={i}
              className="absolute rounded-full bg-kuska-gold/70"
              style={{
                left: p.left,
                bottom: '-10px',
                width: p.size,
                height: p.size,
                animation: `kusi-float ${p.duration} ease-in-out ${p.delay} infinite`,
              }}
            />
          ))}

          {/* Montañas andinas */}
          <svg
            className="absolute bottom-0 left-0 w-full"
            viewBox="0 0 1440 320"
            preserveAspectRatio="none"
            aria-hidden
          >
            <path
              fill="rgba(26,58,53,0.6)"
              d="M0 220 L240 90 L480 200 L720 60 L960 190 L1200 80 L1440 200 L1440 320 L0 320 Z"
            />
            <path
              fill="rgba(46,122,110,0.5)"
              d="M0 260 L300 160 L600 250 L900 150 L1200 240 L1440 170 L1440 320 L0 320 Z"
            />
          </svg>

          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 120, damping: 12 }}
            className="relative z-10 flex flex-col items-center gap-5"
          >
            <Image
              src="/logo.png"
              alt="Kuska"
              width={160}
              height={160}
              priority
              className="h-auto w-32 object-contain drop-shadow-xl"
            />
            <Kusi size="lg" animation="bounce" priority />
          </motion.div>

          <div className="relative z-10 mt-8 flex flex-col items-center gap-4">
            <div className="h-2 w-64 overflow-hidden rounded-full bg-white/20">
              <div
                className="h-full rounded-full bg-kuska-gold transition-[width] duration-75"
                style={{ width: `${progress}%` }}
              />
            </div>
            <AnimatePresence mode="wait">
              <motion.p
                key={fraseIndex}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.4 }}
                className="font-nunito text-sm text-kuska-cream/90"
              >
                {frases[fraseIndex]}
              </motion.p>
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
