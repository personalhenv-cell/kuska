'use client'

import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/Badge'

const BULLETS = [
  'Marketplace con historias reales detrás de cada pieza',
  'Academia y ferias digitales para crecer',
  'CFO-bot con IA y acceso a fondos de capitalización',
]

const RHOMBUS_PATTERN = {
  backgroundImage:
    'repeating-linear-gradient(45deg, rgba(212,146,10,0.14) 0, rgba(212,146,10,0.14) 1px, transparent 1px, transparent 24px),' +
    'repeating-linear-gradient(-45deg, rgba(212,146,10,0.14) 0, rgba(212,146,10,0.14) 1px, transparent 1px, transparent 24px)',
}

export function QueEsKuskaSection() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.1fr]">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="relative"
        >
          <div className="liquid-glass-gold relative aspect-[4/5] overflow-hidden rounded-glass">
            <div className="absolute inset-0" style={RHOMBUS_PATTERN} aria-hidden />
            <div className="relative flex h-full w-full items-center justify-center">
              <span className="font-display text-[120px] opacity-70">🦙</span>
            </div>
          </div>
          <div className="absolute -bottom-6 -right-4 rounded-card bg-kuska-brown px-5 py-4 text-kuska-cream shadow-xl">
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
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
            className="font-display text-h3 leading-tight text-kuska-text sm:text-h2"
          >
            Más que un marketplace: un ecosistema para el artesano peruano.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.4, 0, 0.2, 1] }}
            className="mt-5 font-body text-lg leading-relaxed text-kuska-text-mid"
          >
            Reunimos comercio, comunidad, formación y tecnología en un solo
            lugar. Cada compra sostiene a una familia, preserva una técnica
            ancestral y lleva un pedazo del Perú al mundo.
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
