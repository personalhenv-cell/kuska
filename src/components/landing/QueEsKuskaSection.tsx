'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { Badge } from '@/components/ui/Badge'
import { Kusi } from '@/components/ui/Kusi'

const BULLETS = [
  'Marketplace con historias reales detrás de cada pieza',
  'Academia y ferias digitales para crecer',
  'CFO-bot con IA y acceso a fondos de capitalización',
]

const TITLE = 'Un ecosistema, no solo una tienda'
const KUSI_MESSAGE = 'Cada pieza tiene una historia. Yo te la cuento 🦙'

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

export function QueEsKuskaSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const inView = useInView(sectionRef, { once: true, amount: 0.35 })
  const titleText = useTypewriter(TITLE, inView, 32)
  const kusiText = useTypewriter(KUSI_MESSAGE, inView, 22)

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
            <Image
              src="/mountains-peru-view.png"
              alt="Montaña de Siete Colores, Andes del Perú"
              fill
              sizes="(max-width:1024px) 100vw, 45vw"
              className="object-cover"
              style={{ objectPosition: '50% 72%' }}
            />

            {/* Kusi + burbuja typewriter, esquina inferior izquierda */}
            <div className="absolute bottom-4 left-4 flex flex-col items-start gap-2">
              {kusiText && (
                <div className="max-w-[200px] rounded-2xl border border-kuska-gold/30 bg-white px-4 py-2 shadow-sm">
                  <p className="font-nunito text-sm text-kuska-text">
                    {kusiText}
                    {kusiText.length < KUSI_MESSAGE.length && (
                      <span className="ml-0.5 inline-block w-1 animate-pulse text-kuska-gold">|</span>
                    )}
                  </p>
                </div>
              )}
              <Kusi size="lg" animation="float" />
            </div>
          </div>

          {/* Badge, esquina inferior derecha — dentro de los límites de la imagen */}
          <div className="absolute bottom-4 right-4 rounded-card bg-kuska-brown px-5 py-4 text-kuska-cream shadow-xl">
            <p className="font-nunito text-xs uppercase tracking-wide text-kuska-gold">
              Kuska significa
            </p>
            <p className="font-display text-2xl font-bold text-kuska-red">«Juntos»</p>
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
