'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'

type EstadoAlianza = 'carta' | 'conversacion' | 'reunion'

const ESTADO_LABEL: Record<EstadoAlianza, string> = {
  carta: 'Carta enviada',
  conversacion: 'En conversación',
  reunion: 'Reunión agendada',
}

const ESTADO_STYLE: Record<EstadoAlianza, string> = {
  carta: 'bg-kuska-teal/15 border-kuska-teal/30 text-kuska-teal',
  conversacion: 'bg-kuska-gold/15 border-kuska-gold/30 text-[#9a6a07]',
  reunion: 'bg-[#3F7D4A]/15 border-[#3F7D4A]/30 text-[#3F7D4A]',
}

// Nota: estados de ejemplo — Kuska aún no tiene un CRM/dato real de alianzas.
const ALIANZAS: { slug: string; name: string; estado: EstadoAlianza }[] = [
  { slug: 'scale', name: 'Scale', estado: 'reunion' },
  { slug: 'wichay', name: 'Wichay', estado: 'conversacion' },
  { slug: 'utec', name: 'UTEC', estado: 'reunion' },
  { slug: 'emprendeup', name: 'EmprendeUP', estado: 'carta' },
  { slug: 'proinnovate', name: 'ProInnóvate', estado: 'conversacion' },
  { slug: 'bcp', name: 'BCP', estado: 'carta' },
  { slug: 'intercorp', name: 'Intercorp', estado: 'conversacion' },
  { slug: 'romero', name: 'Fundación Romero', estado: 'reunion' },
  { slug: 'wiese', name: 'Wiese', estado: 'carta' },
]

export function AlianzasSection() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <p className="text-center font-nunito text-sm font-bold uppercase tracking-wide text-kuska-text-mid">
        Respaldados por el ecosistema de innovación del Perú
      </p>

      <motion.div
        className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-3"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}
      >
        {ALIANZAS.map((a) => (
          <motion.div
            key={a.slug}
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] } },
            }}
            className="group rounded-card border border-kuska-brown/15 bg-kuska-cream p-6 text-center transition-all duration-300 hover:-translate-y-1.5 hover:scale-[1.05]"
            style={{ boxShadow: '0 4px 16px rgba(61,28,2,0.06)' }}
            onMouseEnter={(e) => {
              ;(e.currentTarget as HTMLDivElement).style.boxShadow =
                '0 16px 32px rgba(61,28,2,0.12), 0 0 24px rgba(212,146,10,0.25)'
            }}
            onMouseLeave={(e) => {
              ;(e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 16px rgba(61,28,2,0.06)'
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
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
