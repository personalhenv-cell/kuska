'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export default function FavoritosPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}>
        <h1 className="text-2xl font-bold text-[#F0EAE0]" style={{ fontFamily: 'Playfair Display, serif' }}>Mis Favoritos</h1>
        <p className="text-[#F0EAE0]/40 text-sm mt-1">Artesanías que guardaste para después.</p>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.08 }}
        className="glass rounded-3xl p-12 text-center">
        <div className="text-5xl mb-4">❤️</div>
        <h2 className="text-[#F0EAE0]/80 font-semibold mb-2">Aún no tienes favoritos</h2>
        <p className="text-[#F0EAE0]/40 text-sm max-w-sm mx-auto mb-6">Explora el marketplace y guarda los productos que más te gusten.</p>
        <Link href="/marketplace" className="btn-press inline-flex items-center gap-2 bg-[#C84B2F] hover:bg-[#A83A22] text-white font-semibold px-6 py-3 rounded-xl text-sm transition-colors duration-150">
          Explorar marketplace
        </Link>
      </motion.div>
    </div>
  )
}
