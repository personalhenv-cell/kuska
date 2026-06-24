import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import { prisma } from '@/lib/db/client'
import { z } from 'zod'

const createSchema = z.object({
  title:          z.string().min(3).max(200),
  description:    z.string().optional(),
  price:          z.number().positive(),
  stock:          z.number().int().min(1).default(1),
  categoryId:     z.string(),
  culturalLineage: z.string().optional(),
  materials:      z.array(z.string()).optional(),
  saleMode:       z.enum(['PLATFORM', 'WHATSAPP']).default('PLATFORM'),
  whatsappNumber: z.string().optional(),
  images:         z.array(z.string()).optional(),
})

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ARTESANO') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const body = await req.json()
    const data = createSchema.parse(body)

    const artisan = await prisma.artisanProfile.findUnique({
      where: { userId: session.user.id },
    })
    if (!artisan) {
      return NextResponse.json({ error: 'Perfil de artesano no encontrado' }, { status: 404 })
    }

    // Generar slug único
    const slug = `${data.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}-${Date.now()}`

    const product = await prisma.product.create({
      data: {
        artisanId:      artisan.id,
        categoryId:     data.categoryId,
        title:          data.title,
        slug,
        description:    data.description,
        price:          data.price,
        stock:          data.stock,
        culturalLineage: data.culturalLineage,
        materials:      data.materials || [],
        saleMode:       data.saleMode,
        whatsappNumber: data.whatsappNumber,
        status:         'PENDING_REVIEW',
        images: data.images?.length ? {
          create: data.images.map((url, i) => ({
            url, isPrimary: i === 0, position: i,
          })),
        } : undefined,
      },
      include: { images: true, category: true },
    })

    return NextResponse.json({ success: true, product })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 422 })
    }
    return NextResponse.json({ error: 'Error al crear producto' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const query    = searchParams.get('q')     || ''
    const region   = searchParams.get('region') || ''
    const rubro    = searchParams.get('rubro')  || ''
    const page     = parseInt(searchParams.get('page') || '1')
    const limit    = 12

    const where: any = { status: 'ACTIVE' }
    if (query)  where.OR = [
      { title:          { contains: query, mode: 'insensitive' } },
      { culturalLineage: { contains: query, mode: 'insensitive' } },
      { description:    { contains: query, mode: 'insensitive' } },
    ]
    if (region) where.region = { name: region }
    if (rubro)  where.category = { name: rubro }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          images:         { where: { isPrimary: true } },
          artisan:        { select: { displayName: true, region: true, avgRating: true } },
          category:       true,
          heritageStory:  { select: { id: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip:  (page - 1) * limit,
        take:  limit,
      }),
      prisma.product.count({ where }),
    ])

    return NextResponse.json({
      products,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    })
  } catch {
    return NextResponse.json({ error: 'Error al obtener productos' }, { status: 500 })
  }
}
