'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Icon, type IconName } from '@/components/ui/Icon'

export interface ModuleCard {
  href: string
  icon: IconName
  title: string
  desc: string
  /** Módulo Kuska IA — badge dorado. */
  ia?: boolean
  /** Chip informativo, ej. "Plan Pro", "Plan Maestro", "Nuevo". */
  chip?: string
  /** Estilo atenuado + candado: requiere activar algo (el href lleva a activarlo). */
  locked?: boolean
  /** Texto de acción cuando está locked, ej. "Actívalo en tu perfil". */
  lockCta?: string
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
  },
}

export function ModuleGrid({ title, subtitle, modules }: { title: string; subtitle?: string; modules: ModuleCard[] }) {
  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="font-display text-lg font-bold text-kuska-text">{title}</h2>
        {subtitle && <p className="font-body text-xs text-kuska-text-mid">{subtitle}</p>}
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {modules.map((m) => (
          <motion.div key={m.href + m.title} variants={itemVariants}>
            <Link href={m.href} className="block h-full">
              <motion.div
                whileHover={{ y: -4 }}
                className={`group relative flex h-full flex-col rounded-card border bg-white p-5 transition-shadow duration-300 ${
                  m.locked
                    ? 'border-dashed border-kuska-border'
                    : 'border-kuska-border hover:shadow-[0_14px_32px_rgba(61,28,2,0.10)] hover:border-kuska-gold/40'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-btn ${
                      m.ia ? 'bg-kuska-gold/15 text-kuska-gold' : 'bg-kuska-cream text-kuska-brown'
                    } ${m.locked ? 'opacity-50' : ''}`}
                  >
                    <Icon name={m.icon} className="h-6 w-6" />
                  </div>
                  <div className="flex flex-shrink-0 items-center gap-1.5">
                    {m.ia && (
                      <span className="rounded-full bg-kuska-gold/15 px-2 py-0.5 font-nunito text-[10px] font-bold uppercase tracking-wide text-kuska-gold">
                        Kuska IA
                      </span>
                    )}
                    {m.chip && (
                      <span className="rounded-full border border-kuska-border bg-kuska-cream/70 px-2 py-0.5 font-nunito text-[10px] font-bold uppercase tracking-wide text-kuska-text-mid">
                        {m.chip}
                      </span>
                    )}
                  </div>
                </div>
                <p className={`mt-3 font-body text-sm font-bold text-kuska-text ${m.locked ? 'opacity-60' : ''}`}>
                  {m.title}
                </p>
                <p className={`mt-1 flex-1 font-body text-xs leading-relaxed text-kuska-text-mid ${m.locked ? 'opacity-60' : ''}`}>
                  {m.desc}
                </p>
                <p
                  className={`mt-3 flex items-center gap-1.5 font-body text-xs font-semibold transition-colors ${
                    m.locked
                      ? 'text-kuska-teal'
                      : 'text-kuska-red/70 group-hover:text-kuska-red'
                  }`}
                >
                  {m.locked ? (
                    <>
                      <Icon name="lock" className="h-3.5 w-3.5" />
                      {m.lockCta ?? 'Actívalo'}
                    </>
                  ) : (
                    'Entrar →'
                  )}
                </p>
              </motion.div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
