'use client'

import { motion } from 'framer-motion'

export default function FeriasPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}>
        <h1 className="text-2xl font-bold text-[#F0EAE0]" style={{ fontFamily: 'Playfair Display, serif' }}>Ferias</h1>
        <p className="text-[#F0EAE0]/40 text-sm mt-1">Ferias físicas, digitales e híbridas. Conecta con compradores del mundo.</p>
      </motion.div>
      <div className="grid md:grid-cols-3 gap-5">
        {[{ type: 'FÍSICA', icon: '🏪', color: '#C84B2F', desc: 'Participa en ferias presenciales en todo el Perú.' },
          { type: 'DIGITAL', icon: '💻', color: '#2E7A6E', desc: 'Transmisiones en vivo y showrooms virtuales.' },
          { type: 'HÍBRIDA', icon: '🌐', color: '#D4920A', desc: 'Lo mejor de ambos mundos — presencial y virtual.' }]
          .map((f, i) => (
            <motion.div key={f.type} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94], delay: i * 0.07 }}
              className="glass rounded-2xl p-6">
              <div className="text-3xl mb-3">{f.icon}</div>
              <div className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: f.color }}>{f.type}</div>
              <p className="text-[#F0EAE0]/50 text-sm">{f.desc}</p>
            </motion.div>
          ))}
      </div>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.2 }}
        className="glass rounded-3xl p-12 text-center">
        <div className="text-5xl mb-4">🎪</div>
        <h2 className="text-[#F0EAE0]/80 font-semibold mb-2">Próximamente</h2>
        <p className="text-[#F0EAE0]/40 text-sm max-w-md mx-auto">Las ferias estarán disponibles pronto. Serás el primero en enterarte.</p>
      </motion.div>
    </div>
  )
}
