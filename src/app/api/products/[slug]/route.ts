import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  _req: Request,
  { params }: { params: { slug: string } },
) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
    include: {
      artisan: {
        include: {
          user: { select: { name: true, avatar_url: true, phone: true } },
        },
      },
      reviews: {
        include: { reviewer: { select: { name: true, avatar_url: true } } },
        orderBy: { created_at: 'desc' },
        take: 20,
      },
      _count: { select: { favorites: true } },
    },
  })

  if (!product) {
    return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 })
  }

  // Incrementar vistas sin bloquear la respuesta
  prisma.product.update({
    where: { id: product.id },
    data: { views: { increment: 1 } },
  }).catch(() => null)

  return NextResponse.json({ product })
}
