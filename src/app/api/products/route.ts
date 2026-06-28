import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import { prisma } from '@/lib/db/client'
import { z } from 'zod'

const createSchema = z.object({
  title:          z.string().min(3).max(120),
  description:    z.string().max(2000).optional(),
  price:          z.number().positive(),
  stock:          z.number().int().min(0).default(1),
  categoryId:     z.string(),
  regionId:       z.string().optional(),
  culturalLineage:z.string().max(200).optional(),
  materials:      z.array(z.string()).default([]),
  saleMode:       z.enum(['WHATSAPP', 'PLATFORM']).default('PLATFORM'),
  whatsappNumber: z.string().optional(),
})

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const page      = parseInt(searchParams.get('page') ?? '1')
    const pageSize  = Math.min(parseInt(searchParams.get('pageSize') ?? '20'), 50)
    const category  = searchParams.get('category')
    const region    = searchParams.get('region')
    const q         = searchParams.get('q')
    const offset    = (page - 1) * pageSize

    let where = `p.status = 'ACTIVE'`
    const params: unknown[] = []
    let paramIdx = 1

    if (category) { where += ` AND c.slug = $${paramIdx++}`; params.push(category) }
    if (region)   { where += ` AND r.code = $${paramIdx++}`; params.push(region) }
    if (q)        { where += ` AND (p.title ILIKE $${paramIdx} OR p.description ILIKE $${paramIdx})`; params.push(`%${q}%`); paramIdx++ }

    const limitIdx  = paramIdx
    const offsetIdx = paramIdx + 1
    params.push(pageSize, offset)

    const products = await prisma.$queryRawUnsafe<Array<{
      id: string; title: string; slug: string; price: number; stock: number
      artisan_name: string; artisan_avatar: string | null; is_verified: boolean
      primary_image: string | null; avg_rating: number; category_name: string
      region_name: string | null
    }>>(
      `SELECT p.id, p.title, p.slug, p.price, p.stock,
              ap."displayName" as artisan_name, ap."avatarUrl" as artisan_avatar, ap."isVerified" as is_verified,
              (SELECT url FROM product_images WHERE "productId" = p.id AND "isPrimary" = true LIMIT 1) as primary_image,
              ap."avgRating" as avg_rating,
              cat.name as category_name,
              reg.name as region_name
       FROM products p
       JOIN artisan_profiles ap ON ap.id = p."artisanId"
       LEFT JOIN categories cat ON cat.id = p."categoryId"
       LEFT JOIN regions reg ON reg.id = p."regionId"
       ${category ? 'JOIN categories c ON c.id = p."categoryId"' : ''}
       ${region   ? 'JOIN regions r ON r.id = p."regionId"' : ''}
       WHERE ${where}
       ORDER BY p."createdAt" DESC
       LIMIT $${limitIdx} OFFSET $${offsetIdx}`,
      ...params
    )

    const countRow = await prisma.$queryRawUnsafe<Array<{ count: string }>>(
      `SELECT COUNT(*) as count FROM products p
       ${category ? 'JOIN categories c ON c.id = p."categoryId"' : ''}
       ${region   ? 'JOIN regions r ON r.id = p."regionId"' : ''}
       WHERE ${where}`,
      ...params.slice(0, params.length - 2)
    )
    const total = parseInt(countRow[0]?.count ?? '0')

    return NextResponse.json({ data: products, total, page, pageSize, hasMore: offset + products.length < total })
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Error' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ARTESANO') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const data = createSchema.parse(await req.json())

    const ap = await prisma.$queryRawUnsafe<Array<{ id: string }>>(
      `SELECT id FROM artisan_profiles WHERE "userId" = $1 LIMIT 1`, session.user.id
    )
    if (!ap || ap.length === 0) return NextResponse.json({ error: 'Perfil artesano no encontrado' }, { status: 404 })

    const slug = `${data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now()}`

    await prisma.$executeRawUnsafe(
      `INSERT INTO products (id, "artisanId", "categoryId", "regionId", title, slug, description, price, stock, status, "culturalLineage", materials, "saleMode", "whatsappNumber", views, "createdAt", "updatedAt")
       VALUES (gen_random_uuid()::text, $1, $2, $3, $4, $5, $6, $7, $8, 'DRAFT', $9, $10::text[], $11, $12, 0, NOW(), NOW())`,
      ap[0].id, data.categoryId, data.regionId ?? null, data.title, slug,
      data.description ?? null, data.price, data.stock,
      data.culturalLineage ?? null, `{${data.materials.join(',')}}`,
      data.saleMode, data.whatsappNumber ?? null
    )

    const product = await prisma.$queryRawUnsafe<Array<{ id: string; slug: string }>>(
      `SELECT id, slug FROM products WHERE slug = $1 LIMIT 1`, slug
    )

    return NextResponse.json({ message: 'Producto creado', product: product[0] }, { status: 201 })
  } catch (err) {
    const msg = err instanceof z.ZodError ? err.errors[0]?.message : err instanceof Error ? err.message : 'Error'
    return NextResponse.json({ error: msg }, { status: 400 })
  }
}
