'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export default function RaicesPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}>
        <h1 className="text-2xl font-bold text-[#F0EAE0]" style={{ fontFamily: 'Playfair Display, serif' }}>Mis Raíces</h1>
        <p className="text-[#F0EAE0]/40 text-sm mt-1">Documenta tu linaje cultural y la historia detrás de cada creación.</p>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.08 }}
        className="glass rounded-3xl p-8 text-center">
        <div className="text-5xl mb-4">📖</div>
        <h2 className="text-[#F0EAE0]/80 font-semibold mb-2">Comparte tu historia cultural</h2>
        <p className="text-[#F0EAE0]/40 text-sm max-w-md mx-auto mb-6">Documenta el linaje de tu arte — técnicas ancestrales, región de origen y el significado cultural de cada pieza.</p>
        <Link href="/artesano/productos" className="btn-press inline-flex items-center gap-2 bg-[#C84B2F] hover:bg-[#A83A22] text-white font-semibold px-6 py-3 rounded-xl text-sm transition-colors duration-150">
          Crear historia para un producto
        </Link>
      </motion.div>
      <div className="grid md:grid-cols-3 gap-5">
        {[{ icon: '🎙️', title: 'Audio', desc: 'Narra tu historia en tu idioma nativo — quechua, aymara, español.' },
          { icon: '🎬', title: 'Video', desc: 'Muestra tu proceso artesanal de generación en generación.' },
          { icon: '🌳', title: 'Árbol de linaje', desc: 'Visualiza tu árbol familiar de maestros artesanos.' }]
          .map((item, i) => (
            <motion.div key={item.title} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.16 + i * 0.06 }} className="glass rounded-2xl p-5">
              <div className="text-3xl mb-3">{item.icon}</div>
              <h3 className="text-[#F0EAE0] font-semibold mb-1">{item.title}</h3>
              <p className="text-[#F0EAE0]/40 text-sm">{item.desc}</p>
            </motion.div>
          ))}
      </div>
    </div>
  )
}
