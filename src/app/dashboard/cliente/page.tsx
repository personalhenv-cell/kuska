import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/auth/config'
import { prisma } from '@/lib/prisma'
import { getPlan } from '@/lib/memberships'
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

  return (
    <ClientDashboardContent
      user={user}
      plan={plan}
      orderCount={orderCount}
      favoriteCount={favoriteCount}
      featured={featured}
      isEntrepreneur={clientProfile?.is_entrepreneur ?? false}
    />
  )
}
