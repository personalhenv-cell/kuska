import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/auth/config'

const schema = z.object({ product_id: z.string() })

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  }

  const body = await req.json().catch(() => null)
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'ID de producto requerido' }, { status: 400 })
  }

  const { product_id } = parsed.data

  // Toggle: si ya existe lo borra, si no existe lo crea
  const existing = await prisma.favorite.findUnique({
    where: { user_id_product_id: { user_id: session.user.id, product_id } },
  })

  if (existing) {
    await prisma.favorite.delete({ where: { id: existing.id } })
    return NextResponse.json({ favorited: false })
  }

  await prisma.favorite.create({
    data: { user_id: session.user.id, product_id },
  })
  return NextResponse.json({ favorited: true })
}

export async function GET(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ favorites: [] })
  }

  const { searchParams } = new URL(req.url)
  const product_id = searchParams.get('product_id')

  if (product_id) {
    const fav = await prisma.favorite.findUnique({
      where: { user_id_product_id: { user_id: session.user.id, product_id } },
    })
    return NextResponse.json({ favorited: Boolean(fav) })
  }

  const favorites = await prisma.favorite.findMany({
    where: { user_id: session.user.id },
    include: {
      product: {
        include: {
          artisan: { select: { user: { select: { name: true } }, region: true } },
          _count: { select: { favorites: true } },
        },
      },
    },
    orderBy: { created_at: 'desc' },
  })

  return NextResponse.json({ favorites })
}
