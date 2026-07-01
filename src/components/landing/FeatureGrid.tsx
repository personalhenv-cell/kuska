'use client'

import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/Badge'

interface Feature {
  icon: string
  title: string
  text: string
  big?: boolean
}

const FEATURES: Feature[] = [
  { icon: '🛍️', title: 'Marketplace', text: 'Vende tu arte al Perú y al mundo', big: true },
  { icon: '🤖', title: 'CFO-Bot IA', text: 'Tu asesor financiero personal con IA', big: true },
  { icon: '💡', title: 'Emprendedor IA', text: 'Planes de negocio generados por IA' },
  { icon: '🎓', title: 'Academia Kuska', text: 'Aprende y certifícate en tu oficio' },
  { icon: '🖥️', title: 'Ferias Digitales', text: 'Exhibe en eventos virtuales temáticos' },
  { icon: '🧵', title: 'Talleres', text: 'Enseña y comparte tu técnica ancestral' },
  { icon: '💰', title: 'Hub Capitalización', text: 'Accede a fondos y financiamiento' },
  { icon: '📖', title: 'Módulo Raíces', text: 'Cuenta tu historia, preserva tu cultura' },
  { icon: '🤝', title: 'Red Cuéntame', text: 'Conecta con otros artesanos del Perú' },
  { icon: '🗺️', title: 'Mapa Artesanal', text: 'Descubre artesanos por región' },
  { icon: '🌐', title: 'Multilenguaje', text: 'Español, Quechua e Inglés' },
  { icon: '🏆', title: 'Gamificación', text: 'Niveles, misiones e insignias' },
]

const CROSSHATCH = {
  backgroundImage:
    'repeating-linear-gradient(45deg, rgba(46,122,110,0.12) 0, rgba(46,122,110,0.12) 1px, transparent 1px, transparent 20px)',
}

export function FeatureGrid() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <div className="mx-auto max-w-2xl text-center">
        <Badge variant="new" className="mb-4">
          El ecosistema Kuska
        </Badge>
        <h2 className="font-display text-h3 text-kuska-text sm:text-h2">
          Todo lo que el artesano peruano necesita, en un solo lugar
        </h2>
        <p className="mt-4 font-body text-kuska-text-mid">
          Kuska, creada por Agencia CEIPE, es la innovación que valora y
          empodera a los artesanos de todo el Perú.
        </p>
      </div>

      <motion.div
        className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.08 } },
        }}
      >
        {FEATURES.map((f) => (
          <motion.div
            key={f.title}
            variants={{
              hidden: { opacity: 0, y: 24 },
              show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] } },
            }}
            className={f.big ? 'sm:col-span-2' : ''}
          >
            <div className="group relative h-full rounded-card transition-transform duration-300 hover:-translate-y-2">
              <div
                className="pointer-events-none absolute -inset-1 rounded-card opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-60 animate-ripple-glow-spin"
                style={{ background: 'conic-gradient(from 0deg, #C84B2F, #D4920A, #2E7A6E, #C84B2F)' }}
                aria-hidden
              />
              <div className="relative h-full overflow-hidden rounded-card border border-kuska-border bg-white p-6">
                <div className="pointer-events-none absolute inset-0 opacity-60" style={CROSSHATCH} aria-hidden />
                <div className="relative">
                  <span className={f.big ? 'text-5xl' : 'text-4xl'}>{f.icon}</span>
                  <h3 className={`mt-3 font-display font-bold text-kuska-text ${f.big ? 'text-2xl' : 'text-lg'}`}>
                    {f.title}
                  </h3>
                  <p className="mt-1.5 font-body text-sm leading-relaxed text-kuska-text-mid">
                    {f.text}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
