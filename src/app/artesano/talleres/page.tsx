'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export default function TalleresPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#F0EAE0]" style={{ fontFamily: 'Playfair Display, serif' }}>Mis Talleres</h1>
          <p className="text-[#F0EAE0]/40 text-sm mt-1">Enseña tu arte y genera ingresos adicionales.</p>
        </div>
        <button className="btn-press flex items-center gap-2 bg-[#C84B2F] hover:bg-[#A83A22] text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors duration-150">
          + Nuevo taller
        </button>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.08 }}
        className="glass rounded-3xl p-12 text-center">
        <div className="text-5xl mb-4">🎨</div>
        <h2 className="text-[#F0EAE0]/80 font-semibold mb-2">Comparte tu conocimiento</h2>
        <p className="text-[#F0EAE0]/40 text-sm max-w-md mx-auto mb-6">Crea talleres presenciales o virtuales y enseña tu técnica artesanal a aprendices de todo el Perú y el mundo.</p>
        <div className="grid sm:grid-cols-2 gap-4 max-w-sm mx-auto">
          {[{ label: 'Presencial', icon: '🏠' }, { label: 'Virtual', icon: '💻' }].map(m => (
            <button key={m.label} className="btn-press glass border border-[#F0EAE0]/10 rounded-xl p-4 text-[#F0EAE0]/60 hover:text-[#F0EAE0] transition-colors duration-150">
              <div className="text-2xl mb-1">{m.icon}</div>
              <div className="text-sm font-medium">{m.label}</div>
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
