import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { authOptions } from '@/auth/config'
import { prisma } from '@/lib/prisma'
import { Kusi } from '@/components/ui/Kusi'
import { Badge } from '@/components/ui/Badge'
import { formatPrice } from '@/lib/utils'

export default async function ClientDashboardHome() {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'cliente') redirect('/login')

  const [user, orderCount, favoriteCount, featured] = await Promise.all([
    prisma.user.findUnique({ where: { id: session.user.id }, select: { name: true, points: true, level: true } }),
    prisma.order.count({ where: { client_id: session.user.id } }),
    prisma.favorite.count({ where: { user_id: session.user.id } }),
    prisma.product.findMany({
      where: { is_available: true },
      orderBy: [{ is_featured: 'desc' }, { created_at: 'desc' }],
      take: 6,
    }),
  ])

  return (
    <div className="p-6 lg:p-10 space-y-8">
      <div className="liquid-glass-dark relative overflow-hidden rounded-glass px-6 py-8 sm:px-10">
        <div className="andean-texture pointer-events-none absolute inset-0 opacity-[0.06]" />
        <div className="relative flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
          <Kusi size="lg" animation="wave" />
          <div>
            <h1 className="font-display text-2xl font-bold text-kuska-cream sm:text-3xl">
              ¡Hola, {user?.name ?? 'amigo'}! ✨
            </h1>
            <p className="mt-1 font-body text-kuska-cream/75">
              Nivel {user?.level ?? 1} · {user?.points ?? 0} puntos · Descubre arte peruano único.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2">
        <Link href="/dashboard/cliente/pedidos" className="rounded-card border border-kuska-border bg-white p-5 transition-transform hover:-translate-y-1">
          <span className="text-2xl">📦</span>
          <p className="mt-2 font-display text-2xl font-bold text-kuska-text">{orderCount}</p>
          <p className="font-nunito text-xs text-kuska-text-mid">Mis pedidos</p>
        </Link>
        <Link href="/dashboard/cliente/favoritos" className="rounded-card border border-kuska-border bg-white p-5 transition-transform hover:-translate-y-1">
          <span className="text-2xl">❤️</span>
          <p className="mt-2 font-display text-2xl font-bold text-kuska-text">{favoriteCount}</p>
          <p className="font-nunito text-xs text-kuska-text-mid">Favoritos</p>
        </Link>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-kuska-text">Recomendado para ti</h2>
          <Link href="/marketplace" className="font-body text-sm font-semibold text-kuska-red">
            Ver marketplace →
          </Link>
        </div>
        <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((p) => (
            <Link
              key={p.id}
              href={`/producto/${p.slug}`}
              className="group overflow-hidden rounded-card border border-kuska-border bg-white transition-transform hover:-translate-y-1"
            >
              <div className="h-40 bg-kuska-cream-dark">
                {p.images[0] && (
                  <Image src={p.images[0]} alt={p.name} width={320} height={160} className="h-full w-full object-cover" />
                )}
              </div>
              <div className="space-y-1.5 p-4">
                {p.is_featured && <Badge variant="new">Destacado</Badge>}
                <p className="font-body font-semibold text-kuska-text group-hover:text-kuska-red">{p.name}</p>
                <p className="font-display font-bold text-kuska-text">{formatPrice(p.price)}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
