'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface Course { id: string; title: string; provider: string | null; level: string; durationHrs: number | null; isFree: boolean; coverUrl: string | null; category: string | null }

export default function AcademiaPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/academia/courses').then(r => r.json()).then(d => setCourses(d.data ?? [])).finally(() => setLoading(false))
  }, [])

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}>
        <h1 className="text-2xl font-bold text-[#F0EAE0]" style={{ fontFamily: 'Playfair Display, serif' }}>Academia Kuska</h1>
        <p className="text-[#F0EAE0]/40 text-sm mt-1">Cursos de negocio, marketing digital y gestión financiera para artesanos.</p>
      </motion.div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading ? Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="glass rounded-2xl overflow-hidden">
            <div className="h-36 bg-[#1A1208] shimmer-bg" />
            <div className="p-4 space-y-2"><div className="h-4 bg-[#F0EAE0]/5 rounded shimmer-bg" /><div className="h-3 bg-[#F0EAE0]/5 rounded shimmer-bg w-2/3" /></div>
          </div>
        )) : courses.length === 0 ? (
          <div className="col-span-full glass rounded-3xl p-12 text-center">
            <div className="text-5xl mb-4">🎓</div>
            <p className="text-[#F0EAE0]/50">Los cursos estarán disponibles próximamente.</p>
          </div>
        ) : courses.map((c, i) => (
          <motion.div key={c.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94], delay: i * 0.05 }}
            className="glass card-hover rounded-2xl overflow-hidden">
            <div className="h-36 bg-[#1A1208] flex items-center justify-center text-4xl">🎓</div>
            <div className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(46,122,110,0.15)', color: '#2E7A6E' }}>{c.level}</span>
                {c.isFree && <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(212,146,10,0.15)', color: '#D4920A' }}>Gratis</span>}
              </div>
              <h3 className="text-[#F0EAE0] font-semibold text-sm leading-tight mb-1">{c.title}</h3>
              {c.provider && <p className="text-[#F0EAE0]/35 text-xs">{c.provider}</p>}
              {c.durationHrs && <p className="text-[#F0EAE0]/30 text-xs mt-1">{c.durationHrs}h de contenido</p>}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
