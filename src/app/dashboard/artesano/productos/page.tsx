import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { authOptions } from '@/auth/config'
import { prisma } from '@/lib/prisma'
import { Badge } from '@/components/ui/Badge'
import { formatPrice } from '@/lib/utils'

export default async function ArtisanProductsPage() {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'artesano' || !session.user.artisan_profile_id) {
    redirect('/login')
  }

  const products = await prisma.product.findMany({
    where: { artisan_id: session.user.artisan_profile_id },
    orderBy: { created_at: 'desc' },
  })

  return (
    <div className="p-6 lg:p-10 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-kuska-text">Mis productos</h1>
          <p className="mt-1 font-body text-sm text-kuska-text-mid">{products.length} productos en tu taller</p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/dashboard/artesano/productos/nuevo"
            className="rounded-btn bg-kuska-teal px-4 py-2.5 font-body text-sm font-bold text-white transition-transform hover:-translate-y-0.5"
          >
            + Nuevo producto
          </Link>
          <Link
            href="/dashboard/artesano/productos/ia-descripcion"
            className="rounded-btn border border-kuska-gold bg-kuska-gold/10 px-4 py-2.5 font-body text-sm font-bold text-[#9a6a07] transition-transform hover:-translate-y-0.5"
          >
            ✨ Descripción con IA
          </Link>
          <Link
            href="/marketplace"
            className="rounded-btn bg-kuska-red px-4 py-2.5 font-body text-sm font-bold text-white transition-transform hover:-translate-y-0.5"
          >
            Ver en marketplace →
          </Link>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="rounded-card border border-dashed border-kuska-border bg-white p-12 text-center">
          <span className="text-4xl">🎨</span>
          <p className="mt-3 font-body text-kuska-text-mid">Aún no has subido productos a tu tienda.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-card border border-kuska-border bg-white">
          <table className="w-full text-left">
            <thead className="border-b border-kuska-border bg-kuska-cream/50">
              <tr>
                <th className="px-5 py-3 font-nunito text-xs font-bold uppercase tracking-wide text-kuska-text-mid">Producto</th>
                <th className="px-5 py-3 font-nunito text-xs font-bold uppercase tracking-wide text-kuska-text-mid">Precio</th>
                <th className="px-5 py-3 font-nunito text-xs font-bold uppercase tracking-wide text-kuska-text-mid">Stock</th>
                <th className="px-5 py-3 font-nunito text-xs font-bold uppercase tracking-wide text-kuska-text-mid">Vistas</th>
                <th className="px-5 py-3 font-nunito text-xs font-bold uppercase tracking-wide text-kuska-text-mid">Ventas</th>
                <th className="px-5 py-3 font-nunito text-xs font-bold uppercase tracking-wide text-kuska-text-mid">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-kuska-border">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-kuska-cream/30">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-11 w-11 flex-shrink-0 overflow-hidden rounded-btn bg-kuska-cream-dark">
                        {p.images[0] && (
                          <Image src={p.images[0]} alt={p.name} width={44} height={44} className="h-full w-full object-cover" />
                        )}
                      </div>
                      <Link href={`/producto/${p.slug}`} className="font-body text-sm font-semibold text-kuska-text hover:text-kuska-red">
                        {p.name}
                      </Link>
                    </div>
                  </td>
                  <td className="px-5 py-3 font-body text-sm text-kuska-text">{formatPrice(p.price)}</td>
                  <td className="px-5 py-3 font-body text-sm text-kuska-text">{p.stock}</td>
                  <td className="px-5 py-3 font-body text-sm text-kuska-text-mid">{p.views}</td>
                  <td className="px-5 py-3 font-body text-sm text-kuska-text-mid">{p.sales_count}</td>
                  <td className="px-5 py-3">
                    <Badge variant={p.is_available ? 'verified' : 'new'}>
                      {p.is_available ? 'Disponible' : 'Pausado'}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
