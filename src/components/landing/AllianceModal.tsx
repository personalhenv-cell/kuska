'use client'

import Image from 'next/image'
import { AnimatePresence, motion } from 'framer-motion'
import { Kusi } from '@/components/ui/Kusi'
import type { KusiExpression } from '@/components/ui/Kusi'
import type { Alianza } from './alianzas-data'

const ESTADO_LABEL: Record<Alianza['estado'], string> = {
  carta: 'Carta enviada',
  conversacion: 'En conversación',
  reunion: 'Reunión agendada',
}

const ESTADO_STYLE: Record<Alianza['estado'], string> = {
  carta: 'bg-kuska-teal/15 border-kuska-teal/30 text-kuska-teal',
  conversacion: 'bg-kuska-gold/15 border-kuska-gold/30 text-kuska-gold',
  reunion: 'bg-[#3F7D4A]/15 border-[#3F7D4A]/30 text-[#3F7D4A]',
}

const ESTADO_KUSI: Record<Alianza['estado'], KusiExpression> = {
  carta: 'dudoso',
  conversacion: 'explicando',
  reunion: 'sorprendido',
}

interface AllianceModalProps {
  alliance: Alianza | null
  onClose: () => void
  onNext: () => void
  onPrev: () => void
}

export function AllianceModal({ alliance, onClose, onNext, onPrev }: AllianceModalProps) {
  return (
    <AnimatePresence>
      {alliance && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <motion.div
            className="absolute inset-0 bg-kuska-brown/60 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="alliance-modal-title"
            className="relative w-full max-w-xl overflow-hidden rounded-glass border-2 border-kuska-gold/60 bg-white shadow-2xl"
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
          >
            <button
              onClick={onClose}
              aria-label="Cerrar"
              className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-kuska-cream/90 text-kuska-text-mid transition-colors hover:bg-kuska-cream hover:text-kuska-red"
            >
              ✕
            </button>

            <AnimatePresence mode="wait">
              <motion.div
                key={alliance.slug}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.25 }}
                className="p-8"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-2xl border border-kuska-border bg-kuska-cream p-3">
                    <Image
                      src={`/alianzas/${alliance.slug}.png`}
                      alt={alliance.name}
                      width={64}
                      height={64}
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <div className="min-w-0 flex-1 pt-1">
                    <h2 id="alliance-modal-title" className="font-display text-2xl font-bold text-kuska-text">
                      {alliance.name}
                    </h2>
                    <span
                      className={`mt-2 inline-flex items-center rounded-full border px-3 py-1 font-nunito text-xs font-bold ${ESTADO_STYLE[alliance.estado]}`}
                    >
                      {ESTADO_LABEL[alliance.estado]}
                    </span>
                  </div>
                </div>

                <div className="mt-5 space-y-4">
                  <div className="rounded-card bg-kuska-cream/60 p-4">
                    <p className="font-nunito text-xs font-bold uppercase tracking-wide text-kuska-text-mid">
                      Impacto y valor de la alianza
                    </p>
                    <p className="mt-1.5 font-body text-sm leading-relaxed text-kuska-text">
                      {alliance.impacto}
                    </p>
                  </div>

                  <div className="rounded-card border border-kuska-gold/25 bg-kuska-gold/5 p-4">
                    <p className="font-nunito text-xs font-bold uppercase tracking-wide text-kuska-gold">
                      Nuestro compromiso
                    </p>
                    <p className="mt-1.5 font-body text-sm leading-relaxed text-kuska-text">
                      {alliance.compromiso}
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-3 border-t border-kuska-border pt-4">
                    <div>
                      <p className="font-nunito text-[10px] font-bold uppercase tracking-wide text-kuska-text-mid/70">
                        Contacto en {alliance.name}
                      </p>
                      <p className="mt-0.5 font-body text-xs text-kuska-text">{alliance.contacto}</p>
                    </div>
                    <Kusi size="sm" expression={ESTADO_KUSI[alliance.estado]} />
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="flex items-center justify-between border-t border-kuska-border bg-kuska-cream/40 px-6 py-3">
              <button
                onClick={onPrev}
                className="rounded-full p-2 text-kuska-text-mid transition-all hover:-translate-x-0.5 hover:bg-white hover:text-kuska-red"
                aria-label="Alianza anterior"
              >
                ←
              </button>
              <span className="font-nunito text-xs font-bold uppercase tracking-wide text-kuska-text-mid">
                Ver otra alianza
              </span>
              <button
                onClick={onNext}
                className="rounded-full p-2 text-kuska-text-mid transition-all hover:translate-x-0.5 hover:bg-white hover:text-kuska-red"
                aria-label="Siguiente alianza"
              >
                →
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
