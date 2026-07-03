import { prisma } from '@/lib/prisma'
import { formatPrice, formatDate } from '@/lib/utils'

export default async function AdminPedidosPage() {
  const orders = await prisma.order.findMany({
    orderBy: { created_at: 'desc' },
    take: 200,
    include: { client: { select: { name: true } }, items: { select: { id: true } } },
  })

  return (
    <div className="p-6 lg:p-10">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-kuska-text">Pedidos</h1>
        <p className="mt-1 font-body text-sm text-kuska-text-mid">{orders.length} pedidos registrados.</p>
      </div>
      <div className="overflow-x-auto rounded-card border border-kuska-border bg-white">
        <table className="w-full text-left">
          <thead className="border-b border-kuska-border bg-kuska-cream/60">
            <tr>
              <th className="px-4 py-3 font-nunito text-xs font-bold uppercase tracking-wide text-kuska-text-mid">Cliente</th>
              <th className="px-4 py-3 font-nunito text-xs font-bold uppercase tracking-wide text-kuska-text-mid">Items</th>
              <th className="px-4 py-3 font-nunito text-xs font-bold uppercase tracking-wide text-kuska-text-mid">Total</th>
              <th className="px-4 py-3 font-nunito text-xs font-bold uppercase tracking-wide text-kuska-text-mid">Pago</th>
              <th className="px-4 py-3 font-nunito text-xs font-bold uppercase tracking-wide text-kuska-text-mid">Estado</th>
              <th className="px-4 py-3 font-nunito text-xs font-bold uppercase tracking-wide text-kuska-text-mid">Fecha</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center font-body text-sm text-kuska-text-mid">
                  Aún no hay pedidos reales en la plataforma.
                </td>
              </tr>
            )}
            {orders.map((o) => (
              <tr key={o.id} className="border-b border-kuska-border last:border-0">
                <td className="px-4 py-3 font-body text-sm text-kuska-text">{o.client.name}</td>
                <td className="px-4 py-3 font-body text-sm text-kuska-text-mid">{o.items.length}</td>
                <td className="px-4 py-3 font-body text-sm text-kuska-text">{formatPrice(o.total)}</td>
                <td className="px-4 py-3 font-body text-sm text-kuska-text-mid">{o.payment_method ?? '—'} · {o.payment_status}</td>
                <td className="px-4 py-3 font-body text-sm text-kuska-text-mid">{o.status}</td>
                <td className="px-4 py-3 font-body text-sm text-kuska-text-mid">{formatDate(o.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
