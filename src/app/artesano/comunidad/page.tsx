'use client'

import { motion } from 'framer-motion'

export default function ComunidadPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}>
        <h1 className="text-2xl font-bold text-[#F0EAE0]" style={{ fontFamily: 'Playfair Display, serif' }}>Red Cuéntame</h1>
        <p className="text-[#F0EAE0]/40 text-sm mt-1">Comparte tu proceso, inspira y conecta con otros artesanos.</p>
      </motion.div>

      {/* Post composer */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.08 }}
        className="glass rounded-2xl p-5">
        <textarea placeholder="¿Qué quieres compartir con la comunidad Kuska?" rows={3}
          className="w-full bg-transparent text-[#F0EAE0] placeholder:text-[#F0EAE0]/25 outline-none resize-none text-sm leading-relaxed" />
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#F0EAE0]/[0.06]">
          <div className="flex gap-3">
            <button className="btn-press text-[#F0EAE0]/40 hover:text-[#F0EAE0] transition-colors duration-150 text-sm">📷 Foto</button>
            <button className="btn-press text-[#F0EAE0]/40 hover:text-[#F0EAE0] transition-colors duration-150 text-sm">🎬 Video</button>
          </div>
          <button className="btn-press bg-[#C84B2F] hover:bg-[#A83A22] text-white font-semibold px-5 py-2 rounded-xl text-sm transition-colors duration-150">
            Publicar
          </button>
        </div>
      </motion.div>

      {/* Empty state */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.15 }}
        className="glass rounded-3xl p-12 text-center">
        <div className="text-5xl mb-4">🌐</div>
        <h2 className="text-[#F0EAE0]/80 font-semibold mb-2">Sé el primero en compartir</h2>
        <p className="text-[#F0EAE0]/40 text-sm max-w-sm mx-auto">Las publicaciones de tu comunidad de artesanos aparecerán aquí.</p>
      </motion.div>
    </div>
  )
}
