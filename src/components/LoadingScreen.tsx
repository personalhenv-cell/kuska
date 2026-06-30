'use client'

import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Image from 'next/image'

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
  const [showSubtitle, setShowSubtitle] = useState(false)
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

    // Typewriter starts at 2.2s, ~100ms per letter
    const twTimer = setTimeout(() => {
      let i = 0
      const interval = setInterval(() => {
        setDisplayed(TYPEWRITER_TEXT.slice(0, i + 1))
        i++
        if (i === TYPEWRITER_TEXT.length) {
          clearInterval(interval)
          setTimeout(() => setShowSubtitle(true), 300)
        }
      }, 100)
    }, 2200)

    // Progress bar
    const start = Date.now()
    const tick = setInterval(() => {
      const pct = Math.min(100, ((Date.now() - start) / DURATION_MS) * 100)
      setProgress(pct)
      if (pct >= 100) setBurst(true)
    }, 40)

    // Rotate phrases every 1.3s
    const fraseTimer = setInterval(
      () => setFraseIndex((i) => (i + 1) % FRASES.length),
      1300,
    )

    // Gold flash at 6.6s then exit at 7.0s
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
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden"
        >
          {/* Animated gradient background (z-0) */}
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

          {/* Mountains — 3 solid planes with parallax (z-[1], above gradient, below content) */}
          <div className="absolute bottom-0 left-0 w-full overflow-hidden z-[1]" aria-hidden>
            {/* Back plane — moves right */}
            <motion.div
              className="absolute bottom-0 w-[200%]"
              style={{ left: '-50%', filter: 'drop-shadow(0 0 12px rgba(212,146,10,0.6))' }}
              animate={{ x: ['0%', '25%', '0%'] }}
              transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
            >
              <svg viewBox="0 0 2880 260" preserveAspectRatio="none" className="w-full">
                <path
                  d="M0 200 L240 80 L480 190 L720 50 L960 180 L1200 70 L1440 200 L1680 80 L1920 190 L2160 50 L2400 180 L2640 70 L2880 200 L2880 260 L0 260 Z"
                  fill="#1a4a42"
                />
              </svg>
            </motion.div>

            {/* Mid plane — moves left */}
            <motion.div
              className="absolute bottom-0 w-[180%]"
              style={{ left: '-15%', filter: 'drop-shadow(0 0 12px rgba(212,146,10,0.5))' }}
              animate={{ x: ['0%', '-22%', '0%'] }}
              transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
            >
              <svg viewBox="0 0 2592 220" preserveAspectRatio="none" className="w-full">
                <path
                  d="M0 160 L300 90 L600 155 L900 70 L1200 155 L1500 90 L1800 160 L2100 90 L2400 155 L2592 100 L2592 220 L0 220 Z"
                  fill="#2E7A6E"
                />
              </svg>
            </motion.div>

            {/* Front plane — moves right slowly */}
            <motion.div
              className="absolute bottom-0 w-[110%]"
              style={{ left: '-5%', filter: 'drop-shadow(0 0 14px rgba(212,146,10,0.7))' }}
              animate={{ x: ['0%', '6%', '0%'] }}
              transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
            >
              <svg viewBox="0 0 1584 180" preserveAspectRatio="none" className="w-full">
                <path
                  d="M0 140 L180 105 L360 132 L540 88 L720 128 L900 92 L1080 135 L1260 96 L1440 138 L1584 100 L1584 180 L0 180 Z"
                  fill="#3D1C02"
                />
              </svg>
            </motion.div>
          </div>

          {/* Bubbles (z-[2]) */}
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

          {/* Center content (z-10) */}
          <div className="relative z-10 flex flex-col items-center gap-8">
            {/* Logo with screen blend */}
            <motion.div
              initial={{ scale: 0.3, opacity: 0, filter: 'blur(24px)' }}
              animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
              transition={{ duration: 1.2, delay: 1.0, ease: [0.34, 1.56, 0.64, 1] }}
              className="relative"
            >
              <div className="h-28 w-28 overflow-hidden rounded-full">
                <Image
                  src="/logo.png"
                  alt="Kuska"
                  width={112}
                  height={112}
                  priority
                  className="h-full w-full object-contain"
                  style={{ mixBlendMode: 'screen' }}
                />
              </div>
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

            {/* Typewriter + subtitle */}
            <div className="text-center min-h-[90px] flex flex-col items-center gap-3">
              <div
                className="font-display text-6xl font-bold tracking-[0.45em] text-kuska-cream"
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

              <AnimatePresence>
                {showSubtitle && (
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    className="font-nunito text-xs tracking-[0.25em] uppercase text-kuska-gold"
                  >
                    Primera Plataforma Artesanal del Perú
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Bottom: progress bar + frase quechua */}
          <div className="absolute bottom-16 left-0 right-0 z-10 flex flex-col items-center gap-4">
            {/* Progress bar — multicolor gradient + burst at 100% */}
            <div className="relative h-1.5 w-72 overflow-visible rounded-full bg-white/10">
              <motion.div
                className="h-full rounded-full"
                style={{
                  width: `${progress}%`,
                  background:
                    'linear-gradient(90deg, #C84B2F 0%, #D4920A 33%, #2E7A6E 66%, #D4920A 100%)',
                  backgroundSize: '300% 100%',
                }}
                animate={{
                  backgroundPosition: ['100% 0%', '0% 0%'],
                  ...(burst
                    ? {
                        boxShadow: [
                          '0 0 0px rgba(212,146,10,0)',
                          '0 0 40px 10px rgba(212,146,10,0.9), 0 0 80px 20px rgba(200,75,47,0.5)',
                          '0 0 0px rgba(212,146,10,0)',
                        ],
                        scaleY: [1, 1.8, 1],
                      }
                    : {}),
                }}
                transition={
                  burst
                    ? { duration: 0.4, ease: 'easeOut' }
                    : { duration: 7, ease: 'linear' }
                }
              />
            </div>

            {/* Frase quechua — crossfade con blur */}
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

          {/* Gold flash overlay */}
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
