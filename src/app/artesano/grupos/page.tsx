'use client'

import { motion } from 'framer-motion'

export default function GruposPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#F0EAE0]" style={{ fontFamily: 'Playfair Display, serif' }}>Grupos</h1>
          <p className="text-[#F0EAE0]/40 text-sm mt-1">Conecta y colabora con artesanos de tu región.</p>
        </div>
        <button className="btn-press flex items-center gap-2 bg-[#C84B2F] hover:bg-[#A83A22] text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors duration-150">
          + Crear grupo
        </button>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.08 }}
        className="glass rounded-3xl p-12 text-center">
        <div className="text-5xl mb-4">💬</div>
        <h2 className="text-[#F0EAE0]/80 font-semibold mb-2">Grupos de artesanos</h2>
        <p className="text-[#F0EAE0]/40 text-sm max-w-md mx-auto mb-6">Crea o únete a grupos por región, técnica o tipo de artesanía. Comparte pedidos, consejos y organiza colectivos de producción.</p>
        <div className="flex justify-center gap-3">
          <button className="btn-press glass border border-[#F0EAE0]/10 text-[#F0EAE0]/60 hover:text-[#F0EAE0] px-5 py-2.5 rounded-xl text-sm transition-colors duration-150">
            Explorar grupos
          </button>
          <button className="btn-press bg-[#C84B2F] hover:bg-[#A83A22] text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors duration-150">
            Crear mi grupo
          </button>
        </div>
      </motion.div>
    </div>
  )
}
