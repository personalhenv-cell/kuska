import { prisma } from '@/lib/prisma'
import { formatPrice } from '@/lib/utils'
import { ToggleAvailableButton } from './ToggleAvailableButton'

export default async function AdminProductosPage() {
  const products = await prisma.product.findMany({
    orderBy: { created_at: 'desc' },
    take: 200,
    include: { artisan: { select: { user: { select: { name: true } } } } },
  })

  return (
    <div className="p-6 lg:p-10">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-kuska-text">Productos</h1>
        <p className="mt-1 font-body text-sm text-kuska-text-mid">{products.length} productos en el marketplace.</p>
      </div>
      <div className="overflow-x-auto rounded-card border border-kuska-border bg-white">
        <table className="w-full text-left">
          <thead className="border-b border-kuska-border bg-kuska-cream/60">
            <tr>
              <th className="px-4 py-3 font-nunito text-xs font-bold uppercase tracking-wide text-kuska-text-mid">Producto</th>
              <th className="px-4 py-3 font-nunito text-xs font-bold uppercase tracking-wide text-kuska-text-mid">Artesano</th>
              <th className="px-4 py-3 font-nunito text-xs font-bold uppercase tracking-wide text-kuska-text-mid">Precio</th>
              <th className="px-4 py-3 font-nunito text-xs font-bold uppercase tracking-wide text-kuska-text-mid">Stock</th>
              <th className="px-4 py-3 font-nunito text-xs font-bold uppercase tracking-wide text-kuska-text-mid">Estado</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b border-kuska-border transition-colors last:border-0 hover:bg-kuska-cream/40">
                <td className="px-4 py-3 font-body text-sm text-kuska-text">{p.name}</td>
                <td className="px-4 py-3 font-body text-sm text-kuska-text-mid">{p.artisan.user.name}</td>
                <td className="px-4 py-3 font-body text-sm text-kuska-text">{formatPrice(p.price)}</td>
                <td className="px-4 py-3 font-body text-sm text-kuska-text-mid">{p.stock}</td>
                <td className="px-4 py-3">
                  <ToggleAvailableButton productId={p.id} isAvailable={p.is_available} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
