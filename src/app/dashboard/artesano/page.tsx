import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { authOptions } from '@/auth/config'
import { prisma } from '@/lib/prisma'
import { Kusi } from '@/components/ui/Kusi'
import { Badge } from '@/components/ui/Badge'
import { formatPrice, formatDate } from '@/lib/utils'
import { getPlan, levelName } from '@/lib/memberships'
import type { SmartCard } from '@/components/dashboard/SmartCards'
import { ArtisanDashboardContent } from './ArtisanDashboardContent'

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

  const profile = await prisma.artisanProfile.findUnique({
    where: { id: artisanId },
    select: { membership_tier: true },
  })
  const plan = getPlan(profile?.membership_tier ?? 'semilla')

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

  // ── Cards inteligentes: señales reales que piden acción hoy ──────────
  const now = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const paidItemsWhere = (range: { gte: Date; lt?: Date }) => ({
    product_id: { in: productIds },
    order: { payment_status: 'pagado', created_at: range },
  })

  const [unreadMessages, pendingShipments, monthItems, prevMonthItems, lowStock, nextWorkshop, topViewed] =
    await Promise.all([
      prisma.message.count({ where: { receiver_id: session.user.id, is_read: false } }),
      productIds.length
        ? prisma.orderItem.count({
            where: {
              product_id: { in: productIds },
              order: { payment_status: 'pagado', tracking_status: { notIn: ['enviado', 'entregado'] } },
            },
          })
        : 0,
      productIds.length
        ? prisma.orderItem.findMany({ where: paidItemsWhere({ gte: monthStart }), select: { price: true, quantity: true } })
        : [],
      productIds.length
        ? prisma.orderItem.findMany({
            where: paidItemsWhere({ gte: prevMonthStart, lt: monthStart }),
            select: { price: true, quantity: true },
          })
        : [],
      prisma.product.count({ where: { artisan_id: artisanId, is_available: true, stock: { lte: 2 } } }),
      prisma.workshop.findFirst({
        where: { artisan_id: artisanId, date: { gte: now } },
        orderBy: { date: 'asc' },
        select: { title: true, date: true },
      }),
      prisma.product.findFirst({
        where: { artisan_id: artisanId, views: { gt: 0 } },
        orderBy: { views: 'desc' },
        select: { name: true, views: true, slug: true },
      }),
    ])

  const revenue = (items: { price: number; quantity: number }[]) =>
    items.reduce((s, i) => s + i.price * i.quantity, 0)
  const monthRevenue = revenue(monthItems)
  const prevRevenue = revenue(prevMonthItems)
  const monthName = new Intl.DateTimeFormat('es-PE', { month: 'long' }).format(now)

  const smartCards: SmartCard[] = []
  if (monthRevenue > 0) {
    const pct = prevRevenue > 0 ? Math.round(((monthRevenue - prevRevenue) / prevRevenue) * 100) : null
    smartCards.push({
      icon: 'chart', accent: 'gold',
      value: formatPrice(monthRevenue),
      label: `Ingresos de ${monthName}`,
      detail: pct !== null ? `${pct >= 0 ? '+' : ''}${pct}% vs mes pasado` : undefined,
      href: '/dashboard/artesano/estadisticas', cta: 'Ver estadísticas',
    })
  }
  if (pendingShipments > 0) {
    smartCards.push({
      icon: 'box', accent: 'red',
      value: String(pendingShipments),
      label: pendingShipments === 1 ? 'pedido pagado esperando envío' : 'pedidos pagados esperando envío',
      href: '/dashboard/artesano/pedidos', cta: 'Atender pedidos',
    })
  }
  if (lowStock > 0) {
    smartCards.push({
      icon: 'palette', accent: 'brown',
      value: String(lowStock),
      label: lowStock === 1 ? 'pieza con stock crítico (≤ 2 unidades)' : 'piezas con stock crítico (≤ 2 unidades)',
      href: '/dashboard/artesano/productos', cta: 'Reponer stock',
    })
  }
  if (unreadMessages > 0) {
    smartCards.push({
      icon: 'chat', accent: 'teal',
      value: String(unreadMessages),
      label: unreadMessages === 1 ? 'mensaje sin leer de un cliente' : 'mensajes sin leer de clientes',
      href: '/dashboard/artesano/mensajes', cta: 'Responder',
    })
  }
  if (nextWorkshop) {
    smartCards.push({
      icon: 'workshop', accent: 'teal',
      value: formatDate(nextWorkshop.date),
      label: `Próximo taller: ${nextWorkshop.title}`,
      href: '/dashboard/artesano/talleres', cta: 'Preparar taller',
    })
  }
  if (topViewed) {
    smartCards.push({
      icon: 'sparkles', accent: 'gold',
      value: `${topViewed.views} vistas`,
      label: `Tu pieza más vista: ${topViewed.name}`,
      href: `/producto/${topViewed.slug}`, cta: 'Ver pieza',
    })
  }

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
    <ArtisanDashboardContent
      user={user}
      plan={plan}
      stats={stats}
      recentOrders={recentOrders}
      badges={badges}
      missions={missions}
      smartCards={smartCards}
    />
  )
}
