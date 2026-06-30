import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/auth/config'
import { slugify, generateOtp } from '@/lib/utils'

const getSchema = z.object({
  q: z.string().optional(),
  region: z.string().optional(),
  technique: z.string().optional(),
  category: z.string().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(48).default(12),
  featured: z.coerce.boolean().optional(),
})

const postSchema = z.object({
  name: z.string().min(3).max(120),
  description: z.string().min(10),
  price: z.number().positive(),
  stock: z.number().int().min(0).default(1),
  category: z.string().min(2),
  technique: z.string().min(2),
  region: z.string().min(2),
  materials: z.array(z.string()).default([]),
  images: z.array(z.string().url()).default([]),
  is_custom_order: z.boolean().default(false),
})

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const parsed = getSchema.safeParse(Object.fromEntries(searchParams))
  if (!parsed.success) {
    return NextResponse.json({ error: 'Parámetros inválidos' }, { status: 400 })
  }
  const { q, region, technique, category, minPrice, maxPrice, page, limit, featured } =
    parsed.data

  const skip = (page - 1) * limit
  const where = {
    is_available: true,
    ...(q && {
      OR: [
        { name: { contains: q, mode: 'insensitive' as const } },
        { description: { contains: q, mode: 'insensitive' as const } },
        { technique: { contains: q, mode: 'insensitive' as const } },
        { region: { contains: q, mode: 'insensitive' as const } },
      ],
    }),
    ...(region && { region: { contains: region, mode: 'insensitive' as const } }),
    ...(technique && { technique: { contains: technique, mode: 'insensitive' as const } }),
    ...(category && { category: { contains: category, mode: 'insensitive' as const } }),
    ...(minPrice !== undefined && { price: { gte: minPrice } }),
    ...(maxPrice !== undefined && { price: { lte: maxPrice } }),
    ...(featured === true && { is_featured: true }),
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      skip,
      take: limit,
      orderBy: [{ is_boosted: 'desc' }, { is_featured: 'desc' }, { created_at: 'desc' }],
      include: {
        artisan: {
          select: {
            id: true,
            user: { select: { name: true, avatar_url: true } },
            region: true,
            technique: true,
            is_verified: true,
          },
        },
        _count: { select: { favorites: true, reviews: true } },
      },
    }),
    prisma.product.count({ where }),
  ])

  return NextResponse.json({
    products,
    meta: { total, page, limit, pages: Math.ceil(total / limit) },
  })
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'artesano') {
    return NextResponse.json({ error: 'Solo artesanos pueden crear productos' }, { status: 403 })
  }
  if (!session.user.artisan_profile_id) {
    return NextResponse.json({ error: 'Perfil de artesano no encontrado' }, { status: 404 })
  }

  const body = await req.json().catch(() => null)
  const parsed = postSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const { name, ...rest } = parsed.data
  const slug = `${slugify(name)}-${generateOtp().slice(0, 4)}`

  const product = await prisma.product.create({
    data: {
      artisan_id: session.user.artisan_profile_id,
      name,
      slug,
      ...rest,
    },
  })

  return NextResponse.json({ product }, { status: 201 })
}
