'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'

const QUICK = [
  { href: '/marketplace',         icon: '🏪', label: 'Explorar', desc: 'Descubre artesanías únicas' },
  { href: '/cliente/emprendedor', icon: '🚀', label: 'IA Emprendedor', desc: 'Desarrolla tu idea de negocio' },
  { href: '/cliente/favoritos',   icon: '❤️', label: 'Favoritos', desc: 'Tus artesanías guardadas' },
  { href: '/cliente/pedidos',     icon: '📦', label: 'Pedidos', desc: 'Historial de compras' },
]

export default function ClienteDashboard() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="flex items-center gap-4">
        <Image src="/kusi.png" alt="Kusi" width={56} height={56} className="rounded-2xl flex-shrink-0" priority />
        <div>
          <h1 className="text-2xl font-bold text-[#F0EAE0]" style={{ fontFamily: 'Playfair Display, serif' }}>Bienvenido/a 👋</h1>
          <p className="text-[#F0EAE0]/40 text-sm mt-1">Explora artesanías únicas y desarrolla tu emprendimiento con IA.</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {QUICK.map((item, i) => (
          <motion.div key={item.href} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94], delay: i * 0.07 }}>
            <Link href={item.href} className="block glass card-hover rounded-2xl p-5 group">
              <span className="text-2xl">{item.icon}</span>
              <h3 className="text-[#F0EAE0] font-semibold text-sm mt-3 mb-1 group-hover:text-white transition-colors duration-150">{item.label}</h3>
              <p className="text-[#F0EAE0]/35 text-xs leading-relaxed">{item.desc}</p>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* IA Emprendedor CTA */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.28 }}
        className="rounded-3xl p-8 border" style={{ background: 'rgba(46,122,110,0.06)', borderColor: 'rgba(46,122,110,0.2)' }}>
        <div className="flex items-start justify-between gap-6 flex-wrap">
          <div>
            <div className="text-3xl mb-3">🚀</div>
            <h2 className="text-xl font-bold text-[#F0EAE0] mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>IA Emprendedor</h2>
            <p className="text-[#F0EAE0]/45 text-sm max-w-md">
              Cuéntame tu idea de negocio y te ayudo a crear un plan de negocio completo, con proyecciones financieras y pasos de acción.
            </p>
          </div>
          <Link href="/cliente/emprendedor"
            className="btn-press flex-shrink-0 flex items-center gap-2 font-semibold text-sm px-6 py-3 rounded-xl transition-colors duration-150 text-white"
            style={{ background: '#2E7A6E' }}>
            Crear mi plan
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
