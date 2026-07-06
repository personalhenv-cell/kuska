'use client'

import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { Kusi } from '@/components/ui/Kusi'

const EASE: [number, number, number, number] = [0.4, 0, 0.2, 1]

interface DashboardHeroProps {
  badge: ReactNode
  title: string
  description: string
  kusiAnimation?: 'celebrate' | 'wave' | 'float'
}

/** Cabecera premium para módulos exclusivos del dashboard (Emprendedor IA,
 *  Capitalización) — misma identidad visual (liquid glass + textura andina)
 *  que el resto de la plataforma, evitando una foto de stock genérica de
 *  "negocios" que rompería el sistema de diseño. */
export function DashboardHero({ badge, title, description, kusiAnimation = 'wave' }: DashboardHeroProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: EASE }}
      className="liquid-glass-dark relative mb-8 overflow-hidden rounded-glass px-6 py-8 sm:px-10 sm:py-10"
    >
      <div className="andean-texture pointer-events-none absolute inset-0 opacity-[0.06]" />

      <div className="relative flex flex-wrap items-center gap-6">
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.5, ease: EASE }}
        >
          <Kusi size="lg" animation={kusiAnimation} />
        </motion.div>

        <div className="min-w-0 flex-1">
          <motion.span
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-1.5 rounded-full bg-kuska-gold/15 px-3 py-1 font-nunito text-xs font-bold uppercase tracking-wide text-kuska-gold"
          >
            {badge}
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28, duration: 0.5 }}
            className="mt-3 font-display text-2xl font-bold text-kuska-cream sm:text-3xl"
          >
            {title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.5 }}
            className="mt-2 max-w-lg font-body text-sm leading-relaxed text-kuska-cream/70"
          >
            {description}
          </motion.p>
        </div>
      </div>
    </motion.div>
  )
}
