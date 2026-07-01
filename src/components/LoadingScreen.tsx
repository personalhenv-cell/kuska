'use client'

import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Image from 'next/image'
import { Logo } from '@/components/ui/Logo'

const STORAGE_KEY = 'kuska_loaded_v8'
const DURATION_MS = 7000
const TYPEWRITER_TEXT = 'KUSKA'

const FRASES = [
  'Kawsay ñawpaqmanta — El alma que despierta',
  'Sumaq kawsay — Belleza que trasciende',
  'Tejido a mano, conectado al mundo',
  'Cada hilo, una historia milenaria',
  'Munay sunqu — Amor que se hereda',
  'De los Andes al planeta entero',
  'Hatun muyu — El círculo se agranda',
  'Arte que el tiempo no puede borrar',
  'Kuska: juntos somos más fuertes',
  'Llamkay kallpa — La fuerza del trabajo',
]

// Material Design standard easing
const EASE: [number, number, number, number] = [0.4, 0, 0.2, 1]

interface Bubble {
  left: number
  size: number
  durationS: number
  delayS: number
  color: string
  blur: string
  xAmplitude: number
}

export function LoadingScreen() {
  const [visible, setVisible] = useState(false)
  const [progress, setProgress] = useState(0)
  const [fraseIndex, setFraseIndex] = useState(0)
  const [displayed, setDisplayed] = useState('')
  const [burst, setBurst] = useState(false)
  const [flash, setFlash] = useState(false)

  const bubbles = useMemo<Bubble[]>(
    () =>
      Array.from({ length: 50 }).map(() => {
        const size = 4 + Math.random() * 20
        const isGold = Math.random() > 0.4
        return {
          left: Math.random() * 100,
          size,
          durationS: 6 + Math.random() * 8,
          delayS: Math.random() * 5,
          color: isGold
            ? `rgba(212,146,10,${(0.2 + Math.random() * 0.4).toFixed(2)})`
            : `rgba(245,240,232,${(0.1 + Math.random() * 0.2).toFixed(2)})`,
          blur: size < 8 ? '1px' : '0px',
          xAmplitude: 20 + Math.random() * 40,
        }
      }),
    [],
  )

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY)) return
    setVisible(true)

    // Typewriter starts at 2.2s
    const twTimer = setTimeout(() => {
      let i = 0
      const iv = setInterval(() => {
        setDisplayed(TYPEWRITER_TEXT.slice(0, i + 1))
        i++
        if (i === TYPEWRITER_TEXT.length) clearInterval(iv)
      }, 100)
    }, 2200)

    // Progress bar tick
    const start = Date.now()
    const tick = setInterval(() => {
      const pct = Math.min(100, ((Date.now() - start) / DURATION_MS) * 100)
      setProgress(pct)
      if (pct >= 100) {
        clearInterval(tick)
        setBurst(true)
      }
    }, 40)

    // Rotate phrases every 1.3s
    const fraseTimer = setInterval(
      () => setFraseIndex((i) => (i + 1) % FRASES.length),
      1300,
    )

    // Gold flash at 6.6s → exit at 7.0s
    const flashTimer = setTimeout(() => {
      setFlash(true)
      setTimeout(() => {
        localStorage.setItem(STORAGE_KEY, '1')
        setVisible(false)
      }, 400)
    }, 6600)

    return () => {
      clearTimeout(twTimer)
      clearInterval(tick)
      clearInterval(fraseTimer)
      clearTimeout(flashTimer)
    }
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, filter: 'blur(16px)' }}
          transition={{ duration: 0.5, ease: EASE }}
          className="fixed inset-0 z-[100] overflow-hidden"
        >
          {/* Layer 0 — Animated gradient */}
          <motion.div
            className="absolute inset-0 z-0"
            animate={{
              background: [
                'linear-gradient(135deg, #1a1410 0%, #3D1C02 50%, #2E7A6E 100%)',
                'linear-gradient(190deg, #2E7A6E 0%, #1a1410 45%, #3D1C02 100%)',
                'linear-gradient(135deg, #3D1C02 0%, #2E7A6E 55%, #1a1410 100%)',
                'linear-gradient(135deg, #1a1410 0%, #3D1C02 50%, #2E7A6E 100%)',
              ],
            }}
            transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
          />

          {/* Layer 0.5 — Textura fotográfica de montañas reales, integrada al tono nocturno */}
          <motion.div
            className="absolute inset-0 overflow-hidden pointer-events-none z-0"
            animate={{ y: [0, 14, 0] }}
            transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
            aria-hidden
          >
            <div className="absolute bottom-0 h-[48%] w-full opacity-[0.22] mix-blend-luminosity">
              <Image
                src="/mountains-peru-view.png"
                alt=""
                fill
                className="object-cover"
                style={{ objectPosition: '50% 35%' }}
              />
            </div>
            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(180deg, transparent 0%, rgba(26,20,16,0.7) 55%, #1a1410 100%)',
              }}
            />
          </motion.div>

          {/* Layer 1 — Mountains (CSS keyframes, seamless loops via 200%-wide SVGs) */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none z-[1]" aria-hidden>
            {/* Far — #1a4a42 — 40s */}
            <svg
              className="absolute bottom-0 animate-mountain-far"
              style={{
                width: '200%',
                height: '40%',
                filter: 'drop-shadow(0 0 16px rgba(212,146,10,0.75))',
              }}
              viewBox="0 0 3840 400"
              preserveAspectRatio="none"
            >
              <path
                d="M0 400 L0 250 L240 80 L480 190 L720 50 L960 180 L1200 70 L1440 190 L1680 80 L1920 250 L2160 80 L2400 190 L2640 50 L2880 180 L3120 70 L3360 190 L3600 80 L3840 250 L3840 400 Z"
                fill="#1a4a42"
                stroke="rgba(212,146,10,0.35)"
                strokeWidth="2"
              />
            </svg>

            {/* Mid — #2E7A6E — 28s (starts offset -10%) */}
            <svg
              className="absolute bottom-0 animate-mountain-mid"
              style={{
                width: '200%',
                height: '32%',
                filter: 'drop-shadow(0 0 14px rgba(212,146,10,0.65))',
              }}
              viewBox="0 0 3840 320"
              preserveAspectRatio="none"
            >
              <path
                d="M0 320 L0 200 L300 90 L600 155 L900 70 L1200 155 L1500 90 L1920 200 L2220 90 L2520 155 L2820 70 L3120 155 L3420 90 L3840 200 L3840 320 Z"
                fill="#2E7A6E"
                stroke="rgba(212,146,10,0.4)"
                strokeWidth="2"
              />
            </svg>

            {/* Near — #3D1C02 — 18s (starts offset -5%) */}
            <svg
              className="absolute bottom-0 animate-mountain-near"
              style={{
                width: '200%',
                height: '22%',
                filter: 'drop-shadow(0 0 18px rgba(212,146,10,0.85))',
              }}
              viewBox="0 0 3840 220"
              preserveAspectRatio="none"
            >
              <path
                d="M0 220 L0 140 L250 90 L450 130 L700 60 L900 120 L1150 80 L1400 130 L1920 140 L2170 90 L2370 130 L2620 60 L2820 120 L3070 80 L3320 130 L3840 140 L3840 220 Z"
                fill="#3D1C02"
                stroke="rgba(212,146,10,0.5)"
                strokeWidth="2.5"
              />
            </svg>
          </div>

          {/* Layer 2 — Bubbles */}
          {bubbles.map((b, i) => (
            <motion.span
              key={i}
              className="absolute rounded-full pointer-events-none z-[2]"
              style={{
                left: `${b.left}%`,
                bottom: '-30px',
                width: b.size,
                height: b.size,
                background: b.color,
                filter: `blur(${b.blur})`,
              }}
              animate={{
                y: [0, -1400],
                x: [0, b.xAmplitude, -(b.xAmplitude / 2), b.xAmplitude / 3, 0],
              }}
              transition={{
                duration: b.durationS,
                delay: b.delayS,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
          ))}

          {/* Layer 10 — Main content: Logo → Typewriter → Frases → Barra */}
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-8 px-6">
            {/* Logo */}
            <motion.div
              initial={{ scale: 0.3, opacity: 0, filter: 'blur(24px)' }}
              animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
              transition={{ duration: 0.7, delay: 1.0, ease: EASE }}
              className="relative"
            >
              <Logo size={112} variant="dark" priority />
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{
                  boxShadow:
                    '0 0 32px 10px rgba(212,146,10,0.30), 0 0 64px 24px rgba(212,146,10,0.10)',
                }}
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              />
            </motion.div>

            {/* Typewriter KUSKA */}
            <div
              className="font-display text-6xl font-bold tracking-[0.45em] text-kuska-cream min-h-[80px] text-center"
              style={{ textShadow: '0 0 48px rgba(212,146,10,0.55)' }}
            >
              {displayed}
              {displayed.length < TYPEWRITER_TEXT.length && (
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
                  className="text-kuska-gold ml-1"
                >
                  |
                </motion.span>
              )}
            </div>

            {/* Frases quechua — gap-6 above barra */}
            <div className="min-h-[24px] text-center">
              <AnimatePresence mode="wait">
                <motion.p
                  key={fraseIndex}
                  initial={{ opacity: 0, y: 8, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -8, filter: 'blur(4px)' }}
                  transition={{ duration: 0.4, ease: 'easeInOut' }}
                  className="font-nunito text-sm text-kuska-cream/80"
                >
                  {FRASES[fraseIndex]}
                </motion.p>
              </AnimatePresence>
            </div>

            {/* Progress bar — multicolor + burst at 100% */}
            <div className="relative h-2 w-72 rounded-full bg-white/10 overflow-visible">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${progress}%`,
                  transition: 'width 75ms linear',
                  background:
                    'linear-gradient(90deg, #C84B2F 0%, #D4920A 33%, #2E7A6E 66%, #D4920A 100%)',
                  backgroundSize: '300% 100%',
                  backgroundPosition: `${100 - progress}% 0%`,
                  boxShadow: burst
                    ? '0 0 60px 20px rgba(212,146,10,1), 0 0 120px 40px rgba(200,75,47,0.6)'
                    : 'none',
                }}
              />
              {/* Radial burst expanding from bar — doble pulso */}
              {burst && (
                <>
                  <motion.div
                    className="absolute inset-0 rounded-full pointer-events-none"
                    initial={{ scale: 0, opacity: 1 }}
                    animate={{ scale: 4, opacity: 0 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    style={{
                      background:
                        'radial-gradient(ellipse, rgba(212,146,10,0.9) 0%, rgba(200,75,47,0.5) 40%, transparent 70%)',
                    }}
                  />
                  <motion.div
                    className="absolute inset-0 rounded-full pointer-events-none"
                    initial={{ scale: 0, opacity: 0.8 }}
                    animate={{ scale: 7, opacity: 0 }}
                    transition={{ duration: 0.8, delay: 0.15, ease: 'easeOut' }}
                    style={{
                      background:
                        'radial-gradient(ellipse, rgba(212,146,10,0.7) 0%, rgba(46,122,110,0.35) 45%, transparent 70%)',
                    }}
                  />
                </>
              )}
            </div>
          </div>

          {/* Layer 20 — Gold flash */}
          {flash && (
            <motion.div
              className="absolute inset-0 z-20 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.4, 0] }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              style={{ background: '#D4920A' }}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
