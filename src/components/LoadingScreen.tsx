'use client'

import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Image from 'next/image'

const STORAGE_KEY = 'kuska_loaded_v8'
const DURATION_MS = 10000
const TYPEWRITER_TEXT = 'KUSKA'

const FRASES = [
  'Kawsay... Vida y plenitud 🌱',
  'Sumaq llankay... Bello trabajo 🏺',
  'Tinkuy... El encuentro sagrado ✨',
  'Munay... Amor que transforma 💛',
  'Yachay... Sabiduría ancestral 🦙',
  'Suyay... Esperanza compartida 🌍',
  'Llankay... Trabajo con propósito 🧶',
  'Sonqo... El corazón del arte 🇵🇪',
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
  const [shimmer, setShimmer] = useState(false)
  const [flash, setFlash] = useState(false)

  const bubbles = useMemo<Bubble[]>(
    () =>
      Array.from({ length: 50 }).map(() => {
        const size = 4 + Math.random() * 20
        const isGold = Math.random() > 0.4
        return {
          left: Math.random() * 100,
          size,
          durationS: 8 + Math.random() * 12,
          delayS: Math.random() * 8,
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

    // Typewriter starts at 3s
    const twTimer = setTimeout(() => {
      let i = 0
      const interval = setInterval(() => {
        setDisplayed(TYPEWRITER_TEXT.slice(0, i + 1))
        i++
        if (i === TYPEWRITER_TEXT.length) {
          clearInterval(interval)
          setTimeout(() => setShowSubtitle(true), 400)
        }
      }, 150)
    }, 3000)

    // Progress bar
    const start = Date.now()
    const tick = setInterval(() => {
      const pct = Math.min(100, ((Date.now() - start) / DURATION_MS) * 100)
      setProgress(pct)
      if (pct >= 100 && !shimmer) setShimmer(true)
    }, 40)

    // Rotate phrases
    const fraseTimer = setInterval(
      () => setFraseIndex((i) => (i + 1) % FRASES.length),
      2000,
    )

    // Gold flash at 9.5s then exit
    const flashTimer = setTimeout(() => {
      setFlash(true)
      setTimeout(() => {
        localStorage.setItem(STORAGE_KEY, '1')
        setVisible(false)
      }, 500)
    }, 9500)

    return () => {
      clearTimeout(twTimer)
      clearInterval(tick)
      clearInterval(fraseTimer)
      clearTimeout(flashTimer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          exit={{ opacity: 0, filter: 'blur(16px)' }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden"
        >
          {/* Animated gradient background */}
          <motion.div
            className="absolute inset-0"
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

          {/* Mountains — 3 planes with parallax horizontal movement */}
          <div className="absolute bottom-0 left-0 w-full overflow-hidden" aria-hidden>
            {/* Back plane — moves right */}
            <motion.div
              className="absolute bottom-0 w-[200%]"
              style={{ left: '-50%' }}
              animate={{ x: ['0%', '25%', '0%'] }}
              transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
            >
              <svg viewBox="0 0 2880 260" preserveAspectRatio="none" className="w-full">
                <defs>
                  <filter id="glow-back" x="-10%" y="-30%" width="120%" height="160%">
                    <feGaussianBlur stdDeviation="2" result="blur" />
                    <feFlood floodColor="#D4920A" floodOpacity="0.18" result="c" />
                    <feComposite in="c" in2="blur" operator="in" result="glow" />
                    <feMerge><feMergeNode in="glow" /><feMergeNode in="SourceGraphic" /></feMerge>
                  </filter>
                </defs>
                <path
                  d="M0 200 L240 80 L480 190 L720 50 L960 180 L1200 70 L1440 200 L1680 80 L1920 190 L2160 50 L2400 180 L2640 70 L2880 200 L2880 260 L0 260 Z"
                  fill="rgba(26,58,53,0.55)"
                  filter="url(#glow-back)"
                />
              </svg>
            </motion.div>

            {/* Mid plane — moves left */}
            <motion.div
              className="absolute bottom-0 w-[180%]"
              style={{ left: '-15%' }}
              animate={{ x: ['0%', '-22%', '0%'] }}
              transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
            >
              <svg viewBox="0 0 2592 220" preserveAspectRatio="none" className="w-full">
                <path
                  d="M0 160 L300 90 L600 155 L900 70 L1200 155 L1500 90 L1800 160 L2100 90 L2400 155 L2592 100 L2592 220 L0 220 Z"
                  fill="rgba(46,122,110,0.40)"
                />
              </svg>
            </motion.div>

            {/* Front plane — moves right slowly */}
            <motion.div
              className="absolute bottom-0 w-[110%]"
              style={{ left: '-5%' }}
              animate={{ x: ['0%', '6%', '0%'] }}
              transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
            >
              <svg viewBox="0 0 1584 180" preserveAspectRatio="none" className="w-full">
                <defs>
                  <filter id="glow-front" x="-5%" y="-40%" width="110%" height="180%">
                    <feGaussianBlur stdDeviation="1.5" result="blur" />
                    <feFlood floodColor="#D4920A" floodOpacity="0.25" result="c" />
                    <feComposite in="c" in2="blur" operator="in" result="glow" />
                    <feMerge><feMergeNode in="glow" /><feMergeNode in="SourceGraphic" /></feMerge>
                  </filter>
                </defs>
                <path
                  d="M0 140 L180 105 L360 132 L540 88 L720 128 L900 92 L1080 135 L1260 96 L1440 138 L1584 100 L1584 180 L0 180 Z"
                  fill="rgba(30,20,10,0.75)"
                  filter="url(#glow-front)"
                />
              </svg>
            </motion.div>
          </div>

          {/* Bubbles */}
          {bubbles.map((b, i) => (
            <motion.span
              key={i}
              className="absolute rounded-full pointer-events-none"
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

          {/* Center content */}
          <div className="relative z-10 flex flex-col items-center gap-8">
            {/* Logo with screen blend */}
            <motion.div
              initial={{ scale: 0.3, opacity: 0, filter: 'blur(24px)' }}
              animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
              transition={{ duration: 1.2, delay: 1.5, ease: [0.34, 1.56, 0.64, 1] }}
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
            {/* Progress bar with shimmer */}
            <div className="relative h-1.5 w-72 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-kuska-gold transition-[width] duration-75"
                style={{ width: `${progress}%` }}
              />
              {shimmer && (
                <motion.div
                  className="absolute inset-y-0 w-20 rounded-full"
                  style={{
                    background:
                      'linear-gradient(90deg, transparent, rgba(255,255,255,0.85), transparent)',
                  }}
                  initial={{ left: '-80px' }}
                  animate={{ left: '300px' }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                />
              )}
            </div>

            {/* Frase quechua */}
            <AnimatePresence mode="wait">
              <motion.p
                key={fraseIndex}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.5 }}
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
