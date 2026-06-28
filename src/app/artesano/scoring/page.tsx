'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface Score { score: number; tier: string; salesCount: number; salesTotal: number; reputationAvg: number; activityDays: number }

const TIER_INFO: Record<string, { color: string; label: string; benefit: string }> = {
  BRONCE:  { color: '#CD7F32', label: 'Bronce',  benefit: 'Acceso a microcréditos hasta S/. 500' },
  PLATA:   { color: '#C0C0C0', label: 'Plata',   benefit: 'Microcréditos hasta S/. 2,000' },
  ORO:     { color: '#D4920A', label: 'Oro',     benefit: 'Créditos hasta S/. 10,000' },
  PLATINO: { color: '#2E7A6E', label: 'Platino', benefit: 'Acceso a inversores institucionales' },
}

export default function ScoringPage() {
  const [score, setScore] = useState<Score | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/artesano/stats').then(r => r.json()).then(d => {
      if (d.data) setScore({ score: d.data.creditScore, tier: d.data.creditTier, salesCount: d.data.totalSales, salesTotal: d.data.totalRevenue, reputationAvg: d.data.avgRating, activityDays: 0 })
    }).finally(() => setLoading(false))
  }, [])

  const tier = score ? (TIER_INFO[score.tier] ?? TIER_INFO.BRONCE) : TIER_INFO.BRONCE
  const pct  = score ? Math.min((score.score / 1000) * 100, 100) : 0

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}>
        <h1 className="text-2xl font-bold text-[#F0EAE0]" style={{ fontFamily: 'Playfair Display, serif' }}>Hub de Capitalización</h1>
        <p className="text-[#F0EAE0]/40 text-sm mt-1">Tu reputación como artesano convierte en acceso a crédito.</p>
      </motion.div>

      {/* Score card */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.08 }}
        className="glass rounded-3xl p-8">
        <div className="flex items-start justify-between mb-8">
          <div>
            <p className="text-[#F0EAE0]/40 text-xs uppercase tracking-wider mb-2">Tu Score Kuska</p>
            <div className="text-6xl font-bold" style={{ fontFamily: 'Playfair Display, serif', color: tier.color }}>
              {loading ? '—' : score?.score ?? 0}
            </div>
            <div className="text-sm font-semibold mt-1" style={{ color: tier.color }}>{tier.label}</div>
          </div>
          <div className="text-right">
            <p className="text-[#F0EAE0]/40 text-xs mb-1">Beneficio actual</p>
            <p className="text-[#F0EAE0]/70 text-sm max-w-[180px]">{tier.benefit}</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex justify-between text-xs text-[#F0EAE0]/30 mb-2">
            <span>0</span><span>250</span><span>500</span><span>750</span><span>1000</span>
          </div>
          <div className="h-2 bg-[#F0EAE0]/10 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.3 }}
              className="h-full rounded-full"
              style={{ background: `linear-gradient(90deg, ${tier.color}, ${tier.color}bb)` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Ventas', value: score?.salesCount ?? 0, pct: '30%' },
            { label: 'Reputación', value: `${(score?.reputationAvg ?? 0).toFixed(1)} ★`, pct: '40%' },
            { label: 'Actividad', value: `${score?.activityDays ?? 0}d`, pct: '30%' },
          ].map(item => (
            <div key={item.label} className="text-center p-3 rounded-xl" style={{ background: 'rgba(240,234,224,0.04)' }}>
              <p className="text-xs text-[#F0EAE0]/35 mb-1">{item.label} ({item.pct})</p>
              <p className="text-[#F0EAE0] font-bold">{loading ? '—' : item.value}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Tier ladder */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.14 }}
        className="space-y-3">
        <h2 className="text-sm font-semibold text-[#F0EAE0]/50 uppercase tracking-wider">Niveles de capitalización</h2>
        {Object.entries(TIER_INFO).map(([key, info]) => (
          <div key={key} className="flex items-center gap-4 glass rounded-2xl p-4"
            style={score?.tier === key ? { border: `1px solid ${info.color}40`, background: `${info.color}08` } : {}}>
            <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: info.color }} />
            <div className="flex-1">
              <div className="font-semibold text-sm" style={{ color: score?.tier === key ? info.color : 'rgba(240,234,224,0.6)' }}>{info.label}</div>
              <div className="text-xs text-[#F0EAE0]/35 mt-0.5">{info.benefit}</div>
            </div>
            {score?.tier === key && <div className="text-xs text-[#F0EAE0]/50">Nivel actual</div>}
          </div>
        ))}
      </motion.div>
    </div>
  )
}
