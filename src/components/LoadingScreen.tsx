'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Image from 'next/image'
import { Logo } from '@/components/ui/Logo'

const STORAGE_KEY = 'kuska_loaded_v10'
const LOAD_DURATION_MS = 5000
const FLASH_DURATION_MS = 1800
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

/** Bandera peruana (franjas rojo-blanco-rojo) con ondulación sutil tipo tela,
 *  construida en CSS/SVG — no existe asset de bandera en /public. */
function PeruFlag() {
  return (
    <motion.div
      className="h-8 w-14 overflow-hidden rounded-[3px] shadow-lg"
      style={{ transformOrigin: 'left center', perspective: 400 }}
      animate={{ rotateY: [0, 8, -6, 4, 0], scaleY: [1, 0.97, 1.02, 0.99, 1] }}
      transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
    >
      <div className="flex h-full w-full">
        <div className="h-full w-1/3" style={{ background: '#C8102E' }} />
        <div className="h-full w-1/3" style={{ background: '#FFFFFF' }} />
        <div className="h-full w-1/3" style={{ background: '#C8102E' }} />
      </div>
    </motion.div>
  )
}

export function LoadingScreen() {
  // Empieza visible por defecto (tanto en el render del servidor como en el
  // primer render del cliente, para que coincidan y no haya warning de
  // hidratación): así la pantalla de carga es literalmente lo primero que
  // se pinta, sin que la home real se alcance a ver un instante antes.
  // El único chequeo de sessionStorage ocurre en el useEffect, ya en el
  // cliente, y si ya se vio en esta sesión la oculta de inmediato.
  const [visible, setVisible] = useState(true)
  const [fraseIndex, setFraseIndex] = useState(0)
  const [displayed, setDisplayed] = useState('')
  const [percent, setPercent] = useState(0)
  const [flash, setFlash] = useState(false)
  const rafRef = useRef<number>()

  const bubbles = useMemo<Bubble[]>(
    () =>
      Array.from({ length: 34 }).map(() => {
        const size = 5 + Math.random() * 22
        return {
          left: Math.random() * 100,
          size,
          durationS: 7 + Math.random() * 9,
          delayS: Math.random() * 6,
          color:
            Math.random() > 0.45
              ? `rgba(242,194,48,${(0.25 + Math.random() * 0.35).toFixed(2)})`
              : `rgba(245,240,232,${(0.15 + Math.random() * 0.25).toFixed(2)})`,
          blur: size < 9 ? '1px' : '0px',
          xAmplitude: 18 + Math.random() * 36,
        }
      }),
    [],
  )

  useEffect(() => {
    // sessionStorage (no localStorage): el flag vive solo mientras dura la
    // pestaña/sesión del navegador. Se resetea en cada recarga real (F5) o
    // primera visita, pero NO al navegar entre rutas con el router de
    // Next.js (esa navegación usa la PageTransition, no este loading screen).
    if (sessionStorage.getItem(STORAGE_KEY)) {
      setVisible(false)
      return
    }

    // Typewriter starts at 1.5s
    const twTimer = setTimeout(() => {
      let i = 0
      const iv = setInterval(() => {
        setDisplayed(TYPEWRITER_TEXT.slice(0, i + 1))
        i++
        if (i === TYPEWRITER_TEXT.length) clearInterval(iv)
      }, 90)
    }, 1500)

    // Rotate phrases every 1.6s
    const fraseTimer = setInterval(
      () => setFraseIndex((i) => (i + 1) % FRASES.length),
      1600,
    )

    // Porcentaje en tiempo real vía requestAnimationFrame — el mismo valor
    // maneja el ancho de la barra y el número, así nunca se desincronizan.
    const start = performance.now()
    function tick(now: number) {
      const elapsed = now - start
      const pct = Math.min(100, (elapsed / LOAD_DURATION_MS) * 100)
      setPercent(pct)
      if (pct < 100) {
        rafRef.current = requestAnimationFrame(tick)
      }
    }
    rafRef.current = requestAnimationFrame(tick)

    // Destello de luz al completar la barra → transición a la página principal
    const flashTimer = setTimeout(() => {
      setFlash(true)
      setTimeout(() => {
        sessionStorage.setItem(STORAGE_KEY, '1')
        setVisible(false)
      }, FLASH_DURATION_MS - 450)
    }, LOAD_DURATION_MS)

    return () => {
      clearTimeout(twTimer)
      clearInterval(fraseTimer)
      clearTimeout(flashTimer)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={false}
          exit={{ opacity: 0, filter: 'blur(24px)', scale: 1.05 }}
          transition={{ duration: 0.9, ease: EASE }}
          className="fixed inset-0 z-[100] overflow-hidden"
          style={{ background: 'linear-gradient(160deg, #3D1C02 0%, #2a1305 55%, #190b02 100%)' }}
        >
          {/* Burbujas cálidas flotando — fondo simple de un solo color, sin
              montañas ni fotos, tal como se pidió. */}
          {bubbles.map((b, i) => (
            <motion.span
              key={i}
              className="pointer-events-none absolute rounded-full"
              style={{
                left: `${b.left}%`,
                bottom: '-30px',
                width: b.size,
                height: b.size,
                background: b.color,
                filter: `blur(${b.blur})`,
                boxShadow: `0 0 ${b.size}px ${b.color}`,
              }}
              animate={{
                y: [0, -1300],
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

          {/* Contenido principal: Logo con halo → KUSKA grande → % → Barra → Frases */}
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-6 px-6">
            <motion.div
              initial={{ scale: 0.3, opacity: 0, filter: 'blur(24px)' }}
              animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
              transition={{ duration: 0.7, delay: 0.3, ease: EASE }}
              className="relative"
            >
              {/* Halo dorado — anillo con destello rotando + pulso, "rodeando" el logo */}
              <motion.div
                className="absolute -inset-5 rounded-full"
                style={{
                  background:
                    'conic-gradient(from 0deg, transparent 0%, rgba(242,194,48,0.9) 12%, transparent 28%, transparent 100%)',
                }}
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
              />
              <motion.div
                className="absolute -inset-3 rounded-full"
                style={{ boxShadow: '0 0 40px 14px rgba(212,146,10,0.45), 0 0 80px 30px rgba(212,146,10,0.18)' }}
                animate={{ opacity: [0.6, 1, 0.6], scale: [1, 1.06, 1] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
              />
              <div className="relative rounded-full ring-2 ring-kuska-gold/60">
                <Logo size={112} variant="dark" priority />
              </div>
            </motion.div>

            <div
              className="font-display text-7xl font-bold tracking-[0.4em] text-kuska-cream min-h-[100px] text-center sm:text-8xl"
              style={{ textShadow: '0 0 56px rgba(212,146,10,0.6)' }}
            >
              {displayed}
              {displayed.length < TYPEWRITER_TEXT.length && displayed.length > 0 && (
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
                  className="text-kuska-gold ml-1"
                >
                  |
                </motion.span>
              )}
            </div>

            {/* Porcentaje — arriba de la barra */}
            <p
              className="font-nunito text-sm font-bold tabular-nums tracking-[0.2em] text-kuska-gold"
              style={{ textShadow: '0 0 20px rgba(212,146,10,0.6)' }}
            >
              {Math.round(percent)}%
            </p>

            {/* Barra de carga — degradado completo, fluida, sin rectángulo */}
            <div className="relative h-[6px] w-72 overflow-visible rounded-full bg-white/10">
              <div
                className="h-full rounded-full transition-[width] duration-75 ease-linear"
                style={{
                  width: `${percent}%`,
                  background:
                    'linear-gradient(90deg, #E4392F 0%, #F2872E 25%, #F2C230 50%, #3EA66B 75%, #2C6FBF 100%)',
                  boxShadow: '0 0 16px 2px rgba(242,135,46,0.5)',
                }}
              />
            </div>

            {/* Frases — cursiva elegante, debajo de la barra, fade in/out */}
            <div className="min-h-[28px] text-center">
              <AnimatePresence mode="wait">
                <motion.p
                  key={fraseIndex}
                  initial={{ opacity: 0, y: 10, filter: 'blur(5px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -10, filter: 'blur(5px)' }}
                  transition={{ duration: 0.5, ease: 'easeInOut' }}
                  className="font-display text-base italic text-kuska-cream/80"
                >
                  {FRASES[fraseIndex]}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>

          {/* Mascota — asomándose desde el borde derecho, saludando */}
          <div className="absolute inset-y-0 right-0 z-[11] flex flex-col items-center justify-end gap-3 pb-0 pr-[5%] sm:pr-[9%]">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.1, ease: EASE }}
              className="mb-2 flex flex-col items-center gap-2.5"
            >
              <div className="rounded-2xl border border-kuska-gold/30 bg-white/95 px-4 py-2 text-center shadow-lg">
                <p className="font-nunito text-sm font-bold text-kuska-text">¡Hola Perú! 🦙</p>
              </div>
              <PeruFlag />
            </motion.div>

            {/* Contenedor recortado: solo se ve la mitad superior de Kusi,
                como si se asomara desde abajo del borde de la pantalla. */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', bounce: 0.5, duration: 0.9, delay: 0.8 }}
              className="relative h-[100px] w-[170px] overflow-hidden sm:h-[125px] sm:w-[200px]"
            >
              <div className="absolute left-1/2 top-0 -translate-x-1/2">
                <Image
                  src="/kusi.png"
                  alt="Kusi, la mascota alpaca de Kuska, saludando"
                  width={200}
                  height={200}
                  priority
                  className="animate-kusi-wave select-none object-contain drop-shadow-xl"
                />
              </div>
            </motion.div>
          </div>

          {/* Destello de luz final: ilumina toda la pantalla con una
              transición fluida (easeInOut de doble tramo + blur creciente)
              hacia la página principal. */}
          {flash && (
            <>
              <motion.div
                className="absolute inset-0 z-20 pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 1, 0] }}
                transition={{ duration: FLASH_DURATION_MS / 1000, times: [0, 0.4, 0.6, 1], ease: 'easeInOut' }}
                style={{
                  background:
                    'radial-gradient(circle at 50% 50%, #FFF6E0 0%, #F2C230 35%, #F2872E 65%, transparent 100%)',
                }}
              />
              <motion.div
                className="absolute inset-0 z-20 pointer-events-none"
                initial={{ scale: 0, opacity: 1 }}
                animate={{ scale: 3.6, opacity: 0 }}
                transition={{ duration: FLASH_DURATION_MS / 1000, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  background:
                    'radial-gradient(ellipse, rgba(255,246,224,0.95) 0%, rgba(242,135,46,0.6) 45%, transparent 72%)',
                }}
              />
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
