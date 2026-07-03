import { prisma } from '@/lib/prisma'
import { formatPrice } from '@/lib/utils'

async function getStats() {
  const [artisans, clients, products, orders, revenue, entrepreneurs] = await Promise.all([
    prisma.user.count({ where: { role: 'artesano' } }),
    prisma.user.count({ where: { role: 'cliente' } }),
    prisma.product.count(),
    prisma.order.count(),
    prisma.order.aggregate({ _sum: { total: true }, where: { payment_status: 'pagado' } }),
    prisma.clientProfile.count({ where: { is_entrepreneur: true } }),
  ])
  return {
    artisans,
    clients,
    products,
    orders,
    revenue: revenue._sum.total ?? 0,
    entrepreneurs,
  }
}

export default async function AdminOverviewPage() {
  const stats = await getStats()

  const cards = [
    { label: 'Artesanos', value: stats.artisans, icon: '🎨' },
    { label: 'Clientes', value: stats.clients, icon: '🛍️' },
    { label: 'Emprendedores', value: stats.entrepreneurs, icon: '🚀' },
    { label: 'Productos', value: stats.products, icon: '📦' },
    { label: 'Pedidos', value: stats.orders, icon: '🧾' },
    { label: 'Ingresos (pagados)', value: formatPrice(stats.revenue), icon: '💰' },
  ]

  return (
    <div className="p-6 lg:p-10">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-kuska-text">Panel de administración</h1>
        <p className="mt-1 font-body text-sm text-kuska-text-mid">Estado real de la plataforma Kuska.</p>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {cards.map((c) => (
          <div key={c.label} className="rounded-card border border-kuska-border bg-white p-5">
            <span className="text-2xl">{c.icon}</span>
            <p className="mt-2 font-display text-2xl font-bold text-kuska-text">{c.value}</p>
            <p className="font-nunito text-xs font-bold uppercase tracking-wide text-kuska-text-mid">{c.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
