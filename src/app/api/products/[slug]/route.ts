import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/client'

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const product = await prisma.product.findFirst({
      where: {
        OR: [{ slug: params.slug }, { id: params.slug }],
        status: 'ACTIVE',
      },
      include: {
        images:        true,
        category:      true,
        artisan:       { include: { region: true } },
        heritageStory: { include: { media: true } },
        reviews: {
          include: { client: { select: { displayName: true } } },
          orderBy: { createdAt: 'desc' },
          take:    5,
        },
      },
    })

    if (!product) {
      return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 })
    }

    await prisma.product.update({
      where: { id: product.id },
      data:  { views: { increment: 1 } },
    })

    return NextResponse.json({ product })
  } catch {
    return NextResponse.json({ error: 'Error al obtener producto' }, { status: 500 })
  }
}
