'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface AdminStats { totalUsers: number; totalArtisans: number; totalClients: number; totalProducts: number; activeProducts: number }

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null)

  useEffect(() => {
    fetch('/api/admin/stats').then(r => r.json()).then(d => setStats(d.data)).catch(() => {})
  }, [])

  const cards = [
    { label: 'Usuarios totales', value: stats?.totalUsers, color: '#F0EAE0' },
    { label: 'Artesanos', value: stats?.totalArtisans, color: '#C84B2F' },
    { label: 'Emprendedores', value: stats?.totalClients, color: '#2E7A6E' },
    { label: 'Productos activos', value: stats?.activeProducts, color: '#D4920A' },
  ]

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}>
        <h1 className="text-2xl font-bold text-[#F0EAE0]" style={{ fontFamily: 'Playfair Display, serif' }}>Panel de Administración</h1>
        <p className="text-[#F0EAE0]/40 text-sm mt-1">Vista general de la plataforma Kuska.</p>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map((c, i) => (
          <motion.div key={c.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94], delay: i * 0.06 }} className="glass rounded-2xl p-5">
            <p className="text-[#F0EAE0]/40 text-xs uppercase tracking-wider mb-2">{c.label}</p>
            <p className="text-3xl font-bold" style={{ fontFamily: 'Playfair Display, serif', color: c.color }}>
              {c.value ?? '—'}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
