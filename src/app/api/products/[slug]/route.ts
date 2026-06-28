import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db/client'

export async function GET(_req: Request, { params }: { params: { slug: string } }) {
  try {
    const products = await prisma.$queryRawUnsafe<Array<{
      id: string; title: string; slug: string; price: number; stock: number
      description: string | null; status: string; cultural_lineage: string | null
      materials: string[]; sale_mode: string; whatsapp_number: string | null; views: number
      artisan_id: string; artisan_name: string; artisan_avatar: string | null
      artisan_bio: string | null; artisan_verified: boolean; artisan_rating: number
      category_name: string; region_name: string | null; created_at: string
    }>>(
      `SELECT p.id, p.title, p.slug, p.price, p.stock, p.description, p.status,
              p."culturalLineage" as cultural_lineage, p.materials, p."saleMode" as sale_mode,
              p."whatsappNumber" as whatsapp_number, p.views,
              ap.id as artisan_id, ap."displayName" as artisan_name,
              ap."avatarUrl" as artisan_avatar, ap.bio as artisan_bio,
              ap."isVerified" as artisan_verified, ap."avgRating" as artisan_rating,
              cat.name as category_name, reg.name as region_name,
              p."createdAt" as created_at
       FROM products p
       JOIN artisan_profiles ap ON ap.id = p."artisanId"
       LEFT JOIN categories cat ON cat.id = p."categoryId"
       LEFT JOIN regions reg ON reg.id = p."regionId"
       WHERE p.slug = $1 AND p.status = 'ACTIVE'
       LIMIT 1`,
      params.slug
    )

    if (!products || products.length === 0) {
      return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 })
    }

    const images = await prisma.$queryRawUnsafe<Array<{ url: string; alt_text: string | null; is_primary: boolean }>>(
      `SELECT url, "altText" as alt_text, "isPrimary" as is_primary
       FROM product_images WHERE "productId" = $1 ORDER BY position ASC`,
      products[0].id
    )

    await prisma.$executeRawUnsafe(
      `UPDATE products SET views = views + 1 WHERE id = $1`, products[0].id
    )

    return NextResponse.json({ data: { ...products[0], images } })
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Error' }, { status: 500 })
  }
}
