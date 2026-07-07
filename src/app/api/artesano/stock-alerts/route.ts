import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/auth/config'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'artesano' || !session.user.artisan_profile_id) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const lowStockThreshold = 5

  const products = await prisma.product.findMany({
    where: {
      artisan_id: session.user.artisan_profile_id,
      stock: { lte: lowStockThreshold },
    },
    select: {
      id: true,
      name: true,
      slug: true,
      stock: true,
      price: true,
      images: true,
      sales_count: true,
      created_at: true,
    },
    orderBy: { stock: 'asc' },
  })

  // Calcular velocidad de venta (ventas por día)
  const enriched = products.map((p) => {
    const daysSinceCreation = Math.max(1, Math.floor((Date.now() - p.created_at.getTime()) / (1000 * 60 * 60 * 24)))
    const salesPerDay = p.sales_count / daysSinceCreation
    const daysUntilOutOfStock = salesPerDay > 0 ? Math.ceil(p.stock / salesPerDay) : Infinity
    return {
      ...p,
      salesPerDay: Math.round(salesPerDay * 100) / 100,
      daysUntilOutOfStock: daysUntilOutOfStock === Infinity ? null : daysUntilOutOfStock,
    }
  })

  return NextResponse.json({
    lowStockProducts: enriched,
    critical: enriched.filter((p) => p.stock <= 2),
    totalProducts: (await prisma.product.count({ where: { artisan_id: session.user.artisan_profile_id } })),
  })
}
