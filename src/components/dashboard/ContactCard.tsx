'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

export function ContactCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Link href="/contactanos" className="block group">
        <motion.div
          className="overflow-hidden rounded-glass border border-kuska-border bg-gradient-to-br from-kuska-cream to-white p-6 cursor-pointer transition-all"
          whileHover={{ y: -4, boxShadow: '0 12px 40px -8px rgba(200,75,47,0.15)' }}
        >
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-display text-lg font-bold text-kuska-brown">
                ¿Necesitas ayuda?
              </h3>
              <p className="mt-1 font-body text-sm text-kuska-text-mid">
                Contacta al equipo de Kuska y Agencia CEIPE
              </p>
              <div className="mt-3 space-y-1">
                <p className="font-nunito text-xs font-bold uppercase tracking-wide text-kuska-teal">
                  📧 contacto.ceipe@gmail.com
                </p>
                <p className="font-nunito text-xs font-bold uppercase tracking-wide text-kuska-teal">
                  📱 908 915 629 (CEO)
                </p>
              </div>
            </div>
            <div className="text-2xl">💬</div>
          </div>
          <div className="mt-4 inline-block font-nunito text-xs font-bold text-kuska-red group-hover:text-kuska-gold transition-colors">
            Enviar mensaje →
          </div>
        </motion.div>
      </Link>
    </motion.div>
  )
}
