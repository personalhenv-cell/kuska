import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { authOptions } from '@/auth/config'
import { prisma } from '@/lib/prisma'
import { Kusi } from '@/components/ui/Kusi'
import { formatPrice } from '@/lib/utils'

export default async function ClientFavoritesPage() {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'cliente') redirect('/login')

  const favorites = await prisma.favorite.findMany({
    where: { user_id: session.user.id },
    include: { product: true },
    orderBy: { created_at: 'desc' },
  })

  return (
    <div className="p-6 lg:p-10 space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-kuska-text">Favoritos</h1>
        <p className="mt-1 font-body text-sm text-kuska-text-mid">{favorites.length} piezas guardadas</p>
      </div>

      {favorites.length === 0 ? (
        <div className="rounded-card border border-dashed border-kuska-border bg-white p-12 text-center">
          <Kusi size="sm" expression="triste" className="mx-auto" />
          <p className="mt-3 font-body text-kuska-text-mid">Aún no has guardado ninguna pieza.</p>
          <Link href="/marketplace" className="mt-4 inline-block font-body text-sm font-semibold text-kuska-red">
            Explorar marketplace →
          </Link>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {favorites.map((f) => (
            <Link
              key={f.id}
              href={`/producto/${f.product.slug}`}
              className="group overflow-hidden rounded-card border border-kuska-border bg-white transition-transform hover:-translate-y-1"
            >
              <div className="h-40 bg-kuska-cream-dark">
                {f.product.images[0] && (
                  <Image src={f.product.images[0]} alt={f.product.name} width={320} height={160} className="h-full w-full object-cover" />
                )}
              </div>
              <div className="space-y-1.5 p-4">
                <p className="font-body font-semibold text-kuska-text group-hover:text-kuska-red">{f.product.name}</p>
                <p className="font-display font-bold text-kuska-text">{formatPrice(f.product.price)}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
