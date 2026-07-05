'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Kusi } from '@/components/ui/Kusi'
import { Badge } from '@/components/ui/Badge'
import { formatPrice, formatDate } from '@/lib/utils'
import { levelName } from '@/lib/memberships'

interface User {
  name: string | null
  points: number | null
  level: number | null
}

interface Stat {
  label: string
  value: number | string
  icon: string
}

interface RecentOrder {
  id: string
  order: { created_at: Date; status: string; total: number; id: string; payment_status: string }
  product: { name: string }
}

interface Badge {
  id: string
  earned_at: Date
  badge: { name: string; description: string; icon: string }
}

interface Mission {
  id: string
  title: string
  description: string
}

interface DashboardContentProps {
  user: User | null
  plan: { id: string; name: string } | null | undefined
  stats: Stat[]
  recentOrders: RecentOrder[]
  badges: Badge[]
  missions: Mission[]
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
  },
}

export function ArtisanDashboardContent({
  user,
  plan,
  stats,
  recentOrders,
  badges,
  missions,
}: DashboardContentProps) {
  return (
    <motion.div
      className="p-6 lg:p-10 space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Banner de bienvenida */}
      <motion.div variants={itemVariants} className="liquid-glass-dark relative overflow-hidden rounded-glass px-6 py-8 sm:px-10">
        <div className="andean-texture pointer-events-none absolute inset-0 opacity-[0.06]" />
        <div className="relative flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
          <Kusi size="lg" animation="celebrate" />
          <div>
            <h1 className="font-display text-2xl font-bold text-kuska-cream sm:text-3xl">
              ¡Hola, {user?.name ?? 'artesano'}! 🦙
            </h1>
            <p className="mt-1 font-body text-kuska-cream/75">
              Nivel {user?.level ?? 1} — {levelName(user?.level ?? 1)} · {user?.points ?? 0} puntos
            </p>
            <div className="mt-2 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
              <span className="rounded-full border border-kuska-gold/40 bg-kuska-gold/15 px-3 py-1 font-nunito text-xs font-bold text-kuska-gold">
                Plan: {plan?.name ?? 'Artesano Semilla'}
              </span>
              {plan?.id === 'semilla' && (
                <Link href="/precios" className="font-body text-xs text-kuska-cream/60 underline-offset-2 hover:text-kuska-gold hover:underline transition-colors">
                  Mejorar plan →
                </Link>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <motion.div
            key={s.label}
            className="rounded-card border border-kuska-border bg-white p-5 transition-all hover:shadow-lg hover:border-kuska-gold/30"
            whileHover={{ y: -4 }}
          >
            <span className="text-2xl">{s.icon}</span>
            <p className="mt-2 font-display text-2xl font-bold text-kuska-text">{s.value}</p>
            <p className="font-nunito text-xs text-kuska-text-mid">{s.label}</p>
          </motion.div>
        ))}
      </motion.div>

      <motion.div variants={itemVariants} className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        {/* Pedidos recientes */}
        <div className="rounded-card border border-kuska-border bg-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-bold text-kuska-text">Pedidos recientes</h2>
            <Link href="/dashboard/artesano/pedidos" className="font-body text-sm font-semibold text-kuska-red hover:text-kuska-red/80 transition-colors">
              Ver todos →
            </Link>
          </div>
          {recentOrders.length === 0 ? (
            <p className="mt-6 font-body text-sm text-kuska-text-mid">Aún sin pedidos</p>
          ) : (
            <div className="mt-4 space-y-3">
              {recentOrders.slice(0, 3).map((item) => (
                <Link
                  key={item.id}
                  href={`/dashboard/artesano/pedidos`}
                  className="block rounded-btn border border-kuska-border/50 bg-kuska-cream/30 p-3 transition-all hover:bg-kuska-cream/50 hover:border-kuska-gold/30"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-body text-sm font-semibold text-kuska-text">
                      {item.product.name}
                    </span>
                    <span className="font-display text-sm font-bold text-kuska-red">
                      {formatPrice(item.order.total)}
                    </span>
                  </div>
                  <p className="mt-1 font-nunito text-xs text-kuska-text-mid">
                    {formatDate(item.order.created_at.toString())} · {item.order.status}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Insignias y Misiones */}
        <div className="space-y-4">
          {/* Insignias */}
          <div className="rounded-card border border-kuska-border bg-white p-6">
            <h3 className="font-display text-lg font-bold text-kuska-text">Insignias</h3>
            {badges.length === 0 ? (
              <p className="mt-3 font-body text-sm text-kuska-text-mid">Gana insignias completando misiones</p>
            ) : (
              <div className="mt-3 flex flex-wrap gap-2">
                {badges.map((b) => (
                  <motion.div
                    key={b.id}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="flex h-12 w-12 items-center justify-center rounded-full bg-kuska-gold/15 text-lg cursor-pointer"
                    title={b.badge.name}
                  >
                    {b.badge.icon}
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Misiones Activas */}
          <div className="rounded-card border border-kuska-border bg-white p-6">
            <h3 className="font-display text-lg font-bold text-kuska-text">Misiones</h3>
            {missions.length === 0 ? (
              <p className="mt-3 font-body text-sm text-kuska-text-mid">Completa misiones para ganar puntos</p>
            ) : (
              <div className="mt-3 space-y-2">
                {missions.slice(0, 2).map((m) => (
                  <div key={m.id} className="rounded-btn bg-kuska-cream/50 p-3">
                    <p className="font-body text-sm font-semibold text-kuska-text">{m.title}</p>
                    <p className="text-xs text-kuska-text-mid">{m.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
