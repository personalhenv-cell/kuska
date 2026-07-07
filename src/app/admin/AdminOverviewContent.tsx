'use client'

import { motion } from 'framer-motion'
import { Icon, type IconName } from '@/components/ui/Icon'
import { SalesLineChart, TopProductsBarChart } from '@/app/dashboard/artesano/estadisticas/SalesCharts'

interface StatCard {
  label: string
  value: string | number
  icon: IconName
}

interface Props {
  cards: StatCard[]
  revenueTrend: { date: string; total: number }[]
  topProducts: { name: string; sales: number }[]
  topArtisans: { name: string; sales: number }[]
}

const EASE: [number, number, number, number] = [0.4, 0, 0.2, 1]

export function AdminOverviewContent({ cards, revenueTrend, topProducts, topArtisans }: Props) {
  return (
    <div className="p-6 lg:p-10 space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-kuska-text">Panel de administración</h1>
        <p className="mt-1 font-body text-sm text-kuska-text-mid">Estado real de la plataforma Kuska.</p>
      </div>

      <motion.div
        className="grid grid-cols-2 gap-4 sm:grid-cols-3"
        initial="hidden"
        animate="show"
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}
      >
        {cards.map((c) => (
          <motion.div
            key={c.label}
            variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE } } }}
            whileHover={{ y: -4 }}
            className="rounded-card border border-kuska-border bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-kuska-gold/12 text-kuska-gold">
              <Icon name={c.icon} className="h-[18px] w-[18px]" />
            </div>
            <p className="mt-3 font-display text-2xl font-bold text-kuska-text">{c.value}</p>
            <p className="font-nunito text-xs font-bold uppercase tracking-wide text-kuska-text-mid">{c.label}</p>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4, ease: EASE }}
          className="rounded-card border border-kuska-border bg-white p-6"
        >
          <h2 className="font-display text-lg font-bold text-kuska-text">Ingresos — últimos 30 días</h2>
          {revenueTrend.length === 0 ? (
            <p className="mt-6 font-body text-sm text-kuska-text-mid">Aún no hay ventas pagadas para graficar.</p>
          ) : (
            <div className="mt-4">
              <SalesLineChart data={revenueTrend} />
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28, duration: 0.4, ease: EASE }}
          className="rounded-card border border-kuska-border bg-white p-6"
        >
          <h2 className="font-display text-lg font-bold text-kuska-text">Productos más vendidos</h2>
          {topProducts.length === 0 || topProducts.every((p) => p.sales === 0) ? (
            <p className="mt-6 font-body text-sm text-kuska-text-mid">Aún no hay ventas registradas.</p>
          ) : (
            <div className="mt-4">
              <TopProductsBarChart data={topProducts} />
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.36, duration: 0.4, ease: EASE }}
          className="rounded-card border border-kuska-border bg-white p-6 lg:col-span-2"
        >
          <h2 className="font-display text-lg font-bold text-kuska-text">Artesanos más activos</h2>
          {topArtisans.length === 0 || topArtisans.every((a) => a.sales === 0) ? (
            <p className="mt-6 font-body text-sm text-kuska-text-mid">Aún no hay ventas registradas.</p>
          ) : (
            <div className="mt-4">
              <TopProductsBarChart data={topArtisans} />
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
