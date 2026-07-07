'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Kusi } from '@/components/ui/Kusi'
import { Badge } from '@/components/ui/Badge'
import { ModuleGrid, type ModuleCard } from '@/components/dashboard/ModuleGrid'
import { SmartCards, type SmartCard } from '@/components/dashboard/SmartCards'
import { StockAlerts } from '@/components/dashboard/StockAlerts'
import { formatPrice, formatDate, timeGreeting } from '@/lib/utils'
import { levelName, DEMO_UNLOCK_ALL_PLANS } from '@/lib/memberships'

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
  smartCards: SmartCard[]
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
  smartCards,
}: DashboardContentProps) {
  const planId = plan?.id ?? 'semilla'
  // Chip informativo del plan requerido — el módulo sigue siendo clickeable
  // (cada página muestra su propio MembershipGate con la opción de mejorar).
  // En modo demo todo está desbloqueado, así que no se muestran chips.
  const proChip = !DEMO_UNLOCK_ALL_PLANS && planId === 'semilla' ? 'Plan Pro' : undefined
  const maestroChip = !DEMO_UNLOCK_ALL_PLANS && planId !== 'maestro' ? 'Plan Maestro' : undefined

  const modules: ModuleCard[] = [
    { href: '/dashboard/artesano/productos', icon: 'palette', title: 'Mis productos', desc: 'Publica y gestiona tus piezas sin límite, con catálogo PDF.' },
    { href: '/dashboard/artesano/pedidos', icon: 'box', title: 'Pedidos', desc: 'Tus ventas y el estado de cada envío.' },
    { href: '/dashboard/artesano/estadisticas', icon: 'chart', title: 'Estadísticas', desc: 'Ingresos, tendencias y tus piezas más vendidas.' },
    { href: '/dashboard/artesano/cfo-bot', icon: 'bot', title: 'CFO-Bot', desc: 'Tu asesor financiero personal, entrenado para tu oficio.', ia: true, chip: maestroChip },
    { href: '/dashboard/artesano/match-ia', icon: 'link', title: 'Match IA', desc: 'Conecta con emprendedores que buscan exactamente tu arte.', ia: true, chip: maestroChip },
    { href: '/dashboard/artesano/productos/ia-descripcion', icon: 'sparkles', title: 'Descripciones IA', desc: 'Descripciones de producto que venden, en segundos.', ia: true, chip: proChip },
    { href: '/dashboard/artesano/raices', icon: 'tree', title: 'Raíces', desc: 'Tu historia, tu genealogía artesanal y tu taller.', chip: proChip },
    { href: '/dashboard/artesano/academia', icon: 'academy', title: 'Academia', desc: 'Lecciones para hacer crecer tu negocio artesanal.', chip: proChip },
    { href: '/dashboard/artesano/talleres', icon: 'workshop', title: 'Mis talleres', desc: 'Dicta talleres en vivo y genera ingresos extra.' },
    { href: '/dashboard/artesano/ferias', icon: 'tent', title: 'Ferias Digitales', desc: 'Tu stand virtual en ferias de todo el país.' },
    { href: '/dashboard/artesano/agrupacion', icon: 'users', title: 'Red Agrupación', desc: 'Organiza ferias físicas junto a otros artesanos.' },
    { href: '/dashboard/artesano/comunidad', icon: 'megaphone', title: 'Red Cuéntame', desc: 'Comparte tu día a día con la comunidad Kuska.' },
    { href: '/dashboard/artesano/capitalizacion', icon: 'wallet', title: 'Capitalización', desc: 'Fondos y convocatorias abiertas para tu taller.', chip: maestroChip },
    { href: '/dashboard/artesano/mensajes', icon: 'chat', title: 'Mensajes', desc: 'Chatea en tiempo real con tus clientes.' },
    { href: '/dashboard/artesano/perfil', icon: 'user', title: 'Mi perfil', desc: 'Tu perfil público, con QR compartible para ferias.' },
  ]

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
              ¡{timeGreeting()}, {user?.name?.split(' ')[0] ?? 'artesano'}! 🦙
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

      {/* Cards inteligentes — señales reales que piden acción hoy */}
      {smartCards.length > 0 && (
        <motion.div variants={itemVariants}>
          <SmartCards cards={smartCards} />
        </motion.div>
      )}

      {/* Alertas de stock bajo — señal urgente para reponer productos */}
      <motion.div variants={itemVariants}>
        <StockAlerts />
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

      {/* Todos los módulos del artesano — visible en cualquier pantalla */}
      <motion.div variants={itemVariants}>
        <ModuleGrid
          title="Tus módulos"
          subtitle={`Plan ${plan?.name ?? 'Artesano Semilla'}`}
          modules={modules}
        />
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
