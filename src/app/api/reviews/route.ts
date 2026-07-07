import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import { authOptions } from '@/auth/config'
import { prisma } from '@/lib/prisma'

const ReviewSchema = z.object({
  product_id: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(5).max(500),
  image_url: z.string().url().optional(),
})

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Debes iniciar sesión para dejar una reseña' }, { status: 401 })
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Cuerpo inválido' }, { status: 400 })
  }
  const parsed = ReviewSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Datos de reseña inválidos' }, { status: 400 })
  }
  const { product_id, rating, comment, image_url } = parsed.data

  // Solo puede reseñar quien realmente compró el producto — evita reseñas
  // falsas y respalda el badge "Compra verificada" que se muestra.
  const purchased = await prisma.orderItem.findFirst({
    where: { product_id, order: { client_id: session.user.id, payment_status: 'pagado' } },
  })
  if (!purchased) {
    return NextResponse.json({ error: 'Solo puedes reseñar productos que hayas comprado' }, { status: 403 })
  }

  const existing = await prisma.review.findFirst({
    where: { product_id, reviewer_id: session.user.id },
  })
  if (existing) {
    return NextResponse.json({ error: 'Ya dejaste una reseña para este producto' }, { status: 409 })
  }

  const review = await prisma.review.create({
    data: {
      product_id,
      reviewer_id: session.user.id,
      rating,
      comment,
      image_url,
      is_verified: true,
    },
  })

  // La calificación mostrada en el marketplace es el promedio real de reseñas.
  const agg = await prisma.review.aggregate({ where: { product_id }, _avg: { rating: true } })
  await prisma.product.update({
    where: { id: product_id },
    data: { rating: agg._avg.rating ?? rating },
  })

  return NextResponse.json({ ok: true, reviewId: review.id }, { status: 201 })
}
