'use client'

import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import { Kusi } from '@/components/ui/Kusi'

export interface FeatureDetail {
  icon: string
  title: string
  tagline: string
  description: string
  highlights: string[]
  gateLabel: string
  ctaLabel: string
  ctaHref: string
  accent: 'red' | 'gold' | 'teal'
  /** Si es true, muestra la nota de "Potenciado por Kuska IA" en el footer. */
  poweredByAi?: boolean
}

const ACCENT_GRADIENT: Record<FeatureDetail['accent'], string> = {
  red: 'linear-gradient(135deg, #3D1C02 0%, #C84B2F 100%)',
  gold: 'linear-gradient(135deg, #3D1C02 0%, #D4920A 100%)',
  teal: 'linear-gradient(135deg, #3D1C02 0%, #2E7A6E 100%)',
}

const ACCENT_TEXT: Record<FeatureDetail['accent'], string> = {
  red: 'text-kuska-red',
  gold: 'text-kuska-gold',
  teal: 'text-kuska-teal',
}

interface FeatureDetailModalProps {
  feature: FeatureDetail | null
  onClose: () => void
}

export function FeatureDetailModal({ feature, onClose }: FeatureDetailModalProps) {
  return (
    <AnimatePresence>
      {feature && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-kuska-brown/60 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden
          />

          {/* Modal card */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="feature-modal-title"
            className="relative w-full max-w-lg overflow-hidden rounded-glass bg-white shadow-2xl"
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 12 }}
            transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {/* Header con gradiente e ícono */}
            <div
              className="relative overflow-hidden px-7 pb-8 pt-7"
              style={{ background: ACCENT_GRADIENT[feature.accent] }}
            >
              <div className="andean-texture pointer-events-none absolute inset-0 opacity-[0.08]" aria-hidden />
              <button
                onClick={onClose}
                aria-label="Cerrar"
                className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/15 text-white transition-colors hover:bg-white/25"
              >
                ✕
              </button>
              <div className="relative flex items-center gap-4">
                <motion.div
                  initial={{ scale: 0.6, rotate: -8 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', bounce: 0.5, duration: 0.6, delay: 0.1 }}
                  className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-white/15 text-3xl shadow-lg"
                >
                  {feature.icon}
                </motion.div>
                <div>
                  <span className="inline-block rounded-full bg-white/15 px-2.5 py-0.5 font-nunito text-[10px] font-bold uppercase tracking-wide text-white/90">
                    {feature.gateLabel}
                  </span>
                  <h3 id="feature-modal-title" className="mt-1 font-display text-2xl font-bold text-white">
                    {feature.title}
                  </h3>
                </div>
              </div>
              <p className="relative mt-3 font-body text-sm text-white/80">{feature.tagline}</p>
            </div>

            {/* Body */}
            <div className="px-7 py-6">
              <p className="font-body text-sm leading-relaxed text-kuska-text-mid">
                {feature.description}
              </p>

              <ul className="mt-5 space-y-3">
                {feature.highlights.map((h, i) => (
                  <motion.li
                    key={h}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 + i * 0.08, duration: 0.35 }}
                    className="flex items-start gap-3 font-body text-sm text-kuska-text"
                  >
                    <span
                      className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-kuska-cream text-xs ${ACCENT_TEXT[feature.accent]}`}
                    >
                      ✓
                    </span>
                    {h}
                  </motion.li>
                ))}
              </ul>

              {feature.poweredByAi && (
                <div className="mt-6 flex items-center gap-3 rounded-btn bg-kuska-cream/70 p-3">
                  <Kusi size="xs" animation="idle" />
                  <p className="font-nunito text-xs text-kuska-text-mid">
                    Potenciado por Kuska IA — inteligencia artificial entrenada para el contexto artesanal peruano.
                  </p>
                </div>
              )}

              <Link href={feature.ctaHref} onClick={onClose} className="mt-6 block">
                <motion.span
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex w-full items-center justify-center gap-2 rounded-btn bg-kuska-brown px-6 py-3.5 font-body text-sm font-bold text-white shadow-lg transition-shadow hover:shadow-xl"
                >
                  {feature.ctaLabel} →
                </motion.span>
              </Link>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
