import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/auth/config'
import { prisma } from '@/lib/prisma'
import { getPlan } from '@/lib/memberships'
import { formatDate } from '@/lib/utils'
import type { SmartCard } from '@/components/dashboard/SmartCards'
import { ClientDashboardContent } from './ClientDashboardContent'

export default async function ClientDashboardHome() {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'cliente') redirect('/login')

  const [user, orderCount, favoriteCount, featured, clientProfile] = await Promise.all([
    prisma.user.findUnique({ where: { id: session.user.id }, select: { name: true, points: true, level: true } }),
    prisma.order.count({ where: { client_id: session.user.id } }),
    prisma.favorite.count({ where: { user_id: session.user.id } }),
    prisma.product.findMany({
      where: { is_available: true },
      orderBy: [{ is_featured: 'desc' }, { created_at: 'desc' }],
      take: 6,
    }),
    prisma.clientProfile.findUnique({
      where: { user_id: session.user.id },
      select: { membership_tier: true, is_entrepreneur: true },
    }),
  ])

  const plan = getPlan(clientProfile?.membership_tier ?? 'explorador')

  // ── Cards inteligentes: señales reales del cliente hoy ───────────────
  const now = new Date()
  const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000)

  const [inTransit, unreadMessages, nextEnrollment, favorites] = await Promise.all([
    prisma.order.count({
      where: { client_id: session.user.id, payment_status: 'pagado', tracking_status: { not: 'entregado' } },
    }),
    prisma.message.count({ where: { receiver_id: session.user.id, is_read: false } }),
    prisma.workshopParticipant.findFirst({
      where: { user_id: session.user.id, workshop: { date: { gte: now } } },
      orderBy: { workshop: { date: 'asc' } },
      select: { workshop: { select: { title: true, date: true } } },
    }),
    prisma.favorite.findMany({
      where: { user_id: session.user.id },
      select: { product: { select: { artisan_id: true } } },
    }),
  ])

  const favoriteArtisanIds = [...new Set(favorites.map((f) => f.product.artisan_id))]
  const newFromFavorites = favoriteArtisanIds.length
    ? await prisma.product.count({
        where: { artisan_id: { in: favoriteArtisanIds }, is_available: true, created_at: { gte: twoWeeksAgo } },
      })
    : 0

  const smartCards: SmartCard[] = []
  if (inTransit > 0) {
    smartCards.push({
      icon: 'box', accent: 'red',
      value: String(inTransit),
      label: inTransit === 1 ? 'pedido en camino hacia ti' : 'pedidos en camino hacia ti',
      href: '/dashboard/cliente/pedidos', cta: 'Seguir mis pedidos',
    })
  }
  if (nextEnrollment) {
    smartCards.push({
      icon: 'workshop', accent: 'teal',
      value: formatDate(nextEnrollment.workshop.date),
      label: `Tu próximo taller: ${nextEnrollment.workshop.title}`,
      href: '/dashboard/cliente/talleres', cta: 'Ver mi taller',
    })
  }
  if (unreadMessages > 0) {
    smartCards.push({
      icon: 'chat', accent: 'teal',
      value: String(unreadMessages),
      label: unreadMessages === 1 ? 'mensaje sin leer de un artesano' : 'mensajes sin leer de artesanos',
      href: '/dashboard/cliente/mensajes', cta: 'Leer mensajes',
    })
  }
  if (newFromFavorites > 0) {
    smartCards.push({
      icon: 'heart', accent: 'gold',
      value: String(newFromFavorites),
      label:
        newFromFavorites === 1
          ? 'pieza nueva de tus artesanos favoritos (últimos 14 días)'
          : 'piezas nuevas de tus artesanos favoritos (últimos 14 días)',
      href: '/marketplace', cta: 'Descubrir',
    })
  }

  return (
    <ClientDashboardContent
      user={user}
      plan={plan}
      orderCount={orderCount}
      favoriteCount={favoriteCount}
      featured={featured}
      isEntrepreneur={clientProfile?.is_entrepreneur ?? false}
      smartCards={smartCards}
    />
  )
}
