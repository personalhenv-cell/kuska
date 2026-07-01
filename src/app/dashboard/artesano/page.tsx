import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { authOptions } from '@/auth/config'
import { prisma } from '@/lib/prisma'
import { Kusi } from '@/components/ui/Kusi'
import { Badge } from '@/components/ui/Badge'
import { formatPrice, formatDate } from '@/lib/utils'

export default async function ArtisanDashboardHome() {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'artesano' || !session.user.artisan_profile_id) {
    redirect('/login')
  }

  const artisanId = session.user.artisan_profile_id

  const [productCount, products, badges, missions, user] = await Promise.all([
    prisma.product.count({ where: { artisan_id: artisanId } }),
    prisma.product.findMany({
      where: { artisan_id: artisanId },
      select: { id: true, sales_count: true, rating: true, price: true },
    }),
    prisma.userBadge.findMany({
      where: { user_id: session.user.id },
      include: { badge: true },
      orderBy: { earned_at: 'desc' },
      take: 4,
    }),
    prisma.mission.findMany({
      where: { role: 'artesano' },
      take: 3,
    }),
    prisma.user.findUnique({ where: { id: session.user.id }, select: { name: true, points: true, level: true } }),
  ])

  const productIds = products.map((p) => p.id)
  const recentOrders = productIds.length
    ? await prisma.orderItem.findMany({
        where: { product_id: { in: productIds } },
        include: { order: true, product: { select: { name: true } } },
        orderBy: { order: { created_at: 'desc' } },
        take: 5,
      })
    : []

  const missionProgress = await prisma.missionProgress.findMany({
    where: { user_id: session.user.id, mission_id: { in: missions.map((m) => m.id) } },
  })

  const totalSales = products.reduce((sum, p) => sum + p.sales_count, 0)
  const avgRating = products.length
    ? products.reduce((sum, p) => sum + p.rating, 0) / products.length
    : 0

  const stats = [
    { label: 'Ventas totales', value: totalSales, icon: '🛍️' },
    { label: 'Productos activos', value: productCount, icon: '🎨' },
    { label: 'Pedidos recientes', value: recentOrders.length, icon: '📦' },
    { label: 'Rating promedio', value: avgRating.toFixed(1), icon: '⭐' },
  ]

  return (
    <div className="p-6 lg:p-10 space-y-8">
      {/* Banner de bienvenida */}
      <div className="liquid-glass-dark relative overflow-hidden rounded-glass px-6 py-8 sm:px-10">
        <div className="andean-texture pointer-events-none absolute inset-0 opacity-[0.06]" />
        <div className="relative flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
          <Kusi size="lg" animation="celebrate" />
          <div>
            <h1 className="font-display text-2xl font-bold text-kuska-cream sm:text-3xl">
              ¡Hola, {user?.name ?? 'artesano'}! 🦙
            </h1>
            <p className="mt-1 font-body text-kuska-cream/75">
              Nivel {user?.level ?? 1} · {user?.points ?? 0} puntos · Aquí está el resumen de tu taller.
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-card border border-kuska-border bg-white p-5">
            <span className="text-2xl">{s.icon}</span>
            <p className="mt-2 font-display text-2xl font-bold text-kuska-text">{s.value}</p>
            <p className="font-nunito text-xs text-kuska-text-mid">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        {/* Pedidos recientes */}
        <div className="rounded-card border border-kuska-border bg-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-bold text-kuska-text">Pedidos recientes</h2>
            <Link href="/dashboard/artesano/pedidos" className="font-body text-sm font-semibold text-kuska-red">
              Ver todos →
            </Link>
          </div>
          {recentOrders.length === 0 ? (
            <p className="mt-6 font-body text-sm text-kuska-text-mid">
              Aún no tienes pedidos. ¡Comparte tu tienda para tu primera venta!
            </p>
          ) : (
            <ul className="mt-4 divide-y divide-kuska-border">
              {recentOrders.map((item) => (
                <li key={item.id} className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-body text-sm font-semibold text-kuska-text">{item.product.name}</p>
                    <p className="font-nunito text-xs text-kuska-text-mid">
                      {formatDate(item.order.created_at)} · x{item.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-display text-sm font-bold text-kuska-text">{formatPrice(item.price * item.quantity)}</p>
                    <Badge variant={item.order.status === 'entregado' ? 'verified' : 'technique'}>
                      {item.order.status}
                    </Badge>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Gamificación */}
        <div className="space-y-6">
          <div className="rounded-card border border-kuska-border bg-white p-6">
            <h2 className="font-display text-lg font-bold text-kuska-text">Insignias</h2>
            {badges.length === 0 ? (
              <p className="mt-3 font-body text-sm text-kuska-text-mid">Completa misiones para ganar tus primeras insignias.</p>
            ) : (
              <div className="mt-4 flex flex-wrap gap-3">
                {badges.map((ub) => (
                  <div key={ub.id} className="flex flex-col items-center gap-1 w-16" title={ub.badge.description}>
                    <span className="text-3xl">{ub.badge.icon}</span>
                    <span className="text-center font-nunito text-[10px] text-kuska-text-mid leading-tight">{ub.badge.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-card border border-kuska-border bg-white p-6">
            <h2 className="font-display text-lg font-bold text-kuska-text">Misiones activas</h2>
            <div className="mt-4 space-y-4">
              {missions.map((m) => {
                const progress = missionProgress.find((p) => p.mission_id === m.id)
                const pct = Math.min(100, ((progress?.current ?? 0) / m.target) * 100)
                return (
                  <div key={m.id}>
                    <div className="flex items-center justify-between font-body text-sm">
                      <span className="text-kuska-text">{m.title}</span>
                      <span className="font-nunito text-xs text-kuska-gold font-bold">+{m.points} pts</span>
                    </div>
                    <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-kuska-cream-dark">
                      <div className="h-full rounded-full bg-kuska-teal transition-all" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                )
              })}
              {missions.length === 0 && (
                <p className="font-body text-sm text-kuska-text-mid">No hay misiones activas por ahora.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
