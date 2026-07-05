import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { authOptions } from '@/auth/config'
import { prisma } from '@/lib/prisma'
import { Kusi } from '@/components/ui/Kusi'
import { Badge } from '@/components/ui/Badge'
import { formatPrice, formatDate } from '@/lib/utils'
import { getPlan, levelName } from '@/lib/memberships'
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
    />
  )
}
