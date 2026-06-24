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

    const artisan = await prisma.artisanProfile.findUnique({
      where: { userId: session.user.id },
    })
    if (!artisan) return NextResponse.json({ products: [] })

    const products = await prisma.product.findMany({
      where:   { artisanId: artisan.id },
      include: {
        images:        { where: { isPrimary: true } },
        category:      true,
        heritageStory: { select: { id: true } },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ products })
  } catch {
    return NextResponse.json({ error: 'Error al obtener productos' }, { status: 500 })
  }
}
