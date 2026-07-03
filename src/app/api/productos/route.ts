import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import { authOptions } from '@/auth/config'
import { prisma } from '@/lib/prisma'
import { slugify } from '@/lib/utils'

const CreateProductSchema = z.object({
  name: z.string().min(2).max(120),
  description: z.string().min(10).max(2000),
  price: z.number().min(1).max(50000),
  stock: z.number().int().min(0).max(9999),
  category: z.string().min(2).max(60),
  technique: z.string().min(2).max(60),
  region: z.string().min(2).max(60),
  materials: z.array(z.string().min(1)).max(10).default([]),
  images: z.array(z.string().url()).min(1).max(8),
})

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'artesano' || !session.user.artisan_profile_id) {
    return NextResponse.json({ error: 'Debes iniciar sesión como artesano' }, { status: 401 })
  }

  const body = await req.json().catch(() => null)
  const parsed = CreateProductSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }
  const data = parsed.data

  const slug = `${slugify(data.name)}-${Math.random().toString(36).slice(2, 7)}`

  const product = await prisma.product.create({
    data: {
      artisan_id: session.user.artisan_profile_id,
      name: data.name,
      slug,
      description: data.description,
      price: data.price,
      stock: data.stock,
      category: data.category,
      technique: data.technique,
      region: data.region,
      materials: data.materials,
      images: data.images,
    },
  })

  return NextResponse.json({ ok: true, product }, { status: 201 })
}
