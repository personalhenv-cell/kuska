'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'

interface Stats {
  totalProducts: number; activeProducts: number; totalSales: number
  totalRevenue: number; avgRating: number; creditScore: number; creditTier: string
}

const QUICK = [
  { href: '/artesano/productos', icon: '🏺', label: 'Mis Productos', desc: 'Gestiona tu catálogo' },
  { href: '/artesano/raices',    icon: '📖', label: 'Mis Raíces',    desc: 'Documenta tu historia' },
  { href: '/artesano/cfo',       icon: '🤖', label: 'CFO-Bot',       desc: 'Analiza tus finanzas' },
  { href: '/artesano/ferias',    icon: '🎪', label: 'Ferias',        desc: 'Próximos eventos' },
  { href: '/artesano/academia',  icon: '🎓', label: 'Academia',      desc: 'Aprende y crece' },
  { href: '/artesano/scoring',   icon: '💰', label: 'Mi Scoring',    desc: 'Accede a crédito' },
]

function StatCard({ label, value, sub, color }: { label: string; value: string | number; sub?: string; color: string }) {
  return (
    <div className="glass rounded-2xl p-5">
      <p className="text-[#F0EAE0]/40 text-xs uppercase tracking-wider mb-2">{label}</p>
      <p className="text-2xl font-bold text-[#F0EAE0]" style={{ fontFamily: 'Playfair Display, serif' }}>{value}</p>
      {sub && <p className="text-xs mt-1" style={{ color }}>{sub}</p>}
    </div>
  )
}

export default function ArtesanoDashboard() {
  const { data: session } = useSession()
  const [stats, setStats] = useState<Stats | null>(null)

  useEffect(() => {
    fetch('/api/artesano/stats').then(r => r.json()).then(d => setStats(d.data)).catch(() => {})
  }, [])

  const tierColor = (tier: string) => ({ BRONCE: '#CD7F32', PLATA: '#C0C0C0', ORO: '#D4920A', PLATINO: '#2E7A6E' }[tier] ?? '#F0EAE0')

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Welcome */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="flex items-center gap-4">
        <Image src="/kusi.png" alt="Kusi" width={56} height={56} className="rounded-2xl flex-shrink-0" priority />
        <div>
          <h1 className="text-2xl font-bold text-[#F0EAE0]" style={{ fontFamily: 'Playfair Display, serif' }}>
            Bienvenido de vuelta 👋
          </h1>
          <p className="text-[#F0EAE0]/40 text-sm mt-1">{session?.user.phone}</p>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.08 }}
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {stats ? (
          <>
            <StatCard label="Productos activos" value={stats.activeProducts} sub={`de ${stats.totalProducts} total`} color="#2E7A6E" />
            <StatCard label="Ventas" value={stats.totalSales} color="#2E7A6E" />
            <StatCard label="Ingresos" value={`S/. ${stats.totalRevenue.toFixed(0)}`} color="#D4920A" />
            <StatCard label="Score Kuska" value={stats.creditScore} sub={stats.creditTier} color={tierColor(stats.creditTier)} />
          </>
        ) : (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="glass rounded-2xl p-5 space-y-3">
              <div className="h-3 bg-[#F0EAE0]/5 rounded shimmer-bg w-2/3" />
              <div className="h-6 bg-[#F0EAE0]/5 rounded shimmer-bg w-1/2" />
            </div>
          ))
        )}
      </motion.div>

      {/* Quick access */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.14 }}>
        <h2 className="text-sm font-semibold text-[#F0EAE0]/50 uppercase tracking-wider mb-4">Acceso rápido</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {QUICK.map((item, i) => (
            <motion.div key={item.href} initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.16 + i * 0.05 }}>
              <Link href={item.href} className="block glass card-hover rounded-2xl p-4 group">
                <span className="text-2xl">{item.icon}</span>
                <h3 className="text-[#F0EAE0] font-semibold text-sm mt-3 group-hover:text-white transition-colors duration-150">{item.label}</h3>
                <p className="text-[#F0EAE0]/35 text-xs mt-0.5">{item.desc}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* CTA complete profile */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.28 }}
        className="rounded-2xl p-6 border" style={{ background: 'rgba(200,75,47,0.06)', borderColor: 'rgba(200,75,47,0.15)' }}>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h3 className="text-[#F0EAE0] font-semibold mb-1">Completa tu perfil</h3>
            <p className="text-[#F0EAE0]/45 text-sm">Un perfil completo aumenta tu visibilidad y tu Score Kuska.</p>
          </div>
          <Link href="/artesano/perfil"
            className="btn-press flex-shrink-0 text-sm bg-[#C84B2F] hover:bg-[#A83A22] text-white font-semibold px-5 py-2.5 rounded-xl transition-colors duration-150">
            Editar perfil
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
