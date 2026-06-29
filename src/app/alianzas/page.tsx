'use client'

import { motion } from 'framer-motion'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Kusi from '@/components/ui/Kusi'
import AllyLogo from '@/components/ui/AllyLogo'
import { ALLIES_INCUBA, ALLIES_FINANCIAN, ALLIES_INSTITUCIONAL, type Ally } from '@/lib/data/allies'

const SECTIONS: { title: string; subtitle: string; emoji: string; allies: Ally[] }[] = [
  { title: 'Nos incuba',          subtitle: 'Incubadoras y aceleradoras que potencian nuestro crecimiento', emoji: '🌱', allies: ALLIES_INCUBA },
  { title: 'Nos financian',       subtitle: 'Aliados que respaldan económicamente nuestra misión',          emoji: '💪', allies: ALLIES_FINANCIAN },
  { title: 'Apoyo institucional', subtitle: 'Organizaciones que acompañan a nuestros artesanos',             emoji: '🤝', allies: ALLIES_INSTITUCIONAL },
]

function AllyCard({ ally, i }: { ally: Ally; i: number }) {
  const inner = (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, delay: (i % 2) * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="liquid-glass card-hover rounded-2xl p-6 h-full flex items-center gap-5"
    >
      <div className="shrink-0 w-[180px] flex items-center justify-start">
        <AllyLogo ally={ally} mode="card" />
      </div>
      <div className="min-w-0">
        <h3 className="font-display font-bold text-lg text-k-ink leading-tight">{ally.name}</h3>
        <p className="text-sm text-k-ink/65 mt-1 leading-snug">{ally.tagline}</p>
        {ally.url && <span className="inline-block mt-2 text-xs font-semibold text-k-red">Conocer más →</span>}
      </div>
    </motion.div>
  )
  return ally.url
    ? <a href={ally.url} target="_blank" rel="noopener noreferrer" className="block h-full">{inner}</a>
    : inner
}

export default function AlianzasPage() {
  return (
    <div style={{ background: '#F5F0E8' }} className="min-h-screen">
      <Navbar />

      {/* Banner */}
      <section className="pt-28 pb-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="liquid-glass rounded-3xl p-8 md:p-10 flex flex-col md:flex-row items-center gap-8 overflow-hidden relative">
            <div
              className="absolute -right-16 -top-16 w-72 h-72 rounded-full opacity-20 pointer-events-none"
              style={{ background: 'radial-gradient(circle,#D4920A,transparent 70%)' }}
            />
            <div className="shrink-0">
              <Kusi size="lg" animation="celebrate" priority />
            </div>
            <div className="text-center md:text-left relative">
              <motion.h1
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="font-display font-extrabold text-3xl md:text-5xl text-k-ink leading-tight"
              >
                Nuestras alianzas
              </motion.h1>
              <p className="mt-3 text-lg md:text-xl text-k-brown font-semibold">
                ¡Juntos hacemos grande a la artesanía peruana! 🦙
              </p>
              <p className="mt-2 text-sm text-k-ink/60 max-w-xl">
                Kuska crece de la mano de incubadoras, aliados financieros e instituciones
                que creen en el talento de nuestros artesanos.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Secciones */}
      <div className="max-w-6xl mx-auto px-6 pb-16 space-y-16">
        {SECTIONS.map(section => (
          <section key={section.title}>
            <div className="flex items-end justify-between mb-6">
              <div>
                <h2 className="font-display font-bold text-2xl md:text-3xl text-k-ink flex items-center gap-2">
                  <span>{section.emoji}</span> {section.title}
                </h2>
                <p className="text-sm text-k-ink/55 mt-1">{section.subtitle}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {section.allies.map((ally, i) => (
                <AllyCard key={ally.slug} ally={ally} i={i} />
              ))}
            </div>
          </section>
        ))}

        {/* Cierre */}
        <div className="text-center pt-4">
          <p className="text-k-ink/70 font-medium">
            ¿Tu organización quiere sumarse a Kuska?{' '}
            <a href="mailto:hola@kuska.pe" className="text-k-red font-bold hover:underline">Conversemos →</a>
          </p>
        </div>
      </div>

      <Footer />
    </div>
  )
}
