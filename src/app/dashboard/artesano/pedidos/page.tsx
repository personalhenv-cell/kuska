import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/auth/config'
import { prisma } from '@/lib/prisma'
import { Badge } from '@/components/ui/Badge'
import { Kusi } from '@/components/ui/Kusi'
import { formatPrice, formatDate } from '@/lib/utils'

export default async function ArtisanOrdersPage() {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'artesano' || !session.user.artisan_profile_id) {
    redirect('/login')
  }

  const productIds = (
    await prisma.product.findMany({
      where: { artisan_id: session.user.artisan_profile_id },
      select: { id: true },
    })
  ).map((p) => p.id)

  const items = productIds.length
    ? await prisma.orderItem.findMany({
        where: { product_id: { in: productIds } },
        include: { order: { include: { client: { select: { name: true } } } }, product: { select: { name: true } } },
        orderBy: { order: { created_at: 'desc' } },
      })
    : []

  return (
    <div className="p-6 lg:p-10 space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-kuska-text">Pedidos</h1>
        <p className="mt-1 font-body text-sm text-kuska-text-mid">{items.length} pedidos con tus productos</p>
      </div>

      {items.length === 0 ? (
        <div className="rounded-card border border-dashed border-kuska-border bg-white p-12 text-center">
          <Kusi size="sm" expression="triste" className="mx-auto" />
          <p className="mt-3 font-body text-kuska-text-mid">Todavía no tienes pedidos.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="flex flex-wrap items-center justify-between gap-3 rounded-card border border-kuska-border bg-white p-5">
              <div>
                <p className="font-body font-semibold text-kuska-text">{item.product.name}</p>
                <p className="mt-0.5 font-nunito text-xs text-kuska-text-mid">
                  {item.order.client.name} · {formatDate(item.order.created_at)} · x{item.quantity}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <p className="font-display font-bold text-kuska-text">{formatPrice(item.price * item.quantity)}</p>
                <Badge variant={item.order.status === 'entregado' ? 'verified' : 'technique'}>{item.order.status}</Badge>
                <Badge variant={item.order.payment_status === 'pagado' ? 'verified' : 'new'}>{item.order.payment_status}</Badge>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
