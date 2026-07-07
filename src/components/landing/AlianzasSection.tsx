'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ALIANZAS } from './alianzas-data'
import { AllianceModal } from './AllianceModal'

const ESTADO_STYLE = {
  carta: 'bg-kuska-teal/15 border-kuska-teal/30 text-kuska-teal',
  conversacion: 'bg-kuska-gold/15 border-kuska-gold/30 text-kuska-gold',
  reunion: 'bg-[#3F7D4A]/15 border-[#3F7D4A]/30 text-[#3F7D4A]',
} as const

const ESTADO_LABEL = {
  carta: 'Carta enviada',
  conversacion: 'En conversación',
  reunion: 'Reunión agendada',
} as const

export function AlianzasSection() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const active = activeIndex !== null ? ALIANZAS[activeIndex] : null

  return (
    <section id="alianzas" className="mx-auto max-w-6xl px-6 py-20 scroll-mt-24">
      <p className="text-center font-nunito text-sm font-bold uppercase tracking-wide text-kuska-text-mid">
        Respaldados por quienes creen en el talento peruano
      </p>
      <p className="mx-auto mt-2 max-w-md text-center font-body text-sm text-kuska-text-mid">
        Toca una organización para conocer el alcance real de la alianza.
      </p>

      <motion.div
        className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-3"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}
      >
        {ALIANZAS.map((a, i) => (
          <motion.button
            key={a.slug}
            onClick={() => setActiveIndex(i)}
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] } },
            }}
            className="group rounded-card border-2 border-kuska-gold/25 bg-kuska-cream p-6 text-center transition-all duration-300 hover:-translate-y-1.5 hover:scale-[1.05] hover:border-kuska-gold/60"
            style={{ boxShadow: '0 4px 16px rgba(61,28,2,0.06)' }}
            onMouseEnter={(e) => {
              ;(e.currentTarget as HTMLButtonElement).style.boxShadow =
                '0 16px 32px rgba(61,28,2,0.12), 0 0 24px rgba(212,146,10,0.25)'
            }}
            onMouseLeave={(e) => {
              ;(e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 16px rgba(61,28,2,0.06)'
            }}
          >
            <div className="mx-auto flex h-20 w-20 items-center justify-center">
              <Image
                src={`/alianzas/${a.slug}.png`}
                alt={a.name}
                width={80}
                height={80}
                className="h-full w-full object-contain grayscale transition-all duration-300 group-hover:grayscale-0"
              />
            </div>
            <p className="mt-3 font-display text-lg font-bold text-kuska-brown">{a.name}</p>
            <span
              className={`mt-2 inline-flex items-center rounded-full border px-3 py-1 font-nunito text-xs font-bold ${ESTADO_STYLE[a.estado]}`}
            >
              {ESTADO_LABEL[a.estado]}
            </span>
          </motion.button>
        ))}
      </motion.div>

      <AllianceModal
        alliance={active}
        onClose={() => setActiveIndex(null)}
        onNext={() => setActiveIndex((i) => (i === null ? null : (i + 1) % ALIANZAS.length))}
        onPrev={() => setActiveIndex((i) => (i === null ? null : (i - 1 + ALIANZAS.length) % ALIANZAS.length))}
      />
    </section>
  )
}
