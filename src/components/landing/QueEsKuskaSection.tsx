'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useInView } from 'framer-motion'
import { Badge } from '@/components/ui/Badge'

const BULLETS = [
  'Marketplace con historias reales detrás de cada pieza',
  'Academia y ferias digitales para crecer',
  'CFO-bot con IA y acceso a fondos de capitalización',
]

const TITLE = 'Un ecosistema, no solo una tienda'

/** Fotos reales de artesanos peruanos (Unsplash/Pexels, licencias libres de
 *  uso comercial, sin marca de agua), cada una con una frase inspiradora
 *  propia que aparece en sincronía con la transición de la imagen. */
const PHOTOS = [
  {
    src: 'https://images.unsplash.com/photo-1602591620189-de34d60650b2?w=1600&q=85',
    alt: 'Artesana peruana tejiendo con vestimenta tradicional andina, Valle Sagrado',
    position: '50% 30%',
    phrase: 'Cada hilo lleva la memoria de generaciones.',
  },
  {
    src: 'https://images.unsplash.com/photo-1769358720638-932b3dd8101a?w=1600&q=85',
    alt: 'Tejedora andina trabajando en telar con hilos de colores vibrantes',
    position: '50% 40%',
    phrase: 'Las manos que tejen, tejen también el futuro.',
  },
  {
    src: 'https://images.pexels.com/photos/33027862/pexels-photo-33027862.jpeg?w=1600&q=85',
    alt: 'Textiles peruanos artesanales de colores vivos en un mercado de Cusco',
    position: '50% 45%',
    phrase: 'El color del Perú se cuenta en cada textil.',
  },
  {
    src: 'https://images.unsplash.com/photo-1422246358533-95dcd3d48961?w=1600&q=85',
    alt: 'Manos de un ceramista peruano moldeando arcilla',
    position: '50% 50%',
    phrase: 'De la tierra nace el arte que perdura.',
  },
  {
    src: 'https://images.unsplash.com/photo-1774082313811-f9852bd53d00?w=1600&q=85',
    alt: 'Mercado artesanal de Pisac, Perú, con puestos de textiles multicolores',
    position: '50% 40%',
    phrase: 'En cada mercado late el corazón de un pueblo que crea.',
  },
  {
    src: 'https://images.pexels.com/photos/8066075/pexels-photo-8066075.jpeg?w=1600&q=85',
    alt: 'Manos de un artesano pintando con pincel fino una vasija de cerámica',
    position: '50% 50%',
    phrase: 'El detalle de una mano paciente convierte el barro en historia.',
  },
]

const SLIDE_DURATION_MS = 3000

function useTypewriter(text: string, active: boolean, speedMs = 30) {
  const [displayed, setDisplayed] = useState('')
  useEffect(() => {
    if (!active) return
    let i = 0
    const iv = setInterval(() => {
      i++
      setDisplayed(text.slice(0, i))
      if (i >= text.length) clearInterval(iv)
    }, speedMs)
    return () => clearInterval(iv)
  }, [active, text, speedMs])
  return displayed
}

function PhotoCarousel({ active }: { active: boolean }) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (!active) return
    const iv = setInterval(() => setIndex((i) => (i + 1) % PHOTOS.length), SLIDE_DURATION_MS)
    return () => clearInterval(iv)
  }, [active])

  return (
    <div className="absolute inset-0">
      <AnimatePresence mode="sync">
        <motion.div
          key={index}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ opacity: { duration: 1 }, scale: { duration: SLIDE_DURATION_MS / 1000, ease: 'linear' } }}
        >
          <Image
            src={PHOTOS[index].src}
            alt={PHOTOS[index].alt}
            fill
            sizes="(max-width:1024px) 100vw, 45vw"
            className="object-cover"
            style={{ objectPosition: PHOTOS[index].position }}
            priority={index === 0}
          />
        </motion.div>
      </AnimatePresence>

      {/* Frase inspiradora — sincronizada con la foto activa */}
      <div className="pointer-events-none absolute inset-x-0 bottom-10 z-10 px-6">
        <AnimatePresence mode="wait">
          <motion.p
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
            className="font-display text-xl font-semibold italic leading-snug text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.45)] sm:text-2xl"
          >
            &ldquo;{PHOTOS[index].phrase}&rdquo;
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Puntos indicadores — inferior centro, sobre la imagen */}
      <div className="pointer-events-none absolute inset-x-0 bottom-4 z-10 flex justify-center gap-1.5">
        {PHOTOS.map((p, i) => (
          <span
            key={p.src}
            className="h-1.5 rounded-full bg-white/60 transition-all duration-500"
            style={{ width: i === index ? '20px' : '6px', opacity: i === index ? 1 : 0.5 }}
          />
        ))}
      </div>
    </div>
  )
}

export function QueEsKuskaSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const inView = useInView(sectionRef, { once: true, amount: 0.35 })
  const titleText = useTypewriter(TITLE, inView, 32)

  return (
    <section ref={sectionRef} className="mx-auto max-w-6xl px-6 py-20">
      <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.1fr]">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="relative"
        >
          <div className="relative aspect-[4/5] overflow-hidden rounded-glass shadow-xl">
            <PhotoCarousel active={inView} />

            {/* Viñeta inferior para que la frase resalte sobre cualquier foto */}
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5"
              style={{ background: 'linear-gradient(180deg, transparent 0%, rgba(26,10,0,0.55) 100%)' }}
            />
          </div>
        </motion.div>

        <div>
          <Badge variant="region" className="mb-4">
            ¿Qué es Kuska?
          </Badge>
          <h2 className="font-display text-h3 leading-tight text-kuska-text sm:text-h2 min-h-[1.2em]">
            {titleText}
            {titleText.length < TITLE.length && (
              <span className="ml-1 inline-block w-2 animate-pulse text-kuska-gold">|</span>
            )}
          </h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.4, 0, 0.2, 1] }}
            className="mt-5 font-body text-lg leading-relaxed text-kuska-text-mid"
          >
            Comercio, comunidad, formación y tecnología trabajando juntos.
            Cada compra sostiene una familia, preserva una técnica ancestral
            y conecta el Perú con el mundo.
          </motion.p>
          <motion.ul
            className="mt-6 space-y-3"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } } }}
          >
            {BULLETS.map((item) => (
              <motion.li
                key={item}
                variants={{
                  hidden: { opacity: 0, y: 12 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] } },
                }}
                className="flex items-start gap-3 font-body text-kuska-text"
              >
                <span className="mt-1 inline-block h-2.5 w-2.5 flex-shrink-0 rotate-45 bg-kuska-gold" />
                {item}
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </div>
    </section>
  )
}
