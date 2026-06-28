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

    const ap = await prisma.$queryRawUnsafe<Array<{
      id: string; total_sales: number; avg_rating: number
      score: number; tier: string; sales_count: number
    }>>(
      `SELECT ap.id, ap."totalSales" as total_sales, ap."avgRating" as avg_rating,
              COALESCE(cs.score, 0) as score, COALESCE(cs.tier, 'BRONCE') as tier,
              COALESCE(cs."salesCount", 0) as sales_count
       FROM artisan_profiles ap
       LEFT JOIN credit_scores cs ON cs."artisanId" = ap.id
       WHERE ap."userId" = $1 LIMIT 1`,
      session.user.id
    )

    if (!ap || ap.length === 0) return NextResponse.json({ error: 'Perfil no encontrado' }, { status: 404 })

    const productCounts = await prisma.$queryRawUnsafe<Array<{ status: string; count: string }>>(
      `SELECT status, COUNT(*) as count FROM products WHERE "artisanId" = $1 GROUP BY status`,
      ap[0].id
    )

    const revenue = await prisma.$queryRawUnsafe<Array<{ total: number }>>(
      `SELECT COALESCE(SUM(amount), 0) as total FROM financial_records
       WHERE "artisanId" = $1 AND type = 'INGRESO'`,
      ap[0].id
    )

    const counts = Object.fromEntries(productCounts.map(r => [r.status, parseInt(r.count)]))
    const totalProducts  = Object.values(counts).reduce((a, b) => a + b, 0)
    const activeProducts = counts['ACTIVE'] ?? 0

    return NextResponse.json({
      data: {
        totalProducts,
        activeProducts,
        totalSales:   ap[0].total_sales,
        totalRevenue: Number(revenue[0]?.total ?? 0),
        avgRating:    ap[0].avg_rating,
        creditScore:  ap[0].score,
        creditTier:   ap[0].tier,
      }
    })
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Error' }, { status: 500 })
  }
}
