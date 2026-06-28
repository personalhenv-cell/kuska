import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import { prisma } from '@/lib/db/client'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

    const [users, artisans, clients, products, active] = await Promise.all([
      prisma.$queryRawUnsafe<Array<{ count: string }>>(`SELECT COUNT(*) as count FROM users`),
      prisma.$queryRawUnsafe<Array<{ count: string }>>(`SELECT COUNT(*) as count FROM artisan_profiles`),
      prisma.$queryRawUnsafe<Array<{ count: string }>>(`SELECT COUNT(*) as count FROM client_profiles`),
      prisma.$queryRawUnsafe<Array<{ count: string }>>(`SELECT COUNT(*) as count FROM products`),
      prisma.$queryRawUnsafe<Array<{ count: string }>>(`SELECT COUNT(*) as count FROM products WHERE status = 'ACTIVE'`),
    ])

    return NextResponse.json({
      data: {
        totalUsers:     parseInt(users[0]?.count ?? '0'),
        totalArtisans:  parseInt(artisans[0]?.count ?? '0'),
        totalClients:   parseInt(clients[0]?.count ?? '0'),
        totalProducts:  parseInt(products[0]?.count ?? '0'),
        activeProducts: parseInt(active[0]?.count ?? '0'),
      }
    })
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Error' }, { status: 500 })
  }
}
