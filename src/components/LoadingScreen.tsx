'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Image from 'next/image'
import { Logo } from '@/components/ui/Logo'

const STORAGE_KEY = 'kuska_loaded_v9'
const LOAD_DURATION_MS = 7500
const FLASH_DURATION_MS = 1400
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

/** Una capa de montañas que se desplaza horizontalmente sin fin — dos copias
 *  idénticas lado a lado, animadas de 0% a -50% (el ancho de una copia),
 *  loop perfectamente continuo sin salto visible. */
function MountainLayer({
  durationS,
  heightClass,
  opacity,
  blurPx,
  filter,
  objectPosition,
}: {
  durationS: number
  heightClass: string
  opacity: number
  blurPx: number
  filter: string
  objectPosition: string
}) {
  return (
    <div className={`absolute inset-x-0 bottom-0 ${heightClass} overflow-hidden`} style={{ opacity }} aria-hidden>
      <motion.div
        className="flex h-full"
        style={{ width: '200%', filter: `blur(${blurPx}px) ${filter}` }}
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: durationS, repeat: Infinity, ease: 'linear' }}
      >
        <div className="relative h-full w-1/2 flex-shrink-0">
          <Image
            src="/mountains-peru-view.png"
            alt=""
            fill
            priority
            className="object-cover"
            style={{ objectPosition }}
          />
        </div>
        <div className="relative h-full w-1/2 flex-shrink-0">
          <Image
            src="/mountains-peru-view.png"
            alt=""
            fill
            className="object-cover"
            style={{ objectPosition }}
          />
        </div>
      </motion.div>
    </div>
  )
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
  const [visible, setVisible] = useState(false)
  const [fraseIndex, setFraseIndex] = useState(0)
  const [displayed, setDisplayed] = useState('')
  const [percent, setPercent] = useState(0)
  const [flash, setFlash] = useState(false)
  const rafRef = useRef<number>()

  useEffect(() => {
    // sessionStorage (no localStorage): el flag vive solo mientras dura la
    // pestaña/sesión del navegador. Se resetea en cada recarga real (F5) o
    // primera visita, pero NO al navegar entre rutas con el router de
    // Next.js (esa navegación usa la PageTransition, no este loading screen).
    if (sessionStorage.getItem(STORAGE_KEY)) return
    setVisible(true)

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
      }, FLASH_DURATION_MS - 500)
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
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, filter: 'blur(20px)', scale: 1.04 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="fixed inset-0 z-[100] overflow-hidden bg-[#1a1410]"
        >
          {/* Layer 0 — Cielo cálido de fondo. Estático a propósito: animar un
              gradiente completo como string vía Framer Motion `animate` no
              interpola de forma confiable (puede quedar transparente) — el
              movimiento ya lo dan las montañas, no hace falta animar esto. */}
          <div
            className="absolute inset-0 z-0"
            style={{ background: 'linear-gradient(180deg, #4a2a12 0%, #1a1410 60%, #0d0805 100%)' }}
          />

          {/* Layer 1-3 — Montañas andinas, 3 capas de profundidad con parallax
              horizontal infinito. La capa "cercana" es más rápida, nítida y
              cálida; la "lejana" es más lenta, difusa y tenue — sensación de
              profundidad real con un solo asset. */}
          <MountainLayer
            durationS={42}
            heightClass="h-[52%]"
            opacity={0.35}
            blurPx={3}
            filter="saturate(0.7) brightness(0.75) sepia(0.15)"
            objectPosition="50% 15%"
          />
          <MountainLayer
            durationS={24}
            heightClass="h-[62%]"
            opacity={0.55}
            blurPx={1}
            filter="saturate(0.95) brightness(0.85) sepia(0.1)"
            objectPosition="50% 35%"
          />
          <MountainLayer
            durationS={13}
            heightClass="h-[72%]"
            opacity={0.85}
            blurPx={0}
            filter="saturate(1.15) brightness(0.95) sepia(0.08)"
            objectPosition="50% 55%"
          />

          {/* Viñeta cálida inferior para fundir las montañas con el contenido */}
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 z-[4] h-1/2"
            style={{ background: 'linear-gradient(180deg, transparent 0%, rgba(13,8,5,0.85) 100%)' }}
            aria-hidden
          />

          {/* Layer 10 — Contenido principal: Logo → Typewriter → Frases → Barra */}
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-7 px-6">
            <motion.div
              initial={{ scale: 0.3, opacity: 0, filter: 'blur(24px)' }}
              animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
              transition={{ duration: 0.7, delay: 0.5, ease: EASE }}
              className="relative"
            >
              <Logo size={104} variant="dark" priority />
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{ boxShadow: '0 0 32px 10px rgba(212,146,10,0.30), 0 0 64px 24px rgba(212,146,10,0.10)' }}
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              />
            </motion.div>

            <div
              className="font-display text-6xl font-bold tracking-[0.45em] text-kuska-cream min-h-[80px] text-center"
              style={{ textShadow: '0 0 48px rgba(212,146,10,0.55)' }}
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

            {/* Frases — cursiva elegante, fade in/out, sin rectángulos */}
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

            {/* Porcentaje en tiempo real */}
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

          {/* Layer 20 — Destello de luz final: ilumina toda la pantalla y
              transiciona suavemente hacia la página principal. */}
          {flash && (
            <>
              <motion.div
                className="absolute inset-0 z-20 pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: FLASH_DURATION_MS / 1000, ease: 'easeInOut' }}
                style={{
                  background:
                    'radial-gradient(circle at 50% 50%, #FFF6E0 0%, #F2C230 35%, #F2872E 65%, transparent 100%)',
                }}
              />
              <motion.div
                className="absolute inset-0 z-20 pointer-events-none"
                initial={{ scale: 0, opacity: 1 }}
                animate={{ scale: 3.2, opacity: 0 }}
                transition={{ duration: FLASH_DURATION_MS / 1000, ease: 'easeOut' }}
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
