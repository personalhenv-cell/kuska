import dynamic from 'next/dynamic'
import { prisma } from '@/lib/prisma'
import { formatPrice, formatDate } from '@/lib/utils'

const AdminOverviewContent = dynamic(() => import('./AdminOverviewContent').then((m) => m.AdminOverviewContent), {
  ssr: false,
})

async function getStats() {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)

  const [artisans, clients, products, orders, revenue, entrepreneurs, paidOrders, topProducts, topArtisans] =
    await Promise.all([
      prisma.user.count({ where: { role: 'artesano' } }),
      prisma.user.count({ where: { role: 'cliente' } }),
      prisma.product.count(),
      prisma.order.count(),
      prisma.order.aggregate({ _sum: { total: true }, where: { payment_status: 'pagado' } }),
      prisma.clientProfile.count({ where: { is_entrepreneur: true } }),
      prisma.order.findMany({
        where: { payment_status: 'pagado', created_at: { gte: thirtyDaysAgo } },
        select: { total: true, created_at: true },
        orderBy: { created_at: 'asc' },
      }),
      prisma.product.findMany({
        orderBy: { sales_count: 'desc' },
        take: 5,
        select: { name: true, sales_count: true },
      }),
      prisma.artisanProfile.findMany({
        orderBy: { total_sales: 'desc' },
        take: 5,
        select: { total_sales: true, user: { select: { name: true } } },
      }),
    ])

  const revenueByDate = new Map<string, number>()
  for (const o of paidOrders) {
    const key = formatDate(o.created_at)
    revenueByDate.set(key, (revenueByDate.get(key) ?? 0) + o.total)
  }

  return {
    artisans,
    clients,
    products,
    orders,
    revenue: revenue._sum.total ?? 0,
    entrepreneurs,
    revenueTrend: Array.from(revenueByDate.entries()).map(([date, total]) => ({ date, total })),
    topProducts: topProducts.map((p) => ({ name: p.name, sales: p.sales_count })),
    topArtisans: topArtisans.map((a) => ({ name: a.user.name, sales: a.total_sales })),
  }
}

export default async function AdminOverviewPage() {
  const stats = await getStats()

  const cards = [
    { label: 'Artesanos', value: stats.artisans, icon: 'palette' as const },
    { label: 'Clientes', value: stats.clients, icon: 'users' as const },
    { label: 'Emprendedores', value: stats.entrepreneurs, icon: 'rocket' as const },
    { label: 'Productos', value: stats.products, icon: 'box' as const },
    { label: 'Pedidos', value: stats.orders, icon: 'receipt' as const },
    { label: 'Ingresos (pagados)', value: formatPrice(stats.revenue), icon: 'wallet' as const },
  ]

  return (
    <AdminOverviewContent
      cards={cards}
      revenueTrend={stats.revenueTrend}
      topProducts={stats.topProducts}
      topArtisans={stats.topArtisans}
    />
  )
}
