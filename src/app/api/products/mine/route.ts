import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import { prisma } from '@/lib/db/client'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ARTESANO') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const products = await prisma.$queryRawUnsafe<Array<{
      id: string; title: string; slug: string; price: number; stock: number
      status: string; views: number; primary_image: string | null; created_at: string
    }>>(
      `SELECT p.id, p.title, p.slug, p.price, p.stock, p.status, p.views,
              (SELECT url FROM product_images WHERE "productId" = p.id AND "isPrimary" = true LIMIT 1) as primary_image,
              p."createdAt" as created_at
       FROM products p
       JOIN artisan_profiles ap ON ap.id = p."artisanId"
       WHERE ap."userId" = $1
       ORDER BY p."createdAt" DESC`,
      session.user.id
    )

    return NextResponse.json({ data: products })
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Error' }, { status: 500 })
  }
}
