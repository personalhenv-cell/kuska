'use client'

import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Image from 'next/image'
import { Logo } from '@/components/ui/Logo'
import { Kusi } from '@/components/ui/Kusi'

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
  const [fraseIndex, setFraseIndex] = useState(0)
  const [displayed, setDisplayed] = useState('')
  const [burst, setBurst] = useState(false)
  const [flash, setFlash] = useState(false)
  const [kusiLanded, setKusiLanded] = useState(false)
  const [kusiAnim, setKusiAnim] = useState<'idle' | 'bounce'>('idle')

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
    // sessionStorage (no localStorage): el flag vive solo mientras dura la
    // pestaña/sesión del navegador. Se resetea en cada recarga real (F5) o
    // primera visita, pero NO al navegar entre rutas con el router de
    // Next.js (esa navegación usa la PageTransition, no este loading screen).
    if (sessionStorage.getItem(STORAGE_KEY)) return
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

    // Rotate phrases every 1.3s
    const fraseTimer = setInterval(
      () => setFraseIndex((i) => (i + 1) % FRASES.length),
      1300,
    )

    // Gold flash at 6.6s → exit at 7.0s
    const flashTimer = setTimeout(() => {
      setFlash(true)
      setTimeout(() => {
        sessionStorage.setItem(STORAGE_KEY, '1')
        setVisible(false)
      }, 400)
    }, 6600)

    // Kusi aterriza con bounce ~1.7s luego de que entra la barra, luego pasa a idle
    const kusiTimer = setTimeout(() => {
      setKusiLanded(true)
      setKusiAnim('bounce')
      setTimeout(() => setKusiAnim('idle'), 900)
    }, 3400)

    return () => {
      clearTimeout(twTimer)
      clearInterval(fraseTimer)
      clearTimeout(flashTimer)
      clearTimeout(kusiTimer)
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

          {/* Layer 1 — Foto real de los Andes con parallax suave (sin montañas SVG genéricas) */}
          <motion.div
            className="absolute inset-0 overflow-hidden pointer-events-none z-[1]"
            animate={{ y: [0, 14, 0] }}
            transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
            aria-hidden
          >
            <div
              className="absolute bottom-0 h-[58%] w-full opacity-[0.5]"
              style={{
                maskImage: 'linear-gradient(180deg, transparent 0%, black 30%)',
                WebkitMaskImage: 'linear-gradient(180deg, transparent 0%, black 30%)',
              }}
            >
              <Image
                src="/mountains-peru-view.png"
                alt=""
                fill
                priority
                className="object-cover"
                style={{ objectPosition: '50% 30%' }}
              />
            </div>
          </motion.div>

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

            {/* Progress bar — multicolor + burst at 100%, disparado por onAnimationComplete */}
            <div className="relative h-2 w-72 rounded-full bg-white/10 overflow-visible">
              <motion.div
                className="h-full rounded-full"
                style={{
                  background:
                    'linear-gradient(90deg, #C84B2F 0%, #D4920A 33%, #2E7A6E 66%, #D4920A 100%)',
                  backgroundSize: '300% 100%',
                }}
                initial={{ width: '0%', backgroundPosition: '100% 0%' }}
                animate={{ width: '100%', backgroundPosition: '0% 0%' }}
                transition={{ duration: DURATION_MS / 1000, ease: 'linear' }}
                onAnimationComplete={() => setBurst(true)}
              />
              {burst && (
                <div
                  className="pointer-events-none absolute inset-0 rounded-full"
                  style={{
                    boxShadow: '0 0 60px 20px rgba(212,146,10,1), 0 0 120px 40px rgba(200,75,47,0.6)',
                  }}
                />
              )}
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

            {/* Kusi — entra con bounce desde abajo tras la barra */}
            <motion.div
              initial={{ y: 60, opacity: 0 }}
              animate={kusiLanded ? { y: 0, opacity: 1 } : {}}
              transition={{ type: 'spring', bounce: 0.6, duration: 0.9 }}
            >
              <Kusi size="sm" animation={kusiAnim} />
            </motion.div>
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
