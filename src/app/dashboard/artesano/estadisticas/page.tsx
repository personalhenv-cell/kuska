import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import dynamic from 'next/dynamic'
import { authOptions } from '@/auth/config'
import { prisma } from '@/lib/prisma'
import { formatDate } from '@/lib/utils'

const SalesLineChart = dynamic(() => import('./SalesCharts').then((m) => m.SalesLineChart), { ssr: false })
const TopProductsBarChart = dynamic(() => import('./SalesCharts').then((m) => m.TopProductsBarChart), { ssr: false })

export default async function ArtisanStatsPage() {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'artesano' || !session.user.artisan_profile_id) {
    redirect('/login')
  }

  const artisanId = session.user.artisan_profile_id

  const products = await prisma.product.findMany({
    where: { artisan_id: artisanId },
    select: { id: true, name: true, sales_count: true },
  })
  const productIds = products.map((p) => p.id)

  const items = productIds.length
    ? await prisma.orderItem.findMany({
        where: { product_id: { in: productIds } },
        include: { order: { select: { created_at: true } } },
      })
    : []

  const salesByDate = new Map<string, number>()
  for (const item of items) {
    const key = formatDate(item.order.created_at)
    salesByDate.set(key, (salesByDate.get(key) ?? 0) + item.price * item.quantity)
  }
  const salesData = Array.from(salesByDate.entries()).map(([date, total]) => ({ date, total }))

  const topProducts = [...products]
    .sort((a, b) => b.sales_count - a.sales_count)
    .slice(0, 5)
    .map((p) => ({ name: p.name, sales: p.sales_count }))

  return (
    <div className="p-6 lg:p-10 space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-kuska-text">Estadísticas</h1>
        <p className="mt-1 font-body text-sm text-kuska-text-mid">El rendimiento de tu taller en Kuska</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-card border border-kuska-border bg-white p-6">
          <h2 className="font-display text-lg font-bold text-kuska-text">Ventas en el tiempo</h2>
          {salesData.length === 0 ? (
            <p className="mt-6 font-body text-sm text-kuska-text-mid">Aún no hay ventas para graficar.</p>
          ) : (
            <div className="mt-4">
              <SalesLineChart data={salesData} />
            </div>
          )}
        </div>

        <div className="rounded-card border border-kuska-border bg-white p-6">
          <h2 className="font-display text-lg font-bold text-kuska-text">Productos más vendidos</h2>
          {topProducts.every((p) => p.sales === 0) ? (
            <p className="mt-6 font-body text-sm text-kuska-text-mid">Aún no hay ventas registradas.</p>
          ) : (
            <div className="mt-4">
              <TopProductsBarChart data={topProducts} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
