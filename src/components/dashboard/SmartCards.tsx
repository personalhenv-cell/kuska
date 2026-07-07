'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Icon, type IconName } from '@/components/ui/Icon'

export interface SmartCard {
  icon: IconName
  accent: 'red' | 'gold' | 'teal' | 'brown'
  /** Valor protagonista: "S/ 1,240", "3", "Sáb 12 jul"… */
  value: string
  /** Qué significa el valor: "Ingresos de julio", "pedidos por enviar"… */
  label: string
  /** Contexto extra opcional: "+18% vs junio", "Taller de telar"… */
  detail?: string
  href: string
  cta: string
}

const ACCENT = {
  red: { chip: 'bg-kuska-red/12 text-kuska-red', ring: 'group-hover:border-kuska-red/35', wash: 'from-kuska-red/[0.05]' },
  gold: { chip: 'bg-kuska-gold/15 text-kuska-gold', ring: 'group-hover:border-kuska-gold/40', wash: 'from-kuska-gold/[0.06]' },
  teal: { chip: 'bg-kuska-teal/12 text-kuska-teal', ring: 'group-hover:border-kuska-teal/35', wash: 'from-kuska-teal/[0.05]' },
  brown: { chip: 'bg-kuska-brown/10 text-kuska-brown', ring: 'group-hover:border-kuska-brown/30', wash: 'from-kuska-brown/[0.04]' },
} as const

/**
 * Cards inteligentes del dashboard: solo se renderizan las que tienen algo
 * real que decir hoy (el servidor decide cuáles enviar). Si no hay ninguna,
 * la sección entera desaparece.
 */
export function SmartCards({ cards }: { cards: SmartCard[] }) {
  if (cards.length === 0) return null
  return (
    <div>
      <div className="flex items-baseline gap-2">
        <h2 className="font-display text-lg font-bold text-kuska-text">Para ti, hoy</h2>
        <span className="font-nunito text-xs text-kuska-text-mid">con tus datos reales</span>
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((c) => {
          const a = ACCENT[c.accent]
          return (
            <Link key={c.label + c.href} href={c.href} className="block h-full">
              <motion.div
                whileHover={{ y: -4 }}
                className={`group relative flex h-full flex-col overflow-hidden rounded-card border border-kuska-border bg-white p-5 transition-all duration-300 hover:shadow-[0_16px_36px_rgba(61,28,2,0.12)] ${a.ring}`}
              >
                <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${a.wash} to-transparent`} aria-hidden />
                <div className="relative flex items-start justify-between gap-3">
                  <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-btn ${a.chip}`}>
                    <Icon name={c.icon} className="h-5 w-5" />
                  </div>
                  {c.detail && (
                    <span className="rounded-full bg-kuska-cream px-2.5 py-1 font-nunito text-[10px] font-bold text-kuska-text-mid">
                      {c.detail}
                    </span>
                  )}
                </div>
                <p className="relative mt-3 font-display text-2xl font-bold leading-tight text-kuska-text">{c.value}</p>
                <p className="relative mt-0.5 flex-1 font-body text-sm text-kuska-text-mid">{c.label}</p>
                <p className="relative mt-3 font-body text-xs font-semibold text-kuska-red/70 transition-colors group-hover:text-kuska-red">
                  {c.cta} →
                </p>
              </motion.div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
