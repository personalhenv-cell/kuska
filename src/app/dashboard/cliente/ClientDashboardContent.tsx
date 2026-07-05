'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { Kusi } from '@/components/ui/Kusi'
import { Badge } from '@/components/ui/Badge'
import { formatPrice } from '@/lib/utils'
import { levelName } from '@/lib/memberships'

interface User {
  name: string | null
  points: number | null
  level: number | null
}

interface Product {
  id: string
  name: string
  slug: string
  price: number
  images: string[]
  is_featured: boolean
}

interface ClientDashboardContentProps {
  user: User | null
  plan: { id: string; name: string } | null | undefined
  orderCount: number
  favoriteCount: number
  featured: Product[]
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
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

export function ClientDashboardContent({
  user,
  plan,
  orderCount,
  favoriteCount,
  featured,
}: ClientDashboardContentProps) {
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
          <Kusi size="lg" animation="wave" />
          <div>
            <h1 className="font-display text-2xl font-bold text-kuska-cream sm:text-3xl">
              ¡Hola, {user?.name ?? 'amigo'}! ✨
            </h1>
            <p className="mt-1 font-body text-kuska-cream/75">
              Nivel {user?.level ?? 1} — {levelName(user?.level ?? 1)} · {user?.points ?? 0} puntos
            </p>
            <div className="mt-2 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
              <span className="rounded-full border border-kuska-gold/40 bg-kuska-gold/15 px-3 py-1 font-nunito text-xs font-bold text-kuska-gold">
                Plan: {plan?.name ?? 'Cliente Explorador'}
              </span>
              {plan?.id === 'explorador' && (
                <Link href="/precios" className="font-body text-xs text-kuska-cream/60 underline-offset-2 hover:text-kuska-gold hover:underline transition-colors">
                  Mejorar plan →
                </Link>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4 sm:grid-cols-2">
        <Link href="/dashboard/cliente/pedidos" className="block">
          <motion.div
            className="rounded-card border border-kuska-border bg-white p-5 transition-all cursor-pointer"
            whileHover={{ y: -4, boxShadow: '0 10px 30px -8px rgba(200,75,47,0.2)' }}
          >
            <span className="text-2xl">📦</span>
            <p className="mt-2 font-display text-2xl font-bold text-kuska-text">{orderCount}</p>
            <p className="font-nunito text-xs text-kuska-text-mid">Mis pedidos</p>
          </motion.div>
        </Link>
        <Link href="/dashboard/cliente/favoritos" className="block">
          <motion.div
            className="rounded-card border border-kuska-border bg-white p-5 transition-all cursor-pointer"
            whileHover={{ y: -4, boxShadow: '0 10px 30px -8px rgba(200,75,47,0.2)' }}
          >
            <span className="text-2xl">❤️</span>
            <p className="mt-2 font-display text-2xl font-bold text-kuska-text">{favoriteCount}</p>
            <p className="font-nunito text-xs text-kuska-text-mid">Favoritos</p>
          </motion.div>
        </Link>
      </motion.div>

      {/* Recomendado */}
      <motion.div variants={itemVariants}>
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-kuska-text">Recomendado para ti</h2>
          <Link href="/marketplace" className="font-body text-sm font-semibold text-kuska-red hover:text-kuska-red/80 transition-colors">
            Ver marketplace →
          </Link>
        </div>
        <motion.div
          className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {featured.map((p) => (
            <motion.div key={p.id} variants={itemVariants}>
              <Link href={`/producto/${p.slug}`}>
                <motion.div
                  className="group overflow-hidden rounded-card border border-kuska-border bg-white cursor-pointer"
                  whileHover={{ y: -4 }}
                >
                  <div className="relative h-40 overflow-hidden bg-kuska-cream-dark">
                    {p.images[0] && (
                      <Image
                        src={p.images[0]}
                        alt={p.name}
                        width={320}
                        height={160}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    )}
                  </div>
                  <div className="space-y-1.5 p-4">
                    {p.is_featured && <Badge variant="new">Destacado</Badge>}
                    <p className="font-body font-semibold text-kuska-text group-hover:text-kuska-red transition-colors">
                      {p.name}
                    </p>
                    <p className="font-display font-bold text-kuska-text">{formatPrice(p.price)}</p>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
