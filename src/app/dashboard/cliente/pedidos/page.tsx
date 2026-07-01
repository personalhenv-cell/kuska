import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/auth/config'
import { prisma } from '@/lib/prisma'
import { Badge } from '@/components/ui/Badge'
import { formatPrice, formatDate } from '@/lib/utils'

export default async function ClientOrdersPage() {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'cliente') redirect('/login')

  const orders = await prisma.order.findMany({
    where: { client_id: session.user.id },
    include: { items: { include: { product: { select: { name: true, images: true } } } } },
    orderBy: { created_at: 'desc' },
  })

  return (
    <div className="p-6 lg:p-10 space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-kuska-text">Mis pedidos</h1>
        <p className="mt-1 font-body text-sm text-kuska-text-mid">{orders.length} pedidos realizados</p>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-card border border-dashed border-kuska-border bg-white p-12 text-center">
          <span className="text-4xl">📦</span>
          <p className="mt-3 font-body text-kuska-text-mid">Todavía no has hecho ningún pedido.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="rounded-card border border-kuska-border bg-white p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="font-nunito text-xs text-kuska-text-mid">{formatDate(order.created_at)}</p>
                <div className="flex items-center gap-2">
                  <Badge variant={order.status === 'entregado' ? 'verified' : 'technique'}>{order.status}</Badge>
                  <Badge variant={order.payment_status === 'pagado' ? 'verified' : 'new'}>{order.payment_status}</Badge>
                </div>
              </div>
              <ul className="mt-3 space-y-1.5">
                {order.items.map((item) => (
                  <li key={item.id} className="flex items-center justify-between font-body text-sm text-kuska-text">
                    <span>{item.product.name} × {item.quantity}</span>
                    <span className="font-semibold">{formatPrice(item.price * item.quantity)}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-3 border-t border-kuska-border pt-3 text-right font-display font-bold text-kuska-text">
                Total: {formatPrice(order.total)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
